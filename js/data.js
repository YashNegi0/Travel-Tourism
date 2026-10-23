const categories = ["All", "Beach", "Mountain", "City", "Heritage", "Wildlife"];

const destinations = [
  { name: "Delhi", category: "Heritage", country: "India", desc: "Qutub Minar, Mughal monuments and street food in India's capital.", img: "assets/images/delhi.jpg" },
  { name: "Jaipur", category: "Heritage", country: "India", desc: "Forts and palaces in rose sandstone, crowned by Hawa Mahal.", img: "assets/images/jaipur.jpg" },
  { name: "Varanasi", category: "Heritage", country: "India", desc: "Ganga ghats, evening aarti and one of the world's oldest cities.", img: "assets/images/varanasi.jpg" },
  { name: "Ellora Caves", category: "Heritage", country: "India", desc: "Rock-cut temples and monasteries carved from a single hillside.", img: "assets/images/ellora.jpg", weatherCity: "Aurangabad" },
  { name: "Munnar", category: "Mountain", country: "India", desc: "Rolling tea estates wrapped in morning mist.", img: "assets/images/munnar.jpg" },
  { name: "Manali", category: "Mountain", country: "India", desc: "Pine forests and snow-lined valleys.", img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600" },
  { name: "Kyoto", category: "Heritage", country: "Japan", desc: "Temples, bamboo groves and quiet lanes.", img: "assets/images/kyoto.jpg" },
  { name: "Tokyo", category: "City", country: "Japan", desc: "Neon crossings and endless neighbourhoods to explore.", img: "assets/images/tokyo.jpg" },
  { name: "Mount Fuji", category: "Mountain", country: "Japan", desc: "Japan's snow-capped icon, best seen on a clear winter morning.", img: "assets/images/mount-fuji.jpg", weatherCity: "Fujiyoshida" },
  { name: "Nara", category: "Wildlife", country: "Japan", desc: "Friendly free-roaming deer in an ancient temple town.", img: "assets/images/nara.jpg" },
  { name: "New York", category: "City", country: "USA", desc: "The skyline that never sleeps.", img: "assets/images/new-york.jpg" },
  { name: "Santorini", category: "Beach", country: "Greece", desc: "Whitewashed cliffs over the Aegean.", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600" },
  { name: "Bali", category: "Beach", country: "Indonesia", desc: "Rice terraces meeting the coast.", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600" },
  { name: "Serengeti", category: "Wildlife", country: "Tanzania", desc: "The great migration, up close.", img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600" },
  { name: "Interlaken", category: "Mountain", country: "Switzerland", desc: "Alpine lakes and cable cars.", img: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600" }
];

const galleryImages = [
  { src: "assets/images/gallery-hawa-mahal-night.jpg", caption: "Hawa Mahal glowing at night, Jaipur" },
  { src: "assets/images/gallery-jal-mahal.jpg", caption: "Sunset over Jal Mahal, Jaipur" },
  { src: "assets/images/gallery-camel.jpg", caption: "A decorated camel in Rajasthan" },
  { src: "assets/images/gallery-elephant.jpg", caption: "Painted elephant at Amber Fort" },
  { src: "assets/images/gallery-jaigarh-fort.jpg", caption: "Fort walls above the Rajasthan hills" },
  { src: "assets/images/gallery-akshardham.jpg", caption: "Akshardham Temple, Delhi" },
  { src: "assets/images/gallery-red-fort-arch.jpg", caption: "Red sandstone arches, Old Delhi" },
  { src: "assets/images/gallery-rickshaw.jpg", caption: "Auto rickshaw beside a historic tomb" },
  { src: "assets/images/gallery-fushimi-inari.jpg", caption: "Torii gates at Fushimi Inari, Kyoto" },
  { src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500", caption: "Mountain trail at dawn" },
  { src: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=500", caption: "Coastal village" },
  { src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500", caption: "Desert dunes" }
];

const places = [
  { name: "Qutub Minar", location: "Delhi, India", note: "A 73-metre sandstone victory tower from the 12th century, beautifully lit after dark." },
  { name: "Amber Fort", location: "Jaipur, India", note: "Sandstone ramparts overlooking Maota Lake, with elephant rides up to the gate." },
  { name: "Kailasa Temple", location: "Ellora, India", note: "The world's largest monolithic structure, carved top-down from one rock." },
  { name: "Dashashwamedh Ghat", location: "Varanasi, India", note: "Come at dusk for the Ganga Aarti, a ceremony of fire, bells and chanting." },
  { name: "Fushimi Inari Shrine", location: "Kyoto, Japan", note: "Thousands of vermilion torii gates winding up the hillside." },
  { name: "Shibuya Crossing", location: "Tokyo, Japan", note: "The world's busiest pedestrian crossing, best viewed from a nearby rooftop." },
  { name: "Ngorongoro Crater", location: "Tanzania", note: "A volcanic caldera holding one of Africa's densest wildlife populations." },
  { name: "Oia Sunset Point", location: "Santorini, Greece", note: "The classic caldera view, best an hour before sunset." }
];

const hotels = [
  { name: "Casa del Mare", price: "₹3,500/night", tier: "Budget", desc: "Simple rooms two minutes from the beach." },
  { name: "Ridgeline Lodge", price: "₹9,000/night", tier: "Mid-range", desc: "Mountain-view rooms with a working fireplace." },
  { name: "The Kensington", price: "₹21,000/night", tier: "Luxury", desc: "Full-service hotel in the city centre." }
];

const tips = [
  "Book domestic flights on Tuesday afternoons for the lowest average fares.",
  "Carry a physical copy of your passport separate from the original.",
  "Download offline maps before you lose signal in rural areas.",
  "Learn ten basic phrases in the local language — it changes how you're treated.",
  "Pack one outfit you can rewear for both daytime and dinner."
];
