## 2024-08-26 - Direct DOM Manipulation for Typing Animations
**Learning:** Storing typing animation state in React `useState` and updating it every 45ms causes full component re-renders (252 times on load for a short paragraph). This is a common React anti-pattern for performance, specifically in complex pages like `app/page.tsx`.
**Action:** For simple visual animations that don't affect React data flow (like a typing effect), use a `useRef` to directly manipulate the DOM element's `textContent` inside `useEffect`, bypassing React's render cycle completely.
