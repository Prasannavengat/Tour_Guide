import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

import '../models/nearby_place.dart';
import '../models/recommendation.dart';
import '../models/site.dart';
import '../services/api_client.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({
    super.key,
    required this.apiClient,
  });

  final ApiClient apiClient;

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final double lat = 11.02;
  final double lng = 76.97;

  List<Site> sites = [];
  List<Recommendation> recommendations = [];
  List<NearbyPlace> nearby = [];
  String nearbyType = 'hospital';
  bool loading = true;
  String error = '';

  @override
  void initState() {
    super.initState();
    loadAll();
  }

  Future<void> loadAll() async {
    setState(() {
      loading = true;
      error = '';
    });

    try {
      final fetchedSites = await widget.apiClient.fetchSites();
      final fetchedRecommendations = await widget.apiClient.fetchRecommendations(
        lat: lat,
        lng: lng,
      );
      final fetchedNearby = await widget.apiClient.fetchNearby(
        lat: lat,
        lng: lng,
        type: nearbyType,
      );

      setState(() {
        sites = fetchedSites;
        recommendations = fetchedRecommendations;
        nearby = fetchedNearby;
      });
    } catch (e) {
      setState(() {
        error = e.toString();
      });
    } finally {
      setState(() {
        loading = false;
      });
    }
  }

  Future<void> loadNearby(String type) async {
    setState(() {
      nearbyType = type;
      loading = true;
      error = '';
    });

    try {
      final fetchedNearby = await widget.apiClient.fetchNearby(
        lat: lat,
        lng: lng,
        type: nearbyType,
      );
      setState(() {
        nearby = fetchedNearby;
      });
    } catch (e) {
      setState(() {
        error = e.toString();
      });
    } finally {
      setState(() {
        loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tour Pulse Guide'),
        actions: [
          IconButton(
            onPressed: loadAll,
            icon: const Icon(Icons.refresh),
          )
        ],
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : error.isNotEmpty
              ? Center(child: Text('Error: $error'))
              : RefreshIndicator(
                  onRefresh: loadAll,
                  child: ListView(
                    padding: const EdgeInsets.all(12),
                    children: [
                      const Text(
                        'Live Crowd',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
                      ),
                      const SizedBox(height: 8),
                      ...sites.map((site) => Card(
                            child: ListTile(
                              title: Text(site.name),
                              subtitle: Text('Count ${site.currentCount}/${site.capacity}'),
                              trailing: Text('${(site.occupancyRatio * 100).round()}%'),
                            ),
                          )),
                      const SizedBox(height: 12),
                      const Text(
                        'Less-Crowded Recommendations',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
                      ),
                      const SizedBox(height: 8),
                      ...recommendations.map((item) => Card(
                            child: ListTile(
                              title: Text(item.name),
                              subtitle: Text('${item.crowdLevel} crowd, ${item.distanceKm} km away'),
                            ),
                          )),
                      const SizedBox(height: 12),
                      const Text(
                        'Nearby Services',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
                      ),
                      const SizedBox(height: 8),
                      Wrap(
                        spacing: 8,
                        children: [
                          ChoiceChip(
                            label: const Text('Hospitals'),
                            selected: nearbyType == 'hospital',
                            onSelected: (_) => loadNearby('hospital'),
                          ),
                          ChoiceChip(
                            label: const Text('Police'),
                            selected: nearbyType == 'police',
                            onSelected: (_) => loadNearby('police'),
                          ),
                          ChoiceChip(
                            label: const Text('Essentials'),
                            selected: nearbyType == 'essentials',
                            onSelected: (_) => loadNearby('essentials'),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      ...nearby.map((p) => Card(
                            child: ListTile(
                              title: Text(p.name),
                              subtitle: Text('${p.category} ${p.address.isNotEmpty ? '- ${p.address}' : ''}'),
                            ),
                          )),
                      const SizedBox(height: 12),
                      SizedBox(
                        height: 300,
                        child: FlutterMap(
                          options: const MapOptions(
                            initialCenter: LatLng(11.02, 76.97),
                            initialZoom: 12.5,
                          ),
                          children: [
                            TileLayer(
                              urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                              userAgentPackageName: 'com.example.tourpulse',
                            ),
                            MarkerLayer(
                              markers: [
                                const Marker(
                                  point: LatLng(11.02, 76.97),
                                  width: 40,
                                  height: 40,
                                  child: Icon(Icons.person_pin_circle, color: Colors.red, size: 34),
                                ),
                                ...nearby
                                    .map((p) => Marker(
                                          point: LatLng(p.lat, p.lng),
                                          width: 36,
                                          height: 36,
                                          child: const Icon(Icons.location_on, color: Colors.teal, size: 28),
                                        ))
                                    .toList(),
                              ],
                            ),
                          ],
                        ),
                      )
                    ],
                  ),
                ),
    );
  }
}
