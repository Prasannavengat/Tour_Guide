class NearbyPlace {
  final int id;
  final double lat;
  final double lng;
  final String name;
  final String category;
  final String address;

  NearbyPlace({
    required this.id,
    required this.lat,
    required this.lng,
    required this.name,
    required this.category,
    required this.address,
  });

  factory NearbyPlace.fromJson(Map<String, dynamic> json) {
    return NearbyPlace(
      id: (json['id'] as num).toInt(),
      lat: (json['lat'] as num).toDouble(),
      lng: (json['lng'] as num).toDouble(),
      name: (json['name'] ?? 'Unnamed place') as String,
      category: (json['category'] ?? 'unknown') as String,
      address: (json['address'] ?? '') as String,
    );
  }
}
