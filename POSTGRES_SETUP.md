# PostgreSQL 연결 문자열 가져오기 가이드

## 방법 1: Vercel Postgres 사용 (가장 간단 ⭐)

### 단계별 가이드:

1. **Vercel 대시보드 접속**
   - https://vercel.com 로그인
   - 배포한 프로젝트 선택

2. **Storage 탭 클릭**
   - 프로젝트 페이지 상단 메뉴에서 **Storage** 탭 클릭

3. **Postgres 데이터베이스 생성**
   - **Create Database** 버튼 클릭
   - **Postgres** 선택
   - 데이터베이스 이름 입력 (예: `soccer-card-db`)
   - **Create** 클릭

4. **자동으로 연결 문자열 추가됨!**
   - Vercel이 자동으로 `DATABASE_URL` 환경 변수를 추가합니다
   - **Settings** → **Environment Variables**에서 확인 가능
   - 별도로 복사할 필요 없음!

---

## 방법 2: Supabase 사용 (무료 티어 제공)

### 단계별 가이드:

1. **Supabase 계정 생성**
   - https://supabase.com 접속
   - **Start your project** 클릭
   - GitHub 계정으로 로그인 (또는 이메일)

2. **새 프로젝트 생성**
   - **New Project** 클릭
   - 프로젝트 이름 입력 (예: `soccer-card-seller`)
   - 데이터베이스 비밀번호 설정 (기억해두세요!)
   - 리전 선택 (가장 가까운 지역)
   - **Create new project** 클릭
   - 프로젝트 생성 완료까지 1-2분 대기

3. **연결 문자열 복사 (상세 가이드)**

   **3-1. Settings 페이지로 이동**
   - 프로젝트 대시보드 왼쪽 사이드바에서 **Settings** 아이콘 (⚙️) 클릭
   - 또는 상단 메뉴에서 **Settings** 클릭

   **3-2. Database 메뉴 선택**
   - Settings 페이지 왼쪽 메뉴에서 **Database** 클릭
   - 또는 URL이 `https://app.supabase.com/project/[프로젝트ID]/settings/database` 형태로 변경됨

   **3-3. Connection string 섹션 찾기**
   - Database 설정 페이지에서 아래로 스크롤
   - **Connection string** 또는 **Connection pooling** 섹션 찾기
   - 여러 탭이 있을 수 있음: **URI**, **JDBC**, **Golang**, **Node.js**, **Python** 등

   **3-4. URI 탭 선택**
   - **URI** 탭 클릭 (가장 기본적인 연결 문자열)
   - 연결 문자열이 다음과 같이 표시됩니다:
     ```
     postgresql://postgres.[프로젝트ID]:[비밀번호]@aws-0-[리전].pooler.supabase.com:6543/postgres
     ```
     또는
     ```
     postgresql://postgres:[비밀번호]@db.[프로젝트ID].supabase.co:5432/postgres
     ```

   **3-5. 비밀번호 확인 및 교체**
   - 연결 문자열에 `[YOUR-PASSWORD]` 또는 `[비밀번호]` 플레이스홀더가 있는 경우:
     - 프로젝트 생성 시 설정한 데이터베이스 비밀번호로 교체
   - 비밀번호를 잊어버린 경우:
     - Database 설정 페이지에서 **Reset database password** 버튼 클릭
     - 새 비밀번호 설정 후 연결 문자열의 비밀번호 부분 교체

   **3-6. 연결 문자열 복사**
   - 연결 문자열 전체를 선택 (마우스로 드래그 또는 더블클릭)
   - **Ctrl+C** (Windows/Linux) 또는 **Cmd+C** (Mac)로 복사
   - 또는 연결 문자열 옆에 **Copy** 버튼이 있다면 클릭

   **3-7. 연결 문자열 예시**
   - 복사한 연결 문자열은 다음과 같은 형태입니다:
     ```
     postgresql://postgres.abcdefghijklmnop:MyPassword123!@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres
     ```
   - 또는 직접 연결 (pooler 없이):
     ```
     postgresql://postgres:MyPassword123!@db.abcdefghijklmnop.supabase.co:5432/postgres
     ```

   **⚠️ 중요 사항:**
   - 비밀번호에 특수문자(`@`, `#`, `$`, `%` 등)가 포함된 경우 URL 인코딩 필요
   - `@` → `%40`
   - `#` → `%23`
   - `$` → `%24`
   - `%` → `%25`
   - 예: 비밀번호가 `MyPass@123`인 경우 → `MyPass%40123`

4. **Vercel에 추가**
   - Vercel 대시보드 → 프로젝트 → **Settings** → **Environment Variables**
   - **Add New** 클릭
   - **Key**: `DATABASE_URL`
   - **Value**: 복사한 연결 문자열 붙여넣기
   - **Environment**: Production, Preview, Development 모두 체크
   - **Save** 클릭

---

## 방법 3: Neon 사용 (무료 티어 제공)

### 단계별 가이드:

1. **Neon 계정 생성**
   - https://neon.tech 접속
   - **Sign Up** 클릭
   - GitHub 계정으로 로그인

2. **새 프로젝트 생성**
   - **Create a project** 클릭
   - 프로젝트 이름 입력
   - 데이터베이스 이름 입력 (기본값: `neondb`)
   - PostgreSQL 버전 선택 (기본값 유지)
   - **Create Project** 클릭

3. **연결 문자열 복사**
   - 프로젝트 대시보드에서 **Connection Details** 섹션 확인
   - **Connection string** 필드에 연결 문자열이 표시됨:
     ```
     postgresql://username:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
     ```
   - **Copy** 버튼 클릭하여 복사

4. **Vercel에 추가**
   - Vercel 대시보드 → 프로젝트 → **Settings** → **Environment Variables**
   - **Add New** 클릭
   - **Key**: `DATABASE_URL`
   - **Value**: 복사한 연결 문자열 붙여넣기
   - **Environment**: Production, Preview, Development 모두 체크
   - **Save** 클릭

---

## 연결 문자열 형식

PostgreSQL 연결 문자열은 다음과 같은 형식입니다:

```
postgresql://[사용자명]:[비밀번호]@[호스트]:[포트]/[데이터베이스명]?[옵션]
```

### 예시:
```
postgresql://postgres:mypassword123@db.abc123.supabase.co:5432/postgres
postgresql://user:pass@ep-cool-123.us-east-2.aws.neon.tech/neondb?sslmode=require
```

---

## 추천 순서

1. **Vercel Postgres** ⭐ (가장 간단, 자동 설정)
2. **Supabase** (무료 티어 넉넉, 사용하기 쉬움)
3. **Neon** (무료 티어 제공, 서버리스)

---

## 연결 문자열 확인 방법

Vercel에 추가한 후:

1. **Vercel 대시보드** → 프로젝트 → **Settings** → **Environment Variables**
2. `DATABASE_URL` 변수 확인
3. 값이 올바르게 설정되었는지 확인

---

## 문제 해결

### 연결 문자열이 작동하지 않는 경우:
- 비밀번호에 특수문자가 포함된 경우 URL 인코딩 필요
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`

### 연결 테스트:
로컬에서 다음 명령어로 테스트 가능:
```bash
# .env 파일에 DATABASE_URL 추가 후
npx prisma db pull
```

