import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/theme/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/complaint_status_badge.dart';
import '../../../core/widgets/empty_state_widget.dart';
import '../../../core/widgets/section_header.dart';
import '../../../core/widgets/stat_card.dart';
import '../../../core/widgets/user_avatar.dart';
import '../../auth/providers/auth_provider.dart';
import '../providers/dashboard_provider.dart';

class HomeDashboardScreen extends ConsumerWidget {
  const HomeDashboardScreen({super.key});

  String _getTimeBasedGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authNotifierProvider);
    final dashboardData = ref.watch(dashboardNotifierProvider);
    final user = authState.user;

    final firstName = user?.fullName.split(' ').first ?? 'Citizen';
    final greeting = '${_getTimeBasedGreeting()}, $firstName';

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: RefreshIndicator(
          color: AppColors.primary,
          onRefresh: () async {
            await ref.read(dashboardNotifierProvider.notifier).refresh();
          },
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.symmetric(
              horizontal: AppDimensions.base,
              vertical: AppDimensions.md,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Top Welcome Header
                Row(
                  children: [
                    UserAvatar(name: user?.fullName, size: 44),
                    const SizedBox(width: AppDimensions.md),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            greeting,
                            style: AppTypography.pageHeading.copyWith(
                              fontSize: 18,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 2),
                          const Text(
                            "Let's make your neighbourhood better.",
                            style: AppTypography.bodySmall,
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(
                        Icons.notifications_none_rounded,
                        color: AppColors.textPrimary,
                      ),
                      onPressed: () => context.push('/notifications'),
                      tooltip: 'Notifications',
                    ),
                  ],
                ),
                const SizedBox(height: AppDimensions.base),

                // Main Hero Action Card
                Container(
                  padding: const EdgeInsets.all(AppDimensions.lg),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [AppColors.primaryNavy, Color(0xFF1E40AF)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
                    boxShadow: const [
                      BoxShadow(
                        color: Color(0x2216324F),
                        blurRadius: 16,
                        offset: Offset(0, 6),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: AppDimensions.sm,
                              vertical: AppDimensions.xs,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.white.withAlpha(35),
                              borderRadius: BorderRadius.circular(
                                AppDimensions.radiusFull,
                              ),
                            ),
                            child: const Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  Icons.flash_on_rounded,
                                  size: 12,
                                  color: Colors.amber,
                                ),
                                SizedBox(width: 4),
                                Text(
                                  'CITIZEN PORTAL',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: 0.6,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: AppDimensions.md),
                      const Text(
                        'Report a Civic Issue',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          letterSpacing: -0.3,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Help your municipal authority locate and resolve broken roads, streetlights, or waste dumps.',
                        style: TextStyle(
                          color: Colors.white.withAlpha(210),
                          fontSize: 12,
                          height: 1.4,
                        ),
                      ),
                      const SizedBox(height: AppDimensions.base),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          onPressed: () => context.push('/complaints/new'),
                          icon: const Icon(
                            Icons.add_a_photo_outlined,
                            size: 18,
                          ),
                          label: const Text('Report an Issue'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.tealAccent,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 13),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(
                                AppDimensions.radiusMd,
                              ),
                            ),
                            elevation: 0,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: AppDimensions.base),

                // Complaint Statistics Cards (Total Submitted, In Progress, Resolved)
                Row(
                  children: [
                    Expanded(
                      child: StatCard(
                        title: 'Submitted',
                        count: '${dashboardData.stats.totalSubmitted}',
                        icon: Icons.assignment_outlined,
                        iconColor: AppColors.info,
                      ),
                    ),
                    const SizedBox(width: AppDimensions.sm),
                    Expanded(
                      child: StatCard(
                        title: 'In Progress',
                        count: '${dashboardData.stats.inProgress}',
                        icon: Icons.hourglass_top_rounded,
                        iconColor: AppColors.inProgress,
                      ),
                    ),
                    const SizedBox(width: AppDimensions.sm),
                    Expanded(
                      child: StatCard(
                        title: 'Resolved',
                        count: '${dashboardData.stats.resolved}',
                        icon: Icons.check_circle_outline_rounded,
                        iconColor: AppColors.success,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppDimensions.base),

                // Quick Action Shortcuts Grid
                const SectionHeader(title: 'Quick Services'),
                Row(
                  children: [
                    Expanded(
                      child: _QuickActionItem(
                        icon: Icons.map_outlined,
                        iconColor: AppColors.primary,
                        label: 'Nearby Issues',
                        onTap: () => context.push('/nearby'),
                      ),
                    ),
                    const SizedBox(width: AppDimensions.sm),
                    Expanded(
                      child: _QuickActionItem(
                        icon: Icons.track_changes_rounded,
                        iconColor: AppColors.tealAccent,
                        label: 'Track Status',
                        onTap: () => context.push('/complaints'),
                      ),
                    ),
                    const SizedBox(width: AppDimensions.sm),
                    Expanded(
                      child: _QuickActionItem(
                        icon: Icons.support_agent_rounded,
                        iconColor: AppColors.warning,
                        label: 'Ward Desk',
                        onTap: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text(
                                'Ward Control Room directory: BBMP 1533 / PMC 1800-1030-222',
                              ),
                              behavior: SnackBarBehavior.floating,
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppDimensions.base),

                // Recent Complaints Section
                SectionHeader(
                  title: 'My Recent Reports',
                  actionLabel: 'View All',
                  onActionTap: () => context.push('/complaints'),
                ),

                if (dashboardData.recentComplaints.isEmpty)
                  AppCard(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppDimensions.base,
                      vertical: AppDimensions.xl,
                    ),
                    child: EmptyStateWidget(
                      icon: Icons.check_box_outline_blank_rounded,
                      title: "You haven't reported any issues yet",
                      description:
                          'When you submit a civic issue, tracking updates and proof of repair appear here.',
                      buttonLabel: 'Report Your First Issue',
                      onButtonPressed: () => context.push('/complaints/new'),
                    ),
                  )
                else
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: dashboardData.recentComplaints.length,
                    separatorBuilder: (context, index) =>
                        const SizedBox(height: AppDimensions.sm),
                    itemBuilder: (context, index) {
                      final item = dashboardData.recentComplaints[index];
                      return AppCard(
                        padding: const EdgeInsets.all(AppDimensions.md),
                        onTap: () => context.push('/complaints'),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  item.complaintNumber,
                                  style: AppTypography.bodySmall.copyWith(
                                    fontWeight: FontWeight.bold,
                                    color: AppColors.primary,
                                  ),
                                ),
                                ComplaintStatusBadge(status: item.status),
                              ],
                            ),
                            const SizedBox(height: AppDimensions.xs),
                            Text(
                              item.title,
                              style: AppTypography.cardHeading,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: AppDimensions.xs),
                            Row(
                              children: [
                                const Icon(
                                  Icons.location_on_outlined,
                                  size: 14,
                                  color: AppColors.textTertiary,
                                ),
                                const SizedBox(width: 4),
                                Expanded(
                                  child: Text(
                                    item.address,
                                    style: AppTypography.bodySmall,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                const SizedBox(height: AppDimensions.xxl + 20),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _QuickActionItem extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String label;
  final VoidCallback onTap;

  const _QuickActionItem({
    required this.icon,
    required this.iconColor,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: const EdgeInsets.symmetric(
        horizontal: AppDimensions.sm,
        vertical: AppDimensions.md,
      ),
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(AppDimensions.sm),
            decoration: BoxDecoration(
              color: iconColor.withAlpha(22),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, size: 20, color: iconColor),
          ),
          const SizedBox(height: AppDimensions.xs + 2),
          Text(
            label,
            textAlign: TextAlign.center,
            style: AppTypography.bodySmall.copyWith(
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}
