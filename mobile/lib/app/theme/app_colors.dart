import 'package:flutter/material.dart';

/// CivicFix Master Brand & Semantic Color Tokens (Day 7 Design System)
class AppColors {
  AppColors._();

  // Brand Primaries
  static const Color primaryNavy = Color(0xFF16324F); // Deep Navy Header
  static const Color primary = Color(0xFF2563EB); // Vibrant Civic Blue
  static const Color primaryDark = Color(0xFF1D4ED8);
  static const Color primaryLight = Color(0xFFEFF6FF); // 50 tint
  static const Color tealAccent = Color(0xFF0F9D92); // Civic Teal Accent

  // Surfaces & Backgrounds
  static const Color background = Color(0xFFF5F7FB); // Main canvas
  static const Color surface = Color(0xFFFFFFFF); // Card & Modal white
  static const Color surfaceHover = Color(0xFFF1F5F9);
  static const Color border = Color(0xFFE2E8F0); // Subtle divider & stroke
  static const Color borderSubtle = Color(0xFFEEF2F6);

  // Typography
  static const Color textPrimary = Color(0xFF172033); // High-contrast WCAG AA
  static const Color textSecondary = Color(0xFF64748B); // Slate subtitle
  static const Color textTertiary = Color(0xFF94A3B8); // Muted caption

  // Semantic Status Badges
  static const Color success = Color(0xFF15803D); // Resolved
  static const Color successLight = Color(0xFFDCFCE7);
  static const Color warning = Color(0xFFD97706); // Under Review
  static const Color warningLight = Color(0xFFFEF3C7);
  static const Color error = Color(0xFFDC2626); // Critical / Rejected
  static const Color errorLight = Color(0xFFFEE2E2);
  static const Color info = Color(0xFF2563EB); // Submitted
  static const Color infoLight = Color(0xFFDBEAFE);
  static const Color inProgress = Color(0xFF0F9D92); // In Progress (Teal)
  static const Color inProgressLight = Color(0xFFCCFBF1);
}
