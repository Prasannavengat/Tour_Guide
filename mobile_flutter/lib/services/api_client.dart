import 'dart:convert';

import 'package:http/http.dart' as http;

import '../models/nearby_place.dart';
import '../models/recommendation.dart';
import '../models/site.dart';

class ApiClient {
  String baseUrl;

  ApiClient({required this.baseUrl});

  Uri _uri(String path, [Map<String, String>? query]) {
    return Uri.parse(baseUrl + path).replace(queryParameters: query);
  }

  Future<List<Site>> fetchSites() async {
    final response = await http.get(_uri('/api/sites'));
    if (response.statusCode != 200) {
      throw Exception('Failed to load sites');
    }

    final data = jsonDecode(response.body) as Map<String, dynamic>;
    final sites = (data['sites'] as List<dynamic>)
        .map((item) => Site.fromJson(item as Map<String, dynamic>))
        .toList();
    return sites;
  }

  Future<List<Recommendation>> fetchRecommendations({
    required double lat,
    required double lng,
    int limit = 5,
  }) async {
    final response = await http.get(_uri('/api/recommendations', {
      'lat': lat.toString(),
      'lng': lng.toString(),
      'limit': limit.toString(),
    }));

    if (response.statusCode != 200) {
      throw Exception('Failed to load recommendations');
    }

    final data = jsonDecode(response.body) as Map<String, dynamic>;
    return (data['recommendations'] as List<dynamic>)
        .map((item) => Recommendation.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  Future<List<NearbyPlace>> fetchNearby({
    required double lat,
    required double lng,
    required String type,
    int radius = 3000,
    int limit = 10,
  }) async {
    final response = await http.get(_uri('/api/nearby', {
      'lat': lat.toString(),
      'lng': lng.toString(),
      'type': type,
      'radius': radius.toString(),
      'limit': limit.toString(),
    }));

    if (response.statusCode != 200) {
      throw Exception('Failed to load nearby places');
    }

    final data = jsonDecode(response.body) as Map<String, dynamic>;
    return (data['places'] as List<dynamic>)
        .map((item) => NearbyPlace.fromJson(item as Map<String, dynamic>))
        .toList();
  }
}
