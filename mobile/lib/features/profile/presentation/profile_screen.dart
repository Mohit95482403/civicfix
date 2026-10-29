import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/theme/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';
import '../../../core/widgets/app_button.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/user_avatar.dart';
import '../../auth/providers/auth_provider.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  void _showLogoutDialog(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Sign Out'),
        content: const Text(
          'Are you sure you want to sign out of your CivicFix account? Your local session credentials will be discarded.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(ctx).pop();
              ref.read(authNotifierProvider.notifier).logout();
              context.go('/login');
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.error,
              foregroundColor: Colors.white,
            ),
            child: const Text('Sign Out'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authNotifierProvider);
    final user = authState.user;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Citizen Profile'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit_outlined),
            tooltip: 'Edit Profile',
            onPressed: () => context.push('/profile/edit'),
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppDimensions.base),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // User Identity Card
              AppCard(
                padding: const EdgeInsets.all(AppDimensions.lg),
                child: Column(
                  children: [
                    UserAvatar(name: user?.fullName, size: 72),
                    const SizedBox(height: AppDimensions.md),
                    Text(
                      user?.fullName ?? 'Citizen User',
                      style: AppTypography.pageHeading.copyWith(fontSize: 20),
                    ),
                    const SizedBox(height: AppDimensions.xs),
                    Text(
                      user?.email ?? 'citizen@example.com',
                      style: AppTypography.bodyMedium,
                    ),
                    const SizedBox(height: AppDimensions.sm),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: AppDimensions.md,
                        vertical: AppDimensions.xs,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.primaryLight,
                        borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
                      ),
                      child: Text(
                        (user?.role ?? 'citizen').toUpperCase(),
                        style: const TextStyle(
                          color: AppColors.primary,
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.8,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppDimensions.base),

              // Contact Details Section
              const Text('Account Information', style: AppTypography.sectionHeading),
              const SizedBox(height: AppDimensions.sm),
              AppCard(
                padding: const EdgeInsets.all(AppDimensions.base),
                child: Column(
                  children: [
                    _InfoRow(
                      icon: Icons.phone_outlined,
                      label: 'Phone Number',
                      value: user?.phone?.isNotEmpty == true
                          ? user!.phone!
                          : 'Not registered',
                    ),
                    const Divider(height: 24, color: AppColors.border),
                    _InfoRow(
                      icon: Icons.verified_user_outlined,
                      label: 'Account Status',
                      value: user?.emailVerified == true
                          ? 'Verified Citizen'
                          : 'Email Verification Pending',
                      valueColor: user?.emailVerified == true
                          ? AppColors.success
                          : AppColors.warning,
                    ),
                    const Divider(height: 24, color: AppColors.border),
                    const _InfoRow(
                      icon: Icons.language_rounded,
                      label: 'Preferred Language',
                      value: 'English (Default)',
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppDimensions.base),

              // Actions
              AppButton(
                label: 'Edit Profile Information',
                icon: Icons.edit_outlined,
                variant: AppButtonVariant.outlined,
                onPressed: () => context.push('/profile/edit'),
              ),
              const SizedBox(height: AppDimensions.sm),

              AppButton(
                label: 'Sign Out',
                icon: Icons.logout_rounded,
                variant: AppButtonVariant.danger,
                onPressed: () => _showLogoutDialog(context, ref),
              ),
              const SizedBox(height: AppDimensions.lg),

              // Legal notice
              const Text(
                'CivicFix adheres to the Digital Personal Data Protection (DPDP) Act 2023. User profile data is stored with encrypted transit and strict row-level security isolation.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 11,
                  color: AppColors.textTertiary,
                  height: 1.4,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color? valueColor;

  const _InfoRow({
    required this.icon,
    required this.label,
    required this.value,
    this.valueColor,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 20, color: AppColors.textSecondary),
        const SizedBox(width: AppDimensions.md),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: AppTypography.bodySmall),
              const SizedBox(height: 1),
              Text(
                value,
                style: AppTypography.cardHeading.copyWith(
                  color: valueColor ?? AppColors.textPrimary,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
