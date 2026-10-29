import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../config/env_config.dart';
import '../errors/app_exception.dart';
import 'auth_service.dart';

final envConfigProvider = Provider<EnvConfig>((ref) {
  return EnvConfig.fromEnvironment();
});

final apiClientProvider = Provider<ApiClient>((ref) {
  final config = ref.watch(envConfigProvider);
  return ApiClient(config: config);
});

/// Reusable HTTP API Client powered by Dio with Token Interceptor & Error Normalization
class ApiClient {
  late final Dio _dio;

  ApiClient({required EnvConfig config}) {
    _dio = Dio(
      BaseOptions(
        baseUrl: config.apiBaseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 15),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    // Logging & Request Interceptors
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          final token = AuthService.accessToken;
          if (token != null && !options.headers.containsKey('Authorization')) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onError: (DioException error, handler) {
          final appError = _handleDioError(error);
          return handler.reject(
            DioException(
              requestOptions: error.requestOptions,
              error: appError,
              message: appError.message,
            ),
          );
        },
      ),
    );
  }

  Future<Response<T>> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
  }) async {
    return _dio.get<T>(path, queryParameters: queryParameters);
  }

  Future<Response<T>> post<T>(String path, {dynamic data}) async {
    return _dio.post<T>(path, data: data);
  }

  Future<Response<T>> patch<T>(String path, {dynamic data}) async {
    return _dio.patch<T>(path, data: data);
  }

  Future<Response<T>> delete<T>(String path, {dynamic data}) async {
    return _dio.delete<T>(path, data: data);
  }

  AppException _handleDioError(DioException error) {
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return const NetworkException(
          message:
              'Connection timed out. Please check your internet connection.',
          code: 'TIMEOUT',
        );
      case DioExceptionType.badResponse:
        final statusCode = error.response?.statusCode;
        final data = error.response?.data;
        String message = 'Server returned an error ($statusCode)';
        if (data is Map) {
          if (data['error'] != null && data['error'] is Map) {
            final errObj = data['error'] as Map;
            if (errObj['message'] != null) {
              message = errObj['message'].toString();
            }
          } else if (data['message'] != null) {
            message = data['message'].toString();
          }
        }
        return ApiException(
          message: message,
          statusCode: statusCode,
          details: data,
        );
      default:
        return NetworkException(
          message: error.message ?? 'An unexpected network failure occurred.',
        );
    }
  }
}
