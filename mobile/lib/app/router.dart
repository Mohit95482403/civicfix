import 'package:go_router/go_router.dart';
import '../features/home/presentation/home_screen.dart';

/// Declarative GoRouter configuration for CivicFix Mobile
final GoRouter appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      name: 'home',
      builder: (context, state) => const HomeScreen(),
    ),
  ],
);
