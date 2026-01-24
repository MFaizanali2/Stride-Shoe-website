import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RefreshCw, Star, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { getFeaturedProducts } from '@/data/products';
import { testimonials } from '@/data/testimonials';
import { useRef } from 'react';

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over $100',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: '100% secure transactions',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description: '30-day return policy',
  },
];

const categories = [
  { name: 'Men', image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600', path: '/category/men' },
  { name: 'Women', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600', path: '/category/women' },
  { name: 'Sneakers', image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600', path: '/category/sneakers' },
  { name: 'Sports', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600', path: '/category/sports' },
];

const Index = () => {
  const featuredProducts = getFeaturedProducts();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center gradient-hero overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-accent blur-3xl" />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container mx-auto px-4 lg:px-8 pt-24 lg:pt-0">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-primary-foreground"
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6"
              >
                New Collection 2024
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="font-display text-5xl lg:text-7xl font-bold leading-tight mb-6"
              >
                Step Into
                <span className="block text-accent">Excellence</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-lg lg:text-xl text-primary-foreground/80 mb-8 max-w-lg"
              >
                Discover premium footwear designed for those who demand performance, comfort, and style. Every step matters.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-14 px-8 text-lg gap-2 group"
                  asChild
                >
                  <Link to="/shop">
                    Shop Collection
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 h-14 px-8 text-lg"
                  asChild
                >
                  <Link to="/category/sneakers">Explore Sneakers</Link>
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-primary-foreground/20"
              >
                <div>
                  <p className="font-display text-3xl lg:text-4xl font-bold text-accent">50K+</p>
                  <p className="text-primary-foreground/70">Happy Customers</p>
                </div>
                <div>
                  <p className="font-display text-3xl lg:text-4xl font-bold text-accent">200+</p>
                  <p className="text-primary-foreground/70">Shoe Designs</p>
                </div>
                <div>
                  <p className="font-display text-3xl lg:text-4xl font-bold text-accent">4.9</p>
                  <p className="text-primary-foreground/70">Average Rating</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotate: -5 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                <motion.img
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"
                  alt="Featured Shoe"
                  className="w-full max-w-lg mx-auto drop-shadow-2xl animate-float"
                  style={{ transform: 'rotate(-15deg)' }}
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: 'spring' }}
                  className="absolute -bottom-4 -right-4 bg-accent text-accent-foreground rounded-full px-6 py-3 font-display font-bold text-lg shadow-glow"
                >
                  From $99
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-primary-foreground/50"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Bar */}
      <section className="py-8 bg-card border-y border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 justify-center"
              >
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-display font-semibold">{feature.title}</p>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl lg:text-5xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find the perfect pair for every occasion
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={category.path} className="group block relative overflow-hidden rounded-2xl aspect-[3/4]">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-display text-2xl lg:text-3xl font-bold text-white mb-2">
                      {category.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-white/80 group-hover:text-accent transition-colors">
                      Shop Now
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12"
          >
            <div>
              <h2 className="font-display text-3xl lg:text-5xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground text-lg">Our most popular picks</p>
            </div>
            <Button variant="outline" size="lg" asChild>
              <Link to="/shop" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl gradient-hero p-8 lg:p-16"
          >
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
              <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-accent blur-3xl" />
            </div>

            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
              <div className="text-primary-foreground">
                <h2 className="font-display text-3xl lg:text-5xl font-bold mb-4">
                  Get 20% Off Your First Order
                </h2>
                <p className="text-primary-foreground/80 text-lg mb-6">
                  Sign up for our newsletter and receive exclusive offers, early access to new releases, and style tips.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 h-14 px-6 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <Button size="lg" className="h-14 px-8 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                    Subscribe
                  </Button>
                </div>
              </div>

              <motion.img
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                src="https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600"
                alt="Premium Shoes"
                className="hidden lg:block w-full max-w-md mx-auto rounded-2xl shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Preview */}
      <section className="py-16 lg:py-24 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl lg:text-5xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-muted-foreground text-lg">Join thousands of satisfied Stride customers</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-brand-sm hover:shadow-brand-md transition-shadow"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-foreground/80 mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.product}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Button variant="outline" size="lg" asChild>
              <Link to="/testimonials" className="gap-2">
                Read All Reviews
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
