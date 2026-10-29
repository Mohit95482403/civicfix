import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/models/complaint_summary.dart';
import '../../../core/network/api_client.dart';

final complaintsRepositoryProvider = Provider<ComplaintsRepository>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return ComplaintsRepository(apiClient: apiClient);
});

class ComplaintsRepository {
  final ApiClient apiClient;

  ComplaintsRepository({required this.apiClient});

  Future<List<Map<String, dynamic>>> getCategories() async {
    try {
      final response = await apiClient.get('/complaints/categories');
      final body = response.data as Map<String, dynamic>;
      final list = body['data'] as List<dynamic>? ?? [];
      return list.cast<Map<String, dynamic>>();
    } catch (_) {
      // Fallback categories if server unreachable
      return [
        {
          'id': '20000000-0000-4000-a000-000000000001',
          'name': 'Roads & Potholes',
          'slug': 'roads-potholes',
          'icon_key': 'pothole',
          'sla_hours': 48,
        },
        {
          'id': '20000000-0000-4000-a000-000000000002',
          'name': 'Garbage & Sanitation',
          'slug': 'garbage-sanitation',
          'icon_key': 'trash-2',
          'sla_hours': 24,
        },
        {
          'id': '20000000-0000-4000-a000-000000000003',
          'name': 'Streetlights',
          'slug': 'streetlights',
          'icon_key': 'lightbulb',
          'sla_hours': 24,
        },
        {
          'id': '20000000-0000-4000-a000-000000000004',
          'name': 'Water Supply & Sewage',
          'slug': 'water-sewage',
          'icon_key': 'droplets',
          'sla_hours': 12,
        },
      ];
    }
  }

  Future<ComplaintSummary> createComplaint({
    required String title,
    required String description,
    required String categoryId,
    double? latitude,
    double? longitude,
    String? addressText,
  }) async {
    final payload = <String, dynamic>{
      'title': title,
      'description': description,
      'categoryId': categoryId,
    };
    if (latitude != null) payload['latitude'] = latitude;
    if (longitude != null) payload['longitude'] = longitude;
    if (addressText != null) payload['addressText'] = addressText;

    final response = await apiClient.post('/complaints', data: payload);

    final body = response.data as Map<String, dynamic>;
    final data = body['data'] as Map<String, dynamic>;
    return ComplaintSummary.fromJson(data);
  }

  Future<List<ComplaintSummary>> getMyComplaints() async {
    final response = await apiClient.get('/complaints/my');
    final body = response.data as Map<String, dynamic>;
    final list = body['data'] as List<dynamic>? ?? [];

    return list
        .map((item) => ComplaintSummary.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  Future<Map<String, dynamic>> getComplaintDetails(String id) async {
    final response = await apiClient.get('/complaints/$id');
    final body = response.data as Map<String, dynamic>;
    return body['data'] as Map<String, dynamic>? ?? {};
  }

  Future<List<Map<String, dynamic>>> getAssignedOrders() async {
    final response = await apiClient.get('/complaints/assigned');
    final body = response.data as Map<String, dynamic>;
    final list = body['data'] as List<dynamic>? ?? [];
    return list.cast<Map<String, dynamic>>();
  }

  Future<void> updateStatus({
    required String complaintId,
    required String status,
    String? reason,
  }) async {
    final payload = <String, dynamic>{'status': status};
    if (reason != null) payload['reason'] = reason;

    await apiClient.patch('/complaints/$complaintId/status', data: payload);
  }

  Future<void> addComment({
    required String complaintId,
    required String body,
    String visibility = 'CITIZEN_VISIBLE',
  }) async {
    await apiClient.post(
      '/complaints/$complaintId/comments',
      data: {'body': body, 'visibility': visibility},
    );
  }

  Future<void> addEvidence({
    required String complaintId,
    required String description,
  }) async {
    await apiClient.post(
      '/complaints/$complaintId/evidence',
      data: {'description': description},
    );
  }

  Future<void> assignComplaint({
    required String complaintId,
    required String departmentId,
    required String assignedTo,
    String? notes,
  }) async {
    final payload = <String, dynamic>{
      'departmentId': departmentId,
      'assignedTo': assignedTo,
    };
    if (notes != null) payload['notes'] = notes;

    await apiClient.post('/complaints/$complaintId/assign', data: payload);
  }

  Future<Map<String, dynamic>> getAdminStats() async {
    final response = await apiClient.get('/admin/stats');
    final body = response.data as Map<String, dynamic>;
    return body['data'] as Map<String, dynamic>? ?? {};
  }

  Future<List<Map<String, dynamic>>> getAdminComplaints({
    String? status,
  }) async {
    final response = await apiClient.get(
      '/admin/complaints',
      queryParameters: status != null && status != 'all'
          ? {'status': status}
          : null,
    );
    final body = response.data as Map<String, dynamic>;
    final list = body['data'] as List<dynamic>? ?? [];
    return list.cast<Map<String, dynamic>>();
  }
}
