import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/theme/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/complaint_status_badge.dart';
import '../../../core/widgets/empty_state_widget.dart';
import '../providers/complaints_provider.dart';

class MyComplaintsScreen extends ConsumerWidget {
  const MyComplaintsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(complaintsNotifierProvider);
    final notifier = ref.read(complaintsNotifierProvider.notifier);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('My Reported Issues'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_rounded),
            tooltip: 'New Complaint',
            onPressed: () => context.push('/complaints/new'),
          ),
        ],
      ),
      body: Column(
        children: [
          // Filter Tabs Bar
          Container(
            color: AppColors.surface,
            padding: const EdgeInsets.symmetric(
              horizontal: AppDimensions.base,
              vertical: AppDimensions.sm,
            ),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _FilterChip(
                    label: 'All',
                    isSelected: state.filter == ComplaintFilter.all,
                    onTap: () => notifier.setFilter(ComplaintFilter.all),
                  ),
                  _FilterChip(
                    label: 'Under Review',
                    isSelected: state.filter == ComplaintFilter.underReview,
                    onTap: () => notifier.setFilter(ComplaintFilter.underReview),
                  ),
                  _FilterChip(
                    label: 'In Progress',
                    isSelected: state.filter == ComplaintFilter.inProgress,
                    onTap: () => notifier.setFilter(ComplaintFilter.inProgress),
                  ),
                  _FilterChip(
                    label: 'Resolved',
                    isSelected: state.filter == ComplaintFilter.resolved,
                    onTap: () => notifier.setFilter(ComplaintFilter.resolved),
                  ),
                  _FilterChip(
                    label: 'Closed',
                    isSelected: state.filter == ComplaintFilter.closed,
                    onTap: () => notifier.setFilter(ComplaintFilter.closed),
                  ),
                ],
              ),
            ),
          ),
          const Divider(height: 1, color: AppColors.border),

          // Content View
          Expanded(
            child: state.filteredComplaints.isEmpty
                ? EmptyStateWidget(
                    icon: Icons.assignment_outlined,
                    title: 'No complaints in this category',
                    description: 'Issues submitted by you in this status will appear here with live tracking notes.',
                    buttonLabel: 'Report an Issue',
                    onButtonPressed: () => context.push('/complaints/new'),
                  )
                : ListView.separated(
                    padding: const EdgeInsets.all(AppDimensions.base),
                    itemCount: state.filteredComplaints.length,
                    separatorBuilder: (_, __) => const SizedBox(height: AppDimensions.sm),
                    itemBuilder: (context, index) {
                      final item = state.filteredComplaints[index];
                      return AppCard(
                        padding: const EdgeInsets.all(AppDimensions.base),
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
                            Text(item.title, style: AppTypography.cardHeading),
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
          ),
        ],
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _FilterChip({
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(right: AppDimensions.sm),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
        child: Container(
          padding: const EdgeInsets.symmetric(
            horizontal: AppDimensions.md,
            vertical: AppDimensions.xs + 2,
          ),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.primary : AppColors.background,
            borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
            border: Border.all(
              color: isSelected ? AppColors.primary : AppColors.border,
            ),
          ),
          child: Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
              color: isSelected ? Colors.white : AppColors.textSecondary,
            ),
          ),
        ),
      ),
    );
  }
}
