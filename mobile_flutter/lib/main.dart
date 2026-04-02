import 'package:flutter/material.dart';

import 'screens/home_screen.dart';
import 'services/api_client.dart';

void main() {
  runApp(const TourPulseApp());
}

class TourPulseApp extends StatelessWidget {
  const TourPulseApp({super.key});

  @override
  Widget build(BuildContext context) {
    final api = ApiClient(baseUrl: 'http://10.0.2.2:4000');

    return MaterialApp(
      title: 'Tour Pulse',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF137A6E)),
      ),
      home: HomeScreen(apiClient: api),
    );
  }
}
