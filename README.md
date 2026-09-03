# ai-tools-site

대한민국 AI 툴 교육 사이트 프론트엔드입니다. `ai-tools-collector`가 Supabase에 수집·요약해 둔
카테고리/영상/광고 데이터를 읽어서 보여주는 Next.js(App Router) 사이트입니다.

## 스택

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Supabase JS (읽기 전용, `anon` 키 사용 — RLS로 공개 데이터만 노출됨)

## 로컬 개발

```bash
npm install
cp .env.example .env.local   # 값 채우기
npm run dev
```

### 환경 변수

| 변수 | 설명 |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon(public) 키. RLS 정책으로 `status='published'`, `is_active=true` 등 공개 데이터만 조회 가능하므로 클라이언트에 노출해도 안전합니다. |
| `NEXT_PUBLIC_SITE_URL` | 사이트 절대 URL. sitemap/OG/canonical에 사용합니다. |
| `SUPABASE_SERVICE_ROLE_KEY` | 서버 전용. `/admin` 쓰기용. |
| `ADMIN_PASSWORD` | 관리자 로그인 비밀번호 |
| `ADMIN_SESSION_TOKEN` | 로그인 성공 시 쿠키에 넣는 세션 토큰 |

`ai-tools-collector`가 쓰는 `service_role` 키는 클라이언트 번들에 넣지 않습니다.

## 페이지 구조

- `/` — 랜딩: 히어로 + 캐러셀(8개) + 카테고리 칩. 60초 ISR
- `/category/[slug]` — 카테고리별 영상 10개(랭킹순) + AI 요약 패널
- `/video/[id]` — 선택한 영상의 3단 브라우즈 화면 (고유 URL)
- `/search?q=` — 제목/요약/훅/테이크어웨이 DB 검색 (noindex)
- `/privacy`, `/terms` — 정책 페이지
- `/admin` — 광고·영상·수집 키워드 관리

옛 주소 `/?category=&video=` 와 `/?q=` 는 새 경로로 리다이렉트됩니다.

## 이미지

유튜브 썸네일은 `next/image` 대신 `<img>`를 쓰고, URL을 `mqdefault`로 줄여 용량을 낮춥니다.
유튜브 플레이어는 재생 버튼을 누르기 전까지 iframe을 넣지 않습니다.

## Vercel 배포

1. Vercel에 이 레포를 Import합니다.
2. Project Settings → Environment Variables에 위 값을 등록합니다(Production/Preview 모두).
3. Framework Preset은 Next.js가 자동 감지됩니다. 별도 빌드 설정 불필요.

프로덕션 주소가 바뀌면 `NEXT_PUBLIC_SITE_URL`을 그 주소로 맞추세요.

## 데이터가 비어있을 때

수집기가 아직 한 번도 실행되지 않았거나 특정 카테고리에 영상이 없어도 에러 없이
"아직 데이터가 없습니다" 형태의 안내 문구를 보여주도록 처리되어 있습니다.
