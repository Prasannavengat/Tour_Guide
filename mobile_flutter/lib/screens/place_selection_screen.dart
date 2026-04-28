import 'package:flutter/material.dart';

import '../models/site.dart';
import '../models/tourist_info.dart';
import '../services/api_client.dart';
import 'place_detail_screen.dart';

class PlaceSelectionScreen extends StatefulWidget {
  final TouristInfo touristInfo;

  const PlaceSelectionScreen({
    super.key,
    required this.touristInfo,
  });

  @override
  State<PlaceSelectionScreen> createState() => _PlaceSelectionScreenState();
}

class _PlaceSelectionScreenState extends State<PlaceSelectionScreen> {
  late ApiClient _apiClient;
  List<Site> sites = [];
  bool loading = true;
  String error = '';

  @override
  void initState() {
    super.initState();
    _apiClient = ApiClient(baseUrl: 'http://10.0.2.2:4000');
    _loadSites();
  }

  Future<void> _loadSites() async {
    setState(() {
      loading = true;
      error = '';
    });

    try {
      final fetchedSites = await _apiClient.fetchSites();
      setState(() {
        sites = fetchedSites;
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

  void _selectPlace(Site site) {
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (context) => PlaceDetailScreen(
          touristInfo: widget.touristInfo,
          selectedSite: site,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Select a Place'),
        elevation: 0,
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : error.isNotEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.error_outline, size: 64, color: Colors.red),
                      const SizedBox(height: 16),
                      Text('Error: $error'),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _loadSites,
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _loadSites,
                  child: ListView(
                    padding: const EdgeInsets.all(12),
                    children: [
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Hello, ${widget.touristInfo.name}',
                              style: const TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              'Group size: ${widget.touristInfo.memberCount} members',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.grey[600],
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 20),
                      const Text(
                        'Available Places',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      ...sites.map((site) {
                        final occupancyPercent =
                            (site.occupancyRatio * 100).round();
                        final status = site.isOpen ? 'Open' : 'Closed';
                        final statusColor =
                            site.isOpen ? Colors.green : Colors.red;

                        return Card(
                          margin: const EdgeInsets.only(bottom: 12),
                          child: ListTile(
                            onTap: () => _selectPlace(site),
                            title: Text(
                              site.name,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                            subtitle: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const SizedBox(height: 8),
                                Row(
                                  children: [
                                    const Icon(Icons.people, size: 16),
                                    const SizedBox(width: 4),
                                    Text(
                                      'Occupancy: ${site.currentCount}/${site.capacity}',
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 4),
                              ],
                            ),
                            trailing: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 8,
                                    vertical: 4,
                                  ),
                                  decoration: BoxDecoration(
                                    color: statusColor.withOpacity(0.2),
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: Text(
                                    status,
                                    style: TextStyle(
                                      color: statusColor,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 12,
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  '$occupancyPercent%',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                    color: Color(0xFF137A6E),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      }).toList(),
                    ],
                  ),
                ),
    );
  }
}
