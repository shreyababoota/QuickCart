// Centralized sample data + helpers (dummy API layer lives in services/api.js)

export const categories = [
  { id: "electronics", name: "Electronics", emoji: "📱" },
  { id: "fashion", name: "Fashion", emoji: "👗" },
  { id: "home-kitchen", name: "Home & Kitchen", emoji: "🏠" },
  { id: "grocery", name: "Grocery & Essentials", emoji: "🛒" },
  { id: "beauty", name: "Beauty & Personal Care", emoji: "💄" },
  { id: "books", name: "Books", emoji: "📚" },
  { id: "sports", name: "Sports & Fitness", emoji: "⚽" },
  { id: "toys", name: "Toys & Games", emoji: "🎮" },
  { id: "automotive", name: "Automotive", emoji: "🚗" },
  { id: "pets", name: "Pet Supplies", emoji: "🐾" },
];

const today = new Date();
const addDays = (n) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

const marketplaceCatalog = {
  electronics: [
    { name: "Ultra HD 55-inch Smart TV", emoji: "", brand: "Apex", price: 35999, mrp: 42999, rating: 4.7, reviews: 1240, unit: "1 unit", description: "4K smart TV with Dolby Audio and voice controls.", gradient: "from-sky-100 to-blue-100" },
    { name: "Galaxy X Pro Smartphone", emoji: "", brand: "Nova", price: 54999, mrp: 62999, rating: 4.8, reviews: 1840, unit: "1 unit", description: "Flagship phone with 120Hz AMOLED and pro camera mode.", gradient: "from-cyan-100 to-slate-100" },
    { name: "SwiftBook Pro Laptop", emoji: "", brand: "Swift", price: 78999, mrp: 89999, rating: 4.6, reviews: 980, unit: "1 unit", description: "Thin laptop with 16GB RAM and all-day battery life.", gradient: "from-indigo-100 to-slate-100" },
    { name: "AirFit Pro Headphones", emoji: "", brand: "BeatX", price: 3999, mrp: 4999, rating: 4.5, reviews: 780, unit: "1 pair", description: "Noise cancelling over-ear headphones with rich bass.", gradient: "from-purple-100 to-violet-100" },
    { name: "AeroTab 11 Tablet", emoji: "", brand: "Aero", price: 26999, mrp: 31999, rating: 4.4, reviews: 540, unit: "1 unit", description: "Lightweight tablet for work, study and entertainment.", gradient: "from-emerald-100 to-green-100" },
    { name: "Pulse Watch 6", emoji: "", brand: "Pulse", price: 12999, mrp: 15999, rating: 4.6, reviews: 720, unit: "1 unit", description: "Smartwatch with heart-rate tracking and GPS support.", gradient: "from-orange-100 to-amber-100" },
    { name: "AuraCam 4K Camera", emoji: "", brand: "Aura", price: 32999, mrp: 38999, rating: 4.7, reviews: 410, unit: "1 unit", description: "Compact mirrorless camera with 4K video and autofocus.", gradient: "from-pink-100 to-rose-100" },
    { name: "GameSphere Console", emoji: "", brand: "GameSphere", price: 42999, mrp: 47999, rating: 4.8, reviews: 1120, unit: "1 unit", description: "Latest-gen gaming console for multiplayer instant play.", gradient: "from-fuchsia-100 to-pink-100" },
    { name: "PowerDock USB Hub", emoji: "", brand: "Volt", price: 1999, mrp: 2599, rating: 4.3, reviews: 310, unit: "1 pack", description: "Connect your laptop, phone and accessories with one dock.", gradient: "from-yellow-100 to-amber-100" },
    { name: "EchoBeam Smart Speaker", emoji: "", brand: "EchoBeam", price: 6999, mrp: 8999, rating: 4.4, reviews: 640, unit: "1 unit", description: "Voice-controlled speaker with room-filling sound.", gradient: "from-sky-100 to-cyan-100" },
    { name: "ChargeMate Wireless Charger", emoji: "", brand: "ChargeMate", price: 2499, mrp: 3299, rating: 4.2, reviews: 280, unit: "1 unit", description: "Fast wireless charging pad with anti-slip grip.", gradient: "from-emerald-100 to-teal-100" },
    { name: "LiteDrive SSD 1TB", emoji: "", brand: "LiteDrive", price: 8999, mrp: 10999, rating: 4.8, reviews: 880, unit: "1 unit", description: "High-speed SSD for gaming, editing and backup storage.", gradient: "from-zinc-100 to-slate-100" },
  ],
  fashion: [
    { name: "AeroFlex Men Jacket", emoji: "", brand: "AeroFlex", price: 3499, mrp: 4499, rating: 4.6, reviews: 610, unit: "1 piece", description: "Lightweight layered jacket with weather-proof shell.", gradient: "from-blue-100 to-slate-100" },
    { name: "Urban Chic Women Kurta", emoji: "", brand: "UrbanChic", price: 2499, mrp: 3299, rating: 4.5, reviews: 540, unit: "1 piece", description: "Soft cotton kurta with modern minimalist styling.", gradient: "from-pink-100 to-rose-100" },
    { name: "PlayTime Kids Hoodie", emoji: "", brand: "PlayTime", price: 1499, mrp: 1999, rating: 4.3, reviews: 320, unit: "1 piece", description: "Comfort-fit hoodie designed for active kids.", gradient: "from-yellow-100 to-amber-100" },
    { name: "GlideRun Sneakers", emoji: "", brand: "GlideRun", price: 2999, mrp: 3899, rating: 4.7, reviews: 760, unit: "1 pair", description: "Breathable sneakers with cushioned sole and flex support.", gradient: "from-lime-100 to-green-100" },
    { name: "Classic Leather Watch", emoji: "⌚", brand: "Timex", price: 6599, mrp: 7999, rating: 4.6, reviews: 430, unit: "1 unit", description: "Premium leather strap watch with minimalist dial.", gradient: "from-amber-100 to-orange-100" },
    { name: "Voyager Travel Bag", emoji: "", brand: "Voyager", price: 2599, mrp: 3299, rating: 4.4, reviews: 380, unit: "1 unit", description: "Spacious carry-on bag with water-resistant finish.", gradient: "from-stone-100 to-zinc-100" },
    { name: "Luna Pearl Pendant", emoji: "", brand: "Luna", price: 1899, mrp: 2399, rating: 4.5, reviews: 260, unit: "1 piece", description: "Elegant pearl pendant with lightweight design.", gradient: "from-violet-100 to-purple-100" },
    { name: "Metro Formal Shirt", emoji: "", brand: "Metro", price: 1799, mrp: 2299, rating: 4.3, reviews: 290, unit: "1 piece", description: "Easy-care formal shirt with stretch comfort.", gradient: "from-slate-100 to-gray-100" },
    { name: "SunGlow Sunglasses", emoji: "", brand: "SunGlow", price: 2299, mrp: 2799, rating: 4.4, reviews: 310, unit: "1 pair", description: "UV-protected eyewear with bold contemporary frame.", gradient: "from-cyan-100 to-sky-100" },
    { name: "EcoSoft Winter Scarf", emoji: "", brand: "EcoSoft", price: 999, mrp: 1299, rating: 4.2, reviews: 190, unit: "1 piece", description: "Soft knit scarf for chilly evenings and travel days.", gradient: "from-red-100 to-rose-100" },
    { name: "FlexFit Joggers", emoji: "", brand: "FlexFit", price: 1299, mrp: 1699, rating: 4.6, reviews: 360, unit: "1 pair", description: "Performance joggers crafted for relaxed movement.", gradient: "from-lime-100 to-emerald-100" },
    { name: "Bella Women Handbag", emoji: "", brand: "Bella", price: 3199, mrp: 3899, rating: 4.7, reviews: 420, unit: "1 unit", description: "Stylish handbag with multiple compartments and premium finish.", gradient: "from-rose-100 to-pink-100" },
  ],
};

