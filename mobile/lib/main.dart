import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app/app.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  // Root entry wrapped with Riverpod's ProviderScope for reactive state management
  runApp(const ProviderScope(child: CivicFixApp()));
}
