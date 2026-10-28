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

  /// Default development configuration pointing to local Node.js API Gateway
  factory EnvConfig.development() {
    return const EnvConfig(
      apiBaseUrl: 'http://10.0.2.2:5000/api/v1', // Android emulator loopback to host
      supabaseUrl: 'https://your-project-id.supabase.co',
      supabaseAnonKey: 'your-supabase-anon-key',
      environment: 'development',
    );
  }

  /// Production configuration placeholder (configured via dart-define in CI/CD)
  factory EnvConfig.fromEnvironment() {
    return const EnvConfig(
      apiBaseUrl: String.fromEnvironment(
        'API_BASE_URL',
        defaultValue: 'http://10.0.2.2:5000/api/v1',
      ),
      supabaseUrl: String.fromEnvironment(
        'SUPABASE_URL',
        defaultValue: 'https://your-project-id.supabase.co',
      ),
      supabaseAnonKey: String.fromEnvironment(
        'SUPABASE_ANON_KEY',
        defaultValue: '',
      ),
      environment: String.fromEnvironment(
        'ENV',
        defaultValue: 'development',
      ),
    );
  }
}
