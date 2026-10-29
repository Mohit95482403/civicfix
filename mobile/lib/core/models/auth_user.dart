class AuthUser {
  final String id;
  final String email;
  final String fullName;
  final String? phone;
  final String role;
  final bool emailVerified;
  final String? avatarPath;

  const AuthUser({
    required this.id,
    required this.email,
    required this.fullName,
    this.phone,
    required this.role,
    required this.emailVerified,
    this.avatarPath,
  });

  factory AuthUser.fromJson(Map<String, dynamic> json) {
    return AuthUser(
      id: json['id'] as String? ?? '',
      email: json['email'] as String? ?? '',
      fullName: json['fullName'] as String? ?? json['full_name'] as String? ?? '',
      phone: json['phone'] as String? ?? json['phone_number'] as String?,
      role: json['role'] as String? ?? 'citizen',
      emailVerified: json['emailVerified'] as bool? ?? json['email_verified'] as bool? ?? false,
      avatarPath: json['avatarPath'] as String? ?? json['avatar_path'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'fullName': fullName,
      'phone': phone,
      'role': role,
      'emailVerified': emailVerified,
      'avatarPath': avatarPath,
    };
  }
}

class AuthSession {
  final String accessToken;
  final String refreshToken;
  final int expiresIn;
  final String tokenType;

  const AuthSession({
    required this.accessToken,
    required this.refreshToken,
    required this.expiresIn,
    this.tokenType = 'bearer',
  });

  factory AuthSession.fromJson(Map<String, dynamic> json) {
    return AuthSession(
      accessToken: json['accessToken'] as String? ?? json['access_token'] as String? ?? '',
      refreshToken: json['refreshToken'] as String? ?? json['refresh_token'] as String? ?? '',
      expiresIn: json['expiresIn'] as int? ?? json['expires_in'] as int? ?? 3600,
      tokenType: json['tokenType'] as String? ?? 'bearer',
    );
  }
}
