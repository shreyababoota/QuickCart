// // Centralized sample data + helpers (dummy API layer lives in services/api.ts)

// export type Product = {
//   id: string;
//   name: string;
//   emoji: string;
//   category: string;
//   price: number;
//   mrp: number;
//   rating: number;
//   reviews: number;
//   expiryDate: string; // ISO date
//   stock: number;
//   unit: string;
//   description: string;
//   gradient: string;
//   trending?: boolean;
//   featured?: boolean;
// };

// export const categories = [
//   { id: "electronics", name: "Electronics", emoji: "📱" },
//   { id: "fashion", name: "Fashion", emoji: "👕" },
//   { id: "home-kitchen", name: "Home & Kitchen", emoji: "🏡" },
//   { id: "grocery", name: "Grocery & Essentials", emoji: "🥑" },
//   { id: "beauty", name: "Beauty & Personal Care", emoji: "🧴" },
//   { id: "books", name: "Books", emoji: "📚" },
//   { id: "sports", name: "Sports & Fitness", emoji: "🏋️" },
//   { id: "toys", name: "Toys & Games", emoji: "🧸" },
//   { id: "automotive", name: "Automotive", emoji: "🚗" },
//   { id: "pets", name: "Pet Supplies", emoji: "🐶" },
// ];

// const today = new Date();
// const addDays = (n: number) => {
//   const d = new Date(today);
//   d.setDate(d.getDate() + n);
//   return d.toISOString().slice(0, 10);
// };

