import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../app/theme/app_colors.dart';
import '../../../../core/constants/app_dimensions.dart';
import '../../../../core/constants/app_typography.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_card.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../providers/auth_provider.dart';

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _agreedToTerms = false;
  String? _termsError;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  void _submit() {
    setState(() {
      _termsError = _agreedToTerms
          ? null
          : 'You must agree to the Terms of Service & Privacy Policy.';
    });

    if (!(_formKey.currentState?.validate() ?? false) || !_agreedToTerms) {
      return;
    }

    if (_passwordController.text != _confirmPasswordController.text) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Passwords do not match. Please verify both fields.'),
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }

    ref
        .read(authNotifierProvider.notifier)
        .registerCitizen(
          fullName: _nameController.text.trim(),
          email: _emailController.text.trim(),
          password: _passwordController.text,
          phone: _phoneController.text.trim().isNotEmpty
              ? _phoneController.text.trim()
              : null,
        );
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authNotifierProvider);

    ref.listen<AuthState>(authNotifierProvider, (previous, next) {
      if (next.status == AuthStatus.authenticated) {
        context.go('/home');
      } else if (next.status == AuthStatus.verificationPending) {
        context.go('/verify-email');
      }
    });

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Citizen Registration'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: AppDimensions.pagePadding,
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text(
                  'Join CivicFix Community',
                  style: AppTypography.pageHeading,
                ),
                const SizedBox(height: AppDimensions.xs),
                const Text(
                  'Report potholes, broken streetlights, and sanitation issues in your neighborhood.',
                  style: AppTypography.bodyMedium,
                ),
                const SizedBox(height: AppDimensions.base),

                // Server Error Feedback
                if (authState.status == AuthStatus.error &&
                    authState.errorMessage != null) ...[
                  Container(
                    padding: const EdgeInsets.all(AppDimensions.md),
                    decoration: BoxDecoration(
                      color: AppColors.errorLight,
                      borderRadius: BorderRadius.circular(
                        AppDimensions.radiusMd,
                      ),
                      border: Border.all(color: AppColors.error.withAlpha(50)),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.error_outline_rounded,
                          color: AppColors.error,
                          size: 20,
                        ),
                        const SizedBox(width: AppDimensions.sm),
                        Expanded(
                          child: Text(
                            authState.errorMessage!,
                            style: const TextStyle(
                              color: AppColors.error,
                              fontSize: 12,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: AppDimensions.base),
                ],

                // Registration Form Card
                AppCard(
                  padding: const EdgeInsets.all(AppDimensions.base),
                  child: Column(
                    children: [
                      AppTextField(
                        label: 'Full Name *',
                        controller: _nameController,
                        hintText: 'Rahul Patil',
                        prefixIcon: Icons.person_outline,
                        textCapitalization: TextCapitalization.words,
                        validator: (value) {
                          if (value == null || value.trim().length < 2) {
                            return 'Full name must contain at least 2 characters.';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: AppDimensions.base),

                      AppTextField(
                        label: 'Email Address *',
                        controller: _emailController,
                        hintText: 'citizen@example.com',
                        keyboardType: TextInputType.emailAddress,
                        prefixIcon: Icons.email_outlined,
                        validator: (value) {
                          if (value == null ||
                              !value.contains('@') ||
                              !value.contains('.')) {
                            return 'Please enter a valid email address.';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: AppDimensions.base),

                      AppTextField(
                        label: 'Phone Number (Optional)',
                        controller: _phoneController,
                        hintText: '+919876543210',
                        keyboardType: TextInputType.phone,
                        prefixIcon: Icons.phone_outlined,
                        validator: (value) {
                          if (value != null && value.trim().isNotEmpty) {
                            final cleaned = value.replaceAll(
                              RegExp(r'[\s-]'),
                              '',
                            );
                            if (!RegExp(
                              r'^(\+91)?[6-9]\d{9}$',
                            ).hasMatch(cleaned)) {
                              return 'Please enter a valid 10-digit Indian mobile number.';
                            }
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: AppDimensions.base),

                      AppPasswordField(
                        label: 'Password *',
                        controller: _passwordController,
                        hintText: 'Min 8 chars with number',
                        validator: (value) {
                          if (value == null || value.length < 8) {
                            return 'Password must contain at least 8 characters.';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: AppDimensions.base),

                      AppPasswordField(
                        label: 'Confirm Password *',
                        controller: _confirmPasswordController,
                        hintText: 'Re-enter password',
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please confirm your password.';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: AppDimensions.md),

                      // Terms and conditions checkbox
                      CheckboxListTile(
                        contentPadding: EdgeInsets.zero,
                        value: _agreedToTerms,
                        onChanged: (val) {
                          setState(() {
                            _agreedToTerms = val ?? false;
                            if (_agreedToTerms) _termsError = null;
                          });
                        },
                        title: const Text(
                          'I agree to CivicFix Terms of Service and Privacy Policy under DPDP Act 2023.',
                          style: AppTypography.bodySmall,
                        ),
                        controlAffinity: ListTileControlAffinity.leading,
                      ),
                      if (_termsError != null)
                        Align(
                          alignment: Alignment.centerLeft,
                          child: Text(
                            _termsError!,
                            style: const TextStyle(
                              color: AppColors.error,
                              fontSize: 11,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
                const SizedBox(height: AppDimensions.lg),

                AppButton(
                  label: 'Create Citizen Account',
                  isLoading: authState.status == AuthStatus.loading,
                  onPressed: _submit,
                ),
                const SizedBox(height: AppDimensions.lg),

                // Sign in link
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      'Already registered?',
                      style: AppTypography.bodyMedium,
                    ),
                    TextButton(
                      onPressed: () => context.pop(),
                      child: const Text(
                        'Sign In',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
