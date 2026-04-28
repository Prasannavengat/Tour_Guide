import 'package:flutter/material.dart';

import '../models/tourist_info.dart';
import 'place_selection_screen.dart';

class TouristInfoScreen extends StatefulWidget {
  const TouristInfoScreen({super.key});

  @override
  State<TouristInfoScreen> createState() => _TouristInfoScreenState();
}

class _TouristInfoScreenState extends State<TouristInfoScreen> {
  final _nameController = TextEditingController();
  final _memberCountController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _nameController.dispose();
    _memberCountController.dispose();
    super.dispose();
  }

  void _proceed() {
    if (_formKey.currentState!.validate()) {
      final touristInfo = TouristInfo(
        name: _nameController.text.trim(),
        memberCount: int.parse(_memberCountController.text),
      );

      Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (context) => PlaceSelectionScreen(
            touristInfo: touristInfo,
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tour Pulse'),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 40),
                const Text(
                  'Welcome to Tour Pulse',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF137A6E),
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 10),
                const Text(
                  'Tell us about your tour group',
                  style: TextStyle(fontSize: 16, color: Colors.grey),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 40),
                TextFormField(
                  controller: _nameController,
                  decoration: InputDecoration(
                    labelText: 'Your Name',
                    hintText: 'Enter your name',
                    prefixIcon: const Icon(Icons.person),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Please enter your name';
                    }
                    if (value.trim().length < 2) {
                      return 'Name must be at least 2 characters';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 20),
                TextFormField(
                  controller: _memberCountController,
                  decoration: InputDecoration(
                    labelText: 'Number of Members',
                    hintText: 'How many people in your group?',
                    prefixIcon: const Icon(Icons.group),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  keyboardType: TextInputType.number,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Please enter number of members';
                    }
                    final count = int.tryParse(value);
                    if (count == null || count < 1) {
                      return 'Number must be at least 1';
                    }
                    if (count > 1000) {
                      return 'Number cannot exceed 1000';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 40),
                ElevatedButton(
                  onPressed: _proceed,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    backgroundColor: const Color(0xFF137A6E),
                  ),
                  child: const Text(
                    'Continue',
                    style: TextStyle(fontSize: 16, color: Colors.white),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
