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
    question: 'When configuring access to the private Backbase Artifact Repository (JFrog Artifactory) in an Android project, where should sensitive authentication credentials (Username / API Token / Encrypted Password) be stored to ensure they are NEVER accidentally committed to the Git version control system?',
    options: [
      'Hardcode the password string directly into the project\'s `settings.gradle.kts` file and push it to the `main` branch.',
      'Store them in the `~/.gradle/gradle.properties` file in the developer\'s user home directory (Global Gradle properties) or pass them via system environment variables (`System.getenv(...)`) on CI/CD servers, reading them into Gradle scripts via `providers.gradleProperty(...)`.',
      'Store them publicly in the `res/values/strings.xml` file of the `:app` module.',
      'Set them as the developer\'s Git branch name.'
    ],
    correctAnswers: [1],
    explanation: 'Thông tin xác thực Artifactory (`backbaseRepoUser`, `backbaseRepoPassword` / Identity Token) là tài sản bảo mật tuyệt đối không được commit vào Git repository. Trên máy local của lập trình viên, chúng phải được khai báo trong `~/.gradle/gradle.properties` (ngoài thư mục Git dự án) hoặc trong `local.properties` đã được thêm vào `.gitignore`; còn trên CI/CD pipeline thì tiêm qua Secret Environment Variables.'
  },
  {
    id: 302,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'What core problem does the **Backbase BOM (Bill of Materials)** mechanism, declared via `implementation(platform("com.backbase.android:modelbank-bom:<version>"))` in Gradle, solve when integrating dozens of Journey, MDS, and Core SDK libraries?',
    options: [
      'It automatically downloads iOS source code to compile alongside the Android project.',
      'It locks and synchronizes a compatibility-tested version matrix (Version Alignment) across all Journeys, GenClients, MDS, and the Core SDK; developers do not need to specify individual versions for each artifact, completely avoiding version conflicts (Dependency Hell / runtime `NoSuchMethodError`).',
      'It allows the application to run without installing a Java Virtual Machine (JVM) on the development machine.',
      'It automatically removes all Google AndroidX libraries from the project.'
    ],
    correctAnswers: [1],
    explanation: 'Khi sử dụng Gradle `platform(...)` với Backbase BOM (hoặc Version Catalog tương ứng của bản phát hành Modelbank), BOM đóng vai trò bảng tra cứu phiên bản chuẩn đã được chứng nhận tương thích cùng nhau. Các khai báo `implementation("com.backbase.android.journey:accounts-and-transactions-journey")` bên dưới sẽ tự động lấy đúng version chuẩn từ BOM.'
  },
  {
    id: 303,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Where is the most appropriate place in the Android application lifecycle to invoke the Core SDK initialization method `Backbase.initialize(applicationContext, configAssetPath, ...)`?',
    options: [
      'Call it repeatedly inside the `onResume()` method of every `Fragment` in the application.',
      'Call it once inside the `onCreate()` method of the class extending `android.app.Application` (before any Activity, Service, or Journey accesses the Backbase SDK instance or DI graph).',
      'Call it inside the `onDestroy()` method of `MainActivity` when the user closes the application.',
      'Call it only when the user taps the "Forgot Password" button.'
    ],
    correctAnswers: [1],
    explanation: '`Backbase.initialize(...)` chịu trách nhiệm đọc file cấu hình nền tảng (thường là `assets/backbase/config.json`), thiết lập môi trường bảo mật, khởi tạo Networking engine và Auth client. Do đó, nó bắt buộc phải được gọi sớm nhất trong `Application.onCreate()` để sẵn sàng phục vụ cho toàn bộ các module và DI container.'
  },
  {
    id: 304,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'multi',
    question: 'Which key configuration groups are typically contained within the platform configuration file `assets/backbase/config.json` (loaded during `Backbase.initialize`)? (Select 3)',
    options: [
      'The root server address (`serverURL` / Base URL of the API Gateway / Edge Service) and service context paths.',
      'OAuth2 / OpenID Connect identity configuration (`identity` configuration: `baseUrl`, `realm`, `clientId`, `applicationKey`).',
      'Connection security configuration and digital certificate pinning list (`security` / SSL Pinning / allowed `domains`).',
      'The entire Kotlin source code of the user interface screens.'
    ],
    correctAnswers: [0, 1, 2],
    explanation: 'File `config.json` của Backbase SDK định nghĩa các thông số môi trường cốt lõi: URL của máy chủ Backend/Edge, thông số kết nối Identity Server (Keycloak/OIDC realm, clientId), cấu hình phiên làm việc và các chính sách bảo mật đường truyền (SSL Pinning hashes/certificates, allowed domains).'
  },
  {
    id: 305,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'In the networking layer of an Android application using OkHttp, when a request to Digital Banking Services returns an **HTTP `401 Unauthorized`** status code due to an expired Access Token, which specialized OkHttp component is designed to automatically intercept this error, synchronously refresh the token (Refresh Token), and automatically retry the failed request?',
    options: [
      '`okhttp3.Dns`',
      '`okhttp3.Authenticator` (or the integrated Token Refresh Authenticator mechanism in the Backbase Auth Client)',
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
    question: 'When implementing an automatic Access Token refresh mechanism inside `okhttp3.Authenticator`, why is it mandatory to use a synchronization lock (e.g., `synchronized` or Kotlin `Mutex`) combined with checking whether the token in the failed request differs from the latest token currently stored in memory?',
    options: [
      'To make the phone vibrate every time a token is refreshed.',
      'To resolve **Concurrency / Race Condition** issues when the Dashboard screen fires 5 parallel requests simultaneously and all 5 receive a `401` error: only the first request entering the lock block actually calls the Refresh Token API on the server, while the subsequent 4 requests see that the token has already been refreshed, attach the new token to their headers, and retry immediately—avoiding 5 consecutive Refresh Token calls that would trigger Token Revocation on the Identity Server.',
      'To prevent the user from turning off the Wi-Fi connection.',
      'Because OkHttp is only permitted to run on devices with a single CPU core.'
    ],
    correctAnswers: [1],
    explanation: 'Identity Server (như Keycloak với cơ chế Refresh Token Rotation) thường vô hiệu hóa ngay lập tức Refresh Token cũ sau lần dùng đầu tiên. Nếu 5 request bị 401 cùng lúc và cả 5 đều bắn request Refresh Token không đồng bộ, 4 request sau sẽ gửi Refresh Token đã hết hiệu lực và khiến phiên đăng nhập bị cưỡng bức đăng xuất. Dùng `synchronized`/`Mutex` kèm kiểm tra đối chiếu token hiện tại là mẫu thiết kế bắt buộc.'
  },
  {
    id: 307,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'multi',
    question: 'To protect a banking application against Man-in-the-Middle (MitM) eavesdropping attacks and completely block unencrypted HTTP (Cleartext traffic) on Android, what must a developer configure in `res/xml/network_security_config.xml` and `AndroidManifest.xml`? (Select 2)',
    options: [
      'Set the attribute `cleartextTrafficPermitted="false"` in the `<base-config>` (or `<domain-config>`) tag and declare SHA-256 SPKI public key hashes inside the `<pin-set>` tag (including a backup pin) for the banking server domain.',
      'Reference the network security configuration file in the `<application android:networkSecurityConfig="@xml/network_security_config" ...>` tag within `AndroidManifest.xml`.',
      'Set `cleartextTrafficPermitted="true"` for all domains in the Production environment to increase data loading speed.',
      'Remove the `<uses-permission android:name="android.permission.INTERNET" />` permission from `AndroidManifest.xml`.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Chuẩn bảo mật OWASP MASVS cho ứng dụng ngân hàng yêu cầu chặn tuyệt đối Cleartext HTTP (`cleartextTrafficPermitted="false"`) và thiết lập **Certificate Pinning** (ghim mã băm SHA-256 của Subject Public Key Info - SPKI kèm tối thiểu 1 backup key pin) thông qua `network_security_config.xml` và cấu hình SSL Pinning của Backbase SDK.'
  },
  {
    id: 308,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'When configuring **Certificate Pinning** in `network_security_config.xml` or within the Backbase SDK security configuration, why does best practice always require pinning the **Public Key (SPKI - Subject Public Key Info)** hash along with at least one **Backup Key** or pinning at the **Intermediate CA** level, rather than pinning only the current Leaf Certificate?',
    options: [
      'Because the SPKI hash is shorter and therefore faster to type.',
      'To avoid a catastrophic "App Outage / Brick" scenario: when the server\'s Leaf certificate expires periodically and is renewed using the same key pair or rotated to a Backup Key / same Intermediate CA, existing app installations on customer devices continue connecting normally without forcing users into an emergency Play Store update.',
      'Because the Android operating system cannot read Leaf certificates.',
      'To allow proxy tools like Charles Proxy or Mitmproxy to freely decrypt traffic in Production builds.'
    ],
    correctAnswers: [1],
    explanation: 'Nếu chỉ pin cứng duy nhất Leaf Certificate và không có Backup Pin (hoặc pin SPKI của khóa công khai / Intermediate CA), ngay khoảnh khắc đội vận hành thay chứng chỉ mới trên Load Balancer/Gateway, 100% người dùng chưa kịp cập nhật ứng dụng mới trên Store sẽ bị lỗi `SSLPeerUnverifiedException` và không thể đăng nhập ngân hàng.'
  },
  {
    id: 309,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'During network debugging in `debug` / `staging` environments, how should a developer configure `HttpLoggingInterceptor` or traffic inspection tools (such as Chucker / Android Studio Network Inspector) to remain effective while ensuring security for the `release` build?',
    options: [
      'Always enable `HttpLoggingInterceptor.Level.BODY` in the Production `release` build as well to print all customer passwords and credit card numbers to the device\'s `Logcat`.',
      'Attach `HttpLoggingInterceptor` (or set verbose logging levels) only when `BuildConfig.DEBUG == true` (or declare it strictly via `debugImplementation` in the `src/debug/` source set), and use `redactHeader("Authorization")` and `redactHeader("Cookie")` to mask sensitive tokens.',
      'Post all customer network logs to a public forum.',
      'Completely disable network connectivity when compiling in Debug mode.'
    ],
    correctAnswers: [1],
    explanation: 'Việc để lọt `HttpLoggingInterceptor.Level.BODY` hoặc công cụ như Chucker lên bản Production (`release`) là một lỗ hổng bảo mật nghiêm trọng (vi phạm PCI-DSS / OWASP) vì bất kỳ tiến trình hoặc thiết bị kết nối ADB nào cũng có thể đọc trộm Token, PII và thông tin giao dịch trong Logcat. Chỉ được kích hoạt ở bản `debug` (sử dụng `debugImplementation` với `releaseImplementation` no-op) và luôn `redactHeader` nhạy cảm.'
  },
  {
    id: 310,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'To manage configurations across multiple bank deployment environments (e.g., `dev`, `sit`, `uat`, `prod`) that have different `serverURL`, `clientId`, and SSL Pinning certificates in a Backbase Android project, which Android Gradle Plugin (AGP) build mechanism is used most effectively?',
    options: [
      'Require developers to manually edit the `config.json` file every time before clicking the Build button.',
      'Use **Product Flavors** (combined with `flavorDimensions`) and place the corresponding `assets/backbase/config.json` and `res/xml/network_security_config.xml` files into separate source set directories: `src/dev/`, `src/uat/`, `src/prod/`.',
      'Create 4 completely separate Git repositories and copy-paste code back and forth every day.',
      'Compress all 4 APK files into a single `.zip` archive and rename the extension to `.apk`.'
    ],
    correctAnswers: [1],
    explanation: 'Hệ thống Source Sets của Android Gradle Plugin cho phép mỗi Product Flavor (`src/dev/assets/backbase/config.json`, `src/prod/assets/backbase/config.json`) tự động được đóng gói chính xác vào biến thể build tương ứng (`assembleDevDebug`, `assembleProdRelease`) mà không cần can thiệp thủ công, đảm bảo tính tự động hóa trên CI/CD.'
  },
  {
    id: 311,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'When enabling **R8 code shrinking and obfuscation (`isMinifyEnabled = true`)** for the `release` build of a Backbase-integrated application, what can happen if keep rules (`-keep` ProGuard/R8 rules) are missing for DTO models that rely on reflection or serialization?',
    options: [
      'The application will automatically switch to a black-and-white user interface.',
      'R8 will obfuscate field names into `a`, `b`, `c` or strip out constructors/fields that appear not to be called directly, causing JSON deserialization from API responses to result in all `null` values or throw runtime crashes (`NullPointerException` / `JsonDataException`) that occur only in Release builds.',
      'The compiler will automatically upgrade the Android OS version on the user\'s phone.',
      'There will be no impact whatsoever because R8 only deletes image files.'
    ],
    correctAnswers: [1],
    explanation: 'Các thư viện Backbase AAR thường đã đính kèm sẵn `consumer-rules.pro` tiêu chuẩn của chúng. Tuy nhiên, đối với các Custom DTOs hoặc các model tự định nghĩa trong dự án dùng với Gson/Moshi/Kotlinx Serialization/Retrofit, lập trình viên cần sử dụng codegen adapter (`@JsonClass(generateAdapter = true)` / `@Serializable`) hoặc khai báo `@Keep` / quy tắc `-keep` trong `proguard-rules.pro`, đồng thời luôn phải kiểm thử kỹ trên bản build bật R8 trước khi phát hành.'
  },
  {
    id: 312,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'multi',
    question: 'In the Dependency Injection setup (Hilt or Koin) within the `:app` module of a Backbase Android project, which core components are typically registered at the **Singleton scope (`@Singleton` / `single { ... }`)** to be shared across the entire application? (Select 3)',
    options: [
      'The `Backbase` SDK instance, `AuthClient`, and `SessionEmitter` managing global authentication session state.',
      'Root `OkHttpClient` instances and DBS `GenClients` instances (such as `ArrangementsApi`, `PaymentOrdersApi`, `NotificationsApi`).',
      'Local `RoomDatabase` instances and `SecureStorage` / `EncryptedStorage`.',
      'The partially typed text state of a specific amount input field on a temporary transfer screen.'
    ],
    correctAnswers: [0, 1, 2],
    explanation: 'Các thành phần hạ tầng tốn kém tài nguyên khởi tạo và giữ kết nối/trạng thái toàn cục như `Backbase` SDK instance, `OkHttpClient` (quản lý connection pool & thread pool), các API `GenClients`, `RoomDatabase` và `SecureStorage` đều phải được khởi tạo ở phạm vi `@Singleton` (`single` trong Koin). Ngược lại, trạng thái tạm thời của một màn hình phải gắn với phạm vi `ViewModel`.'
  },
  {
    id: 313,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'In Gradle\'s modern dependency management system (Gradle Version Catalogs - `gradle/libs.versions.toml`), what benefit does combining a Version Catalog with the Backbase BOM bring to a multi-module project structure?',
    options: [
      'It centralizes all library coordinate (`libraries`) and plugin (`plugins`) declarations into a single `libs.versions.toml` file with type-safe autocomplete accessors (such as `libs.backbase.accounts.journey`) across the `build.gradle.kts` files of all submodules.',
      'It completely eliminates the need for the `settings.gradle.kts` file.',
      'It allows writing Kotlin code directly inside the `.toml` file.',
      'It reduces the developer machine\'s RAM usage to 0 MB.'
    ],
    correctAnswers: [0],
    explanation: 'Gradle Version Catalog (`libs.versions.toml`) kết hợp với Backbase BOM là chuẩn thiết lập hiện đại nhất trong Modelbank: BOM giữ nhiệm vụ đồng bộ phiên bản của hệ sinh thái Backbase, còn `libs.versions.toml` cung cấp các bí danh type-safe (`libs.backbase.journey.accounts`) để mọi module trong dự án tham chiếu đồng nhất, sạch sẽ và dễ bảo trì.'
  },
  {
    id: 314,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'When initializing a `GenClient` (for example, `ProductSummaryApi` of the Arrangement Manager service) to connect with the Backbase API Gateway, according to which standard Backbase convention is the service context URI path typically configured?',
    options: [
      '`ftp://localhost:21/files`',
      '`${serverUrl}/api/arrangement-manager/...` (combining the Base URL from the Backbase SDK configuration with the standard service path of the corresponding DBS microservice through the SDK\'s `NetworkConnector`).',
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
    question: 'To protect sensitive data stored locally on an Android device (such as a Refresh Token, Biometric Key, or user identity data), which underlying Android hardware-backed mechanism is leveraged by `SecureStorage` in the Backbase SDK?',
    options: [
      'Storing data in plaintext inside the public `externalCacheDir` directory.',
      'Using the **Android Keystore System** (backed by hardware **TEE - Trusted Execution Environment** or **StrongBox Keymaster**) to generate and hold asymmetric/symmetric encryption keys (AES-GCM), ensuring cryptographic keys never leave the secure hardware chip even if the device is rooted.',
      'Encrypting data by reversing the order of characters in the string (Reverse String).',
      'Saving data into the device\'s Bluetooth connection name.'
    ],
    correctAnswers: [1],
    explanation: 'Backbase `SecureStorage` (và `EncryptedSharedPreferences`) dựa trên **Android Keystore System**. Khóa chủ (Master Key) được tạo và lưu giữ bên trong phần cứng bảo mật cách ly (TEE / StrongBox). Mọi dữ liệu nhạy cảm đều được mã hóa bằng AES-256 trước khi ghi xuống đĩa, đảm bảo an toàn cao nhất theo tiêu chuẩn ngân hàng.'
  },
  {
    id: 316,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'When listening for global authentication session state changes (e.g., session expiration `SESSION_ENDED` or a complete Refresh Token failure that requires returning the user to the Login screen and wiping sensitive in-memory data), where should a Backbase-integrated Android application handle this?',
    options: [
      'Force the user to manually power off and restart their phone when they see a blank white screen.',
      'Register a `SessionStateListener` / collect the event stream from `SessionEmitter` at the global level (e.g., inside `MainActivity` or `AppNavigationViewModel`), so that upon receiving a session-ended/invalid signal, the app immediately clears the navigation back stack and safely redirects to the `AuthenticationJourney`.',
      'Check the login status by making a phone call to the customer service call center.',
      'Write manual session-check code repeatedly inside every `TextView` of the application.'
    ],
    correctAnswers: [1],
    explanation: 'Backbase Core/Auth SDK cung cấp cơ chế phát tín hiệu trạng thái phiên (`SessionEmitter` / `SessionStateListener`). Việc lắng nghe tập trung ở tầng Host Application (`MainActivity` / Root Navigation) giúp ứng dụng phản ứng tức thời khi phiên hết hạn (do idle timeout hoặc token bị thu hồi từ xa), tự động dọn dẹp state và điều hướng người dùng về màn hình xác thực.'
  },
  {
    id: 317,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'To download Backbase SDK library artifacts from the private repository (Backbase Artifactory), where is the MOST SECURE place for a developer to configure authentication credentials?',
    options: [
      'Hardcode the username and password directly into the project\'s `build.gradle.kts` file and commit it to Git.',
      'Store them in the `~/.gradle/gradle.properties` file on the local machine or in Environment Variables on the CI/CD system.',
      'Place the login credentials inside the `AndroidManifest.xml` file.',
      'Write them in the source repository\'s `README.md` file.'
    ],
    correctAnswers: [1],
    explanation: 'Không bao giờ lưu credentials trên Repository code. Việc đặt trong ~/.gradle/gradle.properties (nằm ngoài folder git) giúp bảo mật tài khoản cá nhân và hệ thống CI/CD.'
  },
  {
    id: 318,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'What role does the Backbase BOM (Bill of Materials) play in the Gradle configuration file?',
    options: [
      'It automatically compresses the APK file size after building.',
      'It ensures all declared Backbase SDK libraries are aligned to a single mutually compatible version set, avoiding version conflicts.',
      'It automatically generates Jetpack Compose UI code.',
      'It replaces JDK 17.'
    ],
    correctAnswers: [1],
    explanation: 'Backbase BOM quản lý dependency phiên bản tập trung. Người dùng khai báo BOM platform và các dependency con không cần ghi rõ version, tránh lỗi không tương thích giữa các Journey.'
  },
  {
    id: 319,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Which of the following Gradle (KTS) syntaxes accurately applies the Backbase BOM?',
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
    question: 'Which of the following pieces of information MUST be provided in the `backbase-integrator-config.json` configuration file or passed into `Backbase.initialize()`? (Select 2)',
    options: [
      'Server Base URL (API Gateway address).',
      'A list of names of all developers participating in the project.',
      'Security parameters / Authentication Client ID configuration.',
      'The office Wi-Fi password.'
    ],
    correctAnswers: [0, 2],
    explanation: 'Core SDK cần thông tin Gateway Endpoint (Server Base URL) và OAuth/OIDC Client ID/Security config để khởi tạo kết nối mạng và quản lý xác thực.'
  },
  {
    id: 321,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'When a project encounters a Gradle compilation error due to a version conflict of the `kotlinx-coroutines-core` library between the Backbase SDK and a third-party library, what is the standard way to resolve it?',
    options: [
      'Remove the Backbase SDK from the project.',
      'Bypass error checking by setting `android.lintOptions.abortOnError = false`.',
      'Use `configurations.all { resolutionStrategy { force(...) } }` or align the library version to the standard version supported by the Backbase BOM.',
      'Disable Kotlin Coroutines.'
    ],
    correctAnswers: [2],
    explanation: 'Sử dụng resolutionStrategy hoặc dependency alignment giúp ép buộc Gradle chọn phiên bản tương thích an toàn mà không phá vỡ cấu trúc SDK.'
  },
  {
    id: 322,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'What is the minimum recommended JDK version required to compile modern Backbase Android projects (using Android Gradle Plugin 8.x+)?',
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
    question: 'What is the purpose of declaring `maven { url = uri("https://repo.backbase.com/repo/maven-releases") }` in `settings.gradle.kts`?',
    options: [
      'To download Google Play Services plugins.',
      'To declare the repository server hosting official library packages (Artifacts) published by Backbase.',
      'To declare the Git source code repository URL.',
      'To download the Firebase configuration file.'
    ],
    correctAnswers: [1],
    explanation: 'Các thư viện SDK của Backbase được lưu trữ trên server Maven riêng biệt của Backbase (repo.backbase.com). Cấu hình này giúp Gradle tìm và tải các file .aar/.jar về.'
  },
  {
    id: 324,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Which class in an Android app is the most appropriate place to invoke the `Backbase.initialize(...)` initialization method?',
    options: [
      'MainActivity.onCreate()',
      'The class extending Application (App.onCreate())',
      'SplashFragment.onViewCreated()',
      'Inside a WorkManager Worker.'
    ],
    correctAnswers: [1],
    explanation: 'Application.onCreate() chạy đầu tiên khi tiến trình (process) ứng dụng được tạo, đảm bảo Core SDK được khởi tạo xong trước khi bất kỳ Activity/Fragment nào được render.'
  },
  {
    id: 325,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'multi',
    question: 'Which of the following files MUST NOT be committed to a shared or public Git repository for security reasons? (Select 2)',
    options: [
      '`gradle.properties` containing personal Artifactory authentication tokens.',
      'The root module\'s `build.gradle.kts` file.',
      'The application signing key file (`keystore.jks` / `release.keystore`).',
      'The `proguard-rules.pro` file.'
    ],
    correctAnswers: [0, 2],
    explanation: 'Secret Token/Credentials và File KeyStore ký App là các thông tin nhạy cảm bảo mật cao nhất, tuyệt đối không được commit lên VCS.'
  },
  {
    id: 326,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'How does the "Gradle Build Cache" feature benefit the Backbase mobile application development process?',
    options: [
      'It automatically checks for spelling errors in the source code.',
      'It reuses compilation outputs from previous tasks (when inputs have not changed), significantly reducing app build times.',
      'It encrypts the entire APK file.',
      'It reduces the amount of RAM consumed by Android Studio.'
    ],
    correctAnswers: [1],
    explanation: 'Với các dự án lớn đa module như Backbase, Build Cache giúp tránh biên dịch lại các module không đổi, tăng tốc độ phát triển.'
  },
  {
    id: 327,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Which block in `settings.gradle.kts` centrally manages all dependency repositories for the project?',
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
    question: 'What problem does the Backbase BOM (Bill of Materials) thoroughly solve?',
    options: [
      'Missing camera permission errors.',
      'Version conflicts (Version Mismatch) between Backbase SDK libraries and Journeys.',
      'Automatic in-app language translation.',
      'Reducing font sizes on small screens.'
    ],
    correctAnswers: [1],
    explanation: 'BOM đồng bộ và khóa tất cả các thư viện Backbase về phiên bản tương thích kiểm thử chuẩn.'
  },
  {
    id: 329,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'multi',
    question: 'Under which circumstances will an HTTP request receiving a `401 Unauthorized` error trigger the OkHttp `Authenticator`? (Select 2)',
    options: [
      'When the Access Token has expired during an API call.',
      'When the Server requires issuing a new token (via Refresh Token) to continue the session.',
      'When the device completely loses Wi-Fi/4G connectivity.',
      'When the Server returns a `500 Internal Server Error`.'
    ],
    correctAnswers: [0, 1],
    explanation: 'OkHttp Authenticator được thiết kế đặc thù để tự động xử lý khi nhận mã HTTP 401 từ server.'
  },
  {
    id: 330,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'To ensure absolute security for Artifactory credentials in a CI/CD environment, what should be done?',
    options: [
      'Commit the username and password directly into the `build.gradle.kts` file.',
      'Use secret environment variables (CI/CD Masked/Secret Variables) on the build server.',
      'Write the login credentials into the `README.md` file.',
      'Print the username and password to the console output during the build.'
    ],
    correctAnswers: [1],
    explanation: 'Dùng CI/CD Secret Variables đảm bảo không lộ credentials trong mã nguồn và log build.'
  },
  {
    id: 331,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'What type of attack is Certificate Pinning in Android designed to prevent?',
    options: [
      'SQL Injection.',
      'Man-In-The-Middle (MITM) attacks using forged or unauthorized SSL/TLS certificates.',
      'Distributed Denial of Service (DDoS) attacks.',
      'Password Brute Force attacks.'
    ],
    correctAnswers: [1],
    explanation: 'Certificate Pinning đảm bảo client chỉ chấp nhận kết nối với server có public key/certificate được ghim sẵn.'
  },
  {
    id: 332,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'Which tag in `network_security_config.xml` allows configuring custom trusted certificates specifically for debug builds?',
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
    question: 'When building a release APK/AAB, for what purpose does R8/ProGuard use the `consumer-rules.pro` file bundled inside SDK libraries?',
    options: [
      'To automatically delete unused Journeys.',
      'To keep (`-keep`) essential DTO classes and DI interfaces from being obfuscated/renamed, preventing runtime JSON parsing errors.',
      'To convert bytecode into C++.',
      'To increase the JVM heap memory size.'
    ],
    correctAnswers: [1],
    explanation: 'consumer-rules.pro bảo vệ các DTOs và reflection interface không bị obfuscation làm hỏng.'
  },
  {
    id: 334,
    section: 'setup',
    sectionName: 'Section 3: Setup Development Environment',
    type: 'single',
    question: 'To attach a custom `X-Device-Id` header to every API request sent to the server, which component should a developer use?',
    options: [
      'An OkHttp `Interceptor` registered with the Core SDK\'s `NetworkEngine` via DI.',
      'A loop that resends requests inside the `Activity`.',
      'Hardware modification of the Wi-Fi router.',
      'Modifying the operating system\'s `hosts` file.'
    ],
    correctAnswers: [0],
    explanation: 'OkHttp Interceptor là cơ chế chuẩn để chặn và gắn header toàn cục cho mọi request.'
  }
]
