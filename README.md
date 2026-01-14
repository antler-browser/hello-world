# Antler - Hello World Example

An example app showing how a local-first auth using Antler works. When a user scans a QR code, their profile that is stored locally on their device is shared with the mini app. 

## Overview

When a user scans a QR code, their profile (DID, name, avatar, etc.) that is stored locally on their device is shared with the mini app.

1. We request the profile details from Local First Auth using the `window.localFirstAuth.getProfileDetails()` API.
2. We decode and verify the JWT using `src/lib/jwt.ts`
3. We display the profile details in the app.

## Useful commands

```bash
pnpm install       # Install dependencies
pnpm run dev       # Start dev server (localhost:5173)
pnpm run build     # Build for production
```

### Debugging Local First Auth Mini Apps
The Local First Auth Simulator injects the `window.localFirstAuth` API into a regular browser, allowing you to test your mini app locally without needing the Antler mobile app.

**Note:** This is a development-only tool and should never be used in production.

```typescript
if (import.meta.env.DEV) {
  const simulator = await import('local-first-auth-simulator')
  simulator.enableLocalFirstAuthSimulator()
}
```

That's it! The simulator will:
- Inject `window.localFirstAuth` into your page
- Load a default test profile (Paul Morphy)
- Show a floating debug panel
- Click "Open as X" to open a new tab and simulate multiple users
- Load a profile from the URL parameter `?test_profile=<id>`

## Tech Stack

- **React**
- **Tailwind**
- **qrcode.react** - Display QR code
- **jwt-decode** - JWT decoding
- **@noble/curves** - Ed25519 signature verification
- **base58-universal** - Base58 encoding
- **local-first-auth-simulator** - Local First Auth debugging