// const marketplaceCatalog = {
//   electronics: [
//     { name: "Ultra HD 55-inch Smart TV", emoji: "📺", brand: "Apex", price: 35999, mrp: 42999, rating: 4.7, reviews: 1240, unit: "1 unit", description: "4K smart TV with Dolby Audio and voice controls.", gradient: "from-sky-100 to-blue-100" },
//     { name: "Galaxy X Pro Smartphone", emoji: "📱", brand: "Nova", price: 54999, mrp: 62999, rating: 4.8, reviews: 1840, unit: "1 unit", description: "Flagship phone with 120Hz AMOLED and pro camera mode.", gradient: "from-cyan-100 to-slate-100" },
//     { name: "SwiftBook Pro Laptop", emoji: "💻", brand: "Swift", price: 78999, mrp: 89999, rating: 4.6, reviews: 980, unit: "1 unit", description: "Thin laptop with 16GB RAM and all-day battery life.", gradient: "from-indigo-100 to-slate-100" },
//     { name: "AirFit Pro Headphones", emoji: "🎧", brand: "BeatX", price: 3999, mrp: 4999, rating: 4.5, reviews: 780, unit: "1 pair", description: "Noise cancelling over-ear headphones with rich bass.", gradient: "from-purple-100 to-violet-100" },
//     { name: "AeroTab 11 Tablet", emoji: "📲", brand: "Aero", price: 26999, mrp: 31999, rating: 4.4, reviews: 540, unit: "1 unit", description: "Lightweight tablet for work, study and entertainment.", gradient: "from-emerald-100 to-green-100" },
//     { name: "Pulse Watch 6", emoji: "⌚", brand: "Pulse", price: 12999, mrp: 15999, rating: 4.6, reviews: 720, unit: "1 unit", description: "Smartwatch with heart-rate tracking and GPS support.", gradient: "from-orange-100 to-amber-100" },
//     { name: "AuraCam 4K Camera", emoji: "📷", brand: "Aura", price: 32999, mrp: 38999, rating: 4.7, reviews: 410, unit: "1 unit", description: "Compact mirrorless camera with 4K video and autofocus.", gradient: "from-pink-100 to-rose-100" },
//     { name: "GameSphere Console", emoji: "🎮", brand: "GameSphere", price: 42999, mrp: 47999, rating: 4.8, reviews: 1120, unit: "1 unit", description: "Latest-gen gaming console for multiplayer instant play.", gradient: "from-fuchsia-100 to-pink-100" },
//     { name: "PowerDock USB Hub", emoji: "🔌", brand: "Volt", price: 1999, mrp: 2599, rating: 4.3, reviews: 310, unit: "1 pack", description: "Connect your laptop, phone and accessories with one dock.", gradient: "from-yellow-100 to-amber-100" },
//     { name: "EchoBeam Smart Speaker", emoji: "🔊", brand: "EchoBeam", price: 6999, mrp: 8999, rating: 4.4, reviews: 640, unit: "1 unit", description: "Voice-controlled speaker with room-filling sound.", gradient: "from-sky-100 to-cyan-100" },
//     { name: "ChargeMate Wireless Charger", emoji: "🔋", brand: "ChargeMate", price: 2499, mrp: 3299, rating: 4.2, reviews: 280, unit: "1 unit", description: "Fast wireless charging pad with anti-slip grip.", gradient: "from-emerald-100 to-teal-100" },
//     { name: "LiteDrive SSD 1TB", emoji: "💾", brand: "LiteDrive", price: 8999, mrp: 10999, rating: 4.8, reviews: 880, unit: "1 unit", description: "High-speed SSD for gaming, editing and backup storage.", gradient: "from-zinc-100 to-slate-100" },
//   ],
//   fashion: [
//     { name: "AeroFlex Men Jacket", emoji: "🧥", brand: "AeroFlex", price: 3499, mrp: 4499, rating: 4.6, reviews: 610, unit: "1 piece", description: "Lightweight layered jacket with weather-proof shell.", gradient: "from-blue-100 to-slate-100" },
//     { name: "Urban Chic Women Kurta", emoji: "👗", brand: "UrbanChic", price: 2499, mrp: 3299, rating: 4.5, reviews: 540, unit: "1 piece", description: "Soft cotton kurta with modern minimalist styling.", gradient: "from-pink-100 to-rose-100" },
//     { name: "PlayTime Kids Hoodie", emoji: "🧢", brand: "PlayTime", price: 1499, mrp: 1999, rating: 4.3, reviews: 320, unit: "1 piece", description: "Comfort-fit hoodie designed for active kids.", gradient: "from-yellow-100 to-amber-100" },
//     { name: "GlideRun Sneakers", emoji: "👟", brand: "GlideRun", price: 2999, mrp: 3899, rating: 4.7, reviews: 760, unit: "1 pair", description: "Breathable sneakers with cushioned sole and flex support.", gradient: "from-lime-100 to-green-100" },
//     { name: "Classic Leather Watch", emoji: "⌚", brand: "Timex", price: 6599, mrp: 7999, rating: 4.6, reviews: 430, unit: "1 unit", description: "Premium leather strap watch with minimalist dial.", gradient: "from-amber-100 to-orange-100" },
//     { name: "Voyager Travel Bag", emoji: "👜", brand: "Voyager", price: 2599, mrp: 3299, rating: 4.4, reviews: 380, unit: "1 unit", description: "Spacious carry-on bag with water-resistant finish.", gradient: "from-stone-100 to-zinc-100" },
//     { name: "Luna Pearl Pendant", emoji: "💎", brand: "Luna", price: 1899, mrp: 2399, rating: 4.5, reviews: 260, unit: "1 piece", description: "Elegant pearl pendant with lightweight design.", gradient: "from-violet-100 to-purple-100" },
//     { name: "Metro Formal Shirt", emoji: "👔", brand: "Metro", price: 1799, mrp: 2299, rating: 4.3, reviews: 290, unit: "1 piece", description: "Easy-care formal shirt with stretch comfort.", gradient: "from-slate-100 to-gray-100" },
//     { name: "SunGlow Sunglasses", emoji: "🕶️", brand: "SunGlow", price: 2299, mrp: 2799, rating: 4.4, reviews: 310, unit: "1 pair", description: "UV-protected eyewear with bold contemporary frame.", gradient: "from-cyan-100 to-sky-100" },
//     { name: "EcoSoft Winter Scarf", emoji: "🧣", brand: "EcoSoft", price: 999, mrp: 1299, rating: 4.2, reviews: 190, unit: "1 piece", description: "Soft knit scarf for chilly evenings and travel days.", gradient: "from-red-100 to-rose-100" },
//     { name: "FlexFit Joggers", emoji: "🩳", brand: "FlexFit", price: 1299, mrp: 1699, rating: 4.6, reviews: 360, unit: "1 pair", description: "Performance joggers crafted for relaxed movement.", gradient: "from-lime-100 to-emerald-100" },
//     { name: "Bella Women Handbag", emoji: "🛍️", brand: "Bella", price: 3199, mrp: 3899, rating: 4.7, reviews: 420, unit: "1 unit", description: "Stylish handbag with multiple compartments and premium finish.", gradient: "from-rose-100 to-pink-100" },
//   ],
//   "home-kitchen": [
//     { name: "Oakwood Coffee Table", emoji: "🪑", brand: "Oakwood", price: 12999, mrp: 15999, rating: 4.5, reviews: 360, unit: "1 unit", description: "Solid wood table with modern minimalist base.", gradient: "from-amber-100 to-yellow-100" },
//     { name: "CookPro Non-Stick Pan", emoji: "🍳", brand: "CookPro", price: 2499, mrp: 3199, rating: 4.7, reviews: 640, unit: "1 piece", description: "Durable non-stick cookware for daily home cooking.", gradient: "from-orange-100 to-rose-100" },
//     { name: "Lumen LED Lamp", emoji: "💡", brand: "Lumen", price: 1999, mrp: 2499, rating: 4.4, reviews: 300, unit: "1 piece", description: "Warm ambient lighting with touch dimmer control.", gradient: "from-yellow-100 to-amber-100" },
//     { name: "Orbit Storage Cabinet", emoji: "🗄️", brand: "Orbit", price: 8999, mrp: 10999, rating: 4.6, reviews: 290, unit: "1 unit", description: "Multi-compartment cabinet with elegant matte finish.", gradient: "from-slate-100 to-zinc-100" },
//     { name: "Nova Air Fryer", emoji: "🍟", brand: "Nova", price: 6999, mrp: 8499, rating: 4.8, reviews: 740, unit: "1 unit", description: "Fast and healthy cooking with digital presets.", gradient: "from-red-100 to-orange-100" },
//     { name: "Sage Blender Set", emoji: "🥤", brand: "Sage", price: 3499, mrp: 4299, rating: 4.5, reviews: 420, unit: "1 set", description: "Powerful blender for shakes, sauces and smoothies.", gradient: "from-emerald-100 to-green-100" },
//     { name: "Hearth Ceramic Dinner Set", emoji: "🍽️", brand: "Hearth", price: 2999, mrp: 3799, rating: 4.3, reviews: 240, unit: "24 pcs", description: "Stylish ceramic crockery set for family dining.", gradient: "from-cyan-100 to-sky-100" },
//     { name: "FreshBloom Aroma Diffuser", emoji: "🕯️", brand: "FreshBloom", price: 1599, mrp: 2199, rating: 4.4, reviews: 300, unit: "1 unit", description: "Whisper-quiet diffuser for a calm home atmosphere.", gradient: "from-violet-100 to-fuchsia-100" },
//     { name: "ClearView Microwave", emoji: "🍲", brand: "ClearView", price: 10999, mrp: 12999, rating: 4.7, reviews: 510, unit: "1 unit", description: "Smart microwave with auto-reheat and touch controls.", gradient: "from-sky-100 to-indigo-100" },
//     { name: "ZenShelf Organizer", emoji: "🧺", brand: "ZenShelf", price: 3999, mrp: 4999, rating: 4.4, reviews: 270, unit: "1 unit", description: "Modular storage organizer with premium finish.", gradient: "from-stone-100 to-zinc-100" },
//     { name: "CrispBrew Kettle", emoji: "🫖", brand: "CrispBrew", price: 1899, mrp: 2399, rating: 4.3, reviews: 210, unit: "1 unit", description: "Fast-boil electric kettle with safety shut-off.", gradient: "from-amber-100 to-orange-100" },
//     { name: "EcoNest Throw Blanket", emoji: "🛏️", brand: "EcoNest", price: 1499, mrp: 1899, rating: 4.5, reviews: 380, unit: "1 unit", description: "Soft throw blanket for cozy living spaces.", gradient: "from-lime-100 to-emerald-100" },
//   ],
//   grocery: [
//     { name: "Golden Apples", emoji: "🍎", brand: "FarmFresh", price: 199, mrp: 249, rating: 4.6, reviews: 520, unit: "1 kg", description: "Sweet apples picked fresh from valley orchards.", gradient: "from-red-100 to-rose-100" },
//     { name: "Organic Avocados", emoji: "🥑", brand: "GreenHarvest", price: 249, mrp: 299, rating: 4.7, reviews: 420, unit: "4 pcs", description: "Creamy avocados rich in healthy fats and fiber.", gradient: "from-lime-100 to-green-100" },
//     { name: "Pure Farm Milk", emoji: "🥛", brand: "DairyPure", price: 69, mrp: 89, rating: 4.8, reviews: 680, unit: "1 L", description: "Pasteurized milk with a rich and fresh taste.", gradient: "from-sky-100 to-cyan-100" },
//     { name: "Crunchy Granola Bars", emoji: "🍫", brand: "NutBurst", price: 149, mrp: 189, rating: 4.4, reviews: 300, unit: "6 pcs", description: "Protein-rich granola bars for daily energy.", gradient: "from-amber-100 to-yellow-100" },
//     { name: "Sparkling Citrus Soda", emoji: "🥤", brand: "FizzUp", price: 89, mrp: 119, rating: 4.2, reviews: 240, unit: "1 L", description: "Refreshing citrus soda with natural flavor.", gradient: "from-orange-100 to-amber-100" },
//     { name: "Fresh Broccoli", emoji: "🥦", brand: "FarmFresh", price: 79, mrp: 99, rating: 4.4, reviews: 220, unit: "500 g", description: "Tender broccoli florets packed with vitamins.", gradient: "from-green-100 to-emerald-100" },
//     { name: "Classic Peanut Butter", emoji: "🥜", brand: "Nutty", price: 229, mrp: 279, rating: 4.6, reviews: 350, unit: "500 g", description: "Smooth peanut butter with no added preservatives.", gradient: "from-amber-100 to-rose-100" },
//     { name: "Herbal Tea Sampler", emoji: "🍵", brand: "CalmLeaf", price: 399, mrp: 499, rating: 4.5, reviews: 260, unit: "20 bags", description: "Aging blend of chamomile, mint and hibiscus.", gradient: "from-emerald-100 to-teal-100" },
//     { name: "Fresh Yogurt Cups", emoji: "🥣", brand: "DairyPure", price: 109, mrp: 139, rating: 4.8, reviews: 420, unit: "4 cups", description: "Creamy yogurt made for breakfast and smoothies.", gradient: "from-cyan-100 to-sky-100" },
//     { name: "Crispy Popcorn Mix", emoji: "🍿", brand: "Crunchy", price: 129, mrp: 169, rating: 4.3, reviews: 210, unit: "200 g", description: "Cheesy and salted popcorn for movie nights.", gradient: "from-yellow-100 to-amber-100" },
//     { name: "Orange Juice", emoji: "🧃", brand: "CitrusCo", price: 149, mrp: 189, rating: 4.4, reviews: 300, unit: "1 L", description: "Freshly squeezed style citrus juice with zinc boost.", gradient: "from-orange-100 to-amber-100" },
//     { name: "Eco Dish Soap", emoji: "🧼", brand: "EcoSoft", price: 119, mrp: 149, rating: 4.2, reviews: 160, unit: "500 ml", description: "Plant-based dish wash for a clean kitchen.", gradient: "from-slate-100 to-cyan-100" },
//   ],
//   beauty: [
//     { name: "Glow Serum", emoji: "🧴", brand: "LumiCare", price: 799, mrp: 999, rating: 4.7, reviews: 520, unit: "30 ml", description: "Vitamin-rich serum for glowing bright skin.", gradient: "from-pink-100 to-rose-100" },
//     { name: "Silk Shampoo", emoji: "🫧", brand: "SilkPro", price: 549, mrp: 699, rating: 4.6, reviews: 450, unit: "250 ml", description: "Hydrating shampoo with botanical extracts.", gradient: "from-cyan-100 to-sky-100" },
//     { name: "Lush Lip Tint", emoji: "💄", brand: "LushBae", price: 349, mrp: 449, rating: 4.4, reviews: 280, unit: "1 piece", description: "Creamy tint for natural, vibrant lips.", gradient: "from-rose-100 to-pink-100" },
//     { name: "ProShave Razor Kit", emoji: "🪒", brand: "SharpLine", price: 699, mrp: 899, rating: 4.5, reviews: 340, unit: "1 kit", description: "Complete grooming kit with 5 blades and holder.", gradient: "from-slate-100 to-zinc-100" },
//     { name: "Hydra Moisturizer", emoji: "🫶", brand: "Hydra", price: 649, mrp: 799, rating: 4.8, reviews: 610, unit: "50 g", description: "Lightweight moisturizer for all-day hydration.", gradient: "from-blue-100 to-cyan-100" },
//     { name: "Face Cleansing Brush", emoji: "🧼", brand: "GlowUp", price: 899, mrp: 1099, rating: 4.3, reviews: 260, unit: "1 unit", description: "Gentle daily cleansing brush for a fresh complexion.", gradient: "from-violet-100 to-purple-100" },
//     { name: "HairGlow Serum", emoji: "💇", brand: "HairGlow", price: 749, mrp: 949, rating: 4.6, reviews: 300, unit: "100 ml", description: "Smoothens frizz and adds luminous shine.", gradient: "from-amber-100 to-orange-100" },
//     { name: "PureFace Sunscreen", emoji: "☀️", brand: "PureFace", price: 499, mrp: 649, rating: 4.7, reviews: 420, unit: "50 g", description: "Broad-spectrum sunscreen with lightweight protection.", gradient: "from-yellow-100 to-amber-100" },
//     { name: "SoftCare Hand Cream", emoji: "🧸", brand: "SoftCare", price: 249, mrp: 329, rating: 4.4, reviews: 230, unit: "100 ml", description: "Ultra-hydrating cream with almond and shea.", gradient: "from-pink-100 to-rose-100" },
//     { name: "Curl Bounce Gel", emoji: "🧖", brand: "CurlBounce", price: 399, mrp: 499, rating: 4.5, reviews: 210, unit: "150 ml", description: "Defines curls and keeps hair soft and bouncy.", gradient: "from-green-100 to-emerald-100" },
//     { name: "Mini Makeup Kit", emoji: "💅", brand: "BellaMake", price: 1199, mrp: 1499, rating: 4.6, reviews: 380, unit: "1 set", description: "Complete makeup essentials for quick daily looks.", gradient: "from-fuchsia-100 to-pink-100" },
//     { name: "FreshMint Toothpaste", emoji: "🦷", brand: "FreshMint", price: 179, mrp: 249, rating: 4.4, reviews: 280, unit: "100 g", description: "Minty toothpaste for whitening and freshness.", gradient: "from-cyan-100 to-sky-100" },
//   ],
//   books: [
//     { name: "AI for Everyone", emoji: "🤖", brand: "FuturePress", price: 499, mrp: 699, rating: 4.6, reviews: 560, unit: "1 book", description: "Easy-to-read guide on practical AI for professionals.", gradient: "from-sky-100 to-blue-100" },
//     { name: "The Midnight Library", emoji: "📖", brand: "StoryHouse", price: 349, mrp: 499, rating: 4.8, reviews: 920, unit: "1 book", description: "A moving fiction novel about regret, choices and second chances.", gradient: "from-violet-100 to-purple-100" },
//     { name: "Startup Lessons", emoji: "💼", brand: "Founders", price: 399, mrp: 549, rating: 4.5, reviews: 420, unit: "1 book", description: "Actionable lessons from modern founders and leaders.", gradient: "from-emerald-100 to-green-100" },
//     { name: "SSC CGL Practice Set", emoji: "📝", brand: "ExamEdge", price: 599, mrp: 799, rating: 4.7, reviews: 660, unit: "1 set", description: "Best-selling competitive exam preparation workbook.", gradient: "from-amber-100 to-orange-100" },
//     { name: "World of Physics", emoji: "🔬", brand: "BrightMind", price: 449, mrp: 629, rating: 4.4, reviews: 310, unit: "1 book", description: "Clear explanations for school and entrance exam preparation.", gradient: "from-cyan-100 to-sky-100" },
//     { name: "Designing Data-Intensive Applications", emoji: "📊", brand: "TechPress", price: 999, mrp: 1299, rating: 4.8, reviews: 760, unit: "1 book", description: "A foundational read for engineers and architects.", gradient: "from-slate-100 to-zinc-100" },
//     { name: "The Silent Ocean", emoji: "🌊", brand: "StoryHouse", price: 299, mrp: 399, rating: 4.5, reviews: 280, unit: "1 book", description: "A gripping fiction tale set across the sea and city lights.", gradient: "from-teal-100 to-cyan-100" },
//     { name: "History of Modern India", emoji: "🏛️", brand: "ScholarWorks", price: 459, mrp: 599, rating: 4.6, reviews: 340, unit: "1 book", description: "A detailed read on India’s modern transformation.", gradient: "from-amber-100 to-yellow-100" },
//     { name: "Mindset for Success", emoji: "🧠", brand: "ThinkWell", price: 329, mrp: 449, rating: 4.4, reviews: 290, unit: "1 book", description: "A practical personal growth guide for daily thinking habits.", gradient: "from-violet-100 to-purple-100" },
//     { name: "NEET Biology Notes", emoji: "🧪", brand: "ExamEdge", price: 699, mrp: 899, rating: 4.7, reviews: 520, unit: "1 set", description: "Concise and exam-focused notes for biology aspirants.", gradient: "from-green-100 to-emerald-100" },
//     { name: "Travel Diaries", emoji: "✈️", brand: "Voyage", price: 379, mrp: 499, rating: 4.3, reviews: 200, unit: "1 book", description: "Beautiful travel stories and inspiration for weekend trips.", gradient: "from-blue-100 to-sky-100" },
//     { name: "The Art of Focus", emoji: "🎯", brand: "ThinkWell", price: 349, mrp: 449, rating: 4.6, reviews: 260, unit: "1 book", description: "A practical guide to building deep work habits.", gradient: "from-pink-100 to-rose-100" },
//   ],
//   sports: [
//     { name: "PowerBench Home Gym", emoji: "🏋️", brand: "FitForge", price: 15999, mrp: 18999, rating: 4.7, reviews: 520, unit: "1 unit", description: "Compact home gym set for strength and cardio sessions.", gradient: "from-red-100 to-orange-100" },
//     { name: "Yoga Mat Pro", emoji: "🧘", brand: "FlexFlow", price: 1299, mrp: 1699, rating: 4.6, reviews: 430, unit: "1 unit", description: "Non-slip yoga mat for home workouts and stretching.", gradient: "from-green-100 to-emerald-100" },
//     { name: "TrailRun Shoes", emoji: "👟", brand: "TrailRun", price: 3499, mrp: 4199, rating: 4.5, reviews: 380, unit: "1 pair", description: "Sturdy trail shoes with breathable mesh and grip.", gradient: "from-lime-100 to-green-100" },
//     { name: "Resistance Bands Set", emoji: "🪢", brand: "FitForge", price: 999, mrp: 1299, rating: 4.4, reviews: 310, unit: "1 set", description: "Portable bands for mobility, strength and recovery.", gradient: "from-slate-100 to-zinc-100" },
//     { name: "Cycling Helmet", emoji: "⛑️", brand: "RideSafe", price: 1899, mrp: 2399, rating: 4.6, reviews: 300, unit: "1 unit", description: "Lightweight helmet for daily rides and outdoor sports.", gradient: "from-cyan-100 to-sky-100" },
//     { name: "Jump Rope Pro", emoji: "🪢", brand: "PulseFit", price: 499, mrp: 699, rating: 4.3, reviews: 220, unit: "1 unit", description: "Adjustable rope for cardio and endurance training.", gradient: "from-amber-100 to-yellow-100" },
//     { name: "Gym Bottle 1L", emoji: "🧴", brand: "HydraFit", price: 699, mrp: 899, rating: 4.4, reviews: 270, unit: "1 unit", description: "Insulated bottle for workouts and outdoor travel.", gradient: "from-blue-100 to-cyan-100" },
//     { name: "Core Trainer", emoji: "🦵", brand: "CorePro", price: 3999, mrp: 4899, rating: 4.5, reviews: 330, unit: "1 unit", description: "Compact training gear for balance and core stability.", gradient: "from-violet-100 to-purple-100" },
//     { name: "Outdoor Football", emoji: "⚽", brand: "PlayKick", price: 1499, mrp: 1899, rating: 4.3, reviews: 240, unit: "1 unit", description: "Premium ball with grip for casual and competitive games.", gradient: "from-lime-100 to-green-100" },
//     { name: "Fitness Tracker", emoji: "📈", brand: "Pulse", price: 3499, mrp: 4199, rating: 4.7, reviews: 420, unit: "1 unit", description: "Track steps, sleep and workouts in one smart band.", gradient: "from-sky-100 to-indigo-100" },
//     { name: "Yoga Block Set", emoji: "🧱", brand: "FlexFlow", price: 899, mrp: 1099, rating: 4.4, reviews: 190, unit: "2 pcs", description: "Supportive blocks for stretching and posture correction.", gradient: "from-emerald-100 to-green-100" },
//     { name: "Sport Duffel Bag", emoji: "🧳", brand: "SportPack", price: 2199, mrp: 2799, rating: 4.5, reviews: 260, unit: "1 unit", description: "Spacious bag with separate shoe compartment.", gradient: "from-slate-100 to-zinc-100" },
//   ],
//   toys: [
//     { name: "STEM Builder Kit", emoji: "🧩", brand: "BrightPlay", price: 1599, mrp: 2099, rating: 4.6, reviews: 420, unit: "1 set", description: "Build and explore with coding-friendly STEM toys.", gradient: "from-sky-100 to-blue-100" },
//     { name: "Family Board Game", emoji: "🎲", brand: "FunTime", price: 1499, mrp: 1899, rating: 4.5, reviews: 390, unit: "1 set", description: "Interactive board game for family game nights.", gradient: "from-yellow-100 to-amber-100" },
//     { name: "Hero Action Figure", emoji: "🦸", brand: "HeroX", price: 999, mrp: 1299, rating: 4.4, reviews: 310, unit: "1 piece", description: "Collectible action figure with movable joints.", gradient: "from-red-100 to-rose-100" },
//     { name: "Dino Dig Kit", emoji: "🦖", brand: "PlaySpark", price: 799, mrp: 999, rating: 4.3, reviews: 240, unit: "1 set", description: "Dig and discover prehistoric fossils with style.", gradient: "from-green-100 to-emerald-100" },
//     { name: "Puzzle Quest Box", emoji: "🧠", brand: "Mindspark", price: 699, mrp: 899, rating: 4.5, reviews: 260, unit: "1 set", description: "Puzzle set designed to build logic and creativity.", gradient: "from-lime-100 to-green-100" },
//     { name: "Robot Buddy Toy", emoji: "🤖", brand: "BotBudd", price: 2299, mrp: 2899, rating: 4.7, reviews: 460, unit: "1 unit", description: "Interactive robot toy with light and sound features.", gradient: "from-violet-100 to-purple-100" },
//     { name: "Art & Craft Box", emoji: "🎨", brand: "ColorNest", price: 899, mrp: 1199, rating: 4.4, reviews: 230, unit: "1 set", description: "Creative art kit with crayons, paper and stickers.", gradient: "from-pink-100 to-rose-100" },
//     { name: "Space Rover Set", emoji: "🚀", brand: "GalaxyPlay", price: 1199, mrp: 1499, rating: 4.6, reviews: 340, unit: "1 set", description: "Space-themed playset for curious young explorers.", gradient: "from-sky-100 to-cyan-100" },
//     { name: "Learning Flash Cards", emoji: "🃏", brand: "BrightPlay", price: 499, mrp: 649, rating: 4.3, reviews: 190, unit: "1 set", description: "Educational flash cards for early learning moments.", gradient: "from-yellow-100 to-amber-100" },
//     { name: "Mini Arcade Game", emoji: "🎰", brand: "ArcadeX", price: 1899, mrp: 2399, rating: 4.5, reviews: 270, unit: "1 unit", description: "Portable arcade game for family fun and travel.", gradient: "from-red-100 to-orange-100" },
//     { name: "Treasure Hunt Kit", emoji: "🗺️", brand: "QuestBox", price: 1299, mrp: 1699, rating: 4.6, reviews: 320, unit: "1 kit", description: "Indoor treasure hunt pack for parties and weekends.", gradient: "from-emerald-100 to-green-100" },
//     { name: "Bouncy Ball Pack", emoji: "⚽", brand: "PlaySpark", price: 399, mrp: 549, rating: 4.2, reviews: 170, unit: "12 pcs", description: "Colorful bouncy balls for kids and party packs.", gradient: "from-slate-100 to-zinc-100" },
//   ],
//   automotive: [
//     { name: "Car Seat Organizer", emoji: "🚘", brand: "DriveEase", price: 1299, mrp: 1699, rating: 4.5, reviews: 320, unit: "1 unit", description: "Multi-pocket organizer for safe and tidy road trips.", gradient: "from-sky-100 to-blue-100" },
//     { name: "Bike Helmet Lite", emoji: "🚲", brand: "RideSafe", price: 1599, mrp: 1999, rating: 4.6, reviews: 400, unit: "1 unit", description: "Lightweight helmet for daily bike rides.", gradient: "from-orange-100 to-amber-100" },
//     { name: "Windshield Cleaner Kit", emoji: "🧼", brand: "AutoGlide", price: 799, mrp: 999, rating: 4.4, reviews: 260, unit: "1 set", description: "Streak-free cleaning kit for glass and mirrors.", gradient: "from-cyan-100 to-sky-100" },
//     { name: "Tyre Pressure Gauge", emoji: "📏", brand: "AutoPro", price: 499, mrp: 649, rating: 4.3, reviews: 210, unit: "1 unit", description: "Digital tyre gauge for daily maintenance checks.", gradient: "from-slate-100 to-zinc-100" },
//     { name: "Car Vacuum Cleaner", emoji: "🧹", brand: "DriveEase", price: 2499, mrp: 3199, rating: 4.7, reviews: 380, unit: "1 unit", description: "Portable vacuum for car interiors and quick cleanup.", gradient: "from-violet-100 to-purple-100" },
//     { name: "Bike Lock Combo", emoji: "🔒", brand: "SecureRide", price: 1199, mrp: 1499, rating: 4.5, reviews: 290, unit: "1 unit", description: "Strong anti-theft lock for bicycles and scooters.", gradient: "from-emerald-100 to-green-100" },
//     { name: "Oil Change Kit", emoji: "🛢️", brand: "AutoCare", price: 1899, mrp: 2399, rating: 4.6, reviews: 330, unit: "1 kit", description: "Complete maintenance kit for regular engine care.", gradient: "from-amber-100 to-yellow-100" },
//     { name: "Car Cup Holder", emoji: "☕", brand: "DriveEase", price: 699, mrp: 899, rating: 4.2, reviews: 180, unit: "1 unit", description: "Adjustable holder for drinks and accessories.", gradient: "from-pink-100 to-rose-100" },
//     { name: "Bike Light Set", emoji: "💡", brand: "RideSafe", price: 899, mrp: 1099, rating: 4.4, reviews: 220, unit: "2 pcs", description: "Bright front and rear lights for night rides.", gradient: "from-yellow-100 to-amber-100" },
//     { name: "Car Charging Cable", emoji: "🔌", brand: "Volt", price: 799, mrp: 999, rating: 4.5, reviews: 270, unit: "1 unit", description: "Fast charging cable for phone and device use in cars.", gradient: "from-sky-100 to-cyan-100" },
//     { name: "Motor Oil Booster", emoji: "🛢️", brand: "AutoPro", price: 999, mrp: 1299, rating: 4.3, reviews: 180, unit: "1 L", description: "Fuel-efficient oil additive to support engine smoothness.", gradient: "from-slate-100 to-zinc-100" },
//     { name: "RoadTrip Car Mat", emoji: "🧺", brand: "DriveEase", price: 1599, mrp: 1999, rating: 4.6, reviews: 310, unit: "1 set", description: "Water-resistant mats for easier car floor cleanup.", gradient: "from-green-100 to-emerald-100" },
//   ],
//   pets: [
//     { name: "Pawfect Dog Bed", emoji: "🐶", brand: "Pawfect", price: 2499, mrp: 3199, rating: 4.7, reviews: 420, unit: "1 unit", description: "Orthopedic dog bed with removable washable cover.", gradient: "from-amber-100 to-yellow-100" },
//     { name: "Whisker Cat Litter", emoji: "🐱", brand: "Whisker", price: 799, mrp: 999, rating: 4.5, reviews: 340, unit: "5 kg", description: "Low-dust cat litter with odor control formula.", gradient: "from-lime-100 to-green-100" },
//     { name: "BiteSafe Chew Toys", emoji: "🦴", brand: "BiteSafe", price: 599, mrp: 799, rating: 4.4, reviews: 300, unit: "3 pcs", description: "Durable chew toys for active puppies and dogs.", gradient: "from-orange-100 to-amber-100" },
//     { name: "Pet Grooming Kit", emoji: "🧴", brand: "PawCare", price: 1299, mrp: 1699, rating: 4.6, reviews: 280, unit: "1 kit", description: "Gentle grooming kit for fur care at home.", gradient: "from-violet-100 to-purple-100" },
//     { name: "Pet Travel Bowl", emoji: "🥣", brand: "PawGo", price: 399, mrp: 549, rating: 4.3, reviews: 220, unit: "1 unit", description: "Foldable bowl for pet meals on the move.", gradient: "from-cyan-100 to-sky-100" },
//     { name: "FreshFish Treats", emoji: "🐟", brand: "FreshFish", price: 349, mrp: 449, rating: 4.5, reviews: 200, unit: "100 g", description: "Healthy fish treats for pets with natural ingredients.", gradient: "from-slate-100 to-zinc-100" },
//     { name: "Pet Carrier Backpack", emoji: "🎒", brand: "PawGo", price: 2199, mrp: 2699, rating: 4.7, reviews: 310, unit: "1 unit", description: "Comfortable breathable carrier for small pets.", gradient: "from-emerald-100 to-green-100" },
//     { name: "Calming Pet Bed", emoji: "🛏️", brand: "Pawfect", price: 1899, mrp: 2399, rating: 4.4, reviews: 260, unit: "1 unit", description: "Soft anti-anxiety bed for cats and small dogs.", gradient: "from-pink-100 to-rose-100" },
//     { name: "Treat Jar Dispenser", emoji: "🍪", brand: "PawCare", price: 799, mrp: 999, rating: 4.2, reviews: 170, unit: "1 unit", description: "Easy-access treat jar for daily pet routines.", gradient: "from-yellow-100 to-amber-100" },
//     { name: "Pet Nail Clipper", emoji: "✂️", brand: "PawCare", price: 499, mrp: 649, rating: 4.5, reviews: 240, unit: "1 unit", description: "Safe and easy clipper for pets at home.", gradient: "from-sky-100 to-cyan-100" },
//     { name: "Furry Blanket", emoji: "🧸", brand: "Pawfect", price: 1099, mrp: 1399, rating: 4.4, reviews: 220, unit: "1 unit", description: "Comfortable blanket for pet naps and travel.", gradient: "from-rose-100 to-pink-100" },
//     { name: "Pet Feeder Bowl", emoji: "🥣", brand: "Whisker", price: 699, mrp: 899, rating: 4.3, reviews: 190, unit: "2 pcs", description: "Stylish feeder bowls with anti-slip base.", gradient: "from-slate-100 to-zinc-100" },
//   ],
// };

