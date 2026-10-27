/**
 * [MODEL] Cheat Sheet: Anchor Keywords & 10 Golden Exam Rules
 * Extracted from Backbase Android Certified Developer Advanced Study Guide
 */

export interface AnchorKeywordItem {
  id: number
  trigger: string
  reflexAnswer: string
  category: 'fundamentals' | 'architecture' | 'setup' | 'adopt' | 'extend'
}

export interface GoldenRuleItem {
  id: number
  title: string
  rule: string
}

export const ANCHOR_KEYWORDS: AnchorKeywordItem[] = [
  {
    id: 1,
    trigger: 'Tiếp nhận yêu cầu mới / Bắt đầu từ đâu',
    reflexAnswer: 'Ưu tiên tính năng có sẵn (OOTB first) và Cấu hình (Configuration first) trước khi nghĩ đến Extend/Build.',
    category: 'fundamentals'
  },
  {
    id: 2,
    trigger: 'Sửa trực tiếp mã nguồn SDK / Clone code về sửa',
    reflexAnswer: 'SAI TUYỆT ĐỐI. Làm phá vỡ lộ trình nâng cấp (Upgrade Path) và tăng nợ kỹ thuật bảo trì.',
    category: 'fundamentals'
  },
  {
    id: 3,
    trigger: 'Tầng Domain trong Clean Architecture',
    reflexAnswer: 'Bắt buộc là Pure Kotlin, độc lập hoàn toàn với Android Framework. CẤM tiệt android.content.Context, View, Fragment, Room, Retrofit và các annotation JSON parsing (@Json, @SerializedName).',
    category: 'architecture'
  },
  {
    id: 4,
    trigger: 'Tách module :api và :impl',
    reflexAnswer: 'Áp dụng Dependency Inversion. Module-api chứa Interface contract nhẹ giúp giảm thời gian build (Gradle cache hit) và loại bỏ phụ thuộc vòng (circular dependency). Module-impl chứa logic thực thi nặng.',
    category: 'architecture'
  },
  {
    id: 5,
    trigger: 'Quản lý UI State & Luồng dữ liệu',
    reflexAnswer: 'Unidirectional Data Flow (UDF) kết hợp StateFlow. ViewModel giữ private MutableStateFlow và public StateFlow bất biến (read-only).',
    category: 'architecture'
  },
  {
    id: 6,
    trigger: 'Lắng nghe StateFlow an toàn vòng đời',
    reflexAnswer: 'Dùng viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) trong Fragment hoặc collectAsStateWithLifecycle() trong Jetpack Compose để tránh tiêu tốn tài nguyên khi app chạy ngầm.',
    category: 'architecture'
  },
  {
    id: 7,
    trigger: 'Sự kiện diễn ra 1 lần (One-off Events: Toast, SnackBar, Navigate)',
    reflexAnswer: 'Dùng SharedFlow(replay = 0) hoặc Channel.',
    category: 'architecture'
  },
  {
    id: 8,
    trigger: 'Ánh xạ DTO sang Domain Model',
    reflexAnswer: 'Dùng Mapper tại Data Layer (Repository Impl) để bảo vệ UI/Domain không bị vỡ khi Backend thay đổi API schema.',
    category: 'architecture'
  },
  {
    id: 9,
    trigger: 'Lưu credentials Artifactory',
    reflexAnswer: 'Bắt buộc trong file ~/.gradle/gradle.properties hoặc biến môi trường CI/CD (GitLab Variables/GitHub Secrets), không commit lên Git.',
    category: 'setup'
  },
  {
    id: 10,
    trigger: 'Đồng bộ phiên bản dependencies',
    reflexAnswer: 'Dùng Backbase BOM qua cú pháp implementation(platform("com.backbase.android:bom:x.y.z")) để khóa version thống nhất.',
    category: 'setup'
  },
  {
    id: 11,
    trigger: 'Khởi tạo Core SDK',
    reflexAnswer: 'Gọi Backbase.initialize(context, configuration) trong Application.onCreate().',
    category: 'setup'
  },
  {
    id: 12,
    trigger: 'Lỗi HTTP 401 Unauthorized',
    reflexAnswer: 'Tự động xin cấp lại Token (Refresh Token) và retry request qua OkHttp Authenticator.',
    category: 'setup'
  },
  {
    id: 13,
    trigger: 'Gắn Custom Header toàn cục (X-Device-Id, X-Request-ID)',
    reflexAnswer: 'Dùng OkHttp Interceptor đăng ký vào Core NetworkEngine qua DI.',
    category: 'setup'
  },
  {
    id: 14,
    trigger: 'Certificate Pinning & Chặn HTTP Cleartext',
    reflexAnswer: 'Cấu hình trong res/xml/network_security_config.xml để chống tấn công Man-In-The-Middle (MITM).',
    category: 'setup'
  },
  {
    id: 15,
    trigger: 'Mobile Design System (MDS) & White-labeling',
    reflexAnswer: 'Dùng Design Tokens (Colors, Typography, Spacing, Shape) qua theme styles.xml (kế thừa Theme.Backbase) hoặc BackbaseTheme trong Compose để đổi thương hiệu đồng bộ mà không sửa layout.',
    category: 'adopt'
  },
  {
    id: 16,
    trigger: 'Đổi văn bản/nhãn (labels) mặc định',
    reflexAnswer: 'Override key tương ứng trong res/values/strings.xml (hoặc values-xx/strings.xml cho đa ngôn ngữ) của Integrator module.',
    category: 'adopt'
  },
  {
    id: 17,
    trigger: 'Chèn UI tùy biến vào màn hình có sẵn',
    reflexAnswer: 'Dùng View Slotting / Slot API tại các vị trí chừa sẵn trên màn hình OOTB.',
    category: 'adopt'
  },
  {
    id: 18,
    trigger: 'Bổ sung logic vào Use Case gốc',
    reflexAnswer: 'Áp dụng Decorator Pattern (bọc implementation mặc định, có thể kết hợp Kotlin Delegation "by") kết hợp Hilt @Binds.',
    category: 'extend'
  },
  {
    id: 19,
    trigger: 'Tráo đổi binding trong Hilt Module',
    reflexAnswer: 'Cú pháp abstract class + @Binds + abstract fun bind...(impl): Interface. Thiếu @InstallIn sẽ gây lỗi Compilation Error ngay khi build.',
    category: 'extend'
  },
  {
    id: 20,
    trigger: 'Điều hướng giữa các Journey độc lập',
    reflexAnswer: 'Dùng Router / Navigator Interface kết hợp Deeplink / Navigation Arguments (Safe Args). TUYỆT ĐỐI KHÔNG import hay gọi trực tiếp Activity/Fragment của Journey khác (tránh Tight-coupling).',
    category: 'extend'
  },
  {
    id: 21,
    trigger: 'Thay thế hoàn toàn một màn hình UI',
    reflexAnswer: 'Dùng Screen Factory (hoặc Custom Navigation Router) đăng ký qua DI.',
    category: 'extend'
  },
  {
    id: 22,
    trigger: 'Đổi thanh menu chính / Bottom Navigation',
    reflexAnswer: 'Cấu hình tại Integrator module thông qua AppMenuConfigurationProvider (lọc theo Entitlements nếu cần ẩn tab).',
    category: 'adopt'
  },
  {
    id: 23,
    trigger: 'Lưu trữ dữ liệu nhạy cảm cục bộ',
    reflexAnswer: 'Dùng EncryptedSharedPreferences / Jetpack DataStore kết hợp hệ thống quản lý khóa phần cứng AndroidKeyStore.',
    category: 'extend'
  },
  {
    id: 24,
    trigger: 'Unit Test Coroutines & Flow',
    reflexAnswer: 'Bộ ba chuẩn mực: JUnit + MockK (coEvery, coVerify cho suspend function) + Turbine (awaitItem()) + kotlinx-coroutines-test (runTest).',
    category: 'extend'
  }
]

