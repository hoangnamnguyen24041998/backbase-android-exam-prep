import type { Question } from '../exam.types'

/**
 * Section 4: Android Essentials for Journeys (Adopt)
 * Quota in Exam: 11 questions
 * Pool Size: 38 questions
 */
export const adoptQuestions: Question[] = [
  {
    id: 401,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'In every Backbase Android Journey (e.g., `AccountsAndTransactionsJourney`), what core role does the **Configuration** object (typically initialized via a Kotlin DSL Builder such as `AccountsAndTransactionsConfiguration { ... }`) play during the **Adopt** phase?',
    options: [
      'It is used to reconfigure the underlying Linux kernel of the Android virtual machine.',
      'It serves as a centralized single entry-point for customization, allowing the application to toggle feature flags, override text (`DeferredText`), icons (`DeferredDrawable`), currency/date formats, and customize child screen behaviors within the Journey via Dependency Injection.',
      'It is used to automatically generate Java Spring Boot backend source code from the mobile device.',
      'It is only used to store the user\'s personal phone contacts.'
    ],
    correctAnswers: [1],
    explanation: 'Mỗi Backbase Journey đều công bố một class `*Configuration` (hỗ trợ Kotlin DSL Builder) tập hợp toàn bộ cấu hình của Journey và các màn hình con (Screen-level configurations) bên trong nó. Khi cung cấp (provide) đối tượng Configuration này qua DI (Hilt/Koin), lập trình viên có thể kiểm soát sâu sắc giao diện và tính năng của Journey mà không cần viết lại bất kỳ màn hình nào.'
  },
  {
    id: 402,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'multi',
    question: 'Which of the following foundational **Design Token** groups does the Backbase **Mobile Design System (MDS)** use to manage brand identity? (Select 3)',
    options: [
      '**Color Tokens** (Semantic colors such as `colorPrimary`, `colorOnPrimary`, `colorSurface`, `colorSuccess`, `colorWarning`, `colorDanger`, etc., automatically supporting both Light Mode and Dark Mode).',
      '**Typography Tokens** (Font families, font weights, and text appearances for hierarchy levels such as `Headline`, `Title`, `Body`, `Label`, etc.).',
      '**Shape & Spacing / Sizing Tokens** (`cornerRadius` for cards/buttons, and standardized `sizer`/`spacer` margins consistent across the entire application).',
      '**SQL Database Tokens** (Relational database query strings in Core Banking).'
    ],
    correctAnswers: [0, 1, 2],
    explanation: 'Mobile Design System (MDS) của Backbase được xây dựng dựa trên hệ thống Design Tokens chuẩn hóa: Colors (Semantic Palette cho Light/Dark theme), Typography (Font & Text Styles), Shapes (Corner radius), Elevations và Dimensions/Spacings. Các OOTB Journeys không bao giờ hardcode mã màu `#FF0000` mà luôn tham chiếu tới các Semantic Tokens này.'
  },
  {
    id: 403,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'To apply a bank\'s custom branding/theme to screens built with traditional Android Views/XML and Material Components in Backbase MDS, what should a developer do in `res/values/themes.xml` (or `styles.xml`)?',
    options: [
      'Delete the application\'s entire `res/` directory.',
      'Inherit from the base Backbase MDS theme (e.g., `parent="Theme.Backbase.Retail"` or `Theme.Backbase.Material3`) and override the standard Design Token attributes (such as `colorPrimary`, `colorSecondary`, `fontFamily`, `shapeAppearanceSmallComponent`, etc.) in `themes.xml` (and `values-night/themes.xml` for Dark Mode).',
      'Use a loop to find every `View` on the screen every second and manually call `.setBackgroundColor()`.',
      'Directly modify the `.jar` files inside the Gradle cache directory.'
    ],
    correctAnswers: [1],
    explanation: 'Trong hệ thống View/XML, Backbase MDS cung cấp Theme nền tảng kế thừa từ Material Components (`Theme.Backbase.*`). Ứng dụng ngân hàng chỉ cần tạo một Custom Theme kế thừa từ `Theme.Backbase.*`, ghi đè các theme attributes (Semantic Tokens) và gắn vào `<application android:theme="@style/AppTheme">` trong `AndroidManifest.xml`.'
  },
  {
    id: 404,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'For modern Backbase Journeys and screens built with **Jetpack Compose**, which MDS component is responsible for providing Design Tokens (Colors, Typography, Shapes, Spacings) down the entire `@Composable` UI tree?',
    options: [
      '`BackbaseTheme { ... }` (a Composable wrapper integrating `CompositionLocalProvider` to supply the MDS color palette, typography, and shapes via a standard theme accessor object).',
      '`RecyclerView.ItemDecoration`',
      '`SQLiteOpenHelper`',
      '`BroadcastReceiver`'
    ],
    correctAnswers: [0],
    explanation: 'Trong Jetpack Compose, Backbase MDS cung cấp hàm Composable gốc `BackbaseTheme` (tương thích và mở rộng từ `MaterialTheme`). Khi bọc nội dung màn hình trong `BackbaseTheme`, toàn bộ các Composable con bên trong OOTB Journey sẽ tự động đọc được đúng các token màu sắc, font chữ và bo góc của ngân hàng thông qua cơ chế `CompositionLocal`.'
  },
  {
    id: 405,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'What does the **Feature Flags** mechanism integrated within a Backbase Journey\'s `*Configuration` object enable the development team to do?',
    options: [
      'Flexibly enable or disable sub-features in a business flow (e.g., `isSearchEnabled = true/false`, `isExportPdfEnabled = true/false`, `enableQuickActions = true`) via code configuration or in combination with a Remote Config system without modifying the Journey\'s source code.',
      'Upgrade the phone\'s internal storage capacity from 64GB to 512GB.',
      'Automatically port the Android application to the Windows Phone operating system.',
      'Completely disable Kotlin\'s type checker.'
    ],
    correctAnswers: [0],
    explanation: 'Các OOTB Journey của Backbase được thiết kế rất giàu tính năng (Feature-rich). Thông qua các cờ boolean hoặc cấu hình con trong `*Configuration` (Feature Flags), ngân hàng có thể dễ dàng bật/tắt các tính năng như Tìm kiếm giao dịch, Lọc nâng cao, Chia sẻ biên lai PDF, hay hiển thị Quick Actions tùy theo giai đoạn Go-Live (MVP hay Phase 2) hoặc theo phân khúc khách hàng.'
  },
  {
    id: 406,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'What design challenge does the **View Slotting / Slot API** concept (both as `@Composable () -> Unit` parameters in Jetpack Compose and as `ViewProvider` / Container Slots in the View System) solve in Backbase Journeys?',
    options: [
      'It allows the bank\'s application to inject a custom UI component (e.g., a promotional credit card banner or a loyalty points widget) into a predefined position (Header slot, Footer slot, or Banner slot) directly inside an OOTB Journey screen while preserving 100% of the logic for the rest of that screen.',
      'It is used to insert a second physical SIM card into the phone\'s SIM tray.',
      'It is used to partition the phone\'s internal storage into multiple FAT32 volumes.',
      'It forces the screen to delete the entire transaction list and display only a single static image.'
    ],
    correctAnswers: [0],
    explanation: '**Slot API / View Slotting** là một kỹ thuật mở rộng giao diện cực kỳ thanh lịch: Màn hình OOTB Journey chừa sẵn các "khe cắm" (Slots) ở các vị trí chiến lược (như phía trên danh sách tài khoản, dưới chi tiết giao dịch...). Thông qua `Configuration`, ngân hàng chỉ cần truyền một Composable lambda hoặc View factory vào slot đó để hiển thị UI đặc thù của mình.'
  },
  {
    id: 407,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'multi',
    question: 'When using `DeferredText` or `DeferredDrawable` data types inside a Journey\'s `*Configuration` object, from which of the following sources can a developer instantiate them? (Select 3)',
    options: [
      'From a static Resource ID in the application (e.g., `DeferredText.Resource(R.string.custom_accounts_title)` or `DeferredDrawable.Resource(R.drawable.ic_bank_logo)`).',
      'From a constant string value or an object created at runtime (e.g., `DeferredText.Constant("Current Account")`).',
      'From a string resource with dynamic formatting arguments (`DeferredText.Resource(R.string.welcome_user, userName)` or `DeferredPlurals`).',
      'From a direct JDBC connection to an Oracle Database server located at a bank branch.'
    ],
    correctAnswers: [0, 1, 2],
    explanation: 'Thư viện `DeferredResources` của Backbase cung cấp sự linh hoạt tối đa: bạn có thể truyền Resource ID (`R.string.*`, `R.plurals.*`, `R.drawable.*`, `R.color.*`, `?attr/*` theme attribute) để tự động hỗ trợ đa ngôn ngữ và Dark Mode, hoặc truyền một giá trị `Constant` động lấy từ Remote Config/API.'
  },
  {
    id: 408,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'If a bank wants to replace an icon or an empty state illustration inside an OOTB Journey screen WITHOUT touching a single line of Kotlin code in the Configuration, which default Android Gradle Plugin mechanism allows this?',
    options: [
      '**Android Resource Overriding (Resource Merging)**: Placing a vector drawable (`*.xml`) or image file with the EXACT SAME RESOURCE NAME as the original resource in the Journey library into the `src/main/res/drawable/` directory of the `:app` module.',
      'Renaming the APK file to `.png` and opening it in Microsoft Paint.',
      'Clearing the Chrome browser cache on the mobile device.',
      'It is impossible because Android forbids two modules from having files with the same name.'
    ],
    correctAnswers: [0],
    explanation: 'Trong quá trình build Android, bộ **Resource Merger** của AGP luôn ưu tiên tài nguyên nằm trong module ứng dụng (`:app` hoặc Product Flavor source set) cao hơn tài nguyên nằm trong các thư viện phụ thuộc (AAR). Do đó, bên cạnh cách tường minh là truyền `DeferredDrawable` qua Configuration DSL, việc đặt file trùng tên resource trong `res/drawable` hoặc `res/values` cũng sẽ tự động ghi đè tài nguyên của Journey.'
  },
  {
    id: 409,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'When configuring a large Journey containing multiple child screens (e.g., `AccountsAndTransactionsConfiguration` holding configurations for both `accountsScreen` and `transactionsScreen`), how is Backbase\'s Kotlin DSL structured so developers can easily override just a single deeply nested property?',
    options: [
      'A **Nested Builder DSL** structure (or hierarchical `.build()` / `copy` functions) where every property already has sensible OOTB defaults; the developer only needs to declare the DSL block for the specific child screen and property they want to change.',
      'It forces the developer to manually pass all 500 parameters into a single constructor with no default values.',
      'Configuration is performed by sending SMS messages to the Backbase call center.',
      'Configuration must be written in Assembly language.'
    ],
    correctAnswers: [0],
    explanation: 'Toàn bộ các class `*Configuration` trong Backbase đều được thiết kế với các giá trị mặc định chuẩn Modelbank (Sensible OOTB Defaults) và cung cấp Kotlin Builder DSL phân cấp. Ví dụ, nếu chỉ muốn đổi tiêu đề của màn hình danh sách tài khoản, bạn chỉ cần viết vài dòng trong khối `accountsScreen { topBarTitle = DeferredText.Resource(...) }`, mọi cấu hình khác vẫn giữ nguyên mặc định chuẩn.'
  },
  {
    id: 410,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'To seamlessly support **Dark Mode / Night Mode** in a banking application using Backbase MDS, what is the most important principle when defining and consuming colors?',
    options: [
      'Always hardcode hexadecimal color values like `#FFFFFF` for backgrounds and `#000000` for text directly inside each individual View.',
      'Always reference **Semantic Color Tokens / Theme Attributes** (e.g., `?attr/colorSurface`, `?attr/colorOnSurface`, `?attr/colorPrimary`, or corresponding tokens in `BackbaseTheme`), and define the mapped color values in both `res/values/` (Light) and `res/values-night/` (Dark) directories.',
      'Ask users to wear sunglasses when using the application at night.',
      'Publish two separate applications on the Google Play Store: one Light version and one Dark version.'
    ],
    correctAnswers: [1],
    explanation: 'Khi giao diện chỉ tham chiếu tới **Semantic Color Tokens** (như `surface`, `onSurface`, `primary`, `danger`) thay vì mã màu vật lý cố định, hệ thống Android và `BackbaseTheme` sẽ tự động chuyển đổi sang bảng màu tối trong `values-night` (hoặc Dark ColorScheme trong Compose) ngay khi hệ điều hành chuyển sang Dark Mode mà không cần viết bất kỳ câu lệnh `if (isDark)` nào trong màn hình.'
  },
  {
    id: 411,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'multi',
    question: 'On a Backbase Journey screen displaying a list of accounts or transactions, how does the OOTB `Configuration` support customizing icon mappings or display formatting for bank-specific product or transaction types (e.g., displaying a custom icon for a "Platinum Visa" card or a "Dining" spending category)? (Select 2)',
    options: [
      'By providing mapper providers or `Map`/`Resolver` functions in the `Configuration` (such as `productIconProvider`, `categoryIconMapper`, or `customBadgeProvider`) that take item attributes as input and return the corresponding `DeferredDrawable` / `DeferredColor`.',
      'By customizing currency amount and date/time formatters (`AmountFormat`, `DateTimeFormat` configuration) directly within the screen\'s configuration object.',
      'By completely removing the Journey and rewriting the `RecyclerView` from scratch.',
      'By directly modifying the customer\'s Android operating system.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Các Backbase Journey nhận thức rõ mỗi ngân hàng có danh mục mã sản phẩm (Product Kind / Sub-type) và quy tắc hiển thị tiền tệ khác nhau. Do đó, đối tượng `Configuration` cung cấp sẵn các hook/mapper functions cho phép truyền logic ánh xạ từ mã loại tài khoản/giao dịch sang Icon (`DeferredDrawable`), Màu sắc hoặc Định dạng tiền tệ mong muốn.'
  },
  {
    id: 412,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'When combining **Dynamic Feature Flags** (from Firebase Remote Config or a bank\'s remote configuration service) with a Backbase Journey\'s `*Configuration` object via Dependency Injection (Hilt/Koin), which design approach is most accurate?',
    options: [
      'Instantiate the `*Configuration` object inside a `@Provides` method (Hilt) or `factory` / `scoped` definition (Koin) that accepts a `RemoteConfigRepository`, reading the latest flags to build the `*Configuration` object and providing a fresh instance when the user\'s authenticated session starts.',
      'Require the user to manually type in a JSON configuration file every time they open the app.',
      'Never use boolean variables inside a Hilt `@Provides` method.',
      'Place all configuration code inside the Garbage Collector\'s `finalize()` method.'
    ],
    correctAnswers: [0],
    explanation: 'Vì đối tượng `*Configuration` của Journey là một Kotlin object thông thường được cung cấp thông qua Dependency Injection container, lập trình viên hoàn toàn có thể inject một `FeatureFlagProvider` / `RemoteConfigService` vào module DI để linh hoạt bật/tắt các thuộc tính trong Configuration theo từng người dùng hoặc theo cấu hình từ xa.'
  },
  {
    id: 413,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'In the Backbase Mobile Design System (MDS), what is the benefit of using **Pre-built Atomic & Molecular UI Components** (such as `BackbaseButton`, `AmountTextView` / `AmountText`, `AccountCard`, and `StateView` for Loading/Error/Empty states) when building custom UI extensions?',
    options: [
      'It ensures strict visual consistency, automatically inherits all Design Tokens (Theme, Dark Mode), provides built-in compliance with accessibility standards (**Accessibility / TalkBack / Dynamic Font Scaling**), and enforces standard banking currency formatting identical to OOTB Journeys.',
      'It restricts the application to run only on tablets with screens larger than 15 inches.',
      'It automatically skips all UI testing steps.',
      'It prevents the user from touching the screen.'
    ],
    correctAnswers: [0],
    explanation: 'Khi tự xây dựng một Slot View hoặc một màn hình mở rộng, việc tái sử dụng các UI Components từ thư viện MDS của Backbase giúp giao diện mới hòa nhập 100% với các OOTB Journeys, tự động tuân thủ chuẩn Accessibility (WCAG) và tự động đổi màu/font khi ngân hàng cập nhật Design Tokens.'
  },
  {
    id: 414,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'If a bank operates in a multilingual market (e.g., supporting Vietnamese, English, and a right-to-left **RTL** language such as Arabic), how do Backbase OOTB Journeys and MDS support **Localization & RTL Layout**?',
    options: [
      'Backbase Journeys use relative alignment attributes (`start`/`end` instead of `left`/`right`), support `android:supportsRtl="true"`, and format strings/values according to the app\'s active `Locale`; the bank simply needs to supply the corresponding `strings.xml` files for each language qualifier (`values-vi`, `values-ar`, etc.).',
      'A completely new application must be written with manually inverted pixel coordinates for Arabic.',
      'The Backbase SDK only supports Dutch.',
      'Users must rotate their phones 180 degrees upside down to read RTL text.'
    ],
    correctAnswers: [0],
    explanation: 'Toàn bộ giao diện trong Backbase MDS và OOTB Journeys đều được thiết kế đạt chuẩn quốc tế hóa (Internationalization - i18n): sử dụng `PaddingStart`/`PaddingEnd`, tự động lật hướng icon điều hướng (`autoMirrored="true"`), định dạng tiền tệ/ngày tháng theo `Locale` và nạp bản dịch từ hệ thống tài nguyên đa ngôn ngữ của Android.'
  },
  {
    id: 415,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'In a list screen configuration (such as the transactions list or accounts list in a Journey), how can the **Empty State** (when no data is available) and **Error State** (when data loading fails) be customized at the "Adopt" level?',
    options: [
      'Through that screen\'s `Configuration` object, developers can pass custom `StateViewConfiguration` / messages (including `icon: DeferredDrawable`, `title: DeferredText`, `subtitle: DeferredText`, and `actionButtonText: DeferredText`) for each Empty or Error state without rewriting the screen.',
      'The backend server must be shut down so that errors never occur.',
      'The image or text of the error screen cannot be changed.',
      'A 100-line red stack trace error code must be displayed for the customer to read.'
    ],
    correctAnswers: [0],
    explanation: 'Các màn hình trong Backbase Journey sử dụng thành phần chuẩn hóa cho trạng thái rỗng/lỗi và phơi bày cấu hình của chúng (Title, Subtitle/Description, Illustration Icon, Retry Action text) ra ngoài `*Configuration`. Ngân hàng có thể dễ dàng áp dụng hình ảnh linh vật (Mascot) và giọng văn thương hiệu (Tone of Voice) riêng cho các màn hình Empty/Error này.'
  },
  {
    id: 416,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'multi',
    question: 'To apply a bank\'s **Custom Font (Typography)** (e.g., the `PlusJakartaSans` font family including Regular, Medium, SemiBold, and Bold) across the entire Backbase MDS system on Android, which steps must a developer perform? (Select 2)',
    options: [
      'Place the font files (`.ttf` or `.otf`) into the project\'s `res/font/` directory (or create an XML Font Family mapping the `fontWeight` values 400, 500, 600, and 700).',
      'Override the MDS font token attributes in the Theme (e.g., `fontFamily` / `android:fontFamily` or `TextAppearance` styles in `themes.xml`, and pass the corresponding `Typography` configuration into `BackbaseTheme` for Jetpack Compose).',
      'Install font editing software on every customer\'s mobile phone.',
      'Convert all text paragraphs in the application into `.bmp` image files.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Chỉ cần đưa các file `.ttf`/`.otf` vào `res/font/` và ánh xạ chúng vào các token Typography trong Theme của ứng dụng (`themes.xml` cho View System và `BackbaseTheme` typography cho Jetpack Compose), toàn bộ các tiêu đề, nhãn và số tiền trên mọi OOTB Journey sẽ tự động hiển thị bằng bộ font thương hiệu của ngân hàng.'
  },
  {
    id: 417,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'When a Journey supports customizing the list of **Quick Actions** (e.g., on the Account Details screen with buttons such as "Transfer", "Pay Bill", "Statements", and "Close Account"), how can a bank reorder, hide, or add a new action button that navigates to a custom bank screen?',
    options: [
      'Redefine the list of `QuickActionItem` configuration objects inside the Journey\'s `*Configuration`, specifying the `id`, `title` (`DeferredText`), `icon` (`DeferredDrawable`), and handling the `onClick` event (or navigation callback via a `Router`) when the user taps the button.',
      'Place adhesive tape over the portion of the screen containing the unwanted button.',
      'Decompile the Journey\'s bytecode file to delete elements from the array.',
      'No Backbase Journey allows configuring action buttons.'
    ],
    correctAnswers: [0],
    explanation: 'Các khu vực như Quick Actions, Menu Items hay Bottom Sheet Actions trong Backbase Journeys thường được thiết kế hướng cấu hình (Data/Config-driven). Lập trình viên có thể truyền danh sách các Action items mong muốn cùng với lambda xử lý sự kiện vào đối tượng `Configuration` để kiểm soát hoàn toàn danh mục tính năng hiển thị.'
  },
  {
    id: 418,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'Why should checking the API Reference documentation and KDoc of the `*Configuration` class always be the FIRST step before a developer decides to write deep customization code (Extend) for a Journey?',
    options: [
      'Because many requirements for UI changes, showing/hiding data fields, display formatting, filters, or injecting auxiliary views are ALREADY SUPPORTED out-of-the-box as configuration properties in `*Configuration` (Adopt); leveraging configuration saves dozens of coding hours and preserves 100% seamless upgradability for future Journey versions.',
      'Because the Android Studio compiler locks the keyboard if the KDoc file has not been opened.',
      'To increase the number of comment lines in the project.',
      'Because the `*Configuration` class contains the bank server\'s administrator password.'
    ],
    correctAnswers: [0],
    explanation: 'Tuân thủ nguyên tắc "Adopt before Adapt": các kiến trúc sư của Backbase liên tục bổ sung các điểm cấu hình mới vào `*Configuration` qua từng bản phát hành. Kiểm tra kỹ khả năng của `*Configuration` trước khi quyết định viết Custom Screen hay Custom UseCase giúp đội ngũ tránh việc "tự code lại" một tính năng đã có sẵn chỉ bằng 1 dòng cấu hình.'
  },
  {
    id: 419,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'When using an OOTB Journey (e.g., `AccountsJourney`), you want to change the default displayed text of a screen title. What is the standard approach?',
    options: [
      'Download the entire source code of that screen and modify it.',
      'Override the corresponding String Key for that label in the `res/values/strings.xml` file of the Integrator Module.',
      'Manipulate the SQLite database to modify the string.',
      'Create a Custom View to overlay the old title.'
    ],
    correctAnswers: [1],
    explanation: 'Hệ thống Android tài nguyên (res) ưu tiên chọn resource ở module ứng dụng chính (app/Integrator) đè lên các resource cùng key trong thư viện SDK phụ thuộc.'
  },
  {
    id: 420,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'What is the primary purpose of the "Slot API" (or View Slotting) mechanism in Backbase Journeys?',
    options: [
      'To insert C++ code snippets into the application.',
      'To allow developers to inject custom UI components into predefined placeholder areas on a standard Journey screen without rewriting the entire screen.',
      'To split the APK file into multiple parts.',
      'To save data onto an SD card.'
    ],
    correctAnswers: [1],
    explanation: 'Slot API tạo ra các "khoảng trống" (Slots) chuẩn hóa trên UI của Journey. Integrator có thể "inject" thêm View/Composable tùy biến (ví dụ: Banner quảng cáo, Nút bấm nhanh) vào đúng vị trí đó.'
  },
  {
    id: 421,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'Where is customizing the list of items on the application\'s main menu bar (Bottom Navigation) typically performed in a Backbase project?',
    options: [
      'By modifying the source code of the Core SDK.',
      'By providing a Custom Configuration Provider (e.g., `AppMenuConfigurationProvider`) via Hilt DI at the Integrator level.',
      'By creating 5 separate Activities that call each other.',
      'By directly editing the SDK library\'s Manifest file.'
    ],
    correctAnswers: [1],
    explanation: 'Các Journey và Shell App nhận cấu hình menu, danh sách tab qua các Interface Provider được đăng ký trong Hilt Dependency Graph.'
  },
  {
    id: 422,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'multi',
    question: 'Which of the following elements can be easily customized by changing Configuration or Styles WITHOUT writing new Kotlin business logic code? (Select 2)',
    options: [
      'The application\'s Typography and Color Palette.',
      'The RSA encryption algorithm used in banking transactions.',
      'Enabling or disabling a hidden feature (Feature Flag) already supported by the Journey.',
      'Modifying the structure of fields returned in the Backend\'s RESTful API.'
    ],
    correctAnswers: [0, 2],
    explanation: 'Typography/Colors được điều khiển qua Theme/Design Tokens. Bật/Tắt tính năng OOTB được điều khiển qua Feature Toggle Config/Flags.'
  },
  {
    id: 423,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'What is the most appropriate way to provide a custom implementation for a Router interface (e.g., `AccountsJourneyRouter`) in a Hilt container?',
    options: [
      'Use `@Provides` or `@Binds` inside a Hilt `@Module` installed in `SingletonComponent` or `ActivityComponent`.',
      'Assign the instance directly to a `public static` variable.',
      'Instantiate the Router in the `Application` class and save it to `SharedPreferences`.',
      'Write the interface and the implementation class in the exact same file.'
    ],
    correctAnswers: [0],
    explanation: 'Hilt DI được Backbase sử dụng xuyên suốt. Khi Journey yêu cầu một Router interface, Integrator phải cung cấp class triển khai thông qua Hilt Module (@Binds hoặc @Provides).'
  },
  {
    id: 424,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'When an OOTB Journey needs to pass transaction data to another Journey, which method best aligns with Backbase design standards?',
    options: [
      'Save the data to a `.txt` file on external storage.',
      'Pass parameters via Navigation Arguments (Safe Args / Deep Link Query Parameters) or Shared Secure Storage.',
      'Pass the `ViewModel` instance directly to the new `Fragment`.',
      'Use a global static variable `public static Data data;`.'
    ],
    correctAnswers: [1],
    explanation: 'Sử dụng Safe Args/Deeplink Param giúp truyền dữ liệu tường minh, độc lập và an toàn giữa các luồng giao diện mà không vi phạm nguyên tắc bao đóng.'
  },
  {
    id: 425,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'How does an application support Localization (multiple languages) for strings displayed within a Backbase Journey?',
    options: [
      'Write `if-else` statements checking the language inside all ViewModels.',
      'Add corresponding `strings.xml` files into locale-specific resource directories (e.g., `values-vi/strings.xml`, `values-en/strings.xml`).',
      'Download language files from a server every time the app opens and store them in RAM.',
      'Force the user to change their phone\'s operating system language.'
    ],
    correctAnswers: [1],
    explanation: 'Tận dụng cơ chế Localization tiêu chuẩn của Android (res/values-xx/strings.xml). SDK Backbase tự động tham chiếu đến key tương ứng dựa trên Locale của hệ thống/ứng dụng.'
  },
  {
    id: 426,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'multi',
    question: 'When registering a custom Interceptor into Backbase\'s `NetworkEngine` to add a custom header (e.g., `X-Device-ID`), what are the effects of this operation? (Select 2)',
    options: [
      'All outgoing HTTP/HTTPS requests from the Backbase SDK will automatically have this header attached.',
      'It automatically encrypts the entire local SQLite database on the device.',
      'It centralizes the header-injection logic in a single place instead of modifying every individual API call.',
      'It doubles the internet connection speed.'
    ],
    correctAnswers: [0, 2],
    explanation: 'OkHttp Interceptor bọc lấy tầng NetworkEngine dùng chung. Thêm Interceptor qua DI giúp tự động áp dụng logic (như chèn Header, Logging) cho mọi API request toàn cục.'
  },
  {
    id: 427,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'When you want to hide or disable a sub-feature on an OOTB Dashboard screen (e.g., hiding the "International Transfer" button), what is the proper "Adopt" approach?',
    options: [
      'Delete the button\'s XML layout file inside the SDK.',
      'Use the Screen/Dashboard Configuration to set its hidden/disabled state (`enabled = false` or remove that widget from the layout configuration list).',
      'Create a white View and overlay it on top of the button\'s position.',
      'Throw an Exception whenever the user taps the button.'
    ],
    correctAnswers: [1],
    explanation: 'Các màn hình Dashboard/Journey OOTB của Backbase thường được dựng dựa trên danh sách cấu hình Layout/Widget. Việc ẩn bớt tính năng chỉ cần thay đổi file cấu hình tương ứng.'
  },
  {
    id: 428,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'In Hilt Dependency Injection, if you write a Hilt `@Module` to bind a custom implementation but forget to add the `@InstallIn(...)` annotation, what will happen?',
    options: [
      'The application still runs normally.',
      'A Compilation Error occurs because Hilt does not know which Component scope this Module belongs to.',
      'The application automatically runs faster.',
      'Hilt automatically guesses the appropriate Scope.'
    ],
    correctAnswers: [1],
    explanation: '@InstallIn là annotation bắt buộc của Hilt để xác định vòng đời và phạm vi (Scope) của các dependency trong Module. Thiếu nó sẽ làm thất bại quá trình sinh code của Hilt ở bước compile.'
  },
  {
    id: 429,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'What is the essence of "Adopting a Journey" in Backbase?',
    options: [
      'Using the out-of-the-box Journey as-is and customizing it through configuration and Design Tokens without modifying its internal business logic code.',
      'Downloading the entire source code and rewriting it as desired.',
      'Rewriting all screens from scratch using Flutter.',
      'Running the Journey as an HTML5 web page inside a WebView.'
    ],
    correctAnswers: [0],
    explanation: 'Adopt là tích hợp Journey OOTB và tinh chỉnh thông qua cấu hình có sẵn.'
  },
  {
    id: 430,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'In the Mobile Design System (MDS), what problem do Design Tokens solve?',
    options: [
      'Automatically generating OTP codes for users.',
      'Abstracting UI values (colors, typography, spacing, shapes) into standardized variables for consistent theming.',
      'Storing credit card data securely.',
      'Compressing image file sizes in the drawable folder.'
    ],
    correctAnswers: [1],
    explanation: 'Design Tokens là cầu nối trừu tượng hóa UI phục vụ đổi theme và White-labeling nhanh chóng.'
  },
  {
    id: 431,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'multi',
    question: 'When rebranding the application to match a bank\'s theme, where should a developer intervene? (Select 2)',
    options: [
      'Override color and font tokens in `res/values/styles.xml` (or `themes.xml`) inheriting from `Theme.Backbase`.',
      'Configure `BackbaseTheme` in Jetpack Compose with a custom color palette.',
      'Decompile `.aar` files to edit hex color codes inside `.class` files.',
      'Ask the bank to change its logo to Backbase\'s default color.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Theming được thực hiện thông qua override Design Tokens ở XML styles hoặc Compose BackbaseTheme.'
  },
  {
    id: 432,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'What does the Slot API / View Slotting mechanism in Backbase Composable Screens allow developers to do?',
    options: [
      'Inject the bank\'s custom UI into predefined placeholder regions on an OOTB screen without rewriting the screen.',
      'Play a lucky spin game inside the app.',
      'Share RAM resources with other applications.',
      'Automatically reload the app when lag occurs.'
    ],
    correctAnswers: [0],
    explanation: 'Slot API cung cấp các điểm chèn UI tùy biến linh hoạt trên màn hình có sẵn.'
  },
  {
    id: 433,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'What is the most standard way to change the default text label on an OOTB Journey button?',
    options: [
      'Request Backbase to build a new SDK version.',
      'Override the corresponding string key in the `res/values/strings.xml` file of the Integrator module.',
      'Take a screenshot of a new button and paste it over the screen.',
      'Manipulate the library\'s bytecode when the application launches.'
    ],
    correctAnswers: [1],
    explanation: 'Android ưu tiên tài nguyên strings.xml của app module đè lên tài nguyên cùng key của thư viện.'
  },
  {
    id: 434,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'Where do you configure enabling or disabling a built-in feature within a Journey (Feature Flag)?',
    options: [
      'In the Journey\'s Configuration object (via a Configuration Provider).',
      'By deleting the `.class` file of that feature inside the library.',
      'By calling `System.exit(0)` when the feature is opened.',
      'By modifying the `build.gradle.kts` file.'
    ],
    correctAnswers: [0],
    explanation: 'Các cờ tính năng OOTB được quản lý thông qua Configuration Object của Journey.'
  },
  {
    id: 435,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'multi',
    question: 'Which of the following elements are valid Design Tokens in Backbase MDS? (Select 2)',
    options: [
      'Typography Tokens (heading, body, label styles).',
      'Spacing & Shape Tokens (margin, padding, corner radius).',
      'Database Table Schema Tokens.',
      'Network Socket Timeout Tokens.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Design Tokens chỉ đại diện cho các thuộc tính thiết kế giao diện (Font, Màu, Khoảng cách, Bo góc).'
  },
  {
    id: 436,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'When supporting Dark Mode in Jetpack Compose for a Backbase Journey, which mechanism is used?',
    options: [
      'Checking `isSystemInDarkTheme()` and passing the corresponding dark color palette into `BackbaseTheme`.',
      'Inverting all screen pixels using a graphics algorithm.',
      'Turning off the phone\'s backlight.',
      'Forcing users not to use their devices at night.'
    ],
    correctAnswers: [0],
    explanation: 'Sử dụng isSystemInDarkTheme() để cung cấp bộ Dark Color Palette cho Theme Composable.'
  },
  {
    id: 437,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'What happens if the Integrator App does not provide any theme customizations for a Journey?',
    options: [
      'The application crashes immediately on launch.',
      'The Journey automatically applies the Default BDS Theme pre-packaged within the SDK.',
      'The screen displays only a blank white view with no content.',
      'Google Play refuses to install the application.'
    ],
    correctAnswers: [1],
    explanation: 'SDK luôn có Default BDS Theme làm fallback an toàn, đảm bảo app luôn hiển thị chuẩn mực.'
  },
  {
    id: 438,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'How is Localization (multi-language support) implemented for an OOTB Journey?',
    options: [
      'By providing `strings.xml` files in the corresponding locale resource directories (such as `values-vi/strings.xml`, `values-en/strings.xml`).',
      'By automatically translating at runtime using Google Translate.',
      'By rewriting the Journey source code for each country.',
      'By forcing users to use only English.'
    ],
    correctAnswers: [0],
    explanation: 'Hệ thống sử dụng cơ chế đa ngôn ngữ chuẩn của Android qua các thư mục res/values-xx/strings.xml.'
  }
]
