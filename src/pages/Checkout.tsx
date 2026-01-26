import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, CreditCard, Truck, CheckCircle, Lock, ShoppingBag } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/store/useStore';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const shippingSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(50, 'Max 50 characters'),
  lastName: z.string().trim().min(1, 'Last name is required').max(50, 'Max 50 characters'),
  email: z.string().trim().email('Invalid email address').max(255, 'Max 255 characters'),
  phone: z.string().trim().min(10, 'Valid phone number required').max(20, 'Max 20 characters'),
  address: z.string().trim().min(5, 'Address is required').max(200, 'Max 200 characters'),
  city: z.string().trim().min(2, 'City is required').max(100, 'Max 100 characters'),
  state: z.string().trim().min(2, 'State is required').max(100, 'Max 100 characters'),
  zipCode: z.string().trim().min(5, 'Valid ZIP code required').max(10, 'Max 10 characters'),
  country: z.string().trim().min(2, 'Country is required').max(100, 'Max 100 characters'),
});

const paymentSchema = z.object({
  cardNumber: z.string().trim().min(16, 'Valid card number required').max(19, 'Invalid card number'),
  cardName: z.string().trim().min(2, 'Cardholder name is required').max(100, 'Max 100 characters'),
  expiry: z.string().trim().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Format: MM/YY'),
  cvv: z.string().trim().min(3, 'CVV is required').max(4, 'Invalid CVV'),
});

