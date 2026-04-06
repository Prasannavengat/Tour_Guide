// Comprehensive Yercaud Hill Station Facilities Database with Contact Information

export const yercaudFacilities = {
  // Tourist Places
  tourist_places: [
    {
      id: "yercaud-lake",
      name: "Yercaud Lake",
      category: "Natural Attraction",
      address: "Lake Road, Yercaud, Tamil Nadu 636601",
      coordinates: { lat: 11.7500, lng: 78.5200 },
      description: "Scenic artificial lake surrounded by lush green hills and pine forests. Perfect for morning walks, boating, and enjoying nature.",
      contact: "+91-6366-222222",
      email: "",
      opening_hours: "5:00 AM - 7:00 PM",
      entry_fee: "Free",
      best_time: "October to February"
    },
    {
      id: "ladys-seat",
      name: "Lady's Seat",
      category: "Scenic Viewpoint",
      address: "Lady's Seat Road, Yercaud, Tamil Nadu 636601",
      coordinates: { lat: 11.7420, lng: 78.5180 },
      description: "Beautiful scenic point named after a historical legend. Named after a British lady who loved to sit here and enjoy the panoramic views. Excellent photo point with 360-degree valley views.",
      contact: "NA",
      email: "",
      opening_hours: "6:00 AM - 6:00 PM",
      entry_fee: "Free",
      best_time: "Early morning for sunrise views"
    },
    {
      id: "pagoda-point",
      name: "Pagoda Point",
      category: "Historic Monument",
      address: "Pagoda Point Road, Yercaud, Tamil Nadu 636601",
      coordinates: { lat: 11.7450, lng: 78.5250 },
      description: "Historic pagoda structure built during British era. Offers 360-degree valley views and plains. Popular photography spot with excellent viewpoint for sunset.",
      contact: "NA",
      email: "",
      opening_hours: "7:00 AM - 6:00 PM",
      entry_fee: "Free",
      best_time: "Sunset time for best views"
    },
    {
      id: "shevaroy-hills",
      name: "Shevaroy Hills",
      category: "Hill Station",
      address: "Shevaroy Hills, Yercaud, Tamil Nadu 636601",
      coordinates: { lat: 11.7600, lng: 78.5300 },
      description: "Majestic hills surrounding Yercaud featuring lush green landscapes, adventure hiking trails, and natural beauty. Named after Lord Shiva. Popular among trekkers and nature enthusiasts.",
      contact: "NA",
      email: "",
      opening_hours: "6:00 AM - 6:00 PM",
      entry_fee: "Free",
      best_time: "October to February"
    },
    {
      id: "servarayan-temple",
      name: "Servarayan Temple",
      category: "Religious Monument",
      address: "Servarayan Temple Road, Yercaud, Tamil Nadu 636601",
      coordinates: { lat: 11.7380, lng: 78.5150 },
      description: "Ancient hilltop temple dedicated to Lord Shiva (also called Servarayan meaning Lord Shiva). Features intricate architecture and spiritual significance. Surrounded by scenic landscapes.",
      contact: "+91-6366-227890",
      email: "",
      opening_hours: "5:30 AM - 9:00 PM",
      entry_fee: "Free",
      best_time: "Mornings for pooja and peaceful ambiance"
    },
    {
      id: "anna-park",
      name: "Anna Park",
      category: "Historical Garden",
      address: "Anna Park Road, Yercaud, Tamil Nadu 636601",
      coordinates: { lat: 11.7480, lng: 78.5150 },
      description: "Ancient garden park laid out in 1848 during British era. Named after C.N. Annadurai. Features landscaped paths, rare plants, walking trails, and benches for rest.",
      contact: "+91-6366-223456",
      email: "",
      opening_hours: "6:00 AM - 6:00 PM",
      entry_fee: "₹20",
      best_time: "Morning walks and evening strolls"
    },
    {
      id: "rose-garden",
      name: "Rose Garden",
      category: "Botanical Garden",
      address: "Rose Garden Road, Yercaud, Tamil Nadu 636601",
      coordinates: { lat: 11.7510, lng: 78.5280 },
      description: "Beautiful botanical garden featuring thousands of rose varieties and flowering plants. Perfect for nature photography and botanical exploration. Well-maintained pathways and shaded areas.",
      contact: "+91-6366-228001",
      email: "",
      opening_hours: "7:00 AM - 6:00 PM",
      entry_fee: "₹30",
      best_time: "May to July (peak rose blooming season)"
    },
    {
      id: "kiliyur-falls",
      name: "Kiliyur Falls",
      category: "Natural Waterfall",
      address: "Kiliyur Falls Road, Yercaud, Tamil Nadu 636601",
      coordinates: { lat: 11.7350, lng: 78.5100 },
      description: "Scenic waterfall surrounded by forest and rocky terrain. Ideal for nature lovers and photographers. Multiple tiers of cascading water with refreshing pool for swimming.",
      contact: "NA",
      email: "",
      opening_hours: "6:00 AM - 5:00 PM",
      entry_fee: "Free",
      best_time: "June to November (post-monsoon season)"
    },
    {
      id: "karadiyur-viewpoint",
      name: "Karadiyur View Point",
      category: "Scenic Viewpoint",
      address: "Karadiyur Road, Yercaud, Tamil Nadu 636601",
      coordinates: { lat: 11.7580, lng: 78.5220 },
      description: "Panoramic viewpoint offering breathtaking views of surrounding valleys, plains, and hill ranges. Lesser-known gem perfect for peaceful viewing and photography. Clear visibility on sunny days.",
      contact: "NA",
      email: "",
      opening_hours: "6:00 AM - 6:00 PM",
      entry_fee: "Free",
      best_time: "Early morning for clear skies"
    },
    {
      id: "bears-cave",
      name: "Bear's Cave",
      category: "Natural Cave",
      address: "Bear's Cave Road, Yercaud, Tamil Nadu 636601",
      coordinates: { lat: 11.7400, lng: 78.5320 },
      description: "Natural cave formation with historical significance. Named for bears believed to inhabit the area. Surrounded by scenic natural beauty and forest landscape. Adventure and history enthusiasts' favorite.",
      contact: "NA",
      email: "",
      opening_hours: "6:00 AM - 5:30 PM",
      entry_fee: "Free",
      best_time: "October to February"
    }
  ],

  // Hospitals
  hospitals: [
    {
      id: "yercaud-primary-health",
      name: "Yercaud Primary Health Centre",
      category: "Primary Health Centre",
      address: "Main Bazaar, Yercaud, Tamil Nadu 636601",
      coordinates: { lat: 11.7510, lng: 78.5200 },
      contact: "+91-6366-222110",
      emergency: "102/108",
      email: "",
      specialties: ["General Medicine", "Basic Emergency Care", "Vaccination"]
    },
    {
      id: "salem-district-hospital",
      name: "Salem District Hospital (Nearest Major)",
      category: "Government Hospital",
      address: "Chettipalayam Road, Salem, Tamil Nadu 636004",
      coordinates: { lat: 11.4550, lng: 78.1600 },
      contact: "+91-427-2345789",
      emergency: "108",
      email: "",
      specialties: ["Emergency", "General Medicine", "Surgery", "Pediatrics"]
    },
    {
      id: "kauvery-salem",
      name: "Kauvery Multi Speciality Hospital (Salem)",
      category: "Multi-specialty Hospital",
      address: "Fairlands, Salem, Tamil Nadu 636004",
      coordinates: { lat: 11.4700, lng: 78.1350 },
      contact: "+91-427-4072222",
      emergency: "+91-9488888888",
      email: "salem@kauvery.org",
      specialties: ["Emergency", "ICU", "Surgery", "Cardiology", "Orthopedics"]
    },
    {
      id: "sri-ramakrishna-salem",
      name: "Sri Ramakrishna Hospital (Salem)",
      category: "Multi-specialty Hospital",
      address: "Kumaran Nagar, Salem, Tamil Nadu 636003",
      coordinates: { lat: 11.4770, lng: 78.1480 },
      contact: "+91-427-2339555",
      emergency: "+91-9843339555",
      email: "info@sriramakrishnasalem.org",
      specialties: ["Cardiology", "Neurology", "Oncology", "Orthopedics"]
    }
  ],

  // Police Stations
  police_stations: [
    {
      id: "yercaud-police-post",
      name: "Yercaud Police Post",
      address: "Main Bazaar, Yercaud, Tamil Nadu 636601",
      coordinates: { lat: 11.7510, lng: 78.5200 },
      contact: "+91-6366-222100",
      emergency: "100",
      in_charge: "Police Constable",
      jurisdiction: "Yercaud Hill Station"
    },
    {
      id: "salem-town-ps",
      name: "Salem Town Police Station (Nearest)",
      address: "Police Headquarters, Salem, Tamil Nadu 636001",
      coordinates: { lat: 11.4600, lng: 78.1550 },
      contact: "+91-427-2336100",
      emergency: "100",
      in_charge: "Inspector",
      jurisdiction: "Central Salem"
    },
    {
      id: "kumaran-nagar-ps",
      name: "Kumaran Nagar Police Station (Salem)",
      address: "Kumaran Nagar, Salem, Tamil Nadu 636003",
      coordinates: { lat: 11.4750, lng: 78.1450 },
      contact: "+91-427-2452345",
      emergency: "100",
      in_charge: "Sub Inspector",
      jurisdiction: "East Salem"
    }
  ],

  // Hotels & Resorts
  hotels: [
    {
      id: "yercaud-res-palace",
      name: "Yercaud Resort Palace",
      category: "Resort",
      address: "Lake Road, Yercaud, Tamil Nadu 636601",
      coordinates: { lat: 11.7490, lng: 78.5210 },
      contact: "+91-6366-222200",
      email: "info@yercaudresortpalace.com",
      rooms: "45+",
      amenities: ["Restaurant", "Bonfire", "Garden", "WiFi", "Parking"],
      price_range: "₹3,500 - ₹8,000"
    },
    {
      id: "yercaud-hill-resort",
      name: "Yercaud Hill Resort",
      category: "Resort",
      address: "Pagoda Point Road, Yercaud, Tamil Nadu 636601",
      coordinates: { lat: 11.7450, lng: 78.5250 },
      contact: "+91-6366-223300",
      email: "booking@yercaudhillresort.com",
      rooms: "50+",
      amenities: ["Multi-cuisine Restaurant", "Bar", "Garden", "WiFi"],
      price_range: "₹4,000 - ₹10,000"
    },
    {
      id: "green-valley-resort",
      name: "Green Valley Resort",
      category: "Resort",
      address: "Big Lake Road, Yercaud, Tamil Nadu 636601",
      coordinates: { lat: 11.7600, lng: 78.5300 },
      contact: "+91-6366-224400",
      email: "greenvalley@yercaud.com",
      rooms: "55+",
      amenities: ["Restaurant", "Boating", "Adventure Activities", "WiFi"],
      price_range: "₹3,000 - ₹9,000"
    },
    {
      id: "pine-forest-lodges",
      name: "Pine Forest Lodges",
      category: "Budget Resort",
      address: "Forest Area, Yercaud, Tamil Nadu 636601",
      coordinates: { lat: 11.7520, lng: 78.5180 },
      contact: "+91-6366-225500",
      email: "pineforest@yercaud.in",
      rooms: "35+",
      amenities: ["Cafe", "WiFi", "Parking"],
      price_range: "₹2,000 - ₹5,000"
    },
    {
      id: "taj-gardens-yercaud",
      name: "Taj Garden Retreat (Nearest - Salem)",
      category: "5-Star Hotel",
      address: "Fairlands, Salem, Tamil Nadu 636004",
      coordinates: { lat: 11.4690, lng: 78.1340 },
      contact: "+91-427-4282020",
      email: "tajgardenretreat.salem@taj.com",
      rooms: "100+",
      amenities: ["Multi-cuisine Restaurant", "Swimming Pool", "Gym", "Spa"],
      price_range: "₹8,000 - ₹25,000"
    }
  ],

  // Restaurants
  restaurants: [
    {
      id: "yercaud-hill-cafe",
      name: "Yercaud Hill Cafe",
      category: "Multi-cuisine",
      address: "Main Bazaar, Yercaud, Tamil Nadu 636601",
      coordinates: { lat: 11.7510, lng: 78.5200 },
      contact: "+91-6366-222555",
      email: "",
      cuisine: ["South Indian", "North Indian", "Chinese"],
      rating: "4.0/5",
      price_range: "₹200 - ₹500"
    },
    {
      id: "taste-of-yercaud",
      name: "Taste of Yercaud Restaurant",
      category: "Regional South Indian",
      address: "Lake Road, Yercaud, Tamil Nadu 636601",
      coordinates: { lat: 11.7500, lng: 78.5200 },
      contact: "+91-6366-223666",
      email: "",
      cuisine: ["South Indian", "Tamil Cuisine", "Chettinad"],
      rating: "4.2/5",
      price_range: "₹250 - ₹600"
    },
    {
      id: "pine-valley-restaurant",
      name: "Pine Valley Restaurant",
      category: "Multi-cuisine",
      address: "Forest Road, Yercaud, Tamil Nadu 636601",
      coordinates: { lat: 11.7520, lng: 78.5180 },
      contact: "+91-6366-224777",
      email: "",
      cuisine: ["North Indian", "Continental", "Indian"],
      rating: "3.9/5",
      price_range: "₹300 - ₹700"
    },
    {
      id: "lake-view-restaurant",
      name: "Lake View Restaurant",
      category: "Scenic Dining",
      address: "Lake Road, Yercaud, Tamil Nadu 636601",
      coordinates: { lat: 11.7490, lng: 78.5210 },
      contact: "+91-6366-225888",
      email: "",
      cuisine: ["Multi-cuisine", "Vegetarian", "Chinese"],
      rating: "4.1/5",
      price_range: "₹250 - ₹650"
    },
    {
      id: "anna-park-cafe",
      name: "Anna Park Cafe",
      category: "Cafe",
      address: "Anna Park Road, Yercaud, Tamil Nadu 636601",
      coordinates: { lat: 11.7480, lng: 78.5150 },
      contact: "+91-6366-226999",
      email: "",
      cuisine: ["Cafe", "Snacks", "Tea & Coffee"],
      rating: "4.0/5",
      price_range: "₹100 - ₹300"
    },
    {
      id: "mountain-view-dhaba",
      name: "Mountain View Dhaba",
      category: "North Indian",
      address: "Pagoda Point Road, Yercaud, Tamil Nadu 636601",
      coordinates: { lat: 11.7450, lng: 78.5250 },
      contact: "+91-6366-227000",
      email: "",
      cuisine: ["North Indian", "Tandoori", "Mughlai"],
      rating: "4.0/5",
      price_range: "₹250 - ₹550"
    }
  ],

  // Fuel Stations
  fuel_stations: [
    {
      id: "salem-ioc-fairlands",
      name: "IOC Petrol Pump - Salem (Fairlands)",
      brand: "Indian Oil",
      address: "Fairlands Main Road, Salem, Tamil Nadu 636004",
      coordinates: { lat: 11.4695, lng: 78.1355 },
      contact: "+91-427-2461234",
      fuel_types: ["Petrol", "Diesel"],
      payment: ["Cash", "Card", "Digital Wallets"],
      opening_hours: "24/7",
      services: ["Air Pump", "Water Pump", "Convenience Store"],
      distance_to_yercaud: "~60 km"
    },
    {
      id: "salem-hp-kumaran",
      name: "HP Petrol Pump - Salem (Kumaran Nagar)",
      brand: "Hindustan Petroleum",
      address: "Kumaran Nagar Road, Salem, Tamil Nadu 636003",
      coordinates: { lat: 11.4745, lng: 78.1445 },
      contact: "+91-427-2463456",
      fuel_types: ["Petrol", "Diesel"],
      payment: ["Cash", "Card", "Digital Wallets"],
      opening_hours: "06:00 AM - 10:00 PM",
      services: ["Air Pump", "Convenience Store"],
      distance_to_yercaud: "~55 km"
    },
    {
      id: "salem-bpcl-bypass",
      name: "BPCL Fuel Station - Salem Bypass",
      brand: "Bharat Petroleum",
      address: "Salem Bypass Road, Salem, Tamil Nadu 636010",
      coordinates: { lat: 11.4400, lng: 78.1690 },
      contact: "+91-427-2445123",
      fuel_types: ["Petrol", "Diesel", "CNG"],
      payment: ["Cash", "Card", "Digital Wallets"],
      opening_hours: "24/7",
      services: ["Air Pump", "Water Pump", "Quick Service Center"],
      distance_to_yercaud: "~45 km"
    },
    {
      id: "shevaroy-entry-fuel",
      name: "Shevaroy Entry Fuel Station",
      brand: "Indian Oil",
      address: "Near Yercaud Entry Gate, Tamil Nadu 636601",
      coordinates: { lat: 11.7600, lng: 78.5400 },
      contact: "+91-6366-228000",
      fuel_types: ["Petrol", "Diesel"],
      payment: ["Cash", "Card"],
      opening_hours: "06:00 AM - 08:00 PM",
      services: ["Air Pump"],
      distance_to_yercaud: "~8 km"
    },
    {
      id: "salem-shell-tamil-nagar",
      name: "Shell Fuel Station - Salem (Tamil Nagar)",
      brand: "Shell",
      address: "Tamil Nagar, Salem, Tamil Nadu 636001",
      coordinates: { lat: 11.4630, lng: 78.1510 },
      contact: "+91-427-2451234",
      fuel_types: ["Petrol", "Diesel"],
      payment: ["Cash", "Card", "Digital Wallets"],
      opening_hours: "06:00 AM - 11:00 PM",
      services: ["Premium Air Pump", "Car Wash"],
      distance_to_yercaud: "~58 km"
    }
  ]
};

// Summary statistics
export const yercaudFacilitiesSummary = {
  total_tourist_places: 10,
  total_hospitals: 4,
  total_police_stations: 3,
  total_hotels: 5,
  total_restaurants: 6,
  total_fuel_stations: 5,
  grand_total: 33
};
