import 'package:flutter/material.dart';
import '../../../app/theme/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';
import '../../../core/widgets/app_card.dart';

class AdminStaffScreen extends StatefulWidget {
  const AdminStaffScreen({super.key});

  @override
  State<AdminStaffScreen> createState() => _AdminStaffScreenState();
}

class _AdminStaffScreenState extends State<AdminStaffScreen> {
  final List<Map<String, dynamic>> _staffList = [
    {
      'id': 'st-1',
      'name': 'Arjun Rao',
      'email': 'arjun.rao@bbmp.gov.in',
      'department': 'Water Supply & Sewage',
      'role': 'SUPERVISOR',
      'status': 'active',
      'tasksCompleted': 48,
    },
    {
      'id': 'st-2',
      'name': 'Ramesh K.',
      'email': 'ramesh.k@bbmp.gov.in',
      'department': 'Roads & Infrastructure',
      'role': 'STAFF',
      'status': 'active',
      'tasksCompleted': 62,
    },
    {
      'id': 'st-3',
      'name': 'Sunil Kumar',
      'email': 'sunil.kumar@bbmp.gov.in',
      'department': 'Solid Waste Management',
      'role': 'STAFF',
      'status': 'active',
      'tasksCompleted': 35,
    },
    {
      'id': 'st-4',
      'name': 'Pooja Nair',
      'email': 'pooja.nair@bbmp.gov.in',
      'department': 'Electrical & Lighting',
      'role': 'STAFF',
      'status': 'on_leave',
      'tasksCompleted': 29,
    },
  ];

  void _showAddStaffDialog() {
    final nameController = TextEditingController();
    final emailController = TextEditingController();
    String selectedDept = 'Roads & Infrastructure';
    String selectedRole = 'STAFF';

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: Row(
            children: const [
              Icon(Icons.person_add_rounded, color: Color(0xFF7C3AED)),
              SizedBox(width: AppDimensions.sm),
              Text('Provision Staff Member'),
            ],
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Note: Public registration creates Citizen accounts only. Privileged Staff credentials must be provisioned by Organization Admin.',
                  style: TextStyle(
                    fontSize: 11,
                    color: AppColors.textSecondary,
                    fontStyle: FontStyle.italic,
                  ),
                ),
                const SizedBox(height: AppDimensions.md),
                const Text('Full Name:', style: AppTypography.formLabel),
                const SizedBox(height: AppDimensions.xs),
                TextField(
                  controller: nameController,
                  decoration: const InputDecoration(
                    hintText: 'e.g. Suresh Gowda',
                  ),
                ),
                const SizedBox(height: AppDimensions.base),
                const Text(
                  'Official Government Email:',
                  style: AppTypography.formLabel,
                ),
                const SizedBox(height: AppDimensions.xs),
                TextField(
                  controller: emailController,
                  decoration: const InputDecoration(
                    hintText: 'e.g. suresh.g@bbmp.gov.in',
                  ),
                ),
                const SizedBox(height: AppDimensions.base),
                const Text('Department:', style: AppTypography.formLabel),
                const SizedBox(height: AppDimensions.xs),
                DropdownButtonFormField<String>(
                  initialValue: selectedDept,
                  items: const [
                    DropdownMenuItem(
                      value: 'Roads & Infrastructure',
                      child: Text('Roads & Infrastructure'),
                    ),
                    DropdownMenuItem(
                      value: 'Solid Waste Management',
                      child: Text('Solid Waste Management'),
                    ),
                    DropdownMenuItem(
                      value: 'Water Supply & Sewage',
                      child: Text('Water Supply & Sewage'),
                    ),
                    DropdownMenuItem(
                      value: 'Electrical & Lighting',
                      child: Text('Electrical & Lighting'),
                    ),
                  ],
                  onChanged: (val) {
                    if (val != null) setDialogState(() => selectedDept = val);
                  },
                ),
                const SizedBox(height: AppDimensions.base),
                const Text('Role Assignment:', style: AppTypography.formLabel),
                const SizedBox(height: AppDimensions.xs),
                DropdownButtonFormField<String>(
                  initialValue: selectedRole,
                  items: const [
                    DropdownMenuItem(
                      value: 'STAFF',
                      child: Text('Field Staff / Technician'),
                    ),
                    DropdownMenuItem(
                      value: 'SUPERVISOR',
                      child: Text('Department Supervisor'),
                    ),
                  ],
                  onChanged: (val) {
                    if (val != null) setDialogState(() => selectedRole = val);
                  },
                ),
              ],
            ),
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
                final name = nameController.text.trim();
                final email = emailController.text.trim();
                if (name.isNotEmpty && email.isNotEmpty) {
                  setState(() {
                    _staffList.add({
                      'id': 'st-${_staffList.length + 1}',
                      'name': name,
                      'email': email,
                      'department': selectedDept,
                      'role': selectedRole,
                      'status': 'active',
                      'tasksCompleted': 0,
                    });
                  });
                  Navigator.of(ctx).pop();
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        'Staff member $name successfully provisioned to $selectedDept.',
                      ),
                      backgroundColor: AppColors.success,
                    ),
                  );
                }
              },
              child: const Text('Provision & Send Credentials'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(
          'Staff & Crew Management',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.person_add_rounded),
            tooltip: 'Add Staff',
            onPressed: _showAddStaffDialog,
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: const Color(0xFF7C3AED),
        foregroundColor: Colors.white,
        icon: const Icon(Icons.person_add_rounded),
        label: const Text('Provision Staff'),
        onPressed: _showAddStaffDialog,
      ),
      body: ListView.separated(
        padding: AppDimensions.pagePadding,
        itemCount: _staffList.length,
        separatorBuilder: (context, index) =>
            const SizedBox(height: AppDimensions.sm),
        itemBuilder: (context, index) {
          final staff = _staffList[index];
          final isSupervisor = staff['role'] == 'SUPERVISOR';
          final isActive = staff['status'] == 'active';

          return AppCard(
            padding: const EdgeInsets.all(AppDimensions.md),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 22,
                  backgroundColor: isSupervisor
                      ? const Color(0xFF7C3AED)
                      : AppColors.tealAccent,
                  child: Text(
                    (staff['name'] as String)[0],
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ),
                const SizedBox(width: AppDimensions.md),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(staff['name'], style: AppTypography.cardTitle),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 6,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: isSupervisor
                                  ? const Color(0xFFEDE9FE)
                                  : AppColors.primaryLight,
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              staff['role'],
                              style: TextStyle(
                                fontSize: 9,
                                fontWeight: FontWeight.bold,
                                color: isSupervisor
                                    ? const Color(0xFF7C3AED)
                                    : AppColors.primary,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Text(staff['department'], style: AppTypography.caption),
                      Text(
                        staff['email'],
                        style: AppTypography.caption.copyWith(
                          fontSize: 10,
                          color: AppColors.textTertiary,
                        ),
                      ),
                    ],
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: isActive
                            ? AppColors.successLight
                            : AppColors.warningLight,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        isActive ? 'ACTIVE' : 'ON LEAVE',
                        style: TextStyle(
                          fontSize: 9,
                          fontWeight: FontWeight.bold,
                          color: isActive
                              ? AppColors.success
                              : AppColors.warning,
                        ),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${staff['tasksCompleted']} resolved',
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
