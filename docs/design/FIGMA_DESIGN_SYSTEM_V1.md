# AyuraHealth Design System V1 (Figma + Code Sync)

Use this as the source-of-truth for Figma setup and implementation.

## 1) Core Visual Direction
- Style: iOS-inspired wellness UI
- Mood: premium, calm, trustworthy
- Core idea: glass surfaces + grounded herbal palette + clinical clarity

## 2) Tokens (match code)

### Colors
- `ios/bg`: `#05100a`
- `ios/text`: `#e8dfc8`
- `ios/muted`: `rgba(232,223,200,0.62)`
- `ios/primary`: `#6abf8a`
- `ios/accent`: `#c9a84c`
- `ios/surface`: `rgba(12,28,18,0.72)`
- `ios/surface-strong`: `rgba(16,34,22,0.82)`
- `ios/stroke`: `rgba(255,255,255,0.10)`
- `ios/stroke-strong`: `rgba(106,191,138,0.34)`

### Radius
- `radius/lg`: `16`
- `radius/xl`: `20`

### Shadow
- `shadow/md`: `0 8 24 0 rgba(0,0,0,0.34)`
- `shadow/xl`: `0 16 44 0 rgba(0,0,0,0.52)`

## 3) Components to Build in Figma First
- Glass Surface Container
- System Card (inactive/active)
- Trust Badge Pill
- Chat Bubble (user/assistant)
- Input Bar (attachment icons + send)
- Sticky Header (logo + utility controls)

## 4) Page Priorities
1. Chat (primary usage surface)
2. Landing hero + conversion blocks
3. Pricing trust/CTA zone
4. iOS wrapper screens (launch, chat, settings)

## 5) UX Rules
- Keep hierarchy simple: one primary CTA per section
- Keep response readability: max 5-8 bullets default
- Use single source of truth for tokens (Figma variables + CSS vars)
- Avoid heavy gradients on text-heavy sections
- Accessibility baseline: minimum 4.5:1 contrast for body text

## 6) Weekly Design Workflow
- Monday: update token/component library
- Tuesday: produce 1 high-impact screen
- Wednesday: implement in code
- Thursday: mobile QA + readability pass
- Friday: release and compare user engagement

## 7) Immediate Next Screen Set (recommended)
- Chat V2 (header, system picker, message rhythm)
- Landing V2 (hero + social proof + safety)
- Pricing V2 (trial trust + plan differentiation)
- iOS onboarding V1 (3 slides + disclaimer)
