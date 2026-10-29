import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/models/complaint_summary.dart';
import '../../auth/providers/auth_provider.dart';

class DashboardData {
  final DashboardStats stats;
  final List<ComplaintSummary> recentComplaints;
  final bool isLoading;
  final String? error;

  const DashboardData({
    this.stats = const DashboardStats(
      totalSubmitted: 0,
      inProgress: 0,
      resolved: 0,
    ),
    this.recentComplaints = const [],
    this.isLoading = false,
    this.error,
  });

  DashboardData copyWith({
    DashboardStats? stats,
    List<ComplaintSummary>? recentComplaints,
    bool? isLoading,
    String? error,
  }) {
    return DashboardData(
      stats: stats ?? this.stats,
      recentComplaints: recentComplaints ?? this.recentComplaints,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

final dashboardNotifierProvider =
    NotifierProvider<DashboardNotifier, DashboardData>(DashboardNotifier.new);

class DashboardNotifier extends Notifier<DashboardData> {
  @override
  DashboardData build() {
    // Watch auth status to refresh or reset dashboard
    final authState = ref.watch(authNotifierProvider);
    if (authState.status == AuthStatus.authenticated) {
      // Defer loading to avoid build-phase state modification
      Future.microtask(() => loadDashboardData());
    }
    return const DashboardData();
  }

  Future<void> loadDashboardData() async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      // In Day 7, complaint listing API is preparing for Day 8 implementation.
      // We initialize with genuine citizen statistics (0/0/0) and empty list,
      // avoiding fabricating fake numbers.
      state = state.copyWith(
        isLoading: false,
        stats: const DashboardStats(
          totalSubmitted: 0,
          inProgress: 0,
          resolved: 0,
        ),
        recentComplaints: const [],
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> refresh() async {
    await loadDashboardData();
  }
}
