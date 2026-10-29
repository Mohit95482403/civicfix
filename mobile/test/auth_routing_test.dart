import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:civicfix_mobile/app/app.dart';
import 'package:civicfix_mobile/core/models/auth_user.dart';

void main() {
  group('AuthUser Role & Routing Logic Tests', () {
    test('Citizen role maps to Citizen Portal default route', () {
      const user = AuthUser(
        id: 'user-1',
        email: 'citizen@example.com',
        fullName: 'Citizen Ramesh',
        role: 'citizen',
        emailVerified: true,
      );

      expect(user.isCitizen, isTrue);
      expect(user.isStaff, isFalse);
      expect(user.isAdmin, isFalse);
      expect(user.defaultRoute, equals('/citizen/dashboard'));
    });

    test('Staff role maps to Staff Portal default route', () {
      const staffUser = AuthUser(
        id: 'user-2',
        email: 'staff@bbmp.gov.in',
        fullName: 'Field Technician Ramesh',
        role: 'staff',
        emailVerified: true,
      );

      expect(staffUser.isCitizen, isFalse);
      expect(staffUser.isStaff, isTrue);
      expect(staffUser.isAdmin, isFalse);
      expect(staffUser.defaultRoute, equals('/staff/dashboard'));
    });

    test('Supervisor role maps to Staff Portal default route', () {
      const supervisor = AuthUser(
        id: 'user-3',
        email: 'supervisor@bbmp.gov.in',
        fullName: 'Supervisor Arjun',
        role: 'department_supervisor',
        emailVerified: true,
      );

      expect(supervisor.isStaff, isTrue);
      expect(supervisor.isAdmin, isFalse);
      expect(supervisor.defaultRoute, equals('/staff/dashboard'));
    });

    test('Organization Admin role maps to Admin Portal default route', () {
      const orgAdmin = AuthUser(
        id: 'user-4',
        email: 'admin@bbmp.gov.in',
        fullName: 'Admin Commissioner',
        role: 'organization_admin',
        emailVerified: true,
      );

      expect(orgAdmin.isAdmin, isTrue);
      expect(orgAdmin.isStaff, isFalse);
      expect(orgAdmin.isCitizen, isFalse);
      expect(orgAdmin.defaultRoute, equals('/admin/dashboard'));
    });

    test('Platform Admin role maps to Admin Portal default route', () {
      const platformAdmin = AuthUser(
        id: 'user-5',
        email: 'root@civicfix.gov.in',
        fullName: 'Platform Superadmin',
        role: 'platform_admin',
        emailVerified: true,
      );

      expect(platformAdmin.isAdmin, isTrue);
      expect(platformAdmin.defaultRoute, equals('/admin/dashboard'));
    });

    test('Unknown or invalid role fails safely to citizen dashboard', () {
      const unknownUser = AuthUser(
        id: 'user-6',
        email: 'hacker@unknown.org',
        fullName: 'Malicious Attacker',
        role: 'injected_super_root_unknown',
        emailVerified: false,
      );

      expect(unknownUser.isAdmin, isFalse);
      expect(unknownUser.isStaff, isFalse);
      expect(unknownUser.defaultRoute, equals('/citizen/dashboard'));
    });
  });

  group('Unified Portals Widget Test', () {
    testWidgets('Renders all three role portals on landing screen', (
      WidgetTester tester,
    ) async {
      await tester.pumpWidget(const ProviderScope(child: CivicFixApp()));
      await tester.pumpAndSettle();

      expect(find.text('Citizen Portal'), findsOneWidget);
      expect(find.text('Staff Portal'), findsOneWidget);
      expect(find.text('Admin Portal'), findsOneWidget);
    });
  });
}
