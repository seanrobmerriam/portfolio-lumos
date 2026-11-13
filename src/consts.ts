/** Site name. Appended to every page title and used as `og:site_name`. */
export const SITE_NAME = "Sean Merriam - Design Engineer";
/** Fallback meta description for pages that don't set their own. */
export const SITE_DESCRIPTION =
  "Sean Merriam is a design engineer who designs and builds websites, web applications and native software, from first idea to finished product.";
/** Canonical origin. Resolves canonical URLs, social images, and the sitemap. */
export const SITE_URL = "https://seanrobmerriam.github.io";
/** BCP 47 locale tag used to format dates and numbers. */
export const SITE_LOCALE = "en-US";
/** Routes excluded from search and the sitemap. Surrounding slashes are ignored. */
export const NOINDEX_ROUTES: string[] = ["/404", "/admin", "/auth/sign-in"];

export const SERVICES = [
  {
    heading: "Design",
    text: "Turn an early idea into a clear, usable interface, with a visual direction that survives all the way to launch.",
    items: ["User journeys and information architecture", "Interface design and interactive prototypes", "Responsive layouts and interaction details"],
  },
  {
    heading: "Web Development",
    text: "Fast websites and web applications, built from reusable components and code your team can maintain.",
    items: ["Astro websites and web applications", "CMS and API integrations", "Accessibility and performance"],
  },
  {
    heading: "Brand Systems",
    text: "A practical foundation for your visual identity, so every new page and feature looks like it belongs.",
    items: ["Typography and color systems", "Design tokens and component libraries", "Usage guidelines and documentation"],
  },
  {
    heading: "Site Migrations",
    text: "Move off Webflow, WordPress or another platform with a plan for your content, URLs and publishing workflow.",
    items: ["Content audits and migration planning", "Page rebuilds and redirects", "CMS setup and editor handover"],
  },
  {
    heading: "LLM Integrations",
    text: "Add language models to your product where they earn their place, with answers grounded in your own content.",
    items: ["Search and answers grounded in your content", "Document processing and structured extraction", "Model evaluation and integration"],
  },
  {
    heading: "Agent Workflows",
    text: "Put agents to work on development and repetitive tasks, with review steps that fit the way your team ships.",
    items: ["Project instructions and tool connections", "Development and review workflows", "Checks, evaluations and human approval"],
  },
];
