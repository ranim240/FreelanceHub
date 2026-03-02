export interface Review {
  author: string;
  initials: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  _id: string;
  badge: string;
  category: string;
  title: string;
  author: string;
  authorInitials: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  version: string;
  lastUpdate: string;
  license: string;
  description: string;
  techStack: string[];
  features: string[];
  customerReviews: Review[];
  purchased: boolean;
  featured: boolean;
}