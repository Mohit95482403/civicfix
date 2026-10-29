class ComplaintSummary {
  final String id;
  final String complaintNumber;
  final String title;
  final String category;
  final String status;
  final String address;
  final DateTime createdAt;
  final String? imageUrl;
  final String priority;

  const ComplaintSummary({
    required this.id,
    required this.complaintNumber,
    required this.title,
    required this.category,
    required this.status,
    required this.address,
    required this.createdAt,
    this.imageUrl,
    this.priority = 'MEDIUM',
  });

  factory ComplaintSummary.fromJson(Map<String, dynamic> json) {
    return ComplaintSummary(
      id: json['id'] as String? ?? '',
      complaintNumber:
          json['referenceNumber'] as String? ??
          json['reference_number'] as String? ??
          json['complaint_number'] as String? ??
          json['complaintNumber'] as String? ??
          'CF-PENDING',
      title: json['title'] as String? ?? 'Civic Issue',
      category:
          json['categoryName'] as String? ??
          json['category_name'] as String? ??
          json['category'] as String? ??
          'General',
      status: (json['status'] as String? ?? 'SUBMITTED').toUpperCase(),
      address:
          json['addressText'] as String? ??
          json['address_text'] as String? ??
          json['address'] as String? ??
          'Location not specified',
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'].toString()) ?? DateTime.now()
          : (json['createdAt'] != null
                ? DateTime.tryParse(json['createdAt'].toString()) ??
                      DateTime.now()
                : DateTime.now()),
      imageUrl: json['image_url'] as String? ?? json['imageUrl'] as String?,
      priority: (json['priority'] as String? ?? 'MEDIUM').toUpperCase(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'complaintNumber': complaintNumber,
      'complaint_number': complaintNumber,
      'referenceNumber': complaintNumber,
      'title': title,
      'category': category,
      'status': status,
      'address': address,
      'created_at': createdAt.toIso8601String(),
      'image_url': imageUrl,
      'priority': priority,
    };
  }
}

class DashboardStats {
  final int totalSubmitted;
  final int inProgress;
  final int resolved;

  const DashboardStats({
    this.totalSubmitted = 0,
    this.inProgress = 0,
    this.resolved = 0,
  });

  factory DashboardStats.fromJson(Map<String, dynamic> json) {
    return DashboardStats(
      totalSubmitted:
          json['totalSubmitted'] as int? ??
          json['total_submitted'] as int? ??
          0,
      inProgress:
          json['inProgress'] as int? ?? json['in_progress'] as int? ?? 0,
      resolved: json['resolved'] as int? ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'totalSubmitted': totalSubmitted,
      'inProgress': inProgress,
      'resolved': resolved,
    };
  }
}
