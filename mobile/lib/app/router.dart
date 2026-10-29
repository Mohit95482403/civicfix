import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../features/auth/presentation/forgot_password_screen.dart';
import '../features/auth/presentation/login_screen.dart';
import '../features/auth/presentation/register_screen.dart';
import '../features/auth/presentation/verification_pending_screen.dart';
import '../features/auth/providers/auth_provider.dart';

import '../features/home/presentation/home_screen.dart';

import '../features/navigation/presentation/main_shell_scaffold.dart';
import '../features/dashboard/presentation/home_dashboard_screen.dart';
import '../features/complaints/presentation/my_complaints_screen.dart';
import '../features/complaints/presentation/new_complaint_screen.dart';
import '../features/complaints/presentation/nearby_issues_screen.dart';
import '../features/notifications/presentation/notifications_screen.dart';
import '../features/profile/presentation/profile_screen.dart';
import '../features/profile/presentation/edit_profile_screen.dart';

import '../features/staff/presentation/staff_shell_scaffold.dart';
import '../features/staff/presentation/staff_dashboard_screen.dart';
import '../features/staff/presentation/staff_work_orders_screen.dart';
import '../features/staff/presentation/staff_order_detail_screen.dart';
import '../features/staff/presentation/staff_profile_screen.dart';

import '../features/admin/presentation/admin_shell_scaffold.dart';
import '../features/admin/presentation/admin_dashboard_screen.dart';
import '../features/admin/presentation/admin_complaints_screen.dart';
import '../features/admin/presentation/admin_staff_screen.dart';
import '../features/admin/presentation/admin_departments_screen.dart';
import '../features/admin/presentation/admin_audit_logs_screen.dart';

final GlobalKey<NavigatorState> _rootNavigatorKey = GlobalKey<NavigatorState>(
  debugLabel: 'root',
);

/// Unified Declarative GoRouter for CivicFix
/// Supports Citizen, Staff, and Admin modules in one Flutter application.
GoRouter createAppRouter([Ref? ref]) {
  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/',
    redirect: (BuildContext context, GoRouterState state) {
      if (ref == null) return null;

      final authState = ref.read(authNotifierProvider);
      final isAuth = authState.status == AuthStatus.authenticated;
      final user = authState.user;
      final loc = state.matchedLocation;

      final isStaffRoute = loc.startsWith('/staff');
      final isAdminRoute = loc.startsWith('/admin');
      final isCitizenRoute =
          loc.startsWith('/citizen') ||
          loc.startsWith('/complaints') ||
          loc.startsWith('/profile');

      // Unauthenticated users attempting to access protected routes
      if (!isAuth && (isStaffRoute || isAdminRoute || isCitizenRoute)) {
        return '/login';
      }

      // Authenticated users navigating to login/register are redirected to role dashboard
      if (isAuth && (loc == '/login' || loc == '/register')) {
        return user?.defaultRoute ?? '/citizen/dashboard';
      }

      // Role authorization boundaries
      if (isAuth && user != null) {
        // Citizens cannot access staff or admin routes
        if (user.isCitizen && (isStaffRoute || isAdminRoute)) {
          return '/citizen/dashboard';
        }
        // Staff cannot access admin routes
        if (user.isStaff && isAdminRoute) {
          return '/staff/dashboard';
        }
      }

      return null;
    },
    routes: [
      // 1. Public & Auth Routes
      GoRoute(
        path: '/',
        name: 'home',
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: '/login',
        name: 'login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        name: 'register',
        builder: (context, state) => const RegisterScreen(),
      ),
      GoRoute(
        path: '/verify-email',
        name: 'verify-email',
        builder: (context, state) => const VerificationPendingScreen(),
      ),
      GoRoute(
        path: '/forgot-password',
        name: 'forgot-password',
        builder: (context, state) => const ForgotPasswordScreen(),
      ),

      // 2. Citizen Portal (Stateful Shell Route with Bottom Navigation)
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) {
          return MainShellScaffold(navigationShell: navigationShell);
        },
        branches: [
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/citizen/dashboard',
                builder: (context, state) => const HomeDashboardScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/citizen/complaints',
                builder: (context, state) => const MyComplaintsScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/citizen/notifications',
                builder: (context, state) => const NotificationsScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/citizen/profile',
                builder: (context, state) => const ProfileScreen(),
              ),
            ],
          ),
        ],
      ),

      // Citizen Modal & Deep-link Routes
      GoRoute(
        path: '/complaints/new',
        name: 'new-complaint',
        builder: (context, state) => const NewComplaintScreen(),
      ),
      GoRoute(
        path: '/complaints/nearby',
        name: 'nearby-issues',
        builder: (context, state) => const NearbyIssuesScreen(),
      ),
      GoRoute(
        path: '/profile/edit',
        name: 'edit-profile',
        builder: (context, state) => const EditProfileScreen(),
      ),
      // Deep-link convenience aliases
      GoRoute(
        path: '/complaints',
        redirect: (context, state) => '/citizen/complaints',
      ),
      GoRoute(
        path: '/nearby',
        redirect: (context, state) => '/complaints/nearby',
      ),
      GoRoute(
        path: '/notifications',
        redirect: (context, state) => '/citizen/notifications',
      ),
      GoRoute(
        path: '/profile',
        redirect: (context, state) => '/citizen/profile',
      ),

      // 3. Staff Portal (Stateful Shell Route)
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) {
          return StaffShellScaffold(navigationShell: navigationShell);
        },
        branches: [
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/staff/dashboard',
                builder: (context, state) => const StaffDashboardScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/staff/orders',
                builder: (context, state) => const StaffWorkOrdersScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/staff/profile',
                builder: (context, state) => const StaffProfileScreen(),
              ),
            ],
          ),
        ],
      ),

      // Staff Work Order Detail Screen
      GoRoute(
        path: '/staff/orders/:id',
        name: 'staff-order-detail',
        builder: (context, state) {
          final id = state.pathParameters['id'] ?? 'unknown';
          return StaffOrderDetailScreen(orderId: id);
        },
      ),

      // 4. Admin Portal (Stateful Shell Route)
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) {
          return AdminShellScaffold(navigationShell: navigationShell);
        },
        branches: [
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/admin/dashboard',
                builder: (context, state) => const AdminDashboardScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/admin/complaints',
                builder: (context, state) => const AdminComplaintsScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/admin/staff',
                builder: (context, state) => const AdminStaffScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/admin/departments',
                builder: (context, state) => const AdminDepartmentsScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/admin/audit-logs',
                builder: (context, state) => const AdminAuditLogsScreen(),
              ),
            ],
          ),
        ],
      ),
    ],
  );
}

/// Riverpod provider for GoRouter
final routerProvider = Provider<GoRouter>((ref) {
  return createAppRouter(ref);
});

/// Default singleton instance for direct access
final GoRouter appRouter = createAppRouter();
