---
name: lumos-create-components
description: Create or extend Astro components for Lumos for Astro, including library components, content blocks, and reusable section components. Use whenever the user asks to build, add, refactor, or fix a Lumos component, component variant, card, visual, or reusable UI element.
---

# Creating Lumos components

Create components that read as part of the Lumos library: typed, predictable,
and easy to change from one place.

Read `LUMOS.md` before editing. It holds the project-wide rules for props,
styling, naming, and component boundaries.

## Choose the boundary first

Use this order:

1. **Reuse an existing library component.** Most needs are already covered by
   `Section`, `ContentWrapper`, `Grid`, `ButtonWrapper`, `Card`, `Img`, `Icon`,
   `Heading`, `Paragraph`, and related components.
2. **Add a variant or conditional prop** when the new appearance is another
   version of a library component.
3. **Create a content component** in `src/components/content/` when a reusable
   content block needs its own CSS or script.
4. **Create a section component** in `src/components/section/` when its styles
   or script act on the whole section.
5. **Create a library component** elsewhere in `src/components/` only when it
   belongs in the shared system rather than to one content block.

Do not create a component merely to group markup, shorten a page, or anticipate
reuse. A component earns its place when custom CSS or a script belongs to an
element or its children.

Copying a component to another page is not allowed: it must work without moving
other code with it.

## Follow the local component pattern

Before writing code, read two or three comparable components in the target
folder. Match their conventions rather than inventing new ones.

A typical component:

- imports `HTMLAttributes` from `astro/types` when it forwards native props
- defines `render`, defaulting to `true`
- renders nothing when `render` is `false`, required content is missing, or a
  required slot is empty
- checks required slots with `slotContent` from `@/utils/slots.ts`, not
  `Astro.slots.has`
- forwards remaining attributes to its root element
- keeps its styles in the same file under `<style is:global>` and
  `@layer components`
- uses `class:list` for conditional classes

Do not put CSS in a page to work around a component that is missing a needed
capability.

## Design the prop API

Order props consistently in the type, destructure, and call sites:

1. `render`
2. content that changes per instance
3. `variant`
4. props that apply only to some variants
5. occasional settings
6. `class` and `...rest`

Document every public prop. Use the exact wording of comparable components for
shared props. Describe the decision rather than repeating the allowed values.
State numeric ranges with `@min`, `@max`, and `@int` when applicable.

Use discriminated unions for variant-specific props:

```ts
type Props = Base &
  (
    | { variant?: "default"; image?: never }
    | { variant: "cover"; image?: ImageSource; imageAlt?: string }
  );
```

Then widen the union when destructuring, following `Card` and `Img`:

```ts
type AllProps = Base & {
  variant?: "default" | "cover";
  image?: ImageSource;
  imageAlt?: string;
};

const { variant = "default", image, ... } = Astro.props as AllProps;
```

`never` makes an invalid combination fail type checking rather than silently
ignore a prop.

Callers pass utility classes through `class`; `class` is for one-off utility
overrides only. If several instances need the same custom look, make it a
variant instead.

## Write the styles

Use the checklist in `LUMOS.md`. The rules that most often matter:

- prefer an existing variant over new CSS
- do not target library components from custom selectors
- root class ends in `_wrap`
- child classes use the family name and describe their role, not their
  mechanism: `_layout`, `_list`, `_title`, `_text`
- variants are bare classes beside the root: `.example_wrap.side`
- use rem, `ch`, or em; do not use `px`
- reuse the breakpoints declared by `Grid`: `30rem`, `48rem`, and `64rem`
- nest each media query inside the rule it changes, and share one breakpoint
  across the component where possible
- prefer global tokens and patterns over component-local values

For a graphic that must scale as one editable piece, use the
`lumos-scaling-graphic` skill.

## Content and section components

A content component accepts content and utility classes through `class`, but
does not pass up styling props. This keeps text sizes stable across
instances. If it forwards a heading's `tag`, set the heading's `variant`
itself.

A section component passes up only the relevant `Section` props and forwards
remaining attributes:

```ts
type Props = Pick<
  ComponentProps<typeof Section>,
  "render" | "theme" | "paddingTop" | "paddingBottom"
> &
  HTMLAttributes<"section">;
```

Name content blocks for their role and variant: `HeroBlog`, `CtaMain`,
`HeroTeam`. Put them in `src/components/content/`.

## Verify

After each logical change, run:

```bash
bun run check
```

Then build the site:

```bash
bun run build
```

Inspect the affected page in the dev server when visual behavior matters:

```bash
astro dev --background
```

Fix diagnostics in files you changed. Do not leave comments beyond prop
tooltips, stylesheet section banners, and necessary one-line page labels.
