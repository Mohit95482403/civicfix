import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/config/env_config.dart';
import '../../../core/models/auth_user.dart';
import '../../../core/network/auth_service.dart';

enum AuthStatus {
  initial,
  loading,
  authenticated,
  unauthenticated,
  verificationPending,
  error,
}

class AuthState {
  final AuthStatus status;
  final AuthUser? user;
  final String? errorMessage;
  final bool emailVerificationRequired;

  const AuthState({
    required this.status,
    this.user,
    this.errorMessage,
    this.emailVerificationRequired = false,
  });

  factory AuthState.initial() => const AuthState(status: AuthStatus.initial);

  AuthState copyWith({
    AuthStatus? status,
    AuthUser? user,
    String? errorMessage,
    bool? emailVerificationRequired,
  }) {
    return AuthState(
      status: status ?? this.status,
      user: user ?? this.user,
      errorMessage: errorMessage,
      emailVerificationRequired:
          emailVerificationRequired ?? this.emailVerificationRequired,
    );
  }
}

final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService(config: EnvConfig.development());
});

final authNotifierProvider =
    NotifierProvider<AuthNotifier, AuthState>(AuthNotifier.new);

class AuthNotifier extends Notifier<AuthState> {
  late final AuthService _authService;

  @override
  AuthState build() {
    _authService = ref.watch(authServiceProvider);
    return AuthState.initial();
  }

  /// Check existing session on splash / app startup
  Future<void> restoreSession() async {
    if (!AuthService.isAuthenticated) {
      state = const AuthState(status: AuthStatus.unauthenticated);
      return;
    }

    try {
      final user = await _authService.getMe();
      state = state.copyWith(
        status: AuthStatus.authenticated,
        user: user,
      );
    } catch (_) {
      AuthService.clearTokens();
      state = const AuthState(status: AuthStatus.unauthenticated);
    }
  }

  Future<void> login({
    required String email,
    required String password,
  }) async {
    state = state.copyWith(status: AuthStatus.loading, errorMessage: null);

    try {
      final result = await _authService.login(email: email, password: password);

      if (result.emailVerificationRequired && result.session == null) {
        state = state.copyWith(
          status: AuthStatus.verificationPending,
          emailVerificationRequired: true,
          user: result.user,
        );
        return;
      }

      state = state.copyWith(
        status: AuthStatus.authenticated,
        user: result.user,
      );
    } catch (e) {
      state = state.copyWith(
        status: AuthStatus.error,
        errorMessage: e.toString().replaceFirst('Exception: ', ''),
      );
    }
  }

  Future<void> registerCitizen({
    required String fullName,
    required String email,
    required String password,
    String? phone,
  }) async {
    state = state.copyWith(status: AuthStatus.loading, errorMessage: null);

    try {
      final result = await _authService.registerCitizen(
        fullName: fullName,
        email: email,
        password: password,
        phone: phone,
      );

      if (result.emailVerificationRequired && result.session == null) {
        state = state.copyWith(
          status: AuthStatus.verificationPending,
          emailVerificationRequired: true,
          user: result.user,
        );
        return;
      }

      state = state.copyWith(
        status: AuthStatus.authenticated,
        user: result.user,
      );
    } catch (e) {
      state = state.copyWith(
        status: AuthStatus.error,
        errorMessage: e.toString().replaceFirst('Exception: ', ''),
      );
    }
  }

  Future<void> updateProfile({
    String? fullName,
    String? phone,
    String? preferredLanguage,
  }) async {
    state = state.copyWith(status: AuthStatus.loading, errorMessage: null);

    try {
      final updatedUser = await _authService.updateProfile(
        fullName: fullName,
        phone: phone,
        preferredLanguage: preferredLanguage,
      );
      state = state.copyWith(
        status: AuthStatus.authenticated,
        user: updatedUser,
      );
    } catch (e) {
      state = state.copyWith(
        status: AuthStatus.error,
        errorMessage: e.toString().replaceFirst('Exception: ', ''),
      );
    }
  }

  Future<void> resetPassword({required String newPassword}) async {
    state = state.copyWith(status: AuthStatus.loading, errorMessage: null);

    try {
      await _authService.resetPassword(newPassword: newPassword);
      state = state.copyWith(status: AuthStatus.unauthenticated);
    } catch (e) {
      state = state.copyWith(
        status: AuthStatus.error,
        errorMessage: e.toString().replaceFirst('Exception: ', ''),
      );
      rethrow;
    }
  }

  Future<void> logout() async {
    await _authService.logout();
    state = const AuthState(status: AuthStatus.unauthenticated);
  }

  Future<String> forgotPassword(String email) async {
    return _authService.forgotPassword(email: email);
  }

  void clearError() {
    state = state.copyWith(errorMessage: null);
  }
}
