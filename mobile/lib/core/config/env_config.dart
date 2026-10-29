import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

/// Application Environment Configuration
/// Encapsulates environment-specific settings (API endpoints, Supabase endpoints).
/// Sensitive service-role keys are NEVER bundled into mobile builds.
class EnvConfig {
  final String apiBaseUrl;
  final String supabaseUrl;
  final String supabaseAnonKey;
  final String environment;

  const EnvConfig({
    required this.apiBaseUrl,
    required this.supabaseUrl,
    required this.supabaseAnonKey,
    this.environment = 'development',
  });

  /// Automatically resolves correct host loopback:
  /// Web & Desktop -> localhost:5000
  /// Android Emulator -> 10.0.2.2:5000
  static String get defaultDevBaseUrl {
    if (kIsWeb) return 'http://localhost:5000/api/v1';
    try {
      if (Platform.isAndroid) return 'http://10.0.2.2:5000/api/v1';
    } catch (_) {}
    return 'http://localhost:5000/api/v1';
  }

  /// Default development configuration pointing to local Node.js API Gateway
  factory EnvConfig.development() {
    return EnvConfig(
      apiBaseUrl: defaultDevBaseUrl,
      supabaseUrl: 'https://your-project-id.supabase.co',
      supabaseAnonKey: 'your-supabase-anon-key',
      environment: 'development',
    );
  }

  /// Production configuration placeholder (configured via dart-define in CI/CD)
  factory EnvConfig.fromEnvironment() {
    const definedUrl = String.fromEnvironment('API_BASE_URL');
    return EnvConfig(
      apiBaseUrl: definedUrl.isNotEmpty ? definedUrl : defaultDevBaseUrl,
      supabaseUrl: const String.fromEnvironment(
        'SUPABASE_URL',
        defaultValue: 'https://your-project-id.supabase.co',
      ),
      supabaseAnonKey: const String.fromEnvironment(
        'SUPABASE_ANON_KEY',
        defaultValue: '',
      ),
      environment: const String.fromEnvironment(
        'ENV',
        defaultValue: 'development',
      ),
    );
  }
}
