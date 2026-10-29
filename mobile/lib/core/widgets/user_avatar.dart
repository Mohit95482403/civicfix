import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';

class UserAvatar extends StatelessWidget {
  final String? name;
  final double size;
  final String? imageUrl;

  const UserAvatar({super.key, this.name, this.size = 38.0, this.imageUrl});

  String get _initials {
    if (name == null || name!.trim().isEmpty) return 'CF';
    final parts = name!.trim().split(' ').where((p) => p.isNotEmpty).toList();
    if (parts.isEmpty) return 'CF';
    if (parts.length == 1) return parts.first.substring(0, 1).toUpperCase();
    return '${parts.first[0]}${parts.last[0]}'.toUpperCase();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: AppColors.primaryLight,
        shape: BoxShape.circle,
        border: Border.all(color: AppColors.border, width: 1.2),
      ),
      alignment: Alignment.center,
      child: Text(
        _initials,
        style: TextStyle(
          color: AppColors.primary,
          fontWeight: FontWeight.bold,
          fontSize: size * 0.38,
        ),
      ),
    );
  }
}
