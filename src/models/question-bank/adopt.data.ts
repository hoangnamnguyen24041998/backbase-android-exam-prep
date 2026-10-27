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
    question: 'Trong mỗi Backbase Android Journey (ví dụ: `AccountsAndTransactionsJourney`), đối tượng **Configuration** (thường được khởi tạo thông qua Kotlin DSL Builder như `AccountsAndTransactionsConfiguration { ... }`) đóng vai trò cốt lõi gì trong giai đoạn **Adopt**?',
    options: [
      'Dùng để cấu hình lại hệ điều hành Linux kernel bên dưới máy ảo Android.',
      'Là điểm tiếp nhận cấu hình trung tâm (Single Entry-point for Customization) cho phép ứng dụng bật/tắt các Feature Flags, thay đổi văn bản (`DeferredText`), icon (`DeferredDrawable`), định dạng tiền tệ/ngày tháng và tùy chỉnh hành vi của các màn hình con bên trong Journey thông qua Dependency Injection.',
      'Dùng để tự động sinh mã nguồn Backend Java Spring Boot từ điện thoại.',
      'Chỉ dùng để lưu trữ danh bạ điện thoại cá nhân của người dùng.'
    ],
    correctAnswers: [1],
    explanation: 'Mỗi Backbase Journey đều công bố một class `*Configuration` (hỗ trợ Kotlin DSL Builder) tập hợp toàn bộ cấu hình của Journey và các màn hình con (Screen-level configurations) bên trong nó. Khi cung cấp (provide) đối tượng Configuration này qua DI (Hilt/Koin), lập trình viên có thể kiểm soát sâu sắc giao diện và tính năng của Journey mà không cần viết lại bất kỳ màn hình nào.'
  },
  {
    id: 402,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'multi',
    question: 'Hệ thống **Mobile Design System (MDS)** của Backbase quản lý bộ nhận diện thương hiệu thông qua các nhóm **Design Tokens** nền tảng nào sau đây? (Chọn 3 đáp án đúng)',
    options: [
      '**Color Tokens** (Semantic colors như `colorPrimary`, `colorOnPrimary`, `colorSurface`, `colorSuccess`, `colorWarning`, `colorDanger`... hỗ trợ tự động cả Light Mode và Dark Mode).',
      '**Typography Tokens** (Font families, font weights, text appearances cho các cấp độ tiêu đề `Headline`, `Title`, `Body`, `Label`...).',
      '**Shape & Spacing / Sizing Tokens** (Độ bo góc `cornerRadius` cho thẻ/nút bấm, khoảng cách lề chuẩn `sizer`/`spacer` đồng nhất trên toàn ứng dụng).',
      '**SQL Database Tokens** (Chuỗi truy vấn cơ sở dữ liệu quan hệ trong Core Banking).'
    ],
    correctAnswers: [0, 1, 2],
    explanation: 'Mobile Design System (MDS) của Backbase được xây dựng dựa trên hệ thống Design Tokens chuẩn hóa: Colors (Semantic Palette cho Light/Dark theme), Typography (Font & Text Styles), Shapes (Corner radius), Elevations và Dimensions/Spacings. Các OOTB Journeys không bao giờ hardcode mã màu `#FF0000` mà luôn tham chiếu tới các Semantic Tokens này.'
  },
  {
    id: 403,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'Để áp dụng bộ nhận diện thương hiệu riêng của ngân hàng (Custom Branding / Theme) cho các màn hình sử dụng Android View/XML truyền thống và Material Components trong Backbase MDS, lập trình viên cần thực hiện như thế nào trong `res/values/themes.xml` (hoặc `styles.xml`)?',
    options: [
      'Xóa toàn bộ thư mục `res/` của ứng dụng.',
      'Kế thừa từ Theme gốc của Backbase MDS (ví dụ: `parent="Theme.Backbase.Retail"` hoặc `Theme.Backbase.Material3`) và ghi đè (override) các thuộc tính Design Token chuẩn (như `colorPrimary`, `colorSecondary`, `fontFamily`, `shapeAppearanceSmallComponent`...) trong `themes.xml` (và `values-night/themes.xml` cho Dark Mode).',
      'Dùng vòng lặp tìm toàn bộ các `View` trên màn hình mỗi giây để gọi `.setBackgroundColor()` bằng tay.',
      'Chỉnh sửa trực tiếp file `.jar` trong thư mục cache của Gradle.'
    ],
    correctAnswers: [1],
    explanation: 'Trong hệ thống View/XML, Backbase MDS cung cấp Theme nền tảng kế thừa từ Material Components (`Theme.Backbase.*`). Ứng dụng ngân hàng chỉ cần tạo một Custom Theme kế thừa từ `Theme.Backbase.*`, ghi đè các theme attributes (Semantic Tokens) và gắn vào `<application android:theme="@style/AppTheme">` trong `AndroidManifest.xml`.'
  },
  {
    id: 404,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'Đối với các Backbase Journeys và màn hình hiện đại được xây dựng bằng **Jetpack Compose**, thành phần nào của MDS chịu trách nhiệm cung cấp các Design Tokens (Colors, Typography, Shapes, Spacings) xuống toàn bộ cây giao diện `@Composable`?',
    options: [
      '`BackbaseTheme { ... }` (Composable wrapper tích hợp `CompositionLocalProvider` để cung cấp bảng màu, kiểu chữ và hình khối của MDS thông qua đối tượng truy cập theme chuẩn).',
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
    question: 'Cơ chế **Feature Flags** được tích hợp bên trong đối tượng `*Configuration` của một Backbase Journey cho phép đội ngũ phát triển thực hiện điều gì?',
    options: [
      'Bật hoặc tắt các tính năng con trong luồng nghiệp vụ (ví dụ: `isSearchEnabled = true/false`, `isExportPdfEnabled = true/false`, `enableQuickActions = true`) một cách linh hoạt thông qua cấu hình code hoặc kết hợp với hệ thống Remote Config mà không cần sửa đổi mã nguồn của Journey.',
      'Tăng dung lượng bộ nhớ trong của điện thoại từ 64GB lên 512GB.',
      'Tự động dịch ứng dụng Android sang hệ điều hành Windows Phone.',
      'Vô hiệu hóa hoàn toàn trình kiểm tra kiểu dữ liệu của Kotlin.'
    ],
    correctAnswers: [0],
    explanation: 'Các OOTB Journey của Backbase được thiết kế rất giàu tính năng (Feature-rich). Thông qua các cờ boolean hoặc cấu hình con trong `*Configuration` (Feature Flags), ngân hàng có thể dễ dàng bật/tắt các tính năng như Tìm kiếm giao dịch, Lọc nâng cao, Chia sẻ biên lai PDF, hay hiển thị Quick Actions tùy theo giai đoạn Go-Live (MVP hay Phase 2) hoặc theo phân khúc khách hàng.'
  },
  {
    id: 406,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'Khái niệm **View Slotting / Slot API** (cả trong Jetpack Compose dưới dạng `@Composable () -> Unit` parameters và trong View System dưới dạng `ViewProvider` / Container Slots) trong các Backbase Journey giải quyết bài toán thiết kế nào?',
    options: [
      'Cho phép ứng dụng ngân hàng "nhét" (inject) một thành phần giao diện tùy chỉnh riêng (ví dụ: một Banner quảng cáo thẻ tín dụng mới, hoặc một Widget điểm thưởng Loyalty) vào đúng một vị trí được định sẵn (Header slot, Footer slot, hoặc Banner slot) ngay bên trong màn hình của OOTB Journey mà vẫn giữ nguyên 100% logic phần còn lại của màn hình đó.',
      'Dùng để cắm thẻ SIM vật lý thứ hai vào khe cắm của điện thoại.',
      'Dùng để chia ổ cứng điện thoại thành nhiều phân vùng FAT32.',
      'Buộc màn hình phải xóa bỏ toàn bộ danh sách giao dịch để chỉ hiển thị một bức ảnh tĩnh.'
    ],
    correctAnswers: [0],
    explanation: '**Slot API / View Slotting** là một kỹ thuật mở rộng giao diện cực kỳ thanh lịch: Màn hình OOTB Journey chừa sẵn các "khe cắm" (Slots) ở các vị trí chiến lược (như phía trên danh sách tài khoản, dưới chi tiết giao dịch...). Thông qua `Configuration`, ngân hàng chỉ cần truyền một Composable lambda hoặc View factory vào slot đó để hiển thị UI đặc thù của mình.'
  },
  {
    id: 407,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'multi',
    question: 'Khi sử dụng kiểu dữ liệu `DeferredText` hoặc `DeferredDrawable` bên trong đối tượng `*Configuration` của một Journey, lập trình viên có thể khởi tạo chúng từ những nguồn nào sau đây? (Chọn 3 đáp án đúng)',
    options: [
      'Từ một Resource ID tĩnh trong ứng dụng (ví dụ: `DeferredText.Resource(R.string.custom_accounts_title)` hoặc `DeferredDrawable.Resource(R.drawable.ic_bank_logo)`).',
      'Từ một giá trị chuỗi hằng số hoặc đối tượng tạo sẵn lúc runtime (ví dụ: `DeferredText.Constant("Tài khoản thanh toán")`).',
      'Từ một Resource chuỗi có truyền tham số định dạng động (`DeferredText.Resource(R.string.welcome_user, userName)` hoặc `DeferredPlurals`).',
      'Từ một kết nối JDBC trực tiếp tới máy chủ Oracle Database đặt tại chi nhánh ngân hàng.'
    ],
    correctAnswers: [0, 1, 2],
    explanation: 'Thư viện `DeferredResources` của Backbase cung cấp sự linh hoạt tối đa: bạn có thể truyền Resource ID (`R.string.*`, `R.plurals.*`, `R.drawable.*`, `R.color.*`, `?attr/*` theme attribute) để tự động hỗ trợ đa ngôn ngữ và Dark Mode, hoặc truyền một giá trị `Constant` động lấy từ Remote Config/API.'
  },
  {
    id: 408,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'Nếu ngân hàng muốn thay đổi một biểu tượng (Icon) hoặc hình minh họa trạng thái trống (Empty State Illustration) bên trong một màn hình của OOTB Journey mà KHÔNG muốn đụng tới một dòng code Kotlin nào trong Configuration, cơ chế mặc định nào của Android Gradle Plugin cho phép thực hiện điều này?',
    options: [
      '**Android Resource Overriding (Resource Merging)**: Đặt một file vector drawable (`*.xml`) hoặc ảnh có CÙNG TÊN FILE (exact same resource name) với resource gốc của thư viện Journey vào trong thư mục `src/main/res/drawable/` của module `:app`.',
      'Đổi tên file APK thành `.png` rồi mở bằng ứng dụng Paint.',
      'Xóa bộ nhớ đệm của trình duyệt Chrome trên điện thoại.',
      'Không thể thực hiện được vì Android cấm hai module có file trùng tên.'
    ],
    correctAnswers: [0],
    explanation: 'Trong quá trình build Android, bộ **Resource Merger** của AGP luôn ưu tiên tài nguyên nằm trong module ứng dụng (`:app` hoặc Product Flavor source set) cao hơn tài nguyên nằm trong các thư viện phụ thuộc (AAR). Do đó, bên cạnh cách tường minh là truyền `DeferredDrawable` qua Configuration DSL, việc đặt file trùng tên resource trong `res/drawable` hoặc `res/values` cũng sẽ tự động ghi đè tài nguyên của Journey.'
  },
  {
    id: 409,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'Khi cấu hình một Journey lớn có chứa nhiều màn hình con (ví dụ: `AccountsAndTransactionsConfiguration` chứa cấu hình cho cả màn hình `accountsScreen` và `transactionsScreen`), cấu trúc Kotlin DSL của Backbase được thiết kế theo mô hình nào để giúp lập trình viên dễ dàng ghi đè chỉ đúng 1 thuộc tính sâu bên trong?',
    options: [
      'Cấu trúc **Nested Builder DSL** (hoặc hàm `.build()` / `copy` phân cấp) nơi mọi thuộc tính đều đã có sẵn giá trị mặc định chuẩn OOTB (sensible defaults); lập trình viên chỉ cần khai báo khối DSL cho đúng màn hình con và thuộc tính cụ thể muốn thay đổi.',
      'Bắt buộc lập trình viên phải truyền tay toàn bộ 500 tham số vào một hàm khởi tạo duy nhất không có giá trị mặc định.',
      'Cấu hình thông qua việc gửi tin nhắn SMS tới tổng đài Backbase.',
      'Bắt buộc phải viết cấu hình bằng ngôn ngữ Assembly.'
    ],
    correctAnswers: [0],
    explanation: 'Toàn bộ các class `*Configuration` trong Backbase đều được thiết kế với các giá trị mặc định chuẩn Modelbank (Sensible OOTB Defaults) và cung cấp Kotlin Builder DSL phân cấp. Ví dụ, nếu chỉ muốn đổi tiêu đề của màn hình danh sách tài khoản, bạn chỉ cần viết vài dòng trong khối `accountsScreen { topBarTitle = DeferredText.Resource(...) }`, mọi cấu hình khác vẫn giữ nguyên mặc định chuẩn.'
  },
  {
    id: 410,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'Để hỗ trợ hoàn hảo chế độ Giao diện Tối (**Dark Mode / Night Mode**) cho ứng dụng ngân hàng sử dụng Backbase MDS, nguyên tắc quan trọng nhất khi định nghĩa và sử dụng màu sắc là gì?',
    options: [
      'Luôn gắn cứng mã màu thập lục phân như `#FFFFFF` cho nền và `#000000` cho chữ trực tiếp bên trong từng View.',
      'Luôn tham chiếu tới các **Semantic Color Tokens / Theme Attributes** (ví dụ `?attr/colorSurface`, `?attr/colorOnSurface`, `?attr/colorPrimary` hoặc các token tương ứng trong `BackbaseTheme`), và định nghĩa bảng ánh xạ giá trị màu tương ứng trong cả 2 thư mục `res/values/` (Light) và `res/values-night/` (Dark).',
      'Yêu cầu người dùng đeo kính râm khi sử dụng ứng dụng vào ban đêm.',
      'Tạo 2 ứng dụng riêng biệt trên Google Play Store: một bản màu sáng và một bản màu tối.'
    ],
    correctAnswers: [1],
    explanation: 'Khi giao diện chỉ tham chiếu tới **Semantic Color Tokens** (như `surface`, `onSurface`, `primary`, `danger`) thay vì mã màu vật lý cố định, hệ thống Android và `BackbaseTheme` sẽ tự động chuyển đổi sang bảng màu tối trong `values-night` (hoặc Dark ColorScheme trong Compose) ngay khi hệ điều hành chuyển sang Dark Mode mà không cần viết bất kỳ câu lệnh `if (isDark)` nào trong màn hình.'
  },
  {
    id: 411,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'multi',
    question: 'Trên màn hình hiển thị danh sách tài khoản hoặc giao dịch của Backbase Journey, việc tùy biến cách ánh xạ biểu tượng (Icon mapping) hoặc định dạng hiển thị cho từng loại sản phẩm/giao dịch đặc thù của ngân hàng (ví dụ: hiển thị icon riêng cho loại thẻ "Platinum Visa" hoặc danh mục chi tiêu "Ăn uống") được hỗ trợ OOTB thông qua cơ chế nào trong `Configuration`? (Chọn 2 đáp án đúng)',
    options: [
      'Cung cấp các hàm ánh xạ / Mapper Providers hoặc `Map`/`Resolver` trong `Configuration` (như `productIconProvider`, `categoryIconMapper`, hoặc `customBadgeProvider`) nhận đầu vào là thuộc tính của item và trả về `DeferredDrawable` / `DeferredColor` tương ứng.',
      'Tùy chỉnh bộ định dạng số tiền và ngày tháng (`AmountFormat`, `DateTimeFormat` configuration) ngay trong đối tượng cấu hình của màn hình.',
      'Phải gỡ bỏ hoàn toàn Journey đó và tự viết lại `RecyclerView` từ đầu.',
      'Sửa đổi trực tiếp hệ điều hành Android của khách hàng.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Các Backbase Journey nhận thức rõ mỗi ngân hàng có danh mục mã sản phẩm (Product Kind / Sub-type) và quy tắc hiển thị tiền tệ khác nhau. Do đó, đối tượng `Configuration` cung cấp sẵn các hook/mapper functions cho phép truyền logic ánh xạ từ mã loại tài khoản/giao dịch sang Icon (`DeferredDrawable`), Màu sắc hoặc Định dạng tiền tệ mong muốn.'
  },
  {
    id: 412,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'Khi muốn kết hợp **Dynamic Feature Flags** (từ Firebase Remote Config hoặc một dịch vụ cấu hình từ xa của ngân hàng) với đối tượng `*Configuration` của một Backbase Journey thông qua Dependency Injection (Hilt/Koin), cách thiết kế nào sau đây là chuẩn xác nhất?',
    options: [
      'Khởi tạo đối tượng `*Configuration` bên trong hàm `@Provides` (Hilt) hoặc `factory` / `scoped` (Koin) có nhận vào `RemoteConfigRepository`, đọc các cờ mới nhất để xây dựng đối tượng `*Configuration` và cấp mới khi bắt đầu phiên đăng nhập của người dùng.',
      'Yêu cầu người dùng tự nhập tay file JSON cấu hình mỗi lần mở ứng dụng.',
      'Không bao giờ được dùng biến boolean trong hàm `@Provides` của Hilt.',
      'Đặt toàn bộ code cấu hình vào trong hàm `finalize()` của bộ dọn rác Garbage Collector.'
    ],
    correctAnswers: [0],
    explanation: 'Vì đối tượng `*Configuration` của Journey là một Kotlin object thông thường được cung cấp thông qua Dependency Injection container, lập trình viên hoàn toàn có thể inject một `FeatureFlagProvider` / `RemoteConfigService` vào module DI để linh hoạt bật/tắt các thuộc tính trong Configuration theo từng người dùng hoặc theo cấu hình từ xa.'
  },
  {
    id: 413,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'Trong Mobile Design System (MDS) của Backbase, việc sử dụng các **Pre-built Atomic & Molecular UI Components** (như `BackbaseButton`, `AmountTextView` / `AmountText`, `AccountCard`, `StateView` cho Loading/Error/Empty state) khi xây dựng các phần giao diện mở rộng mang lại lợi ích gì?',
    options: [
      'Đảm bảo sự đồng nhất tuyệt đối về thị giác (Visual Consistency), tự động thừa hưởng toàn bộ Design Tokens (Theme, Dark Mode), hỗ trợ sẵn các tiêu chuẩn trợ năng (**Accessibility / TalkBack / Dynamic Font Scaling**) và chuẩn định dạng số tiền ngân hàng giống hệt như các OOTB Journeys.',
      'Làm cho ứng dụng chỉ chạy được trên máy tính bảng màn hình trên 15 inch.',
      'Tự động bỏ qua mọi bước kiểm thử giao diện.',
      'Ngăn không cho người dùng chạm vào màn hình.'
    ],
    correctAnswers: [0],
    explanation: 'Khi tự xây dựng một Slot View hoặc một màn hình mở rộng, việc tái sử dụng các UI Components từ thư viện MDS của Backbase giúp giao diện mới hòa nhập 100% với các OOTB Journeys, tự động tuân thủ chuẩn Accessibility (WCAG) và tự động đổi màu/font khi ngân hàng cập nhật Design Tokens.'
  },
  {
    id: 414,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'Nếu một ngân hàng hoạt động tại thị trường đa ngôn ngữ (ví dụ: hỗ trợ Tiếng Việt, Tiếng Anh và một ngôn ngữ đọc từ phải sang trái **RTL** như Tiếng Ả Rập), các Backbase OOTB Journeys và MDS hỗ trợ khả năng **Localization & RTL Layout** như thế nào?',
    options: [
      'Các Journey của Backbase sử dụng các thuộc tính căn lề tương đối (`start`/`end` thay vì `left`/`right`), hỗ trợ `android:supportsRtl="true"`, và đọc chuỗi/định dạng theo `Locale` hiện hành của ứng dụng; ngân hàng chỉ cần cung cấp các bộ file `strings.xml` tương ứng với từng mã ngôn ngữ (`values-vi`, `values-ar`, ...).',
      'Phải viết một ứng dụng hoàn toàn mới với các tọa độ pixel tính ngược bằng tay cho tiếng Ả Rập.',
      'Backbase SDK chỉ hỗ trợ duy nhất tiếng Hà Lan.',
      'Người dùng phải xoay ngược chiếc điện thoại 180 độ để đọc chữ RTL.'
    ],
    correctAnswers: [0],
    explanation: 'Toàn bộ giao diện trong Backbase MDS và OOTB Journeys đều được thiết kế đạt chuẩn quốc tế hóa (Internationalization - i18n): sử dụng `PaddingStart`/`PaddingEnd`, tự động lật hướng icon điều hướng (`autoMirrored="true"`), định dạng tiền tệ/ngày tháng theo `Locale` và nạp bản dịch từ hệ thống tài nguyên đa ngôn ngữ của Android.'
  },
  {
    id: 415,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'Trong cấu hình của một màn hình danh sách (ví dụ danh sách giao dịch hoặc danh sách tài khoản trong Journey), các trạng thái **Empty State** (khi không có dữ liệu) và **Error State** (khi tải dữ liệu lỗi) có thể được tùy biến ở mức độ "Adopt" như thế nào?',
    options: [
      'Thông qua đối tượng `Configuration` của màn hình đó, lập trình viên có thể truyền các `StateViewConfiguration` / thông điệp tùy chỉnh (gồm `icon: DeferredDrawable`, `title: DeferredText`, `subtitle: DeferredText`, và nhãn nút `actionButtonText: DeferredText`) cho từng trạng thái Empty hoặc Error mà không cần viết lại màn hình.',
      'Phải tắt máy chủ Backend để không bao giờ xảy ra lỗi.',
      'Không thể thay đổi được hình ảnh hay dòng chữ của màn hình báo lỗi.',
      'Bắt buộc phải hiển thị mã lỗi StackTrace bằng chữ màu đỏ dài 100 dòng cho khách hàng đọc.'
    ],
    correctAnswers: [0],
    explanation: 'Các màn hình trong Backbase Journey sử dụng thành phần chuẩn hóa cho trạng thái rỗng/lỗi và phơi bày cấu hình của chúng (Title, Subtitle/Description, Illustration Icon, Retry Action text) ra ngoài `*Configuration`. Ngân hàng có thể dễ dàng áp dụng hình ảnh linh vật (Mascot) và giọng văn thương hiệu (Tone of Voice) riêng cho các màn hình Empty/Error này.'
  },
  {
    id: 416,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'multi',
    question: 'Để áp dụng một bộ **Custom Font (Typography)** riêng của ngân hàng (ví dụ: bộ font `PlusJakartaSans` gồm Regular, Medium, SemiBold, Bold) vào toàn bộ hệ thống Backbase MDS trên Android, lập trình viên cần thực hiện những bước nào? (Chọn 2 đáp án đúng)',
    options: [
      'Đặt các file font (`.ttf` hoặc `.otf`) vào thư mục `res/font/` của dự án (hoặc tạo một XML Font Family kết nối các độ đậm `fontWeight` 400, 500, 600, 700).',
      'Khai báo ghi đè các thuộc tính font token của MDS trong Theme (ví dụ `fontFamily` / `android:fontFamily` hoặc các style `TextAppearance` trong `themes.xml`, và cấu hình `Typography` tương ứng truyền vào `BackbaseTheme` cho Jetpack Compose).',
      'Cài đặt phần mềm chỉnh sửa font chữ lên điện thoại của mọi khách hàng.',
      'Chuyển toàn bộ các đoạn văn bản trong ứng dụng thành file ảnh `.bmp`.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Chỉ cần đưa các file `.ttf`/`.otf` vào `res/font/` và ánh xạ chúng vào các token Typography trong Theme của ứng dụng (`themes.xml` cho View System và `BackbaseTheme` typography cho Jetpack Compose), toàn bộ các tiêu đề, nhãn và số tiền trên mọi OOTB Journey sẽ tự động hiển thị bằng bộ font thương hiệu của ngân hàng.'
  },
  {
    id: 417,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'Khi một Journey hỗ trợ tùy biến danh sách các nút hành động nhanh (**Quick Actions** - ví dụ trên màn hình Chi tiết tài khoản có các nút: "Chuyển tiền", "Thanh toán hóa đơn", "Sao kê", "Đóng tài khoản"), làm thế nào để ngân hàng thay đổi thứ tự, ẩn bớt hoặc thêm một nút hành động mới dẫn sang màn hình riêng của ngân hàng?',
    options: [
      'Định nghĩa lại danh sách các đối tượng cấu hình `QuickActionItem` bên trong `*Configuration` của Journey, chỉ định `id`, `title` (`DeferredText`), `icon` (`DeferredDrawable`) và xử lý sự kiện `onClick` (hoặc callback điều hướng qua `Router`) khi người dùng bấm vào nút đó.',
      'Dùng băng dính dán che phần màn hình chứa nút không muốn hiển thị.',
      'Decompile file bytecode của Journey để xóa phần tử trong mảng.',
      'Không có bất kỳ Journey nào của Backbase cho phép cấu hình các nút bấm hành động.'
    ],
    correctAnswers: [0],
    explanation: 'Các khu vực như Quick Actions, Menu Items hay Bottom Sheet Actions trong Backbase Journeys thường được thiết kế hướng cấu hình (Data/Config-driven). Lập trình viên có thể truyền danh sách các Action items mong muốn cùng với lambda xử lý sự kiện vào đối tượng `Configuration` để kiểm soát hoàn toàn danh mục tính năng hiển thị.'
  },
  {
    id: 418,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'Tại sao việc kiểm tra tài liệu API Reference và KDoc của class `*Configuration` luôn phải là bước ĐẦU TIÊN trước khi lập trình viên quyết định viết code tùy biến sâu (Extend) cho một Journey?',
    options: [
      'Vì rất nhiều yêu cầu thay đổi giao diện, ẩn/hiện trường dữ liệu, định dạng hiển thị, bộ lọc hoặc chèn thêm View phụ thực chất ĐÃ ĐƯỢC HỖ TRỢ SẴN dưới dạng thuộc tính cấu hình trong `*Configuration` (Adopt); việc tận dụng cấu hình giúp tiết kiệm hàng chục giờ code và giữ nguyên 100% khả năng tự động nâng cấp phiên bản Journey về sau.',
      'Vì trình biên dịch Android Studio sẽ khóa bàn phím nếu chưa mở file KDoc.',
      'Để tăng số dòng bình luận trong dự án.',
      'Vì class `*Configuration` chứa mật khẩu quản trị của máy chủ ngân hàng.'
    ],
    correctAnswers: [0],
    explanation: 'Tuân thủ nguyên tắc "Adopt before Adapt": các kiến trúc sư của Backbase liên tục bổ sung các điểm cấu hình mới vào `*Configuration` qua từng bản phát hành. Kiểm tra kỹ khả năng của `*Configuration` trước khi quyết định viết Custom Screen hay Custom UseCase giúp đội ngũ tránh việc "tự code lại" một tính năng đã có sẵn chỉ bằng 1 dòng cấu hình.'
  },
  {
    id: 419,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'Khi sử dụng một Journey OOTB (ví dụ: AccountsJourney), bạn muốn thay đổi dòng chữ hiển thị mặc định của tiêu đề màn hình. Cách làm chuẩn nhất là gì?',
    options: [
      'Tải lại toàn bộ mã nguồn màn hình đó về và sửa.',
      'Định nghĩa lại (Override) String Key tương ứng của nhãn đó trong file res/values/strings.xml của Integrator Module.',
      'Can thiệp vào cơ sở dữ liệu SQLite để sửa chuỗi.',
      'Tạo một Custom View đè lên tiêu đề cũ.'
    ],
    correctAnswers: [1],
    explanation: 'Hệ thống Android tài nguyên (res) ưu tiên chọn resource ở module ứng dụng chính (app/Integrator) đè lên các resource cùng key trong thư viện SDK phụ thuộc.'
  },
  {
    id: 420,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'Cơ chế "Slot API" (hoặc View Slotting) trong Backbase Journeys được thiết kế nhằm mục đích gì?',
    options: [
      'Để chèn các đoạn code C++ vào ứng dụng.',
      'Cho phép lập trình viên chèn thêm các giao diện tuỳ biến (Custom UI/Component) vào các vị trí được chừa sẵn trên màn hình chuẩn của Journey mà không cần viết lại cả màn hình.',
      'Để chia nhỏ file APK thành nhiều phần.',
      'Để lưu dữ liệu vào thẻ nhớ SD.'
    ],
    correctAnswers: [1],
    explanation: 'Slot API tạo ra các "khoảng trống" (Slots) chuẩn hóa trên UI của Journey. Integrator có thể "inject" thêm View/Composable tùy biến (ví dụ: Banner quảng cáo, Nút bấm nhanh) vào đúng vị trí đó.'
  },
  {
    id: 421,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'Cấu hình tùy biến danh sách các mục trên thanh Menu chính (Bottom Navigation) của ứng dụng thường được thực hiện ở đâu trong dự án Backbase?',
    options: [
      'Thay đổi mã nguồn của Core SDK.',
      'Cung cấp một Custom Configuration Provider (ví dụ: AppMenuConfigurationProvider) thông qua Hilt DI ở Integrator level.',
      'Tạo 5 Activity riêng biệt và gọi lẫn nhau.',
      'Sửa trực tiếp file Manifest của thư viện SDK.'
    ],
    correctAnswers: [1],
    explanation: 'Các Journey và Shell App nhận cấu hình menu, danh sách tab qua các Interface Provider được đăng ký trong Hilt Dependency Graph.'
  },
  {
    id: 422,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'multi',
    question: 'Những yếu tố nào sau đây có thể dễ dàng tùy biến thông qua việc thay đổi Cấu hình (Configuration) hoặc Styles mà KHÔNG CẦN viết code Kotlin mới? (Chọn 2)',
    options: [
      'Phông chữ (Typography) và Bảng màu (Color palette) của ứng dụng.',
      'Thuật toán mã hóa RSA dùng trong giao dịch ngân hàng.',
      'Bật/Tắt một tính năng ẩn (Feature Flag) được Journey hỗ trợ sẵn.',
      'Sửa đổi cấu trúc các trường trả về trong RESTful API của Backend.'
    ],
    correctAnswers: [0, 2],
    explanation: 'Typography/Colors được điều khiển qua Theme/Design Tokens. Bật/Tắt tính năng OOTB được điều khiển qua Feature Toggle Config/Flags.'
  },
  {
    id: 423,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'Cách đúng nhất để cung cấp một triển khai tùy biến cho một Interface Router (ví dụ: AccountsJourneyRouter) trong Hilt Container là gì?',
    options: [
      'Sử dụng @Provides hoặc @Binds trong một Hilt @Module cài đặt tại SingletonComponent hoặc ActivityComponent.',
      'Gán trực tiếp instance vào một biến public static.',
      'Khởi tạo Router trong lớp Application và lưu vào SharedPreferences.',
      'Viết interface và class thực thi trong cùng một file.'
    ],
    correctAnswers: [0],
    explanation: 'Hilt DI được Backbase sử dụng xuyên suốt. Khi Journey yêu cầu một Router interface, Integrator phải cung cấp class triển khai thông qua Hilt Module (@Binds hoặc @Provides).'
  },
  {
    id: 424,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'Khi một Journey OOTB cần gửi dữ liệu giao dịch sang một Journey khác, phương pháp nào phù hợp nhất với chuẩn thiết kế của Backbase?',
    options: [
      'Lưu dữ liệu vào file txt trên bộ nhớ ngoài.',
      'Truyền các tham số qua Navigation Arguments (Safe Args / Deeplink Query Parameters) hoặc Shared Secure Storage.',
      'Truyền trực tiếp instance của ViewModel sang Fragment mới.',
      'Sử dụng biến static toàn cục public static Data data;.'
    ],
    correctAnswers: [1],
    explanation: 'Sử dụng Safe Args/Deeplink Param giúp truyền dữ liệu tường minh, độc lập và an toàn giữa các luồng giao diện mà không vi phạm nguyên tắc bao đóng.'
  },
  {
    id: 425,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'Làm thế nào để ứng dụng hỗ trợ Đa ngôn ngữ (Localization) cho các chuỗi hiển thị trong Backbase Journey?',
    options: [
      'Viết hàm if-else kiểm tra ngôn ngữ trong tất cả các ViewModel.',
      'Bổ sung các file strings.xml tương ứng vào các thư mục tài nguyên theo mã quốc gia (ví dụ: values-vi/strings.xml, values-en/strings.xml).',
      'Tải file ngôn ngữ từ Server về mỗi khi mở app và lưu vào RAM.',
      'Ép người dùng đổi ngôn ngữ của hệ điều hành điện thoại.'
    ],
    correctAnswers: [1],
    explanation: 'Tận dụng cơ chế Localization tiêu chuẩn của Android (res/values-xx/strings.xml). SDK Backbase tự động tham chiếu đến key tương ứng dựa trên Locale của hệ thống/ứng dụng.'
  },
  {
    id: 426,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'multi',
    question: 'Khi đăng ký một Interceptor tùy biến vào NetworkEngine của Backbase để thêm Custom Header (ví dụ: X-Device-ID), thao tác này mang lại tác dụng gì? (Chọn 2)',
    options: [
      'Tất cả các yêu cầu HTTP/HTTPS đi ra từ Backbase SDK sẽ tự động được đính kèm Header này.',
      'Tự động mã hóa toàn bộ cơ sở dữ liệu SQLite dưới máy.',
      'Giúp tập trung xử lý logic thêm Header tại một điểm duy nhất thay vì sửa từng API call.',
      'Tăng gấp đôi tốc độ đường truyền Internet.'
    ],
    correctAnswers: [0, 2],
    explanation: 'OkHttp Interceptor bọc lấy tầng NetworkEngine dùng chung. Thêm Interceptor qua DI giúp tự động áp dụng logic (như chèn Header, Logging) cho mọi API request toàn cục.'
  },
  {
    id: 427,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'Khi bạn muốn vô hiệu hóa (Hide/Disable) một tính năng con trong màn hình Dashboard OOTB (ví dụ: Ẩn nút "Chuyển tiền quốc tế"), cách làm đúng chuẩn Adopt là gì?',
    options: [
      'Xóa file layout XML của nút đó trong SDK.',
      'Sử dụng file Cấu hình Screen/Dashboard Configuration để thiết lập trạng thái ẩn (enabled = false hoặc loại bỏ widget đó khỏi danh sách bố cục).',
      'Tạo một View màu trắng đè lên vị trí nút bấm.',
      'Gợi lỗi (Throw Exception) mỗi khi người dùng bấm vào nút.'
    ],
    correctAnswers: [1],
    explanation: 'Các màn hình Dashboard/Journey OOTB của Backbase thường được dựng dựa trên danh sách cấu hình Layout/Widget. Việc ẩn bớt tính năng chỉ cần thay đổi file cấu hình tương ứng.'
  },
  {
    id: 428,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'Trong Hilt Dependency Injection, nếu bạn viết một Hilt Module để bind một triển khai custom nhưng quên thêm annotation @InstallIn(...), điều gì sẽ xảy ra?',
    options: [
      'Ứng dụng vẫn chạy bình thường.',
      'Xảy ra lỗi Biên dịch (Compilation Error) do Hilt không biết Module này thuộc về Component scope nào.',
      'Ứng dụng tự động chạy nhanh hơn.',
      'Hilt sẽ tự động đoán Scope thích hợp.'
    ],
    correctAnswers: [1],
    explanation: '@InstallIn là annotation bắt buộc của Hilt để xác định vòng đời và phạm vi (Scope) của các dependency trong Module. Thiếu nó sẽ làm thất bại quá trình sinh code của Hilt ở bước compile.'
  },
  {
    id: 429,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'Bản chất của việc \'Adopt a Journey\' trong Backbase là gì?',
    options: [
      'Sử dụng Journey nguyên bản có sẵn, tùy biến qua cấu hình và Design Tokens mà không can thiệp code logic bên trong.',
      'Tải toàn bộ mã nguồn về và viết lại theo ý muốn.',
      'Tự code lại toàn bộ màn hình bằng Flutter.',
      'Chạy Journey dưới dạng một trang web HTML5 trong WebView.'
    ],
    correctAnswers: [0],
    explanation: 'Adopt là tích hợp Journey OOTB và tinh chỉnh thông qua cấu hình có sẵn.'
  },
  {
    id: 430,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'Trong Mobile Design System (MDS), Design Tokens giải quyết bài toán gì?',
    options: [
      'Tự động cấp mã OTP cho người dùng.',
      'Trừu tượng hóa các giá trị giao diện (màu sắc, typography, spacing, shape) thành các biến chuẩn hóa để đổi theme đồng bộ.',
      'Lưu trữ dữ liệu thẻ tín dụng an toàn.',
      'Nén dung lượng hình ảnh trong thư mục drawable.'
    ],
    correctAnswers: [1],
    explanation: 'Design Tokens là cầu nối trừu tượng hóa UI phục vụ đổi theme và White-labeling nhanh chóng.'
  },
  {
    id: 431,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'multi',
    question: 'Khi muốn thay đổi nhận diện thương hiệu cho ứng dụng sang theme của ngân hàng, lập trình viên can thiệp vào đâu? (Chọn 2)',
    options: [
      'Override các token màu sắc và font chữ trong res/values/styles.xml kế thừa Theme.Backbase.',
      'Cấu hình lại BackbaseTheme trong Jetpack Compose với bảng màu tùy biến.',
      'Decompile file .aar để sửa mã màu hex trong file class.',
      'Yêu cầu ngân hàng đổi logo sang màu mặc định của Backbase.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Theming được thực hiện thông qua override Design Tokens ở XML styles hoặc Compose BackbaseTheme.'
  },
  {
    id: 432,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'Cơ chế Slot API / View Slotting trong Backbase Composable Screens cho phép làm gì?',
    options: [
      'Chèn UI tùy biến của riêng ngân hàng vào các vùng được chừa sẵn trên màn hình OOTB mà không phải viết lại màn hình.',
      'Chơi trò chơi quay số trúng thưởng trên app.',
      'Chia sẻ tài nguyên RAM với các ứng dụng khác.',
      'Tự động tải lại app khi bị giật lag.'
    ],
    correctAnswers: [0],
    explanation: 'Slot API cung cấp các điểm chèn UI tùy biến linh hoạt trên màn hình có sẵn.'
  },
  {
    id: 433,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'Để đổi chuỗi văn bản mặc định trên một nút bấm của Journey OOTB, cách chuẩn nhất là gì?',
    options: [
      'Yêu cầu Backbase build lại phiên bản SDK mới.',
      'Override chuỗi string key tương ứng trong file res/values/strings.xml của Integrator module.',
      'Chụp ảnh nút bấm mới và dán đè lên màn hình.',
      'Can thiệp vào bytecode của thư viện khi ứng dụng khởi chạy.'
    ],
    correctAnswers: [1],
    explanation: 'Android ưu tiên tài nguyên strings.xml của app module đè lên tài nguyên cùng key của thư viện.'
  },
  {
    id: 434,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'Để bật hoặc tắt một tính năng có sẵn trong Journey (Feature Flag), ta cấu hình ở đâu?',
    options: [
      'Trong đối tượng Configuration của Journey (thông qua Configuration Provider).',
      'Xóa bỏ file class của tính năng đó trong thư viện.',
      'Gọi lệnh System.exit(0) khi tính năng được mở.',
      'Can thiệp vào file build.gradle.kts.'
    ],
    correctAnswers: [0],
    explanation: 'Các cờ tính năng OOTB được quản lý thông qua Configuration Object của Journey.'
  },
  {
    id: 435,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'multi',
    question: 'Những yếu tố nào thuộc về Design Tokens hợp lệ trong Backbase MDS? (Chọn 2)',
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
    question: 'Khi hỗ trợ Dark Mode trong Jetpack Compose cho Backbase Journey, cơ chế nào được sử dụng?',
    options: [
      'Kiểm tra isSystemInDarkTheme() và truyền palette màu tối tương ứng vào BackbaseTheme.',
      'Đảo ngược toàn bộ pixel của màn hình bằng thuật toán đồ họa.',
      'Tắt đèn nền của điện thoại.',
      'Bắt buộc người dùng không được dùng máy vào ban đêm.'
    ],
    correctAnswers: [0],
    explanation: 'Sử dụng isSystemInDarkTheme() để cung cấp bộ Dark Color Palette cho Theme Composable.'
  },
  {
    id: 437,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'Điều gì xảy ra nếu Integrator App không cung cấp bất kỳ tùy biến theme nào cho Journey?',
    options: [
      'Ứng dụng bị crash ngay khi khởi chạy.',
      'Journey tự động áp dụng Theme mặc định (Default BDS Theme) được đóng gói sẵn trong SDK.',
      'Màn hình chỉ hiển thị màu trắng không có nội dung.',
      'Google Play từ chối cài đặt ứng dụng.'
    ],
    correctAnswers: [1],
    explanation: 'SDK luôn có Default BDS Theme làm fallback an toàn, đảm bảo app luôn hiển thị chuẩn mực.'
  },
  {
    id: 438,
    section: 'adopt',
    sectionName: 'Section 4: Android Essentials for Journeys (Adopt)',
    type: 'single',
    question: 'Hỗ trợ đa ngôn ngữ (Localization) cho Journey OOTB được thực hiện bằng cách nào?',
    options: [
      'Cung cấp các file strings.xml trong các thư mục tài nguyên tương ứng (như values-vi/strings.xml, values-en/strings.xml).',
      'Tự động dịch bằng Google Dịch runtime.',
      'Viết lại mã nguồn Journey cho từng quốc gia.',
      'Bắt buộc người dùng chỉ được dùng tiếng Anh.'
    ],
    correctAnswers: [0],
    explanation: 'Hệ thống sử dụng cơ chế đa ngôn ngữ chuẩn của Android qua các thư mục res/values-xx/strings.xml.'
  }
]
