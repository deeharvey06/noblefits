# Phase 11 — Account + Orders

## Implemented from supported functionality

- Redesigned sign-in experience using the existing Firebase email/password flow.
- Redesigned registration using the existing Firebase account creation flow.
- Google sign-in remains available through the existing Firebase provider.
- Added Firebase-native password recovery at `/forgot-password`.
- Added a protected `/account` route.
- Added read-only profile presentation for the existing `displayName`, `email`, and `createdAt` fields.
- Added explicit account-session sign out.
- Added session-restoration UI state so protected account routing waits for Firebase session checking.
- Normalized the Firestore `createdAt` timestamp before storing the user profile in Redux.
- Replaced direct desktop-header sign out with a durable Account destination.

## Intentionally not implemented

The current application has no backing model/API for these capabilities, so Phase 11 does not fabricate them:

- editable profile fields
- saved addresses
- saved payment methods
- order history
- order detail
- order status
- shipment tracking
- account-synchronized carts

The account page explains these current product boundaries where they are relevant rather than presenting fake empty order data or non-functional controls.

## Security boundary

Existing Firebase authentication remains the source of truth. Email/password sign-in, Google sign-in, registration, and sign out still use the same Firebase Auth project and Redux Saga integration.

Password reset uses Firebase Auth's `sendPasswordResetEmail` function and intentionally uses non-enumerating confirmation copy: the interface does not confirm whether a submitted email has an account.

No backend authentication contract, password storage, Firebase security rules, or privileged role behavior was added or changed.
