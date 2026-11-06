import { CoupangBanner } from "@/components/CoupangBanner";
import Link from "next/link";
import ContactModal from "@/components/ContactModal";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-16 dark:border-gray-800 dark:bg-gray-900">
      <CoupangBanner />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex flex-col items-center sm:items-start gap-1 text-center sm:text-left">
          <p>
            &copy; {new Date().getFullYear()} 나두AI. 모든 영상 콘텐츠의 저작권은 각 원저작자에게
            있습니다. 요약은 설명·자막 발췌이거나 사람이 검토한 글입니다.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            신청·홍보 문장이나 제목 반복은 요약으로 표시하지 않습니다. 정확한 내용은 원본 영상을 확인해 주세요.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <Link href="/privacy" className="hover:text-brand-600 dark:hover:text-brand-500">
            개인정보처리방침
          </Link>
          <Link href="/terms" className="hover:text-brand-600 dark:hover:text-brand-500">
            이용약관
          </Link>
          <ContactModal />
        </div>
      </div>
    </footer>
  );
}
