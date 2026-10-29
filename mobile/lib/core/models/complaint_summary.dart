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
      complaintNumber: json['complaint_number'] as String? ?? json['complaintNumber'] as String? ?? 'CF-XXXX',
      title: json['title'] as String? ?? 'Civic Issue',
      category: json['category'] as String? ?? 'General',
      status: json['status'] as String? ?? 'SUBMITTED',
      address: json['address'] as String? ?? 'Bengaluru, Karnataka',
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'].toString())
          : DateTime.now(),
      imageUrl: json['image_url'] as String? ?? json['imageUrl'] as String?,
      priority: json['priority'] as String? ?? 'MEDIUM',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'complaint_number': complaintNumber,
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
      totalSubmitted: json['totalSubmitted'] as int? ?? json['total_submitted'] as int? ?? 0,
      inProgress: json['inProgress'] as int? ?? json['in_progress'] as int? ?? 0,
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
