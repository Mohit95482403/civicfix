import 'package:dio/dio.dart';
import '../config/env_config.dart';
import '../errors/app_exception.dart';

/// Reusable HTTP API Client powered by Dio
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
          // Future Auth Interceptor: Attach Supabase JWT Bearer token here
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

  Future<Response<T>> post<T>(
    String path, {
    dynamic data,
  }) async {
    return _dio.post<T>(path, data: data);
  }

  AppException _handleDioError(DioException error) {
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return const NetworkException(
          message: 'Connection timed out. Please check your internet connection.',
          code: 'TIMEOUT',
        );
      case DioExceptionType.badResponse:
        final statusCode = error.response?.statusCode;
        final data = error.response?.data;
        String message = 'Server returned an error ($statusCode)';
        if (data is Map && data['error'] != null && data['error']['message'] != null) {
          message = data['error']['message'].toString();
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
