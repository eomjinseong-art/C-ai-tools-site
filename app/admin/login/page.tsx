import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  clearAdminLoginFailures,
  getAdminLoginBlock,
  passwordsMatch,
  recordAdminLoginFailure,
} from "@/lib/adminAuth";

async function login(formData: FormData) {
  "use server";
  if (getAdminLoginBlock()) redirect("/admin/login?error=locked");

  const token = process.env.ADMIN_SESSION_TOKEN;
  if (passwordsMatch(formData.get("password"), process.env.ADMIN_PASSWORD) && token) {
    clearAdminLoginFailures();
    cookies().set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: true,
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

  return (
    <div className="mx-auto max-w-sm py-16">
      <h1 className="mb-6 text-xl font-bold text-gray-900 dark:text-gray-100">관리자 로그인</h1>
      <form action={login} className="flex flex-col gap-3">
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          required
          disabled={locked}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={locked}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          로그인
        </button>
        {locked && (
          <p className="text-sm text-red-500">로그인 시도가 너무 많습니다. 15분 후 다시 시도해 주세요.</p>
        )}
        {!locked && searchParams.error === "1" && (
          <p className="text-sm text-red-500">비밀번호가 올바르지 않습니다.</p>
        )}
      </form>
    </div>
  );
}
