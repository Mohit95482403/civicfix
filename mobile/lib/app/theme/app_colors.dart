import 'package:flutter/material.dart';

/// CivicFix Day 2 Brand & Semantic Color Tokens
class AppColors {
  AppColors._();

  // Brand Primaries
  static const Color primary = Color(0xFF176B5B); // Civic Teal
  static const Color primaryDark = Color(0xFF115447);
  static const Color primaryLight = Color(0xFFE8F4F0);
  
  // Accents
  static const Color accent = Color(0xFFF4B942); // Warm Gold
  static const Color accentDark = Color(0xFFD9A336);

  // Surfaces & Backgrounds
  static const Color background = Color(0xFFF7F9FC);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surfaceHover = Color(0xFFF1F5F9);
  static const Color border = Color(0xFFE2E8F0);

  // Typography
  static const Color textPrimary = Color(0xFF172B3A); // 4.5:1 WCAG AA compliant
  static const Color textSecondary = Color(0xFF617386);
  static const Color textTertiary = Color(0xFF94A3B8);

  // Semantic Lifecycle Badges
  static const Color success = Color(0xFF16845B);
  static const Color successLight = Color(0xFFDCFCE7);
  static const Color warning = Color(0xFFB7791F);
  static const Color warningLight = Color(0xFFFEF3C7);
  static const Color error = Color(0xFFC83B3B);
  static const Color errorLight = Color(0xFFFEE2E2);
  static const Color info = Color(0xFF2463B5);
  static const Color infoLight = Color(0xFFDBEAFE);
}
