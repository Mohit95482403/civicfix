# CivicFix Citizen Mobile Application

> **Phase:** Day 3 — Development Environment Setup & Project Foundation  
> **Tech Stack:** Flutter 3.44+, Dart 3.12+, Riverpod 3, GoRouter 18, Dio 5

The Citizen Mobile Application allows residents to capture photos of municipal infrastructure hazards, tag precise GPS coordinates, receive unique reference tracking codes (e.g. `CF-2026-BLR-001042`), and monitor resolution progress in real time.

---

## 1. Directory Structure

```
mobile/
├── lib/
│   ├── app/                # Root CivicFixApp, GoRouter (router.dart), AppTheme
│   │   └── theme/          # AppColors (Day 2 tokens), AppTheme (Material 3)
│   ├── core/
│   │   ├── config/         # EnvConfig (base URL, environment separation)
│   │   ├── errors/         # AppException, NetworkException, ApiException
│   │   └── network/        # ApiClient (Dio setup, timeout, interceptors)
│   ├── features/
│   │   └── home/           # HomeScreen presentation with Day 2 tokens
│   ├── shared/             # Reusable UI widgets and models
│   └── main.dart           # App entry point with Riverpod ProviderScope
├── test/
│   └── widget_test.dart    # Smoke test for core UI elements
├── pubspec.yaml            # Dependencies and assets
└── README.md
```

---

## 2. Setup & Development

```bash
# 1. Navigate to the mobile directory
cd mobile

# 2. Fetch Flutter packages
flutter pub get

# 3. Analyze code for static errors
flutter analyze

# 4. Run automated tests
flutter test

# 5. Launch app on connected device or emulator
flutter run
```

---

## 3. Environment Configuration

The application supports environment overrides via `--dart-define`:

```bash
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:5000/api/v1 --dart-define=ENV=development
```

> **Security Guarantee:** Supabase `service_role` keys are strictly forbidden in client builds. Only anonymous/publishable keys are passed to client devices.
