import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/theme/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/complaint_status_badge.dart';
import '../../../core/widgets/stat_card.dart';
import '../../auth/providers/auth_provider.dart';

class StaffDashboardScreen extends ConsumerStatefulWidget {
  const StaffDashboardScreen({super.key});

  @override
  ConsumerState<StaffDashboardScreen> createState() =>
      _StaffDashboardScreenState();
}

class _StaffDashboardScreenState extends ConsumerState<StaffDashboardScreen> {
  // Mock field work order items
  final List<Map<String, dynamic>> _workOrders = [
    {
      'id': 'wo-101',
      'complaintNumber': 'CF-2026-0814',
      'title': 'Dangerous Deep Pothole on Outer Ring Road',
      'category': 'Roads & Infrastructure',
      'status': 'in_progress',
      'priority': 'critical',
      'address': 'Near Marathahalli Bridge, Outer Ring Road',
      'slaHoursLeft': 4,
      'assignedAt': '2 hrs ago',
    },
    {
      'id': 'wo-102',
      'complaintNumber': 'CF-2026-0815',
      'title': 'Garbage Overflow near Metro Station Gate 2',
      'category': 'Solid Waste Management',
      'status': 'assigned',
      'priority': 'high',
      'address': 'Indiranagar 100ft Road Metro Exit',
      'slaHoursLeft': 11,
      'assignedAt': '3 hrs ago',
    },
    {
      'id': 'wo-103',
      'complaintNumber': 'CF-2026-0818',
      'title': 'Main Water Pipeline Leakage Flooding Crossroad',
      'category': 'Water Supply & Sewage',
      'status': 'assigned',
      'priority': 'critical',
      'address': '12th Main, 4th Block, Koramangala',
      'slaHoursLeft': 2,
      'assignedAt': '30 mins ago',
    },
    {
      'id': 'wo-104',
      'complaintNumber': 'CF-2026-0820',
      'title': 'Damaged Streetlight Pole Flashing Sparking Wires',
      'category': 'Electrical & Lighting',
      'status': 'in_progress',
      'priority': 'high',
      'address': 'CMH Road, opposite BDA Complex',
      'slaHoursLeft': 16,
      'assignedAt': '5 hrs ago',
    },
  ];

