## $(date +%Y-%m-%d) - Accessible Icon Buttons in Chat Composer
**Learning:** Found a common pattern of unlabelled icon-only interactive elements in the Chat Composer, impacting screen reader navigation and general usability (tooltips). Dynamic states require dynamically updating ARIA labels to ensure accuracy.
**Action:** Always verify icon-only buttons have dynamic `aria-label` and `title` attributes that correctly reflect their current state (e.g., active/inactive, listening/stopped).
