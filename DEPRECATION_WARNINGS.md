# Deprecation Warnings 해결 가이드

## 현재 경고 메시지 분석

### 직접 의존성 (수정 가능)
- `eslint@8.57.1` - 최신 버전: 9.39.1

### 간접 의존성 (Transitive Dependencies)
다음 패키지들은 다른 패키지의 의존성으로 설치되므로 직접 제어하기 어렵습니다:
- `rimraf@3.0.2` - 다른 패키지의 의존성
- `path-match@1.2.4` - express 관련
- `inflight@1.0.6` - glob 관련
- `@humanwhocodes/object-schema@2.0.3` - eslint 관련
- `@humanwhocodes/config-array@0.13.0` - eslint 관련
- `glob@7.2.3` - 다른 패키지의 의존성

## 해결 방안

### 옵션 1: Next.js 업데이트 (권장)
Next.js를 최신 버전으로 업데이트하면 대부분의 경고가 해결됩니다.

**주의사항:**
- Next.js 16은 React 19를 사용하므로 breaking changes가 있을 수 있습니다
- 현재 Next.js 14를 사용 중이므로 점진적 업데이트 권장

### 옵션 2: ESLint만 업데이트
ESLint를 최신 버전으로 업데이트 (Next.js 14와 호환성 확인 필요)

### 옵션 3: 경고 무시 (현재 상태 유지)
- 대부분의 경고는 간접 의존성에서 발생
- 현재 기능에는 영향 없음
- 프로덕션 빌드에는 문제 없음

### 옵션 4: npm overrides 사용
`package.json`에 `overrides` 필드를 추가하여 특정 패키지 버전을 강제할 수 있습니다.

## 권장 조치

현재 상태에서는 **옵션 3 (경고 무시)**을 권장합니다:
- 프로덕션 빌드에 영향 없음
- 대부분 간접 의존성 문제
- Next.js 14는 안정적으로 작동 중

향후 Next.js 16으로 업그레이드할 때 대부분의 경고가 자동으로 해결됩니다.

