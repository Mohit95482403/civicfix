import 'package:dio/dio.dart';
import '../config/env_config.dart';
import '../models/auth_user.dart';

class AuthResult {
  final AuthUser? user;
  final AuthSession? session;
  final bool emailVerificationRequired;
  final String? message;

  const AuthResult({
    this.user,
    this.session,
    this.emailVerificationRequired = false,
    this.message,
  });
}

class AuthService {
  final Dio _dio;
  static String? _accessToken;
  static String? _refreshToken;

  AuthService({required EnvConfig config})
      : _dio = Dio(
          BaseOptions(
            baseUrl: config.apiBaseUrl.replaceFirst('/v1', ''),
            connectTimeout: const Duration(seconds: 15),
            receiveTimeout: const Duration(seconds: 15),
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          ),
        );

  static String? get accessToken => _accessToken;
  static String? get refreshToken => _refreshToken;
  static bool get isAuthenticated => _accessToken != null;

  static void setTokens({required String access, String? refresh}) {
    _accessToken = access;
    if (refresh != null) _refreshToken = refresh;
  }

  static void clearTokens() {
    _accessToken = null;
    _refreshToken = null;
  }

  /// Register new citizen account (strictly citizen role)
  Future<AuthResult> registerCitizen({
    required String fullName,
    required String email,
    required String password,
    String? phone,
  }) async {
    try {
      final response = await _dio.post(
        '/auth/register',
        data: {
          'fullName': fullName,
          'email': email.trim().toLowerCase(),
          'password': password,
          if (phone != null && phone.trim().isNotEmpty) 'phone': phone.trim(),
        },
      );

      final body = response.data as Map<String, dynamic>;
      final data = body['data'] as Map<String, dynamic>? ?? {};

      final user = data['user'] != null
          ? AuthUser.fromJson(data['user'] as Map<String, dynamic>)
          : null;
      final session = data['session'] != null
          ? AuthSession.fromJson(data['session'] as Map<String, dynamic>)
          : null;

      if (session != null) {
        setTokens(access: session.accessToken, refresh: session.refreshToken);
      }

      return AuthResult(
        user: user,
        session: session,
        emailVerificationRequired: data['emailVerificationRequired'] as bool? ?? false,
        message: body['message'] as String?,
      );
    } on DioException catch (e) {
      throw _parseError(e);
    }
  }

  /// Sign in with email and password
  Future<AuthResult> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _dio.post(
        '/auth/login',
        data: {
          'email': email.trim().toLowerCase(),
          'password': password,
        },
      );

      final body = response.data as Map<String, dynamic>;
      final data = body['data'] as Map<String, dynamic>? ?? {};

      final user = data['user'] != null
          ? AuthUser.fromJson(data['user'] as Map<String, dynamic>)
          : null;
      final session = data['session'] != null
          ? AuthSession.fromJson(data['session'] as Map<String, dynamic>)
          : null;

      if (session != null) {
        setTokens(access: session.accessToken, refresh: session.refreshToken);
      }

      return AuthResult(
        user: user,
        session: session,
        emailVerificationRequired: data['emailVerificationRequired'] as bool? ?? false,
        message: body['message'] as String?,
      );
    } on DioException catch (e) {
      throw _parseError(e);
    }
  }

  /// Fetch authenticated citizen profile
  Future<AuthUser> getMe() async {
    if (_accessToken == null) {
      throw Exception('Unauthenticated: Access token required.');
    }

    try {
      final response = await _dio.get(
        '/auth/me',
        options: Options(
          headers: {'Authorization': 'Bearer $_accessToken'},
        ),
      );

      final body = response.data as Map<String, dynamic>;
      final data = body['data'] as Map<String, dynamic>? ?? {};
      final userData = data['user'] as Map<String, dynamic>;

      return AuthUser.fromJson(userData);
    } on DioException catch (e) {
      if (e.response?.statusCode == 401) {
        clearTokens();
      }
      throw _parseError(e);
    }
  }

  /// Request password recovery email
  Future<String> forgotPassword({required String email}) async {
    try {
      final response = await _dio.post(
        '/auth/forgot-password',
        data: {'email': email.trim().toLowerCase()},
      );

      final body = response.data as Map<String, dynamic>;
      return body['message'] as String? ?? 'Password recovery email dispatched.';
    } on DioException catch (e) {
      throw _parseError(e);
    }
  }

  /// Reset password completion
  Future<void> resetPassword({required String newPassword}) async {
    try {
      await _dio.post(
        '/auth/reset-password',
        data: {'newPassword': newPassword},
        options: Options(
          headers: {'Authorization': 'Bearer $_accessToken'},
        ),
      );
    } on DioException catch (e) {
      throw _parseError(e);
    }
  }

  /// Fetch full user profile
  Future<Map<String, dynamic>> getProfile() async {
    try {
      final response = await _dio.get(
        '/profile',
        options: Options(
          headers: {'Authorization': 'Bearer $_accessToken'},
        ),
      );

      final body = response.data as Map<String, dynamic>;
      return body['data'] as Map<String, dynamic>? ?? {};
    } on DioException catch (e) {
      throw _parseError(e);
    }
  }

  /// Update permitted profile fields (fullName, phoneNumber, preferredLanguage)
  Future<AuthUser> updateProfile({
    String? fullName,
    String? phone,
    String? preferredLanguage,
  }) async {
    try {
      final payload = <String, dynamic>{};
      if (fullName != null && fullName.trim().isNotEmpty) payload['fullName'] = fullName.trim();
      if (phone != null) payload['phoneNumber'] = phone.trim();
      if (preferredLanguage != null) payload['preferredLanguage'] = preferredLanguage;

      final response = await _dio.patch(
        '/profile',
        data: payload,
        options: Options(
          headers: {'Authorization': 'Bearer $_accessToken'},
        ),
      );

      final body = response.data as Map<String, dynamic>;
      final data = body['data'] as Map<String, dynamic>? ?? {};
      final profile = data['profile'] as Map<String, dynamic>? ?? {};

      return AuthUser.fromJson(profile);
    } on DioException catch (e) {
      throw _parseError(e);
    }
  }

  /// Terminate session and clear credentials
  Future<void> logout() async {
    try {
      if (_accessToken != null) {
        await _dio.post(
          '/auth/logout',
          options: Options(
            headers: {'Authorization': 'Bearer $_accessToken'},
          ),
        );
      }
    } catch (_) {
      // Graceful local cleanup even if remote call fails
    } finally {
      clearTokens();
    }
  }

  Exception _parseError(DioException error) {
    if (error.response?.data is Map) {
      final data = error.response!.data as Map<String, dynamic>;
      if (data['error'] != null && data['error']['message'] != null) {
        return Exception(data['error']['message'].toString());
      }
      if (data['message'] != null) {
        return Exception(data['message'].toString());
      }
    }
    return Exception(
      error.message ?? 'A network communication error occurred. Please try again.',
    );
  }
}
