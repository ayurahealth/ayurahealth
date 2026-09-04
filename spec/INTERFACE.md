# Ayura Intelligence — Interface Specification

## Design Philosophy

Ayura Intelligence uses a **custom vanilla CSS design system** (no Tailwind runtime) for maximum performance. The aesthetic blends ancient Indian aesthetics with modern glass morphism.

- **Dark emerald** primary palette (#1a4d2e → #05100a)
- **Gold accent** (#c9a84c) inspired by Ayurvedic manuscripts
- **Glass morphism** surfaces with backdrop-filter blur
- **Cormorant Garamond** for display headings (ancient gravitas)
- **System UI** for body text (readability at scale)

## Design Tokens (CSS Variables)

```css
/* Backgrounds */
--bg-main:     #05100a        /* Deep forest black */
--bg-surface:  #0a1f10        /* Elevated surface */
--bg-mid:      #0f2a15        /* Mid-level surface */

/* Accent */
--accent-main: #2d7a3a        /* Emerald green */
--accent-gold: #c9a84c        /* Ayurvedic gold */

/* Text */
--text-main:   #f0e6c8        /* Warm parchment */
--text-muted:  rgba(200,200,200,0.6)
--text-dim:    rgba(200,200,200,0.3)

/* Borders */
--border-mid:  rgba(255,255,255,0.08)
--border-low:  rgba(255,255,255,0.04)

/* Typography */
--font-display: 'Cormorant Garamond', Georgia, serif
--font-body:    system-ui, -apple-system, sans-serif
```

## Page Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page with onboarding CTA + knowledge cards |
| `/chat` | Main VAIDYA chat interface (SSE streaming) |
| `/onboarding` | Dosha quiz (5-step clinical intake) |
| `/dashboard` | User health dashboard + session history |
| `/pricing` | Subscription tiers (Free, Pro, Clinic) |
| `/clinic` | B2B clinic partnership page |
| `/diet` | Personalized diet planner |
| `/cycle` | Cycle tracking (Ayurvedic) |
| `/translator` | Medical text translator (50+ languages) |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/safety` | Medical safety disclaimer |

## Chat Interface (Primary UX)

### Layout

```
┌──────────────────────────────────────────────┐
│  VAIDYA Header                               │
│  [System selector] [Dosha badge] [Settings]  │
├──────────────────────────────────────────────┤
│  Message Stream                              │
│  ┌────────────────────────────────────────┐  │
│  │ 👤 User message (right-aligned)         │  │
│  │ 🌿 VAIDYA streaming response            │  │
│  │    (token-by-token, left-aligned)       │  │
│  └────────────────────────────────────────┘  │
├──────────────────────────────────────────────┤
│  [📎 Attach] [Input Field ···] [Send ▶]     │
│  [🎤 STT] [🧠 Deep Think] [🌿 Caveman]      │
└──────────────────────────────────────────────┘
```

### Streaming States

| State | Visual |
|-------|--------|
| `idle` | Empty input, send disabled |
| `loading` | Animated emerald pulse indicator |
| `streaming` | Live token-by-token text appearance |
| `error` | Red-tinted message: "Connection interrupted. Please try again." |
| `paywall` | Upgrade overlay with Pro CTA |

## Glass Morphism System

```css
.ios-glass-regular {
  background: rgba(10, 31, 16, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px;
}

.ios-glass-mirror {
  background: linear-gradient(135deg,
    rgba(255,255,255,0.05) 0%,
    rgba(255,255,255,0.00) 100%
  );
}

.ios-glass-shimmer::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.02), transparent);
  animation: shimmer 3s infinite;
}
```

## Responsive Design

- **Mobile-first**: All layouts designed for 375px minimum width
- **iOS PWA**: `apple-mobile-web-app-capable`, custom splash screens, status bar styling
- **Capacitor iOS**: Native build via `npm run ios:setup`
- **Maximum scale**: 5x (`maximum-scale=5`) — prevents iOS auto-zoom on input focus
- **Dark mode only**: Single dark theme, no light/dark toggle

## Animation System

- **Framer Motion**: Page transitions and component reveal animations
- **CSS keyframes**: Streaming indicator pulse, shimmer effects
- **Intersection Observer**: Scroll-triggered opacity/transform reveals on landing
- **CSS transitions**: Button hover states, glass surface interactions
