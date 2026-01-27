import { motion } from 'framer-motion';
import { Users, Award, Globe, Heart } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Award,
      title: 'Quality First',
      description: 'We source only the finest materials and partner with trusted manufacturers to deliver footwear that lasts.',
    },
    {
      icon: Users,
      title: 'Customer Focused',
      description: 'Every decision we make starts with our customers. Your comfort and satisfaction drive everything we do.',
    },
    {
      icon: Globe,
      title: 'Sustainable Practices',
      description: 'We are committed to reducing our environmental footprint through eco-friendly materials and ethical production.',
    },
    {
      icon: Heart,
      title: 'Passion for Style',
      description: 'Our design team stays ahead of trends to bring you footwear that looks as good as it feels.',
    },
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
            About Stride
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Born from a passion for exceptional footwear, Stride has been crafting 
            premium shoes since 2015. We believe that the right pair of shoes can 
            transform not just your outfit, but your entire day.
          </p>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 gap-12 items-center mb-20"
        >
          <div>
            <h2 className="font-display text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-muted-foreground mb-4">
              What started as a small workshop in downtown New York has grown into 
              a beloved brand trusted by thousands of customers worldwide. Our founder, 
              Sarah Mitchell, began Stride with a simple mission: create shoes that 
              people actually want to wear every day.
            </p>
            <p className="text-muted-foreground">
              Today, we continue that legacy by combining traditional craftsmanship 
              with modern design. Every pair of Stride shoes goes through rigorous 
              quality checks to ensure they meet our exacting standards.
            </p>
          </div>
          <div className="bg-gradient-to-br from-accent/20 to-primary/10 rounded-2xl aspect-square flex items-center justify-center">
            <span className="font-display text-6xl font-bold text-accent">STRIDE</span>
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-display text-3xl font-bold text-center mb-12">
            Our Values
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-card rounded-xl border border-border p-6 text-center"
              >
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 bg-accent/5 rounded-2xl p-8 md:p-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="font-display text-4xl font-bold text-accent">50K+</p>
              <p className="text-muted-foreground mt-1">Happy Customers</p>
            </div>
            <div>
              <p className="font-display text-4xl font-bold text-accent">200+</p>
              <p className="text-muted-foreground mt-1">Shoe Styles</p>
            </div>
            <div>
              <p className="font-display text-4xl font-bold text-accent">25</p>
              <p className="text-muted-foreground mt-1">Countries</p>
            </div>
            <div>
              <p className="font-display text-4xl font-bold text-accent">9</p>
              <p className="text-muted-foreground mt-1">Years of Excellence</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