  void _showResolutionDialog(Map<String, dynamic> item) {
    final noteController = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Row(
          children: [
            const Icon(Icons.verified_outlined, color: AppColors.success),
            const SizedBox(width: AppDimensions.sm),
            const Text('Complete Work Order'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Item: ${item['complaintNumber']} — ${item['title']}',
              style: AppTypography.bodySmall.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: AppDimensions.md),
            const Text(
              'Proof of Resolution Notes:',
              style: AppTypography.formLabel,
            ),
            const SizedBox(height: AppDimensions.xs),
            TextField(
              controller: noteController,
              maxLines: 3,
              decoration: const InputDecoration(
                hintText:
                    'Detail the repairs completed (e.g. Cold asphalt mix compacted, surface leveled)...',
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.success,
              foregroundColor: Colors.white,
            ),
            onPressed: () {
              setState(() {
                item['status'] = 'resolved';
              });
              Navigator.of(ctx).pop();
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    'Work order ${item['complaintNumber']} marked as RESOLVED.',
                  ),
                  backgroundColor: AppColors.success,
                ),
              );
            },
            child: const Text('Submit Resolution'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authNotifierProvider);
    final user = authState.user;

    final assignedCount = _workOrders
        .where((w) => w['status'] == 'assigned')
        .length;
    final inProgressCount = _workOrders
        .where((w) => w['status'] == 'in_progress')
        .length;
    final resolvedCount = _workOrders
        .where((w) => w['status'] == 'resolved')
        .length;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Field Staff Portal',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            Text(
              user?.departmentName ?? 'BBMP Rapid Response Operations',
              style: const TextStyle(
                fontSize: 11,
                color: AppColors.textSecondary,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            tooltip: 'Refresh Assignments',
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Work orders synced with central dispatch.'),
                  duration: Duration(seconds: 1),
                ),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.logout_rounded),
            tooltip: 'Sign Out',
            onPressed: () => ref.read(authNotifierProvider.notifier).logout(),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          await Future.delayed(const Duration(milliseconds: 600));
          setState(() {});
        },
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: AppDimensions.pagePadding,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Welcome & Department Card
              Container(
                padding: const EdgeInsets.all(AppDimensions.base),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withAlpha(40),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 24,
                      backgroundColor: AppColors.tealAccent,
                      child: const Icon(
                        Icons.engineering_rounded,
                        color: Colors.white,
                        size: 26,
                      ),
                    ),
                    const SizedBox(width: AppDimensions.md),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            user?.fullName ?? 'Field Technician',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 6,
                                  vertical: 2,
                                ),
                                decoration: BoxDecoration(
                                  color: AppColors.tealAccent.withAlpha(60),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(
                                  (user?.role ?? 'STAFF').toUpperCase(),
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              const Text(
                                'Shift: Active (Zone 4)',
                                style: TextStyle(
                                  color: Colors.white70,
                                  fontSize: 11,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: AppDimensions.base),

              // SLA Urgency Alert Banner
              Container(
                padding: const EdgeInsets.all(AppDimensions.md),
                decoration: BoxDecoration(
                  color: AppColors.errorLight,
                  borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
                  border: Border.all(color: AppColors.error.withAlpha(60)),
                ),
                child: Row(
                  children: [
                    const Icon(
                      Icons.warning_amber_rounded,
                      color: AppColors.error,
                      size: 22,
                    ),
                    const SizedBox(width: AppDimensions.sm),
                    Expanded(
                      child: Text(
                        '2 assignments have less than 4 hours before SLA breach. Prioritize pipeline and pothole repairs.',
                        style: AppTypography.bodySmall.copyWith(
                          color: AppColors.error,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: AppDimensions.base),

              // KPI Stats Grid
              Row(
                children: [
                  Expanded(
                    child: StatCard(
                      title: 'Assigned',
                      value: '$assignedCount',
                      subtitle: 'Pending action',
                      icon: Icons.assignment_late_outlined,
                      accentColor: AppColors.warning,
                      onTap: () => context.push('/staff/orders'),
                    ),
                  ),
                  const SizedBox(width: AppDimensions.sm),
                  Expanded(
                    child: StatCard(
                      title: 'In Progress',
                      value: '$inProgressCount',
                      subtitle: 'Active crews',
                      icon: Icons.hourglass_top_rounded,
                      accentColor: AppColors.inProgress,
                      onTap: () => context.push('/staff/orders'),
                    ),
                  ),
                  const SizedBox(width: AppDimensions.sm),
                  Expanded(
                    child: StatCard(
                      title: 'Resolved',
                      value: '$resolvedCount',
                      subtitle: 'Completed',
                      icon: Icons.check_circle_outline_rounded,
                      accentColor: AppColors.success,
                      onTap: () => context.push('/staff/orders'),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: AppDimensions.lg),

              // Section Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Active Field Assignments',
                    style: AppTypography.sectionTitle,
                  ),
                  TextButton(
                    onPressed: () => context.push('/staff/orders'),
                    child: const Text('View All'),
                  ),
                ],
              ),

              const SizedBox(height: AppDimensions.xs),

              // Work Orders List
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _workOrders.length,
                separatorBuilder: (context, index) =>
                    const SizedBox(height: AppDimensions.sm),
                itemBuilder: (context, index) {
                  final item = _workOrders[index];
                  final isResolved = item['status'] == 'resolved';
                  final isInProgress = item['status'] == 'in_progress';

                  return AppCard(
                    padding: const EdgeInsets.all(AppDimensions.md),
                    onTap: () => context.push('/staff/orders/${item['id']}'),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Text(
                                  item['complaintNumber'],
                                  style: AppTypography.bodySmall.copyWith(
                                    fontWeight: FontWeight.bold,
                                    color: AppColors.primary,
                                  ),
                                ),
                                const SizedBox(width: AppDimensions.xs),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 6,
                                    vertical: 2,
                                  ),
                                  decoration: BoxDecoration(
                                    color: item['priority'] == 'critical'
                                        ? AppColors.errorLight
                                        : AppColors.warningLight,
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: Text(
                                    (item['priority'] as String).toUpperCase(),
                                    style: TextStyle(
                                      fontSize: 9,
                                      fontWeight: FontWeight.bold,
                                      color: item['priority'] == 'critical'
                                          ? AppColors.error
                                          : AppColors.warning,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            ComplaintStatusBadge(status: item['status']),
                          ],
                        ),
                        const SizedBox(height: AppDimensions.xs),
                        Text(
                          item['title'],
                          style: AppTypography.cardTitle,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: AppDimensions.xs),
                        Row(
                          children: [
                            const Icon(
                              Icons.location_on_outlined,
                              size: 14,
                              color: AppColors.textSecondary,
                            ),
                            const SizedBox(width: 4),
                            Expanded(
                              child: Text(
                                item['address'],
                                style: AppTypography.caption,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: AppDimensions.sm),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                const Icon(
                                  Icons.timer_outlined,
                                  size: 13,
                                  color: AppColors.textTertiary,
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  'SLA: ${item['slaHoursLeft']}h remaining',
                                  style: AppTypography.caption.copyWith(
                                    color: item['slaHoursLeft'] <= 4
                                        ? AppColors.error
                                        : AppColors.textSecondary,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                            if (!isResolved)
                              Row(
                                children: [
                                  if (!isInProgress)
                                    OutlinedButton(
                                      style: OutlinedButton.styleFrom(
                                        padding: const EdgeInsets.symmetric(
                                          horizontal: 10,
                                          vertical: 6,
                                        ),
                                        minimumSize: Size.zero,
                                        tapTargetSize:
                                            MaterialTapTargetSize.shrinkWrap,
                                      ),
                                      onPressed: () {
                                        setState(() {
                                          item['status'] = 'in_progress';
                                        });
                                        ScaffoldMessenger.of(
                                          context,
                                        ).showSnackBar(
                                          SnackBar(
                                            content: Text(
                                              'Started work on ${item['complaintNumber']}',
                                            ),
                                          ),
                                        );
                                      },
                                      child: const Text(
                                        'Start Work',
                                        style: TextStyle(fontSize: 11),
                                      ),
                                    )
                                  else
                                    ElevatedButton(
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: AppColors.success,
                                        foregroundColor: Colors.white,
                                        padding: const EdgeInsets.symmetric(
                                          horizontal: 10,
                                          vertical: 6,
                                        ),
                                        minimumSize: Size.zero,
                                        tapTargetSize:
                                            MaterialTapTargetSize.shrinkWrap,
                                      ),
                                      onPressed: () =>
                                          _showResolutionDialog(item),
                                      child: const Text(
                                        'Mark Resolved',
                                        style: TextStyle(fontSize: 11),
                                      ),
                                    ),
                                ],
                              ),
                          ],
                        ),
                      ],
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
