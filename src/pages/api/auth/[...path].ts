import type { APIRoute } from "astro";
import { proxyAuthRequest } from "@/lib/auth.ts";

export const prerender = false;

export const ALL: APIRoute = ({ request, params }) =>
  proxyAuthRequest(request, params.path ?? "");