// export const products: Product[] = Object.entries(marketplaceCatalog).flatMap(([category, items], groupIndex) =>
//   items.map((item, index) => ({
//     id: `${category}-${index + 1}`,
//     name: item.name,
//     emoji: item.emoji,
//     category,
//     price: item.price,
//     mrp: item.mrp,
//     rating: item.rating,
//     reviews: item.reviews,
//     expiryDate: addDays((groupIndex + index) % 7 + 2),
//     stock: 20 + ((groupIndex * 7 + index) % 40),
//     unit: item.unit,
//     description: item.description,
//     gradient: item.gradient,
//     trending: index % 3 === 0,
//     featured: index % 4 === 0,
//   }))
// );

// export const discountPercent = (p: Pick<Product, "price" | "mrp">) =>
//   p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;

// export const daysUntil = (iso: string) => {
//   const d = new Date(iso);
//   const diff = Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
//   return diff;
// };

// export const formatINR = (n: number) =>
//   "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

// export const nearExpiry = (within = 7) =>
//   products.filter((p) => daysUntil(p.expiryDate) <= within && daysUntil(p.expiryDate) >= 0);

// export const lowStock = (threshold = 20) => products.filter((p) => p.stock < threshold);

// export const suggestedDiscount = (iso: string) => {
//   const d = daysUntil(iso);
//   if (d <= 1) return 50;
//   if (d <= 3) return 35;
//   if (d <= 5) return 25;
//   return 15;
// };

