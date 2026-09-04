import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  clearAdminLoginFailures,
  getAdminLoginBlock,
  getAdminPassword,
  getAdminSessionToken,
  isAdminAuthConfigured,
  passwordsMatch,
  recordAdminLoginFailure,
} from "@/lib/adminAuth";

async function login(formData: FormData) {
  "use server";
  if (getAdminLoginBlock()) redirect("/admin/login?error=locked");

  const password = getAdminPassword();
  const token = getAdminSessionToken();
  if (!password || !token) {
    redirect("/admin/login?error=setup");
  }

  if (passwordsMatch(formData.get("password"), password)) {
    clearAdminLoginFailures();
    cookies().set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    redirect("/admin");
  }
  recordAdminLoginFailure();
  redirect("/admin/login?error=1");
}

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const locked = Boolean(getAdminLoginBlock()) || searchParams.error === "locked";
  const configured = isAdminAuthConfigured();
  const setupError = searchParams.error === "setup" || !configured;

  return (
    <div className="mx-auto max-w-sm py-16">
      <h1 className="mb-6 text-xl font-bold text-gray-900 dark:text-gray-100">관리자 로그인</h1>
      <form action={login} className="flex flex-col gap-3">
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          required
          disabled={locked || !configured}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={locked || !configured}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          로그인
        </button>
        {setupError && (
          <p className="text-sm text-red-500">
            서버에 ADMIN_PASSWORD가 없습니다. Vercel → Settings → Environment Variables에
            넣은 뒤 Deployments에서 Redeploy 하세요. 값만 넣고 재배포하지 않으면 적용되지
            않습니다.
          </p>
        )}
        {locked && (
          <p className="text-sm text-red-500">로그인 시도가 너무 많습니다. 15분 후 다시 시도해 주세요.</p>
        )}
        {!locked && !setupError && searchParams.error === "1" && (
          <p className="text-sm text-red-500">
            비밀번호가 올바르지 않습니다. 변수 이름이 아니라, Vercel에 넣어 둔 값을 입력하세요.
          </p>
        )}
      </form>
      <p className="mt-4 text-xs text-gray-400">
        인터넷 사이트는 Vercel 값, 이 컴퓨터(localhost)는 .env.local 값을 씁니다.
      </p>
    </div>
  );
}
