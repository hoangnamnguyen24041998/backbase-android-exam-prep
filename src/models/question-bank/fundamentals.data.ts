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
    question: 'Trong triết lý phát triển sản phẩm trên nền tảng Backbase Engagement Banking Platform (EBP), nguyên tắc cốt lõi "Adopt before Adapt" mang ý nghĩa gì đối với đội ngũ phát triển Android?',
    options: [
      'Luôn tự viết lại toàn bộ UI và Business Logic từ đầu bằng Jetpack Compose nhưng sử dụng chung OpenAPI spec của Backbase.',
      'Ưu tiên sử dụng tối đa các Modelbank Journeys và OOTB (Out-of-the-Box) capabilities thông qua cấu hình và theming; chỉ tùy biến sâu (Extend) hoặc xây mới (Build) khi có yêu cầu nghiệp vụ đặc thù thực sự khác biệt.',
      'Sao chép (clone) mã nguồn của các Backbase Journey về repository nội bộ của ngân hàng để tự do chỉnh sửa trực tiếp các file Kotlin bên trong.',
      'Chỉ sử dụng tầng mạng (Networking SDK) của Backbase và xây dựng lại toàn bộ kiến trúc màn hình để tránh phụ thuộc vào chu kỳ nâng cấp của hãng.'
    ],
    correctAnswers: [1],
    explanation: 'Triết lý "Adopt before Adapt" khuyến nghị ngân hàng tận dụng tối đa 80% tính năng Out-of-the-Box (OOTB) sẵn có thông qua cấu hình (Configuration), Feature Flags và Mobile Design System (Theming) để rút ngắn Time-to-Market và đảm bảo khả năng nâng cấp (upgradeability) mượt mà khi Backbase ra phiên bản mới. Chỉ 20% phần tạo lợi thế cạnh tranh đặc thù mới nên Extend hoặc Build.'
  },
  {
    id: 102,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Quy trình triển khai chuẩn "Backbase Way of Working" bao gồm 4 giai đoạn chính diễn ra theo thứ tự nào sau đây?',
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
    question: 'Những thành phần nào sau đây thuộc lớp kiến trúc tổng thể của Backbase Engagement Banking Platform (EBP)? (Chọn 3 đáp án đúng)',
    options: [
      'Experience Layer (Web & Mobile Journeys, Retail/Business/Wealth Banking Apps)',
      'Digital Banking Services / Banking Business Services (DBS / BBS - các microservices nghiệp vụ ngân hàng như Accounts, Payments, Cards)',
      'Integration Services / Grand Central (kết nối và điều phối dữ liệu với Core Banking và bên thứ 3)',
      'Hệ quản trị cơ sở dữ liệu lõi Core Banking truyền thống thay thế hoàn toàn hệ thống AS400/Mainframe của ngân hàng'
    ],
    correctAnswers: [0, 1, 2],
    explanation: 'Kiến trúc Backbase EBP đứng phía trên hệ thống Core Banking (System of Record) chứ không thay thế Core Banking. Nó bao gồm: 1) Integration Layer (Grand Central / Integration Services) để giao tiếp với Core Banking; 2) Capability Layer (Digital Banking Services - DBS/BBS & Identity/Access Control); và 3) Experience Layer (Mobile Android/iOS Journeys & Web Widgets).'
  },
  {
    id: 104,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Trong thuật ngữ kiến trúc Mobile của Backbase, một "Journey" (ví dụ: Accounts & Transactions Journey, Cards Management Journey) được định nghĩa chính xác nhất là gì?',
    options: [
      'Một UI Component đơn lẻ như một nút bấm (Button) hoặc một ô nhập liệu (TextField) đã được gắn style của ngân hàng.',
      'Một thư viện độc lập đóng gói trọn vẹn một luồng nghiệp vụ người dùng hoàn chỉnh (End-to-End user flow) bao gồm cả UI Screens, ViewModels, UseCases interface và Navigation nội bộ.',
      'Một tập hợp các file cấu hình JSON tĩnh chứa danh sách URL của máy chủ backend.',
      'Một ứng dụng Android APK độc lập được cài đặt riêng rẽ trên máy người dùng cho từng tính năng ngân hàng.'
    ],
    correctAnswers: [1],
    explanation: 'Trong Backbase Mobile Architecture, một Journey là một module tính năng độc lập (Feature Module) giải quyết một luồng nghiệp vụ hoàn chỉnh của người dùng (ví dụ: Xem danh sách tài khoản và chi tiết giao dịch, hoặc Quản lý thẻ). Một Journey bao gồm Presentation layer (Screens, ViewModels), Domain contract (UseCase interfaces) và Navigation graph nội bộ của riêng luồng đó.'
  },
  {
    id: 105,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Tại sao Backbase tuyệt đối khuyến cáo KHÔNG được decompile hoặc chỉnh sửa trực tiếp mã nguồn bên trong các thư viện AAR của Backbase Journey (Forking)?',
    options: [
      'Vì trình biên dịch Kotlin sẽ báo lỗi cú pháp ngay lập tức nếu copy code từ AAR.',
      'Vì việc Forking làm mất hoàn toàn khả năng nhận các bản vá bảo mật, sửa lỗi và tính năng mới tự động từ Backbase (Zero Upgradeability), biến dự án thành gánh nặng bảo trì khổng lồ.',
      'Vì hệ điều hành Android không cho phép đóng gói các class trùng tên package.',
      'Vì Backbase SDK sẽ tự động xóa dữ liệu máy ảo nếu phát hiện file AAR bị giải nén.'
    ],
    correctAnswers: [1],
    explanation: 'Khi một dự án thực hiện Forking (sao chép code OOTB ra ngoài để sửa trực tiếp), nhánh code đó sẽ bị tách rời khỏi lộ trình phát triển chính thức của Backbase. Mỗi khi Backbase tung ra bản cập nhật bảo mật hoặc nâng cấp phiên bản lớn, đội dự án sẽ phải merge thủ công hàng nghìn dòng code, gây rủi ro lỗi nghiêm trọng và tốn kém chi phí.'
  },
  {
    id: 106,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'multi',
    question: 'Khả năng "White-labeling" trong Backbase Mobile SDK cho phép một tập đoàn tài chính đạt được những lợi ích kỹ thuật nào sau đây từ cùng một codebase Android duy nhất? (Chọn 2 đáp án đúng)',
    options: [
      'Xây dựng nhiều ứng dụng cho các thương hiệu con hoặc phân khúc khác nhau (ví dụ: Retail Banking, Business Banking, hoặc các ngân hàng thành viên ở nhiều quốc gia) thông qua Gradle Product Flavors.',
      'Thay đổi toàn bộ bộ nhận diện thương hiệu (Màu sắc, Typography, Bo góc, Iconography, Logo) và cấu hình tính năng (Configuration/Feature Flags) cho từng bản build mà không cần sửa đổi logic của Journey.',
      'Chạy trực tiếp mã nguồn Swift của iOS bên trong máy ảo Dalvik/ART của Android.',
      'Tự động chuyển đổi ngôn ngữ lập trình từ Kotlin sang Flutter khi xuất bản ứng dụng.'
    ],
    correctAnswers: [0, 1],
    explanation: 'White-labeling trong Backbase kết hợp sức mạnh của Android Gradle Product Flavors, Mobile Design System (MDS Tokens) và Journey Configuration. Nhờ đó, từ một codebase chung, ngân hàng có thể xuất bản nhiều app cho nhiều thương hiệu/quốc gia khác nhau với giao diện và tập tính năng bật/tắt hoàn toàn riêng biệt.'
  },
  {
    id: 107,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Trong hệ sinh thái Backbase, dịch vụ "Digital Banking Services" (DBS - trước đây thường gọi là BBS) đóng vai trò gì đối với ứng dụng Mobile Android?',
    options: [
      'Cung cấp các giao diện người dùng (UI Fragments) được render sẵn dưới dạng HTML gửi về điện thoại.',
      'Cung cấp các RESTful APIs chuẩn hóa (theo đặc tả OpenAPI) đại diện cho các năng lực nghiệp vụ ngân hàng (Accounts, Payments, Contacts, Notifications, Messages...) kèm cơ chế kiểm soát quyền truy cập (Entitlements).',
      'Là công cụ biên dịch mã nguồn Kotlin trên đám mây thay cho Android Studio.',
      'Là thư viện quản lý ảnh động (Lottie animations) trên thiết bị di động.'
    ],
    correctAnswers: [1],
    explanation: 'Digital Banking Services (DBS) là tập hợp các microservices cốt lõi ở tầng Capability của Backbase. Chúng cung cấp các API chuẩn OpenAPI để ứng dụng Mobile giao tiếp thông qua các thư viện GenClient (như Accounts GenClient, Arrangements GenClient, Payment Orders GenClient...).'
  },
  {
    id: 108,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Khi phân tích yêu cầu của khách hàng trong giai đoạn "Discover", nếu một yêu cầu nghiệp vụ chỉ khác biệt nhỏ về bố cục hiển thị so với OOTB Journey nhưng không mang lại giá trị kinh doanh cốt lõi, chuyên gia tư vấn kỹ thuật Backbase nên làm gì?',
    options: [
      'Đồng ý viết lại toàn bộ màn hình đó từ con số 0 (Build from scratch) để chiều lòng khách hàng.',
      'Thách thức tích cực (Challenge) yêu cầu đó bằng cách chứng minh lợi ích về chi phí sở hữu (TCO), thời gian ra mắt (Time-to-Market) và khả năng nâng cấp khi giữ nguyên thiết kế chuẩn OOTB (Adopt).',
      'Yêu cầu đội ngũ Backend sửa đổi cấu trúc bảng trong Core Banking.',
      'Tắt toàn bộ tính năng đó khỏi ứng dụng di động.'
    ],
    correctAnswers: [1],
    explanation: 'Một phần quan trọng của Backbase Way of Working trong giai đoạn Discover là hướng dẫn khách hàng bám sát chuẩn OOTB ("Stay close to standard"). Nếu sự khác biệt UI không tạo ra giá trị kinh doanh vượt trội, việc thuyết phục khách hàng Adopt OOTB sẽ giúp giảm mạnh tổng chi phí sở hữu (Total Cost of Ownership - TCO) và rủi ro bảo trì.'
  },
  {
    id: 109,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Khái niệm "Modelbank" trong nền tảng Backbase là gì?',
    options: [
      'Một ngân hàng thương mại thực tế có trụ sở tại Amsterdam chuyên cho vay mua nhà.',
      'Một ứng dụng ngân hàng tham chiếu hoàn chỉnh (Reference Implementation) được lắp ghép sẵn từ các OOTB Journeys, Design System và cấu hình mẫu tốt nhất theo từng phân khúc (Retail, SME, Wealth), dùng làm điểm khởi đầu (accelerator) cho mọi dự án.',
      'Một bộ công cụ mô phỏng máy học (Machine Learning Model) dùng để chấm điểm tín dụng.',
      'Một plugin kiểm tra lỗi chính tả trong Android Studio.'
    ],
    correctAnswers: [1],
    explanation: 'Modelbank là ứng dụng mẫu chuẩn mực do Backbase xây dựng sẵn, tích hợp đầy đủ các Journeys, UseCases, Navigation và Design System theo đúng best practices cho từng phân khúc (Retail, Business/SME, Wealth). Các dự án thực tế sẽ khởi tạo từ Modelbank để có ngay một ứng dụng chạy được từ ngày đầu tiên.'
  },
  {
    id: 110,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'multi',
    question: 'Trong kiến trúc bảo mật và phân quyền của Backbase EBP, dịch vụ Identity & Access Control (Entitlements) đảm nhiệm những vai trò nào đối với ứng dụng Mobile? (Chọn 2 đáp án đúng)',
    options: [
      'Xác thực danh tính người dùng (Authentication) dựa trên chuẩn OAuth2 / OpenID Connect (OIDC) kết hợp với Keycloak/Identity Server.',
      'Kiểm soát phân quyền chi tiết (Fine-grained Authorization / Entitlements) dựa trên Legal Entity, Service Agreement, Job Role và Function Groups để quyết định người dùng được phép xem hay thực hiện hành động nào trên App.',
      'Tự động nén dung lượng file ảnh PNG trong thư mục res/drawable của dự án Android.',
      'Thay thế hoàn toàn hệ thống quản lý bộ nhớ Garbage Collector của máy ảo Android.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Backbase Identity (xây dựng trên nền tảng mở rộng của Keycloak/OIDC) quản lý xác thực (Authentication, FIDO2/Biometrics) và Access Control (Entitlements) quản lý phân quyền chi tiết (Service Agreement, Data Groups, Function Groups). Trên Mobile, các Journey có thể ẩn/hiện hoặc khóa tính năng dựa trên quyền (Entitlements) của user hiện tại.'
  },
  {
    id: 111,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Sự khác biệt cốt lõi giữa việc "Adopt" một Journey và "Extend" một Journey trong dự án Backbase Android là gì?',
    options: [
      'Adopt yêu cầu viết lại toàn bộ UseCase, còn Extend chỉ đổi màu sắc trong file XML.',
      'Adopt là cấu hình các tham số, bật/tắt feature flags và áp dụng bộ nhận diện thương hiệu (MDS Theme) mà không thay đổi hành vi/luồng nghiệp vụ; trong khi Extend là sử dụng các hook/extension points (Custom UseCase, Decorator, Screen Factory, Slot API) để can thiệp sâu hơn vào dữ liệu hoặc màn hình.',
      'Adopt chỉ áp dụng cho ứng dụng iOS, còn Extend chỉ áp dụng cho ứng dụng Android.',
      'Không có sự khác biệt nào, hai thuật ngữ này hoàn toàn đồng nghĩa trong tài liệu Backbase.'
    ],
    correctAnswers: [1],
    explanation: 'Trong thang độ tùy biến của Backbase: Adopt = dùng nguyên bản OOTB + truyền Configuration object + áp dụng Theme/Tokens. Extend = giữ khung Journey OOTB nhưng can thiệp có kiểm soát thông qua các cơ chế mở rộng chính thức (như bọc Decorator quanh UseCase, truyền Custom Screen Factory hoặc chèn View vào Slot).'
  },
  {
    id: 112,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Khi nào đội ngũ phát triển Android mới nên lựa chọn phương án "Build" (xây dựng một Journey hoàn toàn mới từ đầu) thay vì "Adopt" hoặc "Extend"?',
    options: [
      'Khi ngân hàng muốn đổi màu nút bấm chính từ màu xanh dương sang màu đỏ.',
      'Khi ngân hàng muốn ẩn một trường thông tin không cần thiết trên màn hình chi tiết giao dịch mà Configuration đã hỗ trợ sẵn cờ ẩn/hiện.',
      'Khi ngân hàng triển khai một luồng nghiệp vụ hoàn toàn mới đặc thù của địa phương (ví dụ: tích hợp ví định danh điện tử quốc gia hoặc mua vé số nội địa) mà Backbase chưa có bất kỳ OOTB Journey nào tương ứng.',
      'Khi lập trình viên mới vào dự án chưa kịp đọc tài liệu về Configuration của OOTB Journey.'
    ],
    correctAnswers: [2],
    explanation: 'Phương án "Build" chỉ được sử dụng cho các luồng nghiệp vụ hoàn toàn mới (Greenfield features) không tồn tại trong danh mục OOTB Journeys của Backbase. Khi tự Build một Journey mới, đội ngũ vẫn phải tuân thủ nghiêm ngặt chuẩn kiến trúc của Backbase (Clean Architecture, MDS Components, Router/UseCase tách rời) để đồng nhất với toàn hệ thống.'
  },
  {
    id: 113,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Trong nền tảng Backbase, lớp "Grand Central" (Integration Platform) giải quyết bài toán kiến trúc nào sau đây?',
    options: [
      'Đóng vai trò là cổng tích hợp chuẩn hóa (Integration Hub & Connectors) giúp kết nối các Digital Banking Services của Backbase với nhiều hệ thống Core Banking, hệ thống quản lý thẻ (CMS) và cổng thanh toán bên ngoài mà không làm ảnh hưởng đến ứng dụng Mobile.',
      'Là thư viện quản lý điều hướng giữa các Fragment bên trong ứng dụng Android.',
      'Là công cụ thiết kế giao diện đồ họa thay thế cho Figma.',
      'Là dịch vụ gửi thông báo đẩy thay thế cho Firebase Cloud Messaging trên thiết bị.'
    ],
    correctAnswers: [0],
    explanation: 'Grand Central là nền tảng Integration-Platform-as-a-Service (iPaaS) của Backbase, cung cấp các pre-built connectors để kết nối các dịch vụ DBS với hệ thống lõi của ngân hàng (Core Banking như Temenos, Mambu, Finastra...). Nhờ sự tách biệt này, ứng dụng Android chỉ cần làm việc với chuẩn dữ liệu thống nhất của DBS.'
  },
  {
    id: 114,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'multi',
    question: 'Những thành phần nào sau đây được cung cấp sẵn bởi tầng nền tảng "Mobile SDK / Core Foundations" của Backbase trên Android? (Chọn 3 đáp án đúng)',
    options: [
      'Mobile Design System (MDS) cung cấp hệ thống Design Tokens và kho UI Components chuẩn ngân hàng.',
      'Backbase Core & Networking SDK hỗ trợ quản lý phiên đăng nhập, bảo mật truyền tải (SSL Pinning), tự động đính kèm token và lưu trữ an toàn (Encrypted Storage).',
      'GenClients (OpenAPI generated clients) đóng gói sẵn các lệnh gọi mạng tới từng dịch vụ DBS.',
      'Bộ trình điều khiển phần cứng (Hardware Kernel Drivers) để can thiệp trực tiếp vào sóng baseband 5G của điện thoại.'
    ],
    correctAnswers: [0, 1, 2],
    explanation: 'Tầng nền tảng Mobile của Backbase cung cấp 3 trụ cột chính cho các Journey hoạt động: 1) Core SDK (Networking, Auth, Secure Storage, Logging); 2) GenClients (các thư viện client sinh tự động từ OpenAPI spec của DBS); và 3) Mobile Design System (MDS) cho giao diện đồng nhất.'
  },
  {
    id: 115,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Tỷ lệ phân bổ nỗ lực lý tưởng được Backbase khuyến nghị theo quy tắc "80/20" trong triển khai dự án có ý nghĩa gì?',
    options: [
      '80% ngân sách dành cho viết tài liệu và 20% ngân sách dành cho lập trình.',
      'Tận dụng khoảng 80% năng lực sẵn có của nền tảng (OOTB Adoption & Configuration) để tập trung 20% nguồn lực kỹ thuật vào việc mở rộng/xây dựng các tính năng tạo sự khác biệt cạnh tranh trên thị trường (Differentiation).',
      '80% mã nguồn viết bằng ngôn ngữ Java và 20% mã nguồn viết bằng Kotlin.',
      'Chỉ kiểm thử 20% số lượng màn hình và bỏ qua 80% màn hình còn lại.'
    ],
    correctAnswers: [1],
    explanation: 'Quy tắc 80/20 trong Backbase nhấn mạnh việc không "phát minh lại chiếc bánh xe" cho các tính năng ngân hàng tiêu chuẩn (đăng nhập, xem số dư, sao kê, chuyển tiền cơ bản - chiếm 80%), từ đó giải phóng nguồn lực kỹ thuật để dồn sức vào 20% các tính năng sáng tạo mang đậm bản sắc riêng của ngân hàng.'
  },
  {
    id: 116,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Trong kiến trúc sản phẩm của Backbase, một "App" (ví dụ: Retail Banking App) khác với một "Journey" ở điểm nào?',
    options: [
      'Một App chỉ chứa đúng 1 màn hình duy nhất, còn Journey chứa nhiều màn hình.',
      'App là tầng vỏ lắp ghép trên cùng (Host Application / Shell Module) có nhiệm vụ khởi tạo SDK, cấu hình Dependency Injection (Hilt/Koin), định nghĩa luồng điều hướng liên kết giữa nhiều Journeys (App-level Navigation) và áp dụng bộ Theme tổng thể.',
      'App không được phép chứa file AndroidManifest.xml, chỉ có Journey mới có AndroidManifest.xml.',
      'Journey là file thực thi cài lên máy người dùng, còn App chỉ là thư viện phụ trợ.'
    ],
    correctAnswers: [1],
    explanation: 'Application module (`:app`) đóng vai trò là chất keo kết dính (Orchestrator / Host). Nó không chứa chi tiết nghiệp vụ của từng tính năng mà chịu trách nhiệm khởi tạo `Backbase.initialize()`, nạp cấu hình DI kết nối các `UseCase` implementation với các `Journey`, và điều phối chuyển hướng giữa Journey A sang Journey B thông qua các Router implementations.'
  },
  {
    id: 117,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Lợi ích lớn nhất của việc Backbase phân tách rạch ròi giữa giao diện Journey và phần thực thi lấy dữ liệu (UseCase implementation / GenClient) là gì?',
    options: [
      'Giúp ứng dụng bắt buộc phải kết nối mạng liên tục mới mở được màn hình cài đặt.',
      'Cho phép ngân hàng giữ nguyên toàn bộ giao diện và luồng màn hình của OOTB Journey nhưng có thể dễ dàng thay thế nguồn dữ liệu (ví dụ: gọi sang một API nội bộ khác của ngân hàng hoặc kết hợp dữ liệu từ 2 microservice) thông qua việc cung cấp một Custom UseCase implementation.',
      'Làm tăng kích thước file APK lên gấp 5 lần để trông chuyên nghiệp hơn.',
      'Ngăn cản việc viết Unit Test cho tầng Presentation.'
    ],
    correctAnswers: [1],
    explanation: 'Nhờ kiến trúc phụ thuộc vào Interface (UseCase contract), Journey hoàn toàn không biết dữ liệu đến từ đâu. Ngân hàng có thể dùng OOTB UseCase (gọi chuẩn DBS thông qua GenClient) hoặc tự viết một Custom UseCase gọi tới API riêng của ngân hàng mà không cần đụng chạm tới một dòng code UI nào của Journey.'
  },
  {
    id: 118,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Khi Backbase phát hành một phiên bản Minor hoặc Patch mới cho một Journey tuân thủ Semantic Versioning (ví dụ nâng từ `5.2.0` lên `5.2.3`), điều gì được đảm bảo?',
    options: [
      'Toàn bộ tên các class cấu hình sẽ bị đổi tên ngẫu nhiên.',
      'Các bản sửa lỗi (Bug fixes) và bản vá bảo mật được cập nhật mà không gây ra thay đổi phá vỡ tương thích ngược (No Breaking API Changes) đối với cấu hình hiện tại của ứng dụng.',
      'Ứng dụng bắt buộc phải viết lại toàn bộ tầng Dependency Injection từ Koin sang Dagger 1.',
      'Cơ sở dữ liệu trên máy người dùng sẽ bị xóa sạch mà không cần hỏi ý kiến.'
    ],
    correctAnswers: [1],
    explanation: 'Backbase tuân thủ chặt chẽ Semantic Versioning (`MAJOR.MINOR.PATCH`). Các bản cập nhật `PATCH` (và `MINOR` tương thích ngược) đảm bảo các public APIs, Configuration DSL và UseCase interfaces không bị phá vỡ, giúp các ngân hàng tuân thủ triết lý Adopt có thể nâng cấp thư viện dễ dàng thông qua việc nâng version của Backbase BOM.'
  },
  {
    id: 119,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'multi',
    question: 'Những phát biểu nào sau đây mô tả đúng về vai trò của "GenClient" trong hệ sinh thái Backbase Android? (Chọn 2 đáp án đúng)',
    options: [
      'Là các thư viện Kotlin/Java client được sinh tự động (auto-generated) từ tài liệu đặc tả OpenAPI (Swagger) của các dịch vụ Digital Banking Services (DBS).',
      'Cung cấp các phương thức gọi mạng bất đồng bộ (hỗ trợ Kotlin Coroutines `suspend` hoặc Callbacks) và các Data Models (DTOs) phản ánh chính xác hợp đồng API của backend.',
      'Là công cụ tự động vẽ giao diện Jetpack Compose từ file ảnh chụp màn hình.',
      'Chứa trực tiếp các đối tượng `Fragment` và `RecyclerView.Adapter` để hiển thị danh sách tài khoản.'
    ],
    correctAnswers: [0, 1],
    explanation: 'GenClients nằm ở tầng Data, được sinh tự động từ OpenAPI spec của từng dịch vụ DBS (ví dụ: `client-accounts`, `client-arrangement-manager`, `client-payment-order`). Chúng cung cấp các API class và DTO models để tầng UseCase implementation gọi xuống mạng một cách an toàn kiểu dữ liệu (type-safe).'
  },
  {
    id: 120,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Trong trường hợp ngân hàng muốn thay đổi một chuỗi văn bản (copywriting) hoặc thêm bản dịch ngôn ngữ tiếng Việt cho một OOTB Journey trên Android, phương thức chuẩn theo tinh thần "Adopt" là gì?',
    options: [
      'Dùng công cụ hex editor để sửa trực tiếp file `classes.dex` sau khi build APK.',
      'Ghi đè (override) các khóa tài nguyên chuỗi (`<string name="...">`) tương ứng của Journey ngay trong file `res/values/strings.xml` hoặc `res/values-vi/strings.xml` của module ứng dụng (hoặc thông qua DeferredText trong Configuration).',
      'Viết một AccessibilityService chạy ngầm để đọc màn hình và vẽ đè chữ tiếng Việt lên trên.',
      'Yêu cầu người dùng cài đặt thêm phần mềm từ điển bên ngoài.'
    ],
    correctAnswers: [1],
    explanation: 'Hệ thống Android Resource Merging và cơ chế `DeferredText` của Backbase cho phép ứng dụng dễ dàng ghi đè bất kỳ chuỗi văn bản nào của Journey bằng cách khai báo lại `<string name="bb_...">` trong thư mục `res/values-<locale>/strings.xml` của module `:app` hoặc truyền qua đối tượng Configuration mà không cần sửa code Journey.'
  },
  {
    id: 121,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Tại sao Backbase lại tách riêng module Journey (ví dụ: `accounts-and-transactions-journey`) và module UseCase implementation mặc định (ví dụ: `accounts-and-transactions-use-case` / `arrangements-use-case`) thành các artifact độc lập?',
    options: [
      'Do giới hạn của Gradle không cho phép một module chứa quá 10 file Kotlin.',
      'Để áp dụng nguyên lý Đảo ngược phụ thuộc (Dependency Inversion Principle): Journey chỉ định nghĩa các UseCase interfaces, còn module UseCase chứa phần thực thi gọi DBS GenClient. Nếu ngân hàng tự viết Custom UseCase hoàn toàn mới, họ thậm chí không cần kéo artifact UseCase mặc định vào APK.',
      'Để bắt buộc lập trình viên phải khai báo gấp đôi số dòng trong file `settings.gradle.kts`.',
      'Vì module Journey được viết bằng C++ còn module UseCase được viết bằng Python.'
    ],
    correctAnswers: [1],
    explanation: 'Việc tách artifact `*-journey` (chứa UI + ViewModel + UseCase Interfaces) khỏi artifact `*-use-case` (chứa Default UseCase Implementation kết nối với DBS GenClient) giúp giảm sự phụ thuộc cứng. Ngân hàng có thể dùng bộ đôi này OOTB, hoặc giữ `*-journey` và thay thế hoàn toàn `*-use-case` bằng module tích hợp dữ liệu riêng của mình.'
  },
  {
    id: 122,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Khái niệm "Entitlements-driven UI" trong các Backbase Mobile Journeys mang lại trải nghiệm gì cho người dùng cuối?',
    options: [
      'Giao diện ứng dụng tự động thay đổi độ sáng màn hình theo dung lượng pin còn lại.',
      'Các nút chức năng, tab điều hướng hoặc hạn mức giao dịch trên màn hình Journey sẽ tự động ẩn/hiện hoặc vô hiệu hóa dựa trên danh sách quyền hạn (User Permissions / Function Groups) mà backend trả về cho tài khoản đăng nhập đó.',
      'Mọi người dùng miễn phí đều có quyền quản trị viên cao nhất trên hệ thống.',
      'Ứng dụng tự động tải thêm quảng cáo nếu người dùng có số dư tài khoản thấp.'
    ],
    correctAnswers: [1],
    explanation: 'Trong ngân hàng (đặc biệt là SME/Business Banking hoặc phân quyền hộ gia đình), mỗi người dùng có quyền hạn khác nhau (ví dụ: người chỉ có quyền Xem sao kê, người có quyền Tạo lệnh chuyển tiền, người có quyền Phê duyệt). Các Backbase Journey hỗ trợ kiểm tra Entitlements để tự động điều chỉnh trạng thái hiển thị của các hành động trên UI.'
  },
  {
    id: 123,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Triết lý phát triển ứng dụng di động theo chuẩn Backbase (Adopt, Extend, Build) đưa ra thứ tự ưu tiên lựa chọn giải pháp cho một yêu cầu nghiệp vụ mới như thế nào?',
    options: [
      'Build mới -> Extend -> Adopt.',
      'Adopt (Sử dụng OOTB) -> Extend (Mở rộng tính năng có sẵn) -> Build (Xây dựng mới hoàn toàn).',
      'Extend -> Build -> Adopt.',
      'Tạo một module song song và viết lại toàn bộ UI.'
    ],
    correctAnswers: [1],
    explanation: 'Triết lý chuẩn của Backbase là Adopt (tận dụng tối đa các Out-Of-The-Box Journeys và configurations), nếu không đáp ứng đủ mới tiến hành Extend (mở rộng UI/Logic của Journey), và cuối cùng mới Build mới khi nghiệp vụ hoàn toàn riêng biệt.'
  },
  {
    id: 124,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Lợi ích cốt lõi của kiến trúc Widget/Journey-based trong Backbase Android SDK là gì?',
    options: [
      'Cho phép tất cả các Journey truy cập trực tiếp vào cơ sở dữ liệu của nhau.',
      'Tăng tốc độ biên dịch bằng cách bỏ qua quá trình kiểm tra kiểu dữ liệu (Type checking).',
      'Tách biệt các tính năng kinh doanh thành các module độc lập, tái sử dụng, dễ nâng cấp và mở rộng (Modularization).',
      'Tự động chuyển đổi mã nguồn Kotlin sang Swift cho iOS.'
    ],
    correctAnswers: [2],
    explanation: 'Kiến trúc Journeys/Widgets giúp đóng gói độc lập từng tính năng kinh doanh (như Accounts, Transfers, Cards). Điều này giảm tính phụ thuộc chặt chẽ (tight-coupling), hỗ trợ phát triển song song và nâng cấp phiên bản SDK dễ dàng.'
  },
  {
    id: 125,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'multi',
    question: 'Những nguyên tắc nào dưới đây BẮT BUỘC tuân thủ khi tích hợp một Backbase Journey OOTB vào ứng dụng Integrator? (Chọn 2)',
    options: [
      'Cần sửa đổi trực tiếp các file class trong file .aar của SDK để thêm tính năng.',
      'Không được sửa đổi mã nguồn SDK có sẵn; việc tùy biến logic phải thực hiện qua cơ chế Override/Decorator hoặc Configuration.',
      'Khóa phiên bản các Journey thông qua Backbase Bill of Materials (BOM).',
      'Copy toàn bộ mã nguồn của Journey từ thư viện vào thư mục app để tiện quản lý.'
    ],
    correctAnswers: [1, 2],
    explanation: 'Tuyệt đối không can thiệp trực tiếp vào mã nguồn đã đóng gói trong SDK (.aar). Việc quản lý phiên bản tập trung bắt buộc dùng Backbase BOM để đảm bảo tính tương thích giữa các module.'
  },
  {
    id: 126,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Khi khách hàng yêu cầu đổi tông màu chủ đạo từ xanh dương sang đỏ cho toàn bộ ứng dụng Banking, cách tiếp cận chuẩn nhất trong Backbase Mobile Design System (MDS) là gì?',
    options: [
      'Mở từng Layout XML trong các Journey và sửa thuộc tính android:background.',
      'Ghi đè (Override) các Design Tokens về màu sắc (Color Tokens) tương ứng trong Theme của Integrator App.',
      'Viết lại toàn bộ màn hình bằng Jetpack Compose.',
      'Tạo một Activity mới có màu đỏ và khởi chạy lại app.'
    ],
    correctAnswers: [1],
    explanation: 'Backbase MDS sử dụng hệ thống Design Tokens. Để thay đổi giao diện/thương hiệu (White-labeling), chỉ cần ghi đè các token màu sắc trong styles.xml hoặc Compose Theme ở module Integrator mà không cần can thiệp UI code của các Journey.'
  },
  {
    id: 127,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Trong Backbase SDK, thành phần nào chịu trách nhiệm quản lý phiên làm việc của người dùng (Session management) và cấu hình ứng dụng toàn cục?',
    options: [
      'Backbase.initialize(...) và Core SDK.',
      'RoomDatabase.',
      'WorkManager.',
      'AppNavigationRouter.'
    ],
    correctAnswers: [0],
    explanation: 'Backbase.initialize(context, configuration) khởi tạo Core SDK, thiết lập ngữ cảnh lưu trữ an toàn, quản lý cấu hình hệ thống và khởi động các service quản lý phiên làm việc.'
  },
  {
    id: 128,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Tại sao Backbase khuyến nghị triển khai phương thức "Configuration First" trước khi thực hiện viết code tùy biến?',
    options: [
      'Vì Configuration không tốn bộ nhớ RAM.',
      'Để tận dụng tối đa tính năng có sẵn, giảm chi phí bảo trì và đảm bảo lộ trình nâng cấp (Upgrade Path) mượt mà trong tương lai.',
      'Để tránh phải sử dụng Hilt Dependency Injection.',
      'Để ứng dụng chạy không cần kết nối mạng.'
    ],
    correctAnswers: [1],
    explanation: 'Cấu hình bằng file/provider được SDK hỗ trợ chính thức. Khi nâng cấp SDK lên bản mới, các cấu hình này giữ nguyên khả năng tương thích cao hơn rất nhiều so với việc viết code tùy biến đè lên SDK.'
  },
  {
    id: 129,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Thành phần "Integrator App" trong dự án Backbase đóng vai trò gì?',
    options: [
      'Chứa toàn bộ logic nghiệp vụ ngân hàng cốt lõi (Core Banking).',
      'Là module ứng dụng chính (thường là module app), kết nối các Journey độc lập, cấu hình Theme, DI Graph và điểm khởi chạy ứng dụng.',
      'Là một server backend trung gian kết nối tới cơ sở dữ liệu.',
      'Là công cụ tự động phát sinh file APK mà không cần Android Studio.'
    ],
    correctAnswers: [1],
    explanation: 'Integrator App đóng vai trò điểm lắp ráp (Assembly point), nơi tích hợp các module Journey, cài đặt Dependency Injection toàn cục, cấu hình theme/labels và điều hướng mức cao nhất.'
  },
  {
    id: 130,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'multi',
    question: 'Các tính năng nào sau đây thường được quản lý ở cấp độ Core SDK của Backbase? (Chọn 2)',
    options: [
      'Quản lý kết nối mạng và Token Authentication (Network Engine).',
      'Thiết kế giao diện chi tiết cho màn hình Chuyển tiền.',
      'Cơ chế Bảo mật, Mã hóa dữ liệu cục bộ và Security Checks.',
      'Validate định dạng Số điện thoại riêng của từng ngân hàng địa phương.'
    ],
    correctAnswers: [0, 2],
    explanation: 'Core SDK cung cấp các hạ tầng dùng chung như Network Engine (OkHttp, Auth, Headers) và Security Layer (Storage Encryption, Root Detection). Các màn hình và nghiệp vụ cụ thể thuộc về tầng Journey.'
  },
  {
    id: 131,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Thuật ngữ "White-labeling" trong ngữ cảnh phát triển sản phẩm di động Backbase nghĩa là gì?',
    options: [
      'Việc xóa sạch toàn bộ logcat trước khi build app.',
      'Khả năng tái sử dụng một bộ mã nguồn duy nhất để tạo ra các ứng dụng cho nhiều ngân hàng/thương hiệu khác nhau bằng cách tùy biến Theme, Assets và Config.',
      'Việc chuyển đổi ứng dụng sang chế độ Dark Mode.',
      'Việc sử dụng giao diện trắng đen để tiết kiệm pin.'
    ],
    correctAnswers: [1],
    explanation: 'White-labeling cho phép tùy biến ứng dụng chuẩn của Backbase theo diện mạo, ngôn ngữ và bộ nhận diện thương hiệu riêng của từng đối tác ngân hàng mà không phải tạo các kho mã nguồn (repository) riêng biệt.'
  },
  {
    id: 132,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Khái niệm "Upgrade Path" bị ảnh hưởng tiêu cực nhất bởi hành vi nào sau đây của lập trình viên?',
    options: [
      'Thay đổi giá trị của một string key trong strings.xml.',
      'Fork hoặc copy trực tiếp mã nguồn Journey OOTB vào dự án và chỉnh sửa nội bộ.',
      'Đăng ký một Interceptor mới vào OkHttp Client.',
      'Cập nhật phiên bản Backbase BOM trong file build.gradle.kts.'
    ],
    correctAnswers: [1],
    explanation: 'Việc copy/fork mã nguồn OOTB khiến bạn mất khả năng tự động cập nhật bản vá/tính năng mới khi Backbase phát hành phiên bản SDK tiếp theo, tạo ra khoản nợ kỹ thuật (Technical Debt) lớn.'
  },
  {
    id: 133,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Backbase EBP giải quyết bài toán cốt lõi nào cho ngân hàng đa kênh?',
    options: [
      'Xóa bỏ hoàn toàn Core Banking.',
      'Thống nhất trải nghiệm số (Omni-channel) và tách lớp tương tác (Engagement Layer) khỏi các hệ thống lõi cũ kỹ.',
      'Tự động sao lưu dữ liệu lên đám mây công cộng.',
      'Thay thế hoàn toàn nhân viên tại quầy giao dịch.'
    ],
    correctAnswers: [1],
    explanation: 'EBP đóng vai trò lớp trung gian thống nhất trải nghiệm khách hàng đa kênh và độc lập với Core Banking.'
  },
  {
    id: 134,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'multi',
    question: 'Khái niệm \'Out-of-the-Box\' (OOTB) trong Backbase đảm bảo điều gì? (Chọn 2)',
    options: [
      'Đầy đủ tính năng nghiệp vụ ngân hàng được kiểm thử kỹ lưỡng.',
      'Khả năng triển khai nhanh (Time-to-market) mà không cần code lại từ đầu.',
      'Không cho phép bất kỳ tùy biến hay mở rộng nào.',
      'Miễn trừ ngân hàng khỏi các quy định tuân thủ bảo mật địa phương.'
    ],
    correctAnswers: [0, 1],
    explanation: 'OOTB mang lại giải pháp nghiệp vụ chuẩn hóa, kiểm thử sẵn và triển khai nhanh chóng.'
  },
  {
    id: 135,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Giai đoạn nào trong \'Way of Working\' tập trung vào việc đánh giá khoảng cách giữa yêu cầu khách hàng và tính năng OOTB?',
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
    question: 'Tại sao việc tùy biến giao diện trong Backbase luôn ưu tiên qua Design Tokens thay vì can thiệp file layout?',
    options: [
      'Tránh làm tăng kích thước APK.',
      'Đảm bảo tính nhất quán của Design System và giữ nguyên Upgrade Path của Journey SDK.',
      'Do Android Studio không cho phép sửa layout XML.',
      'Để ứng dụng không cần quyền truy cập Internet.'
    ],
    correctAnswers: [1],
    explanation: 'Design Tokens tách biệt hoàn toàn nhận diện thương hiệu khỏi logic hiển thị, bảo vệ Upgrade Path.'
  },
  {
    id: 137,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Khái niệm \'Business Journey\' trong Backbase Android được hiểu là gì?',
    options: [
      'Một module thư viện độc lập đóng gói trọn vẹn UI, Domain logic và kết nối dữ liệu cho một nghiệp vụ ngân hàng.',
      'Một Activity duy nhất chứa toàn bộ màn hình của app.',
      'Một tập tin JSON cấu hình API endpoint.',
      'Một database table trong SQLite.'
    ],
    correctAnswers: [0],
    explanation: 'Journey là một Feature Module độc lập hoàn chỉnh theo chuẩn Clean Architecture.'
  },
  {
    id: 138,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'multi',
    question: 'Những lợi ích chính khi sử dụng kiến trúc phân rã Journey độc lập là gì? (Chọn 2)',
    options: [
      'Các đội ngũ phát triển có thể làm việc song song trên các Journey khác nhau mà không bị xung đột code.',
      'Dễ dàng nâng cấp hoặc thay thế từng Journey độc lập mà không ảnh hưởng tới toàn bộ ứng dụng.',
      'Tất cả Journey đều dùng chung một ViewModel duy nhất.',
      'Bắt buộc tất cả Journey phải biên dịch thành file APK riêng.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Phân rã Journey hỗ trợ phát triển song song (parallel development) và nâng cấp độc lập.'
  },
  {
    id: 139,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Khi ngân hàng yêu cầu một tính năng hoàn toàn mới chưa có trong OOTB (như Đặt vé máy bay), hướng tiếp cận chuẩn là gì?',
    options: [
      'Sửa trực tiếp mã nguồn của Accounts Journey.',
      'Tiến hành Build một Custom Journey mới tuân thủ Clean Architecture và Design System của Backbase.',
      'Từ chối yêu cầu của ngân hàng.',
      'Viết mã trực tiếp trong file AndroidManifest.'
    ],
    correctAnswers: [1],
    explanation: 'Yêu cầu nghiệp vụ mới hoàn toàn nằm ngoài OOTB được xử lý bằng cách Build Custom Journey riêng.'
  },
  {
    id: 140,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Backbase Mobile SDK hỗ trợ các ngôn ngữ và nền tảng native nào?',
    options: [
      'Flutter và React Native.',
      'Swift (iOS) và Kotlin (Android).',
      'C# Xamarin và Ionic.',
      'PhoneGap và Cordova.'
    ],
    correctAnswers: [1],
    explanation: 'Backbase Mobile SDK phát triển Native 100% bằng Kotlin cho Android và Swift cho iOS.'
  },
  {
    id: 141,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Vai trò của Digital Banking Services (BBS/DBS) trong hệ thống Backbase là gì?',
    options: [
      'Cung cấp microservices backend xử lý nghiệp vụ ngân hàng và điều phối kết nối với Core Banking.',
      'Render giao diện trực tiếp trên điện thoại người dùng.',
      'Đóng gói ứng dụng thành file APK.',
      'Quản trị phân quyền trên Google Play Store.'
    ],
    correctAnswers: [0],
    explanation: 'DBS/BBS là hệ thống Backend Microservices đóng vai trò trung tâm điều phối nghiệp vụ.'
  },
  {
    id: 142,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'multi',
    question: 'Điều gì xảy ra khi vi phạm nguyên tắc \'Adopt before Adapt\' bằng cách sửa mã nguồn SDK? (Chọn 2)',
    options: [
      'Gãy vỡ lộ trình nâng cấp (Upgrade Path), gây khó khăn lớn khi cập nhật các bản vá bảo mật từ Backbase.',
      'Chi phí bảo trì mã nguồn tăng cao đột biến trong các giai đoạn tiếp theo.',
      'Ứng dụng chạy nhanh gấp đôi trên tất cả thiết bị.',
      'Google Play tự động cấp chứng chỉ bảo mật cao nhất.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Sửa mã nguồn SDK làm mất khả năng nâng cấp tự động và gây nợ kỹ thuật bảo trì khổng lồ.'
  },
  {
    id: 143,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Triết lý \'Omni-channel\' của Backbase đảm bảo điều gì cho khách hàng?',
    options: [
      'Khách hàng bắt buộc phải dùng cùng lúc cả điện thoại và máy tính.',
      'Trải nghiệm, dữ liệu và trạng thái giao dịch nhất quán xuyên suốt Mobile, Web và tại Quầy giao dịch.',
      'Tất cả kênh giao dịch đều dùng chung một mã nguồn HTML.',
      'Tốc độ mạng của khách hàng luôn đạt mức tối đa.'
    ],
    correctAnswers: [1],
    explanation: 'Omni-channel đảm bảo tính liền mạch và đồng bộ trạng thái giao dịch trên mọi kênh tương tác.'
  },
  {
    id: 144,
    section: 'fundamentals',
    sectionName: 'Section 1: Backbase Fundamentals',
    type: 'single',
    question: 'Khái niệm \'Integrator Module\' là gì?',
    options: [
      'Mã nguồn lõi do Backbase phát hành đóng gói dưới dạng jar/aar.',
      'Module cấp cao nhất của dự án ngân hàng, nơi lắp ráp, cấu hình theme, DI và điều hướng các Journey.',
      'Máy chủ cơ sở dữ liệu của Core Banking.',
      'Công cụ biên dịch mã nguồn của Gradle.'
    ],
    correctAnswers: [1],
    explanation: 'Integrator Module là tầng ứng dụng của khách hàng đóng vai trò kết nối và cấu hình toàn bộ hệ thống.'
  }
]
