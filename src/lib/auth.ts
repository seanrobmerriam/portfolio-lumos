import { AsyncLocalStorage } from "node:async_hooks";
import type { APIContext } from "astro";
import { NEON_AUTH_BASE_URL, NEON_AUTH_COOKIE_SECRET } from "astro:env/server";
import {
  createAuthServer,
  extractNeonAuthCookies,
  handleAuthProxyRequest,
  processAuthMiddleware,
  type RequestContext,
} from "@neon/auth/server";

/** Astro bridge for the `@neon/auth/server` toolkit. See BUILDING-AN-ADAPTER.md. */
export const requestStorage = new AsyncLocalStorage<APIContext>();

const config = {
  baseUrl: NEON_AUTH_BASE_URL,
  cookieSecret: NEON_AUTH_COOKIE_SECRET,
  sameSite: "lax" as const,
};

function astroRequestContext(): RequestContext {
  const context = requestStorage.getStore();
  if (!context) throw new Error("Neon Auth: no request bound; call inside requestStorage.run()");
  const { request, cookies, url } = context;
  return {
    getCookies: () => extractNeonAuthCookies(request.headers.get("cookie") ?? ""),
    setCookie: (name, value, options) => cookies.set(name, value, options),
    getHeader: (name) => request.headers.get(name),
    getOrigin: () => request.headers.get("origin") ?? url.origin,
    getFramework: () => "astro",
  };
}

export const auth = createAuthServer({ ...config, context: astroRequestContext });

/** Proxies `/api/auth/*` to Managed Better Auth on the same origin. */
export function proxyAuthRequest(request: Request, path: string): Promise<Response> {
  return handleAuthProxyRequest({ ...config, request, path });
}

/** Session check for pages; also finalizes OAuth callbacks. */
export function checkPageSession(request: Request, pathname: string, loginUrl: string) {
  return processAuthMiddleware({ ...config, request, pathname, skipRoutes: [], loginUrl });
}

export type Admin = { id: string; email: string; name: string };

/** Returns the signed-in user when their Better Auth role is `admin`. */
export async function getAdmin(): Promise<{ admin?: Admin; status: 200 | 401 | 403 }> {
  const { data } = await auth.getSession();
  const user = data?.user;
  if (!user) return { status: 401 };
  if ((user as { role?: string | null }).role !== "admin") return { status: 403 };
  return { admin: { id: user.id, email: user.email, name: user.name }, status: 200 };
}
