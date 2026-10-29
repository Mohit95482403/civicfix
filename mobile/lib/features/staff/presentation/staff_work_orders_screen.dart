import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../app/theme/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/complaint_status_badge.dart';

class StaffWorkOrdersScreen extends StatefulWidget {
  const StaffWorkOrdersScreen({super.key});

  @override
  State<StaffWorkOrdersScreen> createState() => _StaffWorkOrdersScreenState();
}

class _StaffWorkOrdersScreenState extends State<StaffWorkOrdersScreen> {
  String _selectedFilter = 'all';
  final TextEditingController _searchController = TextEditingController();

  final List<Map<String, dynamic>> _allOrders = [
    {
      'id': 'wo-101',
      'complaintNumber': 'CF-2026-0814',
      'title': 'Dangerous Deep Pothole on Outer Ring Road',
      'category': 'Roads & Infrastructure',
      'status': 'in_progress',
      'priority': 'critical',
      'address': 'Near Marathahalli Bridge, Outer Ring Road',
      'slaHoursLeft': 4,
      'reportedBy': 'Citizen Ramesh K.',
      'createdAt': '2026-10-28 09:15 AM',
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
      'reportedBy': 'Citizen Priya S.',
      'createdAt': '2026-10-28 11:30 AM',
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
      'reportedBy': 'Citizen Anand M.',
      'createdAt': '2026-10-29 07:45 AM',
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
      'reportedBy': 'Citizen Sneha R.',
      'createdAt': '2026-10-27 06:10 PM',
    },
    {
      'id': 'wo-105',
      'complaintNumber': 'CF-2026-0801',
      'title': 'Open Manhole on Pedestrian Footpath',
      'category': 'Roads & Infrastructure',
      'status': 'resolved',
      'priority': 'critical',
      'address': 'MG Road, near Trinity Circle',
      'slaHoursLeft': 0,
      'reportedBy': 'Citizen Vikram B.',
      'createdAt': '2026-10-26 02:00 PM',
    },
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final query = _searchController.text.toLowerCase().trim();
    final filtered = _allOrders.where((item) {
      if (_selectedFilter != 'all' && item['status'] != _selectedFilter) {
        return false;
      }
      if (query.isNotEmpty) {
        final title = (item['title'] as String).toLowerCase();
        final code = (item['complaintNumber'] as String).toLowerCase();
        final address = (item['address'] as String).toLowerCase();
        return title.contains(query) ||
            code.contains(query) ||
            address.contains(query);
      }
      return true;
    }).toList();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(
          'Department Work Orders',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.tune_rounded),
            tooltip: 'Filter options',
            onPressed: () {},
          ),
        ],
      ),
      body: Column(
        children: [
          // Search Bar
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
                hintText: 'Search by ticket #, description, or street...',
                prefixIcon: const Icon(Icons.search_rounded, size: 20),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear_rounded, size: 18),
                        onPressed: () {
                          _searchController.clear();
                          setState(() {});
                        },
                      )
                    : null,
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

          // Status Filter Tabs
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(
              horizontal: AppDimensions.base,
              vertical: AppDimensions.xs,
            ),
            child: Row(
              children: [
                _filterChip('all', 'All (${_allOrders.length})'),
                const SizedBox(width: AppDimensions.xs),
                _filterChip('assigned', 'Assigned'),
                const SizedBox(width: AppDimensions.xs),
                _filterChip('in_progress', 'In Progress'),
                const SizedBox(width: AppDimensions.xs),
                _filterChip('resolved', 'Resolved'),
              ],
            ),
          ),

          const SizedBox(height: AppDimensions.xs),

          // Work Orders List
          Expanded(
            child: filtered.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          Icons.inbox_outlined,
                          size: 48,
                          color: AppColors.textTertiary,
                        ),
                        const SizedBox(height: AppDimensions.sm),
                        const Text(
                          'No work orders found matching criteria',
                          style: AppTypography.bodySmall,
                        ),
                      ],
                    ),
                  )
                : ListView.separated(
                    padding: AppDimensions.pagePadding,
                    itemCount: filtered.length,
                    separatorBuilder: (context, index) =>
                        const SizedBox(height: AppDimensions.sm),
                    itemBuilder: (context, index) {
                      final item = filtered[index];
                      return AppCard(
                        padding: const EdgeInsets.all(AppDimensions.md),
                        onTap: () =>
                            context.push('/staff/orders/${item['id']}'),
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
                                    const SizedBox(width: 8),
                                    Text(
                                      item['category'],
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
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 6),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'By ${item['reportedBy']} • ${item['createdAt']}',
                                  style: AppTypography.caption.copyWith(
                                    fontSize: 10,
                                  ),
                                ),
                                const Icon(
                                  Icons.chevron_right_rounded,
                                  color: AppColors.textTertiary,
                                  size: 18,
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

  Widget _filterChip(String filterKey, String label) {
    final isSelected = _selectedFilter == filterKey;
    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (_) => setState(() => _selectedFilter = filterKey),
      selectedColor: AppColors.primary,
      labelStyle: TextStyle(
        fontSize: 12,
        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        color: isSelected ? Colors.white : AppColors.textPrimary,
      ),
      backgroundColor: AppColors.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
        side: BorderSide(
          color: isSelected ? AppColors.primary : AppColors.border,
        ),
      ),
    );
  }
}
