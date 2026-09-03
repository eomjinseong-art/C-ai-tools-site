import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="prose prose-sm dark:prose-invert max-w-3xl mx-auto text-gray-700 dark:text-gray-300">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">개인정보처리방침</h1>
      <p className="text-gray-500 dark:text-gray-400">시행일: 2026년 8월 12일</p>

      <p>
        나두AI(이하 &ldquo;사이트&rdquo;)는 이용자의 개인정보를 소중히 다루며, 관련 법령을
        준수합니다. 본 방침은 사이트가 어떤 개인정보를 수집하고 어떻게 이용·보관하는지 안내합니다.
      </p>

      <h2>1. 수집하는 개인정보 항목</h2>
      <p>
        사이트는 별도의 회원가입 없이 이용 가능하며, 개인정보는 아래와 같이 이용자가 자발적으로
        제공하는 경우에만 수집됩니다.
      </p>
      <ul>
        <li>문의하기 폼 이용 시: 이름, 이메일 주소, 문의 내용</li>
        <li>서비스 이용 과정에서 자동으로 생성되는 정보: 접속 로그, 쿠키, 접속 기기 정보(Vercel Web Analytics 등)</li>
      </ul>

      <h2>2. 개인정보의 수집 및 이용 목적</h2>
      <ul>
        <li>문의사항 확인 및 답변</li>
        <li>서비스 이용 통계 분석 및 품질 개선</li>
      </ul>

      <h2>3. 개인정보의 보유 및 이용 기간</h2>
      <p>
        문의를 통해 수집된 개인정보는 문의 처리 완료 후 합리적인 기간 내에 파기하며, 관련 법령에
        따라 보존이 필요한 경우 해당 기간 동안 보관합니다.
      </p>

      <h2>4. 개인정보의 제3자 제공</h2>
      <p>
        사이트는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만 문의하기 폼은
        Formspree(제3자 폼 처리 서비스)를 통해 접수·전달되며, 이 과정에서 입력한 정보가
        Formspree 서버에 전송됩니다.
      </p>

      <h2>5. 이용자의 권리</h2>
      <p>
        이용자는 언제든지 자신의 개인정보 처리 현황에 대해 문의하거나 삭제를 요청할 수 있습니다.
        문의는 하단 문의하기 폼을 이용해 주세요.
      </p>

      <h2>6. 문의처</h2>
      <p>개인정보 관련 문의는 사이트 하단의 문의하기 폼을 통해 접수해 주시기 바랍니다.</p>

    </article>
  );
}
