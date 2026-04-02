class Recommendation {
  final String siteId;
  final String name;
  final double distanceKm;
  final int currentCount;
  final int capacity;
  final double occupancyRatio;
  final String crowdLevel;

  Recommendation({
    required this.siteId,
    required this.name,
    required this.distanceKm,
    required this.currentCount,
    required this.capacity,
    required this.occupancyRatio,
    required this.crowdLevel,
  });

  factory Recommendation.fromJson(Map<String, dynamic> json) {
    return Recommendation(
      siteId: json['siteId'] as String,
      name: json['name'] as String,
      distanceKm: (json['distanceKm'] as num).toDouble(),
      currentCount: (json['currentCount'] as num).toInt(),
      capacity: (json['capacity'] as num).toInt(),
      occupancyRatio: (json['occupancyRatio'] as num).toDouble(),
      crowdLevel: json['crowdLevel'] as String,
    );
  }
}