type ShippingFormData = z.infer<typeof shippingSchema>;
type PaymentFormData = z.infer<typeof paymentSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cart, cartTotal, clearCart } = useStore();
  const { user } = useAuth();
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const shippingForm = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
    },
  });

  const paymentForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: '',
      cardName: '',
      expiry: '',
      cvv: '',
    },
  });

  const subtotal = cartTotal();
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const onShippingSubmit = (data: ShippingFormData) => {
    setShippingData(data);
    setStep('payment');
  };

  const onPaymentSubmit = async () => {
    if (!shippingData) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Generate order number
    const mockOrderNumber = `STR-${Date.now().toString(36).toUpperCase()}`;
    
    const orderItems = cart.map(item => ({
      product: {
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        images: item.product.images,
      },
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }));

    // Save order to database if user is logged in
    if (user) {
      const { error } = await supabase.from('orders').insert({
        user_id: user.id,
        order_number: mockOrderNumber,
        status: 'processing',
        items: orderItems,
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total,
        shipping_address: {
          firstName: shippingData.firstName,
          lastName: shippingData.lastName,
          address: shippingData.address,
          city: shippingData.city,
          state: shippingData.state,
          zipCode: shippingData.zipCode,
          country: shippingData.country,
        },
      });

      if (error) {
        console.error('Failed to save order:', error);
      }
    }

    // Send order confirmation email
    try {
      const { error: emailError } = await supabase.functions.invoke('send-order-confirmation', {
        body: {
          email: shippingData.email,
          orderNumber: mockOrderNumber,
          customerName: `${shippingData.firstName} ${shippingData.lastName}`,
          items: orderItems,
          subtotal,
          shipping,
          tax,
          total,
          shippingAddress: {
            firstName: shippingData.firstName,
            lastName: shippingData.lastName,
            address: shippingData.address,
            city: shippingData.city,
            state: shippingData.state,
            zipCode: shippingData.zipCode,
            country: shippingData.country,
          },
        },
      });

      if (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }
    } catch (err) {
      console.error('Email sending error:', err);
    }
    
    setOrderNumber(mockOrderNumber);
    clearCart();
    setStep('confirmation');
    setIsProcessing(false);
    
    toast({
      title: 'Order Placed Successfully!',
      description: `Your order ${mockOrderNumber} has been confirmed. A confirmation email has been sent.`,
    });
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  if (cart.length === 0 && step !== 'confirmation') {
    return (
      <div className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-4 lg:px-8 text-center py-20">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Add some products before checking out.</p>
          <Button asChild>
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Cart
          </Link>
          <h1 className="font-display text-3xl lg:text-4xl font-bold">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {['shipping', 'payment', 'confirmation'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  step === s
                    ? 'bg-accent text-white'
                    : i < ['shipping', 'payment', 'confirmation'].indexOf(step)
                    ? 'bg-green-500 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {i < ['shipping', 'payment', 'confirmation'].indexOf(step) ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  i + 1
                )}
              </div>
              <span className="hidden sm:inline text-sm font-medium capitalize">{s}</span>
              {i < 2 && <div className="w-8 lg:w-16 h-0.5 bg-border" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Shipping Step */}
              {step === 'shipping' && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-card rounded-2xl p-6 lg:p-8 shadow-brand-sm"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Truck className="h-6 w-6 text-accent" />
                    <h2 className="font-display text-xl font-semibold">Shipping Address</h2>
                  </div>

                  <form onSubmit={shippingForm.handleSubmit(onShippingSubmit)} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          {...shippingForm.register('firstName')}
                          className="mt-1"
                        />
                        {shippingForm.formState.errors.firstName && (
                          <p className="text-sm text-destructive mt-1">
                            {shippingForm.formState.errors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          {...shippingForm.register('lastName')}
                          className="mt-1"
                        />
                        {shippingForm.formState.errors.lastName && (
                          <p className="text-sm text-destructive mt-1">
                            {shippingForm.formState.errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          {...shippingForm.register('email')}
                          className="mt-1"
                        />
                        {shippingForm.formState.errors.email && (
                          <p className="text-sm text-destructive mt-1">
                            {shippingForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          {...shippingForm.register('phone')}
                          className="mt-1"
                        />
                        {shippingForm.formState.errors.phone && (
                          <p className="text-sm text-destructive mt-1">
                            {shippingForm.formState.errors.phone.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        {...shippingForm.register('address')}
                        className="mt-1"
                      />
                      {shippingForm.formState.errors.address && (
                        <p className="text-sm text-destructive mt-1">
                          {shippingForm.formState.errors.address.message}
                        </p>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          {...shippingForm.register('city')}
                          className="mt-1"
                        />
                        {shippingForm.formState.errors.city && (
                          <p className="text-sm text-destructive mt-1">
                            {shippingForm.formState.errors.city.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          {...shippingForm.register('state')}
                          className="mt-1"
                        />
                        {shippingForm.formState.errors.state && (
                          <p className="text-sm text-destructive mt-1">
                            {shippingForm.formState.errors.state.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          {...shippingForm.register('zipCode')}
                          className="mt-1"
                        />
                        {shippingForm.formState.errors.zipCode && (
                          <p className="text-sm text-destructive mt-1">
                            {shippingForm.formState.errors.zipCode.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        {...shippingForm.register('country')}
                        className="mt-1"
                      />
                      {shippingForm.formState.errors.country && (
                        <p className="text-sm text-destructive mt-1">
                          {shippingForm.formState.errors.country.message}
                        </p>
                      )}
                    </div>

                    <Button type="submit" className="w-full mt-6" size="lg">
                      Continue to Payment
                    </Button>
                  </form>
                </motion.div>
              )}

              {/* Payment Step */}
              {step === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-card rounded-2xl p-6 lg:p-8 shadow-brand-sm"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="h-6 w-6 text-accent" />
                    <h2 className="font-display text-xl font-semibold">Payment Details</h2>
                  </div>

                  {/* Shipping Summary */}
                  {shippingData && (
                    <div className="bg-secondary/50 rounded-xl p-4 mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Shipping to:</span>
                        <button
                          onClick={() => setStep('shipping')}
                          className="text-sm text-accent hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {shippingData.firstName} {shippingData.lastName}
                        <br />
                        {shippingData.address}
                        <br />
                        {shippingData.city}, {shippingData.state} {shippingData.zipCode}
                      </p>
                    </div>
                  )}

                  <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        {...paymentForm.register('cardNumber')}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value);
                          paymentForm.setValue('cardNumber', formatted);
                        }}
                        maxLength={19}
                        className="mt-1"
                      />
                      {paymentForm.formState.errors.cardNumber && (
                        <p className="text-sm text-destructive mt-1">
                          {paymentForm.formState.errors.cardNumber.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        {...paymentForm.register('cardName')}
                        className="mt-1"
                      />
                      {paymentForm.formState.errors.cardName && (
                        <p className="text-sm text-destructive mt-1">
                          {paymentForm.formState.errors.cardName.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          {...paymentForm.register('expiry')}
                          maxLength={5}
                          className="mt-1"
                        />
                        {paymentForm.formState.errors.expiry && (
                          <p className="text-sm text-destructive mt-1">
                            {paymentForm.formState.errors.expiry.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          type="password"
                          {...paymentForm.register('cvv')}
                          maxLength={4}
                          className="mt-1"
                        />
                        {paymentForm.formState.errors.cvv && (
                          <p className="text-sm text-destructive mt-1">
                            {paymentForm.formState.errors.cvv.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                      <Lock className="h-4 w-4" />
                      <span>Your payment information is secure and encrypted</span>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep('shipping')}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1"
                        size="lg"
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <motion.span
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            Processing...
                          </motion.span>
                        ) : (
                          `Pay $${total.toFixed(2)}`
                        )}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Confirmation Step */}
              {step === 'confirmation' && (
                <motion.div
                  key="confirmation"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-card rounded-2xl p-8 lg:p-12 shadow-brand-sm text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="h-20 w-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle className="h-10 w-10 text-white" />
                  </motion.div>

                  <h2 className="font-display text-2xl lg:text-3xl font-bold mb-4">
                    Order Confirmed!
                  </h2>
                  <p className="text-muted-foreground mb-2">
                    Thank you for your purchase. Your order has been placed successfully.
                  </p>
                  <p className="font-medium text-lg mb-6">
                    Order Number: <span className="text-accent">{orderNumber}</span>
                  </p>

                  {shippingData && (
                    <div className="bg-secondary/50 rounded-xl p-6 mb-8 text-left max-w-md mx-auto">
                      <h3 className="font-semibold mb-3">Shipping Details</h3>
                      <p className="text-sm text-muted-foreground">
                        {shippingData.firstName} {shippingData.lastName}
                        <br />
                        {shippingData.address}
                        <br />
                        {shippingData.city}, {shippingData.state} {shippingData.zipCode}
                        <br />
                        {shippingData.country}
                      </p>
                      <Separator className="my-4" />
                      <p className="text-sm">
                        <span className="text-muted-foreground">Email:</span> {shippingData.email}
                        <br />
                        <span className="text-muted-foreground">Phone:</span> {shippingData.phone}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild>
                      <Link to="/shop">Continue Shopping</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/">Back to Home</Link>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          {step !== 'confirmation' && (
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl p-6 shadow-brand-sm sticky top-24">
                <h2 className="font-display text-xl font-semibold mb-4">Order Summary</h2>

                <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
                  {cart.map((item) => (
                    <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Size: {item.size} • {item.color}
                        </p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-sm">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between font-display font-bold text-lg">
                  <span>Total</span>
                  <span className="text-accent">${total.toFixed(2)}</span>
                </div>

                {shipping === 0 && (
                  <p className="text-xs text-green-600 mt-2">
                    🎉 You qualify for free shipping!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
