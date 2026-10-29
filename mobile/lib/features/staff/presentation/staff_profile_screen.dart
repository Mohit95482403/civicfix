import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../app/theme/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';
import '../../../core/widgets/app_button.dart';
import '../../../core/widgets/app_card.dart';
import '../../auth/providers/auth_provider.dart';

class StaffProfileScreen extends ConsumerWidget {
  const StaffProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authNotifierProvider);
    final user = authState.user;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(
          'Staff Profile & Credentials',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
      ),
      body: SingleChildScrollView(
        padding: AppDimensions.pagePadding,
        child: Column(
          children: [
            // Technician ID Badge Card
            AppCard(
              padding: const EdgeInsets.all(AppDimensions.lg),
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 36,
                    backgroundColor: AppColors.primary,
                    child: Text(
                      user?.fullName.isNotEmpty == true
                          ? user!.fullName[0].toUpperCase()
                          : 'S',
                      style: const TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  const SizedBox(height: AppDimensions.sm),
                  Text(
                    user?.fullName ?? 'Field Technician',
                    style: AppTypography.pageHeading,
                  ),
                  const SizedBox(height: 2),
                  Text(
                    user?.email ?? 'staff@bbmp.gov.in',
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: AppDimensions.md),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.tealAccent.withAlpha(30),
                      borderRadius: BorderRadius.circular(
                        AppDimensions.radiusFull,
                      ),
                      border: Border.all(
                        color: AppColors.tealAccent.withAlpha(80),
                      ),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(
                          Icons.verified_user_rounded,
                          color: AppColors.tealAccent,
                          size: 16,
                        ),
                        const SizedBox(width: 6),
                        Text(
                          'ROLE: ${(user?.role ?? 'STAFF').toUpperCase()}',
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: AppColors.tealAccent,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: AppDimensions.base),

            // Official Municipal Deployment Info
            AppCard(
              padding: const EdgeInsets.all(AppDimensions.base),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Jurisdiction & Organization',
                    style: AppTypography.sectionTitle,
                  ),
                  const SizedBox(height: AppDimensions.md),
                  _infoRow(
                    Icons.account_balance_rounded,
                    'Organization',
                    user?.organizationName ?? 'Bengaluru Urban Municipal Corp',
                  ),
                  const Divider(height: 20),
                  _infoRow(
                    Icons.business_center_rounded,
                    'Department',
                    user?.departmentName ?? 'Roads & Infrastructure Department',
                  ),
                  const Divider(height: 20),
                  _infoRow(
                    Icons.access_time_filled_rounded,
                    'Shift Schedule',
                    'Day Shift: 08:00 AM - 05:00 PM (IST)',
                  ),
                  const Divider(height: 20),
                  _infoRow(
                    Icons.phone_in_talk_rounded,
                    'Emergency Dispatch Line',
                    '+91 80 2266 0000',
                  ),
                ],
              ),
            ),

            const SizedBox(height: AppDimensions.base),

            // Performance Metrics
            AppCard(
              padding: const EdgeInsets.all(AppDimensions.base),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Performance Statistics',
                    style: AppTypography.sectionTitle,
                  ),
                  const SizedBox(height: AppDimensions.md),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _metricCol('Total Resolved', '142'),
                      _metricCol('Avg Time', '18.4 hrs'),
                      _metricCol('SLA Rating', '98.2%'),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: AppDimensions.xl),

            // Logout Button
            AppButton(
              label: 'Sign Out of Staff Portal',
              icon: Icons.logout_rounded,
              isOutlined: true,
              onPressed: () => ref.read(authNotifierProvider.notifier).logout(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _infoRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, size: 18, color: AppColors.textSecondary),
        const SizedBox(width: AppDimensions.sm),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: AppTypography.caption),
            const SizedBox(height: 2),
            Text(
              value,
              style: AppTypography.bodySmall.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _metricCol(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: AppColors.primary,
          ),
        ),
        const SizedBox(height: 2),
        Text(label, style: AppTypography.caption),
      ],
    );
  }
}
