import 'package:flutter/material.dart';
import '../../../app/theme/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';
import '../../../core/widgets/app_card.dart';

class AdminDepartmentsScreen extends StatelessWidget {
  const AdminDepartmentsScreen({super.key});

  final List<Map<String, dynamic>> _departments = const [
    {
      'id': 'dept-1',
      'name': 'Roads & Infrastructure',
      'icon': Icons.add_road_rounded,
      'supervisor': 'K. S. Narayana (Superintending Engineer)',
      'crewsCount': 18,
      'activeTickets': 24,
      'slaTargetHours': 24,
      'complianceRate': '95.2%',
    },
    {
      'id': 'dept-2',
      'name': 'Solid Waste Management',
      'icon': Icons.delete_sweep_rounded,
      'supervisor': 'S. R. Meenakshi (Health Inspector)',
      'crewsCount': 14,
      'activeTickets': 15,
      'slaTargetHours': 12,
      'complianceRate': '98.0%',
    },
    {
      'id': 'dept-3',
      'name': 'Water Supply & Sewage (BWSSB)',
      'icon': Icons.water_drop_rounded,
      'supervisor': 'Arjun Rao (Senior Assistant Executive Engineer)',
      'crewsCount': 10,
      'activeTickets': 11,
      'slaTargetHours': 8,
      'complianceRate': '92.4%',
    },
    {
      'id': 'dept-4',
      'name': 'Electrical & Street Lighting',
      'icon': Icons.lightbulb_rounded,
      'supervisor': 'M. V. Prakash (Divisional Engineer)',
      'crewsCount': 8,
      'activeTickets': 9,
      'slaTargetHours': 18,
      'complianceRate': '96.8%',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(
          'Municipal Departments',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
      ),
      body: ListView.separated(
        padding: AppDimensions.pagePadding,
        itemCount: _departments.length,
        separatorBuilder: (context, index) =>
            const SizedBox(height: AppDimensions.sm),
        itemBuilder: (context, index) {
          final dept = _departments[index];
          return AppCard(
            padding: const EdgeInsets.all(AppDimensions.md),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: const Color(0xFFEDE9FE),
                        borderRadius: BorderRadius.circular(
                          AppDimensions.radiusSm,
                        ),
                      ),
                      child: Icon(
                        dept['icon'] as IconData,
                        color: const Color(0xFF7C3AED),
                        size: 22,
                      ),
                    ),
                    const SizedBox(width: AppDimensions.sm),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            dept['name'] as String,
                            style: AppTypography.cardTitle,
                          ),
                          Text(
                            'Supervisor: ${dept['supervisor']}',
                            style: AppTypography.caption,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppDimensions.md),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    _metricItem('Field Crews', '${dept['crewsCount']} active'),
                    _metricItem('Open Tickets', '${dept['activeTickets']}'),
                    _metricItem('SLA Target', '${dept['slaTargetHours']} hrs'),
                    _metricItem(
                      'Compliance',
                      dept['complianceRate'] as String,
                      color: AppColors.success,
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

  Widget _metricItem(String label, String value, {Color? color}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: AppTypography.caption.copyWith(fontSize: 10)),
        const SizedBox(height: 2),
        Text(
          value,
          style: AppTypography.bodySmall.copyWith(
            fontWeight: FontWeight.bold,
            color: color ?? AppColors.textPrimary,
          ),
        ),
      ],
    );
  }
}
