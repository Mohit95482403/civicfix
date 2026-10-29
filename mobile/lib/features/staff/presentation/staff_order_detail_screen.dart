import 'package:flutter/material.dart';
import '../../../app/theme/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';
import '../../../core/widgets/app_button.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/complaint_status_badge.dart';

class StaffOrderDetailScreen extends StatefulWidget {
  final String orderId;

  const StaffOrderDetailScreen({super.key, required this.orderId});

  @override
  State<StaffOrderDetailScreen> createState() => _StaffOrderDetailScreenState();
}

class _StaffOrderDetailScreenState extends State<StaffOrderDetailScreen> {
  late String _status;
  final TextEditingController _resolutionNoteController =
      TextEditingController();

  @override
  void initState() {
    super.initState();
    _status = 'in_progress';
  }

  @override
  void dispose() {
    _resolutionNoteController.dispose();
    super.dispose();
  }

  void _showCompleteDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Complete & Resolve Work Order'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Enter repair actions taken and field verification notes:',
              style: AppTypography.bodySmall,
            ),
            const SizedBox(height: AppDimensions.sm),
            TextField(
              controller: _resolutionNoteController,
              maxLines: 4,
              decoration: const InputDecoration(
                hintText:
                    'e.g., Deployed 2-man asphalt crew. Cleaned pothole base, applied tack coat, filled with 40mm bitumen mix and compacted with 2-ton roller...',
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
                _status = 'resolved';
              });
              Navigator.of(ctx).pop();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text(
                    'Work order marked as RESOLVED and submitted for citizen verification.',
                  ),
                  backgroundColor: AppColors.success,
                ),
              );
            },
            child: const Text('Confirm & Close'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(
          'Work Order #${widget.orderId}',
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.share_outlined),
            tooltip: 'Share Dispatch Link',
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: AppDimensions.pagePadding,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header Card
            AppCard(
              padding: const EdgeInsets.all(AppDimensions.base),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.errorLight,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: const Text(
                          'CRITICAL URGENCY',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: AppColors.error,
                          ),
                        ),
                      ),
                      ComplaintStatusBadge(status: _status),
                    ],
                  ),
                  const SizedBox(height: AppDimensions.sm),
                  const Text(
                    'Dangerous Deep Pothole on Outer Ring Road',
                    style: AppTypography.pageHeading,
                  ),
                  const SizedBox(height: AppDimensions.xs),
                  Text(
                    'Category: Roads & Infrastructure • BBMP Rapid Response',
                    style: AppTypography.caption.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: AppDimensions.base),

            // Location & GPS Details
            AppCard(
              padding: const EdgeInsets.all(AppDimensions.base),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Field Location',
                    style: AppTypography.sectionTitle,
                  ),
                  const SizedBox(height: AppDimensions.sm),
                  Row(
                    children: [
                      const Icon(
                        Icons.pin_drop_rounded,
                        color: AppColors.primary,
                        size: 20,
                      ),
                      const SizedBox(width: AppDimensions.sm),
                      const Expanded(
                        child: Text(
                          'Near Marathahalli Bridge, Outer Ring Road, Bengaluru 560037',
                          style: AppTypography.bodySmall,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: AppDimensions.xs),
                  const Text(
                    'GPS: 12.9562° N, 77.7011° E (Accurate within 5m)',
                    style: AppTypography.caption,
                  ),
                ],
              ),
            ),

            const SizedBox(height: AppDimensions.base),

            // Citizen Report & Notes
            AppCard(
              padding: const EdgeInsets.all(AppDimensions.base),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Citizen Description',
                    style: AppTypography.sectionTitle,
                  ),
                  const SizedBox(height: AppDimensions.sm),
                  const Text(
                    'Huge crater-sized pothole right on the fast lane. Multiple two-wheelers have skid and sustained punctures during evening peak hours. Urgent repair required before rain resumes.',
                    style: AppTypography.bodySmall,
                  ),
                  const SizedBox(height: AppDimensions.md),
                  Container(
                    padding: const EdgeInsets.all(AppDimensions.sm),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceHover,
                      borderRadius: BorderRadius.circular(
                        AppDimensions.radiusSm,
                      ),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.person_pin_rounded,
                          color: AppColors.textSecondary,
                          size: 18,
                        ),
                        const SizedBox(width: 8),
                        const Text(
                          'Reported by: Citizen Ramesh K. • Ph: +91 98765 43210',
                          style: AppTypography.caption,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: AppDimensions.base),

            // Workflow Actions
            AppCard(
              padding: const EdgeInsets.all(AppDimensions.base),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Text(
                    'Technician Actions',
                    style: AppTypography.sectionTitle,
                  ),
                  const SizedBox(height: AppDimensions.md),
                  if (_status == 'assigned')
                    AppButton(
                      label: 'Accept & Start Inspection',
                      icon: Icons.play_arrow_rounded,
                      onPressed: () {
                        setState(() => _status = 'in_progress');
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Order status set to IN PROGRESS'),
                          ),
                        );
                      },
                    )
                  else if (_status == 'in_progress') ...[
                    AppButton(
                      label: 'Submit Resolution & Proof',
                      icon: Icons.check_circle_outline_rounded,
                      backgroundColor: AppColors.success,
                      onPressed: _showCompleteDialog,
                    ),
                    const SizedBox(height: AppDimensions.sm),
                    OutlinedButton.icon(
                      icon: const Icon(Icons.support_agent_rounded, size: 18),
                      label: const Text('Request Department Equipment Backup'),
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text(
                              'Backup dispatch request notified to Supervisor.',
                            ),
                          ),
                        );
                      },
                    ),
                  ] else ...[
                    Container(
                      padding: const EdgeInsets.all(AppDimensions.md),
                      decoration: BoxDecoration(
                        color: AppColors.successLight,
                        borderRadius: BorderRadius.circular(
                          AppDimensions.radiusMd,
                        ),
                      ),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.check_circle_rounded,
                            color: AppColors.success,
                          ),
                          const SizedBox(width: AppDimensions.sm),
                          const Expanded(
                            child: Text(
                              'Work Order Completed & Verification Pending by Citizen.',
                              style: TextStyle(
                                color: AppColors.success,
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