export const products = Object.entries(marketplaceCatalog).flatMap(([category, items], groupIndex) =>
  items.map((item, index) => ({
    id: `${category}-${index + 1}`,
    name: item.name,
    emoji: item.emoji,
    category,
    price: item.price,
    mrp: item.mrp,
    rating: item.rating,
    reviews: item.reviews,
    expiryDate: addDays((groupIndex + index) % 7 + 2),
    stock: 20 + ((groupIndex * 7 + index) % 40),
    unit: item.unit,
    brand: item.brand,
    description: item.description,
    gradient: item.gradient,
    trending: index % 3 === 0,
    featured: index % 4 === 0,
  }))
);

export const discountPercent = (p) =>
  p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;

export const daysUntil = (iso) => {
  const d = new Date(iso);
  const diff = Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return diff;
};

export const formatINR = (n) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

export const nearExpiry = (within = 7) =>
  products.filter((p) => daysUntil(p.expiryDate) <= within && daysUntil(p.expiryDate) >= 0);

export const lowStock = (threshold = 20) => products.filter((p) => p.stock < threshold);

export const suggestedDiscount = (iso) => {
  const d = daysUntil(iso);
  if (d <= 1) return 50;
  if (d <= 3) return 35;
  if (d <= 5) return 25;
  return 15;
};

