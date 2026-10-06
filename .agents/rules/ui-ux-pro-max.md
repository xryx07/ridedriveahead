# UI/UX Pro Max Guidelines for RideDriveAhead

Always apply the **UI/UX Pro Max** standards whenever designing, building, or modifying frontend interfaces:

1. **Accessibility (WCAG AA)**:
   - Ensure minimum contrast ratio of 4.5:1 for body copy and 3:1 for large text/icons.
   - Always include `:focus-visible` ring on buttons, inputs, links, and interactive elements.
   - Use meaningful aria-labels on icon-only buttons.
2. **Icons & Visual Quality**:
   - **Never use emoji as production UI icons**. Always use clean, inline vector SVGs (Lucide / Heroicons).
   - Ensure consistent stroke widths (1.5px or 2px) and tokenized sizing (`16px`, `20px`, `24px`).
3. **Touch & Interactions**:
   - Minimum tap target of 44×44px on mobile.
   - Add `cursor: pointer` to all interactive components.
   - Provide tactile feedback (active states, opacity or subtle transform) on click/press.
4. **Responsive Layout**:
   - Ensure seamless reflow at 375px (mobile), 768px (tablet), 1024px (laptop), and 1440px (desktop).
   - Zero horizontal scrollbar under any circumstance.
5. **Color & Typography**:
   - Follow 60-30-10 color distribution (60% background/neutral, 30% surface, 10% or 5% Electric Lime `#C7FF3D` accent).
   - Base typography at 16px body, 1.5 line height, using Plus Jakarta Sans.
6. **Performance & Motion**:
   - Reserve space for async widgets and maps to prevent Cumulative Layout Shift (CLS).
   - Support `prefers-reduced-motion`.
