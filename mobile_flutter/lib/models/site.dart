class Site {
  final String id;
  final String name;
  final double lat;
  final double lng;
  final int capacity;
  final int currentCount;
  final double occupancyRatio;

  Site({
    required this.id,
    required this.name,
    required this.lat,
    required this.lng,
    required this.capacity,
    required this.currentCount,
    required this.occupancyRatio,
  });

  factory Site.fromJson(Map<String, dynamic> json) {
    return Site(
      id: json['id'] as String,
      name: json['name'] as String,
      lat: (json['lat'] as num).toDouble(),
      lng: (json['lng'] as num).toDouble(),
      capacity: (json['capacity'] as num).toInt(),
      currentCount: (json['currentCount'] as num).toInt(),
      occupancyRatio: (json['occupancyRatio'] as num).toDouble(),
    );
  }
}
