import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../app/theme/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';
import '../../../core/widgets/app_button.dart';
import '../../../core/widgets/app_card.dart';
import '../../dashboard/providers/dashboard_provider.dart';
import '../data/complaints_repository.dart';
import '../providers/complaints_provider.dart';

class NewComplaintScreen extends ConsumerStatefulWidget {
  const NewComplaintScreen({super.key});

  @override
  ConsumerState<NewComplaintScreen> createState() => _NewComplaintScreenState();
}

class _NewComplaintScreenState extends ConsumerState<NewComplaintScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _addressController = TextEditingController(
    text: 'Near Koramangala 4th Block, Bengaluru',
  );

  List<Map<String, dynamic>> _categories = [];
  String? _selectedCategoryId;
  bool _isLoadingCategories = true;
  bool _isSubmitting = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadCategories();
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _addressController.dispose();
    super.dispose();
  }

  Future<void> _loadCategories() async {
    try {
      final repository = ref.read(complaintsRepositoryProvider);
      final categories = await repository.getCategories();
      if (mounted) {
        setState(() {
          _categories = categories;
          if (_categories.isNotEmpty) {
            _selectedCategoryId = _categories.first['id'] as String?;
          }
          _isLoadingCategories = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoadingCategories = false;
        });
      }
    }
  }

  Future<void> _submitComplaint() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedCategoryId == null) {
      setState(() => _errorMessage = 'Please select an issue category');
      return;
    }

    setState(() {
      _isSubmitting = true;
      _errorMessage = null;
    });

    try {
      final repository = ref.read(complaintsRepositoryProvider);
      final complaint = await repository.createComplaint(
        title: _titleController.text.trim(),
        description: _descriptionController.text.trim(),
        categoryId: _selectedCategoryId!,
        addressText: _addressController.text.trim(),
        latitude: 12.9352,
        longitude: 77.6245,
      );

      // Refresh complaints list and dashboard counters
      await ref.read(complaintsNotifierProvider.notifier).refresh();
      await ref.read(dashboardNotifierProvider.notifier).refresh();

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Complaint submitted successfully! Tracking Ref: ${complaint.complaintNumber}',
            ),
            backgroundColor: AppColors.success,
            duration: const Duration(seconds: 4),
          ),
        );
        context.go('/citizen/complaints');
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isSubmitting = false;
          _errorMessage = e.toString().replaceAll('Exception: ', '');
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Report a Civic Issue'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.canPop()
              ? context.pop()
              : context.go('/citizen/dashboard'),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppDimensions.base),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Header Banner
                Container(
                  padding: const EdgeInsets.all(AppDimensions.base),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [AppColors.primaryNavy, Color(0xFF1E40AF)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(
                        Icons.campaign_rounded,
                        color: Colors.amber,
                        size: 28,
                      ),
                      const SizedBox(width: AppDimensions.md),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Municipal Dispatch Pipeline',
                              style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Reports are automatically routed to the responsible ward division and tracked against official SLAs.',
                              style: TextStyle(
                                color: Colors.white.withAlpha(220),
                                fontSize: 12,
                                height: 1.3,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: AppDimensions.base),

                if (_errorMessage != null)
                  Container(
                    margin: const EdgeInsets.only(bottom: AppDimensions.base),
                    padding: const EdgeInsets.all(AppDimensions.md),
                    decoration: BoxDecoration(
                      color: AppColors.errorLight,
                      borderRadius: BorderRadius.circular(
                        AppDimensions.radiusMd,
                      ),
                      border: Border.all(color: AppColors.error.withAlpha(80)),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.error_outline_rounded,
                          color: AppColors.error,
                        ),
                        const SizedBox(width: AppDimensions.sm),
                        Expanded(
                          child: Text(
                            _errorMessage!,
                            style: const TextStyle(
                              color: AppColors.error,
                              fontSize: 13,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                // Form Section
                AppCard(
                  padding: const EdgeInsets.all(AppDimensions.base),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Issue Category',
                        style: AppTypography.formLabel,
                      ),
                      const SizedBox(height: AppDimensions.xs),
                      if (_isLoadingCategories)
                        const Padding(
                          padding: EdgeInsets.symmetric(vertical: 12),
                          child: Center(
                            child: SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            ),
                          ),
                        )
                      else
                        DropdownButtonFormField<String>(
                          initialValue: _selectedCategoryId,
                          decoration: InputDecoration(
                            filled: true,
                            fillColor: AppColors.surface,
                            contentPadding: const EdgeInsets.symmetric(
                              horizontal: 14,
                              vertical: 12,
                            ),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(
                                AppDimensions.radiusMd,
                              ),
                              borderSide: const BorderSide(
                                color: AppColors.border,
                              ),
                            ),
                          ),
                          items: _categories.map((cat) {
                            return DropdownMenuItem<String>(
                              value: cat['id'] as String?,
                              child: Text(
                                cat['name'] as String? ?? 'General Civic Issue',
                                style: AppTypography.bodySmall,
                              ),
                            );
                          }).toList(),
                          onChanged: (val) {
                            setState(() => _selectedCategoryId = val);
                          },
                        ),
                      const SizedBox(height: AppDimensions.base),

                      const Text('Issue Title', style: AppTypography.formLabel),
                      const SizedBox(height: AppDimensions.xs),
                      TextFormField(
                        controller: _titleController,
                        decoration: const InputDecoration(
                          hintText: 'e.g. Deep pothole causing skidding hazard',
                        ),
                        validator: (value) {
                          if (value == null || value.trim().length < 5) {
                            return 'Title must be at least 5 characters';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: AppDimensions.base),

                      const Text(
                        'Detailed Description',
                        style: AppTypography.formLabel,
                      ),
                      const SizedBox(height: AppDimensions.xs),
                      TextFormField(
                        controller: _descriptionController,
                        maxLines: 4,
                        decoration: const InputDecoration(
                          hintText:
                              'Describe the situation, severity, and any visible hazards...',
                        ),
                        validator: (value) {
                          if (value == null || value.trim().length < 10) {
                            return 'Description must be at least 10 characters';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: AppDimensions.base),

                      const Text(
                        'Location / Landmark',
                        style: AppTypography.formLabel,
                      ),
                      const SizedBox(height: AppDimensions.xs),
                      TextFormField(
                        controller: _addressController,
                        decoration: const InputDecoration(
                          hintText: 'Street name, crossroad, landmark...',
                          prefixIcon: Icon(
                            Icons.location_on_outlined,
                            size: 20,
                          ),
                        ),
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Please specify the location or landmark';
                          }
                          return null;
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: AppDimensions.lg),

                // Submit Button
                AppButton(
                  label: _isSubmitting ? 'Submitting...' : 'Submit Complaint',
                  icon: Icons.send_rounded,
                  isLoading: _isSubmitting,
                  onPressed: _isSubmitting ? null : _submitComplaint,
                ),
                const SizedBox(height: AppDimensions.sm),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton(
                    onPressed: _isSubmitting
                        ? null
                        : () => context.canPop()
                              ? context.pop()
                              : context.go('/citizen/dashboard'),
                    child: const Text('Cancel'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