// ---- Orders ----
export const orders = [
  { id: "ORD-1042", customer: "Aarav Sharma", date: addDays(-1), total: 411, status: "Delivered", items: [{ name: "Fresh Bananas", emoji: "", qty: 2, price: 45 }, { name: "Farm Milk", emoji: "", qty: 1, price: 56 }, { name: "Almonds", emoji: "", qty: 1, price: 320 - 55 }] },
  { id: "ORD-1041", customer: "Priya Patel", date: addDays(-2), total: 240, status: "Dispatched", items: [{ name: "Strawberries", emoji: "", qty: 1, price: 150 }, { name: "Greek Yogurt", emoji: "", qty: 1, price: 70 }, { name: "Tomatoes", emoji: "", qty: 1, price: 25 }] },
  { id: "ORD-1040", customer: "Rohan Mehta", date: addDays(-3), total: 320, status: "Approved", items: [{ name: "Dark Chocolate", emoji: "", qty: 2, price: 120 }, { name: "Green Tea", emoji: "", qty: 1, price: 80 }] },
  { id: "ORD-1039", customer: "Sneha Reddy", date: addDays(-4), total: 159, status: "Pending", items: [{ name: "Orange Juice", emoji: "", qty: 1, price: 99 }, { name: "Brown Bread", emoji: "", qty: 1, price: 40 }, { name: "Hand Wash", emoji: "", qty: 1, price: 20 }] },
  { id: "ORD-1038", customer: "Vikram Singh", date: addDays(-6), total: 90, status: "Cancelled", items: [{ name: "Paneer", emoji: "", qty: 1, price: 90 }] },
  { id: "ORD-1037", customer: "Aarav Sharma", date: addDays(-9), total: 290, status: "Delivered", items: [{ name: "Potato Chips", emoji: "", qty: 3, price: 20 }, { name: "Sparkling Water", emoji: "", qty: 2, price: 60 }, { name: "Dish Soap", emoji: "", qty: 1, price: 110 }] },
];

// ---- Customers ----
export const customers = [
  { id: "c1", name: "Aarav Sharma", email: "aarav@example.com", phone: "+91 98765 43210", orders: 12, spent: 8420 },
  { id: "c2", name: "Priya Patel", email: "priya@example.com", phone: "+91 99887 66554", orders: 8, spent: 5210 },
  { id: "c3", name: "Rohan Mehta", email: "rohan@example.com", phone: "+91 97654 32109", orders: 5, spent: 3120 },
  { id: "c4", name: "Sneha Reddy", email: "sneha@example.com", phone: "+91 90123 45678", orders: 15, spent: 11240 },
  { id: "c5", name: "Vikram Singh", email: "vikram@example.com", phone: "+91 91234 56789", orders: 3, spent: 1480 },
  { id: "c6", name: "Ananya Iyer", email: "ananya@example.com", phone: "+91 93456 78901", orders: 9, spent: 6730 },
];

export const salesTrend = [
  { label: "Mon", sales: 24, revenue: 14200 },
  { label: "Tue", sales: 31, revenue: 18900 },
  { label: "Wed", sales: 28, revenue: 16400 },
  { label: "Thu", sales: 42, revenue: 25100 },
  { label: "Fri", sales: 39, revenue: 23700 },
  { label: "Sat", sales: 55, revenue: 33800 },
  { label: "Sun", sales: 48, revenue: 29600 },
];

export const wasteTrend = [
  { label: "Jan", waste: 42, saved: 120 },
  { label: "Feb", waste: 38, saved: 145 },
  { label: "Mar", waste: 31, saved: 168 },
  { label: "Apr", waste: 26, saved: 190 },
  { label: "May", waste: 19, saved: 224 },
  { label: "Jun", waste: 14, saved: 268 },
];
