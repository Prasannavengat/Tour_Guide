import 'package:flutter/material.dart';

import 'screens/tourist_info_screen.dart';

void main() {
  runApp(const TourPulseApp());
}

class TourPulseApp extends StatelessWidget {
  const TourPulseApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Tour Pulse',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF137A6E)),
      ),
      home: const TouristInfoScreen(),
    );
  }
}
