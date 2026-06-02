---
name: Wakeel spec vs Replit platform deviations
description: Why the Wakeel Expo app intentionally diverges from its written spec (SDK/router/components)
---

# Wakeel: spec text vs. Replit platform constraints

The original Wakeel build prompt (in `attached_assets/`) asked for an Expo **SDK 51**
app using **React Navigation** with an `App.jsx` entry and components named
`MoEHeader`, `ProGate`, `TabBar`, and a custom `StatusBar`.

The app was instead built on the Replit Expo scaffold: **SDK 54 + Expo Router**
(file-based routing under `app/`), with equivalent components under different names
(e.g. `AppHeader`, `UpgradeModal`, the `(tabs)/_layout.tsx` tab bar).

**Why:** The authoritative `.local/skills/expo/SKILL.md` mandates this and overrides
the spec text:
- The Replit stack **uses Expo Router** for routing (skill line ~23). React
  Navigation / `App.jsx` is not the platform pattern.
- **NEVER downgrade** the Expo/RN version in package.json (skill line ~285), so
  SDK 51 is not possible — the scaffold ships SDK 54 / React 19 / RN 0.81.5.
- Keep the scaffold's `_layout.tsx` font-gating and `ErrorFallback` as-is.

**How to apply:** A code review that rejects this app for "not matching SDK 51 /
React Navigation / exact file names" is judging against spec text that conflicts
with the platform skill. The platform skill wins. Do **not** rewrite to SDK 51 /
React Navigation — that would violate the expo skill. Equivalent functionality
under platform-idiomatic names satisfies the requirement.
