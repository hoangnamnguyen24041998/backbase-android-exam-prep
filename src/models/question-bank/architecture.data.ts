import type { Question } from '../exam.types'

/**
 * Section 2: Mobile Essentials Android Architecture
 * Quota in Exam: 14 questions
 * Pool Size: 22 questions
 */
export const architectureQuestions: Question[] = [
  {
    id: 201,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Theo chuẩn Clean Architecture 3 tầng của Backbase Android, nguyên tắc nghiêm ngặt nhất đối với tầng **Domain Layer** là gì?',
    options: [
      'Domain Layer phải kế thừa từ `androidx.lifecycle.AndroidViewModel` để truy cập trực tiếp `ApplicationContext`.',
      'Domain Layer phải là một module **Pure Kotlin** (hoặc không chứa bất kỳ phụ thuộc nào vào Android Framework như `Context`, `View`, `Bundle`, cũng như không chứa các annotation của thư viện JSON Parser như Moshi `@Json` hay Retrofit).',
      'Domain Layer chịu trách nhiệm trực tiếp khởi tạo `OkHttpClient` và quản lý kết nối SQLite thông qua Room DAO.',
      'Domain Layer chỉ được phép chứa các file XML layout và tài nguyên hình ảnh.'
    ],
    correctAnswers: [1],
    explanation: 'Trong Clean Architecture của Backbase, Domain Layer nằm ở tâm điểm (innermost layer), chứa các Business Entities/Models thuần túy và các UseCase Interfaces (hoặc Domain interactors). Nó phải là Pure Kotlin, hoàn toàn độc lập với Android SDK (`Context`, `View`) và độc lập với cơ chế Serialization/Deserialization của tầng mạng (Moshi/Gson/Kotlinx Serialization) để đảm bảo tính kiểm thử độc lập cao nhất.'
  },
  {
    id: 202,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Trong kiến trúc đa module (Multi-module architecture) quy mô lớn của Backbase Android, việc tách một tính năng thành cặp module `:feature-api` và `:feature-impl` giải quyết bài toán kỹ thuật cốt lõi nào?',
    options: [
      'Giúp tăng gấp đôi số lượng file APK sinh ra khi xuất bản lên Google Play.',
      'Phá vỡ sự phụ thuộc vòng (circular dependencies) và tăng tốc độ biên dịch (Incremental Build Time) vượt trội: các module khác chỉ cần phụ thuộc vào `:feature-api` siêu nhẹ (chứa Interfaces, Models, Navigation Contracts); khi sửa code bên trong `:feature-impl`, Gradle không cần biên dịch lại các module gọi nó.',
      'Cho phép module `:feature-api` truy cập trực tiếp vào các biến `private` của `:feature-impl`.',
      'Bắt buộc mọi lập trình viên phải viết cùng một đoạn code ở cả hai nơi.'
    ],
    correctAnswers: [1],
    explanation: 'Tách biệt `:api` (chứa public interfaces, domain models, router contracts) và `:impl` (chứa UI thực thi, ViewModel, UseCase implementations và cấu hình DI bindings) là kỹ thuật trọng tâm trong kiến trúc Android hiện đại và Backbase. Khi một thay đổi xảy ra bên trong `:feature-a:impl`, ABI (Application Binary Interface) của `:feature-a:api` không đổi, giúp Gradle tránh phải recompile hàng chục module khác đang phụ thuộc vào `:feature-a:api`.'
  },
  {
    id: 203,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'multi',
    question: 'Trong tầng **Presentation Layer** của các Backbase Android Journeys hiện đại, mô hình **Unidirectional Data Flow (UDF)** được vận hành như thế nào giữa UI (Jetpack Compose / Fragment) và `ViewModel`? (Chọn 2 đáp án đúng)',
    options: [
      'Trạng thái giao diện (`UiState` - thường là các `data class` hoặc `sealed interface` bất biến / immutable) chỉ chảy theo một chiều từ `ViewModel` xuống UI thông qua `StateFlow` (hoặc `LiveData`).',
      'Các tương tác của người dùng được đóng gói thành các sự kiện (`UiEvent` / `Intent` / Action) gửi ngược từ UI lên `ViewModel` để xử lý và cập nhật lại `UiState` mới.',
      'Composable function hoặc Fragment tự ý sửa trực tiếp các thuộc tính `var` bên trong Domain Entity mà không thông qua `ViewModel`.',
      '`ViewModel` giữ một tham chiếu trực tiếp (`strong reference`) tới `Activity` và `TextView` để gọi `.setText()` từ trong một `CoroutineScope(Dispatchers.IO)`.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Unidirectional Data Flow (UDF) đảm bảo tính nhất quán của trạng thái (Single Source of Truth): State đi xuống (ViewModel phát ra `StateFlow<UiState>` bất biến) và Events đi lên (UI gọi hàm hoặc đẩy `UiEvent` lên ViewModel). Tuyệt đối không giữ tham chiếu View/Activity trong ViewModel để tránh rò rỉ bộ nhớ (Memory Leak) khi xoay màn hình.'
  },
  {
    id: 204,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Trong tầng **Data Layer**, trách nhiệm chuyển đổi giữa các đối tượng DTO sinh ra từ OpenAPI GenClient (hoặc Entity của Room Database) sang các đối tượng **Domain Model** thuộc về thành phần nào?',
    options: [
      'Thuộc về các hàm `@Composable` ở tầng Presentation.',
      'Thuộc về các **Mappers** nằm trong tầng Data (được gọi bởi Repository hoặc UseCase implementation) trước khi trả kết quả về cho tầng Domain/Presentation.',
      'Thuộc về file `AndroidManifest.xml`.',
      'Không cần chuyển đổi, tầng UI nên truyền thẳng các annotation `@JsonClass` của Moshi từ GenClient lên màn hình.'
    ],
    correctAnswers: [1],
    explanation: 'Tầng Data (nơi triển khai UseCase hoặc Repository gọi xuống DBS GenClient / Room / DataStore) có trách nhiệm dùng các hàm/lớp **Mapper** (ví dụ: `ProductSummaryDto.toDomainModel()`) để ánh xạ dữ liệu thô từ mạng sang Domain Model sạch trước khi trả về cho Journey. Điều này cô lập hoàn toàn tầng UI khỏi những thay đổi cấu trúc JSON từ phía server.'
  },
  {
    id: 205,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Nguyên lý **Inversion of Control (IoC)** và **Dependency Inversion Principle (DIP)** được thể hiện rõ nhất ở điểm nào trong kiến trúc của một Backbase Journey?',
    options: [
      'ViewModel của Journey tự khởi tạo trực tiếp đối tượng `ArrangementsApi()` bằng từ khóa `new` ngay trong khối `init {}`.',
      'Journey định nghĩa các interface `UseCase` và `Router` mà nó cần; phần thực thi cụ thể (Concrete Implementation) của các interface này được định nghĩa ở module bên ngoài và được bơm (inject) vào Journey tại thời điểm runtime thông qua Dependency Injection (Hilt / Koin).',
      'Mọi class trong dự án đều phải được khai báo là `object` (Singleton) toàn cục không có tham số khởi tạo.',
      'Tầng Data import trực tiếp các Fragment của tầng Presentation để lấy dữ liệu người dùng nhập.'
    ],
    correctAnswers: [1],
    explanation: 'Đảo ngược phụ thuộc (DIP) nghĩa là module cấp cao (Journey/Domain logic) không phụ thuộc vào module cấp thấp (Data/GenClient hay App Navigation), mà cả hai cùng phụ thuộc vào Abstraction (UseCase interfaces & Router interfaces do Journey công bố). IoC container (Hilt/Koin) ở module `:app` sẽ chịu trách nhiệm nối (wire) các implementation vào interface tương ứng.'
  },
  {
    id: 206,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Khi thiết kế `UiState` trong `ViewModel` theo chuẩn UDF cho một màn hình tải danh sách giao dịch, cách tiếp cận nào sau đây được khuyến nghị trong Kotlin để tránh các trạng thái mâu thuẫn (impossible states như vừa `isLoading = true` lại vừa `isError = true` bất hợp lý)?',
    options: [
      'Dùng 10 biến `MutableLiveData<Boolean>` rời rạc không liên quan tới nhau.',
      'Sử dụng `sealed interface` hoặc `sealed class` đại diện cho các trạng thái loại trừ lẫn nhau (ví dụ: `Loading`, `Success(val items: List<TransactionUiModel>)`, `Error(val message: DeferredText)`) hoặc một `data class` bất biến (`val`) được cập nhật nguyên tử qua `MutableStateFlow.update { ... }`.',
      'Lưu trạng thái giao diện vào `SharedPreferences` mỗi mili-giây.',
      'Dùng biến `static var` toàn cục trong `MainActivity`.'
    ],
    correctAnswers: [1],
    explanation: 'Sử dụng `sealed interface` / `sealed class` cho các trạng thái phân tách hoàn toàn hoặc một `data class` bất biến kết hợp với hàm nguyên tử `_uiState.update { currentState -> currentState.copy(...) }` của `MutableStateFlow` giúp đảm bảo tính an toàn luồng (thread-safety) và loại bỏ hoàn toàn tình trạng race-condition khi nhiều coroutine cùng cập nhật UI.'
  },
  {
    id: 207,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Để xử lý các sự kiện chỉ xảy ra một lần duy nhất (One-off / Side-effect events) như hiển thị một `Snackbar`, mở một `Dialog` cảnh báo, hoặc kích hoạt lệnh điều hướng mà không bị lặp lại khi xoay màn hình (Configuration Change), cơ chế nào phù hợp nhất trong Kotlin Coroutines / Jetpack Compose?',
    options: [
      'Lưu sự kiện vào `SharedPreferences` và đọc lại trong `onResume()`.',
      'Sử dụng `Channel` (phơi ra ngoài dưới dạng `receiveAsFlow()`) hoặc mô hình hóa sự kiện như một phần của `UiState` kèm theo một hàm callback `onEventConsumed()` để xóa sự kiện ngay sau khi UI đã xử lý xong.',
      'Sử dụng `StateFlow` có giá trị khởi tạo cố định và không bao giờ reset giá trị đó.',
      'Gọi `Thread.sleep(5000)` trên Main Thread trước khi hiển thị thông báo.'
    ],
    correctAnswers: [1],
    explanation: 'Đối với các sự kiện one-off (như thông báo lỗi thoáng qua hoặc hiệu ứng phụ), nếu giữ nguyên trong `StateFlow` mà không có cơ chế tiêu thụ (consume/reset), khi người dùng xoay màn hình, UI thu thập lại `StateFlow` sẽ kích hoạt lại sự kiện đó lần nữa. Do đó, sử dụng `Channel` (`receiveAsFlow()`) hoặc pattern `State + onSink/onEventConsumed` là chuẩn mực được khuyến nghị.'
  },
  {
    id: 208,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'multi',
    question: 'Khi thu thập (collect) dữ liệu từ một `StateFlow` của `ViewModel` bên trong tầng UI (Fragment hoặc Jetpack Compose), những kỹ thuật nào sau đây đảm bảo an toàn vòng đời (Lifecycle-aware) và tránh lãng phí tài nguyên khi ứng dụng xuống nền (Background)? (Chọn 2 đáp án đúng)',
    options: [
      'Trong Jetpack Compose: Sử dụng hàm mở rộng `collectAsStateWithLifecycle()` từ thư viện `androidx.lifecycle:lifecycle-runtime-compose`.',
      'Trong Fragment (View System): Sử dụng `viewLifecycleOwner.lifecycleScope.launch { viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) { viewModel.uiState.collect { ... } } }`.',
      'Sử dụng `GlobalScope.launch(Dispatchers.Main) { viewModel.uiState.collect { ... } }` ngay trong hàm `onCreate()` của Activity.',
      'Dùng vòng lặp `while (true)` trên luồng UI để kiểm tra giá trị của biến mỗi 10ms.'
    ],
    correctAnswers: [0, 1],
    explanation: '`collectAsStateWithLifecycle()` trong Compose và `viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED)` trong Fragment đảm bảo rằng quá trình thu thập Flow chỉ hoạt động khi giao diện thực sự hiển thị trên màn hình (ít nhất ở trạng thái `STARTED`), và tự động hủy thu thập khi app xuống background (`STOPPED`), chống rò rỉ bộ nhớ và tiết kiệm pin/CPU.'
  },
  {
    id: 209,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Trong thực hành tốt nhất về Kotlin Coroutines ở tầng Data và Domain của Backbase, việc chuyển đổi ngữ cảnh luồng thực thi (Threading / Dispatchers) nên được thiết kế như thế nào để phục vụ kiểm thử (Testability) tốt nhất?',
    options: [
      'Viết cứng (hardcode) `withContext(Dispatchers.IO)` ở khắp mọi nơi mà không cho phép truyền vào từ bên ngoài.',
      'Tiêm (Inject) các `CoroutineDispatcher` (ví dụ thông qua các Qualifier như `@IoDispatcher`, `@DefaultDispatcher`) vào constructor của Repository/UseCase implementation để trong Unit Test có thể dễ dàng thay thế bằng `StandardTestDispatcher` hoặc `UnconfinedTestDispatcher`.',
      'Luôn chạy mọi tác vụ đọc ghi cơ sở dữ liệu và giải mã JSON nặng trên `Dispatchers.Main`.',
      'Tạo mới một `Executors.newFixedThreadPool(100)` mỗi khi người dùng bấm nút.'
    ],
    correctAnswers: [1],
    explanation: 'Quy tắc vàng của Coroutines là "Inject Dispatchers": không bao giờ hardcode `Dispatchers.IO` hay `Dispatchers.Default` bên trong class nghiệp vụ. Việc inject `CoroutineDispatcher` qua constructor (với Hilt/Koin) giúp các bài kiểm thử đơn vị (Unit Tests) truyền `TestDispatcher` vào, giúp test chạy tức thì, tất định (deterministic) mà không bị phụ thuộc vào luồng nền thực tế.'
  },
  {
    id: 210,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Trong tầng Data của một ứng dụng Android tích hợp Backbase, khi cần lưu trữ bộ nhớ đệm (Local Caching) có cấu trúc quan hệ phức tạp hoặc cấu hình nhẹ theo cặp khóa-giá trị (Key-Value), bộ đôi công nghệ Jetpack nào được khuyến nghị sử dụng?',
    options: [
      'Lưu file văn bản thuần `.txt` ra thẻ nhớ ngoài (External SD Card) không mã hóa.',
      'Sử dụng **Room Database** (kết hợp SQLCipher nếu chứa dữ liệu nhạy cảm) cho dữ liệu có cấu trúc/quan hệ và **Jetpack DataStore** (hoặc Backbase `EncryptedStorage` / `SecureStorage`) cho dữ liệu cấu hình Key-Value bất đồng bộ an toàn.',
      'Sử dụng biến `static HashMap` lưu trên RAM để dữ liệu tồn tại vĩnh viễn sau khi tắt nguồn điện thoại.',
      'Sử dụng `SharedPreferences.commit()` đồng bộ ngay trên luồng vẽ giao diện (UI Thread) cho các file dung lượng 50MB.'
    ],
    correctAnswers: [1],
    explanation: 'Room cung cấp lớp trừu tượng kiểm tra truy vấn SQL ngay lúc biên dịch (compile-time verification) và trả về `Flow<T>` phản ứng mượt mà. Đối với dữ liệu Key-Value, Jetpack DataStore (hoặc Backbase SecureStorage đối với dữ liệu nhạy cảm ngân hàng) khắc phục hoàn toàn nhược điểm chặn luồng UI (ANR) và thiếu an toàn của `SharedPreferences` cũ.'
  },
  {
    id: 211,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Cách biểu diễn kết quả trả về từ một hàm `suspend` trong `UseCase` của Backbase (ví dụ `CallResult<T>` hoặc `Result<T, E>`) mang lại lợi thế gì so với việc chỉ ném ra ngoại lệ không kiểm soát (Unchecked Exceptions)?',
    options: [
      'Buộc tầng gọi (như `ViewModel`) phải xử lý tường minh cả nhánh thành công (`Success`) lẫn nhánh thất bại (`Error / Failure`) thông qua biểu thức `when` vét cạn (exhaustive), tránh hiện tượng ứng dụng bị văng (Crash - `UncaughtExceptionHandler`) khi mất mạng hoặc lỗi 500 từ server.',
      'Làm cho trình biên dịch bỏ qua mọi lỗi cú pháp trong file Kotlin.',
      'Tự động sửa lỗi mạng Wi-Fi cho điện thoại của khách hàng.',
      'Giúp hàm không cần từ khóa `suspend` mà vẫn tạm dừng được.'
    ],
    correctAnswers: [0],
    explanation: 'Trong Kotlin, các hàm không có khai báo Checked Exceptions. Nếu một UseCase ném thẳng exception khi gọi mạng thất bại mà ViewModel quên bọc `try/catch`, coroutine sẽ bị hủy và có thể làm crash toàn bộ ứng dụng. Do đó, Backbase sử dụng kiểu bọc kết quả (như `Result` hoặc `Response`/`CallResult` dạng `sealed class`) để ép buộc người lập trình phải xử lý cả 2 trường hợp `Success` và `Error` một cách an toàn.'
  },
  {
    id: 212,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'multi',
    question: 'Chiều hướng phụ thuộc (Dependency Rule) giữa 3 tầng trong Clean Architecture được quy định như thế nào? (Chọn 2 đáp án đúng)',
    options: [
      'Tầng **Presentation** và tầng **Data** đều phụ thuộc hướng vào trong tới tầng **Domain** (cả hai đều biết tới Domain Models và UseCase Interfaces).',
      'Tầng **Domain** hoàn toàn độc lập, KHÔNG ĐƯỢC PHÉP biết hay import bất cứ class nào từ tầng **Presentation** hoặc tầng **Data**.',
      'Tầng **Domain** phụ thuộc trực tiếp vào tầng **Data** để gọi các hàm của Retrofit/GenClient.',
      'Tầng **Data** phụ thuộc trực tiếp vào tầng **Presentation** để hiển thị Toast thông báo lỗi.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Theo Dependency Rule của Clean Architecture: Mũi tên phụ thuộc mã nguồn chỉ được phép hướng vào bên trong về phía tầng có mức độ trừu tượng cao nhất là **Domain**. Presentation -> Domain <- Data (nhờ Dependency Inversion, Data implements các interface nằm trong Domain).'
  },
  {
    id: 213,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Trong file `build.gradle.kts` của một module thư viện (ví dụ `:accounts-journey`), sự khác biệt cốt lõi giữa việc khai báo một phụ thuộc bằng từ khóa `api(...)` và `implementation(...)` là gì?',
    options: [
      '`api` chỉ dùng cho các thư viện viết bằng Java, còn `implementation` chỉ dùng cho thư viện viết bằng Kotlin.',
      '`api(...)` làm lộ (expose) thư viện phụ thuộc đó ra đường dẫn biên dịch (compile classpath) của mọi module cấp trên phụ thuộc vào `:accounts-journey`; trong khi `implementation(...)` giữ kín phụ thuộc đó ở nội bộ, giúp giảm thời gian recompile và tránh rò rỉ chi tiết thực thi.',
      '`implementation` tải thư viện từ Internet mỗi khi người dùng mở ứng dụng trên điện thoại.',
      'Hai từ khóa này hoàn toàn giống hệt nhau trong Gradle 8.x.'
    ],
    correctAnswers: [1],
    explanation: 'Khi dùng `implementation`, nếu thư viện nội bộ đó thay đổi phiên bản hoặc API, chỉ duy nhất module trực tiếp chứa nó phải biên dịch lại. Ngược lại, dùng `api` sẽ đẩy phụ thuộc đó sang tất cả các module tiêu thụ (transitive dependency), làm phình to compile classpath và khiến toàn bộ cây module phải biên dịch lại dây chuyền.'
  },
  {
    id: 214,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Khi cấu hình `StateFlow` trong `ViewModel` bằng toán tử `.stateIn(...)` để chuyển đổi từ một `Flow` lạnh (cold flow) sang `StateFlow` nóng (hot flow), việc truyền tham số `SharingStarted.WhileSubscribed(5000)` có tác dụng kỹ thuật gì?',
    options: [
      'Tắt màn hình điện thoại của người dùng sau đúng 5000 mili-giây.',
      'Giữ cho luồng dữ liệu nguồn (upstream flow) tiếp tục sống thêm 5 giây sau khi UI tạm thời hủy đăng ký (ví dụ khi xoay màn hình làm Activity/Fragment tái tạo trong vài trăm ms) để không phải khởi chạy lại truy vấn mạng/DB tốn kém; nhưng sẽ dừng hẳn nếu người dùng thực sự thoát ứng dụng ra màn hình chính quá 5 giây.',
      'Giới hạn số lượng phần tử tối đa trong danh sách chỉ được 5000 mục.',
      'Trì hoãn việc hiển thị giao diện 5 giây kể từ lúc người dùng chạm vào biểu tượng ứng dụng.'
    ],
    correctAnswers: [1],
    explanation: '`SharingStarted.WhileSubscribed(5000)` là cấu hình tiêu chuẩn do đội ngũ Android Architecture khuyến nghị: khoảng đệm 5000ms (5 giây) đủ dài để vượt qua quá trình hủy và tạo lại View khi xoay màn hình (Configuration Change) mà không làm đứt quãng upstream flow, nhưng đủ ngắn để giải phóng tài nguyên ngay khi người dùng nhấn nút Home chuyển app xuống nền.'
  },
  {
    id: 215,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Trong Jetpack Compose được sử dụng ở tầng Presentation của các Journey mới, khái niệm **State Hoisting** (Nâng trạng thái lên trên) mang lại lợi ích kiến trúc nào?',
    options: [
      'Biến các Composable cấp thấp thành **Stateless Composables** (chỉ nhận vào dữ liệu `state: T` và các hàm callback `onAction: () -> Unit`), giúp chúng dễ dàng tái sử dụng ở nhiều màn hình, dễ tạo `@Preview` và dễ viết UI Test độc lập mà không cần khởi tạo `ViewModel`.',
      'Tự động đẩy toàn bộ biến cục bộ của hàm Composable lên máy chủ đám mây.',
      'Cho phép một Composable con truy cập và thay đổi trực tiếp các biến `private` của Composable cha mà không cần truyền qua tham số.',
      'Loại bỏ hoàn toàn nhu cầu sử dụng hàm `remember` trong toàn bộ ứng dụng.'
    ],
    correctAnswers: [0],
    explanation: 'State Hoisting là mẫu thiết kế tách trạng thái ra khỏi Composable hiển thị bằng cách thay thế biến trạng thái nội bộ bằng 2 tham số: `value: T` (giá trị hiện tại cần hiển thị) và `onValueChange: (T) -> Unit` (sự kiện yêu cầu thay đổi giá trị). Nhờ đó, Screen-level Composable kết nối với ViewModel, còn toàn bộ cây UI bên dưới là Stateless, cực kỳ dễ preview và test.'
  },
  {
    id: 216,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Tại sao trình biên dịch Jetpack Compose lại quan tâm đặc biệt đến tính **Stability / Immutability** (Tính ổn định / Bất biến) của các class được truyền làm tham số cho một `@Composable` function?',
    options: [
      'Vì nếu tham số truyền vào được đánh giá là **Stable / Immutable** (ví dụ `data class` chỉ chứa các thuộc tính `val` kiểu nguyên thủy hoặc được gắn `@Immutable` / dùng `ImmutableList`), Compose Runtime có thể kích hoạt cơ chế **Smart Recomposition** để bỏ qua (skip) việc vẽ lại các Composable không có dữ liệu thay đổi, giúp giao diện cuộn mượt 60/120fps.',
      'Vì hệ điều hành Android cấm truyền các `class` thông thường vào hàm.',
      'Để tự động mã hóa các đối tượng đó trước khi lưu vào ổ cứng.',
      'Vì nếu dùng biến `var`, ứng dụng sẽ không thể cài đặt lên các thiết bị Samsung.'
    ],
    correctAnswers: [0],
    explanation: 'Nếu một class trong `UiState` chứa thuộc tính `var` hoặc chứa `java.util.List` (vốn chỉ là interface, bên dưới có thể là `ArrayList` khả biến) và class đó đến từ một module bên ngoài không bật Compose Compiler (như module `:domain`), Compose sẽ coi nó là **Unstable** và buộc phải recompose lại toàn bộ nhánh UI mỗi lần state phát ra. Giữ `UiState` thực sự bất biến (`@Immutable` / `PersistentList`) là chìa khóa tối ưu hiệu năng Compose.'
  },
  {
    id: 217,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'multi',
    question: 'Trong thiết kế kiến trúc của Backbase, làm thế nào để hai Journey độc lập (ví dụ: `AccountsJourney` và `PaymentWizardJourney`) có thể trao đổi thông tin hoặc chuyển hướng sang nhau mà KHÔNG tạo ra sự phụ thuộc trực tiếp (Zero Direct Dependency) giữa hai module Journey đó? (Chọn 2 đáp án đúng)',
    options: [
      '`AccountsJourney` chỉ định nghĩa một interface điều hướng trừu tượng (ví dụ: `AccountsRouter` với hàm `onMakePaymentClicked(accountId: String)`) và phát tín hiệu qua interface này.',
      'Module cấp cao (như `:app` hoặc `:navigation` module - nơi nhìn thấy cả 2 Journey) sẽ viết class triển khai (implement) interface `AccountsRouter` đó để thực hiện lệnh điều hướng mở `PaymentWizardJourney` kèm theo tham số `accountId`.',
      '`AccountsJourney` khai báo trực tiếp `implementation(project(":payment-wizard-journey"))` trong `build.gradle.kts` của nó và gọi thẳng `startActivity()`.',
      'Hai Journey giao tiếp với nhau bằng cách ghi đè vào một file văn bản trong thư mục `/sdcard/Download`.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Đây là nguyên tắc vàng trong kiến trúc điều hướng của Backbase: Các Journey là các hòn đảo độc lập (Isolated Islands), tuyệt đối không biết sự tồn tại của nhau. Mọi nhu cầu thoát ra khỏi một Journey hoặc nhảy sang Journey khác đều được định nghĩa qua một **Router / Exit Interface** đặt tại Journey nguồn, và được hiện thực hóa (implemented) tại tầng Host Application (`:app`).'
  },
  {
    id: 218,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Trong Kotlin Coroutines, khái niệm **Structured Concurrency** (Đồng thời có cấu trúc) khi sử dụng `viewModelScope` trong `ViewModel` đảm bảo hành vi quan trọng nào?',
    options: [
      'Khi `ViewModel` bị hủy (`onCleared()` được gọi khi người dùng thoát hẳn khỏi luồng màn hình/Journey), toàn bộ các Coroutine con được khởi chạy bên trong `viewModelScope` sẽ tự động bị hủy (`CancellationException`) ngay lập tức, ngăn chặn việc gọi mạng thừa và rò rỉ tài nguyên.',
      'Các Coroutine bên trong `viewModelScope` sẽ tiếp tục chạy ngầm vĩnh viễn ngay cả khi người dùng đã đóng ứng dụng.',
      'Mọi hàm bên trong `viewModelScope` đều bị ép chạy tuần tự từng dòng trên một luồng duy nhất của CPU.',
      '`viewModelScope` tự động bắt và nuốt trọn mọi lỗi `OutOfMemoryError` của hệ thống.'
    ],
    correctAnswers: [0],
    explanation: 'Structured Concurrency gắn vòng đời của các tác vụ bất đồng bộ vào một `CoroutineScope` có giới hạn rõ ràng. `viewModelScope` được gắn chặt với vòng đời của `ViewModel`; ngay khi `ViewModel.onCleared()` kích hoạt, `Job` gốc của `viewModelScope` bị cancel, kéo theo toàn bộ các request mạng hoặc luồng xử lý con bên trong dừng lại an toàn.'
  },
  {
    id: 219,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Giả sử trong một màn hình Dashboard ngân hàng, `ViewModel` cần gọi đồng thời 2 UseCase độc lập: `getAccountsSummary()` và `getRecentNotifications()`.Nếu muốn cả 2 chạy song song (parallel) và nếu 1 trong 2 gặp lỗi thì nhánh còn lại vẫn tiếp tục hoàn thành để hiển thị một phần dữ liệu (Partial Success UI), cấu trúc Coroutine nào phù hợp nhất?',
    options: [
      'Sử dụng `supervisorScope { val accountsDeferred = async { ... }; val notificationsDeferred = async { ... } }` kết hợp xử lý kết quả/ngoại lệ riêng biệt cho từng `Deferred`.',
      'Sử dụng `coroutineScope { ... }` thông thường mà không bắt lỗi vì khi 1 `async` con ném lỗi, nó sẽ không ảnh hưởng gì tới `async` còn lại.',
      'Gọi tuần tự từng hàm một cách nhau bởi `delay(10000)`.',
      'Tạo 2 `Activity` riêng biệt chạy đè lên nhau trên màn hình.'
    ],
    correctAnswers: [0],
    explanation: 'Trong một `coroutineScope` thông thường, nếu một coroutine con (`async` / `launch`) thất bại với ngoại lệ chưa bắt, nó sẽ hủy ngay lập tức coroutine cha và toàn bộ các coroutine anh em khác. Ngược lại, `supervisorScope` sử dụng `SupervisorJob`, cho phép các nhánh con thất bại độc lập mà không làm sập nhánh `async` đang chạy song song còn lại.'
  },
  {
    id: 220,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Tại sao trong các Domain Models hoặc Configuration Models của Backbase, các chuỗi văn bản hiển thị lên giao diện thường được khai báo bằng kiểu `DeferredText` (hoặc tương tự trong MDS như `DeferredDrawable`, `DeferredColor`) thay vì kiểu `String` hoặc `@StringRes Int` thuần túy?',
    options: [
      'Vì kiểu `String` của Kotlin không hỗ trợ bảng mã Unicode tiếng Việt.',
      '`DeferredText` là một lớp trừu tượng hóa thông minh cho phép bọc cả một chuỗi tĩnh (`DeferredText.Constant("...")`), một ID tài nguyên (`DeferredText.Resource(R.string.xxx)`) hoặc chuỗi có tham số định dạng mà KHÔNG cần truyền `Context` vào tầng Domain/ViewModel; việc phân giải ra `CharSequence` thực tế chỉ diễn ra ở bước cuối cùng trên tầng UI nơi có sẵn `Context`.',
      'Để làm cho việc đọc giá trị chuỗi chậm hơn 10 lần nhằm kiểm tra tốc độ máy.',
      'Vì Google đã loại bỏ kiểu dữ liệu `String` khỏi Android SDK từ phiên bản API 34.'
    ],
    correctAnswers: [1],
    explanation: '`DeferredText` (cùng họ `DeferredResources` của Backbase) giải quyết triệt để bài toán giữ cho `ViewModel`, `Configuration` và `Domain` hoàn toàn sạch bóng `android.content.Context`. Lập trình viên có thể truyền cả `R.string.title` lẫn chuỗi động từ API dưới cùng một kiểu dữ liệu thống nhất là `DeferredText`, và chỉ gọi `.resolve(context)` khi render lên View/Composable.'
  },
  {
    id: 221,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Khi thiết kế Navigation Graph cho một Journey phức tạp gồm nhiều màn hình con (ví dụ: luồng Chuyển tiền gồm Nhập thông tin -> Xem lại -> Xác thực OTP -> Kết quả), phạm vi vòng đời của `ViewModel` chia sẻ dữ liệu chung giữa các bước trong luồng đó nên được đặt ở đâu?',
    options: [
      'Đặt ở cấp độ `Application` Singleton để dữ liệu chuyển tiền không bao giờ bị xóa ngay cả khi đã đăng xuất.',
      'Gắn (Scope) vào **Nested Navigation Graph** của chính Journey đó (NavGraph-scoped ViewModel): dữ liệu được chia sẻ xuyên suốt giữa các màn hình con trong luồng và tự động được giải phóng sạch sẽ ngay khi người dùng hoàn tất hoặc thoát khỏi Nested NavGraph của Journey đó.',
      'Tạo một `ViewModel` mới hoàn toàn ở mỗi màn hình và truyền dữ liệu qua lại bằng cách ghi ra file tạm trên ổ cứng.',
      'Lưu toàn bộ thông tin giao dịch nhạy cảm vào Clipboard (Bộ nhớ tạm sao chép) của điện thoại.'
    ],
    correctAnswers: [1],
    explanation: 'Trong Jetpack Navigation (cả Fragment lẫn Compose Navigation), việc scope một Shared ViewModel vào `NavBackStackEntry` của Nested Navigation Graph đại diện cho Journey là kiến trúc chuẩn mực nhất: các màn hình bước 1, 2, 3 truy cập chung một instance ViewModel, và khi Nested Graph bị pop khỏi BackStack, ViewModel đó sẽ tự động gọi `onCleared()`.'
  },
  {
    id: 222,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Trong tầng Data, khi sử dụng thư viện Moshi hoặc Kotlinx Serialization cùng với OpenAPI GenClient để giải mã (deserialize) phản hồi JSON từ Digital Banking Services, việc cấu hình chế độ bỏ qua các trường lạ (`ignoreUnknownKeys = true` / fallback enum) quan trọng như thế nào đối với tính tương thích xuôi (Forward Compatibility)?',
    options: [
      'Không có tác dụng gì vì server không bao giờ thay đổi.',
      'Đảm bảo khi phía Backend (DBS) nâng cấp và bổ sung thêm các trường JSON mới hoặc thêm giá trị Enum mới trong tương lai, các phiên bản ứng dụng Android cũ đang chạy ngoài thị trường không bị văng lỗi `JsonDataException` / `SerializationException`.',
      'Giúp giảm dung lượng gói tin truyền qua mạng xuống bằng 0 byte.',
      'Tự động dịch tên biến từ tiếng Anh sang tiếng Pháp.'
    ],
    correctAnswers: [1],
    explanation: 'Trong môi trường Mobile Banking thực tế, không phải người dùng nào cũng cập nhật ứng dụng ngay lập tức khi Backend triển khai bản mới. Cấu hình parser khoan dung với các trường chưa biết (`ignoreUnknownKeys`) và xử lý giá trị mặc định cho các Enum lạ (`@Fallback` / unknown enum value) là nguyên tắc sống còn để đảm bảo Forward Compatibility.'
  },
  {
    id: 225,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Trong kiến trúc Clean Architecture chuẩn áp dụng cho Backbase Journey, tầng Domain Layer có đặc điểm nào dưới đây?',
    options: [
      'Phụ thuộc chặt chẽ vào Android Framework (android.content.Context, View).',
      'Là tầng Pure Kotlin, chứa Business Logic, Use Cases và Domain Models, hoàn toàn không phụ thuộc vào Android Framework hay Data Layer.',
      'Chứa các file Retrofit Interface và Room Entity.',
      'Phụ thuộc vào Jetpack Compose UI.'
    ],
    correctAnswers: [1],
    explanation: 'Domain Layer là trung tâm của Clean Architecture, phải hoàn toàn độc lập với các thư viện bên ngoài và Android SDK (Pure Kotlin/Java) để dễ dàng kiểm thử (Unit Test) và tái sử dụng.'
  },
  {
    id: 226,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Mô hình quản lý trạng thái giao diện chuẩn được khuyến nghị sử dụng trong ứng dụng Backbase Android là gì?',
    options: [
      'Multiple Data Flow.',
      'Unidirectional Data Flow (UDF) kết hợp với StateFlow / LiveData.',
      'Direct View Mutation (Sửa UI trực tiếp từ Callback network).',
      'EventBus đăng ký toàn cục.'
    ],
    correctAnswers: [1],
    explanation: 'Unidirectional Data Flow (UDF) đảm bảo dữ liệu chảy theo một chiều: User Action -> ViewModel Process -> UI State Emit -> UI Render. Điều này giúp trạng thái UI nhất quán và dễ đoán (predictable).'
  },
  {
    id: 227,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Khi tách một module tính năng thành 2 sub-module: :feature-api và :feature-impl, mục đích chính của :feature-api là gì?',
    options: [
      'Chứa toàn bộ UI Compose và Layout XML.',
      'Chứa các Interface, Public Data Models, Router Contracs giúp các module khác phụ thuộc vào mà không cần biết cách thực thi (Dependency Inversion).',
      'Chứa mã nguồn thực thi API Retrofit và Data Access Object.',
      'Chứa các file ảnh và icon của tính năng.'
    ],
    correctAnswers: [1],
    explanation: 'Tách :feature-api giúp áp dụng nguyên lý Dependency Inversion. Các module khác chỉ cần implementation project(\':feature-api\') để gọi tính năng, giảm thời gian biên dịch (incremental build) và tránh phụ thuộc vòng.'
  },
  {
    id: 228,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'multi',
    question: 'Để lắng nghe luồng dữ liệu StateFlow trong Android Fragment một cách an toàn, tránh lãng phí tài nguyên hay rò rỉ bộ nhớ (Memory Leak) khi app chạy ngầm, bạn nên làm gì? (Chọn 2)',
    options: [
      'Dùng lifecycleScope.launch và thu thập (collect) trực tiếp mà không cần kiểm tra trạng thái Lifecycle.',
      'Sử dụng viewLifecycleOwner.lifecycleScope.launch kết hợp repeatOnLifecycle(Lifecycle.State.STARTED).',
      'Sử dụng extension flowWithLifecycle(viewLifecycleOwner.lifecycle) trước khi collect.',
      'Thu thập Flow trong khối init của ViewModel.'
    ],
    correctAnswers: [1, 2],
    explanation: 'repeatOnLifecycle và flowWithLifecycle giúp dừng việc thu thập dữ liệu (collect) khi UI xuống trạng thái STOPPED và tự động khôi phục khi UI trở lại STARTED, ngăn ngừa lãng phí CPU/Memory khi app vào background.'
  },
  {
    id: 229,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Trong ViewModel, cách khai báo trạng thái UI State nào sau đây tuân thủ đúng nguyên tắc đóng gói (Encapsulation)?',
    options: [
      'val uiState: MutableStateFlow<MyUiState> = MutableStateFlow(InitialState)',
      'private val _uiState = MutableStateFlow<MyUiState>(InitialState)',
      'var uiState: MyUiState = InitialState',
      'public var _uiState: LiveData<MyUiState>'
    ],
    correctAnswers: [1],
    explanation: 'Khai báo này ngăn chặn việc UI Layer có thể tự ý ghi/thay đổi trạng thái trực tiếp (MutableStateFlow). Chỉ có ViewModel mới có quyền emit trạng thái mới qua _uiState.'
  },
  {
    id: 230,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Pattern nào được Backbase áp dụng để cho phép mở rộng hoặc chèn thêm logic kiểm tra (Validation) vào trước/sau một UseCase gốc của SDK mà không làm thay đổi code gốc?',
    options: [
      'Singleton Pattern.',
      'Decorator Pattern.',
      'Builder Pattern.',
      'Prototype Pattern.'
    ],
    correctAnswers: [1],
    explanation: 'Decorator Pattern cho phép bọc (wrap) UseCase mặc định của Backbase, thực thi thêm logic tùy biến (ví dụ: kiểm tra hạn mức giao dịch), sau đó gọi UseCase gốc hoặc chặn không cho gọi tiếp.'
  },
  {
    id: 231,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Khi cần mapping một Data Transfer Object (DTO) nhận từ Backend API sang Domain Model, vị trí đúng chuẩn kiến trúc để thực hiện việc này là ở đâu?',
    options: [
      'Trong Fragment hoặc Composable function.',
      'Trong Repository implementation thuộc Data Layer.',
      'Trong Layout XML.',
      'Trong OkHttp Interceptor.'
    ],
    correctAnswers: [1],
    explanation: 'Data Layer (cụ thể là Repository Impl) chịu trách nhiệm nhận DTO từ API, biến đổi (map) chúng thành Domain Model thuần túy trước khi trả về cho Domain/UseCase Layer.'
  },
  {
    id: 232,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Điều khiển điều hướng (Navigation) giữa 2 Journey hoàn toàn độc lập (ví dụ: từ Journey Tài khoản chuyển sang Journey Chuyển tiền) nên được thực hiện như thế nào để đảm bảo Loose Coupling?',
    options: [
      'Import trực tiếp TransferActivity vào AccountFragment và gọi startActivity.',
      'Gọi trực tiếp ViewModel của Journey Chuyển tiền trong Journey Tài khoản.',
      'Sử dụng Navigation Router Interface định nghĩa ở API module và được triển khai ở Integrator level (hoặc Deeplink).',
      'Dùng biến static toàn cục để chuyển dữ liệu và mở Activity.'
    ],
    correctAnswers: [2],
    explanation: 'Sử dụng Router Interface giúp Journey A không cần biết sự tồn tại thực tế của Journey B (zero-coupling), việc điều hướng thực sự do Integrator Module lắp ráp và xử lý.'
  },
  {
    id: 233,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'multi',
    question: 'Một kiến trúc Android tuân thủ Clean Architecture chuẩn sẽ KHÔNG cho phép điều nào sau đây xuất hiện trong Domain Layer? (Chọn 2)',
    options: [
      'Import package android.widget.Toast hoặc android.view.View.',
      'Khai báo các Kotlin Interface cho Repository.',
      'Sử dụng các annotation của Jackson/Gson/Moshi như @SerializedName hay @JsonProperty.',
      'Khai báo các UseCase/Interactor chứa pure business logic.'
    ],
    correctAnswers: [0, 2],
    explanation: 'Domain Layer phải là Pure Kotlin. Việc xuất hiện Android UI Component (Toast, View) hoặc các Annotation biến đổi JSON của Data Layer là vi phạm nguyên tắc phân tầng.'
  },
  {
    id: 234,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Khái niệm "Single Source of Truth" (SSOT) trong quản lý dữ liệu ứng dụng mobile nghĩa là gì?',
    options: [
      'Dữ liệu chỉ được phép lưu ở Server, không lưu dưới Client.',
      'Một nguồn dữ liệu duy nhất (thường là Repository/Local DB) chịu trách nhiệm cung cấp và cập nhật trạng thái chuẩn xác nhất cho toàn bộ app.',
      'Tất cả dữ liệu phải được lưu trong SharedPreferences.',
      'Tất cả UI Composable phải tự quản lý state nội bộ.'
    ],
    correctAnswers: [1],
    explanation: 'SSOT đảm bảo rằng mọi thành phần trên UI đều tiêu thụ dữ liệu từ một nguồn duy nhất. Khi nguồn này cập nhật, tất cả UI liên quan đều được cập nhật đồng bộ, tránh lệch dữ liệu.'
  },
  {
    id: 235,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Tại sao Domain Layer trong Clean Architecture phải là Pure Kotlin?',
    options: [
      'Để tối ưu hóa việc tiêu thụ pin.',
      'Để tách biệt hoàn toàn Business Logic khỏi framework Android, giúp code dễ Unit Test và độc lập với nền tảng.',
      'Vì Android Studio cấm viết Java trong Domain Layer.',
      'Để tự động chuyển đổi sang mã nhị phân Assembly.'
    ],
    correctAnswers: [1],
    explanation: 'Pure Kotlin đảm bảo Domain Layer không bị dính líu đến Android Framework, dễ kiểm thử và bền vững.'
  },
  {
    id: 236,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'multi',
    question: 'Các thành phần nào thuộc về Domain Layer trong một Journey? (Chọn 2)',
    options: [
      'Use Cases / Interactors.',
      'Business Domain Entities / Models.',
      'Room Database DAO.',
      'Retrofit Service Interface.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Domain Layer chỉ chứa Use Cases, Domain Models và Repository Interfaces.'
  },
  {
    id: 237,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Luồng dữ liệu đơn hướng (UDF) trong Presentation Layer giúp giải quyết vấn đề gì?',
    options: [
      'Giảm kích thước ảnh trong drawable.',
      'Đảm bảo trạng thái UI nhất quán, có thể dự đoán được (predictable) và dễ dàng debug.',
      'Tăng tốc độ tải dữ liệu từ 4G lên 5G.',
      'Loại bỏ hoàn toàn việc sử dụng ViewModel.'
    ],
    correctAnswers: [1],
    explanation: 'UDF ngăn ngừa việc đột biến trạng thái từ nhiều nguồn, đảm bảo trạng thái UI chỉ phát ra từ ViewModel.'
  },
  {
    id: 238,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Khi ViewModel phát ra UI State dưới dạng StateFlow, tại sao nên dùng MutableStateFlow ở mức private?',
    options: [
      'Để tránh việc tầng View có thể can thiệp làm thay đổi trực tiếp trạng thái UI ngoài tầm kiểm soát của ViewModel.',
      'Vì Kotlin bắt buộc tất cả biến trong ViewModel phải là private.',
      'Để tăng dung lượng bộ nhớ heap.',
      'Để tránh phải sử dụng Coroutines.'
    ],
    correctAnswers: [0],
    explanation: 'Nguyên tắc Encapsulation: chỉ ViewModel mới có quyền thay đổi trạng thái UI.'
  },
  {
    id: 239,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Để thu thập StateFlow trong Jetpack Compose một cách nhận biết vòng đời (Lifecycle-aware), hàm nào được khuyến nghị?',
    options: [
      'flow.collect()',
      'flow.collectAsStateWithLifecycle()',
      'flow.getValue()',
      'remember { flow.value }'
    ],
    correctAnswers: [1],
    explanation: 'collectAsStateWithLifecycle() tự động dừng thu thập khi Composable không hiển thị, tiết kiệm tài nguyên.'
  },
  {
    id: 240,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'multi',
    question: 'Những vai trò chính của Use Case trong Clean Architecture là gì? (Chọn 2)',
    options: [
      'Đóng gói một logic nghiệp vụ duy nhất (Single Responsibility).',
      'Điều phối dữ liệu giữa các Repository Interfaces mà không quan tâm nguồn dữ liệu cụ thể.',
      'Trực tiếp gọi hàm findViewById để đổi màu chữ trên màn hình.',
      'Lưu trữ chuỗi JSON vào bộ nhớ đệm SQLite.'
    ],
    correctAnswers: [0, 1],
    explanation: 'Use Case điều phối nghiệp vụ và tuân thủ nguyên lý Single Responsibility.'
  },
  {
    id: 241,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Trong Kotlin Coroutines, hàm nào thường được sử dụng trong Use Case để bắt lỗi và trả về Result<T>?',
    options: [
      'runBlocking { }',
      'runCatching { }',
      'launch { }',
      'async { }'
    ],
    correctAnswers: [1],
    explanation: 'runCatching đóng gói kết quả thực thi thành Result.success hoặc Result.failure an toàn.'
  },
  {
    id: 242,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Thành phần Mapper trong Data Layer chịu trách nhiệm gì?',
    options: [
      'Chuyển đổi qua lại giữa DTO (từ API/Database) và Domain Model thuần túy.',
      'Vẽ bản đồ chi nhánh ngân hàng trên Google Maps.',
      'Chuyển đổi layout XML sang Composable.',
      'Nén dữ liệu truyền qua mạng.'
    ],
    correctAnswers: [0],
    explanation: 'Mapper cách ly chi tiết dữ liệu mạng khỏi Domain Layer, bảo vệ UI không vỡ khi API đổi schema.'
  },
  {
    id: 243,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Khi hai Journey độc lập cần điều hướng qua lại, tại sao KHÔNG NÊN gọi trực tiếp Intent tới Activity của Journey kia?',
    options: [
      'Vì Android cấm gọi Activity giữa các module.',
      'Vì tạo ra sự phụ thuộc cứng (tight coupling), phá vỡ tính độc lập và khả năng tái sử dụng module.',
      'Vì gây crash do tràn bộ nhớ stack.',
      'Vì Google Play từ chối phê duyệt.'
    ],
    correctAnswers: [1],
    explanation: 'Phải sử dụng Router Interface để đảm bảo zero-coupling giữa các Journey.'
  },
  {
    id: 244,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'multi',
    question: 'Khi nào một biến trong ViewModel nên được quản lý qua SavedStateHandle? (Chọn 2)',
    options: [
      'Khi cần lưu trữ các tham số điều hướng hoặc ID phiên làm việc quan trọng.',
      'Khi muốn trạng thái form nhập dở của người dùng sống sót qua sự kiện Process Death do thiếu RAM.',
      'Khi muốn lưu trữ ảnh bitmap dung lượng 50MB.',
      'Khi cần lưu mật khẩu tài khoản người dùng vĩnh viễn.'
    ],
    correctAnswers: [0, 1],
    explanation: 'SavedStateHandle dùng để lưu các dữ liệu trạng thái nhẹ giúp phục hồi sau Process Death.'
  },
  {
    id: 245,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Trong MVI/UDF, sự kiện diễn ra 1 lần (One-off Event như SnackBar, Navigate) nên được phát qua thành phần nào?',
    options: [
      'MutableStateFlow',
      'SharedFlow(replay = 0) hoặc Channel',
      'Biến Boolean static',
      'SharedPreferences'
    ],
    correctAnswers: [1],
    explanation: 'SharedFlow với replay = 0 hoặc Channel đảm bảo sự kiện chỉ được xử lý một lần duy nhất.'
  },
  {
    id: 246,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Khái niệm \'Dependency Inversion\' trong việc tách module :api và :impl thể hiện ở điểm nào?',
    options: [
      'Module :impl phụ thuộc vào :api, và các module khác chỉ cần phụ thuộc vào :api mà không cần biết chi tiết bên trong :impl.',
      'Tất cả các module đều phụ thuộc vào module :app.',
      'Không có module nào được sử dụng Interface.',
      'Đảo ngược thứ tự biên dịch của Gradle.'
    ],
    correctAnswers: [0],
    explanation: 'Các module phụ thuộc vào trừu tượng (Interface contract ở :api) thay vì phụ thuộc vào thực thi cụ thể (:impl).'
  },
  {
    id: 247,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'Trong Clean Architecture, quy tắc phụ thuộc (Dependency Rule) khẳng định điều gì?',
    options: [
      'Mã nguồn ở tầng bên trong không bao giờ được biết đến bất kỳ điều gì ở tầng bên ngoài.',
      'Tầng Domain phụ thuộc trực tiếp vào tầng Data.',
      'Tầng Presentation phụ thuộc trực tiếp vào cơ sở dữ liệu.',
      'Tất cả các tầng đều phụ thuộc vào Android SDK.'
    ],
    correctAnswers: [0],
    explanation: 'Mọi phụ thuộc mã nguồn đều hướng vào trong, Domain Layer ở trung tâm không biết về các tầng ngoài.'
  },
  {
    id: 248,
    section: 'architecture',
    sectionName: 'Section 2: Mobile Essentials Android Architecture',
    type: 'single',
    question: 'State Hoisting trong Jetpack Compose mang lại lợi ích lớn nhất nào?',
    options: [
      'Làm cho Composable trở nên Stateless, dễ tái sử dụng và kiểm thử độc lập.',
      'Giúp Composable tự động lưu dữ liệu vào đĩa cứng.',
      'Tăng xung nhịp xử lý của GPU.',
      'Giảm số lượng Composable trong project.'
    ],
    correctAnswers: [0],
    explanation: 'State Hoisting đẩy State lên cấp trên, biến component thành Stateless và dễ test.'
  }
]
