# Figma Handoff Checklist - Apple Reference Pass

Use this checklist to keep Figma and code in sync after the iOS-style design system pass.

## 1) Design Tokens (must match code)

- [ ] Colors: map Figma tokens to `--ios-bg`, `--ios-text`, `--ios-muted`, `--ios-primary`, `--ios-accent`
- [ ] Surfaces: map glass styles to `--ios-surface`, `--ios-surface-strong`, `--ios-stroke`, `--ios-stroke-strong`
- [ ] Radius + depth: map to `--ios-radius-xl`, `--ios-radius-lg`, `--ios-shadow-xl`, `--ios-shadow-md`
- [ ] Motion: use `--ios-ease-standard` timing curve for tap/hover transitions
- [ ] Chat typography: align bubble text sizing and rhythm with `.chat-assistant-bubble`, `.chat-user-bubble`, `.chat-meta-text`

## 2) Components to Mirror in Figma

- [ ] `Surface` (`components/ui/Surface.tsx`) - variants: `default`, `strong`
- [ ] `IOSButton` (`components/ui/IOSButton.tsx`) - variants: `primary`, `secondary`
- [ ] `SystemCard` (`components/ui/SystemCard.tsx`) - idle + active state
- [ ] `IOSSegmentedControl` (`components/ui/IOSSegmentedControl.tsx`) - idle + active segment
- [ ] `Logo` usage pattern in top nav and page headers

## 3) Route-Level Mapping

- [ ] `/design-system` - source of truth preview for tokens + primitives
- [ ] `/` (landing) - section rhythm via `.ds-section` and `.ds-section-compact`
- [ ] `/chat` - system picker cards + chat bubble typography
- [ ] `/pricing` - segmented controls for billing/currency + card hierarchy

## 4) Interaction + Motion Rules

- [ ] Touch targets: minimum 44px for all tappable controls
- [ ] Segmented control: active segment has elevated contrast and subtle inner highlight
- [ ] Cards: preserve soft glass layering and avoid heavy borders
- [ ] Keep motion subtle: no bounce-heavy transitions on core flows
- [ ] Reduced motion mode supported (no critical animation dependencies)

## 5) QA Acceptance Before Signoff

- [ ] iPhone viewport pass (small, medium, large) for `/`, `/chat`, `/pricing`
- [ ] Contrast check on muted text over glass surfaces
- [ ] Active/inactive component state parity between Figma and app
- [ ] Spacing parity for section paddings and component gutters
- [ ] One final visual diff pass using screenshots from deployed preview

## 6) Weekly Workflow

- [ ] Update Figma component page after every merged UI PR
- [ ] Add or update any new token in `app/globals.css` first, then sync to Figma
- [ ] Review `/design-system` page before shipping visual changes
- [ ] Keep this checklist attached to design handoff tickets
