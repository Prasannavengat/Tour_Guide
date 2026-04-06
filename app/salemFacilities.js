// Comprehensive Salem City Facilities Database with Contact Information

export const salemFacilities = {
  // Tourist Places
  tourist_places: [
    {
      id: "salem-fort",
      name: "Salem Fort",
      category: "Historic Monument",
      address: "Fort area, Salem, Tamil Nadu 636001",
      coordinates: { lat: 11.4648, lng: 78.1500 },
      description: "Historic 17th century fortress with significant historical importance",
      contact: "+91-427-2470124",
      email: "salem.fort@tn.gov.in",
      opening_hours: "9:00 AM - 5:00 PM",
      entry_fee: "₹50 (Indians), ₹500 (Foreigners)"
    },
    {
      id: "kanjanmalai-temple",
      name: "Kanjanmalai Temple",
      category: "Religious Monument",
      address: "Kanjanmalai, Salem, Tamil Nadu 636004",
      coordinates: { lat: 11.4800, lng: 78.1700 },
      description: "Ancient hilltop temple complex with spiral pathway",
      contact: "+91-427-2450456",
      email: "",
      opening_hours: "6:00 AM - 8:00 PM",
      entry_fee: "Free"
    },
    {
      id: "narasimhaswamy-temple",
      name: "Narasimhaswamy Temple",
      category: "Religious Monument",
      address: "Tiruchengode Road, Salem, Tamil Nadu 636008",
      coordinates: { lat: 11.4711, lng: 78.1650 },
      description: "Sacred heritage temple shrine with intricate sculptures",
      contact: "+91-427-2332564",
      email: "",
      opening_hours: "5:30 AM - 9:00 PM",
      entry_fee: "Free"
    },
    {
      id: "govt-museum",
      name: "Government Museum Salem",
      category: "Museum",
      address: "Park Road, Salem, Tamil Nadu 636001",
      coordinates: { lat: 11.4589, lng: 78.1589 },
      description: "Museum with artifacts from British era and local history",
      contact: "+91-427-2470124",
      email: "",
      opening_hours: "9:30 AM - 5:00 PM (Closed Fridays)",
      entry_fee: "₹10"
    },
    {
      id: "jayamkondam-lake",
      name: "Jayamkondam Lake",
      category: "Nature Spot",
      address: "Jayamkondam, Salem, Tamil Nadu 636307",
      coordinates: { lat: 11.7500, lng: 78.4500 },
      description: "Scenic lake ideal for picnics and photography",
      contact: "NA",
      email: "",
      opening_hours: "6:00 AM - 6:00 PM",
      entry_fee: "₹20 per vehicle"
    },
    {
      id: "botanical-garden",
      name: "Botanical Garden & Nature Park",
      category: "Nature Reserve",
      address: "Racecourse Road, Salem, Tamil Nadu 636001",
      coordinates: { lat: 11.4650, lng: 78.1450 },
      description: "Beautiful garden with diverse flora and jogging tracks",
      contact: "+91-427-2459876",
      email: "",
      opening_hours: "6:00 AM - 6:00 PM",
      entry_fee: "₹10"
    }
  ],

  // Hospitals
  hospitals: [
    {
      id: "kmch-salem",
      name: "Kauvery Multi Speciality Hospital",
      category: "Multi-specialty Hospital",
      address: "Athanasius Nagar, Fairlands, Salem, Tamil Nadu 636004",
      coordinates: { lat: 11.4700, lng: 78.1350 },
      contact: "+91-427-4072222",
      emergency: "+91-9488888888",
      email: "salem@kauvery.org",
      specialties: ["Emergency", "ICU", "Surgery", "Cardiology", "Orthopedics"]
    },
    {
      id: "gov-hospital",
      name: "Government Hospital Salem",
      category: "Government Hospital",
      address: "Chettipalayam Road, Salem, Tamil Nadu 636004",
      coordinates: { lat: 11.4550, lng: 78.1600 },
      contact: "+91-427-2345789",
      emergency: "108",
      email: "",
      specialties: ["Emergency", "General Medicine", "Surgery", "Pediatrics"]
    },
    {
      id: "sri-ramakrishna",
      name: "Sri Ramakrishna Hospital",
      category: "Multi-specialty Hospital",
      address: "Kumaran Nagar, Salem, Tamil Nadu 636003",
      coordinates: { lat: 11.4770, lng: 78.1480 },
      contact: "+91-427-2339555",
      emergency: "+91-9843339555",
      email: "info@sriramakrishnasalem.org",
      specialties: ["Cardiology", "Neurology", "Oncology", "Orthopedics", "Nephrology"]
    },
    {
      id: "sunshine-hospital",
      name: "Sunshine Hospital",
      category: "Multi-specialty Hospital",
      address: "Narasipur Road, Salem, Tamil Nadu 636010",
      coordinates: { lat: 11.4400, lng: 78.1700 },
      contact: "+91-427-4005555",
      emergency: "+91-9843005555",
      email: "info@sunshinehospitalsalem.com",
      specialties: ["Emergency", "Trauma Care", "Surgery", "Pediatrics", "Gynecology"]
    },
    {
      id: "aruna-hospital",
      name: "Aruna Hospital (Ashoka Nagar)",
      category: "General Hospital",
      address: "Ashoka Nagar, Salem, Tamil Nadu 636001",
      coordinates: { lat: 11.4650, lng: 78.1520 },
      contact: "+91-427-2456789",
      emergency: "+91-9876543210",
      email: "",
      specialties: ["General Medicine", "Surgery", "Gynecology"]
    },
    {
      id: "metro-hospital",
      name: "Metro Hospitals",
      category: "Multi-specialty Hospital",
      address: "Fairlands, Salem, Tamil Nadu 636004",
      coordinates: { lat: 11.4730, lng: 78.1400 },
      contact: "+91-427-3004000",
      emergency: "+91-9843004000",
      email: "salem@metrohospitals.org",
      specialties: ["Cardiology", "Gastroenterology", "Urology", "Dermatology"]
    }
  ],

  // Police Stations
  police_stations: [
    {
      id: "salem-town-ps",
      name: "Salem Town Police Station",
      address: "Police Headquarters, Salem, Tamil Nadu 636001",
      coordinates: { lat: 11.4600, lng: 78.1550 },
      contact: "+91-427-2336100",
      emergency: "100",
      in_charge: "Inspector",
      jurisdiction: "Central Salem"
    },
    {
      id: "kumaran-nagar-ps",
      name: "Kumaran Nagar Police Station",
      address: "Kumaran Nagar, Salem, Tamil Nadu 636003",
      coordinates: { lat: 11.4750, lng: 78.1450 },
      contact: "+91-427-2452345",
      emergency: "100",
      in_charge: "Sub Inspector",
      jurisdiction: "East Salem"
    },
    {
      id: "fairlands-ps",
      name: "Fairlands Police Station",
      address: "Fairlands, Salem, Tamil Nadu 636004",
      coordinates: { lat: 11.4700, lng: 78.1350 },
      contact: "+91-427-2470123",
      emergency: "100",
      in_charge: "Sub Inspector",
      jurisdiction: "North Salem"
    },
    {
      id: "newcbe-ps",
      name: "New CBE Police Station",
      address: "New CBE, Salem, Tamil Nadu 636010",
      coordinates: { lat: 11.4400, lng: 78.1700 },
      contact: "+91-427-2445678",
      emergency: "100",
      in_charge: "Sub Inspector",
      jurisdiction: "South Salem"
    },
    {
      id: "omalur-ps",
      name: "Omalur Police Station",
      address: "Omalur, Salem, Tamil Nadu 636507",
      coordinates: { lat: 11.5300, lng: 78.3200 },
      contact: "+91-427-2344567",
      emergency: "100",
      in_charge: "Sub Inspector",
      jurisdiction: "Omalur Taluk"
    }
  ],

  // Hotels & Resorts
  hotels: [
    {
      id: "taj-garden-retreat",
      name: "Taj Garden Retreat Salem",
      category: "5-Star Hotel",
      address: "Athanasius Nagar, Fairlands, Salem, Tamil Nadu 636004",
      coordinates: { lat: 11.4690, lng: 78.1340 },
      contact: "+91-427-4282020",
      email: "tajgardenretreat.salem@taj.com",
      rooms: "100+",
      amenities: ["Multi-cuisine Restaurant", "Swimming Pool", "Gym", "Spa", "Conference Hall"],
      price_range: "₹8,000 - ₹25,000"
    },
    {
      id: "hotel-tamil-nadu",
      name: "Hotel Tamil Nadu",
      category: "3-Star Hotel",
      address: "Park Road, Salem, Tamil Nadu 636001",
      coordinates: { lat: 11.4580, lng: 78.1600 },
      contact: "+91-427-2460123",
      email: "info@hoteltamilnadu.com",
      rooms: "60+",
      amenities: ["Restaurant", "Bar", "WiFi", "Parking"],
      price_range: "₹2,500 - ₹6,000"
    },
    {
      id: "ibis-salem",
      name: "Ibis Styles Salem",
      category: "4-Star Hotel",
      address: "Kumaran Nagar, Salem, Tamil Nadu 636003",
      coordinates: { lat: 11.4740, lng: 78.1460 },
      contact: "+91-427-3007777",
      email: "h8656@accor.com",
      rooms: "80+",
      amenities: ["Restaurant", "Business Center", "Fitness Center", "WiFi"],
      price_range: "₹4,500 - ₹12,000"
    },
    {
      id: "mahabalipuram-resort",
      name: "Mahabalipuram Resort",
      category: "3-Star Resort",
      address: "Narasipur Road, Salem, Tamil Nadu 636010",
      coordinates: { lat: 11.4390, lng: 78.1710 },
      contact: "+91-427-2312345",
      email: "booking@mahabalipuramresort.com",
      rooms: "50+",
      amenities: ["Multi-cuisine Restaurant", "Garden", "WiFi", "Parking"],
      price_range: "₹3,000 - ₹8,000"
    },
    {
      id: "sai-palace",
      name: "Sai Palace Hotel",
      category: "3-Star Hotel",
      address: "Ashoka Nagar, Salem, Tamil Nadu 636001",
      coordinates: { lat: 11.4640, lng: 78.1530 },
      contact: "+91-427-2456567",
      email: "saipalace@gmail.com",
      rooms: "40+",
      amenities: ["Restaurant", "24x7 Front Desk", "WiFi"],
      price_range: "₹2,000 - ₹5,000"
    },
    {
      id: "kingdom-hotels",
      name: "The Kingdom Hotels",
      category: "4-Star Hotel",
      address: "Fairlands, Salem, Tamil Nadu 636004",
      coordinates: { lat: 11.4710, lng: 78.1370 },
      contact: "+91-427-3003030",
      email: "salem@thekingdomhotels.com",
      rooms: "75+",
      amenities: ["Multi-cuisine Restaurant", "Swimming Pool", "Conference Rooms"],
      price_range: "₹5,000 - ₹15,000"
    },
    {
      id: "hotel-geetha",
      name: "Hotel Geetha",
      category: "Budget Hotel",
      address: "Park Road, Salem, Tamil Nadu 636001",
      coordinates: { lat: 11.4600, lng: 78.1580 },
      contact: "+91-427-2344444",
      email: "hotelgeetha@gmail.com",
      rooms: "30+",
      amenities: ["Restaurant", "WiFi", "Parking"],
      price_range: "₹1,200 - ₹3,500"
    }
  ],

  // Restaurants
  restaurants: [
    {
      id: "kaaveri-multi-cuisine",
      name: "Kaaveri Multi Cuisine Restaurant",
      category: "Multi-cuisine",
      address: "Fairlands Main Road, Salem, Tamil Nadu 636004",
      coordinates: { lat: 11.4705, lng: 78.1365 },
      contact: "+91-427-2461111",
      email: "",
      cuisine: ["North Indian", "South Indian", "Chinese", "Continental"],
      rating: "4.2/5",
      price_range: "₹300 - ₹800"
    },
    {
      id: "saravana-bhavan",
      name: "Saravana Bhavan",
      category: "South Indian",
      address: "Kumaran Nagar, Salem, Tamil Nadu 636003",
      coordinates: { lat: 11.4755, lng: 78.1450 },
      contact: "+91-427-2463333",
      email: "",
      cuisine: ["South Indian", "Vegetarian"],
      rating: "4.3/5",
      price_range: "₹150 - ₹400"
    },
    {
      id: "flavours-dhaba",
      name: "Flavours Dhaba",
      category: "North Indian",
      address: "New CBE, Salem, Tamil Nadu 636010",
      coordinates: { lat: 11.4410, lng: 78.1705 },
      contact: "+91-427-2445555",
      email: "",
      cuisine: ["North Indian", "Tandoori", "Mughlai"],
      rating: "4.0/5",
      price_range: "₹250 - ₹600"
    },
    {
      id: "royal-dum-biryani",
      name: "Royal Dum Biryani House",
      category: "Biryani Specialist",
      address: "Ashoka Nagar, Salem, Tamil Nadu 636001",
      coordinates: { lat: 11.4650, lng: 78.1525 },
      contact: "+91-427-2431234",
      email: "",
      cuisine: ["Biryani", "Dum Pukht", "Non-Veg"],
      rating: "4.1/5",
      price_range: "₹200 - ₹500"
    },
    {
      id: "sizzlers-heaven",
      name: "Sizzlers Heaven",
      category: "Continental/Sizzlers",
      address: "Park Road, Salem, Tamil Nadu 636001",
      coordinates: { lat: 11.4585, lng: 78.1595 },
      contact: "+91-427-2459999",
      email: "",
      cuisine: ["Continental", "Sizzlers", "Grills"],
      rating: "4.0/5",
      price_range: "₹400 - ₹1,000"
    },
    {
      id: "nandini-cafe",
      name: "Nandini Cafe & Bakery",
      category: "Cafe/Bakery",
      address: "Kumaran Nagar, Salem, Tamil Nadu 636003",
      coordinates: { lat: 11.4760, lng: 78.1455 },
      contact: "+91-427-2464567",
      email: "",
      cuisine: ["Bakery", "Cafe", "Snacks", "Coffee"],
      rating: "4.2/5",
      price_range: "₹100 - ₹300"
    },
    {
      id: "thalaippu-chettinad",
      name: "Thalaippu Chettinad Restaurant",
      category: "Regional South Indian",
      address: "Salem Town, Salem, Tamil Nadu 636001",
      coordinates: { lat: 11.4610, lng: 78.1560 },
      contact: "+91-427-2445678",
      email: "",
      cuisine: ["Chettinad", "South Indian", "Traditional"],
      rating: "4.1/5",
      price_range: "₹250 - ₹550"
    },
    {
      id: "chinese-dragon",
      name: "Chinese Dragon",
      category: "Asian Cuisine",
      address: "Fairlands, Salem, Tamil Nadu 636004",
      coordinates: { lat: 11.4720, lng: 78.1380 },
      contact: "+91-427-2467777",
      email: "",
      cuisine: ["Chinese", "Asian", "Thai"],
      rating: "3.9/5",
      price_range: "₹300 - ₹700"
    }
  ],

  // Fuel Stations
  fuel_stations: [
    {
      id: "ioc-salem-town",
      name: "IOC Petrol Pump - Salem Town",
      brand: "Indian Oil",
      address: "Fairlands Main Road, Salem, Tamil Nadu 636004",
      coordinates: { lat: 11.4695, lng: 78.1355 },
      contact: "+91-427-2461234",
      fuel_types: ["Petrol", "Diesel"],
      payment: ["Cash", "Card", "Digital Wallets"],
      opening_hours: "24/7",
      services: ["Air Pump", "Water Pump", "Convenience Store"]
    },
    {
      id: "hp-kumaran-nagar",
      name: "HP Petrol Pump - Kumaran Nagar",
      brand: "Hindustan Petroleum",
      address: "Kumaran Nagar Road, Salem, Tamil Nadu 636003",
      coordinates: { lat: 11.4745, lng: 78.1445 },
      contact: "+91-427-2463456",
      fuel_types: ["Petrol", "Diesel"],
      payment: ["Cash", "Card", "Digital Wallets"],
      opening_hours: "06:00 AM - 10:00 PM",
      services: ["Air Pump", "Convenience Store"]
    },
    {
      id: "bpcl-salem-bypass",
      name: "BPCL Fuel Station - Salem Bypass",
      brand: "Bharat Petroleum",
      address: "Salem Bypass Road, Salem, Tamil Nadu 636010",
      coordinates: { lat: 11.4400, lng: 78.1690 },
      contact: "+91-427-2445123",
      fuel_types: ["Petrol", "Diesel", "CNG"],
      payment: ["Cash", "Card", "Digital Wallets"],
      opening_hours: "24/7",
      services: ["Air Pump", "Water Pump", "Quick Service Center"]
    },
    {
      id: "shell-tamil-nagar",
      name: "Shell Fuel Station - Tamil Nagar",
      brand: "Shell",
      address: "Tamil Nagar, Salem, Tamil Nadu 636001",
      coordinates: { lat: 11.4630, lng: 78.1510 },
      contact: "+91-427-2451234",
      fuel_types: ["Petrol", "Diesel"],
      payment: ["Cash", "Card", "Digital Wallets"],
      opening_hours: "06:00 AM - 11:00 PM",
      services: ["Premium Air Pump", "Car Wash", "Convenience Store"]
    },
    {
      id: "ioc-narasipur",
      name: "IOC Petrol Pump - Narasipur Road",
      brand: "Indian Oil",
      address: "Narasipur Road, Salem, Tamil Nadu 636010",
      coordinates: { lat: 11.4390, lng: 78.1700 },
      contact: "+91-427-2441234",
      fuel_types: ["Petrol", "Diesel"],
      payment: ["Cash", "Card", "Digital Wallets"],
      opening_hours: "24/7",
      services: ["Air Pump", "Water Pump", "Convenience Store"]
    },
    {
      id: "hp-ashoka-nagar",
      name: "HP Petrol Pump - Ashoka Nagar",
      brand: "Hindustan Petroleum",
      address: "Ashoka Nagar, Salem, Tamil Nadu 636001",
      coordinates: { lat: 11.4650, lng: 78.1520 },
      contact: "+91-427-2456789",
      fuel_types: ["Petrol", "Diesel"],
      payment: ["Cash", "Card", "Digital Wallets"],
      opening_hours: "06:00 AM - 09:00 PM",
      services: ["Air Pump", "Convenience Store"]
    },
    {
      id: "reliance-fairlands",
      name: "Reliance Smart Fuel Station - Fairlands",
      brand: "Reliance",
      address: "Fairlands, Salem, Tamil Nadu 636004",
      coordinates: { lat: 11.4710, lng: 78.1370 },
      contact: "+91-427-2462222",
      fuel_types: ["Petrol", "Diesel"],
      payment: ["Cash", "Card", "Digital Wallets"],
      opening_hours: "24/7",
      services: ["Air Pump", "Water Pump", "Quick Service", "Food Court"]
    }
  ]
};

// Summary statistics
export const salemFacilitiesSummary = {
  total_tourist_places: 6,
  total_hospitals: 6,
  total_police_stations: 5,
  total_hotels: 7,
  total_restaurants: 8,
  total_fuel_stations: 7,
  grand_total: 39
};
