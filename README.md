# Antler - Hello World Mini App

A simple example app demonstrating profile access via the IRL Browser API with JWT verification. Built with Preact, TypeScript, and Tailwind CSS. This is meant to run inside an IRL Browser like Antler.

IRL Browser mini apps are web apps that run inside IRL Browsers like Antler, accessing user profiles through QR code scanning without requiring traditional auth systems. See [`/docs/irl-browser-standard.md`](/docs/irl-browser-standard.md) for the specification.

## Quick Start

```bash
npm install       # Install dependencies
npm run dev       # Start dev server (localhost:5173)
npm run build     # Build for production
npm run preview   # Preview production build
```

## Deployment

1. **Build**: Run `npm run build`
2. **Host**: Deploy `/dist` folder to any static hosting (Vercel, Netlify, etc.)
3. **HTTPS Required**: IRL Browser apps must be served over HTTPS
4. **Update Manifest**: Set production URL in `irl-manifest.json` `url` field

## Tech Stack

- **Preact** - Lightweight React alternative
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first CSS
- **Vite** - Build tool with HMR
- **@noble/curves** - Ed25519 signature verification
- **base58-universal** - DID parsing
- **jwt-decode** - JWT decoding
- **qrcode.react** - QR code generation

## License

MIT