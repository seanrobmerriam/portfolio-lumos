/** Site name. Appended to every page title and used as `og:site_name`. */
export const SITE_NAME = "Sean Merriam - Design Engineer";
/** Fallback meta description for pages that don't set their own. */
export const SITE_DESCRIPTION =
  "The personal site of Sean Merriam.";
/** Canonical origin. Resolves canonical URLs, social images, and the sitemap. */
export const SITE_URL = "https://seanrobmerriam.github.io";
/** BCP 47 locale tag used to format dates and numbers. */
export const SITE_LOCALE = "en-US";
/** Routes excluded from search and the sitemap. Surrounding slashes are ignored. */
export const NOINDEX_ROUTES: string[] = ["/404", "/admin", "/auth/sign-in"];

export const SERVICES: const = [
  {
    heading: "LLM Integrations",
    text: "Put language models to work at every step of the software development lifecycle, from research to deployment.",
    layout: "preview",
    items: ["Search and answers grounded in your content", "Document processing and structured extraction", "Model evaluation and integration"],
  },
  {
    heading: "Design",
    text: "Turn an early idea into a clear, usable interface, with a visual direction you can carry through to the finished product.",
    layout: "rollback",
    items: ["User journeys and information architecture", "Interface design and interactive prototypes", "Responsive layouts and interaction details"],
  },
  {
    heading: "Web Development",
    text: "Build fast websites and web applications with reusable components and code your team can maintain.",
    layout: "",
    items: ["Astro websites and web applications", "CMS and API integrations", "Accessibility and performance"],
  },
  {
    heading: "Site Migrations",
    text: "Move from Webflow, WordPress or another platform with a plan for your content, URLs and publishing workflow.",
    layout: "",
    items: ["Content audits and migration planning", "Page rebuilds and redirects", "CMS setup and editor handover"],
  },
  {
    heading: "Agent Workflows",
    text: "Set up agents to help with development and repetitive work, with review steps that fit the way your team ships.",
    layout: "wide",
    items: ["Project instructions and tool connections", "Development and review workflows", "Checks, evaluations and human approval"],
  },
  {
    heading: "Brand Systems",
    text: "Give your visual identity a practical foundation so every new page and product feature feels like part of the same brand.",
    layout: "wide",
    items: ["Typography and color systems", "Design tokens and component libraries", "Usage guidelines and documentation"],
  },
];