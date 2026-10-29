import 'package:flutter/material.dart';
import '../../app/theme/app_colors.dart';
import '../constants/app_dimensions.dart';
import '../constants/app_typography.dart';

enum AppButtonVariant { primary, secondary, outlined, danger }

class AppButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final bool isLoading;
  final IconData? icon;
  final AppButtonVariant variant;
  final double? width;
  final double height;
  final Color? backgroundColor;
  final Color? foregroundColor;
  final bool? isOutlined;

  const AppButton({
    super.key,
    required this.label,
    this.onPressed,
    this.isLoading = false,
    this.icon,
    this.variant = AppButtonVariant.primary,
    this.width,
    this.height = AppDimensions.buttonHeight,
    this.backgroundColor,
    this.foregroundColor,
    this.isOutlined,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveVariant = isOutlined == true
        ? AppButtonVariant.outlined
        : variant;

    Color bg;
    Color fg;
    BorderSide? borderSide;

    switch (effectiveVariant) {
      case AppButtonVariant.primary:
        bg = backgroundColor ?? AppColors.primary;
        fg = foregroundColor ?? Colors.white;
        borderSide = null;
        break;
      case AppButtonVariant.secondary:
        bg = backgroundColor ?? AppColors.primaryLight;
        fg = foregroundColor ?? AppColors.primary;
        borderSide = null;
        break;
      case AppButtonVariant.outlined:
        bg = backgroundColor ?? Colors.transparent;
        fg = foregroundColor ?? AppColors.primary;
        borderSide = const BorderSide(color: AppColors.border, width: 1.5);
        break;
      case AppButtonVariant.danger:
        bg = backgroundColor ?? AppColors.errorLight;
        fg = foregroundColor ?? AppColors.error;
        borderSide = null;
        break;
    }

    final isInteractive = !isLoading && onPressed != null;

    return SizedBox(
      width: width ?? double.infinity,
      height: height,
      child: ElevatedButton(
        onPressed: isInteractive ? onPressed : null,
        style: ElevatedButton.styleFrom(
          backgroundColor: bg,
          foregroundColor: fg,
          disabledBackgroundColor: bg.withAlpha(120),
          disabledForegroundColor: fg.withAlpha(120),
          elevation: 0,
          side: borderSide,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
          ),
          padding: const EdgeInsets.symmetric(horizontal: AppDimensions.base),
        ),
        child: isLoading
            ? SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2.2,
                  valueColor: AlwaysStoppedAnimation<Color>(fg),
                ),
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (icon != null) ...[
                    Icon(icon, size: 18, color: foregroundColor),
                    const SizedBox(width: AppDimensions.sm),
                  ],
                  Flexible(
                    child: Text(
                      label,
                      style: AppTypography.button.copyWith(
                        color: foregroundColor,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
      ),
    );
  }
}
