import 'package:flutter/material.dart';

/// CivicFix Spacing & Dimension Standards
class AppDimensions {
  AppDimensions._();

  // Spacings
  static const double xs = 4.0;
  static const double sm = 8.0;
  static const double md = 12.0;
  static const double base = 16.0;
  static const double lg = 20.0;
  static const double xl = 24.0;
  static const double xxl = 32.0;

  // Radiuses
  static const double radiusSm = 6.0;
  static const double radiusMd = 10.0;
  static const double radiusLg = 14.0;
  static const double radiusXl = 20.0;
  static const double radiusFull = 999.0;

  // Touch Target Minimums
  static const double minTouchTarget = 48.0;
  static const double buttonHeight = 48.0;
  static const double inputHeight = 48.0;

  // Standard Insets
  static const EdgeInsets pagePadding = EdgeInsets.symmetric(
    horizontal: 20.0,
    vertical: 16.0,
  );
  static const EdgeInsets cardPadding = EdgeInsets.all(16.0);
}
