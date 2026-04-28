import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

import '../models/nearby_place.dart';
import '../models/recommendation.dart';
import '../models/site.dart';
import '../models/tourist_info.dart';
import '../services/api_client.dart';

class PlaceDetailScreen extends StatefulWidget {
  final TouristInfo touristInfo;
  final Site selectedSite;

  const PlaceDetailScreen({
    super.key,
    required this.touristInfo,
    required this.selectedSite,
  });

  @override
  State<PlaceDetailScreen> createState() => _PlaceDetailScreenState();
}

class _PlaceDetailScreenState extends State<PlaceDetailScreen>
    with SingleTickerProviderStateMixin {
  late ApiClient _apiClient;
  late TabController _tabController;

  List<Recommendation> recommendations = [];
  List<NearbyPlace> nearbyPlaces = [];
  bool loading = true;
  String error = '';
  String selectedNearbyType = 'hospital';

  Site? _detailedSite;

  @override
  void initState() {
    super.initState();
    _apiClient = ApiClient(baseUrl: 'http://10.0.2.2:4000');
    _tabController = TabController(length: 3, vsync: this);
    _loadData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    setState(() {
      loading = true;
      error = '';
      _detailedSite = widget.selectedSite;
    });

    try {
      final fetchedRecommendations =
          await _apiClient.fetchRecommendations(
        lat: widget.selectedSite.lat,
        lng: widget.selectedSite.lng,
      );

      final fetchedNearby = await _apiClient.fetchNearby(
        lat: widget.selectedSite.lat,
        lng: widget.selectedSite.lng,
        type: selectedNearbyType,
      );

      setState(() {
        recommendations = fetchedRecommendations;
        nearbyPlaces = fetchedNearby;
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

  Future<void> _loadNearbyType(String type) async {
    setState(() {
      selectedNearbyType = type;
      loading = true;
      error = '';
    });

    try {
      final fetchedNearby = await _apiClient.fetchNearby(
        lat: _detailedSite?.lat ?? widget.selectedSite.lat,
        lng: _detailedSite?.lng ?? widget.selectedSite.lng,
        type: type,
      );
      setState(() {
        nearbyPlaces = fetchedNearby;
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

  void _selectRecommendedPlace(Recommendation recommendation) {
    // Navigate to show details of the recommended place
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Selected: ${recommendation.name}'),
        duration: const Duration(seconds: 2),
      ),
    );

    setState(() {
      _detailedSite = Site(
        id: recommendation.siteId,
        name: recommendation.name,
        lat: widget.selectedSite.lat,
        lng: widget.selectedSite.lng,
        capacity: recommendation.capacity,
        currentCount: recommendation.currentCount,
        occupancyRatio: recommendation.occupancyRatio,
        isOpen: true,
      );
    });

    _loadNearbyType(selectedNearbyType);
  }

  @override
  Widget build(BuildContext context) {
    final displaySite = _detailedSite ?? widget.selectedSite;
    final occupancyPercent = (displaySite.occupancyRatio * 100).round();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Place Details'),
        elevation: 0,
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : error.isNotEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.error_outline,
                          size: 64, color: Colors.red),
                      const SizedBox(height: 16),
                      Text('Error: $error'),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _loadData,
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                )
              : Column(
                  children: [
                    // Place Header Card
                    Container(
                      color: const Color(0xFF137A6E),
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            displaySite.name,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 12),
                          Row(
                            mainAxisAlignment:
                                MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment:
                                    CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Current Crowd',
                                    style: TextStyle(
                                      color: Colors.white70,
                                      fontSize: 12,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    '${displaySite.currentCount}/${displaySite.capacity}',
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                              Column(
                                crossAxisAlignment:
                                    CrossAxisAlignment.center,
                                children: [
                                  Container(
                                    width: 100,
                                    height: 100,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: Colors.white.withOpacity(0.2),
                                    ),
                                    child: Center(
                                      child: Column(
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        children: [
                                          Text(
                                            '$occupancyPercent%',
                                            style: const TextStyle(
                                              color: Colors.white,
                                              fontSize: 28,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                          const Text(
                                            'Occupancy',
                                            style: TextStyle(
                                              color: Colors.white70,
                                              fontSize: 10,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              Column(
                                crossAxisAlignment:
                                    CrossAxisAlignment.end,
                                children: [
                                  const Text(
                                    'Status',
                                    style: TextStyle(
                                      color: Colors.white70,
                                      fontSize: 12,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 12,
                                      vertical: 6,
                                    ),
                                    decoration: BoxDecoration(
                                      color: displaySite.isOpen
                                          ? Colors.green
                                          : Colors.red,
                                      borderRadius:
                                          BorderRadius.circular(20),
                                    ),
                                    child: Text(
                                      displaySite.isOpen
                                          ? 'Open'
                                          : 'Closed',
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 14,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    // Tab Bar
                    TabBar(
                      controller: _tabController,
                      labelColor: const Color(0xFF137A6E),
                      unselectedLabelColor: Colors.grey,
                      indicatorColor: const Color(0xFF137A6E),
                      tabs: const [
                        Tab(text: 'Facilities'),
                        Tab(text: 'Recommendations'),
                        Tab(text: 'Map'),
                      ],
                    ),
                    // Tab Content
                    Expanded(
                      child: TabBarView(
                        controller: _tabController,
                        children: [
                          // Facilities Tab
                          _buildFacilitiesTab(),
                          // Recommendations Tab
                          _buildRecommendationsTab(),
                          // Map Tab
                          _buildMapTab(),
                        ],
                      ),
                    ),
                  ],
                ),
    );
  }

  Widget _buildFacilitiesTab() {
    return ListView(
      padding: const EdgeInsets.all(12),
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: Wrap(
            spacing: 8,
            children: [
              ChoiceChip(
                label: const Text('Hospitals'),
                selected: selectedNearbyType == 'hospital',
                onSelected: (_) => _loadNearbyType('hospital'),
              ),
              ChoiceChip(
                label: const Text('Police'),
                selected: selectedNearbyType == 'police',
                onSelected: (_) => _loadNearbyType('police'),
              ),
              ChoiceChip(
                label: const Text('Essentials'),
                selected: selectedNearbyType == 'essentials',
                onSelected: (_) => _loadNearbyType('essentials'),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        nearbyPlaces.isEmpty
            ? const Center(
                child: Padding(
                  padding: EdgeInsets.all(20),
                  child: Text('No facilities found nearby'),
                ),
              )
            : Column(
                children: nearbyPlaces
                    .map((place) => Card(
                          margin: const EdgeInsets.only(bottom: 12),
                          child: ListTile(
                            leading: const Icon(Icons.location_on_outlined),
                            title: Text(place.name),
                            subtitle: Text(
                              '${place.category}${place.address.isNotEmpty ? ' - ${place.address}' : ''}',
                            ),
                          ),
                        ))
                    .toList(),
              ),
      ],
    );
  }

  Widget _buildRecommendationsTab() {
    return ListView(
      padding: const EdgeInsets.all(12),
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(vertical: 8),
          child: Text(
            'Less-Crowded Alternatives',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        recommendations.isEmpty
            ? const Center(
                child: Padding(
                  padding: EdgeInsets.all(20),
                  child: Text('No recommendations available'),
                ),
              )
            : Column(
                children: recommendations
                    .map((rec) {
                      final recOccupancy =
                          (rec.occupancyRatio * 100).round();
                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        child: ListTile(
                          onTap: () => _selectRecommendedPlace(rec),
                          title: Text(rec.name),
                          subtitle: Column(
                            crossAxisAlignment:
                                CrossAxisAlignment.start,
                            children: [
                              const SizedBox(height: 8),
                              Text(
                                'Crowd: ${rec.crowdLevel} | Distance: ${rec.distanceKm.toStringAsFixed(1)} km',
                              ),
                              const SizedBox(height: 4),
                              Text(
                                '${rec.currentCount}/${rec.capacity} ($recOccupancy%)',
                              ),
                            ],
                          ),
                          trailing: Icon(
                            Icons.arrow_forward_ios,
                            size: 16,
                            color: Colors.grey[400],
                          ),
                        ),
                      );
                    })
                    .toList(),
              ),
      ],
    );
  }

  Widget _buildMapTab() {
    final markers = [
      Marker(
        point: LatLng(
          _detailedSite?.lat ?? widget.selectedSite.lat,
          _detailedSite?.lng ?? widget.selectedSite.lng,
        ),
        width: 40,
        height: 40,
        child: const Icon(
          Icons.location_on,
          color: Colors.red,
          size: 34,
        ),
      ),
      ...nearbyPlaces
          .map((p) => Marker(
                point: LatLng(p.lat, p.lng),
                width: 36,
                height: 36,
                child: const Icon(
                  Icons.location_on_outlined,
                  color: Colors.teal,
                  size: 28,
                ),
              ))
          .toList(),
      ...recommendations
          .map((r) => Marker(
                point: LatLng(
                  _detailedSite?.lat ?? widget.selectedSite.lat,
                  _detailedSite?.lng ?? widget.selectedSite.lng,
                ),
                width: 36,
                height: 36,
                child: const Icon(
                  Icons.star,
                  color: Colors.amber,
                  size: 28,
                ),
              ))
          .toList(),
    ];

    return FlutterMap(
      options: MapOptions(
        initialCenter: LatLng(
          _detailedSite?.lat ?? widget.selectedSite.lat,
          _detailedSite?.lng ?? widget.selectedSite.lng,
        ),
        initialZoom: 13,
      ),
      children: [
        TileLayer(
          urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          userAgentPackageName: 'com.example.tourpulse',
        ),
        MarkerLayer(markers: markers),
      ],
    );
  }
}
