# Vercel 배포 가이드

## PostgreSQL 데이터베이스 설정

### 방법 1: Vercel Postgres 사용 (권장)

1. **Vercel 대시보드에서 프로젝트 선택**
2. **Storage 탭 클릭**
3. **Create Database → Postgres 선택**
4. **데이터베이스 생성 후 자동으로 `DATABASE_URL` 환경 변수가 추가됩니다**

### 방법 2: 외부 PostgreSQL 서비스 사용

다음 서비스 중 하나를 사용할 수 있습니다:
- **Supabase** (무료 티어 제공): https://supabase.com
- **Neon** (무료 티어 제공): https://neon.tech
- **Railway**: https://railway.app
- **Render**: https://render.com

#### Supabase 사용 예시:
1. https://supabase.com 에서 계정 생성
2. 새 프로젝트 생성
3. Settings → Database → Connection string 복사
4. Vercel 환경 변수에 `DATABASE_URL`로 추가

#### Neon 사용 예시:
1. https://neon.tech 에서 계정 생성
2. 새 프로젝트 생성
3. Connection Details에서 Connection string 복사
4. Vercel 환경 변수에 `DATABASE_URL`로 추가

## 환경 변수 추가 방법

### Vercel 대시보드에서:

1. 프로젝트 선택
2. **Settings** 탭 클릭
3. **Environment Variables** 섹션으로 스크롤
4. **Add New** 버튼 클릭
5. 다음 정보 입력:
   - **Key**: `DATABASE_URL`
   - **Value**: PostgreSQL 연결 문자열 (예: `postgresql://user:password@host:port/database`)
   - **Environment**: Production, Preview, Development 모두 선택
6. **Save** 클릭

### 필수 환경 변수 목록

배포를 위해 다음 환경 변수들이 필요합니다:

```
DATABASE_URL=postgresql://user:password@host:port/database
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### NEXTAUTH_SECRET 생성 방법

터미널에서 다음 명령어 실행:
```bash
openssl rand -base64 32
```

생성된 값을 `NEXTAUTH_SECRET` 환경 변수로 추가하세요.

## 데이터베이스 마이그레이션

환경 변수를 추가한 후:

1. **Vercel 대시보드에서 프로젝트 재배포**
   - Deployments 탭 → 최신 배포 → ... 메뉴 → Redeploy

2. **또는 로컬에서 마이그레이션 실행** (선택사항):
   ```bash
   npm run db:migrate:deploy
   ```

## 배포 확인

1. 배포가 완료되면 Vercel에서 제공하는 URL로 접속
2. 데이터베이스 연결 확인
3. 로그인 기능 테스트

## 문제 해결

### DATABASE_URL 오류가 발생하는 경우:
- 환경 변수가 올바르게 설정되었는지 확인
- PostgreSQL 연결 문자열 형식 확인
- 데이터베이스가 실행 중인지 확인

### 빌드 오류가 발생하는 경우:
- `vercel.json`의 `buildCommand`에 `SKIP_ENV_VALIDATION=true`가 포함되어 있는지 확인
- 로컬에서 `npm run build` 실행하여 오류 확인

