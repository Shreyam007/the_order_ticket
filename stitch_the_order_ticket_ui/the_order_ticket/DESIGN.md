---
name: The Order Ticket
colors:
  surface: '#fcf9f0'
  surface-dim: '#dddad1'
  surface-bright: '#fcf9f0'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ea'
  surface-container: '#f1eee5'
  surface-container-high: '#ebe8df'
  surface-container-highest: '#e5e2da'
  on-surface: '#1c1c17'
  on-surface-variant: '#4d4540'
  inverse-surface: '#31312b'
  inverse-on-surface: '#f4f1e8'
  outline: '#7f756f'
  outline-variant: '#d0c4bd'
  surface-tint: '#655d58'
  primary: '#15100d'
  on-primary: '#ffffff'
  primary-container: '#2b2521'
  on-primary-container: '#958b86'
  inverse-primary: '#cfc4be'
  secondary: '#7a5900'
  on-secondary: '#ffffff'
  secondary-container: '#fdc74d'
  on-secondary-container: '#725300'
  tertiary: '#001602'
  on-tertiary: '#ffffff'
  tertiary-container: '#002e08'
  on-tertiary-container: '#6b9967'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ece0da'
  primary-fixed-dim: '#cfc4be'
  on-primary-fixed: '#201a17'
  on-primary-fixed-variant: '#4d4541'
  secondary-fixed: '#ffdea1'
  secondary-fixed-dim: '#f4be45'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5c4300'
  tertiary-fixed: '#bdf0b7'
  tertiary-fixed-dim: '#a2d39c'
  on-tertiary-fixed: '#002204'
  on-tertiary-fixed-variant: '#255026'
  background: '#fcf9f0'
  on-background: '#1c1c17'
  surface-variant: '#e5e2da'
typography:
  display-xl:
    fontFamily: Barlow Condensed
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
  headline-lg:
    fontFamily: Barlow Condensed
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Barlow Condensed
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Karla
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.5'
  body-md:
    fontFamily: Karla
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: -0.02em
  price-lg:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '700'
    lineHeight: '1.0'
  label-caps:
    fontFamily: Barlow Condensed
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  container-max: 1280px
---

## Brand & Style
The design system is built on the utilitarian efficiency of a high-volume industrial kitchen. It evokes the tactile experience of paper tickets, heavy-duty stainless steel, and ink-on-kraft-paper. The aesthetic is "Industrial Kitchen Utilitarian"—a blend of Brutalism and tactile functionalism. It prioritizes speed of reading and clarity of action, avoiding the "softness" of consumer apps in favor of a professional, "back-of-house" authority. 

The interface should feel like a physical object: organized, high-contrast, and durable. Visual depth is achieved through layering and borders rather than shadows, maintaining a flat, printed-matter quality that feels both premium and hardworking.

## Colors
The palette is grounded in a warm, textured neutral base that mimics heavy-weight kraft paper or unbleached cardstock. 

- **Background:** Use `#F6F3EA` for all primary surfaces.
- **Ink & Typography:** Use `#2B2521` for maximum legibility. Avoid true black to maintain the "ink on paper" warmth.
- **Accents:** These are used functionally to denote station statuses. Mustard for preparation, Herb Green for completion, Plum for logistics, and Brick Red for urgency or spicy menu modifiers.
- **Borders:** Depth is created using layered borders. Use the Hairline (`#E4DFD3`) for subtle separation and the Strong (`#D2CAB8`) for structural grouping and component containers.

## Typography
The typography system follows a tripartite logic based on functional roles:

1.  **Directives (Barlow Condensed):** Used for headlines and navigation. Always uppercase in high-level roles to mimic kitchen menu boards and shouted orders. It is efficient, tall, and authoritative.
2.  **Narrative (Karla):** Used for item descriptions and general body text. It provides a human, slightly quirky grotesque touch that ensures long-form readability.
3.  **Data (JetBrains Mono):** Used for prices, order numbers, quantities, and timestamps. This font provides a "receipt" aesthetic, ensuring characters align vertically for easy scanning of numerical data.

## Layout & Spacing
The layout is based on a rigid 4px baseline grid. Content should feel tightly packed but organized—reminiscent of an "Expo Rail" where tickets are lined up edge-to-edge.

- **The Expo Rail:** Use a horizontal-scroll navigation or list at the top of the screen. Elements in the rail should be separated by vertical hairline borders.
- **Section Dividers:** Use a "scissors-and-dash" pattern (`- - - ✂ - - -`) to separate logical groups of content within a single ticket or page.
- **Grid:** On desktop, use a 12-column grid with no gutters between primary card containers to create a monolithic, "tiled" look. On mobile, use a single column with 16px side margins.

## Elevation & Depth
This design system explicitly rejects shadows and blurs. Depth is achieved through "Tonal Stacking" and "Mechanical Fasteners":

- **Level 0 (Base):** The Kraft paper background (`#F6F3EA`).
- **Level 1 (The Ticket):** White or slightly lighter containers with `Strong` borders.
- **Level 2 (The Tag):** High-contrast accent blocks (Mustard, Herb Green) placed on top of Level 1.
- **The Cut Edge:** Use a `clip-path` polygon to create a zigzag "torn paper" effect on the bottom of cards and tickets.
- **Mechanical Cues:** Use Bulldog Clip icons to "attach" primary navigation elements to the top rail. This grounds the UI in the physical world of a kitchen line.

## Shapes
The shape language is strictly geometric. 

- **Corners:** Standard corner radius is 2px for small elements (inputs, tags) and 6px for larger containers (cards, tickets). Rounded "pill" or "bubble" shapes are prohibited.
- **Luggage Tags:** Status tags should have a "clipped corner" on one side and a 4px circular "punched hole" on the opposite side to reinforce the physical tag metaphor.
- **Dividers:** Use a dashed stroke (2px dash, 4px gap) for horizontal rules.

## Components
- **Buttons:** Thick 2px borders, square corners, and Barlow Condensed uppercase text. Interaction state (hover/active) should invert the colors (Ink background, Neutral text).
- **Quantity Steppers:** Large, thick squares. The number is centered in JetBrains Mono. Plus/Minus controls are secondary square blocks attached to the sides.
- **The "Order Ticket" Card:** A white container with a 1px `Strong` border, a zigzag bottom edge, and a Luggage Tag in the top-right corner indicating status.
- **Input Fields:** Rectangular with a 1px `Hairline` border. On focus, the border thickens to 2px `Ink`. Use JetBrains Mono for user-entered data.
- **Bulldog Rail:** A horizontal navigation bar where each "tab" looks like a paper slip held by a metallic clip icon at the top center.
- **Checkboxes:** Simple squares with a heavy "X" mark instead of a checkmark, echoing a chef's quick marking on a paper ticket.