import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:civicfix_mobile/app/app.dart';

void main() {
  testWidgets('CivicFix mobile app smoke test', (WidgetTester tester) async {
    // Build our app inside ProviderScope and trigger a frame.
    await tester.pumpWidget(
      const ProviderScope(
        child: CivicFixApp(),
      ),
    );

    // Let the GoRouter animations settle
    await tester.pumpAndSettle();

    // Verify key brand elements are rendered
    expect(find.text('CivicFix'), findsOneWidget);
    expect(find.text('Welcome to CivicFix'), findsOneWidget);
    expect(find.text('Report an Issue'), findsOneWidget);
  });
}
