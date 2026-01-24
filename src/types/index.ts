export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: 'men' | 'women' | 'sneakers' | 'sports' | 'casual';
  images: string[];
  sizes: number[];
  colors: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  featured?: boolean;
  new?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: number;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  product: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}
