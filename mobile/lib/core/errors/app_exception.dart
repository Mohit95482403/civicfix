/// Base Domain Exception for CivicFix Mobile
class AppException implements Exception {
  final String message;
  final String? code;
  final dynamic details;

  const AppException({
    required this.message,
    this.code,
    this.details,
  });

  @override
  String toString() => 'AppException: $message (code: $code)';
}

class NetworkException extends AppException {
  const NetworkException({
    required super.message,
    super.code = 'NETWORK_ERROR',
    super.details,
  });
}

class ApiException extends AppException {
  final int? statusCode;

  const ApiException({
    required super.message,
    super.code = 'API_ERROR',
    this.statusCode,
    super.details,
  });
}
