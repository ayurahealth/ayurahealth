## 2025-02-24 - Adding ARIA Labels to Icon-Only Buttons
**Learning:** This app frequently relies on minimal UI patterns like icon-only buttons (e.g. ChatComposer and Dashboard modals). While clean visually, this repeatedly causes accessibility barriers because screen readers cannot interpret the action.
**Action:** Always verify that newly created or existing icon-only buttons include an `aria-label` attribute describing their purpose clearly, so that all users have context for the interaction.
