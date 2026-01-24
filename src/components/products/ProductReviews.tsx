import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ThumbsUp, CheckCircle, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Review, Product } from '@/types';

const reviewSchema = z.object({
  userName: z.string().trim().min(2, 'Name is required').max(50, 'Max 50 characters'),
  title: z.string().trim().min(3, 'Title is required').max(100, 'Max 100 characters'),
  text: z.string().trim().min(10, 'Review must be at least 10 characters').max(500, 'Max 500 characters'),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ProductReviewsProps {
  product: Product;
}

// Mock initial reviews data
const getMockReviews = (productId: string): Review[] => [
  {
    id: '1',
    productId,
    userName: 'Sarah M.',
    rating: 5,
    title: 'Absolutely love these shoes!',
    text: 'These are the most comfortable shoes I have ever owned. The quality is outstanding and they look even better in person. Highly recommend!',
    date: '2024-01-15',
    verified: true,
  },
  {
    id: '2',
    productId,
    userName: 'James L.',
    rating: 4,
    title: 'Great quality, runs slightly small',
    text: 'Beautiful design and excellent craftsmanship. My only suggestion is to go half a size up as they run a bit small. Otherwise perfect!',
    date: '2024-01-10',
    verified: true,
  },
  {
    id: '3',
    productId,
    userName: 'Emily R.',
    rating: 5,
    title: 'Perfect for everyday wear',
    text: 'I wear these almost every day and they still look brand new. So versatile and comfortable. Worth every penny!',
    date: '2024-01-05',
    verified: false,
  },
];

export const ProductReviews = ({ product }: ProductReviewsProps) => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>(() => getMockReviews(product.id));
  const [showForm, setShowForm] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      userName: '',
      title: '',
      text: '',
    },
  });

  // Calculate rating distribution
  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100,
  }));

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : product.rating;

  const onSubmit = (data: ReviewFormData) => {
    const newReview: Review = {
      id: Date.now().toString(),
      productId: product.id,
      userName: data.userName,
      rating: selectedRating,
      title: data.title,
      text: data.text,
      date: new Date().toISOString().split('T')[0],
      verified: false,
    };

    setReviews([newReview, ...reviews]);
    form.reset();
    setShowForm(false);
    setSelectedRating(5);

    toast({
      title: 'Review submitted!',
      description: 'Thank you for sharing your feedback.',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section className="mt-16 pt-12 border-t border-border">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Rating Summary */}
        <div className="lg:w-80 shrink-0">
          <h2 className="font-display text-2xl font-bold mb-6">Customer Reviews</h2>

          <div className="flex items-center gap-4 mb-6">
            <div className="text-center">
              <p className="font-display text-5xl font-bold text-accent">
                {averageRating.toFixed(1)}
              </p>
              <div className="flex items-center justify-center gap-1 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(averageRating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {reviews.length} reviews
              </p>
            </div>

            <div className="flex-1 space-y-2">
              {ratingCounts.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm w-3">{rating}</span>
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  <Progress value={percentage} className="h-2 flex-1" />
                  <span className="text-sm text-muted-foreground w-6">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={() => setShowForm(!showForm)}
            className="w-full"
            variant={showForm ? 'outline' : 'default'}
          >
            {showForm ? 'Cancel' : 'Write a Review'}
          </Button>
        </div>

        {/* Reviews List */}
        <div className="flex-1">
          {/* Review Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-card rounded-2xl p-6 mb-8 shadow-brand-sm">
                  <h3 className="font-display text-xl font-semibold mb-4">Write Your Review</h3>

                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Star Rating */}
                    <div>
                      <Label className="mb-2 block">Your Rating</Label>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onMouseEnter={() => setHoverRating(i + 1)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setSelectedRating(i + 1)}
                            className="p-1 transition-transform hover:scale-110"
                          >
                            <Star
                              className={`h-8 w-8 transition-colors ${
                                i < (hoverRating || selectedRating)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-muted-foreground/30'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="userName">Your Name</Label>
                      <Input
                        id="userName"
                        placeholder="John D."
                        {...form.register('userName')}
                        className="mt-1"
                      />
                      {form.formState.errors.userName && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.userName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="title">Review Title</Label>
                      <Input
                        id="title"
                        placeholder="Summarize your experience"
                        {...form.register('title')}
                        className="mt-1"
                      />
                      {form.formState.errors.title && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.title.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="text">Your Review</Label>
                      <Textarea
                        id="text"
                        placeholder="Share your thoughts about this product..."
                        rows={4}
                        {...form.register('text')}
                        className="mt-1"
                      />
                      {form.formState.errors.text && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.text.message}
                        </p>
                      )}
                    </div>

                    <Button type="submit" className="w-full">
                      Submit Review
                    </Button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reviews */}
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-xl p-6 shadow-brand-sm"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{review.userName}</p>
                        {review.verified && (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                            <CheckCircle className="h-3 w-3" />
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{formatDate(review.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <h4 className="font-semibold mb-2">{review.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{review.text}</p>

                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                  <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ThumbsUp className="h-4 w-4" />
                    Helpful
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {reviews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No reviews yet. Be the first to review!</p>
              <Button onClick={() => setShowForm(true)}>Write a Review</Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
