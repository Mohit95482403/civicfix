import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../app/theme/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_typography.dart';
import '../../../core/widgets/app_card.dart';

class NewComplaintScreen extends StatelessWidget {
  const NewComplaintScreen({super.key});

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
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Preparation Banner
              Container(
                padding: const EdgeInsets.all(AppDimensions.base),
                decoration: BoxDecoration(
                  color: AppColors.primaryLight,
                  borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
                  border: Border.all(color: AppColors.primary.withAlpha(50)),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(
                      Icons.schedule_rounded,
                      color: AppColors.primary,
                      size: 24,
                    ),
                    const SizedBox(width: AppDimensions.md),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Day 8 Feature Pipeline Ready',
                            style: AppTypography.cardHeading.copyWith(
                              color: AppColors.primary,
                            ),
                          ),
                          const SizedBox(height: 4),
                          const Text(
                            'Full photo upload, location capture, and submission to the municipal queue is scheduled for Day 8 implementation.',
                            style: AppTypography.bodySmall,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppDimensions.lg),

              const Text(
                'Reporting Workflow Preview',
                style: AppTypography.sectionHeading,
              ),
              const SizedBox(height: AppDimensions.md),

              _StepCard(
                step: '1',
                title: 'Problem Categorization',
                description:
                    'Select from 6 standardized municipal categories (Potholes, Sanitation, Streetlights, Water leaks, Drainage, Infrastructure).',
                icon: Icons.category_outlined,
              ),
              const SizedBox(height: AppDimensions.sm),

              _StepCard(
                step: '2',
                title: 'Photographic Proof',
                description:
                    'Camera capture with anti-tamper timestamp and GPS coordinates embedded into Supabase Storage.',
                icon: Icons.camera_alt_outlined,
              ),
              const SizedBox(height: AppDimensions.sm),

              _StepCard(
                step: '3',
                title: 'Accurate Geo-Location',
                description:
                    'High-precision coordinate capture with automated ward mapping and street reverse geocoding.',
                icon: Icons.my_location_rounded,
              ),
              const SizedBox(height: AppDimensions.sm),

              _StepCard(
                step: '4',
                title: 'Citizen Reference Code',
                description:
                    'Instant generation of tracking codes (e.g., CF-2026-BLR-0042) and assignment to ward dispatch.',
                icon: Icons.confirmation_number_outlined,
              ),

              const SizedBox(height: AppDimensions.xl),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: () => context.pop(),
                  child: const Text('Back to Home Dashboard'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _StepCard extends StatelessWidget {
  final String step;
  final String title;
  final String description;
  final IconData icon;

  const _StepCard({
    required this.step,
    required this.title,
    required this.description,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: const EdgeInsets.all(AppDimensions.base),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: const BoxDecoration(
              color: AppColors.background,
              shape: BoxShape.circle,
            ),
            alignment: Alignment.center,
            child: Text(
              step,
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                color: AppColors.primary,
                fontSize: 14,
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
                    Icon(icon, size: 16, color: AppColors.textSecondary),
                    const SizedBox(width: 6),
                    Text(title, style: AppTypography.cardHeading),
                  ],
                ),
                const SizedBox(height: 4),
                Text(description, style: AppTypography.bodySmall),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
