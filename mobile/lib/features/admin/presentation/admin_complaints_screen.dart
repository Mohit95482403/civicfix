import 'package:flutter/material.dart';
import '../../../app/theme/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/complaint_status_badge.dart';

class AdminComplaintsScreen extends StatefulWidget {
  const AdminComplaintsScreen({super.key});

  @override
  State<AdminComplaintsScreen> createState() => _AdminComplaintsScreenState();
}

class _AdminComplaintsScreenState extends State<AdminComplaintsScreen> {
  String _selectedStatus = 'all';
  final TextEditingController _searchController = TextEditingController();

  final List<Map<String, dynamic>> _complaints = [
    {
      'id': 'cmp-1',
      'complaintNumber': 'CF-2026-0814',
      'title': 'Dangerous Deep Pothole on Outer Ring Road',
      'category': 'Roads & Infrastructure',
      'department': 'Roads Division',
      'assignedTo': 'Ramesh K.',
      'status': 'in_progress',
      'priority': 'critical',
      'address': 'Marathahalli Bridge',
      'date': '2026-10-28',
    },
    {
      'id': 'cmp-2',
      'complaintNumber': 'CF-2026-0815',
      'title': 'Garbage Overflow near Indiranagar Metro',
      'category': 'Solid Waste Management',
      'department': 'Sanitation East',
      'assignedTo': 'Sunil Kumar',
      'status': 'assigned',
      'priority': 'high',
      'address': 'Indiranagar 100ft Road',
      'date': '2026-10-28',
    },
    {
      'id': 'cmp-3',
      'complaintNumber': 'CF-2026-0818',
      'title': 'Main Water Pipeline Leakage Flooding Crossroad',
      'category': 'Water Supply & Sewage',
      'department': 'BWSSB Central',
      'assignedTo': 'Arjun Rao',
      'status': 'assigned',
      'priority': 'critical',
      'address': 'Koramangala 4th Block',
      'date': '2026-10-29',
    },
    {
      'id': 'cmp-4',
      'complaintNumber': 'CF-2026-0801',
      'title': 'Open Manhole on Pedestrian Footpath',
      'category': 'Roads & Infrastructure',
      'department': 'Roads Division',
      'assignedTo': 'Ramesh K.',
      'status': 'resolved',
      'priority': 'critical',
      'address': 'MG Road',
      'date': '2026-10-26',
    },
    {
      'id': 'cmp-5',
      'complaintNumber': 'CF-2026-0792',
      'title': 'Broken Traffic Light Signal at Silk Board',
      'category': 'Electrical & Lighting',
      'department': 'Traffic Tech',
      'assignedTo': 'Pooja Nair',
      'status': 'resolved',
      'priority': 'medium',
      'address': 'Silk Board Junction',
      'date': '2026-10-25',
    },
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _showDetailDialog(Map<String, dynamic> item) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Row(
          children: [
            Text(item['complaintNumber']),
            const Spacer(),
            ComplaintStatusBadge(status: item['status']),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(item['title'], style: AppTypography.cardTitle),
            const SizedBox(height: AppDimensions.sm),
            Text(
              'Department: ${item['department']}',
              style: AppTypography.bodySmall,
            ),
            Text(
              'Assigned Technician: ${item['assignedTo']}',
              style: AppTypography.bodySmall,
            ),
            Text(
              'Location: ${item['address']}',
              style: AppTypography.bodySmall,
            ),
            Text(
              'Reported Date: ${item['date']}',
              style: AppTypography.caption,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Close'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF7C3AED),
              foregroundColor: Colors.white,
            ),
            onPressed: () {
              Navigator.of(ctx).pop();
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    'Re-assignment and priority updated for ${item['complaintNumber']}',
                  ),
                ),
              );
            },
            child: const Text('Re-assign / Escalate'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final query = _searchController.text.toLowerCase().trim();
    final filtered = _complaints.where((c) {
      if (_selectedStatus != 'all' && c['status'] != _selectedStatus) {
        return false;
      }
      if (query.isNotEmpty) {
        final title = (c['title'] as String).toLowerCase();
        final num = (c['complaintNumber'] as String).toLowerCase();
        final dept = (c['department'] as String).toLowerCase();
        return title.contains(query) ||
            num.contains(query) ||
            dept.contains(query);
      }
      return true;
    }).toList();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(
          'Complaints Registry',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(
              AppDimensions.base,
              AppDimensions.sm,
              AppDimensions.base,
              AppDimensions.xs,
            ),
            child: TextField(
              controller: _searchController,
              onChanged: (_) => setState(() {}),
              decoration: InputDecoration(
                hintText: 'Search by complaint #, title, or department...',
                prefixIcon: const Icon(Icons.search_rounded, size: 20),
                filled: true,
                fillColor: AppColors.surface,
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 14,
                  vertical: 10,
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
                  borderSide: const BorderSide(color: AppColors.border),
                ),
              ),
            ),
          ),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(
              horizontal: AppDimensions.base,
              vertical: AppDimensions.xs,
            ),
            child: Row(
              children: [
                _chip('all', 'All Tickets (${_complaints.length})'),
                const SizedBox(width: AppDimensions.xs),
                _chip('submitted', 'Submitted'),
                const SizedBox(width: AppDimensions.xs),
                _chip('assigned', 'Assigned'),
                const SizedBox(width: AppDimensions.xs),
                _chip('in_progress', 'In Progress'),
                const SizedBox(width: AppDimensions.xs),
                _chip('resolved', 'Resolved'),
              ],
            ),
          ),
          Expanded(
            child: ListView.separated(
              padding: AppDimensions.pagePadding,
              itemCount: filtered.length,
              separatorBuilder: (context, index) =>
                  const SizedBox(height: AppDimensions.sm),
              itemBuilder: (context, index) {
                final item = filtered[index];
                return AppCard(
                  padding: const EdgeInsets.all(AppDimensions.md),
                  onTap: () => _showDetailDialog(item),
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
                              Text(
                                item['department'],
                                style: AppTypography.caption,
                              ),
                            ],
                          ),
                          ComplaintStatusBadge(status: item['status']),
                        ],
                      ),
                      const SizedBox(height: AppDimensions.xs),
                      Text(item['title'], style: AppTypography.cardTitle),
                      const SizedBox(height: 6),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Assigned: ${item['assignedTo']} • ${item['address']}',
                            style: AppTypography.caption,
                          ),
                          const Icon(
                            Icons.chevron_right_rounded,
                            size: 18,
                            color: AppColors.textTertiary,
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

  Widget _chip(String key, String label) {
    final isSelected = _selectedStatus == key;
    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (_) => setState(() => _selectedStatus = key),
      selectedColor: const Color(0xFF7C3AED),
      labelStyle: TextStyle(
        fontSize: 12,
        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        color: isSelected ? Colors.white : AppColors.textPrimary,
      ),
      backgroundColor: AppColors.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
        side: BorderSide(
          color: isSelected ? const Color(0xFF7C3AED) : AppColors.border,
        ),
      ),
    );
  }
}
