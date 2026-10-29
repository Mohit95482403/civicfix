import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../constants/app_dimensions.dart';
import '../constants/app_typography.dart';

class ComplaintStatusBadge extends StatelessWidget {
  final String status;

  const ComplaintStatusBadge({
    super.key,
    required this.status,
  });

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color fg;
    String label;

    final normalized = status.toUpperCase().replaceAll('-', '_').replaceAll(' ', '_');

    switch (normalized) {
      case 'SUBMITTED':
      case 'PENDING':
        bg = AppColors.infoLight;
        fg = AppColors.info;
        label = 'Submitted';
        break;
      case 'UNDER_REVIEW':
      case 'REVIEW':
        bg = AppColors.warningLight;
        fg = AppColors.warning;
        label = 'Under Review';
        break;
      case 'IN_PROGRESS':
      case 'ASSIGNED':
        bg = AppColors.inProgressLight;
        fg = AppColors.inProgress;
        label = 'In Progress';
        break;
      case 'RESOLVED':
        bg = AppColors.successLight;
        fg = AppColors.success;
        label = 'Resolved';
        break;
      case 'CLOSED':
      case 'REJECTED':
        bg = AppColors.borderSubtle;
        fg = AppColors.textSecondary;
        label = 'Closed';
        break;
      default:
        bg = AppColors.borderSubtle;
        fg = AppColors.textSecondary;
        label = status;
    }

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppDimensions.sm + 2,
        vertical: AppDimensions.xs,
      ),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 6,
            height: 6,
            decoration: BoxDecoration(
              color: fg,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: AppDimensions.xs + 2),
          Text(
            label,
            style: AppTypography.statusBadge.copyWith(color: fg),
          ),
        ],
      ),
    );
  }
}
