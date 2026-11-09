---
name: lumos-create-themes
description: Create, extend, or refactor Lumos for Astro themes, color systems, design tokens, and light/dark/invert variants. Use whenever the user asks to build, add, change, or fix a Lumos theme, palette, color scheme, token set, brand theme, or theme switching behavior.
---

# Creating Lumos themes

A Lumos theme is a coherent set of visual decisions expressed through CSS
custom properties. It changes the site without rewriting component markup.

Read `LUMOS.md` before editing, then read the color-theme section of
`src/styles/base.css`. The semantic token contract lives there; treat it as the
source of truth.

## Choose the right level

Use this order:

1. **Existing semantic tokens.** Components already consume `--background`,
   `--text`, `--button-background`, and the rest. Prefer changing or extending
   those over styling components.
2. **Existing theme variants.** `theme-light`, `theme-dark`, `theme-brand`, and
   `theme-invert` already cover most light/dark and inverse needs.
3. **A new theme file** in `src/styles/themes/` when the site needs a named
   palette that can be applied as a class.
4. **New tokens** in `src/styles/base.css` when several themes need the same
   new dimension.

Do not create a theme when the request is only to tune one component. Use a
component variant or a scoped custom property for that.

## Understand the token layers

Lumos separates raw values from semantic roles:

- **Swatches** such as `--paper`, `--ink`, `--violet`, and `--teal` are the
  source colors.
- **Semantic tokens** such as `--background`, `--background-2`, `--text`,
  `--text-2`, `--border`, and `--button-background` describe the role a color
  plays.
- **Themes** assign swatches and derived colors to semantic tokens.
- **Components** consume semantic tokens, never raw swatches, when they need a
  color that can change with the theme.

This separation lets a theme change the whole page while components stay
stable. Preserve it.

Read `base.css` fully before defining a new theme so every semantic token used
by components has a value.

## Design a new theme

Create a file under `src/styles/themes/` named for the theme, using lowercase
kebab case. Define it as a class on a scoped element so it can be applied to
the root, a layout, or a section:

```css
.theme-sunset {
  color-scheme: dark;

  --background: var(--ink);
  --background-2: var(--ink-soft);
  --background-3: color-mix(in lab, var(--ink-soft) 80%, var(--paper));
  --background-skeleton: color-mix(in lab, currentcolor 10%, transparent);
  --text: var(--paper);
  --text-2: color-mix(in lab, currentcolor 66%, transparent);
  --border: color-mix(in lab, var(--text) 16%, transparent);
  --heading-accent: var(--peach);
  --heading-accent-background: transparent;

  --selection-background: var(--orange);
  --selection-text: var(--ink);

  --button-background: var(--paper-light);
  --button-border: var(--button-background);
  --button-text: var(--ink);
  --button-background-hover: var(--orange);
  --button-border-hover: var(--button-background-hover);
  --button-text-hover: var(--ink);

  --button-2-background: transparent;
  --button-2-border: color-mix(in lab, var(--text) 29%, transparent);
  --button-2-text: var(--text);
  --button-2-background-hover: var(--text);
  --button-2-border-hover: var(--button-2-background-hover);
  --button-2-text-hover: var(--background);

  --link-text: var(--text);
  --link-border: var(--border);
  --link-text-hover: var(--text);
  --link-border-hover: var(--peach);
}
```

Include every semantic token from the existing themes. A partial theme leaves
components inheriting unrelated colors from the parent and produces subtle
inconsistencies.

Set `color-scheme` to `light` or `dark` so browser controls match the theme.

Import the theme in `src/styles/global.css`, after the base layer:

```css
@import "./themes/sunset.css";
```

Keep the global cascade order intact:

```css
@layer base, patterns, components, utilities;
```

The theme should extend the base layer, not introduce a competing cascade
order.

## Apply the theme

Use the existing theme props where they fit:

```astro
<Layout theme="dark">
```

For a custom theme class, pass a utility or scoped class to the layout or
section rather than editing component internals. If the theme must apply to
the entire document, add a theme class to the root element in
`BaseLayout.astro` and keep the mechanism in one place.

For theme variants that invert a section within another theme, follow the
existing inversion rules in `base.css`:

- `.theme-dark .theme-invert`
- `.theme-light .theme-invert`
- `.theme-brand .theme-invert`

Do not create ad hoc inversions in components. A component must render
correctly under every theme without theme-specific selectors.

## Keep typography and spacing stable

A color theme changes color, not the entire design system. Keep typography
families, type scale, spacing, radii, borders, and layout tokens stable unless
the request explicitly calls for a different typography or spacing theme.

When a new theme needs a different brand color, update the semantic brand
tokens at the theme scope rather than changing the global `--brand-500` unless
the whole site should change.

## Preserve accessibility

Check every theme against the site's content:

- body text and controls meet WCAG AA contrast
- focus indicators remain visible
- selected text and hover states remain distinguishable
- `color-scheme` matches the actual background
- imagery and media still have enough separation from the surface
- dark and light themes do not rely on color alone for state

Use `color-mix(in lab, ...)` for derived translucent colors when the existing
theme does. It keeps borders and muted text tied to the current text color.

## Verify

After each logical change, run:

```bash
bun run check
bun run build
```

Then inspect the theme in the dev server:

```bash
astro dev --background
```

Check the root page, light and dark sections, inverted sections, forms,
buttons, links, selection, focus states, and hover states. Also test the
contrast of the theme's semantic token pairs.
