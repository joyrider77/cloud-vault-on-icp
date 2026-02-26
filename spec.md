# Specification

## Summary
**Goal:** Fix app loading failure by adding robust error handling and ensuring auth initialization completes before rendering routes.

**Planned changes:**
- Add a top-level React ErrorBoundary in App.tsx that catches render errors and shows a fallback UI with a "Reload" button instead of a blank screen
- Guard the router initialization so a loading spinner is shown while the authentication state is being resolved, preventing routes from rendering prematurely
- Make the LandingPage "Get Started" button resilient: wrap the login call in try/catch, show an error toast on failure, display a loading state during auth init, and redirect authenticated users to /vault
- Wrap actor creation in useActor hook with try/catch so failures return null instead of crashing the app, and ensure React Query hooks handle a null actor gracefully

**User-visible outcome:** The app no longer shows a blank screen on load; users see a loading spinner during auth initialization, a readable error message with a reload option if something goes wrong, and the "Get Started" button behaves correctly under all auth states.