// // ---- Orders ----
// export type OrderStatus = "Pending" | "Approved" | "Dispatched" | "Delivered" | "Cancelled";
// export type Order = {
//   id: string;
//   customer: string;
//   date: string;
//   items: { name: string; emoji: string; qty: number; price: number }[];
//   total: number;
//   status: OrderStatus;
// };

// export const orders: Order[] = [
//   { id: "ORD-1042", customer: "Aarav Sharma", date: addDays(-1), total: 411, status: "Delivered", items: [{ name: "Fresh Bananas", emoji: "🍌", qty: 2, price: 45 }, { name: "Farm Milk", emoji: "🥛", qty: 1, price: 56 }, { name: "Almonds", emoji: "🌰", qty: 1, price: 320 - 55 }] },
//   { id: "ORD-1041", customer: "Priya Patel", date: addDays(-2), total: 240, status: "Dispatched", items: [{ name: "Strawberries", emoji: "🍓", qty: 1, price: 150 }, { name: "Greek Yogurt", emoji: "🥣", qty: 1, price: 70 }, { name: "Tomatoes", emoji: "🍅", qty: 1, price: 25 }] },
//   { id: "ORD-1040", customer: "Rohan Mehta", date: addDays(-3), total: 320, status: "Approved", items: [{ name: "Dark Chocolate", emoji: "🍫", qty: 2, price: 120 }, { name: "Green Tea", emoji: "🍵", qty: 1, price: 80 }] },
//   { id: "ORD-1039", customer: "Sneha Reddy", date: addDays(-4), total: 159, status: "Pending", items: [{ name: "Orange Juice", emoji: "🧃", qty: 1, price: 99 }, { name: "Brown Bread", emoji: "🍞", qty: 1, price: 40 }, { name: "Hand Wash", emoji: "🧴", qty: 1, price: 20 }] },
//   { id: "ORD-1038", customer: "Vikram Singh", date: addDays(-6), total: 90, status: "Cancelled", items: [{ name: "Paneer", emoji: "🧀", qty: 1, price: 90 }] },
//   { id: "ORD-1037", customer: "Aarav Sharma", date: addDays(-9), total: 290, status: "Delivered", items: [{ name: "Potato Chips", emoji: "🍟", qty: 3, price: 20 }, { name: "Sparkling Water", emoji: "💧", qty: 2, price: 60 }, { name: "Dish Soap", emoji: "🧼", qty: 1, price: 110 }] },
// ];

