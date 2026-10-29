import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/theme/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/stat_card.dart';
import '../../auth/providers/auth_provider.dart';

class AdminDashboardScreen extends ConsumerStatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  ConsumerState<AdminDashboardScreen> createState() =>
      _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends ConsumerState<AdminDashboardScreen> {
  final List<Map<String, dynamic>> _pendingTriage = [
    {
      'id': 'cmp-201',
      'complaintNumber': 'CF-2026-0901',
      'title': 'Severe Chemical Effluent in Stormwater Drain',
      'category': 'Water Supply & Sewage',
      'address': 'Peenya Industrial Area Stage 2',
      'status': 'submitted',
      'priority': 'critical',
      'time': '14 mins ago',
    },
    {
      'id': 'cmp-202',
      'complaintNumber': 'CF-2026-0902',
      'title': 'Collapsing High Voltage Cable over Bus Stop',
      'category': 'Electrical & Lighting',
      'address': 'KBS Majestic Bus Stand Bay 4',
      'status': 'submitted',
      'priority': 'critical',
      'time': '32 mins ago',
    },
    {
      'id': 'cmp-203',
      'complaintNumber': 'CF-2026-0903',
      'title': 'Illegal Commercial Garbage Dumping at Lake Bed',
      'category': 'Solid Waste Management',
      'address': 'Bellandur Lake Southern Boundary',
      'status': 'under_review',
      'priority': 'high',
      'time': '1 hr ago',
    },
  ];

  void _showTriageDispatchDialog(Map<String, dynamic> item) {
    String selectedDept = 'Water Supply & Sewage';
    String selectedStaff = 'Arjun Rao (Senior Lead)';

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: Row(
            children: const [
              Icon(Icons.alt_route_rounded, color: Color(0xFF7C3AED)),
              SizedBox(width: AppDimensions.sm),
              Text('Dispatch Work Order'),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Assign ${item['complaintNumber']} to Municipal Field Crew:',
                style: AppTypography.bodySmall,
              ),
              const SizedBox(height: AppDimensions.base),
              const Text(
                'Assigned Department:',
                style: AppTypography.formLabel,
              ),
              const SizedBox(height: AppDimensions.xs),
              DropdownButtonFormField<String>(
                initialValue: selectedDept,
                items: const [
                  DropdownMenuItem(
                    value: 'Water Supply & Sewage',
                    child: Text('Water Supply & Sewage'),
                  ),
                  DropdownMenuItem(
                    value: 'Electrical & Lighting',
                    child: Text('Electrical & Lighting'),
                  ),
                  DropdownMenuItem(
                    value: 'Solid Waste Management',
                    child: Text('Solid Waste Management'),
                  ),
                  DropdownMenuItem(
                    value: 'Roads & Infrastructure',
                    child: Text('Roads & Infrastructure'),
                  ),
                ],
                onChanged: (val) {
                  if (val != null) {
                    setDialogState(() => selectedDept = val);
                  }
                },
              ),
              const SizedBox(height: AppDimensions.base),
              const Text(
                'Field Technician / Lead:',
                style: AppTypography.formLabel,
              ),
              const SizedBox(height: AppDimensions.xs),
              DropdownButtonFormField<String>(
                initialValue: selectedStaff,
                items: const [
                  DropdownMenuItem(
                    value: 'Arjun Rao (Senior Lead)',
                    child: Text('Arjun Rao (Senior Lead)'),
                  ),
                  DropdownMenuItem(
                    value: 'Ramesh K. (Technician)',
                    child: Text('Ramesh K. (Technician)'),
                  ),
                  DropdownMenuItem(
                    value: 'Sunil Kumar (Rapid Response)',
                    child: Text('Sunil Kumar (Rapid Response)'),
                  ),
                ],
                onChanged: (val) {
                  if (val != null) {
                    setDialogState(() => selectedStaff = val);
                  }
                },
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
                backgroundColor: const Color(0xFF7C3AED),
                foregroundColor: Colors.white,
              ),
              onPressed: () {
                setState(() {
                  _pendingTriage.remove(item);
                });
                Navigator.of(ctx).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      'Complaint ${item['complaintNumber']} dispatched to $selectedDept ($selectedStaff).',
                    ),
                    backgroundColor: const Color(0xFF7C3AED),
                  ),
                );
              },
              child: const Text('Confirm Dispatch'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authNotifierProvider);
    final user = authState.user;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'CivicFix Municipal Admin Console',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            Text(
              user?.organizationName ?? 'Bengaluru Urban Municipal Corporation',
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
            tooltip: 'Refresh Metrics',
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Organization analytics refreshed.'),
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
      body: SingleChildScrollView(
        padding: AppDimensions.pagePadding,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Admin Identity & Role Banner
            Container(
              padding: const EdgeInsets.all(AppDimensions.base),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF2E1065), Color(0xFF581C87)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF2E1065).withAlpha(60),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 26,
                    backgroundColor: const Color(0xFF8B5CF6),
                    child: const Icon(
                      Icons.admin_panel_settings_rounded,
                      color: Colors.white,
                      size: 28,
                    ),
                  ),
                  const SizedBox(width: AppDimensions.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          user?.fullName ?? 'Municipal Administrator',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 3),
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 6,
                                vertical: 2,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.white24,
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                (user?.role ?? 'ORG_ADMIN').toUpperCase(),
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            const Text(
                              'Zone: Central Division',
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

            // KPI Grid
            Row(
              children: [
                Expanded(
                  child: StatCard(
                    title: 'Total Tickets',
                    value: '1,428',
                    subtitle: '+12% this week',
                    icon: Icons.confirmation_number_outlined,
                    accentColor: AppColors.primary,
                    onTap: () => context.push('/admin/complaints'),
                  ),
                ),
                const SizedBox(width: AppDimensions.sm),
                Expanded(
                  child: StatCard(
                    title: 'Pending Triage',
                    value: '${_pendingTriage.length}',
                    subtitle: 'Needs dispatch',
                    icon: Icons.pending_actions_rounded,
                    accentColor: AppColors.error,
                    onTap: () => context.push('/admin/complaints'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppDimensions.sm),
            Row(
              children: [
                Expanded(
                  child: StatCard(
                    title: 'Active Crews',
                    value: '42',
                    subtitle: 'On-field staff',
                    icon: Icons.engineering_outlined,
                    accentColor: AppColors.tealAccent,
                    onTap: () => context.push('/admin/staff'),
                  ),
                ),
                const SizedBox(width: AppDimensions.sm),
                Expanded(
                  child: StatCard(
                    title: 'SLA Adherence',
                    value: '96.4%',
                    subtitle: 'Avg 14.8h resolve',
                    icon: Icons.speed_rounded,
                    accentColor: AppColors.success,
                    onTap: () => context.push('/admin/departments'),
                  ),
                ),
              ],
            ),

            const SizedBox(height: AppDimensions.lg),

            // Urgent Triage Queue Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Immediate Triage Queue',
                  style: AppTypography.sectionTitle,
                ),
                TextButton(
                  onPressed: () => context.push('/admin/complaints'),
                  child: const Text('View All Tickets'),
                ),
              ],
            ),

            const SizedBox(height: AppDimensions.xs),

            if (_pendingTriage.isEmpty)
              Container(
                padding: const EdgeInsets.all(AppDimensions.lg),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
                  border: Border.all(color: AppColors.border),
                ),
                child: Column(
                  children: const [
                    Icon(
                      Icons.check_circle_outline,
                      color: AppColors.success,
                      size: 36,
                    ),
                    SizedBox(height: AppDimensions.xs),
                    Text(
                      'All incoming tickets triaged and dispatched!',
                      style: AppTypography.bodySmall,
                    ),
                  ],
                ),
              )
            else
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _pendingTriage.length,
                separatorBuilder: (context, index) =>
                    const SizedBox(height: AppDimensions.sm),
                itemBuilder: (context, index) {
                  final item = _pendingTriage[index];
                  return AppCard(
                    padding: const EdgeInsets.all(AppDimensions.md),
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
                                    color: const Color(0xFF7C3AED),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 6,
                                    vertical: 2,
                                  ),
                                  decoration: BoxDecoration(
                                    color: AppColors.errorLight,
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: Text(
                                    (item['priority'] as String).toUpperCase(),
                                    style: const TextStyle(
                                      fontSize: 9,
                                      fontWeight: FontWeight.bold,
                                      color: AppColors.error,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            Text(item['time'], style: AppTypography.caption),
                          ],
                        ),
                        const SizedBox(height: AppDimensions.xs),
                        Text(item['title'], style: AppTypography.cardTitle),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            const Icon(
                              Icons.pin_drop_outlined,
                              size: 14,
                              color: AppColors.textSecondary,
                            ),
                            const SizedBox(width: 4),
                            Expanded(
                              child: Text(
                                '${item['category']} • ${item['address']}',
                                style: AppTypography.caption,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: AppDimensions.sm),
                        Align(
                          alignment: Alignment.centerRight,
                          child: ElevatedButton.icon(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF7C3AED),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 6,
                              ),
                              minimumSize: Size.zero,
                              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                            ),
                            icon: const Icon(Icons.send_rounded, size: 14),
                            label: const Text(
                              'Assign & Dispatch',
                              style: TextStyle(fontSize: 11),
                            ),
                            onPressed: () => _showTriageDispatchDialog(item),
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),

            const SizedBox(height: AppDimensions.lg),

            // Department Workload Overview
            AppCard(
              padding: const EdgeInsets.all(AppDimensions.base),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Department Workload',
                    style: AppTypography.sectionTitle,
                  ),
                  const SizedBox(height: AppDimensions.md),
                  _departmentWorkloadRow(
                    'Roads & Infrastructure',
                    18,
                    0.75,
                    AppColors.primary,
                  ),
                  const SizedBox(height: AppDimensions.sm),
                  _departmentWorkloadRow(
                    'Solid Waste Management',
                    12,
                    0.50,
                    AppColors.tealAccent,
                  ),
                  const SizedBox(height: AppDimensions.sm),
                  _departmentWorkloadRow(
                    'Water Supply & Sewage',
                    8,
                    0.35,
                    const Color(0xFF7C3AED),
                  ),
                  const SizedBox(height: AppDimensions.sm),
                  _departmentWorkloadRow(
                    'Electrical & Lighting',
                    6,
                    0.25,
                    AppColors.warning,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _departmentWorkloadRow(
    String name,
    int activeTickets,
    double progress,
    Color color,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(name, style: AppTypography.bodySmall),
            Text('$activeTickets active', style: AppTypography.caption),
          ],
        ),
        const SizedBox(height: 4),
        ClipRRect(
          borderRadius: BorderRadius.circular(4),
          child: LinearProgressIndicator(
            value: progress,
            backgroundColor: AppColors.border,
            color: color,
            minHeight: 6,
          ),
        ),
      ],
    );
  }
}