export const GOLDEN_EXAM_RULES: GoldenRuleItem[] = [
  {
    id: 1,
    title: 'Quy tắc 1 (Adopt first)',
    rule: 'Nếu câu hỏi hỏi về cách tiếp cận đầu tiên, luôn chọn "Cấu hình OOTB" (Adopt), không chọn viết code mới.'
  },
  {
    id: 2,
    title: 'Quy tắc 2 (Không sửa SDK)',
    rule: 'Loại ngay bất kỳ đáp án nào đề xuất "Decompile file .aar", "Sửa code trong SDK", hoặc "Copy/Fork code Journey vào local".'
  },
  {
    id: 3,
    title: 'Quy tắc 3 (Domain độc lập)',
    rule: 'Domain Layer là Pure Kotlin, không chứa bất kỳ dependency nào của Android Framework hay JSON annotations.'
  },
  {
    id: 4,
    title: 'Quy tắc 4 (Mở rộng logic)',
    rule: 'Muốn thêm validation/logging/biometric trước hoặc sau Use Case gốc -> Decorator Pattern + Hilt @Binds.'
  },
  {
    id: 5,
    title: 'Quy tắc 5 (Mở rộng UI)',
    rule: 'Thay đổi nhỏ/chèn thêm -> Slot API; Thay cả màn hình -> Screen Factory; Đổi màu/font/bo góc -> Design Tokens.'
  },
  {
    id: 6,
    title: 'Quy tắc 6 (Zero-coupling)',
    rule: 'Hai Journey độc lập không được biết nhau; điều hướng qua Router Interface và Deeplink ở tầng Integrator.'
  },
  {
    id: 7,
    title: 'Quy tắc 7 (Xung đột thư viện)',
    rule: 'Luôn giải quyết bằng cách căn chỉnh lại Backbase BOM duy nhất hoặc resolutionStrategy.'
  },
  {
    id: 8,
    title: 'Quy tắc 8 (Xử lý 401 vs Interceptor)',
    rule: '401 Refresh Token dùng OkHttp Authenticator; Gắn Header chung (X-Device-Id) dùng OkHttp Interceptor.'
  },
  {
    id: 9,
    title: 'Quy tắc 9 (Truyền tham số an toàn)',
    rule: 'Không truyền Object nặng qua Bundle; chỉ truyền Identifier (ID String/Long) an toàn qua Safe Args.'
  },
  {
    id: 10,
    title: 'Quy tắc 10 (Bảo mật tài chính)',
    rule: 'Dữ liệu nhạy cảm phải mã hóa KeyStore, logcat phải strip/tắt trên release bằng ProGuard, và kiểm tra Root/Integrity (RASP).'
  }
]
