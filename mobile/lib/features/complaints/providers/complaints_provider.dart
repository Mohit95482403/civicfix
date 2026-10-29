import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/models/complaint_summary.dart';

enum ComplaintFilter { all, underReview, inProgress, resolved, closed }

class ComplaintsState {
  final ComplaintFilter filter;
  final List<ComplaintSummary> complaints;
  final bool isLoading;
  final String? error;

  const ComplaintsState({
    this.filter = ComplaintFilter.all,
    this.complaints = const [],
    this.isLoading = false,
    this.error,
  });

  ComplaintsState copyWith({
    ComplaintFilter? filter,
    List<ComplaintSummary>? complaints,
    bool? isLoading,
    String? error,
  }) {
    return ComplaintsState(
      filter: filter ?? this.filter,
      complaints: complaints ?? this.complaints,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }

  List<ComplaintSummary> get filteredComplaints {
    switch (filter) {
      case ComplaintFilter.all:
        return complaints;
      case ComplaintFilter.underReview:
        return complaints
            .where((c) => c.status == 'UNDER_REVIEW' || c.status == 'SUBMITTED')
            .toList();
      case ComplaintFilter.inProgress:
        return complaints
            .where((c) => c.status == 'IN_PROGRESS' || c.status == 'ASSIGNED')
            .toList();
      case ComplaintFilter.resolved:
        return complaints.where((c) => c.status == 'RESOLVED').toList();
      case ComplaintFilter.closed:
        return complaints
            .where((c) => c.status == 'CLOSED' || c.status == 'REJECTED')
            .toList();
    }
  }
}

final complaintsNotifierProvider =
    NotifierProvider<ComplaintsNotifier, ComplaintsState>(
      ComplaintsNotifier.new,
    );

class ComplaintsNotifier extends Notifier<ComplaintsState> {
  @override
  ComplaintsState build() {
    return const ComplaintsState();
  }

  void setFilter(ComplaintFilter filter) {
    state = state.copyWith(filter: filter);
  }

  Future<void> loadComplaints() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      // Prepared for Day 8 complaint integration
      state = state.copyWith(isLoading: false, complaints: const []);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }
}
