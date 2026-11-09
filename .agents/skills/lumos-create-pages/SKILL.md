---
name: lumos-create-pages
description: Create, compose, or modify Astro pages in Lumos for Astro, including landing pages, content pages, project pages, 404 pages, and dynamic routes. Use whenever the user asks to build, add, refactor, or fix a Lumos page, route, landing page, or page section.
---

# Creating Lumos pages

Build pages by composing Lumos components directly. A page should read as a
sequence of meaningful sections, with almost no bespoke markup or CSS.

Read `LUMOS.md` before editing. It holds the project-wide rules for page
composition, styles, components, and naming.

## Compose from existing components

Use this order:

1. `Layout` for the document shell and metadata
2. `Section` for page-level regions
3. `ContentWrapper` for the content arrangement inside a section
4. `Grid` for card and item collections
5. `Heading`, `Paragraph`, `Eyebrow`, `ButtonWrapper`, `Button`, `Img`, `Icon`,
   `Card`, and other library components for the content
6. content components from `src/components/content/` for reusable blocks

Do not create a custom component just to group page markup. Most pages need no
new component at all.

Prefer `ContentWrapper` to a plain `div` for holding content. It ties text and
flex alignment to one `--_alignment` variable, so `centered` on the default
`stack` variant moves the whole block together.

Use a `<Fragment>` only when a named slot needs multiple siblings and a real
element would change layout or semantics.

## Start from the page contract

Create a page under `src/pages/`. For a static route, use the filename as the
route:

- `src/pages/about.astro` serves `/about`
- `src/pages/work/index.astro` serves `/work`
- `src/pages/404.astro` serves the not-found page

For a dynamic route, read Astro's routing documentation before implementing it.
Use `getStaticPaths` for static output and define the route's `Props` type.
Keep route data at the edge of the page and pass values into components.

Read the relevant Astro documentation before adding routes, middleware, content
collections, or framework components. The project documentation is listed in
`AGENTS.md`.

## Build the page

A typical static page:

```astro
---
import Layout from "@/layouts/BaseLayout.astro";
import Section from "@/components/wrapper/Section.astro";
import ContentWrapper from "@/components/wrapper/ContentWrapper.astro";
import Heading from "@/components/typography/Heading.astro";
import Paragraph from "@/components/typography/Paragraph.astro";
---

<Layout
  title="About"
  description="A short description of this page."
  overlap={true}
>
  <Section paddingTop="navoverlap" paddingBottom="large">
    <ContentWrapper centered={true}>
      <Heading variant="h1" tag="h1" maxWidth={20}>
        About
      </Heading>
      <Paragraph variant="large" maxWidth={36}>
        Page content.
      </Paragraph>
    </ContentWrapper>
  </Section>
</Layout>
```

Use `overlap={true}` when the navigation should sit over the first section, and
give that section `paddingTop="navoverlap"` so its content clears the bar.

Use one `h1` per page. Choose heading levels to describe the document outline,
not to control size. When the visual style must differ from the heading level,
set `variant` explicitly.

Use `maxWidth` in characters for readable text. Its prop is a number, not a
percentage or CSS length.

## Keep page styling out of the page

A page carries no CSS. If a section needs custom styles, create a content or
section component that owns them under the rules in `LUMOS.md`, then use that
component from the page.

Utility classes may tune one instance, such as a font or a small spacing
override. Several utilities that must stay together to create a look belong in
a variant or component, not in repeated page markup.

## Use data deliberately

Keep content in the page when it belongs to that page. Move repeated or
site-wide content into the project's existing data modules rather than creating
a new data system without need.

For collections, map over a typed array and render a library component for
each item. Keep the data source and rendering at the page level unless the
block is reused across pages.

Do not hard-code a structure that depends on runtime browser APIs in server
rendered markup. Use Astro's client directives or an interactive component
when behavior needs the browser.

## Verify

After each logical change, run:

```bash
bun run check
bun run build
```

Then inspect the page in the dev server:

```bash
astro dev --background
```

Check the rendered heading outline, metadata, spacing, responsive layout, and
every interactive control. Fix diagnostics in files you changed.
