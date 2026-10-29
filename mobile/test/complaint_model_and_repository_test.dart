import 'package:flutter_test/flutter_test.dart';
import 'package:civicfix_mobile/core/models/complaint_summary.dart';

void main() {
  group('ComplaintSummary Serialization & Parsing Tests', () {
    test('Parses complete complaint JSON with backend column names', () {
      final json = {
        'id': 'c1000000-0000-4000-a000-000000000001',
        'complaintNumber': 'CF-2026-BLR-000101',
        'title': 'Deep Pothole on Outer Ring Road',
        'category': 'Roads & Infrastructure',
        'status': 'IN_PROGRESS',
        'address': 'Marathahalli Bridge, Outer Ring Road',
        'createdAt': '2026-10-29T10:00:00.000Z',
      };

      final summary = ComplaintSummary.fromJson(json);

      expect(summary.id, equals('c1000000-0000-4000-a000-000000000001'));
      expect(summary.complaintNumber, equals('CF-2026-BLR-000101'));
      expect(summary.title, equals('Deep Pothole on Outer Ring Road'));
      expect(summary.category, equals('Roads & Infrastructure'));
      expect(summary.status, equals('IN_PROGRESS'));
      expect(summary.address, equals('Marathahalli Bridge, Outer Ring Road'));
      expect(summary.createdAt.year, equals(2026));
    });

    test('Parses Supabase direct schema column names gracefully', () {
      final json = {
        'id': 'c2000000-0000-4000-a000-000000000002',
        'reference_number': 'CF-2026-BLR-000202',
        'title': 'Garbage Overflow near Metro',
        'category_name': 'Solid Waste Management',
        'status': 'submitted',
        'address_text': 'Indiranagar 100ft Road',
        'created_at': '2026-10-29 11:30:00',
      };

      final summary = ComplaintSummary.fromJson(json);

      expect(summary.id, equals('c2000000-0000-4000-a000-000000000002'));
      expect(summary.complaintNumber, equals('CF-2026-BLR-000202'));
      expect(summary.title, equals('Garbage Overflow near Metro'));
      expect(summary.category, equals('Solid Waste Management'));
      expect(summary.status, equals('SUBMITTED'));
      expect(summary.address, equals('Indiranagar 100ft Road'));
    });

    test('Handles null and missing fields with safe fallback values', () {
      final json = <String, dynamic>{
        'id': 'c3000000-0000-4000-a000-000000000003',
      };

      final summary = ComplaintSummary.fromJson(json);

      expect(summary.id, equals('c3000000-0000-4000-a000-000000000003'));
      expect(summary.complaintNumber, equals('CF-PENDING'));
      expect(summary.title, equals('Civic Issue'));
      expect(summary.category, equals('General'));
      expect(summary.status, equals('SUBMITTED'));
      expect(summary.address, equals('Location not specified'));
    });

    test('Converts back to JSON cleanly', () {
      final summary = ComplaintSummary(
        id: 'c4000000-0000-4000-a000-000000000004',
        complaintNumber: 'CF-2026-BLR-000404',
        title: 'Broken Streetlight',
        category: 'Streetlights',
        status: 'RESOLVED',
        address: 'MG Road Trinity',
        createdAt: DateTime(2026, 10, 29),
      );

      final json = summary.toJson();
      expect(json['id'], equals('c4000000-0000-4000-a000-000000000004'));
      expect(json['complaintNumber'], equals('CF-2026-BLR-000404'));
      expect(json['status'], equals('RESOLVED'));
    });
  });
}
