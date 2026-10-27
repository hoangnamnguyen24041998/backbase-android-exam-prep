import type { Question } from '../exam.types'

/**
 * Section 5: Android Essentials for Journeys (Extend and Build)
 * Quota in Exam: 22 questions
 * Pool Size: 37 questions
 */
export const extendBuildQuestions: Question[] = [
  {
    id: 501,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Khi ngân hàng muốn giữ nguyên logic gọi API của một OOTB `AccountsUseCase` (ví dụ `ArrangementsUseCaseImpl`), nhưng muốn thực hiện thêm bước **ghi log Analytics**, **lọc bỏ các tài khoản đã đóng**, hoặc **làm giàu dữ liệu (data enrichment)** trước khi trả kết quả về cho Journey, mẫu thiết kế (Design Pattern) nào được Backbase khuyến nghị sử dụng nhất?',
    options: [
      'Sao chép toàn bộ 1.000 dòng code của `ArrangementsUseCaseImpl` ra một file mới rồi sửa trực tiếp.',
      'Sử dụng **Decorator Pattern** (bằng tính năng ủy quyền lớp của Kotlin `class CustomAccountsUseCase(private val delegate: AccountsUseCase) : AccountsUseCase by delegate`), chỉ ghi đè (override) đúng phương thức cần can thiệp để gọi `delegate.getAccounts()`, biến đổi kết quả rồi trả về.',
      'Sử dụng Reflection để sửa đổi bytecode của class gốc tại thời điểm chạy.',
      'Tạo một `Thread` chạy ngầm để can thiệp vào bộ nhớ RAM của `ViewModel`.'
    ],
    correctAnswers: [1],
    explanation: '**Decorator Pattern** kết hợp với từ khóa ủy quyền `by delegate` (Class Delegation) của Kotlin là kỹ thuật mở rộng UseCase đỉnh cao trong Backbase: Bạn tiêm (inject) OOTB UseCase làm `delegate`, giữ nguyên mọi phương thức khác tự động chuyển tiếp qua `by delegate`, và chỉ override đúng hàm cần tiền xử lý (pre-process) hoặc hậu xử lý (post-process) dữ liệu.'
  },
  {
    id: 502,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Khi đăng ký một `CustomAccountsUseCase` (triển khai theo mẫu Decorator bọc lấy `DefaultAccountsUseCase` của Backbase) vào đồ thị Dependency Injection của **Dagger Hilt**, làm thế nào để tiêm `DefaultAccountsUseCase` vào bên trong `CustomAccountsUseCase` mà không bị lỗi phụ thuộc vòng (Circular Dependency) do cả hai cùng implement một interface `AccountsUseCase`?',
    options: [
      'Không thể dùng Hilt cho Decorator Pattern.',
      'Sử dụng một **Custom Qualifier annotation** (ví dụ `@DefaultUseCase` hoặc tiêm trực tiếp kiểu cụ thể `DefaultAccountsUseCase` vào constructor của `CustomAccountsUseCase`), sau đó dùng `@Binds` để gắn kết interface `AccountsUseCase` (không có qualifier) với `CustomAccountsUseCase` nhằm cung cấp cho Journey.',
      'Khai báo cả hai class với cùng một `@Binds` không có qualifier trong cùng một `@Module`.',
      'Xóa từ khóa `@Inject` khỏi toàn bộ dự án.'
    ],
    correctAnswers: [1],
    explanation: 'Trong Hilt/Dagger, nếu hai binding có cùng kiểu trả về là interface `AccountsUseCase`, Dagger sẽ báo lỗi `DuplicateBindings` hoặc vòng lặp. Giải pháp chuẩn là: 1) Inject trực tiếp class cụ thể `DefaultAccountsUseCase` (hoặc gắn `@Named("ootb")` / `@OotbUseCase` qualifier) vào constructor của `CustomAccountsUseCase`; và 2) Dùng `@Binds abstract fun bindAccountsUseCase(impl: CustomAccountsUseCase): AccountsUseCase` để Journey nhận được bản Decorator.'
  },
  {
    id: 503,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Trong Dagger Hilt, sự khác biệt hiệu năng và cú pháp giữa việc sử dụng `@Binds` (trên một hàm `abstract` trong `abstract class` module) và `@Provides` (trên một hàm thông thường trong `object` module) khi ánh xạ một `CustomUseCaseImpl` sang interface `UseCase` là gì?',
    options: [
      '`@Binds` chỉ là một khai báo siêu dữ liệu lúc biên dịch báo cho Dagger biết "khi ai cần Interface X hãy dùng Implementation Y" (với điều kiện Y đã có `@Inject constructor`), giúp Dagger KHÔNG cần sinh thêm phương thức factory trung gian và giảm lượng code sinh ra; trong khi `@Provides` đòi hỏi thực thi thân hàm.',
      '`@Binds` làm chậm tốc độ chạy ứng dụng đi 10 lần so với `@Provides`.',
      '`@Provides` chỉ dùng được cho kiểu `Int` và `String`.',
      'Không được phép dùng `@Binds` với các interface của Backbase.'
    ],
    correctAnswers: [0],
    explanation: 'Khi class `CustomUseCaseImpl` do bạn viết đã có `@Inject constructor(...)`, việc dùng `@Binds abstract fun bindMyUseCase(impl: CustomUseCaseImpl): MyUseCase` là cách tối ưu nhất trong Hilt vì trình sinh mã (codegen) chỉ cần nối trực tiếp đồ thị phụ thuộc mà không cần gọi qua một hàm khởi tạo trung gian như `@Provides`.'
  },
  {
    id: 504,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Trong trường hợp một ngân hàng muốn giữ nguyên 4 màn hình của một OOTB Journey gồm 5 màn hình, nhưng muốn **thay thế hoàn toàn 1 màn hình cụ thể ở giữa luồng** (ví dụ: thay màn hình "Xác nhận giao dịch" mặc định bằng một màn hình Custom `Fragment` hoặc Custom `@Composable` có thiết kế hoàn toàn riêng), cơ chế mở rộng nào của Backbase Journey cho phép thực hiện điều này?',
    options: [
      '**Custom Screen Factory / Screen Replacement API** (thông qua việc truyền một custom factory/provider cho màn hình đó vào đối tượng `*Configuration` hoặc `NavigationConfiguration` của Journey, trong khi vẫn tái sử dụng lại `ViewModel` hoặc `Router` của Journey nếu muốn).',
      'Phải vứt bỏ toàn bộ cả 5 màn hình của Journey và code lại từ đầu.',
      'Dùng lệnh `System.exit(0)` khi người dùng đi tới màn hình thứ 3.',
      'Chặn không cho người dùng bấm nút Tiếp tục ở màn hình thứ 2.'
    ],
    correctAnswers: [0],
    explanation: 'Nhiều Backbase Journeys cung cấp cơ chế **Screen Factory / Custom Screen Provider** trong cấu hình của chúng. Nó cho phép lập trình viên hoán đổi (swap) một `Fragment` hoặc một `@Composable` screen đơn lẻ bên trong Navigation Graph nội bộ của Journey bằng màn hình tùy chỉnh của ngân hàng mà không làm đứt gãy luồng đi của 4 màn hình OOTB còn lại.'
  },
  {
    id: 505,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'multi',
    question: 'Khi triển khai một **Router / Navigator Interface** của một Backbase Journey (ví dụ: `AccountsAndTransactionsRouter` hoặc `CardsManagementRouter`) tại tầng ứng dụng (`:app` hoặc `:navigation` module), những nguyên tắc kiến trúc nào cần được tuân thủ? (Chọn 2 đáp án đúng)',
    options: [
      'Class thực thi Router (ví dụ `AppAccountsRouterImpl`) chịu trách nhiệm nhận các tín hiệu thoát hoặc chuyển tiếp từ Journey A (kèm dữ liệu tối thiểu như `arrangementId`) và sử dụng `NavController` của ứng dụng để điều hướng sang Journey B (ví dụ mở `PaymentJourney` hoặc `StatementsJourney`).',
      'Việc giữ cho các phương thức của Router chỉ nhận vào các tham số dữ liệu nguyên thủy / Domain IDs thay vì truyền trực tiếp đối tượng `Fragment` của Journey đích giúp hai Journey hoàn toàn tách rời (Decoupled Navigation).',
      'Class Router nên thực hiện các truy vấn cơ sở dữ liệu nặng đồng bộ ngay trên Main Thread trong suốt 30 giây trước khi chuyển màn hình.',
      'Mỗi lần người dùng bấm nút chuyển màn hình, Router phải khởi tạo lại `Backbase.initialize()` từ đầu.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Pattern **Router / Coordinator** là xương sống của kiến trúc điều hướng lỏng (Decoupled Navigation) trong Backbase. Journey nguồn chỉ gọi `router.onTransactionSelected(id)`. Class `RouterImpl` nằm ở tầng App sẽ nắm giữ `NavController` (hoặc `Navigator` trung tâm) để quyết định xem hành động đó sẽ đẩy người dùng tới màn hình nào tiếp theo.'
  },
  {
    id: 506,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Yêu cầu kỹ thuật của ngân hàng đòi hỏi **mọi HTTP Request** gửi từ ứng dụng Android lên cổng API Gateway của Backbase (bao gồm cả các request từ OOTB GenClients và Custom APIs) đều phải tự động đính kèm các HTTP Header toàn cục như `X-Correlation-ID` (UUID mới cho mỗi request), `X-Device-Fingerprint`, và `Accept-Language`. Giải pháp kiến trúc chuẩn nhất là gì?',
    options: [
      'Sửa thủ công từng lệnh gọi API ở tất cả 50 màn hình trong ứng dụng để truyền thêm tham số header.',
      'Viết một lớp triển khai giao diện **`okhttp3.Interceptor`** (Application Interceptor), bên trong hàm `intercept(chain: Interceptor.Chain): Response` sử dụng `chain.request().newBuilder().header("X-Correlation-ID", UUID.randomUUID().toString())...build()` rồi truyền vào `chain.proceed(newRequest)`, và đăng ký Interceptor này vào chuỗi `OkHttpClient` gốc của Backbase SDK.',
      'Gửi các thông tin header đó qua tin nhắn SMS song song với mỗi lệnh gọi HTTP.',
      'Lưu các giá trị header vào tên file ảnh đại diện của người dùng.'
    ],
    correctAnswers: [1],
    explanation: 'Sử dụng **OkHttp `Interceptor`** đăng ký ở tầng `OkHttpClient` dùng chung (Core Networking) là cách tiếp cận chuẩn mực nhất cho các mối quan tâm xuyên suốt (Cross-cutting concerns). Mọi request đi qua `GenClient` hay `Retrofit` đều tự động được tiêm đầy đủ các header `X-Correlation-ID`, `X-App-Version`, `Accept-Language` một cách minh bạch.'
  },
  {
    id: 507,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Sự khác biệt quan trọng giữa **Application Interceptor** (`addInterceptor(...)`) và **Network Interceptor** (`addNetworkInterceptor(...)`) trong `OkHttpClient` là gì?',
    options: [
      '`Application Interceptor` chạy một lần duy nhất cho mỗi lệnh gọi logic ở tầng cao (ngay cả khi phản hồi được lấy từ Cache hoặc có Redirect/Retry bên dưới) và luôn được phép thực thi kể cả khi không có mạng; trong khi `Network Interceptor` chạy ngay sát tầng truyền tải vật lý trên mạng (chạy lặp lại nếu có Redirect/Retry và không chạy nếu trả về từ Cache cục bộ).',
      '`Application Interceptor` chỉ hoạt động với giao thức FTP, còn `Network Interceptor` chỉ hoạt động với giao thức Bluetooth.',
      '`Network Interceptor` được gọi trước cả khi người dùng mở ứng dụng.',
      'Hai phương thức này hoàn toàn giống hệt nhau về vị trí trong chuỗi xử lý của OkHttp.'
    ],
    correctAnswers: [0],
    explanation: 'Trong kiến trúc chuỗi của OkHttp: **Application Interceptors** nằm ở đầu tiên, thích hợp nhất để gắn các Business Headers toàn cục (`X-Correlation-ID`, `Accept-Language`) hoặc theo dõi kết quả cuối cùng trả về cho ứng dụng. **Network Interceptors** nằm giữa tầng Retry/Redirect/Cache và tầng Socket thực tế, thích hợp để kiểm tra dữ liệu nén trên đường truyền (`Content-Encoding: gzip`) hoặc thông tin kết nối TLS.'
  },
  {
    id: 508,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Khi viết Unit Test cho một `ViewModel` hoặc `UseCase` sử dụng **Kotlin Coroutines** và **`Flow` / `StateFlow`**, thư viện kiểm thử chuyên dụng nào của CashApp (thường dùng kết hợp với **JUnit** và **MockK**) giúp kiểm tra tuần tự từng giá trị phát ra (`awaitItem()`, `awaitError()`, `awaitComplete()`, `cancelAndIgnoreRemainingEvents()`) một cách trực quan và ngắn gọn nhất?',
    options: [
      '**Turbine** (`app.cash.turbine:turbine`)',
      'Glide',
      'LeakCanary',
      'Lottie'
    ],
    correctAnswers: [0],
    explanation: '**Turbine** là thư viện tiêu chuẩn vàng khi kiểm thử `Flow` / `StateFlow` / `SharedFlow` trong Kotlin. Thông qua hàm mở rộng `viewModel.uiState.test { assertEquals(UiState.Loading, awaitItem()); ... }`, Turbine tự động quản lý coroutine thu thập ngầm, bắt từng phát xạ theo đúng trình tự thời gian và báo lỗi ngay nếu còn sự kiện chưa được xác nhận.'
  },
  {
    id: 509,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'multi',
    question: 'Khi viết Unit Test cho một `ViewModel` có sử dụng `viewModelScope` (mặc định chạy trên `Dispatchers.Main`), lập trình viên cần thiết lập những gì trong class test (với thư viện `kotlinx-coroutines-test`) để bài test chạy thành công trên máy ảo JVM cục bộ (nơi không có luồng Main UI của Android)? (Chọn 2 đáp án đúng)',
    options: [
      'Sử dụng `Dispatchers.setMain(testDispatcher)` (thường đóng gói trong một JUnit `@Rule` / `TestWatcher` hoặc `@BeforeEach`) với `StandardTestDispatcher` hoặc `UnconfinedTestDispatcher`, và gọi `Dispatchers.resetMain()` trong `@AfterEach`.',
      'Bọc thân hàm kiểm thử bằng khối **`runTest { ... }`** để tự động bỏ qua thời gian chờ ảo (`delay`) và kiểm soát tiến trình thực thi của các coroutine.',
      'Bắt buộc phải cắm một chiếc điện thoại Android thật qua cáp USB mới chạy được Unit Test của `ViewModel`.',
      'Dùng `Thread.sleep(60000)` ở cuối mỗi hàm test để chờ coroutine chạy xong.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Trên môi trường Local JVM Unit Test (`src/test/`), `Dispatchers.Main` mặc định của Android không tồn tại và sẽ ném lỗi `IllegalStateException: Module with the Main dispatcher had failed to initialize`. Việc thay thế `Dispatchers.setMain(testDispatcher)` kết hợp với `runTest { ... }` giúp toàn bộ code trong `viewModelScope.launch` chạy tức thời, bỏ qua mọi `delay()` ảo và dễ dàng kiểm soát bằng `advanceUntilIdle()`.'
  },
  {
    id: 510,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Trong thư viện **MockK** dùng để viết Unit Test cho Kotlin trong dự án Backbase Android, sự khác biệt giữa `every { ... } returns ...` và `coEvery { ... } returns ...` (cũng như `verify` và `coVerify`) là gì?',
    options: [
      '`every` và `verify` dùng cho các hàm thông thường (non-suspend functions); còn **`coEvery`** và **`coVerify`** bắt buộc phải dùng khi giả lập (stub) hoặc kiểm chứng (verify) các hàm bất đồng bộ có từ khóa **`suspend`**.',
      '`coEvery` chỉ dùng để test code viết bằng ngôn ngữ COBOL.',
      '`every` chỉ chạy được vào ban ngày, còn `coEvery` chỉ chạy được vào ban đêm.',
      'Hai hàm này hoàn toàn giống nhau và có thể thay thế tùy ý mà không bao giờ báo lỗi biên dịch.'
    ],
    correctAnswers: [0],
    explanation: 'Các phương thức trong `UseCase` hoặc `GenClient` của Backbase hầu hết là các hàm `suspend`. Để giả lập hành vi của một hàm `suspend` trong MockK, bạn bắt buộc phải dùng khối `coEvery { useCase.getAccounts() } returns ...` và kiểm tra lời gọi bằng `coVerify(exactly = 1) { useCase.getAccounts() }` (tiền tố `co` viết tắt cho Coroutine).'
  },
  {
    id: 511,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Khi kiểm thử một `ViewModel` với `StandardTestDispatcher` bên trong khối `runTest` và dùng **Turbine** (`viewModel.uiState.test { ... }`), tại sao việc dùng `StandardTestDispatcher` lại hữu ích hơn `UnconfinedTestDispatcher` khi bạn muốn kiểm chứng chính xác chuỗi chuyển tiếp trạng thái từ `Idle` -> `Loading` -> `Success`?',
    options: [
      'Vì `StandardTestDispatcher` xếp hàng (queue) các coroutine mới vào bộ lập lịch ảo thay vì thực thi tham lam (eagerly) ngay lập tức, cho phép bài test kịp đăng ký thu thập và bắt được trọn vẹn từng trạng thái trung gian (`Loading` rồi mới tới `Success`) thông qua `awaitItem()`.',
      'Vì `StandardTestDispatcher` tự động kết nối tới máy chủ Production để lấy dữ liệu thật.',
      'Vì `UnconfinedTestDispatcher` làm xóa sạch ổ cứng của máy tính.',
      'Vì `StandardTestDispatcher` không cần dùng từ khóa `suspend`.'
    ],
    correctAnswers: [0],
    explanation: 'Nếu một hàm trong `ViewModel` phát ra `Loading` rồi gọi ngay một mock `UseCase` trả kết quả tức thì để phát tiếp `Success`, khi dùng `UnconfinedTestDispatcher`, cả hai trạng thái có thể chạy vèo qua trước khi bộ thu thập kịp kiểm tra, dẫn đến trạng thái `Loading` bị ghi đè mất (conflated) trong `StateFlow`. Với `StandardTestDispatcher`, bạn kiểm soát chính xác từng nhịp thực thi của coroutine.'
  },
  {
    id: 512,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Khi ngân hàng xây dựng một microservice Backend hoàn toàn mới (hoặc mở rộng thêm API mới thông qua file đặc tả `my-custom-service-openapi.yaml`), quy trình chuẩn theo phong cách Backbase để tích hợp API này vào tầng Data của ứng dụng Android là gì?',
    options: [
      'Ghép chuỗi JSON bằng tay bằng phép cộng chuỗi `"{" + name + "}"` và gửi qua `HttpURLConnection`.',
      'Sử dụng **OpenAPI Generator Gradle Plugin** (hoặc Backbase OpenAPI Codegen toolchain) để tự động sinh ra thư viện **Custom GenClient** (chứa các lớp API và DTO models chuẩn hóa) từ file đặc tả `.yaml`, sau đó tiêm GenClient này vào Custom UseCase / Repository.',
      'Chụp ảnh màn hình tài liệu Swagger rồi dùng thư viện OCR trên điện thoại để đọc chữ.',
      'Viết trực tiếp câu lệnh SQL vào trong file `strings.xml`.'
    ],
    correctAnswers: [1],
    explanation: 'Theo đúng triết lý Contract-First (API-First) của Backbase: mọi giao tiếp giữa Mobile và Backend đều xuất phát từ hợp đồng OpenAPI Specification (`.yaml` / `.json`). Sử dụng OpenAPI Generator trong quá trình build giúp tự động sinh ra client code đồng bộ với các OOTB GenClients, loại bỏ hoàn toàn lỗi gõ sai tên trường JSON thủ công.'
  },
  {
    id: 513,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'multi',
    question: 'Khi tự xây dựng một **Custom Journey** hoàn toàn mới từ đầu (Build from scratch) để tích hợp vào ứng dụng Modelbank, những chuẩn mực kiến trúc nào của Backbase cần được áp dụng cho module Journey mới này? (Chọn 3 đáp án đúng)',
    options: [
      'Định nghĩa rõ ràng một class `*Configuration` (với Kotlin DSL Builder và các giá trị mặc định dùng `DeferredText`/`DeferredDrawable`), một hoặc nhiều interface `*UseCase` cho nhu cầu dữ liệu, và interface `*Router` cho nhu cầu điều hướng thoát ra ngoài.',
      'Xây dựng giao diện bằng các thành phần của **Mobile Design System (MDS)** và tham chiếu hoàn toàn vào các Design Tokens (`BackbaseTheme` / Theme attributes) để tự động đồng bộ giao diện Sáng/Tối và White-labeling.',
      'Không phụ thuộc trực tiếp vào bất kỳ module Journey nào khác và không phụ thuộc trực tiếp vào tầng mạng cụ thể (tách rời phần triển khai `*UseCaseImpl` ra khỏi module UI của Journey).',
      'Đặt toàn bộ code của Journey mới vào chung trong 1 file `MainActivity.kt` duy nhất dài 15.000 dòng.'
    ],
    correctAnswers: [0, 1, 2],
    explanation: 'Một Custom Journey đạt chuẩn Backbase phải có cấu trúc "giống hệt như một OOTB Journey do chính Backbase phát hành": Có `*Configuration` DSL, tách biệt `*UseCase` interface khỏi implementation, điều hướng qua `*Router` interface, và sử dụng 100% MDS Design Tokens.'
  },
  {
    id: 514,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Trong các dịch vụ Digital Banking Services (DBS) của Backbase, cơ chế **Data Extensions (`additions: Map<String, String>` / Custom Additional Properties)** trên các đối tượng DTO (như `Account`, `Transaction`, `PaymentOrder`) được sử dụng như thế nào khi mở rộng tính năng trên Android?',
    options: [
      'Cho phép ngân hàng truyền tải thêm các trường dữ liệu nghiệp vụ đặc thù (ví dụ: `"taxCode"`, `"loyaltyPoints"`, `"branchCode"`) bên trong trường `additions` của payload API chuẩn mà không làm phá vỡ schema OpenAPI gốc; ở tầng Android Custom UseCase/Mapper, lập trình viên sẽ đọc từ `dto.additions["loyaltyPoints"]` để ánh xạ lên UI.',
      'Dùng để cộng hai số nguyên trong máy tính bỏ túi.',
      'Dùng để tự động cài đặt thêm ứng dụng bên thứ 3 từ cửa hàng Play Store.',
      'Trường `additions` luôn luôn bị xóa sạch bởi OkHttp trước khi tới được ứng dụng.'
    ],
    correctAnswers: [0],
    explanation: 'Cơ chế **`additions`** (Schema Extension) là một điểm mở rộng cực kỳ mạnh mẽ của Backbase DBS. Khi ngân hàng cần gửi thêm 1-2 trường dữ liệu đặc thù trong đối tượng Giao dịch hoặc Lệnh chuyển tiền, Backend đặt chúng vào map `additions`, và trên Android, lập trình viên có thể truy xuất `additions` trong Custom UseCase Decorator hoặc Custom Mapper/Slot View.'
  },
  {
    id: 515,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Giả sử bạn đang mở rộng một luồng chuyển tiền cần tích hợp bước **Xác thực Giao dịch Cường độ cao (Step-up Authentication / Out-of-Band Transaction Signing)** với Identity SDK của Backbase khi server trả về thách thức xác thực (Challenge). Luồng phối hợp kiến trúc nào là chuẩn xác nhất?',
    options: [
      'Bỏ qua yêu cầu xác thực và tự ý hiển thị màn hình "Chuyển tiền thành công" giả trên giao diện.',
      'Khi `PaymentUseCase` nhận phản hồi yêu cầu xác thực nâng cao (Challenge/Confirmation ID) từ Payment Order service, Journey/Router sẽ kích hoạt luồng phê duyệt của **Authentication / Approving SDK (Identity / FIDO / Biometric Prompt)**; sau khi người dùng ký số thành công, callback sẽ trả kết quả về để hoàn tất lệnh chuyển tiền.',
      'Yêu cầu người dùng nhập mật khẩu vào một trang web không có HTTPS.',
      'Khởi động lại điện thoại để tự động vượt qua bước kiểm tra chữ ký.'
    ],
    correctAnswers: [1],
    explanation: 'Trong kiến trúc bảo mật ngân hàng của Backbase, các giao dịch nhạy cảm (như Tạo lệnh chuyển tiền giá trị lớn, Thêm người thụ hưởng mới) sử dụng cơ chế **Transaction Signing / Step-up Authentication**. Payment Journey sẽ phối hợp (qua UseCase hoặc Router hook) với Identity/Auth SDK để hiển thị màn hình xác thực sinh trắc học/mã PIN ký thách thức mật mã trước khi lệnh được thực thi.'
  },
  {
    id: 516,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Khi sử dụng **Koin** (hoặc sự kết hợp giữa Koin trong nội bộ một số OOTB Journey và Hilt ở tầng ứng dụng) để ghi đè (override) một định nghĩa phụ thuộc mặc định (ví dụ thay thế `AccountsUseCase` mặc định bằng `CustomAccountsUseCase`), cú pháp nào trong Koin Module đảm bảo định nghĩa mới được phép ghi đè lên định nghĩa đã có?',
    options: [
      'Khai báo binding mới với `single<AccountsUseCase> { CustomAccountsUseCase(get()) }` (hoặc `factory`) trong module mở rộng được nạp sau, kết hợp cấu hình `allowOverride(true)` (hoặc `override = true` tùy phiên bản Koin) trên Koin Application.',
      'Xóa toàn bộ thư viện Koin khỏi dự án.',
      'Đặt tên class mới trùng hệt cả package lẫn tên với class cũ để gây lỗi `DuplicateClassException`.',
      'Gọi hàm `System.gc()` 10 lần liên tiếp.'
    ],
    correctAnswers: [0],
    explanation: 'Trong hệ thống DI sử dụng Koin của Modelbank, các module cấu hình mặc định có thể được nạp trước và các module tùy biến của dự án nạp sau. Việc định nghĩa lại `factory<UseCase> { CustomUseCase(...) }` với cơ chế `allowOverride(true)` cho phép thay thế mượt mà bất kỳ UseCase hay Router nào mà không cần sửa module gốc.'
  },
  {
    id: 517,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'multi',
    question: 'Khi thiết kế cơ chế **Lưu trữ bộ nhớ đệm ngoại tuyến (Offline Caching / Single Source of Truth)** trong một Custom Repository/UseCase sử dụng **Room Database** và **DBS GenClient**, mô hình luồng dữ liệu nào dưới đây mang lại trải nghiệm người dùng mượt mà nhất (Offline-first / Stale-While-Revalidate)? (Chọn 2 đáp án đúng)',
    options: [
      'Phơi bày dữ liệu ra ngoài dưới dạng một `Flow<List<AccountDomain>>` được đọc trực tiếp từ **Room DAO** (Room là Single Source of Truth duy nhất phát dữ liệu lên UI).',
      'Khi kích hoạt làm mới dữ liệu, gọi **DBS GenClient** ở luồng nền (`Dispatchers.IO`), ánh xạ DTO sang Entity rồi ghi cập nhật (`upsert` / `@Transaction`) vào **Room Database**; ngay khi Room được cập nhật, nó sẽ tự động phát (emit) danh sách mới nhất qua `Flow` lên `ViewModel` và UI.',
      'Xóa sạch toàn bộ cơ sở dữ liệu trước khi kiểm tra xem điện thoại có kết nối Internet hay không.',
      'Chặn đứng luồng vẽ giao diện (Main Thread) cho đến khi máy chủ phản hồi xong mới cho người dùng chạm vào màn hình.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Mẫu thiết kế **Single Source of Truth (SSOT)** với Room + Flow là kiến trúc chuẩn mực của Google và Backbase: UI chỉ quan sát `Flow` từ Room DAO (giúp hiển thị ngay lập tức dữ liệu đã lưu trong máy kể cả khi mất mạng). Khi mạng trả về dữ liệu mới, tầng Data cập nhật vào Room và Room tự động kích hoạt emission mới lên UI.'
  },
  {
    id: 518,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Khi viết một hàm chuyển đổi dữ liệu (**Mapper**) từ đối tượng DTO của tầng mạng sang đối tượng Domain Model trong Kotlin, phong cách viết code nào sạch sẽ, idiomatic và dễ kiểm thử đơn vị nhất?',
    options: [
      'Viết dưới dạng các **Top-level Kotlin Extension Functions** thuần túy không trạng thái (ví dụ `fun ArrangementItemDto.toDomain(): AccountSummary = ...`) hoặc một class `Mapper` không phụ thuộc vào Android Context, và viết Unit Test kiểm tra đầy đủ các trường hợp biên (null fields, danh sách rỗng, giá trị âm).',
      'Đặt toàn bộ logic chuyển đổi dữ liệu vào bên trong phương thức `onDraw(canvas: Canvas)` của một `CustomView`.',
      'Sử dụng `SharedPreferences` làm nơi trung chuyển từng trường dữ liệu một khi đang map.',
      'Dùng biểu thức chính quy (Regex) để cắt dán chuỗi `toString()` của đối tượng.'
    ],
    correctAnswers: [0],
    explanation: 'Hàm mở rộng thuần túy (`Extension Function` như `Dto.toDomain()`) hoặc một class Mapper stateless là các hàm thuần khiết (Pure Functions): với cùng một đầu vào luôn cho ra đúng một đầu ra và không có hiệu ứng phụ (Side-effects). Chúng chạy cực nhanh trong Unit Test (chỉ mất vài mili-giây cho hàng trăm test cases).'
  },
  {
    id: 519,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Trong trường hợp một màn hình Custom trong Journey cần tải dữ liệu phân trang (**Pagination** - ví dụ danh sách lịch sử giao dịch có hàng nghìn bản ghi từ `TransactionsGenClient` hỗ trợ tham số `from`/`page` và `size`), giải pháp kiến trúc nào trên Android giúp tải dữ liệu theo từng trang mượt mà và tiết kiệm bộ nhớ?',
    options: [
      'Luôn truyền `size = 99999999` để tải toàn bộ lịch sử giao dịch 10 năm trong một lần gọi duy nhất.',
      'Sử dụng thư viện **Jetpack Paging 3** (`PagingSource` / `RemoteMediator` trả về `Flow<PagingData<TransactionUiModel>>`) hoặc cơ chế quản lý trạng thái phân trang (`nextPageCursor`, `isLoadingMore`) trong `UseCase`/`ViewModel` khi người dùng cuộn gần tới cuối danh sách (`LazyColumn` / `RecyclerView`).',
      'Chỉ hiển thị tối đa 3 giao dịch đầu tiên và cấm người dùng xem các giao dịch cũ hơn.',
      'Mỗi giao dịch mở ra một cửa sổ `Activity` riêng biệt.'
    ],
    correctAnswers: [1],
    explanation: 'Các API danh sách lớn trong DBS (như Transactions, Notifications, Audit Messages) đều phân trang qua `from`/`size` hoặc `cursor`. Việc triển khai `PagingSource` của Jetpack Paging 3 (hoặc cơ chế state-driven pagination trong UDF ViewModel) giúp tải dữ liệu theo nhu cầu cuộn (on-demand), giữ mức tiêu thụ RAM ổn định và hỗ trợ retry từng trang lỗi.'
  },
  {
    id: 520,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Khi cần truyền dữ liệu điều hướng thông qua **Deep Link** (ví dụ khách hàng bấm vào một thông báo đẩy Push Notification hoặc liên kết quảng cáo `mybank://app/accounts/acc-123/transactions` để nhảy thẳng vào màn hình chi tiết giao dịch của một tài khoản cụ thể trong `AccountsJourney`), luồng xử lý an toàn nào cần được thực hiện?',
    options: [
      'Cho phép mở thẳng màn hình chi tiết tài khoản và hiển thị số dư mà không cần kiểm tra xem người dùng đã đăng nhập hay chưa.',
      'Tầng điều hướng gốc (Root / App Navigation) bắt lấy Deep Link URI, kiểm tra trạng thái phiên đăng nhập: nếu chưa đăng nhập thì lưu tạm Deep Link đích (`PendingDeepLink`), chuyển hướng sang `AuthenticationJourney` trước; ngay sau khi đăng nhập thành công mới giải mã tham số và điều hướng an toàn vào đúng màn hình đích của `AccountsJourney`.',
      'Xóa thông báo đẩy ngay lập tức và đóng ứng dụng.',
      'Mở trình duyệt web bên ngoài để tìm kiếm đường dẫn đó trên Google.'
    ],
    correctAnswers: [1],
    explanation: 'Trong ứng dụng ngân hàng, hầu hết các màn hình bên trong các Journey đều yêu cầu phiên xác thực hợp lệ (Authenticated Session). Do đó, kiến trúc **Deferred / Authenticated Deep Linking** là bắt buộc: lưu giữ ý định điều hướng (Pending Intent / DeepLink URI) qua bước đăng nhập sinh trắc học/mật khẩu rồi mới thực thi lệnh điều hướng của Router vào sâu trong Journey.'
  },
  {
    id: 521,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'multi',
    question: 'Khi viết giao diện tùy chỉnh bằng **Jetpack Compose** để nhúng vào một **Slot API** của OOTB Journey hoặc xây dựng một Custom Screen, những thực hành nào sau đây giúp tránh lỗi hiệu năng (Recomposition storms) và lỗi rò rỉ vòng đời? (Chọn 2 đáp án đúng)',
    options: [
      'Không thực hiện các lệnh gọi mạng hay khởi tạo đối tượng nặng trực tiếp bên trong thân hàm `@Composable`; thay vào đó sử dụng `LaunchedEffect(key)` cho các hiệu ứng phụ gắn với vòng đời Composable hoặc đẩy logic về `ViewModel`.',
      'Sử dụng `remember { ... }` và `derivedStateOf { ... }` hợp lý cho các phép tính toán lọc/sắp xếp danh sách trên UI, đồng thời cung cấp tham số `key = { item -> item.id }` ổn định và duy nhất cho mọi phần tử trong `LazyColumn` / `LazyRow`.',
      'Luôn gọi `viewModel.fetchData()` trực tiếp ở dòng đầu tiên của hàm `@Composable` mà không bọc trong `LaunchedEffect`, để mỗi khung hình vẽ lại (60 lần/giây) ứng dụng sẽ bắn thêm 60 request lên server.',
      'Truyền toàn bộ đối tượng `Activity` vào mọi data class trong tầng Domain.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Một hàm `@Composable` có thể được gọi lại (recomposed) hàng chục lần mỗi giây khi có hiệu ứng chuyển động. Do đó: 1) Tuyệt đối không đặt side-effects (như gọi API) trần trụi trong thân hàm Composable mà phải qua `ViewModel.init` hoặc `LaunchedEffect`; 2) Luôn khai báo `key = { it.id }` trong `LazyColumn` để Compose nhận diện đúng từng dòng và chỉ vẽ lại dòng có dữ liệu thay đổi.'
  },
  {
    id: 522,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Giả sử bạn cần nhúng một thành phần giao diện viết bằng **Jetpack Compose** vào bên trong một màn hình của OOTB Journey cũ vẫn đang sử dụng hệ thống **Android View / XML (`Fragment`)**, hoặc ngược lại nhúng một **Custom Android `View`** của MDS vào trong màn hình **Jetpack Compose**. Hai lớp cầu nối tương tác (Interoperability APIs) chuẩn của Android được sử dụng là gì?',
    options: [
      'Sử dụng **`ComposeView`** (kèm thiết lập `setViewCompositionStrategy(ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed)`) khi nhúng Compose vào XML/Fragment; và sử dụng Composable **`AndroidView(factory = { context -> ... }, update = { view -> ... })`** khi nhúng View truyền thống vào Compose.',
      'Không thể kết hợp cả Android View và Jetpack Compose trong cùng một ứng dụng.',
      'Phải chụp ảnh màn hình của View rồi lưu ra thẻ nhớ để đọc lại trong Compose.',
      'Sử dụng `WebView` làm trung gian cho mọi nút bấm.'
    ],
    correctAnswers: [0],
    explanation: 'Trong quá trình chuyển dịch công nghệ hoặc mở rộng các Journey lai (Hybrid View/Compose), `ComposeView` (luôn nhớ đặt `DisposeOnViewTreeLifecycleDestroyed` khi dùng trong Fragment hoặc RecyclerView để tránh leak bộ nhớ) và `AndroidView` là bộ đôi Interop API chính thức giúp kết hợp liền mạch hai thế hệ UI toolkit.'
  },
  {
    id: 523,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Trong kiểm thử đơn vị (Unit Testing) với **MockK**, khi một phương thức của `Router` hoặc `AnalyticsTracker` có kiểu trả về là `Unit` (hàm chỉ thực hiện hành động mà không trả về dữ liệu), những cách khai báo nào sau đây giúp MockK không ném lỗi `MockKException: no answer found`?',
    options: [
      'Sử dụng `justRun { router.onNavigateNext(any()) }` (hoặc `every { router.onNavigateNext(any()) } just Runs`), hoặc khởi tạo mock với chế độ `mockk<MyRouter>(relaxed = true)` / `relaxUnitFun = true`.',
      'Truyền số `0` làm giá trị trả về cho hàm `Unit`.',
      'Xóa hàm đó khỏi interface.',
      'Đổi kiểu trả về của mọi hàm trong dự án sang kiểu `Double`.'
    ],
    correctAnswers: [0],
    explanation: 'Mặc định trong MockK (`strict` mode), mọi lệnh gọi hàm trên đối tượng mock đều phải được định nghĩa hành vi trước. Đối với các hàm trả về `Unit` (như các hàm điều hướng trong `Router` hoặc ghi log), lập trình viên có thể dùng cú pháp ngắn gọn `justRun { router.onExit() }` hoặc bật cờ `relaxUnitFun = true` khi tạo `mockk(relaxUnitFun = true)`.'
  },
  {
    id: 524,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Khi viết Unit Test cần kiểm tra chi tiết giá trị của một đối tượng phức tạp được truyền làm đối số vào hàm của một dependency (ví dụ kiểm tra xem `paymentUseCase.submitPayment(request)` có thực sự được `ViewModel` gọi với số tiền `request.amount == BigDecimal("500.00")` và đúng mã tiền tệ `"EUR"` hay không), công cụ nào của **MockK** hỗ trợ bắt lấy đối số này?',
    options: [
      'Sử dụng **`CapturingSlot`** thông qua `val slot = slot<PaymentRequest>()` kết hợp với `coVerify { paymentUseCase.submitPayment(capture(slot)) }`, sau đó kiểm tra trực tiếp trên `slot.captured.amount` (hoặc dùng `withArg { ... }` / `match { ... }`).',
      'Đoán mò kết quả mà không cần kiểm tra đối số.',
      'In đối số ra máy in giấy rồi dùng mắt thường đọc.',
      'Không có cách nào kiểm tra đối số truyền vào hàm trong MockK.'
    ],
    correctAnswers: [0],
    explanation: '`slot<T>()` và `capture(slot)` (hoặc `match { it.amount == ... }` / `withArg { assertEquals(..., it.amount) }`) trong MockK là công cụ cực kỳ đắc lực để xác minh chính xác dữ liệu mà `ViewModel` hoặc `Decorator UseCase` đã biến đổi trước khi đẩy xuống tầng dưới.'
  },
  {
    id: 525,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Trong trường hợp một `ViewModel` sử dụng `SavedStateHandle` để nhận các tham số điều hướng (Navigation Arguments) và lưu giữ trạng thái giao diện sống sót qua sự kiện hệ điều hành thu hồi tiến trình nền (**Process Death**), làm thế nào để kiểm thử `ViewModel` này trong Unit Test?',
    options: [
      'Khởi tạo trực tiếp một đối tượng thật `val savedStateHandle = SavedStateHandle(mapOf("accountId" to "acc-999"))` và truyền thẳng vào constructor của `ViewModel` trong bài test mà không cần phải mock `SavedStateHandle`.',
      'Không thể viết Unit Test cho bất kỳ `ViewModel` nào có chứa `SavedStateHandle`.',
      'Phải tháo pin điện thoại ra lắp lại trong lúc chạy test.',
      'Truyền giá trị `null` bằng cách ép kiểu không an toàn.'
    ],
    correctAnswers: [0],
    explanation: '`androidx.lifecycle.SavedStateHandle` là một class thuần túy có hỗ trợ sẵn constructor nhận vào một `Map<String, Any?>` ban đầu. Trong Unit Test, thực hành tốt nhất là khởi tạo trực tiếp `SavedStateHandle(mapOf("key" to "value"))` thật thay vì mock nó, giúp kiểm tra chính xác cả hành vi đọc argument lẫn hành vi `savedStateHandle.getStateFlow(...)`.'
  },
  {
    id: 526,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'multi',
    question: 'Khi một ngân hàng cần thu thập dữ liệu phân tích hành vi người dùng (**Analytics & Observability** - ví dụ theo dõi các sự kiện xem màn hình `ScreenView` và bấm nút `UserAction`) xuyên suốt cả các OOTB Journeys lẫn các Custom Journeys mà không làm bẩn logic nghiệp vụ, những cơ chế nào trong kiến trúc Backbase hỗ trợ tốt nhất? (Chọn 2 đáp án đúng)',
    options: [
      'Đăng ký một bộ lắng nghe/xử lý sự kiện trên hệ thống **Backbase Tracker / Analytics Event Bus (`AnalyticsTracker` / `EventReceiver`)** được tích hợp sẵn trong các OOTB Journeys để chuyển tiếp các sự kiện chuẩn của Journey về nền tảng Analytics của ngân hàng (Firebase Analytics, Adobe, Mixpanel...).',
      'Kết hợp sử dụng **UseCase Decorator** hoặc **Router Implementation** để ghi nhận thêm các sự kiện nghiệp vụ đặc thù (như hoàn tất giao dịch hoặc chuyển luồng) tại một điểm tập trung.',
      'Gửi mật khẩu đăng nhập và mã PIN thẻ của khách hàng dưới dạng văn bản thuần lên Google Analytics.',
      'Bắt người dùng tự viết nhật ký sử dụng ứng dụng rồi gửi bưu điện về ngân hàng cuối mỗi tháng.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Các Backbase OOTB Journeys đã được gắn sẵn các điểm phát sự kiện theo dõi (Screen views & User actions) thông qua cơ chế `Tracker` / `Observers` của SDK. Ngân hàng chỉ cần đăng ký một subscriber/listener ở tầng `:app` để nhận toàn bộ luồng sự kiện này và đẩy sang công cụ Analytics nội bộ (đảm bảo tuyệt đối tuân thủ quy định bảo mật PII/GDPR, không bao giờ gửi dữ liệu nhạy cảm).'
  },
  {
    id: 527,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Khi mở rộng hoặc tự xây dựng một `UseCase` có kết hợp dữ liệu từ **2 nguồn bất đồng bộ khác nhau** (ví dụ: kết hợp `Flow` danh sách tài khoản từ `AccountsRepository` và `Flow` trạng thái ẩn/hiện số dư từ `UserPreferencesDataStore`), toán tử nào của Kotlin `Flow` là phù hợp nhất để luôn phát ra trạng thái kết hợp mới nhất mỗi khi một trong hai nguồn thay đổi?',
    options: [
      'Toán tử **`combine(accountsFlow, hideBalanceFlow) { accounts, hideBalance -> ... }`**.',
      'Toán tử `Thread.stop()`.',
      'Toán tử `System.exit()`.',
      'Không thể kết hợp hai `Flow` trong Kotlin.'
    ],
    correctAnswers: [0],
    explanation: 'Toán tử `combine` trong `kotlinx.coroutines.flow` lắng nghe đồng thời nhiều upstream flows; sau khi mỗi flow đã phát ra ít nhất 1 giá trị, bất cứ khi nào một trong các flow nguồn phát ra giá trị mới (ví dụ người dùng gạt nút "Ẩn số dư"), khối lambda của `combine` sẽ tự động được tính toán lại với giá trị mới nhất của các flow còn lại.'
  },
  {
    id: 528,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Trong Kotlin `Flow`, sự khác biệt hành vi giữa toán tử `combine` và toán tử `zip` là gì?',
    options: [
      '`combine` tính toán lại ngay khi BẤT KỲ flow nguồn nào phát ra giá trị mới (sử dụng giá trị gần nhất của flow kia); trong khi `zip` ghép cặp 1-1 theo đúng thứ tự index và luôn phải ĐỢI cả hai flow cùng phát ra phần tử mới tương ứng thì mới phát kết quả tiếp theo.',
      '`zip` dùng để nén file `.rar` trên ổ cứng, còn `combine` dùng để giải nén.',
      '`combine` chỉ dùng được cho kiểu `String`, còn `zip` chỉ dùng được cho kiểu `Int`.',
      'Hai toán tử này hoạt động giống hệt nhau trong mọi tình huống.'
    ],
    correctAnswers: [0],
    explanation: 'Hiểu rõ sự khác biệt giữa `combine` và `zip` là kiến thức thiết yếu khi xử lý Reactive Streams trong tầng Domain/Presentation: `combine` lý tưởng cho việc ghép các luồng trạng thái giao diện (`UiState`) có tần suất cập nhật khác nhau; còn `zip` chỉ dùng khi muốn ghép từng cặp sự kiện tương ứng 1-đối-1.'
  },
  {
    id: 529,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Khi xây dựng tính năng **Tìm kiếm giao dịch theo thời gian thực (Live Search)** trong một Custom Screen hoặc Custom UseCase, tổ hợp các toán tử `Flow` nào trên luồng văn bản người dùng nhập vào (`searchQueryFlow`) giúp tránh việc bắn hàng chục request mạng thừa khi người dùng đang gõ phím nhanh và tự động hủy request cũ nếu người dùng đã gõ sang từ khóa mới?',
    options: [
      '`searchQueryFlow.debounce(300).distinctUntilChanged().flatMapLatest { query -> repository.searchTransactions(query) }`',
      '`searchQueryFlow.collect { repository.searchTransactions(it) }` (không dùng bất kỳ toán tử lọc hay hủy nào).',
      '`searchQueryFlow.map { Thread.sleep(10000) }`',
      'Bắt người dùng phải khởi động lại ứng dụng sau mỗi chữ cái gõ vào ô tìm kiếm.'
    ],
    correctAnswers: [0],
    explanation: 'Bộ ba kinh điển cho chức năng Live Search trong Coroutines Flow là: 1) `debounce(300)` chờ người dùng ngừng gõ 300ms; 2) `distinctUntilChanged()` bỏ qua nếu từ khóa mới trùng hệt từ khóa vừa tìm; và 3) **`flatMapLatest`** tự động hủy (cancel) coroutine gọi mạng của từ khóa cũ ngay lập tức nếu có từ khóa mới đi tới, tránh cả lãng phí băng thông lẫn lỗi hiển thị kết quả cũ đè lên kết quả mới (Out-of-order responses).'
  },
  {
    id: 530,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Khi xử lý ngoại lệ bên trong một chuỗi `Flow` bằng toán tử `.catch { exception -> ... }`, quy tắc quan trọng nào của Kotlin Flow cần phải nhớ?',
    options: [
      'Toán tử `.catch` chỉ bắt được các ngoại lệ xảy ra ở các toán tử **phía trên nó (Upstream)** và KHÔNG bắt được ngoại lệ xảy ra ở các toán tử hoặc khối `.collect { ... }` nằm phía dưới nó (Downstream); đồng thời tuyệt đối không được nuốt `CancellationException`.',
      'Toán tử `.catch` có thể bắt được lỗi xảy ra ở một ứng dụng khác đang cài trên cùng điện thoại.',
      'Toán tử `.catch` phải luôn được đặt ở dòng đầu tiên trước cả khi tạo `flow { ... }`.',
      'Toán tử `.catch` tự động sửa mọi lỗi logic trên máy chủ Backend.'
    ],
    correctAnswers: [0],
    explanation: 'Trong Kotlin Flow, `.catch` tuân thủ tính minh bạch ngoại lệ (Exception Transparency): nó chỉ chặn bắt lỗi từ các nguồn phát và toán tử nằm phía trên nó (upstream). Ngoài ra, trong Coroutines nói chung, nếu dùng `try / catch (e: Exception)` thủ công, bạn luôn phải kiểm tra `if (e is CancellationException) throw e` để không làm gãy cơ chế hủy Structured Concurrency.'
  },
  {
    id: 531,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'multi',
    question: 'Trong trường hợp ngân hàng muốn mở rộng một OOTB Journey bằng cách truyền một **Custom View / Composable thông qua Slot API**, làm thế nào để thành phần giao diện tùy chỉnh trong Slot đó có thể tương tác với dữ liệu nghiệp vụ hoặc kích hoạt điều hướng một cách sạch sẽ theo kiến trúc MVVM? (Chọn 2 đáp án đúng)',
    options: [
      'Thành phần UI trong Slot có thể nhận dữ liệu ngữ cảnh (Context Data mà Slot API của Journey truyền vào qua tham số lambda) hoặc kết nối với một `ViewModel` riêng biệt của chính tính năng mở rộng đó để tải dữ liệu bổ sung độc lập.',
      'Khi người dùng tương tác với thành phần trong Slot (ví dụ bấm vào Banner mở thẻ mới), sự kiện được xử lý bởi `ViewModel` hoặc chuyển tiếp qua `Router` / `Navigator` để điều hướng sang luồng mở thẻ mà không làm ảnh hưởng đến code nội bộ của OOTB Journey.',
      'Thành phần trong Slot dùng Reflection để phá khóa `private` và xóa dữ liệu bên trong `ViewModel` của OOTB Journey.',
      'Thành phần trong Slot tự ý gọi `Activity.finishAffinity()` để tắt toàn bộ ứng dụng mỗi khi được hiển thị.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Thành phần được nhúng vào một Slot hoàn toàn có thể là một "Mini-Feature" tự chủ: nó có thể hiển thị dữ liệu ngữ cảnh do Journey cha truyền cho Slot (như `accountId`), hoặc gắn với một `ViewModel` độc lập (tiêm qua Hilt `hiltViewModel()` / Koin `koinViewModel()`) và gọi `Router` để điều hướng khi người dùng tương tác.'
  },
  {
    id: 532,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Khi viết một `okhttp3.Interceptor` tùy chỉnh để kiểm tra nội dung JSON của `Response` trả về từ server (ví dụ để đọc một mã lỗi nghiệp vụ đặc thù trong body mà không làm hỏng luồng đọc dữ liệu của `GenClient` / `Retrofit` phía sau), tại sao lập trình viên KHÔNG ĐƯỢC gọi trực tiếp `response.body?.string()` rồi trả về nguyên đối tượng `response` cũ?',
    options: [
      'Vì luồng dữ liệu `ResponseBody` của OkHttp chỉ có thể được tiêu thụ (đọc) **MỘT LẦN DUY NHẤT** (one-shot stream); nếu Interceptor gọi `response.body?.string()`, luồng dữ liệu sẽ bị đóng lại và khiến `GenClient`/Moshi phía sau văng lỗi `IllegalStateException: closed`. Thay vào đó, phải dùng **`response.peekBody(maxBytes)`** hoặc tạo lại một `ResponseBody` mới gắn vào `response.newBuilder().body(...)`.',
      'Vì hàm `string()` sẽ tự động xóa dữ liệu trên máy chủ.',
      'Vì OkHttp không hỗ trợ đọc chuỗi có độ dài lớn hơn 5 ký tự.',
      'Vì gọi `response.body` sẽ làm ngắt kết nối Bluetooth của tai nghe.'
    ],
    correctAnswers: [0],
    explanation: 'Đây là một bẫy kỹ thuật thực tế rất phổ biến khi làm việc với OkHttp `Interceptor`: `ResponseBody` là một luồng byte trực tiếp từ socket mạng nên chỉ đọc được 1 lần (`consumed once`). Nếu cần xem trước nội dung trong Interceptor mà không làm mất luồng của tầng parser phía trên, hãy sử dụng `response.peekBody(Long)` hoặc tạo bản sao `ResponseBody.create(contentType, contentString)`.'
  },
  {
    id: 533,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Khi mở rộng ứng dụng để hỗ trợ tính năng **Đẩy thông báo (Push Notifications)** với Backbase Push Notification SDK và Firebase Cloud Messaging (`FirebaseMessagingService`), hai trách nhiệm cốt lõi nào mà lớp `Service` kế thừa `FirebaseMessagingService` trong ứng dụng cần thực hiện?',
    options: [
      '1) Ghi đè `onNewToken(token: String)` để đăng ký/cập nhật FCM Device Token mới lên dịch vụ Push Integration của Backbase khi người dùng đã xác thực; và 2) Ghi đè `onMessageReceived(remoteMessage: RemoteMessage)` để chuyển dữ liệu thông báo cho Backbase Notification handler / hiển thị System Notification kèm Deep Link điều hướng.',
      'Chỉ cần khai báo tên class trong file README.md mà không cần đăng ký trong `AndroidManifest.xml`.',
      'Dùng vòng lặp gọi API lên server mỗi 0.5 giây để hỏi xem có thông báo mới hay không.',
      'Tự động bật loa ngoài ở mức âm lượng tối đa lúc 2 giờ sáng.'
    ],
    correctAnswers: [0],
    explanation: 'Tích hợp Push Notifications trong Backbase yêu cầu đồng bộ FCM registration token của thiết bị với tài khoản người dùng trên Backbase Engagement/Push service (qua `onNewToken` và ngay sau khi đăng nhập thành công), đồng thời phân tích payload trong `onMessageReceived` để hiển thị thông báo hoặc kích hoạt luồng phê duyệt giao dịch (Out-of-Band Push Approval).'
  },
  {
    id: 534,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Trong kiến trúc đa module của một dự án Backbase Android lớn, nếu có nhiều Custom Journeys cùng cần sử dụng một tập hợp các hàm tiện ích định dạng số tài khoản IBAN hoặc một Domain Model dùng chung, những thành phần dùng chung đó nên được đặt ở đâu?',
    options: [
      'Sao chép (copy-paste) đoạn code đó vào tất cả 15 module Journey khác nhau.',
      'Đặt trong một module nền tảng dùng chung ở tầng thấp (ví dụ: `:core:common`, `:core:model` hoặc `:shared:domain`) không phụ thuộc ngược vào bất kỳ Journey nào, để các module Journey có thể phụ thuộc vào module dùng chung đó một chiều an toàn.',
      'Đặt ở module `:app` rồi bắt các module Journey phụ thuộc ngược lên module `:app`.',
      'Lưu trên một trang web pastebin công cộng.'
    ],
    correctAnswers: [1],
    explanation: 'Các module tính năng (Journeys) tuyệt đối không được phụ thuộc ngược lên `:app` và không được phụ thuộc chéo vào nhau. Mọi logic hoặc model dùng chung giữa nhiều Journey phải được trích xuất xuống các module tầng dưới (`:core:*` hoặc `:shared:*`) nằm ở đáy của đồ thị phụ thuộc (Dependency Graph).'
  },
  {
    id: 535,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Khi thực hiện kiểm thử giao diện tự động (**UI Testing**) cho một màn hình được xây dựng bằng **Jetpack Compose** trong Custom Journey, công cụ nào được sử dụng để tìm kiếm các phần tử trên màn hình, mô phỏng thao tác chạm (`performClick()`, `performTextInput()`) và kiểm tra trạng thái hiển thị (`assertIsDisplayed()`)?',
    options: [
      '**`ComposeTestRule`** (`createComposeRule()` hoặc `createAndroidComposeRule<ComponentActivity>()`) kết hợp các bộ chọn ngữ nghĩa (`onNodeWithText(...)`, `onNodeWithTag(...)`, `onNodeWithContentDescription(...)`).',
      'Sử dụng thư viện `java.awt.Robot` của máy tính để bàn.',
      'Chỉ có thể kiểm thử bằng cách chụp ảnh màn hình bằng máy ảnh kỹ thuật số bên ngoài.',
      'Không có bất kỳ công cụ nào hỗ trợ kiểm thử tự động cho Jetpack Compose.'
    ],
    correctAnswers: [0],
    explanation: '`ComposeTestRule` sử dụng cây ngữ nghĩa (**Semantics Tree**) của Jetpack Compose để tìm kiếm phần tử (`onNodeWithText`, `onNodeWithContentDescription`, `onNodeWithTag`), đồng bộ hóa tự động với xung nhịp vẽ khung hình (Virtual Clock / IdlingResource tích hợp sẵn) và thực thi các thao tác kiểm thử cực kỳ ổn định khi truyền vào một Stateless Composable cùng trạng thái `UiState` giả lập.'
  },
  {
    id: 536,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'multi',
    question: 'Tại sao việc truyền một **Stateless Composable** (ví dụ `PaymentFormScreenContent(uiState = ..., onEvent = ...)`) vào bên trong `composeTestRule.setContent { BackbaseTheme { ... } }` lại được ưa chuộng hơn rất nhiều so với việc khởi tạo toàn bộ `Activity` + `ViewModel` + `Network` khi kiểm thử logic hiển thị của từng trạng thái giao diện? (Chọn 2 đáp án đúng)',
    options: [
      'Bài kiểm thử có thể truyền trực tiếp bất kỳ trạng thái `UiState` nào (như trạng thái `Loading`, trạng thái `Error` mất mạng, hoặc trạng thái danh sách có 50 tài khoản) vào hàm Composable để xác minh giao diện ngay lập tức mà không cần thiết lập giả lập tầng mạng phức tạp.',
      'Tốc độ thực thi cực nhanh, hoàn toàn tất định (deterministic, không bị flaky do độ trễ mạng/luồng) và có thể dễ dàng kiểm chứng xem các callback sự kiện (`onEvent`) có được kích hoạt đúng tham số khi người dùng bấm nút hay không.',
      'Vì `ComposeTestRule` cấm không cho phép sử dụng `BackbaseTheme`.',
      'Vì cách này giúp ứng dụng tự động tải thêm dữ liệu từ máy chủ thật.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Nhờ kiến trúc **Unidirectional Data Flow (UDF)** và **State Hoisting**, tầng UI chỉ là một hàm ánh xạ thuần túy từ `UiState` sang các phần tử hiển thị. Kiểm thử trực tiếp trên Stateless Composable bọc trong `BackbaseTheme` giúp kiểm tra chớp nhoáng mọi kịch bản hiển thị (Loading, Empty, Error, Validation Error) và kiểm tra mọi sự kiện click với độ ổn định 100%.'
  },
  {
    id: 537,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Khi nâng cấp phiên bản lớn của nền tảng Backbase (Major Version Upgrade - ví dụ nâng cấp Backbase BOM lên bản mới có một số thay đổi về chữ ký hàm trong `UseCase`), một dự án tuân thủ nghiêm ngặt kiến trúc **Decorator Pattern**, **DI Separation** và **Configuration DSL** sẽ được hưởng lợi ích thực tế nào so với dự án sửa code tùy tiện?',
    options: [
      'Mọi điểm mở rộng của ngân hàng đều được cô lập rõ ràng tại các class `*DecoratorUseCase`, `*RouterImpl` và `*ConfigurationModule`; trình biên dịch Kotlin sẽ chỉ ra chính xác vài điểm giao tiếp (contract boundaries) cần cập nhật chữ ký hàm, giúp hoàn tất việc nâng cấp toàn bộ ứng dụng chỉ trong thời gian rất ngắn với rủi ro hồi quy (regression) thấp nhất.',
      'Dự án vẫn phải xóa bỏ toàn bộ ứng dụng và viết lại từ đầu mất 2 năm.',
      'Không có bất kỳ sự khác biệt nào giữa hai cách làm.',
      'Trình biên dịch sẽ tự động hạ cấp hệ điều hành xuống Android 4.0.'
    ],
    correctAnswers: [0],
    explanation: 'Đây chính là mục tiêu tối thượng của toàn bộ kiến trúc **Backbase Mobile Architecture**: Nhờ cô lập hoàn toàn các phần tùy biến (Adopt qua Configuration DSL & MDS Tokens; Extend qua UseCase Decorator, Screen Factory và Router Interfaces), ứng dụng của ngân hàng luôn duy trì được tính **Upgradeability** (khả năng nâng cấp dễ dàng), tận dụng trọn vẹn sức mạnh đổi mới liên tục của nền tảng Backbase EBP.'
  },
  {
    id: 537,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Bạn cần thêm logic ghi log bảo mật (Audit Logging) vào BẤT KỲ LÚC NÀO người dùng thực hiện UseCase SubmitTransferUseCase. Cách mở rộng nào tuân thủ đúng nguyên tắc SOLID và chuẩn Backbase?',
    options: [
      'Sửa trực tiếp mã nguồn trong class SubmitTransferUseCaseImpl của Backbase.',
      'Tạo class AuditSubmitTransferUseCaseDecorator triển khai SubmitTransferUseCase, nhận instance gốc qua Constructor, thực hiện ghi log và gọi lại instance gốc. Register binding mới này bằng @Binds trong Hilt.',
      'Viết một hàm static ghi log và gọi trong Activity.',
      'Tạo một UseCase hoàn toàn mới và thay đổi tất cả ViewModel để gọi UseCase mới này.'
    ],
    correctAnswers: [1],
    explanation: 'Đây là ứng dụng thực tế của Decorator Pattern. Cách làm này không sửa code gốc (Open/Closed Principle), đảm bảo tách biệt trách nhiệm (Single Responsibility) và giữ nguyên tính tương thích khi nâng cấp SDK.'
  },
  {
    id: 538,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Khi một màn hình OOTB của Journey không thể đáp ứng được các yêu cầu thiết kế quá đặc thù từ phía Ngân hàng, Backbase hỗ trợ cơ chế nào để THAY THẾ HOÀN TOÀN màn hình đó bằng một Custom Screen hoàn toàn mới?',
    options: [
      'Thay thế qua Screen Factory / Custom Navigation Router đăng ký trong DI Graph.',
      'Xóa bỏ file .aar của Journey đó.',
      'Tạo một app Android riêng độc lập.',
      'Sửa file AndroidManifest.xml để trỏ LAUNCHER sang Activity mới.'
    ],
    correctAnswers: [0],
    explanation: 'Tầng Navigation của Backbase cho phép đăng ký Screen Factory tùy biến. Khi Navigation cần mở màn hình X, nó sẽ yêu cầu Factory cấp Screen Instance; Integrator có thể trả về Custom Screen thay vì Default Screen.'
  },
  {
    id: 539,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'multi',
    question: 'Những kịch bản nào sau đây bắt buộc bạn phải chuyển sang hướng BUILD (Xây dựng Custom Journey/Module mới hoàn toàn)? (Chọn 2)',
    options: [
      'Khách hàng yêu cầu thay đổi màu sắc của nút "Thanh toán".',
      'Ngân hàng ra mắt một sản phẩm dịch vụ hoàn toàn mới độc quyền chưa từng có trong danh mục sản phẩm OOTB của Backbase (Ví dụ: Đặt vé xem phim / Đặt xe tiện chuyến).',
      'Ngân hàng có quy trình nghiệp vụ mua bảo hiểm liên kết đặc thù với hệ thống Core riêng biệt không tuân theo bất kỳ chuẩn API OOTB nào.',
      'Thay đổi câu văn thông báo lỗi khi nhập sai Mật khẩu.'
    ],
    correctAnswers: [1, 2],
    explanation: 'Khi yêu cầu nghiệp vụ hoàn toàn mới, nằm ngoài phạm vi sản phẩm banking chuẩn của Backbase (như Lifestyle services) hoặc quy trình tích hợp riêng biệt không thể mở rộng từ OOTB, ta mới tiến hành Build mới module.'
  },
  {
    id: 540,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Cú pháp Hilt/Dagger nào sau đây dùng để cấu hình cho một Decorator Pattern thay thế triển khai mặc định của một Interface GetAccountsUseCase?',
    options: [
      '@Module',
      '@Module',
      '@Provides',
      '@Inject lateinit var useCase: GetAccountsUseCase'
    ],
    correctAnswers: [0],
    explanation: 'Sử dụng @Binds trong một abstract class Hilt Module là cách chuẩn mực, tối ưu hiệu năng (không tạo mã byte code dư thừa) để map một triển khai (bao gồm Decorator) vào Interface dependency.'
  },
  {
    id: 541,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Để đảm bảo an toàn dữ liệu nhạy cảm (như Accesstoken, thông tin thẻ) lưu trữ ở bộ nhớ cục bộ trên thiết bị Android, kĩ thuật chuẩn nhất là gì?',
    options: [
      'Lưu dạng Plain Text vào file strings.xml.',
      'Sử dụng EncryptedSharedPreferences / Jetpack DataStore kết hợp với hệ thống quản lý khóa AndroidKeyStore.',
      'Lưu vào file .txt trong thư mục Download.',
      'Mã hóa bằng Base64 và lưu vào SharedPreferences thông thường.'
    ],
    correctAnswers: [1],
    explanation: 'Base64 không phải là mã hóa (chỉ là encoding). EncryptedSharedPreferences sử dụng Hardware-backed Keys từ AndroidKeyStore để mã hóa AES-256 cho dữ liệu nhạy cảm.'
  },
  {
    id: 542,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'multi',
    question: 'Khi viết Unit Test cho một ViewModel có sử dụng Kotlin Coroutines và StateFlow, những công cụ/thư viện nào sau đây là bộ chuẩn mực phổ biến nhất? (Chọn 2)',
    options: [
      'kotlinx-coroutines-test (cung cấp StandardTestDispatcher, runTest).',
      'Thư viện Turbine để kiểm thử các luồng Flow (app.cash.turbine).',
      'Espresso UI Testing framework.',
      'Selenium WebDriver.'
    ],
    correctAnswers: [0, 1],
    explanation: 'kotlinx-coroutines-test giúp kiểm soát thời gian/dispatcher của Coroutine trong môi trường test. Turbine giúp assert các giá trị emit từ StateFlow/Flow một cách vô cùng đơn giản và ngắn gọn.'
  },
  {
    id: 543,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Trong OkHttp, điểm KHÁC BIỆT BẢN CHẤT giữa Interceptor và Authenticator là gì?',
    options: [
      'Không có gì khác biệt.',
      'Interceptor luôn được gọi cho mọi Request; còn Authenticator CHỈ được kích hoạt khi Server phản hồi lỗi 401 Unauthorized để thực hiện cấp lại Token (Refresh Token).',
      'Authenticator chạy trước Interceptor.',
      'Interceptor dùng cho UI, Authenticator dùng cho DB.'
    ],
    correctAnswers: [1],
    explanation: 'Authenticator được thiết kế đặc biệt để xử lý lỗi 401. Khi gặp 401, OkHttp tự động nhảy vào Authenticator để lấy token mới và tự động thực thi lại (retry) request bị lỗi trước đó.'
  },
  {
    id: 544,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Kỹ thuật "Certificate Pinning" (Ghim chứng chỉ) được cấu hình trên Android nhằm mục đích chống lại nguy cơ tấn công bảo mật nào?',
    options: [
      'Tấn công từ chối dịch vụ (DDoS).',
      'Tấn công Man-In-The-Middle (MITM - Đứng giữa nghe lén/thay đổi dữ liệu đường truyền).',
      'Tấn công chèn mã SQL (SQL Injection).',
      'Tấn công giả mạo giao diện (Phishing UI).'
    ],
    correctAnswers: [1],
    explanation: 'Certificate Pinning đảm bảo ứng dụng chỉ tin tưởng và kết nối đúng đến Server có khóa công khai/certificate trùng khớp được định sẵn, ngăn chặn các proxy/kẻ tấn công đứng giữa giải mã traffic HTTPS.'
  },
  {
    id: 545,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Khi thiết kế một Custom Journey mới (Build), làm thế nào để đảm bảo module này có thể tái sử dụng dễ dàng ở các dự án ngân hàng khác nhau?',
    options: [
      'Hardcode thông tin API URL và Màu sắc trực tiếp trong module.',
      'Bắt buộc module phụ thuộc vào :app module chính.',
      'Đóng gói module thành cấu trúc tách biệt (:feature-api & :feature-impl), nhận các cấu hình (Theme, Router, Gateway URL) thông qua DI/Interfaces và không phụ thuộc vào ứng dụng cụ thể.',
      'Đặt tất cả mã nguồn trong 1 file Kotlin duy nhất.'
    ],
    correctAnswers: [2],
    explanation: 'Tuân thủ nguyên tắc Modularization và Dependency Inversion giúp module linh hoạt, độc lập, có thể phát hành thành thư viện để lắp ghép vào bất kỳ dự án Integrator nào.'
  },
  {
    id: 546,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Trong Jetpack Compose (được dùng trong các Custom Screen mới của Backbase), hàm extension nào giúp chuyển đổi một StateFlow<T> thành một Compose State<T> một cách an toàn theo vòng đời của Composable?',
    options: [
      'flow.collect()',
      'flow.collectAsStateWithLifecycle()',
      'flow.subscribe()',
      'flow.toState()'
    ],
    correctAnswers: [1],
    explanation: 'Extension collectAsStateWithLifecycle() thuộc thư viện androidx.lifecycle.compose thu thập dữ liệu từ StateFlow theo cách nhận biết Lifecycle, tự động hủy/kích hoạt lại thu thập khi Composable ngầm/hiện.'
  },
  {
    id: 547,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Khi cần bổ sung bước kiểm tra hạn mức giao dịch trước khi gọi Use Case chuyển tiền gốc của SDK, pattern nào là chuẩn mực?',
    options: [
      'Singleton Pattern.',
      'Decorator Pattern (bọc Use Case gốc và inject vào Custom Use Case).',
      'Observer Pattern.',
      'Prototype Pattern.'
    ],
    correctAnswers: [1],
    explanation: 'Decorator Pattern bọc implementation mặc định để thực hiện kiểm tra trước khi chuyển tiếp gọi gốc.'
  },
  {
    id: 548,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Cú pháp Hilt Module nào dùng để re-bind một Custom Use Case thay thế cho Interface Use Case mặc định?',
    options: [
      'abstract class + @Binds + abstract fun bindUseCase(impl: CustomUseCase): OriginalUseCase',
      'class thường với hàm return instance mới',
      '@Component interface chứa hàm inject',
      'val module = module { single { CustomUseCase() } }'
    ],
    correctAnswers: [0],
    explanation: '@Binds trong abstract class Hilt Module là cú pháp chuẩn mực, tối ưu hiệu năng để tráo đổi binding.'
  },
  {
    id: 549,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Khái niệm \'Exit Point\' trong Business Journey đóng vai trò gì?',
    options: [
      'Điểm kết thúc một luồng công việc hoặc phát tín hiệu điều hướng ra ngoài phạm vi Journey.',
      'Điểm ứng dụng bị crash do lỗi bộ nhớ.',
      'Nút bấm tắt ứng dụng.',
      'Thời điểm người dùng bị đăng xuất tự động.'
    ],
    correctAnswers: [0],
    explanation: 'Exit Point là callback/sự kiện báo hiệu luồng nghiệp vụ kết thúc để Integrator điều hướng tiếp.'
  },
  {
    id: 550,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'multi',
    question: 'Hai yêu cầu bắt buộc khi thay thế màn hình Journey bằng Custom Screen Factory là gì? (Chọn 2)',
    options: [
      'Custom Screen phải kế thừa hoặc kết nối đúng ViewModel/State của Journey nếu muốn tái sử dụng logic.',
      'Đăng ký Factory mới vào Hilt DI Graph để Journey gọi khởi tạo màn hình tùy biến.',
      'Màn hình mới bắt buộc phải viết bằng Java thuần.',
      'Màn hình mới phải chạy trên một tiến trình OS độc lập.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Phải đăng ký Factory vào DI và đảm bảo UI mới kết nối đúng dữ liệu/State của luồng nghiệp vụ.'
  },
  {
    id: 551,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Khi người dùng nhấn nút Back trên màn hình gốc của Journey, xử lý chuẩn tại Router Interface là gì?',
    options: [
      'Thoát ứng dụng ngay lập tức bằng lệnh killProcess.',
      'Triển khai hàm điều hướng thoát (như onExit / navigateUp) và gọi navController.popBackStack().',
      'Vô hiệu hóa hoàn toàn nút Back vật lý.',
      'Xóa toàn bộ dữ liệu ứng dụng.'
    ],
    correctAnswers: [1],
    explanation: 'Router Interface xử lý sự kiện Back bằng cách gọi popBackStack trên Navigation Controller.'
  },
  {
    id: 552,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Để thay đổi danh sách các tab trên Bottom Navigation của Productized App, dev can thiệp vào đâu?',
    options: [
      'Mã nguồn Core Foundation SDK.',
      'Cung cấp Custom AppMenuConfigurationProvider thông qua Hilt DI tại Integrator module.',
      'Sửa phần cứng điện thoại.',
      'Gửi yêu cầu lên máy chủ Google.'
    ],
    correctAnswers: [1],
    explanation: 'Menu chính được cấu hình tập trung qua AppMenuConfigurationProvider tại Integrator module.'
  },
  {
    id: 553,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Làm thế nào để ẩn một mục menu trên Bottom Navigation nếu người dùng không đủ quyền (Entitlements)?',
    options: [
      'Cho hiển thị nhưng bấm vào thì crash app.',
      'Kiểm tra quyền và lọc danh sách Menu Items trả về từ AppMenuConfigurationProvider trước khi render.',
      'Đổi màu icon tab thành trong suốt.',
      'Vẽ View màu đen đè lên tab đó.'
    ],
    correctAnswers: [1],
    explanation: 'Lọc danh sách Menu Item dựa trên Entitlements của người dùng trước khi hiển thị lên giao diện.'
  },
  {
    id: 554,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'multi',
    question: 'Khi truyền dữ liệu giữa 2 Journey độc lập qua Router/Deeplink, nguyên tắc an toàn là gì? (Chọn 2)',
    options: [
      'Chỉ truyền các Identifier (ID dạng String/Long) hoặc tham số cơ bản, không truyền nguyên đối tượng phức tạp.',
      'Màn hình đích sẽ tự nạp dữ liệu chi tiết từ Repository dựa trên Identifier nhận được.',
      'Ép kiểu toàn bộ đối tượng thành chuỗi Base64 dài 500KB để truyền qua Bundle.',
      'Lưu đối tượng vào biến public static toàn cục.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Chỉ truyền ID gọn nhẹ qua Safe Args để tránh TransactionTooLargeException và giữ tính đóng gói.'
  },
  {
    id: 555,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Quên gắn annotation @InstallIn trên một Hilt Module sẽ dẫn đến hậu quả gì?',
    options: [
      'Ứng dụng vẫn chạy bình thường.',
      'Lỗi biên dịch ngay khi build (Compilation Error) do Hilt không xác định được scope gắn kết của Module.',
      'Tự động chuyển đổi sang framework Koin.',
      'Dữ liệu API bị trả về chuỗi rỗng.'
    ],
    correctAnswers: [1],
    explanation: '@InstallIn là bắt buộc trong Hilt; thiếu nó trình sinh mã của Hilt sẽ báo lỗi biên dịch ngay lập tức.'
  },
  {
    id: 556,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Để đảm bảo an toàn cho Token xác thực và khóa bí mật lưu cục bộ trên thiết bị Android, thư viện chuẩn nào được dùng?',
    options: [
      'SharedPreferences thông thường.',
      'EncryptedSharedPreferences (Android Jetpack Security) kết hợp AndroidKeyStore.',
      'Lưu vào file text trong thư mục Download.',
      'Lưu vào database SQLite không mật khẩu.'
    ],
    correctAnswers: [1],
    explanation: 'Chuẩn bảo mật tài chính yêu cầu mã hóa AES-256 phần cứng qua EncryptedSharedPreferences và KeyStore.'
  },
  {
    id: 557,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Thư viện nào được khuyến nghị để kiểm thử luồng StateFlow trong ViewModel theo cách tuần tự và trực quan?',
    options: [
      'Turbine',
      'Selenium',
      'Appium',
      'Retrofit'
    ],
    correctAnswers: [0],
    explanation: 'Turbine (app.cash.turbine) là thư viện tiêu chuẩn để test Flow và StateFlow trên Android/Kotlin.'
  },
  {
    id: 558,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Trong MockK, hàm nào dùng để kiểm tra một suspend function của Use Case có được gọi đúng 1 lần hay không?',
    options: [
      'verify(exactly = 1) { ... }',
      'coVerify(exactly = 1) { useCase.invoke(any()) }',
      'assertCalledOnce { ... }',
      'checkExecution()'
    ],
    correctAnswers: [1],
    explanation: 'Các hàm suspend trong Coroutines bắt buộc phải dùng coVerify và coEvery trong MockK.'
  },
  {
    id: 559,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Khi một Journey được build mới hoàn toàn (Build Custom Journey), cấu trúc tối thiểu khuyến nghị là gì?',
    options: [
      '1 module duy nhất chứa tất cả code.',
      'Tách thành 2 module: :journey-api (contracts, models) và :journey-impl (UI, ViewModel, Repositories).',
      'Mỗi màn hình tạo 1 module riêng.',
      'Không cần chia module.'
    ],
    correctAnswers: [1],
    explanation: 'Cấu trúc tách rời :api và :impl là quy chuẩn kiến trúc để đảm bảo lỏng liên kết và tối ưu build.'
  },
  {
    id: 560,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'multi',
    question: 'Hai cơ chế bảo vệ ứng dụng ngân hàng khi phát hiện thiết bị bị Root hoặc can thiệp mã (Anti-Tampering) là gì? (Chọn 2)',
    options: [
      'Kiểm tra tính toàn vẹn môi trường (Root detection, Emulator detection, Frida/Xposed hooks).',
      'Chủ động cảnh báo người dùng và từ chối thực hiện giao dịch tài chính để bảo vệ tài khoản.',
      'Tự động chuyển toàn bộ tiền trong tài khoản sang ngân hàng khác.',
      'Xóa sạch hệ điều hành của điện thoại.'
    ],
    correctAnswers: [0, 1],
    explanation: 'RASP (Runtime Application Self-Protection) phát hiện môi trường nguy hiểm và chặn giao dịch nhạy cảm.'
  },
  {
    id: 561,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Khi áp dụng Kotlin Delegation (\'by\') trong Decorator Pattern cho Use Case, lợi ích lớn nhất là gì?',
    options: [
      'Tự động ủy quyền tất cả các phương thức mặc định sang instance gốc, chỉ cần override phương thức cần can thiệp logic.',
      'Tự động mã hóa class thành file zip.',
      'Giúp class chạy nhanh hơn 100 lần.',
      'Loại bỏ hoàn toàn sự cần thiết của Hilt.'
    ],
    correctAnswers: [0],
    explanation: 'Class delegation (by delegate) giúp code cực kỳ ngắn gọn, không phải viết lại các hàm ủy quyền boilerplate.'
  },
  {
    id: 562,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Để chia sẻ chung một instance ViewModel giữa các màn hình trong cùng một luồng Nested Navigation Graph, ta khởi tạo ViewModel với phạm vi nào?',
    options: [
      'Scoped theo NavBackStackEntry của Nested Graph (navGraphViewModels).',
      'Khởi tạo bằng từ khóa new MyViewModel().',
      'Lưu vào biến toàn cục static.',
      'Mỗi màn hình tạo một instance riêng biệt.'
    ],
    correctAnswers: [0],
    explanation: 'navGraphViewModels cho phép chia sẻ dữ liệu chung trong một luồng nghiệp vụ và tự giải phóng khi rời luồng.'
  },
  {
    id: 563,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Điều gì xảy ra nếu Custom Use Case ném ra một Unhandled Exception bên trong viewModelScope?',
    options: [
      'Ứng dụng tự động phục hồi lỗi.',
      'Gây crash ứng dụng (Fatal Exception) nếu không được bắt bằng runCatching hoặc CoroutineExceptionHandler.',
      'Server tự động sửa lỗi.',
      'Điện thoại tự động tắt nguồn.'
    ],
    correctAnswers: [1],
    explanation: 'Ngoại lệ không bắt trong Coroutine Scope sẽ làm văng ứng dụng; luôn bọc bằng runCatching / Result.'
  },
  {
    id: 564,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'multi',
    question: 'Khi thay thế màn hình bằng Screen Factory, điều gì đảm bảo giao diện mới không bị lệch chuẩn thiết kế của app? (Chọn 2)',
    options: [
      'Sử dụng các thành phần UI và Design Tokens được cung cấp bởi Backbase MDS.',
      'Kế thừa Theme.Backbase hoặc bọc Composable trong BackbaseTheme.',
      'Chụp ảnh màn hình cũ và dán vào ImageView.',
      'Tự viết hệ thống mã màu Hex riêng lẻ.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Tái sử dụng MDS Components và Design Tokens đảm bảo giao diện mới đồng bộ 100% với toàn app.'
  },
  {
    id: 565,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Khi một dự án cần thêm bước xác thực sinh trắc học trước khi chuyển tiền, vị trí can thiệp tối ưu nhất là gì?',
    options: [
      'Viết lại toàn bộ hệ điều hành Android.',
      'Bọc SubmitTransferUseCase bằng một Custom Decorator Use Case có logic kiểm tra Biometric trước khi gọi gốc.',
      'Chèn code vào Retrofit client.',
      'Can thiệp vào database SQLite.'
    ],
    correctAnswers: [1],
    explanation: 'Bọc SubmitTransferUseCase bằng Decorator Pattern đảm bảo đúng Clean Architecture và giữ Upgrade Path.'
  },
  {
    id: 566,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Khi nào một nhóm phát triển ĐƯỢC PHÉP quyết định xây dựng Custom Journey mới hoàn toàn?',
    options: [
      'Khi không thích cách đặt tên thư mục của Backbase.',
      'Khi yêu cầu nghiệp vụ ngân hàng là một dịch vụ hoàn toàn mới, không có bất kỳ OOTB Journey nào tương đồng.',
      'Khi muốn đổi màu sắc nút bấm.',
      'Khi muốn đổi tên nhãn hiển thị.'
    ],
    correctAnswers: [1],
    explanation: 'Chỉ Build mới khi tính năng hoàn toàn mới và OOTB không có nền tảng tương đồng.'
  },
  {
    id: 567,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Trong MockK, cú pháp nào dùng để thiết lập giá trị trả về cho một hàm suspend?',
    options: [
      'every { ... } returns ...',
      'coEvery { ... } returns ...',
      'when().thenReturn()',
      'mockSuspend()'
    ],
    correctAnswers: [1],
    explanation: 'coEvery là cú pháp chuyên dụng của MockK để mock hành vi cho suspend function.'
  },
  {
    id: 568,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Để tránh rò rỉ dữ liệu nhạy cảm (như PIN, Token) vào Logcat trên bản build Production, phương án chuẩn là gì?',
    options: [
      'Xóa thủ công từng dòng log trước khi nộp bài.',
      'Sử dụng Timber / Custom Logger và cấu hình strip/disable toàn bộ log trong môi trường Release thông qua ProGuard rules.',
      'Đổi tên các biến nhạy cảm.',
      'Không cần làm gì vì Logcat tự bảo mật.'
    ],
    correctAnswers: [1],
    explanation: 'Tắt log trong release build bằng ProGuard rules (assumenosideeffects) và custom logger.'
  },
  {
    id: 569,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Tôn chỉ cao nhất xuyên suốt quá trình \'Extend and Build\' trong Backbase là gì?',
    options: [
      'Tự viết lại càng nhiều code càng tốt.',
      'Tối đa hóa việc sử dụng OOTB, chỉ mở rộng thông qua các Extension Points chính thống để bảo toàn lộ trình nâng cấp (Upgrade Path).',
      'Không bao giờ sử dụng Coroutines.',
      'Gộp toàn bộ mã nguồn vào một file duy nhất.'
    ],
    correctAnswers: [1],
    explanation: 'Bảo toàn Upgrade Path là tôn chỉ quan trọng nhất khi tùy biến ứng dụng Backbase.'
  },
  {
    id: 570,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'multi',
    question: 'Hai cơ chế nào cho phép mở rộng giao diện của một Journey OOTB? (Chọn 2)',
    options: [
      'View Slotting / Slot API (chèn UI tùy biến vào vị trí chừa sẵn).',
      'Screen Factory (thay thế hoàn toàn một màn hình mặc định bằng custom screen).',
      'Decompile file .aar để sửa trực tiếp file layout XML.',
      'Dán ảnh chụp màn hình mới đè lên màn hình cũ.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Slot API và Screen Factory là 2 cơ chế chính thống để mở rộng UI của Journey.'
  },
  {
    id: 571,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Khi re-bind một Repository trong Hilt Module, scope chuẩn thường là gì?',
    options: [
      '@ActivityScoped cho mọi thứ.',
      '@Singleton (hoặc Scope tương ứng với Journey Component) để tránh khởi tạo lại liên tục gây tốn tài nguyên.',
      'Không bao giờ đặt scope.',
      '@ViewModelScoped trên Repository.'
    ],
    correctAnswers: [1],
    explanation: 'Repository thường được scoped ở mức Singleton hoặc Component tương ứng để tái sử dụng instance.'
  },
  {
    id: 572,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Điều gì quyết định một ứng dụng Backbase Android sẵn sàng để release (Production-ready)?',
    options: [
      'Đã xóa bỏ toàn bộ mã nguồn của Backbase.',
      'Tuân thủ kiến trúc EBP, tối đa hóa Adopt OOTB, các phần mở rộng thực hiện qua Extension Points chuẩn (DI, Routers, Screen Factories), và đạt các tiêu chuẩn bảo mật ngân hàng.',
      'Có thể chạy trên hệ điều hành Windows Phone.',
      'Không sử dụng bất kỳ thư viện nào của Google Jetpack.'
    ],
    correctAnswers: [1],
    explanation: 'Ứng dụng Production-ready phải chuẩn kiến trúc EBP, giữ Upgrade Path và bảo mật nghiêm ngặt.'
  }
]
