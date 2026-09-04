import "server-only";
import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_SESSION_COOKIE = "admin_session";
const ADMIN_FAIL_COOKIE = "admin_login_fails";
const ADMIN_LOCK_COOKIE = "admin_login_lock";
const MAX_LOGIN_FAILS = 5;
const LOCK_SECONDS = 15 * 60;

function sha256(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

export function getAdminPassword(): string | undefined {
  const value = process.env.ADMIN_PASSWORD?.trim();
  return value || undefined;
}

/** Prefer ADMIN_SESSION_TOKEN; if missing, derive one so password-only Vercel setup still works. */
export function getAdminSessionToken(): string | undefined {
  const explicit = process.env.ADMIN_SESSION_TOKEN?.trim();
  if (explicit) return explicit;
  const password = getAdminPassword();
  if (!password) return undefined;
  return createHash("sha256").update(`nadu-admin-session:${password}`).digest("hex");
}

export function isAdminAuthConfigured(): boolean {
  return Boolean(getAdminPassword());
}

function cookieSecure(): boolean {
  return process.env.NODE_ENV === "production";
}

export function passwordsMatch(input: unknown, expected: string | undefined): boolean {
  if (typeof input !== "string" || !expected) return false;
  const typed = input.trim();
  const want = expected.trim();
  if (!typed || !want) return false;
  return timingSafeEqual(sha256(typed), sha256(want));
}

export function getAdminLoginBlock(): string | null {
  const until = Number(cookies().get(ADMIN_LOCK_COOKIE)?.value || 0);
  if (until && until > Date.now()) {
    return "로그인 시도가 너무 많습니다. 15분 후 다시 시도해 주세요.";
  }
  return null;
}

export function recordAdminLoginFailure(): void {
  const fails = Number(cookies().get(ADMIN_FAIL_COOKIE)?.value || 0) + 1;
  const cookieBase = {
    httpOnly: true,
    secure: cookieSecure(),
    sameSite: "lax" as const,
    maxAge: LOCK_SECONDS,
    path: "/admin",
  };
  cookies().set(ADMIN_FAIL_COOKIE, String(fails), cookieBase);
  if (fails >= MAX_LOGIN_FAILS) {
    cookies().set(ADMIN_LOCK_COOKIE, String(Date.now() + LOCK_SECONDS * 1000), cookieBase);
  }
}

export function clearAdminLoginFailures(): void {
  cookies().delete(ADMIN_FAIL_COOKIE);
  cookies().delete(ADMIN_LOCK_COOKIE);
}

export function isAdminSession(): boolean {
  const token = getAdminSessionToken();
  if (!token) return false;
  return cookies().get(ADMIN_SESSION_COOKIE)?.value === token;
}

/** Call at the top of any admin server component/action. Redirects if not logged in. */
export function requireAdmin(): void {
  if (!isAdminSession()) redirect("/admin/login");
}
