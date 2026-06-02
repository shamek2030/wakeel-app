---
name: Expo SQLite web hang
description: Why gating app render on expo-sqlite init blanks the Expo web preview, and how to avoid it
---

On web, `expo-sqlite`'s `openDatabaseAsync` requires a WASM build that is NOT
provisioned in the Replit Expo web preview. The call **hangs forever** — it
neither resolves nor rejects, so a surrounding `try/catch` (or `.finally`) never
runs.

**Symptom:** white/blank Expo web preview even though the JS bundle loads and
React mounts (deprecation warnings still fire). Caused by a root layout that
gates rendering on DB readiness (`if (!dbReady) return null`) where `dbReady` is
set in `initDatabase().finally(...)` — the finally never fires, so the gate
never opens.

**Why:** the hang is platform-specific (web only). Native (iOS/Android) opens
the bundled SQLite fine, so the bug is invisible on device and only shows in the
web preview pane / screenshot tool.

**How to apply:** in `initDatabase()`, short-circuit on `Platform.OS === 'web'`
and use the in-memory fallback store directly instead of calling
`openDatabaseAsync`. Never let a render gate depend on a promise that can hang —
either guarantee it settles or add a timeout fallback.

**Debugging tactic that worked:** bisect by replacing the root `_layout` with a
bare `<Stack/>` and the route with a plain colored `<View>`. If that paints, the
fault is in the provider/gate chain, not the screens. The "shadow* deprecated"
console warning fires from the navigator chain regardless of which screen
renders — it is NOT proof your screen mounted.
