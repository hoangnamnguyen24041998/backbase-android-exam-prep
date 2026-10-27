import type { Question } from '../exam.types'

/**
 * Section 3: Setup Development Environment
 * Quota in Exam: 10 questions
 * Pool Size: 34 questions
 */
export const setupQuestions: Question[] = [
  {
    id: 301,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Khi thiết lập kết nối tới kho lưu trữ thư viện riêng tư của Backbase (Backbase Artifact Repository / JFrog Artifactory) trong dự án Android, thông tin xác thực nhạy cảm (Username / API Token / Encrypted Password) nên được lưu trữ ở đâu để tuyệt đối KHÔNG bị đẩy (commit) nhầm lên hệ thống quản lý mã nguồn Git?',
    options: [
      'Viết cứng (hardcode) trực tiếp chuỗi mật khẩu vào trong file `settings.gradle.kts` của dự án và đẩy lên nhánh `main`.',
      'Lưu trong file `~/.gradle/gradle.properties` ở thư mục người dùng máy trạm (Global Gradle properties) hoặc truyền qua biến môi trường hệ thống (`System.getenv(...)`) trên máy chủ CI/CD, sau đó đọc vào script Gradle thông qua `providers.gradleProperty(...)`.',
      'Lưu công khai trong file `res/values/strings.xml` của module `:app`.',
      'Đặt làm tên cho nhánh Git (Git branch name) của lập trình viên.'
    ],
    correctAnswers: [1],
    explanation: 'Thông tin xác thực Artifactory (`backbaseRepoUser`, `backbaseRepoPassword` / Identity Token) là tài sản bảo mật tuyệt đối không được commit vào Git repository. Trên máy local của lập trình viên, chúng phải được khai báo trong `~/.gradle/gradle.properties` (ngoài thư mục Git dự án) hoặc trong `local.properties` đã được thêm vào `.gitignore`; còn trên CI/CD pipeline thì tiêm qua Secret Environment Variables.'
  },
  {
    id: 302,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Cơ chế **Backbase BOM (Bill of Materials)** được khai báo qua cú pháp `implementation(platform("com.backbase.android:modelbank-bom:<version>"))` trong Gradle giải quyết vấn đề cốt lõi nào khi tích hợp hàng chục thư viện Journey, MDS và Core SDK?',
    options: [
      'Tự động tải mã nguồn iOS về biên dịch chung với dự án Android.',
      'Khóa chặt và đồng bộ hóa ma trận phiên bản (Version Alignment) đã được Backbase kiểm thử tương thích giữa toàn bộ các Journeys, GenClients, MDS và Core SDK; lập trình viên không cần khai báo version lẻ tẻ cho từng artifact và tránh hoàn toàn xung đột phiên bản (Dependency Hell / `NoSuchMethodError` lúc runtime).',
      'Giúp ứng dụng có thể chạy mà không cần cài đặt máy ảo Java (JVM) trên máy tính phát triển.',
      'Tự động xóa toàn bộ các thư viện của Google AndroidX khỏi dự án.'
    ],
    correctAnswers: [1],
    explanation: 'Khi sử dụng Gradle `platform(...)` với Backbase BOM (hoặc Version Catalog tương ứng của bản phát hành Modelbank), BOM đóng vai trò bảng tra cứu phiên bản chuẩn đã được chứng nhận tương thích cùng nhau. Các khai báo `implementation("com.backbase.android.journey:accounts-and-transactions-journey")` bên dưới sẽ tự động lấy đúng version chuẩn từ BOM.'
  },
  {
    id: 303,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Vị trí chuẩn xác nhất trong vòng đời ứng dụng Android để gọi hàm khởi tạo `Backbase.initialize(applicationContext, configAssetPath, ...)` của Core SDK là ở đâu?',
    options: [
      'Gọi lặp đi lặp lại trong hàm `onResume()` của mọi `Fragment` trong ứng dụng.',
      'Gọi một lần duy nhất trong phương thức `onCreate()` của lớp kế thừa `android.app.Application` (trước khi bất kỳ Activity, Service hay Journey nào truy cập vào instance của Backbase SDK hoặc DI graph).',
      'Gọi bên trong hàm `onDestroy()` của `MainActivity` khi người dùng đóng ứng dụng.',
      'Chỉ gọi khi người dùng bấm vào nút "Quên mật khẩu".'
    ],
    correctAnswers: [1],
    explanation: '`Backbase.initialize(...)` chịu trách nhiệm đọc file cấu hình nền tảng (thường là `assets/backbase/config.json`), thiết lập môi trường bảo mật, khởi tạo Networking engine và Auth client. Do đó, nó bắt buộc phải được gọi sớm nhất trong `Application.onCreate()` để sẵn sàng phục vụ cho toàn bộ các module và DI container.'
  },
  {
    id: 304,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'multi',
    question: 'File cấu hình nền tảng `assets/backbase/config.json` (được nạp khi khởi tạo `Backbase.initialize`) thường chứa những nhóm thông tin cấu hình quan trọng nào? (Chọn 3 đáp án đúng)',
    options: [
      'Địa chỉ máy chủ gốc (`serverURL` / Base URL của API Gateway / Edge Service) và đường dẫn ngữ cảnh của các dịch vụ.',
      'Cấu hình định danh OAuth2 / OpenID Connect (`identity` configuration: `baseUrl`, `realm`, `clientId`, `applicationKey`).',
      'Cấu hình bảo mật kết nối và danh sách ghim chứng chỉ số (`security` / SSL Pinning / `domains` được phép giao tiếp).',
      'Toàn bộ mã nguồn Kotlin của các màn hình giao diện người dùng.'
    ],
    correctAnswers: [0, 1, 2],
    explanation: 'File `config.json` của Backbase SDK định nghĩa các thông số môi trường cốt lõi: URL của máy chủ Backend/Edge, thông số kết nối Identity Server (Keycloak/OIDC realm, clientId), cấu hình phiên làm việc và các chính sách bảo mật đường truyền (SSL Pinning hashes/certificates, allowed domains).'
  },
  {
    id: 305,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Trong tầng mạng của ứng dụng Android sử dụng OkHttp, khi một request gọi tới Digital Banking Services bị trả về mã lỗi **HTTP `401 Unauthorized`** do Access Token vừa hết hạn, thành phần nào của OkHttp được thiết kế chuyên biệt để tự động chặn bắt lỗi này, thực hiện làm mới token (Refresh Token) đồng bộ và tự động gửi lại (retry) request vừa thất bại?',
    options: [
      '`okhttp3.Dns`',
      '`okhttp3.Authenticator` (hoặc cơ chế Token Refresh Authenticator tích hợp trong Backbase Auth Client)',
      '`okhttp3.CookieJar`',
      '`okhttp3.EventListener`'
    ],
    correctAnswers: [1],
    explanation: 'Trong OkHttp, `Authenticator` là giao diện chuyên dụng chỉ được kích hoạt tự động khi server phản hồi mã `401 Unauthorized` (hoặc `407`). Bên trong hàm `authenticate(route: Route?, response: Response): Request?`, ứng dụng (hoặc Backbase Session/Auth SDK) sẽ đồng bộ hóa (synchronized/Mutex) việc gọi Refresh Token, cập nhật `Authorization: Bearer <new_token>` và trả về `Request` mới để OkHttp tự động thực thi lại mà tầng UI không hề hay biết.'
  },
  {
    id: 306,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Khi triển khai cơ chế tự động làm mới Access Token bên trong `okhttp3.Authenticator`, tại sao bắt buộc phải có cơ chế khóa đồng bộ (ví dụ: `synchronized` hoặc Kotlin `Mutex`) kết hợp kiểm tra xem token trong request vừa lỗi có khác với token mới nhất hiện đang lưu trong bộ nhớ hay không?',
    options: [
      'Để làm cho điện thoại rung lên mỗi khi làm mới token.',
      'Để giải quyết bài toán **Concurrency / Race Condition** khi màn hình Dashboard bắn ra 5 request song song cùng lúc và cả 5 đều nhận về lỗi `401`: chỉ request đầu tiên bước vào khối khóa mới thực sự gọi API Refresh Token lên server, còn 4 request tiếp theo khi bước vào sẽ thấy token đã được làm mới sẵn nên chỉ việc gắn token mới đó vào header và retry ngay, tránh gọi Refresh Token 5 lần liên tiếp gây lỗi hủy token (Token Revocation) trên Identity Server.',
      'Để ngăn không cho người dùng tắt kết nối Wi-Fi.',
      'Vì OkHttp chỉ cho phép chạy trên các thiết bị có đúng 1 nhân CPU.'
    ],
    correctAnswers: [1],
    explanation: 'Identity Server (như Keycloak với cơ chế Refresh Token Rotation) thường vô hiệu hóa ngay lập tức Refresh Token cũ sau lần dùng đầu tiên. Nếu 5 request bị 401 cùng lúc và cả 5 đều bắn request Refresh Token không đồng bộ, 4 request sau sẽ gửi Refresh Token đã hết hiệu lực và khiến phiên đăng nhập bị cưỡng bức đăng xuất. Dùng `synchronized`/`Mutex` kèm kiểm tra đối chiếu token hiện tại là mẫu thiết kế bắt buộc.'
  },
  {
    id: 307,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'multi',
    question: 'Để bảo vệ ứng dụng ngân hàng trước các cuộc tấn công nghe lén trung gian (Man-in-the-Middle - MitM) và chặn hoàn toàn giao thức HTTP không mã hóa (Cleartext traffic) trên Android, lập trình viên cần thiết lập những gì trong file `res/xml/network_security_config.xml` và `AndroidManifest.xml`? (Chọn 2 đáp án đúng)',
    options: [
      'Thiết lập thuộc tính `cleartextTrafficPermitted="false"` trong thẻ `<base-config>` (hoặc `<domain-config>`) và khai báo các mã băm khóa công khai SPKI SHA-256 trong thẻ `<pin-set>` (kèm chứng chỉ dự phòng backup pin) cho tên miền máy chủ ngân hàng.',
      'Tham chiếu file cấu hình bảo mật mạng vào thẻ `<application android:networkSecurityConfig="@xml/network_security_config" ...>` trong `AndroidManifest.xml`.',
      'Thiết lập `cleartextTrafficPermitted="true"` cho toàn bộ các tên miền trên môi trường Production để tăng tốc độ tải dữ liệu.',
      'Xóa quyền `<uses-permission android:name="android.permission.INTERNET" />` khỏi `AndroidManifest.xml`.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Chuẩn bảo mật OWASP MASVS cho ứng dụng ngân hàng yêu cầu chặn tuyệt đối Cleartext HTTP (`cleartextTrafficPermitted="false"`) và thiết lập **Certificate Pinning** (ghim mã băm SHA-256 của Subject Public Key Info - SPKI kèm tối thiểu 1 backup key pin) thông qua `network_security_config.xml` và cấu hình SSL Pinning của Backbase SDK.'
  },
  {
    id: 308,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Khi cấu hình **Certificate Pinning** trong `network_security_config.xml` hoặc trong cấu hình bảo mật của Backbase SDK, tại sao chuẩn thực hành tốt nhất luôn yêu cầu phải ghim (pin) mã băm của **Public Key (SPKI - Subject Public Key Info)** kèm theo ít nhất một **Backup Key** hoặc ghim ở cấp **Intermediate CA** thay vì chỉ ghim duy nhất chứng chỉ lá (Leaf Certificate) hiện tại?',
    options: [
      'Vì mã băm SPKI có độ dài ngắn hơn nên gõ bàn phím nhanh hơn.',
      'Để tránh thảm họa "biến ứng dụng thành cục gạch" (App Outage / Brick): Khi chứng chỉ Leaf trên server hết hạn định kỳ và được gia hạn (renew) bằng cùng cặp khóa hoặc chuyển sang khóa dự phòng (Backup Key) / cùng Intermediate CA, các ứng dụng đang cài trên máy khách hàng vẫn kết nối bình thường mà không bắt buộc người dùng phải lên Play Store cập nhật app khẩn cấp.',
      'Vì hệ điều hành Android không đọc được chứng chỉ Leaf.',
      'Để cho phép mọi phần mềm proxy như Charles Proxy hay Mitmproxy tự do giải mã gói tin trên bản Production.'
    ],
    correctAnswers: [1],
    explanation: 'Nếu chỉ pin cứng duy nhất Leaf Certificate và không có Backup Pin (hoặc pin SPKI của khóa công khai / Intermediate CA), ngay khoảnh khắc đội vận hành thay chứng chỉ mới trên Load Balancer/Gateway, 100% người dùng chưa kịp cập nhật ứng dụng mới trên Store sẽ bị lỗi `SSLPeerUnverifiedException` và không thể đăng nhập ngân hàng.'
  },
  {
    id: 309,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Trong quá trình phát triển và gỡ lỗi tầng mạng (Debugging Networking) trên môi trường `debug` / `staging`, lập trình viên nên cấu hình `HttpLoggingInterceptor` hoặc công cụ kiểm tra lưu lượng (như Chucker / Android Studio Network Inspector) như thế nào để vừa hiệu quả vừa đảm bảo an toàn bảo mật cho bản `release`?',
    options: [
      'Luôn bật `HttpLoggingInterceptor.Level.BODY` trên cả bản `release` Production để in toàn bộ mật khẩu và số thẻ tín dụng của khách hàng ra hệ thống `Logcat` của điện thoại.',
      'Chỉ gắn `HttpLoggingInterceptor` (hoặc đặt mức log chi tiết) khi `BuildConfig.DEBUG == true` (hoặc chỉ khai báo `debugImplementation` trong source set `src/debug/`), đồng thời sử dụng `redactHeader("Authorization")` và `redactHeader("Cookie")` để che giấu các token nhạy cảm.',
      'Gửi toàn bộ nội dung log mạng của khách hàng lên một diễn đàn công cộng.',
      'Tắt hoàn toàn kết nối mạng khi biên dịch ở chế độ Debug.'
    ],
    correctAnswers: [1],
    explanation: 'Việc để lọt `HttpLoggingInterceptor.Level.BODY` hoặc công cụ như Chucker lên bản Production (`release`) là một lỗ hổng bảo mật nghiêm trọng (vi phạm PCI-DSS / OWASP) vì bất kỳ tiến trình hoặc thiết bị kết nối ADB nào cũng có thể đọc trộm Token, PII và thông tin giao dịch trong Logcat. Chỉ được kích hoạt ở bản `debug` (sử dụng `debugImplementation` với `releaseImplementation` no-op) và luôn `redactHeader` nhạy cảm.'
  },
  {
    id: 310,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Để quản lý cấu hình cho nhiều môi trường triển khai khác nhau của ngân hàng (ví dụ: `dev`, `sit`, `uat`, `prod`) có `serverURL`, `clientId` và chứng chỉ SSL Pinning khác nhau trong dự án Backbase Android, cơ chế nào của hệ thống build Android Gradle Plugin (AGP) được sử dụng hiệu quả nhất?',
    options: [
      'Bắt lập trình viên sửa tay file `config.json` mỗi lần trước khi bấm nút Build.',
      'Sử dụng **Product Flavors** (kết hợp `flavorDimensions`) và đặt các file `assets/backbase/config.json` cũng như `res/xml/network_security_config.xml` tương ứng vào từng thư mục source set riêng biệt: `src/dev/`, `src/uat/`, `src/prod/`.',
      'Tạo 4 kho lưu trữ Git hoàn toàn tách biệt và copy-paste code qua lại mỗi ngày.',
      'Nén cả 4 file APK vào trong một file `.zip` rồi đổi đuôi thành `.apk`.'
    ],
    correctAnswers: [1],
    explanation: 'Hệ thống Source Sets của Android Gradle Plugin cho phép mỗi Product Flavor (`src/dev/assets/backbase/config.json`, `src/prod/assets/backbase/config.json`) tự động được đóng gói chính xác vào biến thể build tương ứng (`assembleDevDebug`, `assembleProdRelease`) mà không cần can thiệp thủ công, đảm bảo tính tự động hóa trên CI/CD.'
  },
  {
    id: 311,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Khi bật tính năng tối ưu hóa và làm rối mã nguồn **R8 (`isMinifyEnabled = true`)** cho bản build `release` của ứng dụng tích hợp Backbase, điều gì có thể xảy ra nếu thiếu các quy tắc giữ lại lớp (`-keep` ProGuard/R8 rules) cho các model DTO sử dụng phản xạ (reflection) hoặc serialization?',
    options: [
      'Ứng dụng sẽ tự động chuyển sang giao diện màu đen trắng.',
      'R8 sẽ đổi tên (obfuscate) các trường thuộc tính thành `a`, `b`, `c` hoặc xóa bỏ các constructor/fields trông có vẻ không được gọi trực tiếp, dẫn đến việc giải mã JSON từ API trả về bị `null` toàn bộ hoặc văng lỗi crash `NullPointerException` / `JsonDataException` chỉ xuất hiện trên bản Release.',
      'Trình biên dịch sẽ tự động nâng cấp phiên bản Android của điện thoại người dùng.',
      'Không có bất kỳ ảnh hưởng nào vì R8 chỉ xóa các file hình ảnh.'
    ],
    correctAnswers: [1],
    explanation: 'Các thư viện Backbase AAR thường đã đính kèm sẵn `consumer-rules.pro` tiêu chuẩn của chúng. Tuy nhiên, đối với các Custom DTOs hoặc các model tự định nghĩa trong dự án dùng với Gson/Moshi/Kotlinx Serialization/Retrofit, lập trình viên cần sử dụng codegen adapter (`@JsonClass(generateAdapter = true)` / `@Serializable`) hoặc khai báo `@Keep` / quy tắc `-keep` trong `proguard-rules.pro`, đồng thời luôn phải kiểm thử kỹ trên bản build bật R8 trước khi phát hành.'
  },
  {
    id: 312,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'multi',
    question: 'Trong thiết lập Dependency Injection (Hilt hoặc Koin) tại module `:app` cho một dự án Backbase Android, những thành phần cốt lõi nào thường được đăng ký ở phạm vi **Singleton (`@Singleton` / `single { ... }`)** dùng chung cho toàn ứng dụng? (Chọn 3 đáp án đúng)',
    options: [
      'Instance của `Backbase` SDK, `AuthClient` và `SessionEmitter` quản lý trạng thái phiên đăng nhập toàn cục.',
      'Các đối tượng `OkHttpClient` gốc và các instance của DBS `GenClients` (như `ArrangementsApi`, `PaymentOrdersApi`, `NotificationsApi`).',
      'Cơ sở dữ liệu cục bộ `RoomDatabase` và `SecureStorage` / `EncryptedStorage`.',
      'Trạng thái văn bản đang gõ dở của một ô nhập số tiền cụ thể trên màn hình chuyển khoản tạm thời.'
    ],
    correctAnswers: [0, 1, 2],
    explanation: 'Các thành phần hạ tầng tốn kém tài nguyên khởi tạo và giữ kết nối/trạng thái toàn cục như `Backbase` SDK instance, `OkHttpClient` (quản lý connection pool & thread pool), các API `GenClients`, `RoomDatabase` và `SecureStorage` đều phải được khởi tạo ở phạm vi `@Singleton` (`single` trong Koin). Ngược lại, trạng thái tạm thời của một màn hình phải gắn với phạm vi `ViewModel`.'
  },
  {
    id: 313,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Trong hệ thống quản lý phụ thuộc hiện đại của Gradle (Gradle Version Catalogs - `gradle/libs.versions.toml`), việc kết hợp Version Catalog với Backbase BOM mang lại lợi ích gì cho cấu trúc dự án đa module?',
    options: [
      'Tập trung hóa toàn bộ khai báo tọa độ thư viện (`libraries`) và plugin (`plugins`) vào một file duy nhất `libs.versions.toml` có hỗ trợ gợi ý code an toàn kiểu (type-safe accessors như `libs.backbase.accounts.journey`) trên khắp các file `build.gradle.kts` của mọi module con.',
      'Loại bỏ hoàn toàn nhu cầu sử dụng file `settings.gradle.kts`.',
      'Cho phép viết code Kotlin trực tiếp bên trong file `.toml`.',
      'Giúp giảm dung lượng RAM của máy tính lập trình viên xuống 0 MB.'
    ],
    correctAnswers: [0],
    explanation: 'Gradle Version Catalog (`libs.versions.toml`) kết hợp với Backbase BOM là chuẩn thiết lập hiện đại nhất trong Modelbank: BOM giữ nhiệm vụ đồng bộ phiên bản của hệ sinh thái Backbase, còn `libs.versions.toml` cung cấp các bí danh type-safe (`libs.backbase.journey.accounts`) để mọi module trong dự án tham chiếu đồng nhất, sạch sẽ và dễ bảo trì.'
  },
  {
    id: 314,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Khi khởi tạo một `GenClient` (ví dụ `ProductSummaryApi` của dịch vụ Arrangement Manager) để kết nối với cổng API Gateway của Backbase, đường dẫn URI ngữ cảnh của dịch vụ thường được cấu hình theo quy ước chuẩn nào của Backbase?',
    options: [
      '`ftp://localhost:21/files`',
      '`${serverUrl}/api/arrangement-manager/...` (kết hợp giữa Base URL từ cấu hình Backbase SDK và service path chuẩn của microservice DBS tương ứng thông qua `NetworkConnector` của SDK).',
      '`mailto:support@backbase.com`',
      '`file:///android_asset/index.html`'
    ],
    correctAnswers: [1],
    explanation: 'Mỗi microservice trong Digital Banking Services (DBS) được định tuyến qua Edge/API Gateway theo đường dẫn chuẩn `/api/<service-name>/client-api/v2/...` (ví dụ `/api/arrangement-manager`, `/api/payment-order-service`, `/api/access-control`). Khi khởi tạo GenClient với Backbase SDK, lập trình viên truyền URI ngữ cảnh tương ứng để SDK kết nối chính xác qua `dbsDataProvider` / `NetworkConnector`.'
  },
  {
    id: 315,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Để bảo vệ dữ liệu nhạy cảm lưu trữ cục bộ trên thiết bị Android (như Refresh Token, Biometric Key, hoặc thông tin định danh người dùng), cơ chế phần cứng nào của hệ điều hành Android được `SecureStorage` của Backbase SDK tận dụng bên dưới?',
    options: [
      'Lưu dưới dạng văn bản thuần (Plaintext) trong thư mục bộ nhớ đệm công khai `externalCacheDir`.',
      'Sử dụng **Android Keystore System** (được bảo vệ bởi phần cứng **TEE - Trusted Execution Environment** hoặc **StrongBox Keymaster**) để sinh và giữ khóa mã hóa bất đối xứng/đối xứng (AES-GCM), đảm bảo khóa mật mã không bao giờ rời khỏi chip bảo mật ngay cả khi thiết bị bị root.',
      'Mã hóa bằng cách đảo ngược thứ tự các chữ cái trong chuỗi (Reverse String).',
      'Lưu vào tên của kết nối Bluetooth trên điện thoại.'
    ],
    correctAnswers: [1],
    explanation: 'Backbase `SecureStorage` (và `EncryptedSharedPreferences`) dựa trên **Android Keystore System**. Khóa chủ (Master Key) được tạo và lưu giữ bên trong phần cứng bảo mật cách ly (TEE / StrongBox). Mọi dữ liệu nhạy cảm đều được mã hóa bằng AES-256 trước khi ghi xuống đĩa, đảm bảo an toàn cao nhất theo tiêu chuẩn ngân hàng.'
  },
  {
    id: 316,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Khi lắng nghe các thay đổi trạng thái phiên đăng nhập toàn cục (ví dụ: Phiên hết hạn `SESSION_ENDED` hoặc Refresh Token thất bại hoàn toàn buộc phải đưa người dùng về màn hình Đăng nhập và xóa sạch dữ liệu nhạy cảm trên bộ nhớ), ứng dụng Android tích hợp Backbase nên xử lý ở đâu?',
    options: [
      'Bắt người dùng tự tắt nguồn và khởi động lại điện thoại khi thấy màn hình trắng.',
      'Đăng ký một `SessionStateListener` / thu thập luồng sự kiện từ `SessionEmitter` ở cấp độ toàn cục (ví dụ trong `MainActivity` hoặc `AppNavigationViewModel`), để ngay khi nhận tín hiệu phiên kết thúc/không hợp lệ sẽ tự động xóa BackStack điều hướng và chuyển hướng an toàn về `AuthenticationJourney`.',
      'Kiểm tra trạng thái đăng nhập bằng cách gọi điện thoại cho tổng đài.',
      'Viết code kiểm tra phiên lặp lại thủ công bên trong mọi `TextView` của ứng dụng.'
    ],
    correctAnswers: [1],
    explanation: 'Backbase Core/Auth SDK cung cấp cơ chế phát tín hiệu trạng thái phiên (`SessionEmitter` / `SessionStateListener`). Việc lắng nghe tập trung ở tầng Host Application (`MainActivity` / Root Navigation) giúp ứng dụng phản ứng tức thời khi phiên hết hạn (do idle timeout hoặc token bị thu hồi từ xa), tự động dọn dẹp state và điều hướng người dùng về màn hình xác thực.'
  },
  {
    id: 317,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Để tải các thư viện artifact của Backbase SDK từ repository riêng tư (Backbase Artifactory), lập trình viên phải cấu hình thông tin đăng nhập (Credentials) ở đâu là AN TOÀN NHẤT?',
    options: [
      'Hardcode username và password trực tiếp trong file build.gradle.kts của dự án và commit lên Git.',
      'Lưu trong file ~/.gradle/gradle.properties trên máy cá nhân hoặc biến môi trường (Environment Variables) trên hệ thống CI/CD.',
      'Đặt thông tin đăng nhập trong file AndroidManifest.xml.',
      'Viết trong file README.md của kho mã nguồn.'
    ],
    correctAnswers: [1],
    explanation: 'Không bao giờ lưu credentials trên Repository code. Việc đặt trong ~/.gradle/gradle.properties (nằm ngoài folder git) giúp bảo mật tài khoản cá nhân và hệ thống CI/CD.'
  },
  {
    id: 318,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Công cụ Backbase BOM (Bill of Materials) đóng vai trò gì trong file cấu hình Gradle?',
    options: [
      'Tự động nén dung lượng file APK sau khi build.',
      'Đảm bảo tất cả các thư viện SDK của Backbase được khai báo đồng bộ về một phiên bản tương thích duy nhất, tránh xung đột phiên bản.',
      'Tự động phát sinh mã UI Compose.',
      'Thay thế cho JDK 17.'
    ],
    correctAnswers: [1],
    explanation: 'Backbase BOM quản lý dependency phiên bản tập trung. Người dùng khai báo BOM platform và các dependency con không cần ghi rõ version, tránh lỗi không tương thích giữa các Journey.'
  },
  {
    id: 319,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Cú pháp Gradle (KTS) nào sau đây áp dụng Backbase BOM chính xác?',
    options: [
      'implementation("com.backbase.android:bom:x.y.z")',
      'implementation(platform("com.backbase.android:bom:x.y.z"))',
      'kapt("com.backbase.android:bom:x.y.z")',
      'classpath("com.backbase.android:bom:x.y.z")'
    ],
    correctAnswers: [1],
    explanation: 'Trong Gradle Kotlin DSL, cú pháp platform(...) được dùng để khai báo một BOM dependency quản lý version.'
  },
  {
    id: 320,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'multi',
    question: 'Những thông tin nào dưới đây BẮT BUỘC phải được cung cấp trong file cấu hình backbase-integrator-config.json hoặc trong hàm Backbase.initialize()? (Chọn 2)',
    options: [
      'Server Base URL (Địa chỉ Gateway API).',
      'Danh sách tên tất cả lập trình viên tham gia dự án.',
      'Cấu hình các thông số về Security / Authentication Client ID.',
      'Mật khẩu Wi-Fi của văn phòng.'
    ],
    correctAnswers: [0, 2],
    explanation: 'Core SDK cần thông tin Gateway Endpoint (Server Base URL) và OAuth/OIDC Client ID/Security config để khởi tạo kết nối mạng và quản lý xác thực.'
  },
  {
    id: 321,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Khi dự án gặp lỗi biên dịch Gradle do xung đột phiên bản của thư viện kotlinx-coroutines-core giữa Backbase SDK và thư viện bên thứ 3, xử lý chuẩn nhất là gì?',
    options: [
      'Xóa Backbase SDK khỏi dự án.',
      'Bỏ qua kiểm tra lỗi bằng thuộc tính android.lintOptions.abortOnError = false.',
      'Sử dụng cơ chế configurations.all { resolutionStrategy { force(...) } } hoặc align lại phiên bản theo chuẩn mà Backbase BOM hỗ trợ.',
      'Tắt tính năng Kotlin Coroutines.'
    ],
    correctAnswers: [2],
    explanation: 'Sử dụng resolutionStrategy hoặc dependency alignment giúp ép buộc Gradle chọn phiên bản tương thích an toàn mà không phá vỡ cấu trúc SDK.'
  },
  {
    id: 322,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Phiên bản JDK tối thiểu được khuyến nghị để biên dịch các dự án Android Backbase thế hệ mới (Sử dụng Android Gradle Plugin 8.x+) là gì?',
    options: [
      'JDK 1.8 (Java 8).',
      'JDK 11.',
      'JDK 17.',
      'JDK 21.'
    ],
    correctAnswers: [2],
    explanation: 'AGP 8.0+ và các bản Android SDK / Backbase SDK mới hiện tại yêu cầu môi trường thực thi JDK 17 làm chuẩn tối thiểu để build dự án.'
  },
  {
    id: 323,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Mục đích của việc khai báo maven { url = uri("https://repo.backbase.com/repo/maven-releases") } trong settings.gradle.kts là gì?',
    options: [
      'Để tải về các plugin của Google Play Services.',
      'Khai báo máy chủ chứa các gói thư viện (Artifacts) chính thức do Backbase phát hành.',
      'Khai báo địa chỉ lưu trữ source code Git.',
      'Tải về file cấu hình Firebase.'
    ],
    correctAnswers: [1],
    explanation: 'Các thư viện SDK của Backbase được lưu trữ trên server Maven riêng biệt của Backbase (repo.backbase.com). Cấu hình này giúp Gradle tìm và tải các file .aar/.jar về.'
  },
  {
    id: 324,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Lớp (Class) nào trong Android App là nơi thích hợp nhất để gọi phương thức khởi tạo Backbase.initialize(...)?',
    options: [
      'MainActivity.onCreate()',
      'Lớp mở rộng từ Application (App.onCreate())',
      'SplashFragment.onViewCreated()',
      'Trong một Worker của WorkManager.'
    ],
    correctAnswers: [1],
    explanation: 'Application.onCreate() chạy đầu tiên khi tiến trình (process) ứng dụng được tạo, đảm bảo Core SDK được khởi tạo xong trước khi bất kỳ Activity/Fragment nào được render.'
  },
  {
    id: 325,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'multi',
    question: 'Các file nào sau đây KHÔNG ĐƯỢC COMMIT lên Git repository công khai để bảo mật? (Chọn 2)',
    options: [
      'gradle.properties chứa token đăng nhập Artifactory cá nhân.',
      'File build.gradle.kts của root module.',
      'File Chìa khóa ký ứng dụng (keystore.jks / release.keystore).',
      'File proguard-rules.pro.'
    ],
    correctAnswers: [0, 2],
    explanation: 'Secret Token/Credentials và File KeyStore ký App là các thông tin nhạy cảm bảo mật cao nhất, tuyệt đối không được commit lên VCS.'
  },
  {
    id: 326,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Tính năng "Gradle Build Cache" giúp ích gì trong quá trình phát triển ứng dụng di động Backbase?',
    options: [
      'Tự động kiểm tra lỗi chính tả trong code.',
      'Tái sử dụng kết quả biên dịch của các task trước đó (nếu không có sự thay đổi input), giúp giảm đáng kể thời gian Build App.',
      'Mã hóa toàn bộ file APK.',
      'Giảm lượng bộ nhớ RAM mà Android Studio tiêu thụ.'
    ],
    correctAnswers: [1],
    explanation: 'Với các dự án lớn đa module như Backbase, Build Cache giúp tránh biên dịch lại các module không đổi, tăng tốc độ phát triển.'
  },
  {
    id: 327,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Cấu hình nào trong settings.gradle.kts quản lý tập trung toàn bộ kho lưu trữ dependency cho dự án?',
    options: [
      'pluginManagement',
      'dependencyResolutionManagement',
      'buildscript',
      'sourceSets'
    ],
    correctAnswers: [1],
    explanation: 'dependencyResolutionManagement là chuẩn quản lý repository tập trung trong Gradle hiện đại.'
  },
  {
    id: 328,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Backbase BOM (Bill of Materials) giúp giải quyết triệt để vấn đề gì?',
    options: [
      'Lỗi thiếu quyền truy cập camera.',
      'Xung đột phiên bản (Version Mismatch) giữa các thư viện SDK và Journey của Backbase.',
      'Tự động dịch ngôn ngữ trong ứng dụng.',
      'Giảm kích thước font chữ trên màn hình nhỏ.'
    ],
    correctAnswers: [1],
    explanation: 'BOM đồng bộ và khóa tất cả các thư viện Backbase về phiên bản tương thích kiểm thử chuẩn.'
  },
  {
    id: 329,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'multi',
    question: 'Khi nào một request HTTP nhận lỗi 401 Unauthorized sẽ kích hoạt OkHttp Authenticator? (Chọn 2)',
    options: [
      'Khi Access Token bị hết hạn trong quá trình gọi API.',
      'Khi Server yêu cầu cấp lại Token mới (Refresh Token) để tiếp tục phiên giao dịch.',
      'Khi thiết bị mất hoàn toàn kết nối Wi-Fi/4G.',
      'Khi Server trả về lỗi 500 Internal Server Error.'
    ],
    correctAnswers: [0, 1],
    explanation: 'OkHttp Authenticator được thiết kế đặc thù để tự động xử lý khi nhận mã HTTP 401 từ server.'
  },
  {
    id: 330,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Để đảm bảo an toàn tuyệt đối thông tin xác thực Artifactory trong môi trường CI/CD, ta nên làm gì?',
    options: [
      'Commit trực tiếp username và password vào file build.gradle.kts.',
      'Sử dụng biến môi trường bí mật (CI/CD Masked/Secret Variables) trên máy chủ build.',
      'Ghi thông tin đăng nhập vào file README.md.',
      'In username và password ra màn hình console khi build.'
    ],
    correctAnswers: [1],
    explanation: 'Dùng CI/CD Secret Variables đảm bảo không lộ credentials trong mã nguồn và log build.'
  },
  {
    id: 331,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Cấu hình Certificate Pinning trong Android nhằm mục đích ngăn chặn cuộc tấn công nào?',
    options: [
      'SQL Injection.',
      'Man-In-The-Middle (MITM) thông qua việc can thiệp chứng chỉ SSL/TLS giả mạo.',
      'Tấn công từ chối dịch vụ (DDoS).',
      'Tấn công vét cạn mật khẩu (Brute Force).'
    ],
    correctAnswers: [1],
    explanation: 'Certificate Pinning đảm bảo client chỉ chấp nhận kết nối với server có public key/certificate được ghim sẵn.'
  },
  {
    id: 332,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Thuộc tính nào trong network_security_config.xml cho phép cấu hình chứng chỉ tin cậy riêng cho bản build debug?',
    options: [
      '<base-config>',
      '<debug-overrides>',
      '<pin-set>',
      '<domain-config>'
    ],
    correctAnswers: [1],
    explanation: '<debug-overrides> chỉ kích hoạt khi app chạy ở chế độ debuggable, an toàn cho production.'
  },
  {
    id: 333,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Khi build release, công cụ R8/ProGuard sử dụng file consumer-rules.pro từ thư viện SDK nhằm mục đích gì?',
    options: [
      'Tự động xóa bỏ các Journey không dùng.',
      'Giữ lại (keep) các class DTO và DI interface quan trọng không bị đổi tên gây lỗi runtime parse JSON.',
      'Chuyển đổi mã bytecode sang C++.',
      'Tăng kích thước bộ nhớ heap của JVM.'
    ],
    correctAnswers: [1],
    explanation: 'consumer-rules.pro bảo vệ các DTOs và reflection interface không bị obfuscation làm hỏng.'
  },
  {
    id: 334,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Để thêm header X-Device-Id vào mọi request API gửi lên server, lập trình viên nên sử dụng thành phần nào?',
    options: [
      'OkHttp Interceptor đăng ký vào NetworkEngine của Core SDK qua DI.',
      'Viết vòng lặp gửi lại request trong Activity.',
      'Can thiệp vào phần cứng router Wi-Fi.',
      'Sửa đổi file hosts của hệ điều hành.'
    ],
    correctAnswers: [0],
    explanation: 'OkHttp Interceptor là cơ chế chuẩn để chặn và gắn header toàn cục cho mọi request.'
  }
]
