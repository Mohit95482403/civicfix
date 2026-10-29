import 'package:flutter/material.dart';
import '../../../app/theme/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';
import '../../../core/widgets/app_card.dart';

class AdminAuditLogsScreen extends StatelessWidget {
  const AdminAuditLogsScreen({super.key});

  final List<Map<String, dynamic>> _logs = const [
    {
      'id': 'log-101',
      'action': 'STAFF_PROVISIONED',
      'actor': 'admin@bbmp.gov.in',
      'target': 'Sunil Kumar (STAFF)',
      'ipAddress': '192.168.1.45',
      'timestamp': '2026-10-29 14:22:10 IST',
      'status': 'SUCCESS',
    },
    {
      'id': 'log-102',
      'action': 'COMPLAINT_DISPATCHED',
      'actor': 'admin@bbmp.gov.in',
      'target': 'CF-2026-0814 -> Roads Dept',
      'ipAddress': '192.168.1.45',
      'timestamp': '2026-10-29 13:45:00 IST',
      'status': 'SUCCESS',
    },
    {
      'id': 'log-103',
      'action': 'ROLE_PERMISSION_CHECK',
      'actor': 'citizen.ramesh@gmail.com',
      'target': 'DENIED: /api/admin/staff (403 Forbidden)',
      'ipAddress': '103.21.126.88',
      'timestamp': '2026-10-29 12:10:04 IST',
      'status': 'SECURITY_REJECTED',
    },
    {
      'id': 'log-104',
      'action': 'STATUS_UPDATE',
      'actor': 'ramesh.k@bbmp.gov.in',
      'target': 'CF-2026-0801 -> RESOLVED',
      'ipAddress': '49.207.210.12',
      'timestamp': '2026-10-28 17:30:15 IST',
      'status': 'SUCCESS',
    },
    {
      'id': 'log-105',
      'action': 'DPDP_DATA_EXPORT_REQUEST',
      'actor': 'citizen.priya@gmail.com',
      'target': 'User Profile and Personal Data Archive',
      'ipAddress': '117.198.88.2',
      'timestamp': '2026-10-27 10:15:33 IST',
      'status': 'SUCCESS',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(
          'DPDP Security & Audit Trail',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
      ),
      body: ListView.separated(
        padding: AppDimensions.pagePadding,
        itemCount: _logs.length,
        separatorBuilder: (context, index) =>
            const SizedBox(height: AppDimensions.sm),
        itemBuilder: (context, index) {
          final log = _logs[index];
          final isSecurityReject = log['status'] == 'SECURITY_REJECTED';

          return AppCard(
            padding: const EdgeInsets.all(AppDimensions.md),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 3,
                      ),
                      decoration: BoxDecoration(
                        color: isSecurityReject
                            ? AppColors.errorLight
                            : const Color(0xFFEDE9FE),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        log['action'] as String,
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: isSecurityReject
                              ? AppColors.error
                              : const Color(0xFF7C3AED),
                        ),
                      ),
                    ),
                    Text(
                      log['timestamp'] as String,
                      style: AppTypography.caption.copyWith(fontSize: 10),
                    ),
                  ],
                ),
                const SizedBox(height: AppDimensions.xs),
                Text(log['target'] as String, style: AppTypography.bodySmall),
                const SizedBox(height: 4),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Actor: ${log['actor']}',
                      style: AppTypography.caption,
                    ),
                    Text(
                      'IP: ${log['ipAddress']}',
                      style: AppTypography.caption.copyWith(fontSize: 10),
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
