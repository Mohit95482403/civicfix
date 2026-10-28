import 'package:flutter/material.dart';
import 'router.dart';
import 'theme/app_theme.dart';

/// Root Widget for CivicFix Mobile Application
class CivicFixApp extends StatelessWidget {
  const CivicFixApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'CivicFix',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      routerConfig: appRouter,
    );
  }
}
