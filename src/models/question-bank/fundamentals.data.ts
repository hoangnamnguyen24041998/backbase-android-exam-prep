import type { Question } from '../exam.types'

/**
 * Section 1: Backbase Fundamentals
 * Quota in Exam: 13 questions
 * Pool Size: 44 questions
 */
export const fundamentalsQuestions: Question[] = [
  {
    id: 101,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'In the product development philosophy on the Backbase Engagement Banking Platform (EBP), what does the core principle "Adopt before Adapt" mean for the Android development team?',
    options: [
      'Always rewrite the entire UI and business logic from scratch using Jetpack Compose while sharing the Backbase OpenAPI specification.',
      'Maximize the use of Modelbank Journeys and Out-of-the-Box (OOTB) capabilities through configuration and theming; only deeply customize (Extend) or build from scratch (Build) when there are truly unique business requirements.',
      'Clone the source code of Backbase Journeys into the bank\'s internal repository to freely modify the Kotlin files directly inside.',
      'Only use the Backbase Networking SDK layer and rebuild the entire screen architecture to avoid depending on the vendor\'s upgrade cycle.'
    ],
    correctAnswers: [1],
    explanation: 'Triết lý "Adopt before Adapt" khuyến nghị ngân hàng tận dụng tối đa 80% tính năng Out-of-the-Box (OOTB) sẵn có thông qua cấu hình (Configuration), Feature Flags và Mobile Design System (Theming) để rút ngắn Time-to-Market và đảm bảo khả năng nâng cấp (upgradeability) mượt mà khi Backbase ra phiên bản mới. Chỉ 20% phần tạo lợi thế cạnh tranh đặc thù mới nên Extend hoặc Build.'
  },
  {
    id: 102,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'The standard implementation process "Backbase Way of Working" consists of four main phases occurring in which of the following orders?',
    options: [
      'Design -> Code -> Test -> Release',
      'Discover -> Adopt -> Extend -> Deploy & Run',
      'Analyze -> Customize -> Fork -> Maintain',
      'Plan -> Build from Scratch -> Integrate -> Operate'
    ],
    correctAnswers: [1],
    explanation: 'Backbase Way of Working được thiết kế xoay quanh việc tối ưu hóa giá trị từ nền tảng OOTB theo 4 bước chuẩn: Discover (khám phá và đối chiếu yêu cầu với năng lực OOTB) -> Adopt (áp dụng cấu hình và branding) -> Extend (mở rộng các điểm chạm nghiệp vụ đặc thù thông qua Extension points) -> Deploy & Run (vận hành và nâng cấp liên tục).'
  },
  {
    id: 103,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'multi',
    question: 'Which of the following components belong to the overall architectural layers of the Backbase Engagement Banking Platform (EBP)? (Select 3)',
    options: [
      'Experience Layer (Web & Mobile Journeys, Retail/Business/Wealth Banking Apps)',
      'Digital Banking Services / Banking Business Services (DBS / BBS - banking business microservices such as Accounts, Payments, Cards)',
      'Integration Services / Grand Central (data connectivity and orchestration with Core Banking and third-party providers)',
      'A traditional Core Banking relational database management system that completely replaces the bank\'s AS400/Mainframe system'
    ],
    correctAnswers: [0, 1, 2],
    explanation: 'Kiến trúc Backbase EBP đứng phía trên hệ thống Core Banking (System of Record) chứ không thay thế Core Banking. Nó bao gồm: 1) Integration Layer (Grand Central / Integration Services) để giao tiếp với Core Banking; 2) Capability Layer (Digital Banking Services - DBS/BBS & Identity/Access Control); và 3) Experience Layer (Mobile Android/iOS Journeys & Web Widgets).'
  },
  {
    id: 104,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'In Backbase Mobile architectural terminology, how is a "Journey" (e.g., Accounts & Transactions Journey, Cards Management Journey) most accurately defined?',
    options: [
      'A single UI Component such as a Button or a TextField styled according to the bank\'s brand.',
      'A self-contained library module that encapsulates a complete end-to-end business user flow, including UI Screens, ViewModels, UseCase interfaces, and internal Navigation.',
      'A collection of static JSON configuration files containing backend server URL lists.',
      'A standalone Android APK application installed separately on the user\'s device for each banking feature.'
    ],
    correctAnswers: [1],
    explanation: 'Trong Backbase Mobile Architecture, một Journey là một module tính năng độc lập (Feature Module) giải quyết một luồng nghiệp vụ hoàn chỉnh của người dùng (ví dụ: Xem danh sách tài khoản và chi tiết giao dịch, hoặc Quản lý thẻ). Một Journey bao gồm Presentation layer (Screens, ViewModels), Domain contract (UseCase interfaces) và Navigation graph nội bộ của riêng luồng đó.'
  },
  {
    id: 105,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Why does Backbase strictly advise AGAINST decompiling or directly modifying the source code inside Backbase Journey AAR libraries (Forking)?',
    options: [
      'Because the Kotlin compiler will immediately throw a syntax error if code is copied from an AAR.',
      'Because forking completely breaks the ability to automatically receive security patches, bug fixes, and new features from Backbase (Zero Upgradeability), turning the project into a massive maintenance burden.',
      'Because the Android operating system does not allow packaging classes with duplicate package names.',
      'Because the Backbase SDK will automatically wipe virtual machine data if it detects that an AAR file has been extracted.'
    ],
    correctAnswers: [1],
    explanation: 'Khi một dự án thực hiện Forking (sao chép code OOTB ra ngoài để sửa trực tiếp), nhánh code đó sẽ bị tách rời khỏi lộ trình phát triển chính thức của Backbase. Mỗi khi Backbase tung ra bản cập nhật bảo mật hoặc nâng cấp phiên bản lớn, đội dự án sẽ phải merge thủ công hàng nghìn dòng code, gây rủi ro lỗi nghiêm trọng và tốn kém chi phí.'
  },
  {
    id: 106,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'multi',
    question: 'Which of the following technical benefits does the "White-labeling" capability in the Backbase Mobile SDK allow a financial group to achieve from a single shared Android codebase? (Select 2)',
    options: [
      'Build multiple applications for different sub-brands or segments (e.g., Retail Banking, Business Banking, or member banks across multiple countries) using Gradle Product Flavors.',
      'Change the entire brand identity (Colors, Typography, Corner Radius, Iconography, Logos) and feature configuration (Configuration/Feature Flags) for each build variant without modifying Journey logic.',
      'Run iOS Swift source code directly inside the Android Dalvik/ART virtual machine.',
      'Automatically convert the programming language from Kotlin to Flutter when publishing the application.'
    ],
    correctAnswers: [0, 1],
    explanation: 'White-labeling trong Backbase kết hợp sức mạnh của Android Gradle Product Flavors, Mobile Design System (MDS Tokens) và Journey Configuration. Nhờ đó, từ một codebase chung, ngân hàng có thể xuất bản nhiều app cho nhiều thương hiệu/quốc gia khác nhau với giao diện và tập tính năng bật/tắt hoàn toàn riêng biệt.'
  },
  {
    id: 107,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'In the Backbase ecosystem, what role do "Digital Banking Services" (DBS - formerly commonly referred to as BBS) play for an Android Mobile application?',
    options: [
      'Provide pre-rendered UI Fragments in HTML format sent to the mobile device.',
      'Provide standardized RESTful APIs (following OpenAPI specifications) representing banking business capabilities (Accounts, Payments, Contacts, Notifications, Messages, etc.) along with access control mechanisms (Entitlements).',
      'Serve as a cloud-based Kotlin compiler tool replacing Android Studio.',
      'Serve as a library for managing Lottie animations on mobile devices.'
    ],
    correctAnswers: [1],
    explanation: 'Digital Banking Services (DBS) là tập hợp các microservices cốt lõi ở tầng Capability của Backbase. Chúng cung cấp các API chuẩn OpenAPI để ứng dụng Mobile giao tiếp thông qua các thư viện GenClient (như Accounts GenClient, Arrangements GenClient, Payment Orders GenClient...).'
  },
  {
    id: 108,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'When analyzing customer requirements during the "Discover" phase, if a business requirement only differs slightly in visual layout from an OOTB Journey without providing core business value, what should a Backbase technical consultant do?',
    options: [
      'Agree to rewrite the entire screen from scratch (Build from scratch) to please the client.',
      'Constructively challenge the requirement by demonstrating the benefits in Total Cost of Ownership (TCO), Time-to-Market, and upgradeability when staying close to the standard OOTB design (Adopt).',
      'Ask the Backend team to modify the database table schemas inside the Core Banking system.',
      'Disable that entire feature from the mobile application.'
    ],
    correctAnswers: [1],
    explanation: 'Một phần quan trọng của Backbase Way of Working trong giai đoạn Discover là hướng dẫn khách hàng bám sát chuẩn OOTB ("Stay close to standard"). Nếu sự khác biệt UI không tạo ra giá trị kinh doanh vượt trội, việc thuyết phục khách hàng Adopt OOTB sẽ giúp giảm mạnh tổng chi phí sở hữu (Total Cost of Ownership - TCO) và rủi ro bảo trì.'
  },
  {
    id: 109,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'What is the concept of "Modelbank" in the Backbase platform?',
    options: [
      'An actual commercial bank headquartered in Amsterdam specializing in mortgage loans.',
      'A complete reference banking application (Reference Implementation) pre-assembled from OOTB Journeys, Design System, and best-practice sample configurations for each segment (Retail, SME, Wealth), serving as an accelerator starting point for every project.',
      'A machine learning simulation toolkit used for credit scoring.',
      'A spell-checking plugin inside Android Studio.'
    ],
    correctAnswers: [1],
    explanation: 'Modelbank là ứng dụng mẫu chuẩn mực do Backbase xây dựng sẵn, tích hợp đầy đủ các Journeys, UseCases, Navigation và Design System theo đúng best practices cho từng phân khúc (Retail, Business/SME, Wealth). Các dự án thực tế sẽ khởi tạo từ Modelbank để có ngay một ứng dụng chạy được từ ngày đầu tiên.'
  },
  {
    id: 110,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'multi',
    question: 'In the security and authorization architecture of Backbase EBP, what roles does the Identity & Access Control (Entitlements) service fulfill for the Mobile application? (Select 2)',
    options: [
      'User Authentication based on OAuth2 / OpenID Connect (OIDC) standards integrated with Keycloak/Identity Server.',
      'Fine-grained Authorization (Entitlements) based on Legal Entity, Service Agreement, Job Role, and Function Groups to determine which data users are allowed to view or which actions they can perform in the app.',
      'Automatically compressing PNG image file sizes inside the res/drawable folder of the Android project.',
      'Completely replacing the Garbage Collector memory management system of the Android virtual machine.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Backbase Identity (xây dựng trên nền tảng mở rộng của Keycloak/OIDC) quản lý xác thực (Authentication, FIDO2/Biometrics) và Access Control (Entitlements) quản lý phân quyền chi tiết (Service Agreement, Data Groups, Function Groups). Trên Mobile, các Journey có thể ẩn/hiện hoặc khóa tính năng dựa trên quyền (Entitlements) của user hiện tại.'
  },
  {
    id: 111,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'What is the core difference between "Adopting" a Journey and "Extending" a Journey in a Backbase Android project?',
    options: [
      'Adopt requires rewriting the entire UseCase, whereas Extend only changes colors in XML files.',
      'Adopt involves configuring parameters, toggling feature flags, and applying brand identity (MDS Theme) without altering behavior or business flows; whereas Extend uses official hooks/extension points (Custom UseCase, Decorator, Screen Factory, Slot API) to intervene deeper into data or screens.',
      'Adopt only applies to iOS applications, whereas Extend only applies to Android applications.',
      'There is no difference; these two terms are completely synonymous in Backbase documentation.'
    ],
    correctAnswers: [1],
    explanation: 'Trong thang độ tùy biến của Backbase: Adopt = dùng nguyên bản OOTB + truyền Configuration object + áp dụng Theme/Tokens. Extend = giữ khung Journey OOTB nhưng can thiệp có kiểm soát thông qua các cơ chế mở rộng chính thức (như bọc Decorator quanh UseCase, truyền Custom Screen Factory hoặc chèn View vào Slot).'
  },
  {
    id: 112,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'When should the Android development team choose the "Build" approach (building a brand-new Journey from scratch) instead of "Adopt" or "Extend"?',
    options: [
      'When the bank wants to change the primary button color from blue to red.',
      'When the bank wants to hide an unnecessary information field on the transaction details screen where the Configuration already supports a visibility toggle flag.',
      'When the bank implements a completely new localized business flow (e.g., integrating a national digital identity wallet or purchasing domestic lottery tickets) for which Backbase has no corresponding OOTB Journey.',
      'When a new developer joining the project has not yet read the Configuration documentation of the OOTB Journey.'
    ],
    correctAnswers: [2],
    explanation: 'Phương án "Build" chỉ được sử dụng cho các luồng nghiệp vụ hoàn toàn mới (Greenfield features) không tồn tại trong danh mục OOTB Journeys của Backbase. Khi tự Build một Journey mới, đội ngũ vẫn phải tuân thủ nghiêm ngặt chuẩn kiến trúc của Backbase (Clean Architecture, MDS Components, Router/UseCase tách rời) để đồng nhất với toàn hệ thống.'
  },
  {
    id: 113,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'In the Backbase platform, which of the following architectural challenges does the "Grand Central" (Integration Platform) layer solve?',
    options: [
      'Acts as a standardized Integration Hub & Connectors layer that connects Backbase Digital Banking Services with multiple Core Banking systems, Card Management Systems (CMS), and external payment gateways without impacting the Mobile application.',
      'Serves as a library managing navigation between Fragments inside the Android application.',
      'Serves as a graphical UI design tool replacing Figma.',
      'Serves as a push notification delivery service replacing Firebase Cloud Messaging on devices.'
    ],
    correctAnswers: [0],
    explanation: 'Grand Central là nền tảng Integration-Platform-as-a-Service (iPaaS) của Backbase, cung cấp các pre-built connectors để kết nối các dịch vụ DBS với hệ thống lõi của ngân hàng (Core Banking như Temenos, Mambu, Finastra...). Nhờ sự tách biệt này, ứng dụng Android chỉ cần làm việc với chuẩn dữ liệu thống nhất của DBS.'
  },
  {
    id: 114,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'multi',
    question: 'Which of the following components are provided out-of-the-box by Backbase\'s "Mobile SDK / Core Foundations" layer on Android? (Select 3)',
    options: [
      'Mobile Design System (MDS) providing a system of Design Tokens and banking-grade UI Components.',
      'Backbase Core & Networking SDK supporting session management, transport security (SSL Pinning), automatic token attachment, and secure storage (Encrypted Storage).',
      'GenClients (OpenAPI generated clients) pre-packaging network calls to individual DBS services.',
      'Hardware Kernel Drivers to directly manipulate the phone\'s 5G baseband radio signals.'
    ],
    correctAnswers: [0, 1, 2],
    explanation: 'Tầng nền tảng Mobile của Backbase cung cấp 3 trụ cột chính cho các Journey hoạt động: 1) Core SDK (Networking, Auth, Secure Storage, Logging); 2) GenClients (các thư viện client sinh tự động từ OpenAPI spec của DBS); và 3) Mobile Design System (MDS) cho giao diện đồng nhất.'
  },
  {
    id: 115,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'What does the ideal effort allocation ratio recommended by Backbase under the "80/20" rule in project delivery mean?',
    options: [
      '80% of the budget is spent on writing documentation and 20% on coding.',
      'Leverage approximately 80% of the platform\'s existing capabilities (OOTB Adoption & Configuration) so that 20% of engineering resources can focus on extending/building features that create competitive differentiation in the market (Differentiation).',
      '80% of the source code is written in Java and 20% is written in Kotlin.',
      'Only test 20% of the screens and skip the remaining 80%.'
    ],
    correctAnswers: [1],
    explanation: 'Quy tắc 80/20 trong Backbase nhấn mạnh việc không "phát minh lại chiếc bánh xe" cho các tính năng ngân hàng tiêu chuẩn (đăng nhập, xem số dư, sao kê, chuyển tiền cơ bản - chiếm 80%), từ đó giải phóng nguồn lực kỹ thuật để dồn sức vào 20% các tính năng sáng tạo mang đậm bản sắc riêng của ngân hàng.'
  },
  {
    id: 116,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'In Backbase product architecture, how does an "App" (e.g., Retail Banking App) differ from a "Journey"?',
    options: [
      'An App contains only a single screen, whereas a Journey contains multiple screens.',
      'The App is the top-level assembly shell (Host Application / Shell Module) responsible for initializing the SDK, configuring Dependency Injection (Hilt/Koin), defining inter-Journey navigation flows (App-level Navigation), and applying the global Theme.',
      'An App is not allowed to contain an AndroidManifest.xml file; only a Journey has an AndroidManifest.xml.',
      'A Journey is the executable file installed on the user\'s device, while the App is merely an auxiliary library.'
    ],
    correctAnswers: [1],
    explanation: 'Application module (`:app`) đóng vai trò là chất keo kết dính (Orchestrator / Host). Nó không chứa chi tiết nghiệp vụ của từng tính năng mà chịu trách nhiệm khởi tạo `Backbase.initialize()`, nạp cấu hình DI kết nối các `UseCase` implementation với các `Journey`, và điều phối chuyển hướng giữa Journey A sang Journey B thông qua các Router implementations.'
  },
  {
    id: 117,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'What is the greatest benefit of Backbase strictly decoupling the Journey UI from the data-fetching implementation (UseCase implementation / GenClient)?',
    options: [
      'It forces the application to maintain a continuous network connection just to open the settings screen.',
      'It allows the bank to keep the entire UI and screen flows of an OOTB Journey intact while easily swapping out the data source (e.g., calling a different internal bank API or aggregating data from two microservices) by providing a Custom UseCase implementation.',
      'It increases the APK file size fivefold to make it look more professional.',
      'It prevents writing Unit Tests for the Presentation layer.'
    ],
    correctAnswers: [1],
    explanation: 'Nhờ kiến trúc phụ thuộc vào Interface (UseCase contract), Journey hoàn toàn không biết dữ liệu đến từ đâu. Ngân hàng có thể dùng OOTB UseCase (gọi chuẩn DBS thông qua GenClient) hoặc tự viết một Custom UseCase gọi tới API riêng của ngân hàng mà không cần đụng chạm tới một dòng code UI nào của Journey.'
  },
  {
    id: 118,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'When Backbase releases a new Minor or Patch version for a Journey following Semantic Versioning (e.g., upgrading from `5.2.0` to `5.2.3`), what is guaranteed?',
    options: [
      'All configuration class names will be randomly renamed.',
      'Bug fixes and security patches are delivered without introducing backward-incompatible changes (No Breaking API Changes) to the application\'s existing configuration.',
      'The application must rewrite its entire Dependency Injection layer from Koin to Dagger 1.',
      'The local database on the user\'s device will be wiped clean without confirmation.'
    ],
    correctAnswers: [1],
    explanation: 'Backbase tuân thủ chặt chẽ Semantic Versioning (`MAJOR.MINOR.PATCH`). Các bản cập nhật `PATCH` (và `MINOR` tương thích ngược) đảm bảo các public APIs, Configuration DSL và UseCase interfaces không bị phá vỡ, giúp các ngân hàng tuân thủ triết lý Adopt có thể nâng cấp thư viện dễ dàng thông qua việc nâng version của Backbase BOM.'
  },
  {
    id: 119,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'multi',
    question: 'Which of the following statements accurately describe the role of a "GenClient" in the Backbase Android ecosystem? (Select 2)',
    options: [
      'They are Kotlin/Java client libraries auto-generated from the OpenAPI (Swagger) specifications of the Digital Banking Services (DBS).',
      'They provide asynchronous network call methods (supporting Kotlin Coroutines `suspend` functions or Callbacks) and Data Models (DTOs) that accurately reflect the backend API contract.',
      'They are tools that automatically generate Jetpack Compose UI from screenshot images.',
      'They directly contain `Fragment` and `RecyclerView.Adapter` objects to display account lists.'
    ],
    correctAnswers: [0, 1],
    explanation: 'GenClients nằm ở tầng Data, được sinh tự động từ OpenAPI spec của từng dịch vụ DBS (ví dụ: `client-accounts`, `client-arrangement-manager`, `client-payment-order`). Chúng cung cấp các API class và DTO models để tầng UseCase implementation gọi xuống mạng một cách an toàn kiểu dữ liệu (type-safe).'
  },
  {
    id: 120,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'If a bank wants to change a text copy (copywriting) or add a Vietnamese language translation for an OOTB Journey on Android, what is the standard method following the "Adopt" principle?',
    options: [
      'Use a hex editor tool to directly modify the `classes.dex` file after building the APK.',
      'Override the corresponding string resource keys (`<string name="...">`) of the Journey directly inside the `res/values/strings.xml` or `res/values-vi/strings.xml` file of the application module (or via `DeferredText` in the Configuration).',
      'Write a background `AccessibilityService` to read the screen and draw Vietnamese text on top of it.',
      'Require users to install an external dictionary application.'
    ],
    correctAnswers: [1],
    explanation: 'Hệ thống Android Resource Merging và cơ chế `DeferredText` của Backbase cho phép ứng dụng dễ dàng ghi đè bất kỳ chuỗi văn bản nào của Journey bằng cách khai báo lại `<string name="bb_...">` trong thư mục `res/values-<locale>/strings.xml` của module `:app` hoặc truyền qua đối tượng Configuration mà không cần sửa code Journey.'
  },
  {
    id: 121,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Why does Backbase separate the Journey module (e.g., `accounts-and-transactions-journey`) and the default UseCase implementation module (e.g., `accounts-and-transactions-use-case` / `arrangements-use-case`) into independent artifacts?',
    options: [
      'Due to a Gradle limitation that prevents a module from containing more than 10 Kotlin files.',
      'To apply the Dependency Inversion Principle: the Journey only defines UseCase interfaces, while the UseCase module contains the implementation calling the DBS GenClient. If a bank writes a completely new Custom UseCase, they do not even need to include the default UseCase artifact in the APK.',
      'To force developers to declare twice as many lines in the `settings.gradle.kts` file.',
      'Because the Journey module is written in C++ while the UseCase module is written in Python.'
    ],
    correctAnswers: [1],
    explanation: 'Việc tách artifact `*-journey` (chứa UI + ViewModel + UseCase Interfaces) khỏi artifact `*-use-case` (chứa Default UseCase Implementation kết nối với DBS GenClient) giúp giảm sự phụ thuộc cứng. Ngân hàng có thể dùng bộ đôi này OOTB, hoặc giữ `*-journey` và thay thế hoàn toàn `*-use-case` bằng module tích hợp dữ liệu riêng của mình.'
  },
  {
    id: 122,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'What end-user experience does the concept of "Entitlements-driven UI" in Backbase Mobile Journeys provide?',
    options: [
      'The application UI automatically adjusts screen brightness based on remaining battery capacity.',
      'Action buttons, navigation tabs, or transaction limits on the Journey screen are automatically shown, hidden, or disabled based on the list of permissions (User Permissions / Function Groups) returned by the backend for that logged-in account.',
      'Every free user is granted the highest administrator privileges on the system.',
      'The application automatically loads additional advertisements if the user has a low account balance.'
    ],
    correctAnswers: [1],
    explanation: 'Trong ngân hàng (đặc biệt là SME/Business Banking hoặc phân quyền hộ gia đình), mỗi người dùng có quyền hạn khác nhau (ví dụ: người chỉ có quyền Xem sao kê, người có quyền Tạo lệnh chuyển tiền, người có quyền Phê duyệt). Các Backbase Journey hỗ trợ kiểm tra Entitlements để tự động điều chỉnh trạng thái hiển thị của các hành động trên UI.'
  },
  {
    id: 123,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'In what priority order does the Backbase mobile development philosophy (Adopt, Extend, Build) recommend selecting a solution for a new business requirement?',
    options: [
      'Build from scratch -> Extend -> Adopt.',
      'Adopt (Use OOTB) -> Extend (Enhance existing features) -> Build (Create brand-new features from scratch).',
      'Extend -> Build -> Adopt.',
      'Create a parallel module and rewrite the entire UI.'
    ],
    correctAnswers: [1],
    explanation: 'Triết lý chuẩn của Backbase là Adopt (tận dụng tối đa các Out-Of-The-Box Journeys và configurations), nếu không đáp ứng đủ mới tiến hành Extend (mở rộng UI/Logic của Journey), và cuối cùng mới Build mới khi nghiệp vụ hoàn toàn riêng biệt.'
  },
  {
    id: 124,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'What is the core benefit of the Widget/Journey-based architecture in the Backbase Android SDK?',
    options: [
      'Allows all Journeys to directly access each other\'s databases.',
      'Increases compilation speed by bypassing type checking.',
      'Decouples business features into independent, reusable, easily upgradeable, and extensible modules (Modularization).',
      'Automatically converts Kotlin source code into Swift for iOS.'
    ],
    correctAnswers: [2],
    explanation: 'Kiến trúc Journeys/Widgets giúp đóng gói độc lập từng tính năng kinh doanh (như Accounts, Transfers, Cards). Điều này giảm tính phụ thuộc chặt chẽ (tight-coupling), hỗ trợ phát triển song song và nâng cấp phiên bản SDK dễ dàng.'
  },
  {
    id: 125,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'multi',
    question: 'Which of the following principles MUST be strictly followed when integrating an OOTB Backbase Journey into an Integrator application? (Select 2)',
    options: [
      'Directly modify the class files inside the SDK .aar archive to add features.',
      'Do not modify existing SDK source code; logic customization must be performed via Override/Decorator mechanisms or Configuration.',
      'Lock and align Journey versions using the Backbase Bill of Materials (BOM).',
      'Copy the entire source code of the Journey from the library into the app directory for easier management.'
    ],
    correctAnswers: [1, 2],
    explanation: 'Tuyệt đối không can thiệp trực tiếp vào mã nguồn đã đóng gói trong SDK (.aar). Việc quản lý phiên bản tập trung bắt buộc dùng Backbase BOM để đảm bảo tính tương thích giữa các module.'
  },
  {
    id: 126,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'When a client requests changing the primary brand color from blue to red across the entire Banking application, what is the standard approach in the Backbase Mobile Design System (MDS)?',
    options: [
      'Open every XML Layout inside the Journeys and modify the `android:background` attribute.',
      'Override the corresponding Color Design Tokens in the Theme of the Integrator App.',
      'Rewrite all screens using Jetpack Compose.',
      'Create a new red Activity and restart the app.'
    ],
    correctAnswers: [1],
    explanation: 'Backbase MDS sử dụng hệ thống Design Tokens. Để thay đổi giao diện/thương hiệu (White-labeling), chỉ cần ghi đè các token màu sắc trong styles.xml hoặc Compose Theme ở module Integrator mà không cần can thiệp UI code của các Journey.'
  },
  {
    id: 127,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'In the Backbase SDK, which component is responsible for managing user sessions (Session management) and global application configuration?',
    options: [
      '`Backbase.initialize(...)` and the Core SDK.',
      '`RoomDatabase`.',
      '`WorkManager`.',
      '`AppNavigationRouter`.'
    ],
    correctAnswers: [0],
    explanation: 'Backbase.initialize(context, configuration) khởi tạo Core SDK, thiết lập ngữ cảnh lưu trữ an toàn, quản lý cấu hình hệ thống và khởi động các service quản lý phiên làm việc.'
  },
  {
    id: 128,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Why does Backbase recommend adopting a "Configuration First" approach before writing custom code?',
    options: [
      'Because Configuration consumes zero RAM memory.',
      'To maximize the use of built-in capabilities, reduce maintenance costs, and ensure a smooth Upgrade Path in the future.',
      'To avoid using Hilt Dependency Injection.',
      'To allow the application to run without a network connection.'
    ],
    correctAnswers: [1],
    explanation: 'Cấu hình bằng file/provider được SDK hỗ trợ chính thức. Khi nâng cấp SDK lên bản mới, các cấu hình này giữ nguyên khả năng tương thích cao hơn rất nhiều so với việc viết code tùy biến đè lên SDK.'
  },
  {
    id: 129,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'What role does the "Integrator App" component play in a Backbase project?',
    options: [
      'Contains all core banking business logic (Core Banking).',
      'Serves as the main application module (typically the `:app` module) that wires together independent Journeys, configures the Theme, sets up the DI Graph, and provides the application entry point.',
      'Acts as an intermediate backend server connecting to the database.',
      'Serves as a tool that automatically generates APK files without needing Android Studio.'
    ],
    correctAnswers: [1],
    explanation: 'Integrator App đóng vai trò điểm lắp ráp (Assembly point), nơi tích hợp các module Journey, cài đặt Dependency Injection toàn cục, cấu hình theme/labels và điều hướng mức cao nhất.'
  },
  {
    id: 130,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'multi',
    question: 'Which of the following features are typically managed at the Backbase Core SDK level? (Select 2)',
    options: [
      'Network connectivity management and Token Authentication (Network Engine).',
      'Detailed UI layout design for the Fund Transfer screen.',
      'Security mechanisms, local data encryption, and Security Checks.',
      'Validating custom phone number formats specific to each local bank.'
    ],
    correctAnswers: [0, 2],
    explanation: 'Core SDK cung cấp các hạ tầng dùng chung như Network Engine (OkHttp, Auth, Headers) và Security Layer (Storage Encryption, Root Detection). Các màn hình và nghiệp vụ cụ thể thuộc về tầng Journey.'
  },
  {
    id: 131,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'What does the term "White-labeling" mean in the context of Backbase mobile product development?',
    options: [
      'Clearing all logcat output before building the app.',
      'The ability to reuse a single codebase to produce applications for multiple banks/brands by customizing Themes, Assets, and Configurations.',
      'Switching the application into Dark Mode.',
      'Using a monochrome black-and-white interface to save battery.'
    ],
    correctAnswers: [1],
    explanation: 'White-labeling cho phép tùy biến ứng dụng chuẩn của Backbase theo diện mạo, ngôn ngữ và bộ nhận diện thương hiệu riêng của từng đối tác ngân hàng mà không phải tạo các kho mã nguồn (repository) riêng biệt.'
  },
  {
    id: 132,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Which of the following developer actions has the most negative impact on the "Upgrade Path"?',
    options: [
      'Changing the value of a string key in `strings.xml`.',
      'Forking or directly copying OOTB Journey source code into the project and modifying it internally.',
      'Registering a new Interceptor into the OkHttp Client.',
      'Updating the Backbase BOM version in the `build.gradle.kts` file.'
    ],
    correctAnswers: [1],
    explanation: 'Việc copy/fork mã nguồn OOTB khiến bạn mất khả năng tự động cập nhật bản vá/tính năng mới khi Backbase phát hành phiên bản SDK tiếp theo, tạo ra khoản nợ kỹ thuật (Technical Debt) lớn.'
  },
  {
    id: 133,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Which core problem does Backbase EBP solve for omni-channel banking?',
    options: [
      'Completely eliminates the Core Banking system.',
      'Unifies the digital experience (Omni-channel) and decouples the Engagement Layer from legacy core systems.',
      'Automatically backs up data to the public cloud.',
      'Completely replaces human tellers at physical bank branches.'
    ],
    correctAnswers: [1],
    explanation: 'EBP đóng vai trò lớp trung gian thống nhất trải nghiệm khách hàng đa kênh và độc lập với Core Banking.'
  },
  {
    id: 134,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'multi',
    question: 'What does the concept of \'Out-of-the-Box\' (OOTB) in Backbase guarantee? (Select 2)',
    options: [
      'Full-featured, thoroughly tested banking business capabilities.',
      'Rapid deployment capability (Time-to-Market) without coding everything from scratch.',
      'No customization or extension is permitted whatsoever.',
      'Exempts the bank from local security compliance regulations.'
    ],
    correctAnswers: [0, 1],
    explanation: 'OOTB mang lại giải pháp nghiệp vụ chuẩn hóa, kiểm thử sẵn và triển khai nhanh chóng.'
  },
  {
    id: 135,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Which phase in the \'Way of Working\' focuses on evaluating the gap between customer requirements and OOTB capabilities?',
    options: [
      'Deploy',
      'Discover',
      'Extend',
      'Run'
    ],
    correctAnswers: [1],
    explanation: 'Giai đoạn Discover thực hiện Gap Analysis để đối chiếu OOTB với Business Requirements.'
  },
  {
    id: 136,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Why is UI customization in Backbase always prioritized through Design Tokens rather than modifying layout files?',
    options: [
      'To avoid increasing the APK size.',
      'To ensure Design System consistency and preserve the Upgrade Path of the Journey SDK.',
      'Because Android Studio does not allow editing XML layouts.',
      'So the application does not require Internet access permissions.'
    ],
    correctAnswers: [1],
    explanation: 'Design Tokens tách biệt hoàn toàn nhận diện thương hiệu khỏi logic hiển thị, bảo vệ Upgrade Path.'
  },
  {
    id: 137,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'How is the concept of a \'Business Journey\' understood in Backbase Android?',
    options: [
      'An independent library module that fully encapsulates UI, Domain logic, and data connectivity contracts for a specific banking business flow.',
      'A single Activity containing all screens of the application.',
      'A JSON file configuring API endpoints.',
      'A database table in SQLite.'
    ],
    correctAnswers: [0],
    explanation: 'Journey là một Feature Module độc lập hoàn chỉnh theo chuẩn Clean Architecture.'
  },
  {
    id: 138,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'multi',
    question: 'What are the main benefits of using an independent modular Journey architecture? (Select 2)',
    options: [
      'Development teams can work in parallel on different Journeys without code conflicts.',
      'Individual Journeys can be easily upgraded or replaced independently without impacting the entire application.',
      'All Journeys share a single global ViewModel.',
      'Forces every Journey to be compiled into a separate APK file.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Phân rã Journey hỗ trợ phát triển song song (parallel development) và nâng cấp độc lập.'
  },
  {
    id: 139,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'When a bank requests a completely new feature not available in OOTB (such as Flight Ticket Booking), what is the standard approach?',
    options: [
      'Directly modify the source code of the Accounts Journey.',
      'Build a new Custom Journey adhering to Backbase\'s Clean Architecture guidelines and Design System.',
      'Reject the bank\'s requirement.',
      'Write the code directly inside the AndroidManifest file.'
    ],
    correctAnswers: [1],
    explanation: 'Yêu cầu nghiệp vụ mới hoàn toàn nằm ngoài OOTB được xử lý bằng cách Build Custom Journey riêng.'
  },
  {
    id: 140,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Which native languages and platforms does the Backbase Mobile SDK support?',
    options: [
      'Flutter and React Native.',
      'Swift (iOS) and Kotlin (Android).',
      'C# Xamarin and Ionic.',
      'PhoneGap and Cordova.'
    ],
    correctAnswers: [1],
    explanation: 'Backbase Mobile SDK phát triển Native 100% bằng Kotlin cho Android và Swift cho iOS.'
  },
  {
    id: 141,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'What is the role of Digital Banking Services (BBS/DBS) in the Backbase system?',
    options: [
      'Provide backend microservices that process banking business logic and orchestrate connectivity with Core Banking.',
      'Render the user interface directly on the user\'s phone.',
      'Package the application into an APK file.',
      'Manage access permissions on the Google Play Store.'
    ],
    correctAnswers: [0],
    explanation: 'DBS/BBS là hệ thống Backend Microservices đóng vai trò trung tâm điều phối nghiệp vụ.'
  },
  {
    id: 142,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'multi',
    question: 'What happens when the \'Adopt before Adapt\' principle is violated by modifying SDK source code? (Select 2)',
    options: [
      'Breaks the Upgrade Path, causing major difficulties when applying security patches from Backbase.',
      'Drastically increases source code maintenance costs in subsequent phases.',
      'Makes the application run twice as fast on all devices.',
      'Google Play automatically grants the highest security certification.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Sửa mã nguồn SDK làm mất khả năng nâng cấp tự động và gây nợ kỹ thuật bảo trì khổng lồ.'
  },
  {
    id: 143,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'What does Backbase\'s \'Omni-channel\' philosophy guarantee for customers?',
    options: [
      'Customers are required to use both a phone and a computer simultaneously.',
      'Consistent experience, data, and transaction state across Mobile, Web, and physical Branch channels.',
      'All transaction channels share a single HTML codebase.',
      'The customer\'s network speed always reaches its maximum level.'
    ],
    correctAnswers: [1],
    explanation: 'Omni-channel đảm bảo tính liền mạch và đồng bộ trạng thái giao dịch trên mọi kênh tương tác.'
  },
  {
    id: 144,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'What is the concept of an \'Integrator Module\'?',
    options: [
      'Core source code released by Backbase packaged as jar/aar files.',
      'The top-level module of the bank\'s project where Journeys are assembled, and themes, DI, and navigation are configured.',
      'The database server of the Core Banking system.',
      'Gradle\'s source code compilation tool.'
    ],
    correctAnswers: [1],
    explanation: 'Integrator Module là tầng ứng dụng của khách hàng đóng vai trò kết nối và cấu hình toàn bộ hệ thống.'
  }
]
