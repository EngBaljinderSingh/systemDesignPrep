export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type TopicCategory = 'Language' | 'Framework' | 'Cloud' | 'DevOps' | 'Database' | 'Architecture';

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;        // 0-indexed
  explanation: string;
}

export interface LearningConcept {
  id: string;
  name: string;
  summary: string;
  codeExample?: string;
  funFact?: string;
  quiz?: QuizQuestion;
}

export interface LearningSubtopic {
  id: string;
  name: string;
  level: DifficultyLevel;
  description: string;
  concepts: LearningConcept[];
}

export interface LearningTopic {
  id: string;
  name: string;
  icon: string;
  gradient: string;
  tagline: string;
  category: TopicCategory;
  subtopics: LearningSubtopic[];
}

export const learningTopics: LearningTopic[] = [

  // ─── JAVA ──────────────────────────────────────────────────────────────────
  {
    id: 'java',
    name: 'Java',
    icon: '☕',
    gradient: 'from-orange-500 to-red-600',
    tagline: 'Write once, run anywhere',
    category: 'Language',
    subtopics: [
      {
        id: 'java-oop',
        name: 'Core Java & OOP',
        level: 'Beginner',
        description: 'Foundations: OOP pillars, Collections, Generics, Exception handling, and Java type system.',
        concepts: [
          {
            id: 'java-4pillars',
            name: 'The Four OOP Pillars',
            summary: 'Encapsulation (bundle + hide), Inheritance (reuse via IS-A), Polymorphism (many forms — override + overload), Abstraction (expose what, hide how).',
            codeExample: `// Encapsulation
class BankAccount {
  private double balance; // hidden
  public void deposit(double amt) { if (amt > 0) balance += amt; } // controlled access
}

// Polymorphism
class Animal { void sound() { System.out.println("..."); } }
class Dog extends Animal { @Override void sound() { System.out.println("Woof"); } }
Animal a = new Dog(); a.sound(); // → "Woof" (runtime polymorphism)`,
            funFact: '🎯 Java was created in 1995 by James Gosling at Sun. It was originally called "Oak" after a tree outside his office!',
            quiz: {
              question: 'Which pillar hides internal implementation details using private fields?',
              options: ['Abstraction', 'Polymorphism', 'Encapsulation', 'Inheritance'],
              answer: 2,
              explanation: 'Encapsulation bundles data and methods together and controls access via access modifiers (private, protected, public).',
            },
          },
          {
            id: 'java-collections',
            name: 'Collections Framework',
            summary: 'ArrayList (O(1) get, O(n) insert), LinkedList (O(1) insert, O(n) get), HashMap (O(1) avg), TreeMap (O(log n) sorted), HashSet, LinkedHashMap (insertion-ordered).',
            codeExample: `// Choose the right collection
List<String>    arr  = new ArrayList<>();   // random access
Queue<Task>     q    = new ArrayDeque<>();  // FIFO processing
Map<String,Int> freq = new HashMap<>();     // fast lookup
Map<String,Int> sorted = new TreeMap<>();   // alphabetical order
Set<String>     seen = new LinkedHashSet<>(); // unique + ordered

// Streams + Collections → functional style
Map<Dept, List<Emp>> byDept = employees.stream()
    .collect(Collectors.groupingBy(Emp::dept));`,
            funFact: '⚡ HashMap in Java 8+ converts a bucket from LinkedList to a Red-Black Tree when it exceeds 8 entries — making worst-case O(log n) instead of O(n)!',
            quiz: {
              question: 'Which Map preserves insertion order AND has O(1) get?',
              options: ['HashMap', 'TreeMap', 'LinkedHashMap', 'EnumMap'],
              answer: 2,
              explanation: 'LinkedHashMap maintains a doubly-linked list of entries in insertion order while still using a hash table for O(1) access.',
            },
          },
          {
            id: 'java-generics',
            name: 'Generics & Type Safety',
            summary: 'Generics eliminate casting and catch type errors at compile time. Key concepts: bounded wildcards (? extends, ? super), type erasure, and the PECS rule (Producer Extends, Consumer Super).',
            codeExample: `// Generic method
public <T extends Comparable<T>> T max(List<T> list) {
  return list.stream().max(Comparator.naturalOrder()).orElseThrow();
}

// PECS rule
void copy(List<? extends Number> src,  // Producer — you READ from it
          List<? super   Number> dest) { // Consumer — you WRITE to it
  dest.addAll(src);
}

// Bounded type parameter
class NumberBox<T extends Number> {
  T value;
  double doubleValue() { return value.doubleValue(); }
}`,
            funFact: '🔮 Java Generics use "type erasure" — at runtime, List<String> and List<Integer> are both just List. Generic info is compile-time only!',
            quiz: {
              question: 'What does PECS stand for in Java Generics?',
              options: [
                'Private Extends, Constructor Super',
                'Producer Extends, Consumer Super',
                'Public Extends, Cast Super',
                'Polymorphic Extends, Covariant Super',
              ],
              answer: 1,
              explanation: 'PECS: if a collection produces (you read from it), use <? extends T>. If it consumes (you write to it), use <? super T>.',
            },
          },
        ],
      },
      {
        id: 'java-concurrency',
        name: 'Concurrency & Multithreading',
        level: 'Intermediate',
        description: 'Threads, ExecutorService, CompletableFuture, synchronization, volatile, locks, and Java 21 Virtual Threads.',
        concepts: [
          {
            id: 'java-executor',
            name: 'ExecutorService & Thread Pools',
            summary: 'Never create raw Thread objects in production. Use Executors.newFixedThreadPool(), newCachedThreadPool(), or Spring\'s @Async with a configured TaskExecutor.',
            codeExample: `// Thread pool — reuses threads, bounded concurrency
ExecutorService pool = Executors.newFixedThreadPool(
    Runtime.getRuntime().availableProcessors());

Future<String> future = pool.submit(() -> fetchDataFromAPI());
String result = future.get(5, TimeUnit.SECONDS); // blocks with timeout
pool.shutdown();

// Spring @Async (recommended in Spring Boot)
@Async
public CompletableFuture<Report> generateReport(Long id) {
  return CompletableFuture.completedFuture(buildReport(id));
}`,
            funFact: '🚀 Java 21 introduced Project Loom\'s Virtual Threads — you can now spin up millions of threads cheaply. The JDK manages mapping them to OS threads!',
            quiz: {
              question: 'Which executor is best for CPU-bound tasks?',
              options: [
                'newCachedThreadPool()',
                'newSingleThreadExecutor()',
                'newFixedThreadPool(Runtime.getRuntime().availableProcessors())',
                'newScheduledThreadPool(100)',
              ],
              answer: 2,
              explanation: 'For CPU-bound work, match thread count to available processors. More threads just add context-switching overhead.',
            },
          },
          {
            id: 'java-completablefuture',
            name: 'CompletableFuture (Async Pipeline)',
            summary: 'CompletableFuture lets you chain async steps (thenApply, thenCompose, thenCombine) without blocking. Essential for non-blocking microservices.',
            codeExample: `CompletableFuture<OrderSummary> summary = CompletableFuture
    .supplyAsync(() -> userService.getUser(userId))          // async fetch
    .thenApply(user -> enrichWithLoyalty(user))              // transform
    .thenCompose(user -> orderService.getOrders(user.id()))  // chain async
    .thenCombine(
        productService.getCatalogAsync(),                    // run in parallel
        (orders, catalog) -> buildSummary(orders, catalog)  // merge results
    )
    .exceptionally(ex -> OrderSummary.empty());              // fallback

OrderSummary result = summary.get(); // block only here`,
            funFact: '🔗 CompletableFuture was added in Java 8. Before that, developers used Guava\'s ListenableFuture for async chaining!',
          },
          {
            id: 'java-volatile-synchronized',
            name: 'Volatile, Synchronized & Locks',
            summary: 'volatile ensures visibility (not atomicity). synchronized ensures both visibility and mutual exclusion. ReentrantLock adds timed/fair locking. Use java.util.concurrent.atomic for counters.',
            codeExample: `// volatile — visibility only, for flags
private volatile boolean running = true;

// synchronized — visibility + mutual exclusion
class Counter {
  private int count = 0;
  synchronized void increment() { count++; } // atomic
}

// AtomicInteger — lock-free, prefer over synchronized for counters
private AtomicInteger hits = new AtomicInteger(0);
hits.incrementAndGet(); // thread-safe, faster than synchronized

// ReentrantReadWriteLock — concurrent reads, exclusive writes
ReadWriteLock lock = new ReentrantReadWriteLock();
lock.readLock().lock();  // multiple readers OK
lock.writeLock().lock(); // exclusive`,
            funFact: '⚠️ The infamous "double-checked locking" pattern was broken until Java 5 fixed the memory model. Always use volatile with it!',
            quiz: {
              question: 'What does the volatile keyword guarantee in Java?',
              options: [
                'Atomicity of compound operations like i++',
                'Visibility — all threads see the latest write immediately',
                'Both atomicity and visibility',
                'Thread safety of the whole object',
              ],
              answer: 1,
              explanation: 'volatile guarantees visibility only. For atomicity of compound operations, use synchronized or AtomicInteger.',
            },
          },
        ],
      },
      {
        id: 'java-modern',
        name: 'Modern Java (8 → 21)',
        level: 'Intermediate',
        description: 'Streams, Lambdas, Optional, Records, Sealed classes, Pattern Matching, and Virtual Threads.',
        concepts: [
          {
            id: 'java-streams',
            name: 'Stream API & Lambdas',
            summary: 'Streams provide declarative, lazy data processing pipelines. Intermediate ops (filter, map, sorted) are lazy; terminal ops (collect, count, forEach) trigger execution.',
            codeExample: `// Functional-style data processing
List<String> topEmails = employees.stream()
    .filter(e -> e.salary() > 80_000)       // intermediate — lazy
    .sorted(Comparator.comparing(Employee::name))
    .map(Employee::email)                   // transform
    .distinct()
    .limit(10)
    .collect(Collectors.toList());           // terminal — triggers pipeline

// Parallel stream — use only for CPU-bound tasks on large data sets
long count = largeList.parallelStream()
    .filter(item -> expensiveComputation(item))
    .count();`,
            funFact: '💡 Streams are lazy! filter() and map() don\'t execute until a terminal operation is called. This makes infinite streams possible: Stream.iterate(0, n->n+1).limit(100)',
            quiz: {
              question: 'Which of these is a TERMINAL stream operation?',
              options: ['filter()', 'map()', 'sorted()', 'collect()'],
              answer: 3,
              explanation: 'collect(), count(), forEach(), findFirst() etc. are terminal — they trigger the pipeline. filter/map/sorted are intermediate and lazy.',
            },
          },
          {
            id: 'java-records',
            name: 'Records, Sealed Classes & Pattern Matching',
            summary: 'Java 16+ Records are immutable data carriers. Sealed classes (Java 17+) restrict class hierarchies. Pattern matching (Java 21) enables expressive type-safe switch.',
            codeExample: `// Record — auto-generates constructor, getters, equals, hashCode, toString
record Point(double x, double y) {
  // compact constructor for validation
  Point { if (x < 0 || y < 0) throw new IllegalArgumentException("Negative!"); }
}

// Sealed class — exhaustive hierarchy (perfect for DDD Value Objects)
sealed interface Shape permits Circle, Rectangle, Triangle {}
record Circle(double radius)             implements Shape {}
record Rectangle(double w, double h)    implements Shape {}

// Pattern matching switch (Java 21) — exhaustive, no default needed
double area = switch (shape) {
  case Circle c    -> Math.PI * c.radius() * c.radius();
  case Rectangle r -> r.w() * r.h();
  case Triangle t  -> 0.5 * t.base() * t.height();
};`,
            funFact: '🎉 Before records, a simple DTO in Java required 50+ lines of boilerplate. Lombok helped, but records are now built into the language!',
          },
          {
            id: 'java-virtual-threads',
            name: 'Virtual Threads (Java 21)',
            summary: 'Virtual threads (Project Loom) are JVM-managed lightweight threads. You can create millions without issue. Great for I/O-bound services — replaces reactive programming for most use cases.',
            codeExample: `// Create a virtual thread
Thread.ofVirtual().start(() -> handleRequest(request));

// Use virtual thread executor in Spring Boot (application.yml)
// spring.threads.virtual.enabled=true  (Spring Boot 3.2+)

// Virtual thread pool
try (ExecutorService exec = Executors.newVirtualThreadPerTaskExecutor()) {
  List<Future<String>> futures = requests.stream()
      .map(req -> exec.submit(() -> callExternalAPI(req)))
      .toList();
  // Each blocking I/O call yields the virtual thread — no OS thread wasted
}`,
            funFact: '🌟 With virtual threads, a 20-year-old Java blocking code pattern becomes as scalable as reactive code — without the complexity. Project Loom took 8+ years to develop!',
            quiz: {
              question: 'What is the primary benefit of Java 21 Virtual Threads?',
              options: [
                'Faster CPU-bound computation via parallelism',
                'Cheap I/O-bound concurrency without blocking OS threads',
                'Replacing synchronized with lock-free algorithms',
                'Automatic memory management for thread stacks',
              ],
              answer: 1,
              explanation: 'Virtual threads are mounted/unmounted from OS threads when blocking on I/O, allowing millions of concurrent I/O operations with a small OS thread pool.',
            },
          },
        ],
      },
    ],
  },

  // ─── SPRING BOOT ─────────────────────────────────────────────────────────
  {
    id: 'spring-boot',
    name: 'Spring Boot',
    icon: '🍃',
    gradient: 'from-green-500 to-emerald-600',
    tagline: 'Production-ready Spring, zero XML',
    category: 'Framework',
    subtopics: [
      {
        id: 'sb-core',
        name: 'Core Concepts & IoC',
        level: 'Beginner',
        description: 'Bean lifecycle, Dependency Injection, auto-configuration, and Spring application context.',
        concepts: [
          {
            id: 'sb-di',
            name: 'Dependency Injection & IoC',
            summary: 'Spring\'s IoC container creates and wires beans for you. Always prefer constructor injection — it makes dependencies explicit and fields final (immutable).',
            codeExample: `// ✅ Constructor injection (recommended)
@Service
public class OrderService {
  private final OrderRepository repo;
  private final PaymentGateway  payment;

  // Spring resolves both beans automatically
  public OrderService(OrderRepository repo, PaymentGateway payment) {
    this.repo    = repo;
    this.payment = payment;
  }
}

// @Qualifier — when multiple beans implement the same interface
@Service
public class NotificationService {
  @Autowired @Qualifier("email") NotificationSender sender;
}`,
            funFact: '🏭 The Spring IoC container reads all your @Component, @Service, @Repository annotations at startup and builds a dependency graph. It\'s essentially topological sort at boot time!',
            quiz: {
              question: 'Why is constructor injection preferred over field injection in Spring?',
              options: [
                'It\'s faster at runtime',
                'It makes dependencies explicit and allows final fields (immutability)',
                'It uses less memory',
                'It supports circular dependencies better',
              ],
              answer: 1,
              explanation: 'Constructor injection makes dependencies visible in the API, allows fields to be final (thread-safe), and makes the class testable without Spring.',
            },
          },
          {
            id: 'sb-autoconfig',
            name: 'Auto-Configuration Magic',
            summary: 'Spring Boot reads your classpath and applies @Conditional configurations automatically. spring.factories / META-INF/spring.factories lists all auto-config candidates.',
            codeExample: `// See what's auto-configured
@SpringBootApplication
public class App {
  public static void main(String[] args) {
    // Add --debug flag to see auto-configuration report
    SpringApplication.run(App.class, args);
  }
}

// Override auto-config via application.yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: app_user
  jpa:
    hibernate.ddl-auto: validate
    show-sql: false

// Custom condition
@ConditionalOnProperty(name = "feature.payments.enabled", havingValue = "true")
@Configuration class PaymentConfig { /* Only loads if property is true */ }`,
            funFact: '🔮 Type "spring.factories" in your IDE — you\'ll see over 100 auto-configurations Spring Boot can apply. It\'s like a buffet: only what\'s on your classpath gets served!',
          },
          {
            id: 'sb-profiles',
            name: 'Profiles & Externalised Config',
            summary: 'Use @Profile and application-{profile}.yml to manage environment-specific configuration. Activate via SPRING_PROFILES_ACTIVE env var in containers.',
            codeExample: `# application.yml (default)
server.port: 8080

# application-dev.yml (local)
spring.jpa.show-sql: true

# application-prod.yml (production)
spring.datasource.hikari.maximum-pool-size: 20

# @Profile — load bean only in specific profile
@Component @Profile("dev")
class DevDataSeeder implements ApplicationRunner {
  public void run(ApplicationArguments args) { seedTestData(); }
}

// In Docker: -e SPRING_PROFILES_ACTIVE=prod`,
            funFact: '📦 Spring Boot 2.4+ introduced config trees and Kubernetes ConfigMap support, letting you mount config files as a directory tree instead of a flat file!',
          },
        ],
      },
      {
        id: 'sb-rest',
        name: 'REST API & Validation',
        level: 'Beginner',
        description: 'Building production REST APIs: controllers, request mapping, validation, exception handling, DTOs.',
        concepts: [
          {
            id: 'sb-controller',
            name: 'REST Controllers & DTOs',
            summary: 'Use @RestController + @RequestMapping. Always use dedicated DTO classes, never expose JPA entities directly to the API layer.',
            codeExample: `@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

  private final OrderService orderService;

  @GetMapping("/{id}")
  public ResponseEntity<OrderResponse> getOrder(@PathVariable Long id) {
    return orderService.findById(id)
        .map(order -> ResponseEntity.ok(OrderMapper.toResponse(order)))
        .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public OrderResponse createOrder(@Valid @RequestBody CreateOrderRequest req) {
    return OrderMapper.toResponse(orderService.create(req));
  }
}`,
            funFact: '🎭 Spring\'s @RestController = @Controller + @ResponseBody. Before this shorthand existed in Spring 4, you had to annotate every method with @ResponseBody!',
            quiz: {
              question: 'Why should you never expose JPA entities directly from REST controllers?',
              options: [
                'JPA entities are too large',
                'It causes circular serialisation, exposes internal model, and breaks open/closed principle',
                'Spring cannot serialize entities',
                'It is slower',
              ],
              answer: 1,
              explanation: 'Entities can have lazy-loaded relationships causing serialisation errors, expose internal fields, and tightly couple your API contract to your DB schema.',
            },
          },
          {
            id: 'sb-validation',
            name: 'Bean Validation (Jakarta)',
            summary: 'Use @Valid + Jakarta Bean Validation annotations (@NotNull, @Size, @Email, @Pattern) on DTOs. Define custom validators with @Constraint.',
            codeExample: `@Data public class CreateUserRequest {
  @NotBlank(message = "Name is required")
  @Size(min = 2, max = 50)
  private String name;

  @Email(message = "Must be valid email")
  @NotNull
  private String email;

  @Pattern(regexp = "^(?=.*[A-Z])(?=.*\\d).{8,}$",
           message = "Password: 8+ chars, 1 uppercase, 1 digit")
  private String password;
}

// Global exception handler — catches all validation failures
@RestControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(MethodArgumentNotValidException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
    ProblemDetail pd = ProblemDetail.forStatus(400);
    pd.setProperty("errors", ex.getFieldErrors()...);
    return pd;
  }
}`,
            funFact: '🌐 Jakarta Bean Validation was previously called "javax.validation" — it was renamed when Java EE moved to the Eclipse Foundation and became Jakarta EE!',
          },
          {
            id: 'sb-exception',
            name: 'Global Exception Handling',
            summary: '@RestControllerAdvice centralises all exception handling. Return RFC 7807 ProblemDetail responses for a standardised error format.',
            codeExample: `@RestControllerAdvice
public class ApiExceptionHandler extends ResponseEntityExceptionHandler {

  @ExceptionHandler(EntityNotFoundException.class)
  public ProblemDetail handleNotFound(EntityNotFoundException ex) {
    return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ProblemDetail handleForbidden(AccessDeniedException ex) {
    return ProblemDetail.forStatus(HttpStatus.FORBIDDEN);
  }

  // Catches everything else — log it, return generic 500
  @ExceptionHandler(Exception.class)
  public ProblemDetail handleAll(Exception ex, WebRequest req) {
    log.error("Unhandled exception on {}", req.getDescription(false), ex);
    return ProblemDetail.forStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
}`,
            funFact: '📐 RFC 7807 (Problem Details for HTTP APIs) is a standard JSON format for API errors with type, title, status, detail, and instance fields. Spring Boot 3 supports it out of the box!',
          },
        ],
      },
      {
        id: 'sb-data',
        name: 'Spring Data JPA & Testing',
        level: 'Intermediate',
        description: 'JPA repositories, JPQL, N+1 problem, transactions, and testing with JUnit 5 + Testcontainers.',
        concepts: [
          {
            id: 'sb-jpa',
            name: 'JPA Repositories & N+1 Problem',
            summary: 'Spring Data JPA generates queries from method names. The N+1 problem occurs when fetching a collection causes N additional queries. Fix with JOIN FETCH or @EntityGraph.',
            codeExample: `// Spring Data JPA — method name → SQL
interface OrderRepository extends JpaRepository<Order, Long> {
  List<Order> findByCustomerIdAndStatus(Long customerId, OrderStatus status);

  // Fix N+1 with JOIN FETCH
  @Query("SELECT o FROM Order o JOIN FETCH o.items WHERE o.customer.id = :id")
  List<Order> findWithItemsByCustomerId(@Param("id") Long id);

  // Or use @EntityGraph
  @EntityGraph(attributePaths = {"items", "customer"})
  List<Order> findByStatus(OrderStatus status);
}`,
            funFact: '🐌 The N+1 problem means loading 100 orders with their items fires 101 queries: 1 for orders + 100 for each order\'s items. JOIN FETCH collapses it to 1 query!',
            quiz: {
              question: 'What is the most common fix for the N+1 query problem in JPA?',
              options: [
                'Using @Lazy on associations',
                'JOIN FETCH in JPQL or @EntityGraph to load associations in one query',
                'Increasing connection pool size',
                'Using @Cacheable on the repository method',
              ],
              answer: 1,
              explanation: 'JOIN FETCH or @EntityGraph loads the association in the same SQL query, eliminating the N additional queries.',
            },
          },
          {
            id: 'sb-transactions',
            name: '@Transactional Deep Dive',
            summary: '@Transactional uses a proxy. Self-invocation won\'t trigger it. Default propagation is REQUIRED; default isolation is the DB default. Use readOnly=true for query methods.',
            codeExample: `@Service public class OrderService {

  @Transactional(readOnly = true)          // tells Hibernate: no dirty checking
  public List<Order> getOrders(Long id)   { return repo.findByCustomerId(id); }

  @Transactional                            // REQUIRED: join existing or create new
  public Order placeOrder(CreateOrderRequest req) {
    Order order = new Order(...);
    repo.save(order);
    paymentService.charge(req.card(), order.total()); // same TX
    return order;
  }

  @Transactional(propagation = REQUIRES_NEW) // always new TX — for audit logging
  public void auditLog(String action) { auditRepo.save(new AuditEntry(action)); }
}

// ⚠️ Self-call bypasses proxy — this won't start a transaction!
public void process() { placeOrder(req); } // WRONG — call from external bean`,
            funFact: '🔄 Spring\'s @Transactional works via a CGLIB proxy. The proxy intercepts calls and manages the transaction. If you call another method in the same class, you bypass the proxy entirely!',
          },
          {
            id: 'sb-testing',
            name: 'Testing with Testcontainers',
            summary: 'Use @SpringBootTest for integration tests. Testcontainers spins up real Docker containers (PostgreSQL, Redis, Kafka) for tests, eliminating flaky H2 in-memory alternatives.',
            codeExample: `@SpringBootTest
@Testcontainers
class OrderServiceIT {

  @Container
  static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
      .withDatabaseName("testdb");

  @DynamicPropertySource
  static void props(DynamicPropertyRegistry r) {
    r.add("spring.datasource.url",      postgres::getJdbcUrl);
    r.add("spring.datasource.username", postgres::getUsername);
    r.add("spring.datasource.password", postgres::getPassword);
  }

  @Autowired OrderService orderService;

  @Test
  void placeOrder_persistsAndReturnsOrder() {
    Order order = orderService.placeOrder(testRequest());
    assertThat(order.id()).isNotNull();
    assertThat(order.status()).isEqualTo(PENDING);
  }
}`,
            funFact: '🐳 Testcontainers starts real Docker containers for your tests. It\'s even smarter now — in TestContainers Cloud, tests can share running containers across your entire CI pipeline!',
          },
        ],
      },
    ],
  },

  // ─── REACT ────────────────────────────────────────────────────────────────
  {
    id: 'react',
    name: 'React',
    icon: '⚛️',
    gradient: 'from-cyan-500 to-blue-600',
    tagline: 'Build UIs from composable components',
    category: 'Framework',
    subtopics: [
      {
        id: 'react-hooks',
        name: 'Hooks & Component Model',
        level: 'Beginner',
        description: 'useState, useEffect, useCallback, useMemo, useRef, and custom hooks.',
        concepts: [
          {
            id: 'react-use-state-effect',
            name: 'useState & useEffect',
            summary: 'useState manages local component state. useEffect synchronizes with external systems (APIs, subscriptions). Always cleanup in useEffect return value to prevent memory leaks.',
            codeExample: `function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false; // prevent state update on unmounted component
    setLoading(true);
    fetchUser(userId).then(data => {
      if (!cancelled) { setUser(data); setLoading(false); }
    });
    return () => { cancelled = true; }; // cleanup
  }, [userId]); // re-run when userId changes

  if (loading) return <Spinner />;
  return <div>{user?.name}</div>;
}`,
            funFact: '🪝 Hooks were introduced in React 16.8 (Feb 2019). Before hooks, you needed class components for state and lifecycle — hooks eliminated 90% of class component use cases!',
            quiz: {
              question: 'What is the correct dependency array for an effect that should run only once on mount?',
              options: ['No dependency array', '[undefined]', '[] (empty array)', '[true]'],
              answer: 2,
              explanation: 'An empty [] dependency array tells React to run the effect only on mount and clean up on unmount — it never re-runs.',
            },
          },
          {
            id: 'react-memo-callback',
            name: 'useMemo, useCallback & React.memo',
            summary: 'useMemo memoizes computed values. useCallback memoizes functions. React.memo prevents re-renders when props haven\'t changed. Only add these when you have a measured perf problem.',
            codeExample: `// useMemo — expensive computation
const sortedItems = useMemo(
  () => items.sort((a, b) => a.price - b.price),
  [items] // recompute only when items changes
);

// useCallback — stable function reference for child props
const handleDelete = useCallback(
  (id) => dispatch(deleteItem(id)),
  [dispatch] // dispatch is stable, so handleDelete is stable
);

// React.memo — skip re-render if props unchanged
const ItemRow = React.memo(({ item, onDelete }) => (
  <tr><td>{item.name}</td><td><button onClick={() => onDelete(item.id)}>X</button></td></tr>
));`,
            funFact: '⚡ Don\'t over-memoize! React.memo has its own overhead. The React team says: profile first, only add useMemo/useCallback where you see actual slowness.',
          },
          {
            id: 'react-custom-hooks',
            name: 'Custom Hooks',
            summary: 'Custom hooks extract and reuse stateful logic between components. Name them with "use" prefix. They\'re just functions that call other hooks.',
            codeExample: `// Reusable data fetching hook
function useFetch<T>(url: string) {
  const [data, setData]       = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<Error | null>(null);

  useEffect(() => {
    fetch(url)
      .then(r => r.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}

// Usage — clean and declarative
function ProductList() {
  const { data, loading, error } = useFetch<Product[]>('/api/products');
  if (loading) return <Spinner />;
  return <ul>{data?.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}`,
            funFact: '🎨 React Query (TanStack Query) is essentially a very sophisticated custom hook for server state management. It handles caching, background refetching, stale-while-revalidate etc.',
          },
        ],
      },
      {
        id: 'react-state',
        name: 'State Management',
        level: 'Intermediate',
        description: 'Context API, Redux Toolkit, Zustand, and TanStack Query for server state.',
        concepts: [
          {
            id: 'react-context',
            name: 'Context API & useReducer',
            summary: 'Context avoids prop drilling for global state (theme, auth, locale). Combine with useReducer for complex state logic. Split contexts to avoid unnecessary re-renders.',
            codeExample: `// Auth context
const AuthContext = createContext<AuthState | null>(null);

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, { user: null });

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

// Usage
function Navbar() {
  const { user, dispatch } = useAuth();
  return <button onClick={() => dispatch({ type: 'LOGOUT' })}>{user?.name}</button>;
}`,
            funFact: '🌳 Context re-renders ALL consumers when the context value changes. To optimise, split your context into "data" and "dispatch" contexts separately!',
            quiz: {
              question: 'What problem does Context API solve?',
              options: [
                'Making API calls',
                'Prop drilling — passing props through many intermediate components',
                'Performance optimization',
                'Code splitting',
              ],
              answer: 1,
              explanation: 'Context lets you pass values deep into the component tree without threading props through every intermediate component.',
            },
          },
          {
            id: 'react-zustand',
            name: 'Zustand — Lightweight State',
            summary: 'Zustand is a tiny (1KB), unopinionated state management library. No providers, no boilerplate. Use it instead of Redux for simpler global state.',
            codeExample: `import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface CartStore {
  items: CartItem[];
  addItem:    (item: CartItem) => void;
  removeItem: (id: string)    => void;
  total:      () => number;
}

const useCartStore = create<CartStore>()(
  persist(
    devtools((set, get) => ({
      items: [],
      addItem:    (item) => set(state => ({ items: [...state.items, item] })),
      removeItem: (id)   => set(state => ({ items: state.items.filter(i => i.id !== id) })),
      total: () => get().items.reduce((sum, i) => sum + i.price, 0),
    })),
    { name: 'cart-storage' } // persists to localStorage
  )
);`,
            funFact: '🐻 Zustand means "state" in German. Created by the makers of React Spring and Jotai, it\'s become one of the most popular React state libraries with 40k+ GitHub stars!',
          },
          {
            id: 'react-query',
            name: 'TanStack Query (Server State)',
            summary: 'TanStack Query manages server state: caching, background refetch, stale-while-revalidate, optimistic updates, and pagination. Replaces most useEffect+useState patterns for API calls.',
            codeExample: `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetching
function Products() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn:  () => api.get('/products'),
    staleTime: 5 * 60 * 1000, // data stays fresh for 5 min
  });
}

// Mutations with optimistic update
const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: (newItem) => api.post('/items', newItem),
  onMutate: async (newItem) => {
    await queryClient.cancelQueries({ queryKey: ['items'] });
    const previous = queryClient.getQueryData(['items']);
    queryClient.setQueryData(['items'], old => [...old, newItem]); // optimistic
    return { previous }; // rollback context
  },
  onError: (err, newItem, ctx) => queryClient.setQueryData(['items'], ctx.previous),
});`,
            funFact: '🚀 TanStack Query drastically reduces the amount of state you need to manage. The team says most apps can eliminate 40-50% of their state with it!',
          },
        ],
      },
    ],
  },

  // ─── ANGULAR ───────────────────────────────────────────────────────────────
  {
    id: 'angular',
    name: 'Angular',
    icon: '🔺',
    gradient: 'from-red-500 to-pink-600',
    tagline: 'Platform for enterprise-scale web apps',
    category: 'Framework',
    subtopics: [
      {
        id: 'ng-components',
        name: 'Components & Dependency Injection',
        level: 'Beginner',
        description: 'Component lifecycle, change detection, DI hierarchy, and template syntax.',
        concepts: [
          {
            id: 'ng-lifecycle',
            name: 'Component Lifecycle Hooks',
            summary: 'Key hooks: ngOnInit (data fetch, not constructor), ngOnChanges (input changes), ngOnDestroy (cleanup subscriptions). Constructor is only for DI.',
            codeExample: `@Component({ selector: 'app-user', templateUrl: './user.component.html' })
export class UserComponent implements OnInit, OnDestroy {
  @Input() userId!: string;
  user$ = new Subject<User>();
  private destroy$ = new Subject<void>();

  constructor(private userService: UserService) {} // DI only

  ngOnInit(): void {
    // ✅ Fetch data here, not in constructor
    this.userService.getUser(this.userId)
      .pipe(takeUntil(this.destroy$)) // auto-unsubscribe
      .subscribe(u => this.user$.next(u));
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // cleanup all subscriptions
    this.destroy$.complete();
  }
}`,
            funFact: '🔄 Angular 17+ added Signals as a reactive primitive alternative to RxJS for simple state, reducing the need for Subject/BehaviorSubject in many cases!',
            quiz: {
              question: 'Why should data fetching go in ngOnInit rather than the constructor?',
              options: [
                'The constructor runs asynchronously',
                '@Input values are not yet set in the constructor; ngOnInit runs after all inputs are resolved',
                'Angular services are not available in constructors',
                'The constructor is only called once',
              ],
              answer: 1,
              explanation: '@Input() bindings are resolved after construction. ngOnInit is the earliest lifecycle hook where all injected values and inputs are available.',
            },
          },
          {
            id: 'ng-di',
            name: 'Dependency Injection Hierarchy',
            summary: 'Angular\'s DI has a tree: Root injector → Module injector → Element/Component injector. providedIn: "root" creates singletons; providing in a component creates scoped instances.',
            codeExample: `// Root singleton (application-wide)
@Injectable({ providedIn: 'root' })
export class AuthService { ... }

// Module-scoped (new instance per lazy-loaded module)
@NgModule({ providers: [OrderService] })
export class OrdersModule { }

// Component-scoped (new instance per component)
@Component({
  selector: 'app-cart',
  providers: [CartService], // fresh CartService per cart instance
})
export class CartComponent {
  constructor(private cart: CartService) {} // gets its own CartService
}`,
            funFact: '🌲 Angular\'s DI is a tree, not a flat registry. This lets feature modules have their own service instances, perfect for multi-tenant or multi-wizard flows on the same page!',
          },
          {
            id: 'ng-signals',
            name: 'Angular Signals (v17+)',
            summary: 'Signals are Angular\'s new reactive primitives — fine-grained reactivity without Zone.js. Use signal(), computed(), and effect() for simpler state management than pure RxJS.',
            codeExample: `import { signal, computed, effect } from '@angular/core';

@Component({ changeDetection: ChangeDetectionStrategy.OnPush })
export class ProductComponent {
  // Writable signal
  quantity = signal(1);
  price    = signal(29.99);

  // Computed — updates automatically when dependencies change
  total = computed(() => this.quantity() * this.price());

  // Effect — runs when signals it reads change
  constructor() {
    effect(() => console.log('Total changed:', this.total()));
  }

  increment() { this.quantity.update(n => n + 1); }
}`,
            funFact: '📡 Signals were inspired by SolidJS and Vue 3 Composition API. They eventually allow Angular to run without Zone.js (the monkey-patching library that currently drives change detection)!',
          },
        ],
      },
      {
        id: 'ng-rxjs',
        name: 'RxJS & Reactive Patterns',
        level: 'Intermediate',
        description: 'Observables, Subjects, essential operators (switchMap, combineLatest, debounceTime), and managing subscriptions.',
        concepts: [
          {
            id: 'ng-rxjs-operators',
            name: 'Essential RxJS Operators',
            summary: 'switchMap (cancel previous, use for search), mergeMap (parallel), concatMap (sequential), exhaustMap (ignore new while busy). debounceTime for search inputs. combineLatest for merging streams.',
            codeExample: `// Search with switchMap — cancels previous HTTP call
this.searchControl.valueChanges.pipe(
  debounceTime(300),       // wait 300ms after typing stops
  distinctUntilChanged(),  // skip if same value
  filter(q => q.length > 2),
  switchMap(q => this.searchService.search(q)), // cancel in-flight request
  catchError(err => EMPTY) // handle errors gracefully
).subscribe(results => this.results = results);

// combineLatest — emit when ALL sources have emitted
combineLatest([
  this.userService.currentUser$,
  this.featureFlags.flags$,
]).pipe(
  map(([user, flags]) => ({ user, canEdit: flags.editEnabled && user.isAdmin }))
).subscribe(state => this.viewModel = state);`,
            funFact: '🔀 switchMap is probably the most important RxJS operator for HTTP. It automatically cancels the previous HTTP request when a new value arrives — crucial for search boxes!',
            quiz: {
              question: 'Which RxJS operator would you use for a search box to cancel previous in-flight requests?',
              options: ['mergeMap', 'concatMap', 'switchMap', 'exhaustMap'],
              answer: 2,
              explanation: 'switchMap unsubscribes from the previous inner observable when a new outer value arrives — perfect for cancelling stale HTTP requests.',
            },
          },
          {
            id: 'ng-ngrx',
            name: 'NgRx Store Basics',
            summary: 'NgRx implements Redux in Angular: Actions (what happened), Reducers (how state changes), Selectors (how to read state), Effects (side effects like HTTP). Best for large apps.',
            codeExample: `// Feature state
interface ProductsState { products: Product[]; loading: boolean; }

// Actions
export const loadProducts = createAction('[Products] Load');
export const loadSuccess  = createAction('[Products] Success', props<{ products: Product[] }>());

// Reducer — pure function
const reducer = createReducer(
  { products: [], loading: false },
  on(loadProducts, state => ({ ...state, loading: true })),
  on(loadSuccess,  (state, { products }) => ({ ...state, products, loading: false })),
);

// Effect — side effects
@Injectable()
export class ProductEffects {
  load$ = createEffect(() => this.actions$.pipe(
    ofType(loadProducts),
    switchMap(() => this.api.getProducts().pipe(
      map(products => loadSuccess({ products })),
    )),
  ));
}`,
            funFact: '🏪 NgRx was inspired by Redux (Dan Abramov, 2015) which was itself inspired by The Elm Architecture. The one-way data flow pattern traces back to functional programming!',
          },
        ],
      },
    ],
  },

  // ─── PYTHON ───────────────────────────────────────────────────────────────
  {
    id: 'python',
    name: 'Python',
    icon: '🐍',
    gradient: 'from-yellow-400 to-green-500',
    tagline: 'Simple, readable, powerful',
    category: 'Language',
    subtopics: [
      {
        id: 'py-core',
        name: 'Core Python',
        level: 'Beginner',
        description: 'Pythonic idioms, comprehensions, generators, decorators, and context managers.',
        concepts: [
          {
            id: 'py-comprehensions',
            name: 'Comprehensions & Generators',
            summary: 'List comprehensions create lists efficiently. Generator expressions use lazy evaluation — perfect for large datasets. Dict/Set comprehensions equally powerful.',
            codeExample: `# List comprehension — clean and fast
squares = [x**2 for x in range(10) if x % 2 == 0]

# Dict comprehension — build lookup maps
word_lengths = {word: len(word) for word in words}

# Generator — lazy, memory-efficient (processes one at a time)
def read_large_file(path):
    with open(path) as f:
        for line in f: yield line.strip()  # never loads all into memory

# Generator expression (no square brackets!)
total = sum(x**2 for x in range(1_000_000))  # no list created!`,
            funFact: '🐍 Generators are the secret behind Python\'s itertools module. Functions like chain(), islice(), and product() are all generator-based — making them incredibly memory-efficient!',
            quiz: {
              question: 'What is the key difference between a list comprehension and a generator expression?',
              options: [
                'Syntax only — they behave the same',
                'Generator expressions use lazy evaluation and don\'t create a list in memory',
                'Generator expressions are always faster',
                'List comprehensions support conditions, generators do not',
              ],
              answer: 1,
              explanation: 'Generator expressions produce items one at a time lazily (no list in memory), while list comprehensions eagerly evaluate and store all results.',
            },
          },
          {
            id: 'py-decorators',
            name: 'Decorators & Context Managers',
            summary: 'Decorators wrap functions to add behaviour (like Spring AOP). Context managers (__enter__/__exit__ or contextlib) handle resource cleanup. Both are widely used in frameworks (Flask routes, pytest fixtures).',
            codeExample: `import functools, time

# Decorator — timer
def timer(func):
    @functools.wraps(func)  # preserves func metadata
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(f"{func.__name__} took {time.perf_counter()-start:.3f}s")
        return result
    return wrapper

@timer
def slow_query(): time.sleep(0.1)

# Context manager with contextlib
from contextlib import contextmanager

@contextmanager
def db_transaction(conn):
    try:
        yield conn.cursor()
        conn.commit()
    except Exception:
        conn.rollback()
        raise`,
            funFact: '🎨 Django uses decorators extensively: @login_required, @permission_required, @cache_page. Flask uses @app.route. Decorators are arguably Python\'s most powerful meta-programming tool!',
          },
          {
            id: 'py-dataclasses',
            name: 'Dataclasses & Type Hints',
            summary: '@dataclass auto-generates __init__, __repr__, __eq__. Combined with type hints, Python code becomes self-documenting. pydantic adds runtime validation on top.',
            codeExample: `from dataclasses import dataclass, field
from typing import Optional

@dataclass(frozen=True)  # frozen = immutable (like Java record)
class User:
    id: int
    name: str
    email: str
    roles: list[str] = field(default_factory=list)

# Pydantic — runtime validation + serialisation (used in FastAPI)
from pydantic import BaseModel, EmailStr, validator

class CreateUserRequest(BaseModel):
    name: str
    email: EmailStr
    age: int

    @validator('age')
    def age_must_be_positive(cls, v):
        if v < 0: raise ValueError('Age must be positive')
        return v`,
            funFact: '⚡ Pydantic v2 (2023) was rewritten in Rust, making it 5-50x faster than v1. FastAPI uses Pydantic for all its request/response validation!',
          },
        ],
      },
      {
        id: 'py-async',
        name: 'Async Python & Web Frameworks',
        level: 'Intermediate',
        description: 'asyncio, aiohttp, FastAPI, Django REST Framework, and Celery for background tasks.',
        concepts: [
          {
            id: 'py-asyncio',
            name: 'asyncio & async/await',
            summary: 'Python\'s asyncio is single-threaded concurrent I/O. async def creates coroutines. await yields control. Use asyncio.gather() for parallel I/O; TaskGroup in Python 3.11+ for structured concurrency.',
            codeExample: `import asyncio, aiohttp

async def fetch(session, url):
    async with session.get(url) as resp:
        return await resp.json()

async def fetch_all(urls):
    async with aiohttp.ClientSession() as session:
        # Run all fetches concurrently (I/O bound)
        results = await asyncio.gather(
            *[fetch(session, url) for url in urls]
        )
    return results

# Python 3.11+ TaskGroup — structured concurrency
async def process():
    async with asyncio.TaskGroup() as tg:
        user_task  = tg.create_task(get_user(1))
        order_task = tg.create_task(get_orders(1))
    print(user_task.result(), order_task.result())`,
            funFact: '🔄 Python\'s asyncio uses an event loop similar to Node.js. But unlike Node.js, Python has the GIL — asyncio works around it for I/O-bound code but not CPU-bound tasks (use multiprocessing for those)!',
            quiz: {
              question: 'When should you use asyncio.gather() vs asyncio.run() in Python?',
              options: [
                'They are interchangeable',
                'gather() runs multiple coroutines concurrently; run() starts the event loop for a single top-level coroutine',
                'run() is for async functions, gather() for sync functions',
                'gather() is faster for CPU-bound tasks',
              ],
              answer: 1,
              explanation: 'asyncio.run() starts the event loop and runs one coroutine. asyncio.gather() schedules multiple coroutines to run concurrently within the same event loop.',
            },
          },
          {
            id: 'py-fastapi',
            name: 'FastAPI',
            summary: 'FastAPI is Python\'s highest-performance web framework. It uses type hints for auto-validation (Pydantic), auto-generates OpenAPI docs, and supports async natively.',
            codeExample: `from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel

app = FastAPI()

class OrderRequest(BaseModel):
    product_id: int
    quantity: int

# Auto-validates request body, generates Swagger docs
@app.post("/orders", status_code=201)
async def create_order(
    req: OrderRequest,           # auto-validated via Pydantic
    db: Session = Depends(get_db) # dependency injection
) -> OrderResponse:
    if req.quantity <= 0:
        raise HTTPException(status_code=422, detail="Quantity must be positive")
    order = await order_service.create(req, db)
    return OrderResponse.from_orm(order)

# Visit /docs for auto-generated Swagger UI!`,
            funFact: '📚 FastAPI is consistently in the top 3 fastest Python web frameworks in benchmarks. Its auto-generated Swagger/OpenAPI docs at /docs is loved by API consumers worldwide!',
          },
        ],
      },
    ],
  },

  // ─── AWS ──────────────────────────────────────────────────────────────────
  {
    id: 'aws',
    name: 'AWS',
    icon: '☁️',
    gradient: 'from-orange-400 to-yellow-500',
    tagline: 'The leading cloud platform',
    category: 'Cloud',
    subtopics: [
      {
        id: 'aws-compute',
        name: 'Compute',
        level: 'Beginner',
        description: 'EC2, Lambda, ECS/Fargate, EKS, Auto Scaling, and choosing the right compute.',
        concepts: [
          {
            id: 'aws-ec2',
            name: 'EC2 & Instance Types',
            summary: 'EC2 virtual machines — choose instance family: t3 (burstable), m6i (general), c6i (compute), r6i (memory), p4 (GPU). Use Spot for 90% cost saving on interruptible workloads.',
            codeExample: `# Terraform — EC2 instance
resource "aws_instance" "api" {
  ami           = "ami-0c55b159cbfafe1f0"  # Amazon Linux 2023
  instance_type = "t3.medium"

  vpc_security_group_ids = [aws_security_group.api.id]
  iam_instance_profile   = aws_iam_instance_profile.api.name

  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    amazon-linux-extras install java-openjdk17 -y
    systemctl enable --now myapp
  EOF

  tags = { Name = "api-server", Env = "prod" }
}`,
            funFact: '💰 AWS Spot Instances are excess EC2 capacity sold at up to 90% off. They can be interrupted with 2 minutes notice — perfect for batch jobs, CI/CD, and ML training!',
            quiz: {
              question: 'Which EC2 instance family is best for memory-intensive databases like Redis?',
              options: ['c6i (Compute Optimised)', 't3 (Burstable)', 'r6i (Memory Optimised)', 'p4 (GPU)'],
              answer: 2,
              explanation: 'r (memory-optimised) instances have high RAM-to-CPU ratios, ideal for in-memory databases, caches, and analytics engines.',
            },
          },
          {
            id: 'aws-lambda',
            name: 'AWS Lambda & Serverless',
            summary: 'Lambda runs code without managing servers. Billed per 100ms of execution. 15min max timeout. 10GB memory. Triggers: API Gateway, SQS, S3 events, EventBridge. Cold start is the main challenge.',
            codeExample: `// Java Lambda handler
public class OrderHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

  // SnapStart: pre-warm Lambda by snapshotting JVM state
  @Override
  public APIGatewayProxyResponseEvent handleRequest(
      APIGatewayProxyRequestEvent event, Context ctx) {

    CreateOrderRequest req = parseBody(event.getBody());
    Order order = orderService.create(req);

    return new APIGatewayProxyResponseEvent()
        .withStatusCode(201)
        .withBody(toJson(order));
  }
}`,
            funFact: '🥶 Lambda cold starts for Java can be 2-10 seconds. AWS SnapStart (2022) solves this for Java by snapshotting the initialised JVM, reducing cold starts to ~100ms!',
          },
          {
            id: 'aws-ecs',
            name: 'ECS Fargate (Serverless Containers)',
            summary: 'ECS Fargate runs Docker containers without managing EC2. Define Task Definitions with CPU/memory; Services manage desired count and rolling deployments. Great middle ground between Lambda and EKS.',
            codeExample: `# Docker image → ECR → ECS Service
resource "aws_ecs_service" "api" {
  name            = "order-api"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.api.arn
  desired_count   = 2
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.private_subnets
    security_groups  = [aws_security_group.api.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.api.arn
    container_name   = "order-api"
    container_port   = 8080
  }
}`,
            funFact: '🐳 ECS Fargate bills per vCPU-second and GB-second of memory — you pay exactly for what your containers use. For bursty workloads, it\'s often cheaper than always-on EC2!',
          },
        ],
      },
      {
        id: 'aws-storage-db',
        name: 'Storage & Databases',
        level: 'Beginner',
        description: 'S3 (object), EBS (block), RDS, Aurora, DynamoDB, ElastiCache, and when to use each.',
        concepts: [
          {
            id: 'aws-s3',
            name: 'S3 — Object Storage',
            summary: 'S3 stores objects (files). Storage classes: Standard (hot), Infrequent Access, Glacier (archive). Key features: versioning, lifecycle policies, presigned URLs, event triggers, S3 Select.',
            codeExample: `// Java AWS SDK v2 — S3 operations
S3Client s3 = S3Client.builder().region(Region.EU_WEST_1).build();

// Upload
s3.putObject(PutObjectRequest.builder()
    .bucket("my-app-uploads")
    .key("invoices/2024/invoice-001.pdf")
    .serverSideEncryption(ServerSideEncryption.AES256)
    .build(), RequestBody.fromFile(filePath));

// Generate presigned URL (user uploads directly to S3 — bypasses your server)
PresignedPutObjectRequest presigned = presigner.presignPutObject(r ->
    r.putObjectRequest(p -> p.bucket("uploads").key("file.pdf"))
     .signatureDuration(Duration.ofMinutes(15)));`,
            funFact: '📦 S3 stores over 100 trillion objects and handles millions of requests per second. The "S3 Standard" SLA is 99.99% availability — that\'s only ~52 minutes of downtime per year!',
            quiz: {
              question: 'What is a Pre-signed URL in S3 used for?',
              options: [
                'Granting permanent public access to a bucket',
                'Allowing time-limited direct uploads/downloads without exposing credentials',
                'Encrypting objects at rest',
                'Enabling server-side replication',
              ],
              answer: 1,
              explanation: 'Pre-signed URLs embed temporary, time-limited credentials, allowing direct client ↔ S3 transfers (bypassing your server) without permanent public access.',
            },
          },
          {
            id: 'aws-dynamodb',
            name: 'DynamoDB',
            summary: 'DynamoDB is AWS\'s managed NoSQL key-value and document DB. Mandatory: design your partition key carefully to avoid hot partitions. GSIs enable additional access patterns. Supports single-table design.',
            codeExample: `// DynamoDB single-table design (NoSQL best practice)
// TABLE: OrdersTable
// PK: USER#123       SK: ORDER#2024-01-15#456    → user's order
// PK: ORDER#456      SK: ITEM#001                → order item
// GSI1PK: STATUS#PENDING  GSI1SK: 2024-01-15    → orders by status

// Enhanced client (AWS SDK v2)
@DynamoDbTable(tableName = "OrdersTable")
public record Order(
    @DynamoDbPartitionKey String pk,
    @DynamoDbSortKey      String sk,
    String customerId,
    String status,
    BigDecimal total
) {}`,
            funFact: '🚀 DynamoDB consistently delivers single-digit millisecond latency at any scale. Amazon Prime Day processes over 45 million requests per second through DynamoDB!',
          },
          {
            id: 'aws-rds-aurora',
            name: 'RDS & Aurora',
            summary: 'RDS manages PostgreSQL/MySQL. Aurora is AWS\'s cloud-native relational DB — 5x faster than MySQL, 3x PostgreSQL, auto-scales storage, and has a serverless option (Aurora Serverless v2).',
            codeExample: `# Aurora PostgreSQL Terraform
resource "aws_rds_cluster" "main" {
  cluster_identifier      = "prod-aurora"
  engine                  = "aurora-postgresql"
  engine_version          = "15.3"
  database_name           = "appdb"
  master_username         = "app_admin"
  manage_master_user_password = true   # Secrets Manager auto-rotation

  serverlessv2_scaling_configuration {
    min_capacity = 0.5  # 0.5 ACU minimum (near-zero cost when idle)
    max_capacity = 16   # scales up to 16 ACU under load
  }
  deletion_protection = true
}`,
            funFact: '🔄 Aurora stores 6 copies of your data across 3 Availability Zones, yet thanks to its log-based architecture, it replicates with 1/6th the network I/O of traditional MySQL replication!',
          },
        ],
      },
      {
        id: 'aws-networking',
        name: 'Networking & Security',
        level: 'Intermediate',
        description: 'VPC, subnets, security groups, IAM, CloudFront, Route53, and API Gateway.',
        concepts: [
          {
            id: 'aws-vpc',
            name: 'VPC & Networking',
            summary: 'VPC = isolated network. Public subnets (internet-accessible) for load balancers. Private subnets for app/DB. NAT Gateway for private instances to reach the internet. Security Groups = stateful firewall.',
            codeExample: `# VPC structure (best practice)
VPC (10.0.0.0/16)
├── Public Subnet  AZ-a 10.0.1.0/24 ← ALB, NAT Gateway
├── Public Subnet  AZ-b 10.0.2.0/24
├── Private Subnet AZ-a 10.0.10.0/24 ← ECS / EC2 (no direct internet)
├── Private Subnet AZ-b 10.0.11.0/24
└── DB Subnet      AZ-a 10.0.20.0/24 ← RDS (no internet at all)

# Security Group — stateful (return traffic allowed automatically)
resource "aws_security_group" "api" {
  ingress { from_port=8080; to_port=8080; protocol="tcp"; cidr_blocks=[aws_vpc.main.cidr_block] }
  egress  { from_port=0; to_port=0; protocol="-1"; cidr_blocks=["0.0.0.0/0"] }
}`,
            funFact: '🔒 AWS recommends the "least privilege" principle for security groups — only open the minimum ports between services. Many breaches happen due to overly permissive 0.0.0.0/0 ingress rules!',
            quiz: {
              question: 'Where should you place an Application Load Balancer (ALB) in your VPC?',
              options: [
                'Private subnet — for security',
                'DB subnet — close to the application',
                'Public subnet — it needs to receive internet traffic',
                'Any subnet — it doesn\'t matter',
              ],
              answer: 2,
              explanation: 'ALBs must be in public subnets to receive traffic from the internet. Your EC2/ECS instances stay in private subnets — the ALB proxies requests to them.',
            },
          },
          {
            id: 'aws-iam',
            name: 'IAM — Identity & Access Management',
            summary: 'IAM controls who (identity) can do what (action) on which resource. Key: use roles (not users) for services. Apply least-privilege policies. Enable MFA. Use IAM Conditions for fine-grained control.',
            codeExample: `# IAM role for ECS Task (principle of least privilege)
resource "aws_iam_role_policy" "app" {
  role = aws_iam_role.ecs_task.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = ["s3:GetObject", "s3:PutObject"],
        Resource = "\${aws_s3_bucket.uploads.arn}/*"
        # ❌ Never: "Resource": "*" — grants access to all S3 buckets!
      },
      {
        Effect   = "Allow",
        Action   = ["secretsmanager:GetSecretValue"],
        Resource = aws_secretsmanager_secret.db_cred.arn
      }
    ]
  })
}`,
            funFact: '🛡️ The most common AWS security mistake is using root credentials or creating overly permissive IAM policies. AWS recommends enabling "Access Analyzer" to automatically detect unused/excessive permissions!',
          },
        ],
      },
    ],
  },

  // ─── GCP ──────────────────────────────────────────────────────────────────
  {
    id: 'gcp',
    name: 'GCP',
    icon: '🌐',
    gradient: 'from-blue-500 to-indigo-600',
    tagline: 'Google\'s cloud, built for data & containers',
    category: 'Cloud',
    subtopics: [
      {
        id: 'gcp-compute',
        name: 'Compute & Containers',
        level: 'Beginner',
        description: 'Compute Engine, GKE, Cloud Run, and App Engine.',
        concepts: [
          {
            id: 'gcp-cloudrun',
            name: 'Cloud Run — Serverless Containers',
            summary: 'Cloud Run deploys any container and scales to zero automatically. No cluster management. Billed per request. Perfect for microservices. Integrates with Cloud Build for CI/CD.',
            codeExample: `# Deploy a container to Cloud Run
gcloud run deploy order-service \\
  --image gcr.io/my-project/order-service:latest \\
  --region europe-west1 \\
  --platform managed \\
  --allow-unauthenticated \\
  --min-instances 1 \\          # keep warm — avoid cold starts
  --max-instances 100 \\
  --memory 512Mi \\
  --cpu 1 \\
  --set-env-vars DB_URL=$$DB_URL

# Cloud Run scales to zero when idle — pay $0 at night!`,
            funFact: '🚀 Cloud Run is based on the open-source Knative project. It can scale from 0 to 1000 instances in seconds and back to 0 — you pay only for the CPU time of actual requests!',
            quiz: {
              question: 'What is the key advantage of Cloud Run over GKE (Kubernetes)?',
              options: [
                'Supports larger containers',
                'No cluster management, auto-scales to zero, pay per request',
                'Better GPU support',
                'Supports stateful applications better',
              ],
              answer: 1,
              explanation: 'Cloud Run abstracts away all infrastructure. GKE gives more control but requires managing the cluster. Cloud Run is ideal for stateless microservices.',
            },
          },
          {
            id: 'gcp-gke',
            name: 'GKE — Google Kubernetes Engine',
            summary: 'GKE is the managed Kubernetes service. Autopilot mode eliminates node management entirely. Integrates with Google\'s Anthos for multi-cloud and with Workload Identity for secure GCP access.',
            codeExample: `# GKE Autopilot — Google manages nodes, you manage pods only
gcloud container clusters create-auto prod-cluster \\
  --region europe-west1

# Workload Identity — pods access GCP services without key files
kubectl annotate serviceaccount my-sa \\
  iam.gke.io/gcp-service-account=my-sa@project.iam.gserviceaccount.com

# Horizontal Pod Autoscaler
kubectl autoscale deployment api --min=2 --max=20 --cpu-percent=70`,
            funFact: '☸️ GKE was the world\'s first managed Kubernetes service (2014). Kubernetes itself was created by Google, based on their internal Borg system which has run billions of containers for 15+ years!',
          },
        ],
      },
      {
        id: 'gcp-data',
        name: 'Data & Analytics',
        level: 'Intermediate',
        description: 'BigQuery, Pub/Sub, Dataflow, Cloud Spanner, and Firestore.',
        concepts: [
          {
            id: 'gcp-bigquery',
            name: 'BigQuery — Serverless Data Warehouse',
            summary: 'BigQuery runs SQL analytics at petabyte scale with no infrastructure. Columnar storage, tree-based execution engine. Use partitioning + clustering for cost control. Standard SQL + ML built-in.',
            codeExample: `-- BigQuery — analytics on terabytes in seconds
SELECT
  DATE_TRUNC(order_date, MONTH)  AS month,
  product_category,
  SUM(revenue)                   AS total_revenue,
  COUNT(DISTINCT customer_id)    AS unique_customers,
  AVG(order_value) OVER (
    PARTITION BY product_category
    ORDER BY DATE_TRUNC(order_date, MONTH)
    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
  ) AS rolling_3m_avg
FROM \`project.dataset.orders\`
WHERE order_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 YEAR)
GROUP BY 1, 2
ORDER BY 1, total_revenue DESC;`,
            funFact: '⚡ BigQuery processes queries using Dremel, Google\'s internal analytics engine. It can scan 1 TB of data in under 5 seconds by parallelizing across thousands of servers!',
          },
          {
            id: 'gcp-pubsub',
            name: 'Pub/Sub — Managed Messaging',
            summary: 'Pub/Sub is GCP\'s managed message broker. Publishers send to topics; subscribers pull or push. At-least-once delivery. Integrates with Dataflow for stream processing, Cloud Run for push subscriptions.',
            codeExample: `// Java — Pub/Sub publish
Publisher publisher = Publisher.newBuilder(
    TopicName.of("my-project", "orders")).build();

PubsubMessage msg = PubsubMessage.newBuilder()
    .setData(ByteString.copyFromUtf8(orderJson))
    .putAttributes("type", "ORDER_PLACED")
    .build();

ApiFuture<String> future = publisher.publish(msg);
String messageId = future.get();

// Push subscription → Cloud Run URL
// When message arrives, GCP calls your endpoint automatically`,
            funFact: '📡 Google Pub/Sub handles over 500 million messages per second globally. It was originally built to power Google Search\'s crawl queue, one of the largest messaging systems ever built!',
          },
        ],
      },
    ],
  },

  // ─── TERRAFORM ────────────────────────────────────────────────────────────
  {
    id: 'terraform',
    name: 'Terraform',
    icon: '🏗️',
    gradient: 'from-purple-500 to-indigo-600',
    tagline: 'Infrastructure as Code',
    category: 'DevOps',
    subtopics: [
      {
        id: 'tf-basics',
        name: 'HCL Fundamentals',
        level: 'Beginner',
        description: 'Resources, variables, outputs, data sources, locals, and the plan/apply workflow.',
        concepts: [
          {
            id: 'tf-core',
            name: 'Core HCL Concepts',
            summary: 'Resources (what to create), Variables (inputs), Outputs (what to export), Data sources (read existing infra), Locals (computed values). Always run plan before apply.',
            codeExample: `# Variable with validation
variable "environment" {
  type        = string
  description = "Deployment environment"
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

# Local — computed value
locals {
  name_prefix = "\${var.app_name}-\${var.environment}"
  common_tags = { Environment = var.environment, ManagedBy = "Terraform" }
}

# Resource using locals and variables
resource "aws_s3_bucket" "app" {
  bucket = "\${local.name_prefix}-assets"
  tags   = local.common_tags
}

# Output — expose values for other modules
output "bucket_arn" { value = aws_s3_bucket.app.arn }`,
            funFact: '📜 HashiCorp created Terraform in 2014. By 2023 it was so dominant that HashiCorp changed its license to BSL (non-open-source), which prompted the community to fork it as OpenTofu!',
            quiz: {
              question: 'What does terraform plan do?',
              options: [
                'Creates all resources immediately',
                'Shows a preview of changes without modifying real infrastructure',
                'Validates HCL syntax only',
                'Pushes state to remote backend',
              ],
              answer: 1,
              explanation: 'terraform plan compares your desired state (HCL) with the current state and shows exactly what will be created, changed, or destroyed — without making any changes.',
            },
          },
          {
            id: 'tf-modules',
            name: 'Modules & DRY Infrastructure',
            summary: 'Modules are reusable Terraform configurations. Create private modules in your repo; use public registry modules (terraform-aws-modules). Each environment calls the module with different variables.',
            codeExample: `# modules/api-service/main.tf — reusable module
resource "aws_ecs_service" "this" {
  name    = var.service_name
  cluster = var.cluster_arn
  # ...
}

# Root module — calling the module for each environment
module "api_prod" {
  source       = "./modules/api-service"
  service_name = "order-api-prod"
  cluster_arn  = module.ecs_cluster.arn
  desired_count = 4
  cpu           = 512
  memory        = 1024
}

module "api_staging" {
  source        = "./modules/api-service"
  service_name  = "order-api-staging"
  cluster_arn   = module.ecs_cluster_staging.arn
  desired_count = 1  # fewer instances in staging
}`,
            funFact: '🔧 The Terraform Registry hosts over 11,000 public modules. terraform-aws-modules/vpc/aws alone has been downloaded over 200 million times — probably the most reused infrastructure code on Earth!',
          },
          {
            id: 'tf-state',
            name: 'Remote State & Backends',
            summary: 'State tracks what Terraform has created. Always use remote state (S3 + DynamoDB for AWS) in teams to prevent conflicts. Never commit .tfstate files to Git.',
            codeExample: `# Remote state backend — S3 + DynamoDB state lock
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/services/api.tfstate"
    region         = "eu-west-1"
    encrypt        = true
    dynamodb_table = "terraform-lock" # prevents concurrent applies
  }
}

# Read another module's state (cross-module reference)
data "terraform_remote_state" "network" {
  backend = "s3"
  config = {
    bucket = "my-terraform-state"
    key    = "prod/network/vpc.tfstate"
    region = "eu-west-1"
  }
}

resource "aws_instance" "api" {
  subnet_id = data.terraform_remote_state.network.outputs.private_subnet_id
}`,
            funFact: '🔒 The DynamoDB table for state locking only needs one item at a time — it\'s used as a mutex. The item is created on terraform apply and deleted when done, preventing two people from applying simultaneously!',
          },
        ],
      },
    ],
  },

  // ─── DOCKER ───────────────────────────────────────────────────────────────
  {
    id: 'docker',
    name: 'Docker',
    icon: '🐳',
    gradient: 'from-sky-500 to-blue-600',
    tagline: 'Build, ship, run anywhere',
    category: 'DevOps',
    subtopics: [
      {
        id: 'docker-fundamentals',
        name: 'Images & Containers',
        level: 'Beginner',
        description: 'Dockerfile best practices, layer caching, multi-stage builds, and Docker Compose.',
        concepts: [
          {
            id: 'docker-dockerfile',
            name: 'Dockerfile Best Practices',
            summary: 'Layer caching: put rarely-changing layers first (OS, dependencies) and frequently-changing last (code). Use .dockerignore. Run as non-root user. Use multi-stage builds to minimize image size.',
            codeExample: `# Multi-stage build for Java (reduce final image from 600MB → 120MB)
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app
COPY pom.xml .
COPY mvnw ./mvnw
COPY .mvn .mvn
RUN ./mvnw dependency:go-offline  # cache deps layer

COPY src ./src
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:21-jre AS runtime  # smaller JRE image
WORKDIR /app
RUN useradd -r -s /bin/false appuser     # non-root user
USER appuser
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]`,
            funFact: '📦 A Docker image is a stack of read-only layers. When you run a container, Docker adds a thin writable layer on top. All layers below are shared across containers — amazing storage efficiency!',
            quiz: {
              question: 'Why should you copy dependency files before copying source code in a Dockerfile?',
              options: [
                'It\'s a security requirement',
                'Docker caches each layer — dependencies rarely change, so they stay cached even when source changes',
                'It reduces the final image size',
                'Source files must come last alphabetically',
              ],
              answer: 1,
              explanation: 'Docker invalidates layer cache from the changed layer downward. Copying pom.xml first means the expensive dependency download layer stays cached on source-only changes.',
            },
          },
          {
            id: 'docker-compose',
            name: 'Docker Compose for Local Dev',
            summary: 'Compose defines multi-container apps (app + db + redis + kafka) in one YAML file. docker compose up starts everything. Use healthchecks and depends_on conditions.',
            codeExample: `# docker-compose.yml
services:
  api:
    build: ./backend
    ports: ["8080:8080"]
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/appdb
      SPRING_REDIS_HOST: redis
    depends_on:
      postgres: { condition: service_healthy }
      redis:    { condition: service_started }

  postgres:
    image: postgres:15-alpine
    environment: { POSTGRES_DB: appdb, POSTGRES_PASSWORD: secret }
    volumes: [postgres_data:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "postgres"]
      interval: 10s

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

volumes:
  postgres_data:`,
            funFact: '🎵 Docker Compose v2 (Go rewrite) is 2-4x faster than v1 (Python). It\'s now bundled with Docker Desktop and replaces the standalone docker-compose command with docker compose!',
          },
        ],
      },
    ],
  },

  // ─── KUBERNETES ───────────────────────────────────────────────────────────
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    icon: '⚙️',
    gradient: 'from-blue-600 to-purple-600',
    tagline: 'Container orchestration at scale',
    category: 'DevOps',
    subtopics: [
      {
        id: 'k8s-core',
        name: 'Core Concepts',
        level: 'Beginner',
        description: 'Pods, Deployments, Services, Namespaces, ConfigMaps, Secrets, and kubectl.',
        concepts: [
          {
            id: 'k8s-deployment',
            name: 'Pods, Deployments & Services',
            summary: 'Pod = smallest deployable unit (1+ containers). Deployment manages pod lifecycle (replicas, rolling updates). Service gives stable DNS/IP to pods (ClusterIP, NodePort, LoadBalancer).',
            codeExample: `# Deployment — manages replicas and rolling updates
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-api
spec:
  replicas: 3
  selector: { matchLabels: { app: order-api } }
  strategy:
    type: RollingUpdate
    rollingUpdate: { maxSurge: 1, maxUnavailable: 0 } # zero-downtime
  template:
    metadata: { labels: { app: order-api } }
    spec:
      containers:
      - name: order-api
        image: myregistry/order-api:v2.1.0  # pinned tag, never :latest!
        ports: [{ containerPort: 8080 }]
        resources:
          requests: { cpu: "250m", memory: "512Mi" } # scheduler uses these
          limits:   { cpu: "500m", memory: "1Gi" }   # OOM kill threshold`,
            funFact: '☸️ Kubernetes means "helmsman" in Greek (the person who steers a ship). The logo\'s 7-spoked wheel was chosen because the original clusters had 7 nodes — and 7 is Borg\'s lucky number at Google!',
            quiz: {
              question: 'What is the difference between resource requests and limits in Kubernetes?',
              options: [
                'They are the same thing',
                'Requests are used by the scheduler for placement; limits are the maximum the container can use before being throttled/killed',
                'Requests are maximum, limits are minimum',
                'Limits apply to CPU only, not memory',
              ],
              answer: 1,
              explanation: 'Requests tell the scheduler how much to reserve for pod placement. Limits are enforced at runtime — CPU is throttled, memory causes OOMKill if exceeded.',
            },
          },
          {
            id: 'k8s-hpa',
            name: 'HPA, ConfigMaps & Secrets',
            summary: 'HPA (Horizontal Pod Autoscaler) scales pods based on CPU/memory or custom metrics. ConfigMaps hold non-secret config. Secrets hold sensitive data (base64 encoded — use Sealed Secrets or Vault in prod).',
            codeExample: `# HPA — auto-scale based on CPU
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
spec:
  scaleTargetRef: { name: order-api, kind: Deployment }
  minReplicas: 2
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target: { type: Utilization, averageUtilization: 70 }

---
# ConfigMap — inject config without rebuilding image
apiVersion: v1
kind: ConfigMap
metadata: { name: order-api-config }
data:
  LOG_LEVEL: "INFO"
  FEATURE_NEW_CHECKOUT: "true"`,
            funFact: '🔐 Kubernetes Secrets are only base64-encoded, NOT encrypted by default! Use Sealed Secrets, External Secrets Operator, or HashiCorp Vault to encrypt them. Many K8s breaches come from exposed Secrets!',
          },
        ],
      },
    ],
  },

  // ─── TYPESCRIPT ───────────────────────────────────────────────────────────
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: '📘',
    gradient: 'from-blue-400 to-indigo-500',
    tagline: 'JavaScript with superpowers',
    category: 'Language',
    subtopics: [
      {
        id: 'ts-types',
        name: 'Types, Interfaces & Generics',
        level: 'Beginner',
        description: 'Type system, interfaces vs types, union/intersection, generics, utility types.',
        concepts: [
          {
            id: 'ts-fundamentals',
            name: 'Type System Fundamentals',
            summary: 'TypeScript is structurally typed. interface vs type: interfaces are extendable (use for object shapes); type aliases support unions/intersections/mapped types. Prefer unknown over any.',
            codeExample: `// Structural typing — shape matters, not name
interface User { id: number; name: string; }
interface Admin { id: number; name: string; role: string; }

function greet(u: User) { return \`Hello \${u.name}\`; }
const admin: Admin = { id: 1, name: "Bob", role: "admin" };
greet(admin); // ✅ Admin satisfies User shape

// Union & Intersection types
type ApiResponse<T> = { data: T; status: number } | { error: string; status: number };
type AdminUser = User & { permissions: string[] }; // must have ALL fields

// Discriminated union — great for state machines
type LoadState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Product[] }
  | { status: 'error'; message: string };`,
            funFact: '📊 TypeScript is now the 5th most-used programming language worldwide (Stack Overflow Survey 2024). Over 90% of large React/Angular projects use TypeScript!',
            quiz: {
              question: 'What is the difference between interface and type in TypeScript?',
              options: [
                'They are identical',
                'interface can be extended/merged; type supports unions, intersections, and mapped types',
                'type is for primitives; interface for objects',
                'interface compiles to JavaScript, type does not',
              ],
              answer: 1,
              explanation: 'Interfaces support declaration merging and are extendable with extends. Type aliases support union (|), intersection (&), mapped types, and conditional types.',
            },
          },
          {
            id: 'ts-generics',
            name: 'Generics & Utility Types',
            summary: 'Generics write type-safe reusable code. Built-in utility types: Partial<T>, Required<T>, Readonly<T>, Pick<T,K>, Omit<T,K>, Record<K,V>, ReturnType<F>.',
            codeExample: `// Generic repository pattern
interface Repository<T, ID> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: ID): Promise<void>;
}

// Utility types
interface User { id: number; name: string; email: string; password: string; }
type CreateUserDto  = Omit<User, 'id'>;            // omit auto-generated fields
type UserSummary    = Pick<User, 'id' | 'name'>;   // public subset
type PartialUpdate  = Partial<Omit<User, 'id'>>;   // all optional except id
type ReadonlyUser   = Readonly<User>;               // immutable view

// Conditional type
type NonNullable<T> = T extends null | undefined ? never : T;
type ApiResult = NonNullable<string | null>; // → string`,
            funFact: '🧰 TypeScript\'s built-in utility types (Partial, Omit, Pick etc.) are all implemented using mapped and conditional types internally — they\'re not special compiler magic, just clever TypeScript!',
          },
        ],
      },
    ],
  },

  // ─── SQL & DATABASES ──────────────────────────────────────────────────────
  {
    id: 'sql-databases',
    name: 'SQL & Databases',
    icon: '🗄️',
    gradient: 'from-slate-500 to-gray-700',
    tagline: 'The foundation of data persistence',
    category: 'Database',
    subtopics: [
      {
        id: 'sql-fundamentals',
        name: 'SQL Fundamentals',
        level: 'Beginner',
        description: 'Joins, GROUP BY, window functions, CTEs, subqueries, and query optimization.',
        concepts: [
          {
            id: 'sql-joins',
            name: 'Joins & Aggregations',
            summary: 'INNER JOIN (matching only), LEFT JOIN (all left + matching right), FULL OUTER JOIN (all rows both sides). GROUP BY + aggregate functions. Always understand NULL behaviour.',
            codeExample: `-- Sales report: customers with orders and totals
SELECT
  c.name,
  COUNT(o.id)         AS order_count,
  SUM(o.total)        AS lifetime_value,
  MAX(o.created_at)   AS last_order_date
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id  -- includes customers with 0 orders
WHERE c.created_at >= '2024-01-01'
GROUP BY c.id, c.name
HAVING COUNT(o.id) > 0          -- after GROUP BY filter
ORDER BY lifetime_value DESC
LIMIT 100;`,
            funFact: '🔢 NULL is one of SQL\'s biggest gotchas. NULL = NULL is FALSE in SQL! Use IS NULL and IS NOT NULL. COUNT(*) counts all rows; COUNT(col) skips NULLs. Many bugs come from forgetting this!',
            quiz: {
              question: 'What is the difference between WHERE and HAVING in SQL?',
              options: [
                'WHERE is faster; HAVING is more powerful',
                'WHERE filters individual rows before grouping; HAVING filters groups after GROUP BY',
                'WHERE is for numbers; HAVING is for strings',
                'They are interchangeable',
              ],
              answer: 1,
              explanation: 'WHERE is applied before aggregation (cannot use aggregate functions). HAVING is applied after GROUP BY and can filter on aggregate values like COUNT(*) > 5.',
            },
          },
          {
            id: 'sql-window',
            name: 'Window Functions & CTEs',
            summary: 'Window functions (ROW_NUMBER, RANK, LAG, LEAD, SUM OVER) perform calculations across related rows without collapsing them. CTEs make complex queries readable and reusable.',
            codeExample: `-- Window functions — ranking + running totals
WITH monthly_revenue AS (
  SELECT
    DATE_TRUNC('month', created_at) AS month,
    SUM(total) AS revenue
  FROM orders
  GROUP BY 1
)
SELECT
  month,
  revenue,
  SUM(revenue) OVER (ORDER BY month) AS cumulative_revenue,
  revenue - LAG(revenue) OVER (ORDER BY month) AS mom_change,
  RANK() OVER (ORDER BY revenue DESC) AS revenue_rank
FROM monthly_revenue
ORDER BY month;`,
            funFact: '🏆 Window functions were added to SQL:2003 standard but many databases only properly supported them by 2010+. They can replace many complex self-joins and subqueries with cleaner, faster code!',
          },
          {
            id: 'sql-indexes',
            name: 'Indexes & Query Optimization',
            summary: 'B-tree index for range queries, Hash for equality, GIN/GiST for JSON/fulltext. Use EXPLAIN ANALYZE to see query plans. Avoid N+1 patterns. Composite indexes: column order matters (most selective first).',
            codeExample: `-- EXPLAIN ANALYZE — see what PostgreSQL actually does
EXPLAIN ANALYZE
SELECT * FROM orders WHERE customer_id = 123 AND status = 'PENDING';

-- Output shows: Seq Scan (bad for large tables) vs Index Scan (good)

-- Composite index for this query
CREATE INDEX idx_orders_customer_status
    ON orders (customer_id, status)
    INCLUDE (created_at, total);      -- covering index — avoids table lookup

-- Partial index — only index pending orders (small, fast)
CREATE INDEX idx_orders_pending
    ON orders (created_at)
    WHERE status = 'PENDING';`,
            funFact: '⚡ A covering index (INCLUDE clause in PostgreSQL) lets PostgreSQL answer the entire query from the index without touching the main table. This "index-only scan" can be 10x faster on large tables!',
          },
        ],
      },
      {
        id: 'sql-transactions',
        name: 'Transactions & ACID',
        level: 'Intermediate',
        description: 'ACID properties, isolation levels, deadlocks, and NoSQL vs SQL tradeoffs.',
        concepts: [
          {
            id: 'sql-acid',
            name: 'ACID & Isolation Levels',
            summary: 'ACID: Atomicity (all or nothing), Consistency (rules preserved), Isolation (concurrent TX appear serial), Durability (committed data survives crash). Isolation levels trade isolation for performance.',
            codeExample: `-- Isolation levels (PostgreSQL)
-- READ UNCOMMITTED  — dirty reads          (avoid)
-- READ COMMITTED    — no dirty reads       (PostgreSQL default)
-- REPEATABLE READ   — no phantom reads     (MySQL default)
-- SERIALIZABLE      — full isolation       (slowest, safest)

-- Example: debit account (needs REPEATABLE READ to be safe)
BEGIN;
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;

SELECT balance FROM accounts WHERE id = 1 FOR UPDATE; -- pessimistic lock
UPDATE accounts SET balance = balance - 100 WHERE id = 1 AND balance >= 100;
COMMIT;

-- Optimistic lock (JPA @Version)
@Entity class Account {
  @Version Long version; // auto-increments; concurrent update throws OptimisticLockException
}`,
            funFact: '🔐 PostgreSQL uses MVCC (Multi-Version Concurrency Control) — readers never block writers and writers never block readers. Each transaction sees a consistent snapshot of the DB from its start time!',
            quiz: {
              question: 'What is a dirty read in database transactions?',
              options: [
                'Reading from an encrypted column',
                'Reading data modified by another transaction that has NOT yet committed',
                'Reading the same row twice in one transaction',
                'Reading from a corrupted index',
              ],
              answer: 1,
              explanation: 'A dirty read means you read uncommitted changes from another transaction. If that transaction rolls back, you\'ve processed data that never officially existed.',
            },
          },
        ],
      },
    ],
  },

  // ─── MICROSERVICES ────────────────────────────────────────────────────────
  {
    id: 'microservices',
    name: 'Microservices',
    icon: '🔗',
    gradient: 'from-purple-500 to-pink-600',
    tagline: 'Small services, big resilience',
    category: 'Architecture',
    subtopics: [
      {
        id: 'ms-patterns',
        name: 'Core Patterns',
        level: 'Intermediate',
        description: 'Saga, CQRS, Event Sourcing, Circuit Breaker, API Gateway, and service communication.',
        concepts: [
          {
            id: 'ms-saga',
            name: 'Saga Pattern (Distributed Transactions)',
            summary: 'Saga manages distributed transactions without 2PC. Choreography: services emit events and react. Orchestration: central orchestrator calls each step. Compensating transactions replace rollback.',
            codeExample: `// Choreography Saga — Spring events
@Service class OrderService {
  public Order placeOrder(Cart cart) {
    Order order = orderRepo.save(new Order(cart, PENDING));
    events.publishEvent(new OrderCreatedEvent(order.id(), cart)); // fire
    return order;
  }
  @EventListener void onPaymentSuccess(PaymentSucceededEvent e) {
    orderRepo.updateStatus(e.orderId(), CONFIRMED);
    events.publishEvent(new OrderConfirmedEvent(e.orderId()));
  }
  @EventListener void onPaymentFailed(PaymentFailedEvent e) {
    orderRepo.updateStatus(e.orderId(), CANCELLED); // compensating tx
  }
}`,
            funFact: '📖 The Saga pattern was first described in a 1987 paper by Hector Garcia-Molina and Kenneth Salem who studied long-lived database transactions. It predates microservices by 25 years!',
            quiz: {
              question: 'What replaces ROLLBACK in a Saga pattern?',
              options: [
                'Two-Phase Commit (2PC)',
                'Compensating transactions — explicit undo operations per step',
                'Database savepoints',
                'Idempotency keys',
              ],
              answer: 1,
              explanation: 'Since each step commits immediately, you can\'t roll back. Instead, each step has a compensating transaction (e.g., refund a payment, cancel a reservation) to undo the effect.',
            },
          },
          {
            id: 'ms-circuit-breaker',
            name: 'Circuit Breaker & Resilience',
            summary: 'Circuit Breaker (Resilience4j) prevents cascade failures. States: Closed (normal), Open (failing fast), Half-Open (testing recovery). Combine with Retry (exponential backoff) and Bulkhead.',
            codeExample: `// Spring Boot + Resilience4j
@Service
public class ProductService {

  @CircuitBreaker(name = "product-api", fallbackMethod = "fallbackProducts")
  @Retry(name = "product-api", fallbackMethod = "fallbackProducts") // 3 retries before CB opens
  @TimeLimiter(name = "product-api")                                // timeout guard
  public CompletableFuture<List<Product>> getProducts() {
    return CompletableFuture.supplyAsync(() -> productApiClient.getAll());
  }

  // Fallback — return cached/default data when circuit is open
  public CompletableFuture<List<Product>> fallbackProducts(Exception ex) {
    log.warn("Product API unavailable, using cache: {}", ex.getMessage());
    return CompletableFuture.completedFuture(cacheService.getCachedProducts());
  }
}`,
            funFact: '💡 The Circuit Breaker pattern was popularised by Michael Nygard\'s book "Release It!" (2007). Netflix\'s Hystrix (now Resilience4j) made it mainstream for microservices!',
          },
          {
            id: 'ms-observability',
            name: 'Observability (Logs, Metrics, Traces)',
            summary: 'The three pillars: Structured Logs (correlation ID), Metrics (Prometheus/Micrometer), Distributed Tracing (OpenTelemetry + Jaeger/Zipkin). Correlation IDs link logs across services.',
            codeExample: `# Spring Boot Actuator + Micrometer + OpenTelemetry (application.yml)
management:
  tracing:
    sampling.probability: 1.0  # 100% in dev, ~10% in prod
  metrics:
    export.prometheus.enabled: true

# Structured logging with correlation ID (MDC)
@Component
class TraceFilter extends OncePerRequestFilter {
  protected void doFilterInternal(HttpServletRequest req, ...) {
    String traceId = req.getHeader("X-Trace-Id");
    if (traceId == null) traceId = UUID.randomUUID().toString();
    MDC.put("traceId", traceId);  // appears in all log lines
    // ...
  }
}`,
            funFact: '📊 Google\'s Dapper paper (2010) invented distributed tracing. Every request at Google is traced — they process millions of trace spans per second. OpenTelemetry is the open-source successor!',
          },
        ],
      },
    ],
  },

  // ─── SECURITY ─────────────────────────────────────────────────────────────
  {
    id: 'security',
    name: 'Security',
    icon: '🔐',
    gradient: 'from-red-500 to-orange-500',
    tagline: 'Secure by design, not by afterthought',
    category: 'Architecture',
    subtopics: [
      {
        id: 'sec-auth',
        name: 'Auth: JWT, OAuth2 & Spring Security',
        level: 'Intermediate',
        description: 'JWT structure, OAuth2 flows, Spring Security configuration, and token security.',
        concepts: [
          {
            id: 'sec-jwt',
            name: 'JWT & OAuth2 / OIDC',
            summary: 'JWT: Header.Payload.Signature — stateless but irrevocable unless you maintain a blocklist. OAuth2 authorization_code flow with PKCE for SPAs. OIDC extends OAuth2 with identity (id_token).',
            codeExample: `// JWT claims (decoded payload)
{
  "sub": "user-123",
  "email": "alice@example.com",
  "roles": ["USER", "ADMIN"],
  "iss": "https://auth.myapp.com",

  // Security: always validate these!
  "iat": 1700000000,   // issued at
  "exp": 1700003600,   // expires in 1h — use short expiry + refresh tokens
  "jti": "unique-id"   // JWT ID — add to blocklist on logout
}

// Spring Security JWT resource server
@Configuration @EnableWebSecurity
public class SecurityConfig {
  @Bean SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    return http
        .oauth2ResourceServer(rs -> rs.jwt(Customizer.withDefaults()))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            .requestMatchers("/api/**").authenticated()
            .anyRequest().permitAll())
        .sessionManagement(s -> s.sessionCreationPolicy(STATELESS))
        .build();
  }
}`,
            funFact: '🔑 JWT tokens are NOT encrypted by default — anyone can decode the payload (try jwt.io). They are only SIGNED. Never put sensitive data (passwords, PII) in JWT claims!',
            quiz: {
              question: 'Why should JWT access tokens have a short expiry (e.g., 15 minutes)?',
              options: [
                'To reduce token size',
                'To limit the damage window if a token is stolen — it cannot be revoked without a blocklist',
                'To save database storage',
                'JWTs expire automatically regardless of the exp field',
              ],
              answer: 1,
              explanation: 'Stateless JWTs cannot be invalidated server-side (no state!). Short expiry + refresh tokens limits exposure if stolen. Long-lived access tokens are a significant security risk.',
            },
          },
          {
            id: 'sec-owasp',
            name: 'OWASP Top 10 for APIs',
            summary: 'Key threats: Broken Object-Level Auth (BOLA/IDOR), Broken Function-Level Auth, Injection (SQL, LDAP, Command), Security Misconfiguration, and insufficient rate limiting.',
            codeExample: `// ❌ IDOR (Insecure Direct Object Reference)
@GetMapping("/orders/{id}")
public Order getOrder(@PathVariable Long id) {
  return orderRepo.findById(id).orElseThrow(); // returns ANY user's order!
}

// ✅ Fix — always scope to the authenticated user
@GetMapping("/orders/{id}")
public Order getOrder(@PathVariable Long id,
                      @AuthenticationPrincipal JwtUser user) {
  return orderRepo.findByIdAndCustomerId(id, user.id()) // scoped!
      .orElseThrow(() -> new ResponseStatusException(NOT_FOUND));
}

// ✅ SQL injection prevention (parameterised query via JPA)
// NEVER: "SELECT * FROM users WHERE name = '" + input + "'"
// Spring Data JPA uses prepared statements automatically`,
            funFact: '⚠️ IDOR (Broken Object Level Authorization) has been the #1 API security issue for 6 years running. The fix is simple: always filter by the authenticated user\'s ID, not just the requested object ID!',
          },
        ],
      },
    ],
  },
];
