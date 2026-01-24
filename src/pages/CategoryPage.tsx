import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { getProductsByCategory } from '@/data/products';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';

const categoryInfo: Record<string, { title: string; description: string; image: string }> = {
  men: {
    title: "Men's Collection",
    description: "Discover our premium range of footwear designed for the modern man",
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1200',
  },
  women: {
    title: "Women's Collection",
    description: "Elegant and comfortable shoes for every occasion",
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1200',
  },
  sneakers: {
    title: 'Sneakers',
    description: 'Street-ready sneakers with bold designs and premium comfort',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1200',
  },
  sports: {
    title: 'Sports Collection',
    description: 'Performance-focused footwear for athletes and fitness enthusiasts',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200',
  },
  casual: {
    title: 'Casual Collection',
    description: 'Everyday comfort meets timeless style',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1200',
  },
};

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = slug || 'all';
  const products = getProductsByCategory(category);
  const info = categoryInfo[category] || {
    title: 'All Products',
    description: 'Browse our complete collection',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200',
  };

  return (
    <div className="pt-20 lg:pt-24 pb-16 min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-64 lg:h-96 overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
          src={info.image}
          alt={info.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white"
            >
              <Link
                to="/shop"
                className="inline-flex items-center gap-1 text-white/80 hover:text-white mb-4 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Shop
              </Link>
              <h1 className="font-display text-4xl lg:text-6xl font-bold mb-4">{info.title}</h1>
              <p className="text-lg text-white/80 max-w-2xl">{info.description}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <p className="text-muted-foreground mb-8">
          {products.length} product{products.length !== 1 ? 's' : ''} found
        </p>

        {products.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard product={product} index={index} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground mb-4">No products found in this category.</p>
            <Button asChild>
              <Link to="/shop">Browse All Products</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
