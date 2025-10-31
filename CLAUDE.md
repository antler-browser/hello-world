# CLAUDE.md for Hello World Mini App

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A "Hello World" IRL Browser mini app demonstrating profile access via `window.irlBrowser` API with JWT verification. Built with Preact, TypeScript, and Tailwind CSS. This is meant to run inside an IRL Browser like Antler.

IRL Browser mini apps are web apps that run inside IRL Browsers like Antler, accessing profiles and other data through QR code scanning without requiring auth systems. See `/docs/irl-browser-standard.md` for specification.

## Key Files and Directories

### Application
- `/src/components/`: Components organized by feature
  - `/QRCodePanel.tsx` - Shows a QR code for app. Hidden on mobile, visible on desktop.
- `/src/utils/`: Utility functions
  - `/jwt.ts` - JWT verification using @noble/curves Ed25519
- `/src/app.tsx` - Main component with IRL Browser integration and profile display
- `/src/main.tsx` - Entry point that renders App
- `/public/`: Public files
  - `irl-manifest.json` - Mini app IRL Browser manifest with metadata and requested permissions
  - `antler-icon.webp` - Mini app icon
- `/docs/`: Documentation
  - `irl-browser-standard.md` - IRL Browser Standard specification

## Development Commands

```bash
npm install       # Install dependencies
npm run dev       # Start dev server (localhost:5173)
npm run build     # TypeScript compile + Vite build
npm run preview   # Preview production build
```

## Architecture Overview

### JWT Verification Pipeline (`/src/utils/jwt.ts`)
1. Decode JWT with `jwt-decode`
2. Extract issuer DID from `iss` claim
3. Reject if JWT is expired (`exp` claim)
4. Reject if JWT is not intended for this application (`aud` claim)
5. Parse public key from DID: strip `did:key:z`, decode base58, remove multicodec prefix `[0xed, 0x01]`
6. Verify Ed25519 signature using `@noble/curves`: `ed25519.verify(signature, message, publicKeyBytes)`
7. Return typed payload

**Key detail**: Uses @noble/curves library for signature verification. (Cannot use other Web Crypto APIs as most mobile browsers don't support Ed25519 yet.)

### Responsive Layout
- **Mobile**: Single column, QR code hidden
- **Desktop**: Two columns with QR code panel on left

## Development Workflow

### Mobile Testing with ngrok
1. Run `ngrok http 5173`
2. Add your ngrok URL to `vite.config.ts` allowedHosts (line 9)
3. Run `npm run dev`
4. Scan QR code with IRL Browser app

### Debugging with Eruda
- Eruda is a mobile debugging tool that can be used to inspect the DOM, network requests, and console logs.
- Automatically loads in dev mode (`src/app.tsx` lines 10-16)
- Tap floating gear icon (bottom-right) to open mobile DevTools

## Third Party Libraries

- **preact** - Lightweight React alternative
- **vite** - Build tool with HMR
- **@noble/curves** - Ed25519 signature verification
- **base58-universal** - DID parsing
- **jwt-decode** - JWT decoding
- **qrcode.react** - QR code generation
- **tailwindcss** - Utility CSS (v4)
- **eruda** - Mobile debugging (dev only)

## Troubleshooting

### JWT Verification Failures
Check Eruda Console for errors. Common causes:
- Expired JWT (`exp` claim)
- Invalid signature
- Malformed DID (must start with `did:key:z`)
- Audience claim mismatch (must match production URL)

### Profile Not Loading
Check if API exists: `console.log(window.irlBrowser)`

### Build Errors
- Run `npm install`
- Check TypeScript errors: `npm run build`

### ngrok Issues
- Add your ngrok URL to `vite.config.ts` allowedHosts (line 9)