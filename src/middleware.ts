import { defineMiddleware } from "astro:middleware";

const PROTECTED_PAGES = ["/admin"];
const LOGIN_URL = "/auth/sign-in";

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.isPrerendered) return next();

  const { checkPageSession, requestStorage } = await import("@/lib/auth.ts");

  return requestStorage.run(context, async () => {
    const { pathname } = context.url;
    const isProtected = PROTECTED_PAGES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );
    if (!isProtected) return next();

    const result = await checkPageSession(context.request, pathname, LOGIN_URL);
    if (result.action !== "allow") {
      const headers = new Headers({ Location: result.redirectUrl.toString() });
      for (const cookie of result.cookies ?? []) headers.append("Set-Cookie", cookie);
      return new Response(null, { status: 302, headers });
    }

    const response = await next();
    for (const cookie of result.cookies ?? []) response.headers.append("Set-Cookie", cookie);
    return response;
  });
});
