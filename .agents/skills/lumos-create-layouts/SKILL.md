---
name: lumos-create-layouts
description: Create or modify Astro layouts for Lumos for Astro, including document shells, shared page structure, SEO metadata, navigation, headers, footers, and nested layouts. Use whenever the user asks to build, add, refactor, or fix a Lumos layout, template shell, base layout, or shared page wrapper.
---

# Creating Lumos layouts

A layout owns the structure shared by pages. Keep it thin: document shell,
global chrome, metadata, and the main content boundary. Page-specific content
belongs in pages, not in a layout.

Read `LUMOS.md` before editing and read `src/layouts/BaseLayout.astro` before
changing the shared shell.

## Decide whether a layout is needed

Create or change a layout when several pages share:

- the same document shell
- the same navigation, header, or footer
- the same metadata behavior
- the same structural wrapper around the page content

Do not create a layout for one page. Compose that page from library components
instead.

Do not move page-specific sections into a layout. A layout should not know
which page is using it.

## Start from the base layout

`BaseLayout.astro` is the root document shell. It currently provides:

- global styles
- metadata through `BaseHead`
- `SkipLink`
- `Nav`
- the `main` landmark
- `Footer`
- optional `theme` and `overlap` props
- a named `head` slot for page-level metadata

Most work can be done by composing it. Read it first and preserve its document
structure and accessibility landmarks.

For a new page shell:

```astro
---
import Layout from "@/layouts/BaseLayout.astro";
---

<Layout title="Page title" description="Page description" overlap={true}>
  <!-- Page content -->
</Layout>
```

Use `title` and `description` when they differ from the site defaults. The
title is combined with the site name by `BaseHead`; do not repeat the site
name in the prop.

## Design layout props

Keep the layout API small and specific:

- reuse `SeoProps` for metadata
- forward `HTMLAttributes` only when the layout has a meaningful root element
- make optional behavior explicit through props with defaults
- document every public prop
- keep `render` first when the layout can be omitted
- keep `class` and `...rest` last

If a layout needs to select among several document structures, use a
discriminated union and a widened `AllProps` alias when destructuring, as the
library components do.

Do not duplicate metadata props already defined in `SeoProps`. If a new
metadata field is needed across the whole site, add it to the shared type and
`BaseHead` rather than inventing a layout-specific version.

## Keep accessibility intact

Preserve the landmarks and behaviors from `BaseLayout`:

- exactly one `main` element
- `id="main"` and `tabindex="-1"` for the skip link target
- a skip link before navigation
- named navigation landmarks
- the named `head` slot inside `head`

A layout must not introduce a second `main`. If the layout wraps content in a
new landmark, choose an appropriate element and label it.

When adding a header, navigation, sidebar, or footer, use semantic HTML and
provide an accessible name when multiple instances of the same landmark exist.

## Scope scripts and styles

Keep scripts and styles for the layout in the layout file. A script must
behave correctly after Astro's client-side navigation and should not assume a
single permanent DOM node.

Use global styles for tokens and shared patterns. Layout-specific styles belong
in the layout's own `<style is:global>` under `@layer components` when they
style a component, or under the appropriate global layer when they define a
page-wide pattern.

Never target library components from layout-specific selectors. Compose library
components with props and utility classes instead.

## Nested layouts

Use a nested layout when a family of pages shares structure beyond the base
shell, such as a project template or documentation frame. It should:

- render `BaseLayout`
- add only the shared structure for that page family
- expose content through the default slot
- accept metadata through the same `SeoProps`
- forward remaining attributes only when they have a clear destination

Avoid layouts that require a page to place slots in a particular order unless
that order is part of the contract and is documented.

## Verify

After each logical change, run:

```bash
bun run check
bun run build
```

Visit pages that use the layout in the dev server:

```bash
astro dev --background
```

Check the document landmarks, skip link, metadata, navigation, and responsive
behavior. Fix diagnostics in files you changed.