// // ---- Customers ----
// export type Customer = {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   orders: number;
//   spent: number;
// };

// export const customers: Customer[] = [
//   { id: "c1", name: "Aarav Sharma", email: "aarav@example.com", phone: "+91 98765 43210", orders: 12, spent: 8420 },
//   { id: "c2", name: "Priya Patel", email: "priya@example.com", phone: "+91 99887 66554", orders: 8, spent: 5210 },
//   { id: "c3", name: "Rohan Mehta", email: "rohan@example.com", phone: "+91 97654 32109", orders: 5, spent: 3120 },
//   { id: "c4", name: "Sneha Reddy", email: "sneha@example.com", phone: "+91 90123 45678", orders: 15, spent: 11240 },
//   { id: "c5", name: "Vikram Singh", email: "vikram@example.com", phone: "+91 91234 56789", orders: 3, spent: 1480 },
//   { id: "c6", name: "Ananya Iyer", email: "ananya@example.com", phone: "+91 93456 78901", orders: 9, spent: 6730 },
// ];

// export const salesTrend = [
//   { label: "Mon", sales: 24, revenue: 14200 },
//   { label: "Tue", sales: 31, revenue: 18900 },
//   { label: "Wed", sales: 28, revenue: 16400 },
//   { label: "Thu", sales: 42, revenue: 25100 },
//   { label: "Fri", sales: 39, revenue: 23700 },
//   { label: "Sat", sales: 55, revenue: 33800 },
//   { label: "Sun", sales: 48, revenue: 29600 },
// ];

// export const wasteTrend = [
//   { label: "Jan", waste: 42, saved: 120 },
//   { label: "Feb", waste: 38, saved: 145 },
//   { label: "Mar", waste: 31, saved: 168 },
//   { label: "Apr", waste: 26, saved: 190 },
//   { label: "May", waste: 19, saved: 224 },
//   { label: "Jun", waste: 14, saved: 268 },
// ];
