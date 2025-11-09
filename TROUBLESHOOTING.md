# 배포 문제 해결 가이드

## 배포된 URL에서 접속이 안 되는 경우

### 1단계: Vercel 배포 로그 확인

1. **Vercel 대시보드** 접속: https://vercel.com
2. 프로젝트 선택
3. **Deployments** 탭 클릭
4. 최신 배포 클릭
5. **Logs** 탭에서 오류 메시지 확인

### 2단계: 일반적인 오류 및 해결 방법

#### 오류 1: "DATABASE_URL is not configured"
**증상**: 페이지가 로드되지 않거나 500 오류 발생

**해결 방법**:
1. Vercel 대시보드 → 프로젝트 → **Settings** → **Environment Variables**
2. `DATABASE_URL` 환경 변수 확인
3. 없으면 추가:
   - **Key**: `DATABASE_URL`
   - **Value**: PostgreSQL 연결 문자열
   - **Environment**: Production, Preview, Development 모두 체크
4. **재배포** (Deployments → 최신 배포 → Redeploy)

#### 오류 2: "NEXTAUTH_SECRET is not configured"
**증상**: 인증 관련 오류 발생

**해결 방법**:
1. 터미널에서 다음 명령어 실행:
   ```bash
   openssl rand -base64 32
   ```
2. 생성된 값을 복사
3. Vercel → **Settings** → **Environment Variables**
4. **Add New**:
   - **Key**: `NEXTAUTH_SECRET`
   - **Value**: 복사한 값
   - **Environment**: Production, Preview, Development 모두 체크
5. **재배포**

#### 오류 3: "PrismaClientInitializationError"
**증상**: 데이터베이스 연결 오류

**해결 방법**:
1. `DATABASE_URL` 환경 변수가 올바른지 확인
2. PostgreSQL 데이터베이스가 실행 중인지 확인
3. 연결 문자열 형식 확인:
   ```
   postgresql://user:password@host:port/database
   ```
4. 비밀번호에 특수문자가 있으면 URL 인코딩 필요

#### 오류 4: "500 Internal Server Error"
**증상**: 페이지가 로드되지 않음

**해결 방법**:
1. Vercel 배포 로그에서 정확한 오류 메시지 확인
2. 환경 변수가 모두 설정되었는지 확인
3. 필수 환경 변수:
   - `DATABASE_URL`
   - `NEXTAUTH_URL` (배포된 사이트 URL)
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID` (Google 로그인 사용 시)
   - `GOOGLE_CLIENT_SECRET` (Google 로그인 사용 시)

### 3단계: 환경 변수 확인 체크리스트

필수 환경 변수:
- [ ] `DATABASE_URL` - PostgreSQL 연결 문자열
- [ ] `NEXTAUTH_URL` - 배포된 사이트 URL (예: `https://your-project.vercel.app`)
- [ ] `NEXTAUTH_SECRET` - 랜덤 문자열 (32자 이상)

선택적 환경 변수 (기능 사용 시):
- [ ] `GOOGLE_CLIENT_ID` - Google OAuth 클라이언트 ID
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth 클라이언트 시크릿

### 4단계: 재배포

환경 변수를 추가/수정한 후:
1. **Deployments** 탭으로 이동
2. 최신 배포의 **...** 메뉴 클릭
3. **Redeploy** 선택
4. 배포 완료까지 대기 (1-2분)

### 5단계: 브라우저에서 확인

1. 배포된 URL로 접속
2. 브라우저 개발자 도구 열기 (F12)
3. **Console** 탭에서 오류 확인
4. **Network** 탭에서 실패한 요청 확인

### 6단계: 로컬에서 테스트

환경 변수를 로컬에서 테스트하려면:

1. `.env.local` 파일 생성:
   ```bash
   DATABASE_URL=your-postgresql-connection-string
   NEXTAUTH_URL=http://localhost:3001
   NEXTAUTH_SECRET=your-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

2. 로컬 서버 실행:
   ```bash
   npm run dev
   ```

3. http://localhost:3001 접속하여 테스트

### 추가 도움말

- **Vercel 문서**: https://vercel.com/docs
- **Next.js 배포 가이드**: https://nextjs.org/docs/deployment
- **Prisma 배포 가이드**: https://www.prisma.io/docs/guides/deployment

### 문제가 계속되는 경우

1. Vercel 배포 로그의 전체 오류 메시지 복사
2. GitHub Issues에 문제 보고
3. Vercel 지원팀에 문의

