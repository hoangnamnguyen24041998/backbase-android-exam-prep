import type { Question } from '../exam.types'

/**
 * Section 5: Android Essentials for Journeys (Extend and Build)
 * Quota in Exam: 22 questions
 * Pool Size: 73 questions
 */
export const extendBuildQuestions: Question[] = [
  {
    id: 501,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'When a bank wants to preserve the underlying API call logic of an OOTB `AccountsUseCase` (such as `ArrangementsUseCaseImpl`), but needs to add **Analytics logging**, **filter out closed accounts**, or perform **data enrichment** before returning the result to the Journey, which design pattern is most recommended by Backbase?',
    options: [
      'Copy all 1,000 lines of `ArrangementsUseCaseImpl` into a new file and modify them directly.',
      'Use the **Decorator Pattern** (leveraging Kotlin class delegation: `class CustomAccountsUseCase(private val delegate: AccountsUseCase) : AccountsUseCase by delegate`), overriding only the specific method to invoke `delegate.getAccounts()`, transform the result, and return it.',
      'Use Reflection to modify the bytecode of the original class at runtime.',
      'Spawn a background `Thread` to directly mutate the RAM memory of the `ViewModel`.'
    ],
    correctAnswers: [1],
    explanation: '**Decorator Pattern** kết hợp với từ khóa ủy quyền `by delegate` (Class Delegation) của Kotlin là kỹ thuật mở rộng UseCase đỉnh cao trong Backbase: Bạn tiêm (inject) OOTB UseCase làm `delegate`, giữ nguyên mọi phương thức khác tự động chuyển tiếp qua `by delegate`, và chỉ override đúng hàm cần tiền xử lý (pre-process) hoặc hậu xử lý (post-process) dữ liệu.'
  },
  {
    id: 502,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'When registering a `CustomAccountsUseCase` (implemented as a Decorator wrapping Backbase\'s `DefaultAccountsUseCase`) in the **Dagger Hilt** dependency injection graph, how do you inject `DefaultAccountsUseCase` into `CustomAccountsUseCase` without causing a Circular Dependency error since both implement the same `AccountsUseCase` interface?',
    options: [
      'Hilt cannot be used with the Decorator Pattern.',
      'Use a **Custom Qualifier annotation** (e.g., `@DefaultUseCase` or inject the concrete `DefaultAccountsUseCase` type directly into the constructor of `CustomAccountsUseCase`), and then use `@Binds` to bind the unqualified `AccountsUseCase` interface to `CustomAccountsUseCase` for the Journey.',
      'Declare both classes with the same unqualified `@Binds` inside the same `@Module`.',
      'Remove the `@Inject` annotation from the entire project.'
    ],
    correctAnswers: [1],
    explanation: 'Trong Hilt/Dagger, nếu hai binding có cùng kiểu trả về là interface `AccountsUseCase`, Dagger sẽ báo lỗi `DuplicateBindings` hoặc vòng lặp. Giải pháp chuẩn là: 1) Inject trực tiếp class cụ thể `DefaultAccountsUseCase` (hoặc gắn `@Named("ootb")` / `@OotbUseCase` qualifier) vào constructor của `CustomAccountsUseCase`; và 2) Dùng `@Binds abstract fun bindAccountsUseCase(impl: CustomAccountsUseCase): AccountsUseCase` để Journey nhận được bản Decorator.'
  },
  {
    id: 503,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'In Dagger Hilt, what is the performance and syntactic difference between using `@Binds` (on an `abstract` function inside an `abstract class` module) and `@Provides` (on a regular function inside an `object` module) when mapping a `CustomUseCaseImpl` to a `UseCase` interface?',
    options: [
      '`@Binds` is purely a compile-time metadata declaration telling Dagger "whenever Interface X is requested, use Implementation Y" (provided Y has an `@Inject constructor`), avoiding intermediate factory method generation and reducing generated code size; whereas `@Provides` requires executing a method body.',
      '`@Binds` slows down application runtime speed by 10x compared to `@Provides`.',
      '`@Provides` can only be used for `Int` and `String` types.',
      '`@Binds` is not allowed to be used with Backbase interfaces.'
    ],
    correctAnswers: [0],
    explanation: 'Khi class `CustomUseCaseImpl` do bạn viết đã có `@Inject constructor(...)`, việc dùng `@Binds abstract fun bindMyUseCase(impl: CustomUseCaseImpl): MyUseCase` là cách tối ưu nhất trong Hilt vì trình sinh mã (codegen) chỉ cần nối trực tiếp đồ thị phụ thuộc mà không cần gọi qua một hàm khởi tạo trung gian như `@Provides`.'
  },
  {
    id: 504,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'When a bank wants to keep 4 out of 5 screens in an OOTB Journey intact, but needs to **completely replace 1 specific screen in the middle of the flow** (for example, replacing the default "Transaction Confirmation" screen with a bespoke Custom `Fragment` or Custom `@Composable`), which Backbase Journey extension mechanism enables this?',
    options: [
      '**Custom Screen Factory / Screen Replacement API** (by passing a custom factory/provider for that screen into the Journey\'s `*Configuration` or `NavigationConfiguration` object, while optionally reusing the Journey\'s `ViewModel` or `Router`).',
      'Discard all 5 screens of the Journey and rewrite the entire Journey from scratch.',
      'Call `System.exit(0)` when the user reaches the 3rd screen.',
      'Block the user from clicking the Continue button on the 2nd screen.'
    ],
    correctAnswers: [0],
    explanation: 'Nhiều Backbase Journeys cung cấp cơ chế **Screen Factory / Custom Screen Provider** trong cấu hình của chúng. Nó cho phép lập trình viên hoán đổi (swap) một `Fragment` hoặc một `@Composable` screen đơn lẻ bên trong Navigation Graph nội bộ của Journey bằng màn hình tùy chỉnh của ngân hàng mà không làm đứt gãy luồng đi của 4 màn hình OOTB còn lại.'
  },
  {
    id: 505,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'multi',
    question: 'When implementing a Backbase Journey\'s **Router / Navigator Interface** (e.g., `AccountsAndTransactionsRouter` or `CardsManagementRouter`) at the application layer (`:app` or `:navigation` module), which architectural principles must be followed? (Select 2)',
    options: [
      'The Router implementation class (e.g., `AppAccountsRouterImpl`) receives exit or transition signals from Journey A (along with minimal data such as `arrangementId`) and uses the app\'s `NavController` to navigate to Journey B (e.g., launching `PaymentJourney` or `StatementsJourney`).',
      'Keeping Router methods accepting only primitive data parameters or Domain IDs rather than passing target Journey `Fragment` instances directly ensures the two Journeys remain completely decoupled (Decoupled Navigation).',
      'The Router class should execute heavy database queries synchronously on the Main Thread for 30 seconds before navigating.',
      'Every time the user taps a navigation button, the Router must re-run `Backbase.initialize()` from scratch.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Pattern **Router / Coordinator** là xương sống của kiến trúc điều hướng lỏng (Decoupled Navigation) trong Backbase. Journey nguồn chỉ gọi `router.onTransactionSelected(id)`. Class `RouterImpl` nằm ở tầng App sẽ nắm giữ `NavController` (hoặc `Navigator` trung tâm) để quyết định xem hành động đó sẽ đẩy người dùng tới màn hình nào tiếp theo.'
  },
  {
    id: 506,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'A bank\'s technical requirement mandates that **every HTTP request** sent from the Android app to the Backbase API Gateway (including requests from OOTB GenClients and Custom APIs) must automatically attach global HTTP headers such as `X-Correlation-ID` (a fresh UUID per request), `X-Device-Fingerprint`, and `Accept-Language`. What is the standard architectural solution?',
    options: [
      'Manually modify every API call across all 50 screens in the app to pass extra header parameters.',
      'Implement an **`okhttp3.Interceptor`** (Application Interceptor) whose `intercept(chain: Interceptor.Chain): Response` method builds a new request via `chain.request().newBuilder().header("X-Correlation-ID", UUID.randomUUID().toString())...build()`, passes it to `chain.proceed(newRequest)`, and registers this Interceptor in the root `OkHttpClient` chain of the Backbase SDK.',
      'Send those header values via SMS in parallel with every HTTP call.',
      'Store the header values inside the user\'s profile picture filename.'
    ],
    correctAnswers: [1],
    explanation: 'Sử dụng **OkHttp `Interceptor`** đăng ký ở tầng `OkHttpClient` dùng chung (Core Networking) là cách tiếp cận chuẩn mực nhất cho các mối quan tâm xuyên suốt (Cross-cutting concerns). Mọi request đi qua `GenClient` hay `Retrofit` đều tự động được tiêm đầy đủ các header `X-Correlation-ID`, `X-App-Version`, `Accept-Language` một cách minh bạch.'
  },
  {
    id: 507,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'What is the key difference between an **Application Interceptor** (`addInterceptor(...)`) and a **Network Interceptor** (`addNetworkInterceptor(...)`) in `OkHttpClient`?',
    options: [
      'An `Application Interceptor` runs once per high-level logical call (even if the response is served from Cache or undergoes Redirects/Retries underneath) and is always allowed to execute even offline; whereas a `Network Interceptor` runs right at the physical network transport layer (executing multiple times on Redirects/Retries and not executing at all if served from local Cache).',
      'An `Application Interceptor` only works with FTP, while a `Network Interceptor` only works with Bluetooth.',
      'A `Network Interceptor` is invoked before the user even opens the application.',
      'Both methods are completely identical in their position within the OkHttp processing chain.'
    ],
    correctAnswers: [0],
    explanation: 'Trong kiến trúc chuỗi của OkHttp: **Application Interceptors** nằm ở đầu tiên, thích hợp nhất để gắn các Business Headers toàn cục (`X-Correlation-ID`, `Accept-Language`) hoặc theo dõi kết quả cuối cùng trả về cho ứng dụng. **Network Interceptors** nằm giữa tầng Retry/Redirect/Cache và tầng Socket thực tế, thích hợp để kiểm tra dữ liệu nén trên đường truyền (`Content-Encoding: gzip`) hoặc thông tin kết nối TLS.'
  },
  {
    id: 508,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'When writing Unit Tests for a `ViewModel` or `UseCase` that uses **Kotlin Coroutines** and **`Flow` / `StateFlow`**, which specialized testing library from CashApp (commonly paired with **JUnit** and **MockK**) makes asserting sequential emissions (`awaitItem()`, `awaitError()`, `awaitComplete()`, `cancelAndIgnoreRemainingEvents()`) most intuitive and concise?',
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
    question: 'When writing a Unit Test for a `ViewModel` that uses `viewModelScope` (which defaults to `Dispatchers.Main`), what must a developer configure in the test class (using `kotlinx-coroutines-test`) so the test runs successfully on a local JVM where Android\'s Main UI thread does not exist? (Select 2)',
    options: [
      'Use `Dispatchers.setMain(testDispatcher)` (typically wrapped in a JUnit `@Rule` / `TestWatcher` or `@BeforeEach`) with a `StandardTestDispatcher` or `UnconfinedTestDispatcher`, and call `Dispatchers.resetMain()` in `@AfterEach`.',
      'Wrap the test body in a **`runTest { ... }`** block to automatically skip virtual `delay` calls and control coroutine execution progress.',
      'A physical Android phone must be plugged in via USB to run `ViewModel` Unit Tests.',
      'Place `Thread.sleep(60000)` at the end of every test function to wait for coroutines to finish.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Trên môi trường Local JVM Unit Test (`src/test/`), `Dispatchers.Main` mặc định của Android không tồn tại và sẽ ném lỗi `IllegalStateException: Module with the Main dispatcher had failed to initialize`. Việc thay thế `Dispatchers.setMain(testDispatcher)` kết hợp với `runTest { ... }` giúp toàn bộ code trong `viewModelScope.launch` chạy tức thời, bỏ qua mọi `delay()` ảo và dễ dàng kiểm soát bằng `advanceUntilIdle()`.'
  },
  {
    id: 510,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'In the **MockK** library used for Kotlin Unit Testing in Backbase Android projects, what is the difference between `every { ... } returns ...` and `coEvery { ... } returns ...` (as well as `verify` vs. `coVerify`)?',
    options: [
      '`every` and `verify` are used for regular (non-suspend) functions; whereas **`coEvery`** and **`coVerify`** must be used when stubbing or verifying asynchronous functions marked with the **`suspend`** keyword.',
      '`coEvery` is only used to test code written in COBOL.',
      '`every` only works during daytime, while `coEvery` only works at night.',
      'Both functions are completely identical and interchangeable without ever causing a compilation error.'
    ],
    correctAnswers: [0],
    explanation: 'Các phương thức trong `UseCase` hoặc `GenClient` của Backbase hầu hết là các hàm `suspend`. Để giả lập hành vi của một hàm `suspend` trong MockK, bạn bắt buộc phải dùng khối `coEvery { useCase.getAccounts() } returns ...` và kiểm tra lời gọi bằng `coVerify(exactly = 1) { useCase.getAccounts() }` (tiền tố `co` viết tắt cho Coroutine).'
  },
  {
    id: 511,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'When testing a `ViewModel` with `StandardTestDispatcher` inside a `runTest` block and using **Turbine** (`viewModel.uiState.test { ... }`), why is `StandardTestDispatcher` often more useful than `UnconfinedTestDispatcher` when verifying an exact sequence of state transitions from `Idle` -> `Loading` -> `Success`?',
    options: [
      'Because `StandardTestDispatcher` queues new coroutines on the virtual scheduler instead of executing them eagerly right away, allowing the test collector to subscribe in time and capture every intermediate state (`Loading` followed by `Success`) via `awaitItem()`.',
      'Because `StandardTestDispatcher` automatically connects to the Production server to fetch real data.',
      'Because `UnconfinedTestDispatcher` wipes the computer\'s hard drive.',
      'Because `StandardTestDispatcher` does not require the `suspend` keyword.'
    ],
    correctAnswers: [0],
    explanation: 'Nếu một hàm trong `ViewModel` phát ra `Loading` rồi gọi ngay một mock `UseCase` trả kết quả tức thì để phát tiếp `Success`, khi dùng `UnconfinedTestDispatcher`, cả hai trạng thái có thể chạy vèo qua trước khi bộ thu thập kịp kiểm tra, dẫn đến trạng thái `Loading` bị ghi đè mất (conflated) trong `StateFlow`. Với `StandardTestDispatcher`, bạn kiểm soát chính xác từng nhịp thực thi của coroutine.'
  },
  {
    id: 512,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'When a bank builds a brand-new Backend microservice (or exposes a new API via an OpenAPI specification file `my-custom-service-openapi.yaml`), what is the standard Backbase-aligned workflow to integrate this API into the Android app\'s Data layer?',
    options: [
      'Manually concatenate JSON strings using `"{" + name + "}"` and send them over `HttpURLConnection`.',
      'Use the **OpenAPI Generator Gradle Plugin** (or Backbase OpenAPI Codegen toolchain) to automatically generate a **Custom GenClient** library (containing standardized API classes and DTO models) from the `.yaml` specification, then inject this GenClient into a Custom UseCase / Repository.',
      'Take a screenshot of the Swagger documentation and use an on-device OCR library to read the text.',
      'Write raw SQL queries directly inside `strings.xml`.'
    ],
    correctAnswers: [1],
    explanation: 'Theo đúng triết lý Contract-First (API-First) của Backbase: mọi giao tiếp giữa Mobile và Backend đều xuất phát từ hợp đồng OpenAPI Specification (`.yaml` / `.json`). Sử dụng OpenAPI Generator trong quá trình build giúp tự động sinh ra client code đồng bộ với các OOTB GenClients, loại bỏ hoàn toàn lỗi gõ sai tên trường JSON thủ công.'
  },
  {
    id: 513,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'multi',
    question: 'When building a brand-new **Custom Journey** from scratch to integrate into the Modelbank app, which Backbase architectural standards should be applied to this new Journey module? (Select 3)',
    options: [
      'Clearly define a `*Configuration` class (with a Kotlin DSL Builder and default values using `DeferredText`/`DeferredDrawable`), one or more `*UseCase` interfaces for data needs, and a `*Router` interface for outward navigation.',
      'Build the UI using **Mobile Design System (MDS)** components and reference Design Tokens (`BackbaseTheme` / Theme attributes) exclusively to support Light/Dark themes and White-labeling automatically.',
      'Avoid direct dependencies on any other Journey module or concrete network layer implementation (decoupling the `*UseCaseImpl` from the Journey\'s UI module).',
      'Put all code for the new Journey into a single 15,000-line `MainActivity.kt` file.'
    ],
    correctAnswers: [0, 1, 2],
    explanation: 'Một Custom Journey đạt chuẩn Backbase phải có cấu trúc "giống hệt như một OOTB Journey do chính Backbase phát hành": Có `*Configuration` DSL, tách biệt `*UseCase` interface khỏi implementation, điều hướng qua `*Router` interface, và sử dụng 100% MDS Design Tokens.'
  },
  {
    id: 514,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'In Backbase Digital Banking Services (DBS), how is the **Data Extensions (`additions: Map<String, String>` / Custom Additional Properties)** mechanism on DTO objects (such as `Account`, `Transaction`, `PaymentOrder`) used when extending features on Android?',
    options: [
      'It allows the bank to pass custom domain-specific fields (e.g., `"taxCode"`, `"loyaltyPoints"`, `"branchCode"`) inside the `additions` map of standard API payloads without breaking the original OpenAPI schema; in the Android Custom UseCase/Mapper layer, developers read `dto.additions["loyaltyPoints"]` and map it to the UI.',
      'It is used to add two integers in a calculator app.',
      'It is used to automatically install third-party apps from the Play Store.',
      'The `additions` field is always stripped out by OkHttp before reaching the app.'
    ],
    correctAnswers: [0],
    explanation: 'Cơ chế **`additions`** (Schema Extension) là một điểm mở rộng cực kỳ mạnh mẽ của Backbase DBS. Khi ngân hàng cần gửi thêm 1-2 trường dữ liệu đặc thù trong đối tượng Giao dịch hoặc Lệnh chuyển tiền, Backend đặt chúng vào map `additions`, và trên Android, lập trình viên có thể truy xuất `additions` trong Custom UseCase Decorator hoặc Custom Mapper/Slot View.'
  },
  {
    id: 515,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Suppose you are extending a payment transfer flow that requires integrating **Step-up Authentication / Out-of-Band Transaction Signing** with the Backbase Identity SDK when the server returns an authentication challenge. Which architectural coordination flow is most accurate?',
    options: [
      'Ignore the authentication challenge and display a fake "Transfer Successful" screen on the UI.',
      'When `PaymentUseCase` receives a step-up challenge response (Challenge/Confirmation ID) from the Payment Order service, the Journey/Router triggers the approval flow of the **Authentication / Approving SDK (Identity / FIDO / Biometric Prompt)**; once the user cryptographically signs the challenge, the callback returns control to complete the payment order.',
      'Ask the user to enter their password into an unencrypted HTTP webpage.',
      'Reboot the phone to bypass the signature check automatically.'
    ],
    correctAnswers: [1],
    explanation: 'Trong kiến trúc bảo mật ngân hàng của Backbase, các giao dịch nhạy cảm (như Tạo lệnh chuyển tiền giá trị lớn, Thêm người thụ hưởng mới) sử dụng cơ chế **Transaction Signing / Step-up Authentication**. Payment Journey sẽ phối hợp (qua UseCase hoặc Router hook) với Identity/Auth SDK để hiển thị màn hình xác thực sinh trắc học/mã PIN ký thách thức mật mã trước khi lệnh được thực thi.'
  },
  {
    id: 516,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'When using **Koin** (or a hybrid setup with Koin inside certain OOTB Journeys and Hilt at the application layer) to override a default dependency definition (for instance, replacing the default `AccountsUseCase` with `CustomAccountsUseCase`), which syntax in a Koin Module ensures the new definition is permitted to override the existing one?',
    options: [
      'Declare the new binding with `single<AccountsUseCase> { CustomAccountsUseCase(get()) }` (or `factory`) in an extension module loaded afterward, combined with `allowOverride(true)` (or `override = true` depending on the Koin version) on the Koin Application.',
      'Delete the entire Koin library from the project.',
      'Give the new class the exact same package and class name as the old class to trigger a `DuplicateClassException`.',
      'Call `System.gc()` 10 times in a row.'
    ],
    correctAnswers: [0],
    explanation: 'Trong hệ thống DI sử dụng Koin của Modelbank, các module cấu hình mặc định có thể được nạp trước và các module tùy biến của dự án nạp sau. Việc định nghĩa lại `factory<UseCase> { CustomUseCase(...) }` với cơ chế `allowOverride(true)` cho phép thay thế mượt mà bất kỳ UseCase hay Router nào mà không cần sửa module gốc.'
  },
  {
    id: 517,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'multi',
    question: 'When designing an **Offline Caching / Single Source of Truth** mechanism in a Custom Repository/UseCase using **Room Database** and a **DBS GenClient**, which data flow patterns below deliver the smoothest user experience (Offline-first / Stale-While-Revalidate)? (Select 2)',
    options: [
      'Expose data externally as a `Flow<List<AccountDomain>>` read directly from the **Room DAO** (making Room the single source of truth emitting data to the UI).',
      'When triggering a data refresh, call the **DBS GenClient** on a background dispatcher (`Dispatchers.IO`), map the DTOs to Entities, and write updates (`upsert` / `@Transaction`) into the **Room Database**; as soon as Room updates, it automatically emits the latest list via `Flow` to the `ViewModel` and UI.',
      'Wipe the entire database before checking whether the phone has an active Internet connection.',
      'Block the UI rendering thread (Main Thread) until the server responds before allowing any user touch interaction.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Mẫu thiết kế **Single Source of Truth (SSOT)** với Room + Flow là kiến trúc chuẩn mực của Google và Backbase: UI chỉ quan sát `Flow` từ Room DAO (giúp hiển thị ngay lập tức dữ liệu đã lưu trong máy kể cả khi mất mạng). Khi mạng trả về dữ liệu mới, tầng Data cập nhật vào Room và Room tự động kích hoạt emission mới lên UI.'
  },
  {
    id: 518,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'When writing a data transformation function (**Mapper**) to convert a network-layer DTO object into a Domain Model in Kotlin, which coding style is the cleanest, most idiomatic, and easiest to unit-test?',
    options: [
      'Write stateless **top-level Kotlin Extension Functions** (e.g., `fun ArrangementItemDto.toDomain(): AccountSummary = ...`) or a stateless `Mapper` class free of Android `Context` dependencies, and write Unit Tests covering edge cases (null fields, empty lists, negative values).',
      'Place all data mapping logic inside the `onDraw(canvas: Canvas)` method of a `CustomView`.',
      'Use `SharedPreferences` as a temporary staging area for every single field during mapping.',
      'Use Regular Expressions (Regex) to slice and dice the object\'s `toString()` output.'
    ],
    correctAnswers: [0],
    explanation: 'Hàm mở rộng thuần túy (`Extension Function` như `Dto.toDomain()`) hoặc một class Mapper stateless là các hàm thuần khiết (Pure Functions): với cùng một đầu vào luôn cho ra đúng một đầu ra và không có hiệu ứng phụ (Side-effects). Chúng chạy cực nhanh trong Unit Test (chỉ mất vài mili-giây cho hàng trăm test cases).'
  },
  {
    id: 519,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'When a Custom Screen in a Journey needs to load paginated data (**Pagination** — e.g., a transaction history list with thousands of records from `TransactionsGenClient` supporting `from`/`page` and `size` parameters), which Android architectural approach loads pages smoothly and memory-efficiently?',
    options: [
      'Always pass `size = 99999999` to download 10 years of transaction history in a single network call.',
      'Use the **Jetpack Paging 3** library (`PagingSource` / `RemoteMediator` returning `Flow<PagingData<TransactionUiModel>>`) or state-driven pagination (`nextPageCursor`, `isLoadingMore`) in the `UseCase`/`ViewModel` triggered when the user scrolls near the end of the list (`LazyColumn` / `RecyclerView`).',
      'Display at most the first 3 transactions and forbid users from viewing older transactions.',
      'Open a separate `Activity` window for every single transaction.'
    ],
    correctAnswers: [1],
    explanation: 'Các API danh sách lớn trong DBS (như Transactions, Notifications, Audit Messages) đều phân trang qua `from`/`size` hoặc `cursor`. Việc triển khai `PagingSource` của Jetpack Paging 3 (hoặc cơ chế state-driven pagination trong UDF ViewModel) giúp tải dữ liệu theo nhu cầu cuộn (on-demand), giữ mức tiêu thụ RAM ổn định và hỗ trợ retry từng trang lỗi.'
  },
  {
    id: 520,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'When passing navigation data via a **Deep Link** (for example, a customer taps a Push Notification or promotional link `mybank://app/accounts/acc-123/transactions` to jump straight to a specific account\'s transaction details inside `AccountsJourney`), what secure handling flow must be implemented?',
    options: [
      'Open the account details screen immediately and display the balance without checking whether the user is logged in.',
      'The root/app navigation layer intercepts the Deep Link URI and checks the authentication session state: if unauthenticated, it temporarily stores the target Deep Link (`PendingDeepLink`) and redirects to `AuthenticationJourney` first; only after successful login does it validate/parse the parameters and safely navigate to the target screen inside `AccountsJourney`.',
      'Delete the push notification immediately and close the app.',
      'Open an external web browser to search for that URI on Google.'
    ],
    correctAnswers: [1],
    explanation: 'Trong ứng dụng ngân hàng, hầu hết các màn hình bên trong các Journey đều yêu cầu phiên xác thực hợp lệ (Authenticated Session). Do đó, kiến trúc **Deferred / Authenticated Deep Linking** là bắt buộc: lưu giữ ý định điều hướng (Pending Intent / DeepLink URI) qua bước đăng nhập sinh trắc học/mật khẩu rồi mới thực thi lệnh điều hướng của Router vào sâu trong Journey.'
  },
  {
    id: 521,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'multi',
    question: 'When writing custom UI in **Jetpack Compose** to embed into an OOTB Journey\'s **Slot API** or to build a Custom Screen, which practices help prevent performance issues (recomposition storms) and lifecycle leaks? (Select 2)',
    options: [
      'Never execute network calls or heavy object allocations directly inside the `@Composable` function body; instead use `LaunchedEffect(key)` for lifecycle-bound side effects or delegate the logic to a `ViewModel`.',
      'Use `remember { ... }` and `derivedStateOf { ... }` appropriately for UI list filtering/sorting calculations, and always provide a stable, unique `key = { item -> item.id }` for items in `LazyColumn` / `LazyRow`.',
      'Always call `viewModel.fetchData()` directly on the first line of the `@Composable` function without `LaunchedEffect` so that every frame recomposition (60 times/second) fires 60 extra server requests.',
      'Pass the entire `Activity` instance into every data class in the Domain layer.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Một hàm `@Composable` có thể được gọi lại (recomposed) hàng chục lần mỗi giây khi có hiệu ứng chuyển động. Do đó: 1) Tuyệt đối không đặt side-effects (như gọi API) trần trụi trong thân hàm Composable mà phải qua `ViewModel.init` hoặc `LaunchedEffect`; 2) Luôn khai báo `key = { it.id }` trong `LazyColumn` để Compose nhận diện đúng từng dòng và chỉ vẽ lại dòng có dữ liệu thay đổi.'
  },
  {
    id: 522,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Suppose you need to embed a **Jetpack Compose** UI component inside an older OOTB Journey screen built with the traditional **Android View / XML (`Fragment`)** system, or conversely embed a **Custom Android `View`** from MDS inside a **Jetpack Compose** screen. Which two standard Android interoperability APIs are used?',
    options: [
      'Use **`ComposeView`** (configured with `setViewCompositionStrategy(ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed)`) when embedding Compose into XML/Fragments; and use the **`AndroidView(factory = { context -> ... }, update = { view -> ... })`** Composable when embedding traditional Views into Compose.',
      'Android Views and Jetpack Compose cannot be combined within the same application.',
      'Take a screenshot of the View, save it to an SD card, and read it back inside Compose.',
      'Use a `WebView` as an intermediary for every button.'
    ],
    correctAnswers: [0],
    explanation: 'Trong quá trình chuyển dịch công nghệ hoặc mở rộng các Journey lai (Hybrid View/Compose), `ComposeView` (luôn nhớ đặt `DisposeOnViewTreeLifecycleDestroyed` khi dùng trong Fragment hoặc RecyclerView để tránh leak bộ nhớ) và `AndroidView` là bộ đôi Interop API chính thức giúp kết hợp liền mạch hai thế hệ UI toolkit.'
  },
  {
    id: 523,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'In Unit Testing with **MockK**, when a method on a `Router` or `AnalyticsTracker` returns `Unit` (a fire-and-forget action), how do you configure the mock so MockK does not throw `MockKException: no answer found`?',
    options: [
      'Use `justRun { router.onNavigateNext(any()) }` (or `every { router.onNavigateNext(any()) } just Runs`), or initialize the mock with `mockk<MyRouter>(relaxed = true)` / `relaxUnitFun = true`.',
      'Pass `0` as the return value for the `Unit` function.',
      'Delete the function from the interface.',
      'Change the return type of every function in the project to `Double`.'
    ],
    correctAnswers: [0],
    explanation: 'Mặc định trong MockK (`strict` mode), mọi lệnh gọi hàm trên đối tượng mock đều phải được định nghĩa hành vi trước. Đối với các hàm trả về `Unit` (như các hàm điều hướng trong `Router` hoặc ghi log), lập trình viên có thể dùng cú pháp ngắn gọn `justRun { router.onExit() }` hoặc bật cờ `relaxUnitFun = true` khi tạo `mockk(relaxUnitFun = true)`.'
  },
  {
    id: 524,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'When writing a Unit Test that needs to inspect the exact properties of a complex object passed as an argument to a dependency method (e.g., verifying that `paymentUseCase.submitPayment(request)` was called by the `ViewModel` with `request.amount == BigDecimal("500.00")` and currency `"EUR"`), which **MockK** feature captures this argument?',
    options: [
      'Use a **`CapturingSlot`** via `val slot = slot<PaymentRequest>()` combined with `coVerify { paymentUseCase.submitPayment(capture(slot)) }`, then assert directly on `slot.captured.amount` (or use `withArg { ... }` / `match { ... }`).',
      'Guess the result without inspecting the argument.',
      'Print the argument to a physical paper printer and read it manually.',
      'There is no way to inspect function arguments in MockK.'
    ],
    correctAnswers: [0],
    explanation: '`slot<T>()` và `capture(slot)` (hoặc `match { it.amount == ... }` / `withArg { assertEquals(..., it.amount) }`) trong MockK là công cụ cực kỳ đắc lực để xác minh chính xác dữ liệu mà `ViewModel` hoặc `Decorator UseCase` đã biến đổi trước khi đẩy xuống tầng dưới.'
  },
  {
    id: 525,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'When a `ViewModel` uses `SavedStateHandle` to receive Navigation Arguments and persist UI state across OS **Process Death**, how should this `ViewModel` be tested in a Unit Test?',
    options: [
      'Instantiate a real `val savedStateHandle = SavedStateHandle(mapOf("accountId" to "acc-999"))` directly and pass it into the `ViewModel` constructor in the test without needing to mock `SavedStateHandle`.',
      'It is impossible to write Unit Tests for any `ViewModel` that uses `SavedStateHandle`.',
      'Physically remove and reinsert the phone battery while running the test.',
      'Pass `null` using an unsafe cast.'
    ],
    correctAnswers: [0],
    explanation: '`androidx.lifecycle.SavedStateHandle` là một class thuần túy có hỗ trợ sẵn constructor nhận vào một `Map<String, Any?>` ban đầu. Trong Unit Test, thực hành tốt nhất là khởi tạo trực tiếp `SavedStateHandle(mapOf("key" to "value"))` thật thay vì mock nó, giúp kiểm tra chính xác cả hành vi đọc argument lẫn hành vi `savedStateHandle.getStateFlow(...)`.'
  },
  {
    id: 526,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'multi',
    question: 'When a bank needs to collect user behavior analytics (**Analytics & Observability** — e.g., tracking `ScreenView` and `UserAction` events) across both OOTB Journeys and Custom Journeys without polluting business logic, which mechanisms in the Backbase architecture provide the best support? (Select 2)',
    options: [
      'Register an event listener/handler on the **Backbase Tracker / Analytics Event Bus (`AnalyticsTracker` / `EventReceiver`)** built into OOTB Journeys to forward standardized Journey events to the bank\'s analytics platform (Firebase Analytics, Adobe, Mixpanel, etc.).',
      'Combine **UseCase Decorators** or **Router Implementations** to record custom domain events (such as transaction completion or flow transitions) at a centralized point.',
      'Send customer login passwords and card PINs in plain text to Google Analytics.',
      'Require users to keep a handwritten diary of app usage and mail it to the bank at the end of each month.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Các Backbase OOTB Journeys đã được gắn sẵn các điểm phát sự kiện theo dõi (Screen views & User actions) thông qua cơ chế `Tracker` / `Observers` của SDK. Ngân hàng chỉ cần đăng ký một subscriber/listener ở tầng `:app` để nhận toàn bộ luồng sự kiện này và đẩy sang công cụ Analytics nội bộ (đảm bảo tuyệt đối tuân thủ quy định bảo mật PII/GDPR, không bao giờ gửi dữ liệu nhạy cảm).'
  },
  {
    id: 527,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'When extending or building a `UseCase` that merges data from **2 different asynchronous sources** (for example, combining the accounts list `Flow` from `AccountsRepository` with the balance visibility preference `Flow` from `UserPreferencesDataStore`), which Kotlin `Flow` operator is best suited to always emit the latest combined state whenever either source changes?',
    options: [
      'The **`combine(accountsFlow, hideBalanceFlow) { accounts, hideBalance -> ... }`** operator.',
      'The `Thread.stop()` operator.',
      'The `System.exit()` operator.',
      'Two `Flow` instances cannot be combined in Kotlin.'
    ],
    correctAnswers: [0],
    explanation: 'Toán tử `combine` trong `kotlinx.coroutines.flow` lắng nghe đồng thời nhiều upstream flows; sau khi mỗi flow đã phát ra ít nhất 1 giá trị, bất cứ khi nào một trong các flow nguồn phát ra giá trị mới (ví dụ người dùng gạt nút "Ẩn số dư"), khối lambda của `combine` sẽ tự động được tính toán lại với giá trị mới nhất của các flow còn lại.'
  },
  {
    id: 528,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'In Kotlin `Flow`, what is the behavioral difference between the `combine` operator and the `zip` operator?',
    options: [
      '`combine` recomputes as soon as ANY upstream flow emits a new value (using the latest value from the other flows); whereas `zip` pairs emissions strictly 1-to-1 by index and always WAITS for both flows to emit a corresponding new item before emitting the next result.',
      '`zip` compresses `.rar` files on the hard disk, while `combine` decompresses them.',
      '`combine` only works with `String` types, while `zip` only works with `Int` types.',
      'Both operators behave identically in every situation.'
    ],
    correctAnswers: [0],
    explanation: 'Hiểu rõ sự khác biệt giữa `combine` và `zip` là kiến thức thiết yếu khi xử lý Reactive Streams trong tầng Domain/Presentation: `combine` lý tưởng cho việc ghép các luồng trạng thái giao diện (`UiState`) có tần suất cập nhật khác nhau; còn `zip` chỉ dùng khi muốn ghép từng cặp sự kiện tương ứng 1-đối-1.'
  },
  {
    id: 529,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'When building a **real-time transaction search (Live Search)** feature in a Custom Screen or Custom UseCase, which combination of `Flow` operators on the user\'s text input stream (`searchQueryFlow`) prevents firing dozens of redundant network requests during fast typing and automatically cancels in-flight requests when a newer query is typed?',
    options: [
      '`searchQueryFlow.debounce(300).distinctUntilChanged().flatMapLatest { query -> repository.searchTransactions(query) }`',
      '`searchQueryFlow.collect { repository.searchTransactions(it) }` (without any filtering or cancellation operators).',
      '`searchQueryFlow.map { Thread.sleep(10000) }`',
      'Force the user to restart the app after typing each letter into the search box.'
    ],
    correctAnswers: [0],
    explanation: 'Bộ ba kinh điển cho chức năng Live Search trong Coroutines Flow là: 1) `debounce(300)` chờ người dùng ngừng gõ 300ms; 2) `distinctUntilChanged()` bỏ qua nếu từ khóa mới trùng hệt từ khóa vừa tìm; và 3) **`flatMapLatest`** tự động hủy (cancel) coroutine gọi mạng của từ khóa cũ ngay lập tức nếu có từ khóa mới đi tới, tránh cả lãng phí băng thông lẫn lỗi hiển thị kết quả cũ đè lên kết quả mới (Out-of-order responses).'
  },
  {
    id: 530,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'When handling exceptions inside a `Flow` pipeline using the `.catch { exception -> ... }` operator, what important rule of Kotlin Flow must be remembered?',
    options: [
      'The `.catch` operator only catches exceptions thrown by operators **upstream** of it and DOES NOT catch exceptions thrown in operators or the `.collect { ... }` block **downstream** of it; furthermore, `CancellationException` must never be swallowed.',
      'The `.catch` operator can catch errors occurring in a different app installed on the same phone.',
      'The `.catch` operator must always be placed on the very first line before creating `flow { ... }`.',
      'The `.catch` operator automatically fixes backend server logic bugs.'
    ],
    correctAnswers: [0],
    explanation: 'Trong Kotlin Flow, `.catch` tuân thủ tính minh bạch ngoại lệ (Exception Transparency): nó chỉ chặn bắt lỗi từ các nguồn phát và toán tử nằm phía trên nó (upstream). Ngoài ra, trong Coroutines nói chung, nếu dùng `try / catch (e: Exception)` thủ công, bạn luôn phải kiểm tra `if (e is CancellationException) throw e` để không làm gãy cơ chế hủy Structured Concurrency.'
  },
  {
    id: 531,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'multi',
    question: 'When a bank extends an OOTB Journey by passing a **Custom View / Composable through a Slot API**, how can the custom UI component inside that Slot cleanly interact with business data or trigger navigation following MVVM principles? (Select 2)',
    options: [
      'The UI component in the Slot can receive contextual data (passed by the Journey\'s Slot API lambda parameters) or connect to its own dedicated `ViewModel` for the extension feature to load additional data independently.',
      'When the user interacts with the component in the Slot (e.g., tapping a "New Card Offer" banner), the event is handled by its `ViewModel` or forwarded through a `Router` / `Navigator` to navigate to the card application flow without modifying the OOTB Journey\'s internal code.',
      'The component in the Slot uses Reflection to break `private` visibility and delete data inside the OOTB Journey\'s `ViewModel`.',
      'The component in the Slot calls `Activity.finishAffinity()` to shut down the entire app whenever it is rendered.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Thành phần được nhúng vào một Slot hoàn toàn có thể là một "Mini-Feature" tự chủ: nó có thể hiển thị dữ liệu ngữ cảnh do Journey cha truyền cho Slot (như `accountId`), hoặc gắn với một `ViewModel` độc lập (tiêm qua Hilt `hiltViewModel()` / Koin `koinViewModel()`) và gọi `Router` để điều hướng khi người dùng tương tác.'
  },
  {
    id: 532,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'When writing a custom `okhttp3.Interceptor` to inspect the JSON payload of a server `Response` (e.g., to read a custom business error code in the body without breaking downstream consumption by `GenClient` / `Retrofit`), why must a developer NEVER call `response.body?.string()` directly and return the original `response` object?',
    options: [
      'Because OkHttp\'s `ResponseBody` stream can only be consumed **ONCE** (a one-shot stream); if the Interceptor calls `response.body?.string()`, the underlying stream is closed and causes the downstream `GenClient`/Moshi parser to throw `IllegalStateException: closed`. Instead, use **`response.peekBody(maxBytes)`** or recreate a new `ResponseBody` attached via `response.newBuilder().body(...)`.',
      'Because calling `string()` automatically deletes data on the backend server.',
      'Because OkHttp does not support reading strings longer than 5 characters.',
      'Because accessing `response.body` disconnects Bluetooth headphones.'
    ],
    correctAnswers: [0],
    explanation: 'Đây là một bẫy kỹ thuật thực tế rất phổ biến khi làm việc với OkHttp `Interceptor`: `ResponseBody` là một luồng byte trực tiếp từ socket mạng nên chỉ đọc được 1 lần (`consumed once`). Nếu cần xem trước nội dung trong Interceptor mà không làm mất luồng của tầng parser phía trên, hãy sử dụng `response.peekBody(Long)` hoặc tạo bản sao `ResponseBody.create(contentType, contentString)`.'
  },
  {
    id: 533,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'When extending the application to support **Push Notifications** with the Backbase Push Notification SDK and Firebase Cloud Messaging (`FirebaseMessagingService`), what are the two core responsibilities that the application\'s `FirebaseMessagingService` subclass must fulfill?',
    options: [
      '1) Override `onNewToken(token: String)` to register/update the new FCM Device Token with Backbase\'s Push Integration service once the user is authenticated; and 2) Override `onMessageReceived(remoteMessage: RemoteMessage)` to pass the notification payload to the Backbase Notification handler / display a System Notification with Deep Link navigation.',
      'Only declare the class name in `README.md` without registering it in `AndroidManifest.xml`.',
      'Poll the server in a loop every 0.5 seconds to check for new notifications.',
      'Automatically turn the speakerphone volume to maximum at 2 AM.'
    ],
    correctAnswers: [0],
    explanation: 'Tích hợp Push Notifications trong Backbase yêu cầu đồng bộ FCM registration token của thiết bị với tài khoản người dùng trên Backbase Engagement/Push service (qua `onNewToken` và ngay sau khi đăng nhập thành công), đồng thời phân tích payload trong `onMessageReceived` để hiển thị thông báo hoặc kích hoạt luồng phê duyệt giao dịch (Out-of-Band Push Approval).'
  },
  {
    id: 534,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'In a multi-module architecture of a large Backbase Android project, if multiple Custom Journeys need to share a set of IBAN formatting utility functions or a shared Domain Model, where should those shared components be placed?',
    options: [
      'Copy-paste that code into all 15 different Journey modules.',
      'Place them in a low-level shared foundation module (e.g., `:core:common`, `:core:model`, or `:shared:domain`) that has no upward dependencies on any Journey, allowing Journey modules to depend on it unidirectionally and safely.',
      'Place them in the `:app` module and force all Journey modules to depend upward on `:app`.',
      'Host them on a public pastebin website.'
    ],
    correctAnswers: [1],
    explanation: 'Các module tính năng (Journeys) tuyệt đối không được phụ thuộc ngược lên `:app` và không được phụ thuộc chéo vào nhau. Mọi logic hoặc model dùng chung giữa nhiều Journey phải được trích xuất xuống các module tầng dưới (`:core:*` hoặc `:shared:*`) nằm ở đáy của đồ thị phụ thuộc (Dependency Graph).'
  },
  {
    id: 535,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'When performing automated **UI Testing** for a screen built with **Jetpack Compose** in a Custom Journey, which tool is used to locate nodes on screen, simulate gestures (`performClick()`, `performTextInput()`), and verify visibility (`assertIsDisplayed()`)?',
    options: [
      '**`ComposeTestRule`** (`createComposeRule()` or `createAndroidComposeRule<ComponentActivity>()`) combined with semantic matchers (`onNodeWithText(...)`, `onNodeWithTag(...)`, `onNodeWithContentDescription(...)`).',
      'Use the desktop `java.awt.Robot` library.',
      'It can only be tested by taking photos of the screen with an external digital camera.',
      'There are no automated testing tools available for Jetpack Compose.'
    ],
    correctAnswers: [0],
    explanation: '`ComposeTestRule` sử dụng cây ngữ nghĩa (**Semantics Tree**) của Jetpack Compose để tìm kiếm phần tử (`onNodeWithText`, `onNodeWithContentDescription`, `onNodeWithTag`), đồng bộ hóa tự động với xung nhịp vẽ khung hình (Virtual Clock / IdlingResource tích hợp sẵn) và thực thi các thao tác kiểm thử cực kỳ ổn định khi truyền vào một Stateless Composable cùng trạng thái `UiState` giả lập.'
  },
  {
    id: 536,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'multi',
    question: 'Why is passing a **Stateless Composable** (e.g., `PaymentFormScreenContent(uiState = ..., onEvent = ...)`) into `composeTestRule.setContent { BackbaseTheme { ... } }` strongly preferred over launching the full `Activity` + `ViewModel` + `Network` stack when testing the rendering logic of individual UI states? (Select 2)',
    options: [
      'The test can directly pass any arbitrary `UiState` (such as `Loading`, offline `Error`, or a list with 50 accounts) into the Composable to verify the UI immediately without complex network-layer mocking.',
      'Execution is blazingly fast, completely deterministic (free from network or threading flakiness), and makes it trivial to verify whether user interactions invoke the `onEvent` callbacks with the expected arguments.',
      'Because `ComposeTestRule` forbids using `BackbaseTheme`.',
      'Because this approach makes the app automatically download extra data from the live production server.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Nhờ kiến trúc **Unidirectional Data Flow (UDF)** và **State Hoisting**, tầng UI chỉ là một hàm ánh xạ thuần túy từ `UiState` sang các phần tử hiển thị. Kiểm thử trực tiếp trên Stateless Composable bọc trong `BackbaseTheme` giúp kiểm tra chớp nhoáng mọi kịch bản hiển thị (Loading, Empty, Error, Validation Error) và kiểm tra mọi sự kiện click với độ ổn định 100%.'
  },
  {
    id: 537,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'When performing a Major Version Upgrade of the Backbase platform (for example, upgrading the Backbase BOM to a new version where some `UseCase` method signatures have changed), what practical benefit does a project that strictly follows the **Decorator Pattern**, **DI Separation**, and **Configuration DSL** enjoy compared to a project with ad-hoc code modifications?',
    options: [
      'All bank customizations are cleanly isolated in `*DecoratorUseCase`, `*RouterImpl`, and `*ConfigurationModule` classes; the Kotlin compiler pinpoints the exact contract boundaries that need signature updates, enabling the entire app upgrade to be completed rapidly with minimal regression risk.',
      'The project still has to delete the entire app and spend 2 years rewriting it from scratch.',
      'There is no difference whatsoever between the two approaches.',
      'The compiler automatically downgrades the OS to Android 4.0.'
    ],
    correctAnswers: [0],
    explanation: 'Đây chính là mục tiêu tối thượng của toàn bộ kiến trúc **Backbase Mobile Architecture**: Nhờ cô lập hoàn toàn các phần tùy biến (Adopt qua Configuration DSL & MDS Tokens; Extend qua UseCase Decorator, Screen Factory và Router Interfaces), ứng dụng của ngân hàng luôn duy trì được tính **Upgradeability** (khả năng nâng cấp dễ dàng), tận dụng trọn vẹn sức mạnh đổi mới liên tục của nền tảng Backbase EBP.'
  },
  {
    id: 538,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'You need to add security Audit Logging WHENEVER a user executes the `SubmitTransferUseCase`. Which extension approach adheres to SOLID principles and Backbase standards?',
    options: [
      'Modify the source code directly inside Backbase\'s `SubmitTransferUseCaseImpl` class.',
      'Create an `AuditSubmitTransferUseCaseDecorator` class implementing `SubmitTransferUseCase`, inject the original instance via the constructor, perform the audit logging, and delegate the call to the original instance. Register this new binding using `@Binds` in Hilt.',
      'Write a static logging method and call it inside the `Activity`.',
      'Create a brand-new UseCase and modify all ViewModels to call this new UseCase.'
    ],
    correctAnswers: [1],
    explanation: 'Đây là ứng dụng thực tế của Decorator Pattern. Cách làm này không sửa code gốc (Open/Closed Principle), đảm bảo tách biệt trách nhiệm (Single Responsibility) và giữ nguyên tính tương thích khi nâng cấp SDK.'
  },
  {
    id: 539,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'When an OOTB Journey screen cannot meet highly bespoke design requirements from the bank, which mechanism does Backbase support to COMPLETELY REPLACE that screen with a brand-new Custom Screen?',
    options: [
      'Replace it via a Screen Factory / Custom Navigation Router registered in the DI Graph.',
      'Delete the `.aar` file of that Journey.',
      'Create a separate standalone Android app.',
      'Modify `AndroidManifest.xml` to point the LAUNCHER intent to a new Activity.'
    ],
    correctAnswers: [0],
    explanation: 'Tầng Navigation của Backbase cho phép đăng ký Screen Factory tùy biến. Khi Navigation cần mở màn hình X, nó sẽ yêu cầu Factory cấp Screen Instance; Integrator có thể trả về Custom Screen thay vì Default Screen.'
  },
  {
    id: 540,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'multi',
    question: 'Which of the following scenarios require you to take the BUILD approach (building a brand-new Custom Journey/Module from scratch)? (Select 2)',
    options: [
      'The client requests changing the color of the "Pay" button.',
      'The bank launches a proprietary new service not present anywhere in Backbase\'s OOTB product catalog (e.g., Movie Ticket Booking / Ride-Hailing).',
      'The bank has a specialized bancassurance purchase workflow integrated with a proprietary legacy core system that does not follow any OOTB API contract.',
      'Changing the error message text when an incorrect password is entered.'
    ],
    correctAnswers: [1, 2],
    explanation: 'Khi yêu cầu nghiệp vụ hoàn toàn mới, nằm ngoài phạm vi sản phẩm banking chuẩn của Backbase (như Lifestyle services) hoặc quy trình tích hợp riêng biệt không thể mở rộng từ OOTB, ta mới tiến hành Build mới module.'
  },
  {
    id: 541,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Which Hilt/Dagger module configuration is standard for binding a Decorator Pattern implementation to replace the default implementation of a `GetAccountsUseCase` interface?',
    options: [
      '`@Module` + `@InstallIn(...)` on an `abstract class` using `@Binds`',
      '`@Module` on a regular class without `@Binds` or `@Provides`',
      '`@Provides` without a `@Module` annotation',
      '`@Inject lateinit var useCase: GetAccountsUseCase`'
    ],
    correctAnswers: [0],
    explanation: 'Sử dụng @Binds trong một abstract class Hilt Module là cách chuẩn mực, tối ưu hiệu năng (không tạo mã byte code dư thừa) để map một triển khai (bao gồm Decorator) vào Interface dependency.'
  },
  {
    id: 542,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'To safeguard sensitive data (such as Access Tokens or card details) stored in local storage on an Android device, what is the most standard technique?',
    options: [
      'Save it as plain text inside `strings.xml`.',
      'Use `EncryptedSharedPreferences` / Jetpack DataStore backed by the `AndroidKeyStore` key management system.',
      'Save it into a `.txt` file in the `Download` folder.',
      'Encode it with Base64 and store it in standard `SharedPreferences`.'
    ],
    correctAnswers: [1],
    explanation: 'Base64 không phải là mã hóa (chỉ là encoding). EncryptedSharedPreferences sử dụng Hardware-backed Keys từ AndroidKeyStore để mã hóa AES-256 cho dữ liệu nhạy cảm.'
  },
  {
    id: 543,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'multi',
    question: 'When writing Unit Tests for a `ViewModel` that uses Kotlin Coroutines and `StateFlow`, which tools/libraries form the most standard testing stack? (Select 2)',
    options: [
      '`kotlinx-coroutines-test` (providing `StandardTestDispatcher`, `runTest`).',
      'The **Turbine** library for testing `Flow` emissions (`app.cash.turbine`).',
      'Espresso UI Testing framework.',
      'Selenium WebDriver.'
    ],
    correctAnswers: [0, 1],
    explanation: 'kotlinx-coroutines-test giúp kiểm soát thời gian/dispatcher của Coroutine trong môi trường test. Turbine giúp assert các giá trị emit từ StateFlow/Flow một cách vô cùng đơn giản và ngắn gọn.'
  },
  {
    id: 544,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'In OkHttp, what is the FUNDAMENTAL DIFFERENCE between an `Interceptor` and an `Authenticator`?',
    options: [
      'There is no difference.',
      'An `Interceptor` is invoked for every request; whereas an `Authenticator` is ONLY triggered when the server responds with `401 Unauthorized` to perform token refresh.',
      'An `Authenticator` runs before an `Interceptor`.',
      'An `Interceptor` is used for UI, while an `Authenticator` is used for the database.'
    ],
    correctAnswers: [1],
    explanation: 'Authenticator được thiết kế đặc biệt để xử lý lỗi 401. Khi gặp 401, OkHttp tự động nhảy vào Authenticator để lấy token mới và tự động thực thi lại (retry) request bị lỗi trước đó.'
  },
  {
    id: 545,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Which security attack vector is **Certificate Pinning** on Android specifically configured to mitigate?',
    options: [
      'Distributed Denial of Service (DDoS) attacks.',
      'Man-In-The-Middle (MITM) attacks (eavesdropping or tampering with network traffic in transit).',
      'SQL Injection attacks.',
      'Phishing UI overlay attacks.'
    ],
    correctAnswers: [1],
    explanation: 'Certificate Pinning đảm bảo ứng dụng chỉ tin tưởng và kết nối đúng đến Server có khóa công khai/certificate trùng khớp được định sẵn, ngăn chặn các proxy/kẻ tấn công đứng giữa giải mã traffic HTTPS.'
  },
  {
    id: 546,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'When designing a new Custom Journey (Build), how do you ensure the module can be easily reused across different banking projects?',
    options: [
      'Hardcode API URLs and colors directly inside the module.',
      'Force the module to depend on the main `:app` module.',
      'Package the module into decoupled artifacts (`:feature-api` & `:feature-impl`), receiving configurations (Theme, Router, Gateway URL) via DI/Interfaces without depending on any specific host application.',
      'Put all source code in a single Kotlin file.'
    ],
    correctAnswers: [2],
    explanation: 'Tuân thủ nguyên tắc Modularization và Dependency Inversion giúp module linh hoạt, độc lập, có thể phát hành thành thư viện để lắp ghép vào bất kỳ dự án Integrator nào.'
  },
  {
    id: 547,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'In Jetpack Compose (used in modern Backbase Custom Screens), which extension function safely converts a `StateFlow<T>` into a Compose `State<T>` in a lifecycle-aware manner?',
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
    id: 548,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'When you need to add a transaction limit validation step before invoking the SDK\'s original transfer Use Case, which design pattern is standard?',
    options: [
      'Singleton Pattern.',
      'Decorator Pattern (wrapping the original Use Case and injecting it into a Custom Use Case).',
      'Observer Pattern.',
      'Prototype Pattern.'
    ],
    correctAnswers: [1],
    explanation: 'Decorator Pattern bọc implementation mặc định để thực hiện kiểm tra trước khi chuyển tiếp gọi gốc.'
  },
  {
    id: 549,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Which Hilt Module syntax is used to re-bind a Custom Use Case in place of a default Use Case interface?',
    options: [
      'abstract class + @Binds + abstract fun bindUseCase(impl: CustomUseCase): OriginalUseCase',
      'Regular class with a function returning a new instance',
      '@Component interface containing an inject function',
      'val module = module { single { CustomUseCase() } }'
    ],
    correctAnswers: [0],
    explanation: '@Binds trong abstract class Hilt Module là cú pháp chuẩn mực, tối ưu hiệu năng để tráo đổi binding.'
  },
  {
    id: 550,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'What role does an \'Exit Point\' play in a Business Journey?',
    options: [
      'It marks the completion of a workflow or emits a navigation signal outside the scope of the Journey.',
      'It is the point where the app crashes due to an out-of-memory error.',
      'It is a button that closes the application.',
      'It is the moment the user is automatically logged out.'
    ],
    correctAnswers: [0],
    explanation: 'Exit Point là callback/sự kiện báo hiệu luồng nghiệp vụ kết thúc để Integrator điều hướng tiếp.'
  },
  {
    id: 551,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'multi',
    question: 'What are the two mandatory requirements when replacing a Journey screen using a Custom Screen Factory? (Select 2)',
    options: [
      'The Custom Screen must inherit or connect to the appropriate Journey ViewModel/State if it intends to reuse business logic.',
      'Register the new Factory in the Hilt DI Graph so the Journey can instantiate the custom screen.',
      'The new screen must be written strictly in pure Java.',
      'The new screen must run in an isolated OS process.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Phải đăng ký Factory vào DI và đảm bảo UI mới kết nối đúng dữ liệu/State của luồng nghiệp vụ.'
  },
  {
    id: 552,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'When the user presses the Back button on the root screen of a Journey, what is the standard handling in the Router Interface?',
    options: [
      'Terminate the app immediately using `killProcess`.',
      'Implement the exit navigation callback (such as `onExit` / `navigateUp`) and invoke `navController.popBackStack()`.',
      'Completely disable the physical Back button.',
      'Wipe all application data.'
    ],
    correctAnswers: [1],
    explanation: 'Router Interface xử lý sự kiện Back bằng cách gọi popBackStack trên Navigation Controller.'
  },
  {
    id: 553,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'To customize the list of tabs on the Bottom Navigation bar of a Productized App, where does a developer intervene?',
    options: [
      'Inside the Core Foundation SDK source code.',
      'Provide a Custom `AppMenuConfigurationProvider` via Hilt DI in the Integrator module.',
      'Modify the phone hardware.',
      'Send a request to Google\'s servers.'
    ],
    correctAnswers: [1],
    explanation: 'Menu chính được cấu hình tập trung qua AppMenuConfigurationProvider tại Integrator module.'
  },
  {
    id: 554,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'How do you hide a menu item on the Bottom Navigation bar if the user lacks the required permissions (Entitlements)?',
    options: [
      'Display the tab anyway, but crash the app when the user taps it.',
      'Check user permissions and filter the list of Menu Items returned by `AppMenuConfigurationProvider` before rendering.',
      'Change the tab icon color to transparent.',
      'Draw a black View on top of that tab.'
    ],
    correctAnswers: [1],
    explanation: 'Lọc danh sách Menu Item dựa trên Entitlements của người dùng trước khi hiển thị lên giao diện.'
  },
  {
    id: 555,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'multi',
    question: 'When passing data between two independent Journeys via a Router or Deep Link, what are the safe architectural principles? (Select 2)',
    options: [
      'Pass only lightweight Identifiers (String/Long IDs) or primitive parameters rather than entire complex objects.',
      'Have the destination screen fetch detailed data from its Repository using the received Identifier.',
      'Serialize the entire object into a 500KB Base64 string and pass it through a `Bundle`.',
      'Store the object in a global `public static` variable.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Chỉ truyền ID gọn nhẹ qua Safe Args để tránh TransactionTooLargeException và giữ tính đóng gói.'
  },
  {
    id: 556,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'What happens if you forget to annotate a Hilt Module with `@InstallIn`?',
    options: [
      'The application still runs normally.',
      'A compile-time error occurs immediately during the build because Hilt cannot determine which component scope the Module belongs to.',
      'It automatically converts to the Koin framework.',
      'API responses return empty strings.'
    ],
    correctAnswers: [1],
    explanation: '@InstallIn là bắt buộc trong Hilt; thiếu nó trình sinh mã của Hilt sẽ báo lỗi biên dịch ngay lập tức.'
  },
  {
    id: 557,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Which standard library is used to secure authentication tokens and secret keys stored locally on an Android device?',
    options: [
      'Standard `SharedPreferences`.',
      '`EncryptedSharedPreferences` (Android Jetpack Security) combined with `AndroidKeyStore`.',
      'Saving to a text file in the `Download` folder.',
      'Saving to an unencrypted SQLite database.'
    ],
    correctAnswers: [1],
    explanation: 'Chuẩn bảo mật tài chính yêu cầu mã hóa AES-256 phần cứng qua EncryptedSharedPreferences và KeyStore.'
  },
  {
    id: 558,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'Which library is recommended for testing `StateFlow` streams in a `ViewModel` sequentially and intuitively?',
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
    id: 559,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'In MockK, which function verifies that a `suspend` function on a Use Case was called exactly once?',
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
    id: 560,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'When building a brand-new Journey from scratch (Build Custom Journey), what is the recommended minimum module structure?',
    options: [
      'A single module containing all code.',
      'Split into 2 modules: `:journey-api` (contracts, models) and `:journey-impl` (UI, ViewModel, Repositories).',
      'Create a separate module for every individual screen.',
      'No modularization is needed.'
    ],
    correctAnswers: [1],
    explanation: 'Cấu trúc tách rời :api và :impl là quy chuẩn kiến trúc để đảm bảo lỏng liên kết và tối ưu build.'
  },
  {
    id: 561,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'multi',
    question: 'What are two defense mechanisms a banking app uses when it detects a rooted device or code tampering (Anti-Tampering)? (Select 2)',
    options: [
      'Perform environment integrity checks (Root detection, Emulator detection, Frida/Xposed hooks).',
      'Proactively warn the user and block financial transactions to protect the account.',
      'Automatically transfer all funds in the account to another bank.',
      'Wipe the phone\'s operating system.'
    ],
    correctAnswers: [0, 1],
    explanation: 'RASP (Runtime Application Self-Protection) phát hiện môi trường nguy hiểm và chặn giao dịch nhạy cảm.'
  },
  {
    id: 562,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'When applying Kotlin Delegation (`by`) in the Decorator Pattern for a Use Case, what is the biggest benefit?',
    options: [
      'It automatically delegates all unoverridden interface methods to the original instance, requiring you to override only the method where custom logic is needed.',
      'It automatically compresses the class into a zip file.',
      'It makes the class run 100 times faster.',
      'It completely eliminates the need for Hilt.'
    ],
    correctAnswers: [0],
    explanation: 'Class delegation (by delegate) giúp code cực kỳ ngắn gọn, không phải viết lại các hàm ủy quyền boilerplate.'
  },
  {
    id: 563,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'To share a single `ViewModel` instance across multiple screens within the same Nested Navigation Graph flow, what scope should the `ViewModel` be initialized with?',
    options: [
      'Scoped to the `NavBackStackEntry` of the Nested Graph (`navGraphViewModels`).',
      'Instantiated with the `new MyViewModel()` keyword.',
      'Stored in a global `static` variable.',
      'Each screen creates its own separate instance.'
    ],
    correctAnswers: [0],
    explanation: 'navGraphViewModels cho phép chia sẻ dữ liệu chung trong một luồng nghiệp vụ và tự giải phóng khi rời luồng.'
  },
  {
    id: 564,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'What happens if a Custom Use Case throws an Unhandled Exception inside `viewModelScope`?',
    options: [
      'The application recovers from the error automatically.',
      'It causes an application crash (Fatal Exception) unless caught via `runCatching` / `try-catch` or handled by a `CoroutineExceptionHandler`.',
      'The backend server automatically fixes the error.',
      'The phone powers off automatically.'
    ],
    correctAnswers: [1],
    explanation: 'Ngoại lệ không bắt trong Coroutine Scope sẽ làm văng ứng dụng; luôn bọc bằng runCatching / Result.'
  },
  {
    id: 565,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'multi',
    question: 'When replacing a screen using a Screen Factory, what ensures the new UI remains visually consistent with the rest of the app? (Select 2)',
    options: [
      'Use UI components and Design Tokens provided by Backbase MDS.',
      'Inherit from `Theme.Backbase` or wrap Composables inside `BackbaseTheme`.',
      'Take a screenshot of the old screen and paste it into an `ImageView`.',
      'Write a standalone set of hardcoded Hex color values.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Tái sử dụng MDS Components và Design Tokens đảm bảo giao diện mới đồng bộ 100% với toàn app.'
  },
  {
    id: 566,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'When a project needs to add a biometric authentication check before submitting a money transfer, where is the most optimal place to intervene?',
    options: [
      'Rewrite the entire Android operating system.',
      'Wrap `SubmitTransferUseCase` with a Custom Decorator Use Case that performs the Biometric check before invoking the original implementation.',
      'Inject UI code directly into the Retrofit client.',
      'Modify the SQLite database directly.'
    ],
    correctAnswers: [1],
    explanation: 'Bọc SubmitTransferUseCase bằng Decorator Pattern đảm bảo đúng Clean Architecture và giữ Upgrade Path.'
  },
  {
    id: 567,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'When is a development team JUSTIFIED in deciding to build a brand-new Custom Journey from scratch?',
    options: [
      'When they dislike Backbase\'s folder naming conventions.',
      'When the bank\'s business requirement is a completely new service with no comparable OOTB Journey available.',
      'When they want to change a button color.',
      'When they want to change a text label.'
    ],
    correctAnswers: [1],
    explanation: 'Chỉ Build mới khi tính năng hoàn toàn mới và OOTB không có nền tảng tương đồng.'
  },
  {
    id: 568,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'In MockK, which syntax is used to stub a return value for a `suspend` function?',
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
    id: 569,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'To prevent leaking sensitive data (such as PINs or Tokens) into Logcat on Production builds, what is the standard approach?',
    options: [
      'Manually delete every log statement before submitting the code.',
      'Use Timber / a Custom Logger and configure ProGuard/R8 rules to strip or disable all logging in Release builds.',
      'Rename sensitive variables.',
      'Do nothing because Logcat is automatically encrypted.'
    ],
    correctAnswers: [1],
    explanation: 'Tắt log trong release build bằng ProGuard rules (assumenosideeffects) và custom logger.'
  },
  {
    id: 570,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'What is the overarching guiding principle throughout the \'Extend and Build\' phase in Backbase?',
    options: [
      'Rewrite as much custom code as possible.',
      'Maximize OOTB adoption and extend strictly through official Extension Points to preserve the Upgrade Path.',
      'Never use Coroutines.',
      'Merge all source code into a single file.'
    ],
    correctAnswers: [1],
    explanation: 'Bảo toàn Upgrade Path là tôn chỉ quan trọng nhất khi tùy biến ứng dụng Backbase.'
  },
  {
    id: 571,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'multi',
    question: 'Which two official mechanisms allow extending the UI of an OOTB Journey? (Select 2)',
    options: [
      'View Slotting / Slot API (injecting custom UI into predefined slot placeholders).',
      'Screen Factory (completely replacing a default screen with a custom screen).',
      'Decompiling the `.aar` file to edit XML layout files directly.',
      'Pasting a new screenshot image over the old screen.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Slot API và Screen Factory là 2 cơ chế chính thống để mở rộng UI của Journey.'
  },
  {
    id: 572,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'When re-binding a Repository in a Hilt Module, what is the standard scope typically used?',
    options: [
      '`@ActivityScoped` for everything.',
      '`@Singleton` (or the scope matching the Journey Component) to avoid expensive repeated re-instantiation.',
      'Never use any scope.',
      '`@ViewModelScoped` on the Repository.'
    ],
    correctAnswers: [1],
    explanation: 'Repository thường được scoped ở mức Singleton hoặc Component tương ứng để tái sử dụng instance.'
  },
  {
    id: 573,
    section: 'extend',
    sectionName: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    type: 'single',
    question: 'What determines whether a Backbase Android application is truly Production-ready?',
    options: [
      'All Backbase source code has been deleted.',
      'It adheres to EBP architecture, maximizes OOTB adoption, implements extensions through standard Extension Points (DI, Routers, Screen Factories), and meets banking security standards.',
      'It can run on Windows Phone.',
      'It uses zero Google Jetpack libraries.'
    ],
    correctAnswers: [1],
    explanation: 'Ứng dụng Production-ready phải chuẩn kiến trúc EBP, giữ Upgrade Path và bảo mật nghiêm ngặt.'
  }
]
