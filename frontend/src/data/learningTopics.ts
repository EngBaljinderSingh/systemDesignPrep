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
        description: 'Learn to read and write Terraform from scratch. HCL (HashiCorp Configuration Language) looks like JSON but is friendlier. You describe WHAT you want, Terraform figures out HOW to build it — and in what order.',
        concepts: [
          {
            id: 'tf-core',
            name: 'Core HCL Concepts',
            summary: 'Terraform has 5 building blocks. 🧱 Resource = something to create (an S3 bucket, an EC2 server, a database). 📥 Variable = an input like a function parameter — keeps values configurable. 📤 Output = a value you export so other modules or humans can see it (e.g. the new server\'s IP). 🔍 Data source = read-only lookup of something that already exists (you didn\'t create it). 🧮 Local = a computed value you reuse to avoid repeating yourself. The golden rule: always run "terraform plan" to preview changes before "terraform apply" makes them real.',
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
            summary: 'A module is like a function in code — write it once, call it many times with different inputs. Without modules you\'d copy-paste 50 lines for dev, staging, and prod. With a module it\'s 3 function calls. Think of it as a LEGO brick: one ECS service module you snap into dev (1 replica, tiny CPU) and snap into prod (4 replicas, full CPU). The Terraform Registry has thousands of pre-built modules — you don\'t have to write VPC networking from scratch.',
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
            quiz: {
              question: 'What is the main benefit of splitting infrastructure into Terraform modules?',
              options: [
                'Modules run faster than single files',
                'Reusability — write ECS/VPC/RDS config once, call it for every environment with different variables',
                'Modules are the only way to use the Terraform Registry',
                'Modules allow Terraform to skip the plan step',
              ],
              answer: 1,
              explanation: 'Modules eliminate copy-paste. Instead of duplicating 50-line ECS configs for each environment, you define it once as a module and call it with dev/staging/prod variable values.',
            },
          },
          {
            id: 'tf-state',
            name: 'Remote State & Backends',
            summary: 'Terraform keeps a "memory" file (terraform.tfstate) that knows every resource it has ever created. Without it, Terraform has no idea if that EC2 server already exists or needs creating. In a team, two people applying at the same time with local state = disaster (one overwrites the other). Remote state (S3 on AWS, GCS on GCP) gives everyone one shared source of truth. The DynamoDB lock table acts like a "Do Not Disturb" sign — it blocks a second apply while the first is still running.',
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
            quiz: {
              question: 'Why should you NEVER commit .tfstate files to Git?',
              options: [
                'They are too large for Git',
                'They contain resource IDs and sometimes secrets — and cause terrible merge conflicts when two people apply simultaneously',
                'Git does not support binary files',
                'Terraform cannot read state from a git repo',
              ],
              answer: 1,
              explanation: '.tfstate can contain sensitive values (database passwords, generated ARNs). It also creates unresolvable merge conflicts. Always store state in a remote backend (S3/GCS) with locking enabled.',
            },
          },
        ],
      },

      // ─── Terraform for AWS ────────────────────────────────────────────────
      {
        id: 'tf-aws',
        name: 'Terraform for AWS',
        level: 'Beginner',
        description: 'Build real AWS infrastructure from zero — no clicking the AWS console! Each concept below walks through a complete example with plain-English comments on every line. By the end you\'ll have a VPC, database, running containers, and a fully automated CI/CD pipeline.',
        concepts: [
          {
            id: 'tf-aws-vpc-ec2',
            name: 'Create a VPC + EC2 on AWS',
            summary: 'Think of a VPC as your private network in the cloud. Subnets are rooms, an Internet Gateway is the front door, and a Security Group is the firewall. Terraform creates all of this in the right order automatically.',
            codeExample: `# Step 1 — Tell Terraform to use the AWS provider
terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
}
provider "aws" { region = "us-east-1" }

# Step 2 — Create a VPC (your private network in AWS)
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"         # 65,536 available IPs
  tags       = { Name = "my-app-vpc" }
}

# Step 3 — Public subnet (for resources that need the internet)
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"   # 256 IPs
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true             # give each EC2 a public IP
}

# Step 4 — Internet Gateway (the door to the internet)
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
}

# Step 5 — Route table: send internet traffic through the IGW
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"                # all external traffic
    gateway_id = aws_internet_gateway.igw.id
  }
}
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# Step 6 — Security Group (firewall: allow HTTP and HTTPS in)
resource "aws_security_group" "web" {
  vpc_id = aws_vpc.main.id
  ingress { from_port=80;  to_port=80;  protocol="tcp"; cidr_blocks=["0.0.0.0/0"] }
  ingress { from_port=443; to_port=443; protocol="tcp"; cidr_blocks=["0.0.0.0/0"] }
  egress  { from_port=0;   to_port=0;   protocol="-1";  cidr_blocks=["0.0.0.0/0"] }
}

# Step 7 — Launch an EC2 instance
resource "aws_instance" "web" {
  ami                    = "ami-0c55b159cbfafe1f0"  # Amazon Linux 2023
  instance_type          = "t3.micro"               # free tier eligible
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.web.id]
  user_data = <<-EOF
    #!/bin/bash
    yum update -y && yum install -y httpd
    systemctl start httpd
    echo "<h1>Hello from Terraform!</h1>" > /var/www/html/index.html
  EOF
  tags = { Name = "web-server" }
}

# Step 8 — Print the public IP after apply
output "server_ip" { value = aws_instance.web.public_ip }

# Run these commands:
# terraform init    → download AWS provider
# terraform plan    → preview what will be created
# terraform apply   → create everything
# terraform destroy → delete everything`,
            funFact: '🌍 When you run "terraform apply", Terraform calls AWS APIs in dependency order — it knows to create the VPC before the subnet, subnet before EC2. You never have to think about ordering!',
            quiz: {
              question: 'What does an Internet Gateway (IGW) do in an AWS VPC?',
              options: [
                'Encrypts traffic between EC2 instances',
                'Connects your VPC to the public internet so EC2 instances can send and receive internet traffic',
                'Acts as a load balancer for EC2',
                'Monitors network traffic for security threats',
              ],
              answer: 1,
              explanation: 'An Internet Gateway is the connection point between your VPC and the internet. Without it, your EC2 instances can only talk to each other inside the private VPC.',
            },
          },
          {
            id: 'tf-aws-rds',
            name: 'RDS PostgreSQL + Secrets Manager',
            summary: 'Never hardcode database passwords in Terraform files or code. AWS Secrets Manager stores them securely and rotates them automatically. Terraform provisions both the database and secret together.',
            codeExample: `# Private subnets for the DB (no internet access — DB should never be public)
resource "aws_subnet" "private_a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.10.0/24"
  availability_zone = "us-east-1a"
}
resource "aws_subnet" "private_b" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.11.0/24"
  availability_zone = "us-east-1b"
}

# RDS needs a subnet group spanning at least 2 Availability Zones
resource "aws_db_subnet_group" "main" {
  name       = "main-db-subnet"
  subnet_ids = [aws_subnet.private_a.id, aws_subnet.private_b.id]
}

# Security group: ONLY allow traffic from the app server security group
resource "aws_security_group" "rds" {
  vpc_id = aws_vpc.main.id
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.web.id] # only from app, not internet!
  }
}

# The actual RDS Postgres instance
resource "aws_db_instance" "postgres" {
  identifier        = "my-app-db"
  engine            = "postgres"
  engine_version    = "15.4"
  instance_class    = "db.t3.micro"     # small dev instance
  allocated_storage = 20                # 20 GB SSD

  db_name  = "appdb"
  username = "appuser"

  # Best practice: let AWS generate and store the password in Secrets Manager
  manage_master_user_password = true    # no password in your Terraform code!

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  backup_retention_period = 7           # keep 7 days of backups
  deletion_protection     = true        # prevents accidental delete
  skip_final_snapshot     = false       # take a snapshot before delete

  tags = { Name = "my-app-db", Env = "prod" }
}

output "db_endpoint" { value = aws_db_instance.postgres.endpoint }
# Your app connects to: my-app-db.xxxx.us-east-1.rds.amazonaws.com:5432`,
            funFact: '🔐 manage_master_user_password = true makes AWS generate a random password and store it in Secrets Manager automatically. Your team never sees it! Your app fetches it at startup using the AWS SDK.',
          },
          {
            id: 'tf-aws-ecs-alb',
            name: 'ECS Fargate + Load Balancer',
            summary: 'ECS Fargate runs your Docker containers without managing any servers. The Application Load Balancer (ALB) distributes incoming traffic across your containers. Think: ALB = traffic cop, ECS = container runner.',
            codeExample: `# ECS Cluster — just a logical grouping, no servers to manage
resource "aws_ecs_cluster" "main" { name = "my-app-cluster" }

# Task Definition — like docker-compose.yml for AWS
resource "aws_ecs_task_definition" "api" {
  family                   = "api-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256     # 0.25 vCPU
  memory                   = 512     # 512 MB RAM
  container_definitions = jsonencode([{
    name  = "api"
    image = "123456789.dkr.ecr.us-east-1.amazonaws.com/my-api:v1.0"
    portMappings = [{ containerPort = 8080 }]
    environment = [{ name="DB_URL", value=aws_db_instance.postgres.endpoint }]
    # Send logs to CloudWatch
    logConfiguration = {
      logDriver = "awslogs"
      options   = { "awslogs-group" = "/ecs/api", "awslogs-region" = "us-east-1" }
    }
  }])
}

# Application Load Balancer — receives internet traffic
resource "aws_lb" "main" {
  name               = "my-app-alb"
  load_balancer_type = "application"
  subnets            = [aws_subnet.public.id, aws_subnet.public_b.id]
  security_groups    = [aws_security_group.alb.id]
}
resource "aws_lb_target_group" "api" {
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"                     # required for Fargate
  health_check { path = "/actuator/health" }
}
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"
  default_action { type = "forward"; target_group_arn = aws_lb_target_group.api.arn }
}

# ECS Service — keeps N copies of your container running and updates them rolling
resource "aws_ecs_service" "api" {
  name            = "api-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.api.arn
  desired_count   = 2            # keep 2 containers running at all times
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.private_a.id, aws_subnet.private_b.id]
    security_groups  = [aws_security_group.app.id]
    assign_public_ip = false     # containers stay private, ALB is the public face
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.api.arn
    container_name   = "api"
    container_port   = 8080
  }
}`,
            funFact: '🎯 ECS Fargate bills per vCPU-second and GB-second. If your 2 containers run at 0.25 vCPU + 512MB for a month, you pay about $9/month — no EC2 instances to patch or manage!',
            quiz: {
              question: 'In ECS Fargate, what is the role of the Application Load Balancer (ALB)?',
              options: [
                'Stores Docker images',
                'Manages IAM permissions for containers',
                'Receives incoming requests and distributes them across healthy ECS containers',
                'Monitors container CPU and memory usage',
              ],
              answer: 2,
              explanation: 'The ALB sits in front of your ECS service, checks which containers are healthy (via health checks), and distributes requests among them. If a container crashes, the ALB stops sending it traffic instantly.',
            },
          },
          {
            id: 'tf-aws-cicd',
            name: 'Terraform CI/CD with GitHub Actions',
            summary: 'Automate Terraform: a pull request runs "plan" and posts the diff as a comment, merging to main runs "apply". Use OIDC so GitHub Actions gets temporary AWS credentials — no long-lived access keys needed.',
            codeExample: `# .github/workflows/terraform.yml
name: Terraform
on:
  push:        { branches: [main] }
  pull_request: { branches: [main] }
permissions:
  id-token: write    # required for OIDC token exchange
  contents: read
  pull-requests: write
jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    # OIDC: GitHub proves "I am this repo" → AWS gives temp credentials
    # No AWS_ACCESS_KEY / AWS_SECRET_KEY stored in GitHub!
    - uses: aws-actions/configure-aws-credentials@v4
      with:
        role-to-assume: arn:aws:iam::123456789:role/github-actions-terraform
        aws-region: us-east-1

    - uses: hashicorp/setup-terraform@v3

    - name: Terraform Init
      run: terraform init

    - name: Terraform Plan
      id: plan
      run: terraform plan -no-color -out=tfplan 2>&1 | tee plan_output.txt

    # Post plan as a PR comment so your team can review changes
    - uses: actions/github-script@v7
      if: github.event_name == 'pull_request'
      with:
        script: |
          const fs = require('fs');
          const plan = fs.readFileSync('plan_output.txt', 'utf8').slice(0, 60000);
          github.rest.issues.createComment({
            issue_number: context.issue.number,
            body: \`### Terraform Plan\\n\\\`\\\`\\\`terraform\\n\${plan}\\n\\\`\\\`\\\`\`
          });

    # Only apply after PR is merged to main
    - name: Terraform Apply
      if: github.ref == 'refs/heads/main' && github.event_name == 'push'
      run: terraform apply tfplan`,
            funFact: '🔐 OIDC (OpenID Connect) lets GitHub prove "I am github.com/your-org/your-repo" to AWS, which exchanges this proof for short-lived (15min) credentials. No secret rotation, no leaked keys in git history!',
          },
        ],
      },

      // ─── Terraform for GCP ────────────────────────────────────────────────
      {
        id: 'tf-gcp',
        name: 'Terraform for GCP',
        level: 'Beginner',
        description: 'Provision Google Cloud infrastructure without touching the GCP Console. GCP is particularly great for data pipelines, container workloads, and ML — and Terraform makes all of it repeatable and version-controlled.',
        concepts: [
          {
            id: 'tf-gcp-setup',
            name: 'GCP Provider Setup & API Activation',
            summary: 'Every GCP service starts as disabled (to save costs and reduce attack surface). You enable exactly what you need. Terraform uses your gcloud login credentials locally, or a service account in CI/CD.',
            codeExample: `# provider.tf — GCP Terraform setup
terraform {
  required_providers {
    google = { source = "hashicorp/google", version = "~> 5.0" }
  }
}

provider "google" {
  project = "my-gcp-project-id"   # find in GCP Console → IAM → Settings
  region  = "europe-west1"
  zone    = "europe-west1-b"
}

# GCP APIs are disabled by default — enable only what you need
# (like installing apps on a new phone)
resource "google_project_service" "apis" {
  for_each = toset([
    "run.googleapis.com",           # Cloud Run
    "sqladmin.googleapis.com",      # Cloud SQL
    "container.googleapis.com",     # GKE
    "compute.googleapis.com",       # Compute Engine, networking
    "secretmanager.googleapis.com", # Secret Manager (like AWS Secrets Manager)
    "artifactregistry.googleapis.com", # Docker image registry
  ])
  service            = each.value
  disable_on_destroy = false  # don't disable when destroying infra
}

# GCS Bucket (like AWS S3) — for storing files
resource "google_storage_bucket" "uploads" {
  name          = "my-app-uploads-\${var.project_id}"  # globally unique name!
  location      = "EU"           # multi-region in Europe
  force_destroy = false

  # Auto-delete files older than 90 days
  lifecycle_rule {
    condition { age = 90 }
    action    { type = "Delete" }
  }
  versioning { enabled = true }  # keep version history
}

# Authenticate locally (run once):
# gcloud auth application-default login
# In CI/CD use a service account key or Workload Identity Federation`,
            funFact: '🔑 GCP uses "Application Default Credentials" (ADC) — gcloud login locally, Workload Identity in GKE/Cloud Run. You almost never need to create and store service account key files!',
            quiz: {
              question: 'Why do you need to enable GCP APIs before creating resources via Terraform?',
              options: [
                'For security approval from Google',
                'GCP services are disabled by default — you opt-in to each service to control cost and attack surface',
                'Terraform requires it for authentication',
                'APIs cost money per API call so you must subscribe first',
              ],
              answer: 1,
              explanation: 'Every new GCP project has most APIs disabled. Enabling only what you use reduces costs (unused services can\'t accidentally incur charges) and shrinks your attack surface.',
            },
          },
          {
            id: 'tf-gcp-cloudrun',
            name: 'Cloud Run + Cloud SQL via Terraform',
            summary: 'Cloud Run runs your container. Cloud SQL manages your PostgreSQL database. The Cloud SQL Auth Proxy sidecar handles the encrypted connection between them — no IP whitelisting or SSL certificates to manage.',
            codeExample: `# Cloud SQL PostgreSQL (private — no public IP)
resource "google_sql_database_instance" "main" {
  name             = "my-app-postgres"
  database_version = "POSTGRES_15"
  region           = "europe-west1"

  settings {
    tier = "db-f1-micro"    # smallest/cheapest for dev

    ip_configuration {
      ipv4_enabled    = false       # no public IP — private only
      private_network = google_compute_network.main.self_link
    }
    backup_configuration {
      enabled    = true
      start_time = "02:00"          # backup at 2 AM daily
    }
  }
  deletion_protection = true        # prevents accidental delete
}

resource "google_sql_database" "app" {
  name     = "appdb"
  instance = google_sql_database_instance.main.name
}

# Dedicated service account for your Cloud Run app (never use default SA!)
resource "google_service_account" "api" {
  account_id   = "api-service"
  display_name = "API Service Account"
}
# Give it permission to connect to Cloud SQL
resource "google_project_iam_member" "sql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:\${google_service_account.api.email}"
}

# Deploy to Cloud Run
resource "google_cloud_run_v2_service" "api" {
  name     = "order-api"
  location = "europe-west1"

  template {
    service_account = google_service_account.api.email

    # Your app container
    containers {
      image = "europe-west1-docker.pkg.dev/my-project/repo/order-api:v1.0"
      ports { container_port = 8080 }
      env { name = "DB_NAME", value = google_sql_database.app.name }
      env { name = "DB_USER", value = "appuser" }
      env { name = "DB_HOST", value = "localhost" } # cloud-sql-proxy on localhost
    }

    # Cloud SQL Auth Proxy sidecar — handles encrypted DB connection
    containers {
      image = "gcr.io/cloud-sql-connectors/cloud-sql-proxy:2"
      args  = [google_sql_database_instance.main.connection_name]
    }

    scaling { min_instance_count = 0; max_instance_count = 10 }
  }
}

# Allow public access (no auth required)
resource "google_cloud_run_v2_service_iam_member" "public" {
  name   = google_cloud_run_v2_service.api.name
  role   = "roles/run.invoker"
  member = "allUsers"
}
output "service_url" { value = google_cloud_run_v2_service.api.uri }`,
            funFact: '🔒 The Cloud SQL Auth Proxy handles IAM authentication AND TLS encryption automatically. You don\'t whitelist IPs or manage certificates. The proxy uses the attached service account identity to connect — no passwords in config!',
          },
          {
            id: 'tf-gcp-gke',
            name: 'GKE Cluster via Terraform',
            summary: 'GKE Autopilot means Google manages and auto-provisions all nodes. You just describe your pods. Workload Identity lets pods access GCP services (Cloud SQL, Pub/Sub, GCS) with IAM permissions — no key files inside containers.',
            codeExample: `# GKE Autopilot cluster — Google manages nodes for you
resource "google_container_cluster" "main" {
  name     = "prod-cluster"
  location = "europe-west1"       # regional = high availability (3 zones)

  enable_autopilot = true          # no node management needed at all!

  # Private cluster — nodes don't have public IPs
  private_cluster_config {
    enable_private_nodes    = true
    enable_private_endpoint = false
    master_ipv4_cidr_block  = "172.16.0.0/28"
  }

  network    = google_compute_network.main.name
  subnetwork = google_compute_subnetwork.main.name
  ip_allocation_policy {}          # required for VPC-native

  # Workload Identity — pods use GCP IAM, no key files needed!
  workload_identity_config {
    workload_pool = "\${var.project_id}.svc.id.goog"
  }
}

output "kubectl_command" {
  value = "gcloud container clusters get-credentials \${google_container_cluster.main.name} --region \${google_container_cluster.main.location}"
}

# Kubernetes Service Account linked to GCP SA (Workload Identity setup)
resource "kubernetes_service_account" "api" {
  metadata {
    name      = "api-sa"
    namespace = "default"
    annotations = {
      "iam.gke.io/gcp-service-account" = google_service_account.api.email
    }
  }
}
# Let the K8s SA impersonate the GCP SA
resource "google_service_account_iam_member" "workload_identity" {
  service_account_id = google_service_account.api.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "serviceAccount:\${var.project_id}.svc.id.goog[default/api-sa]"
}`,
            funFact: '🤝 Workload Identity eliminates the need for service account key files inside containers. Instead, pods use their Kubernetes identity to automatically get a GCP access token. No key files, no rotation, no leaks!',
            quiz: {
              question: 'What is the main advantage of GKE Autopilot over Standard GKE?',
              options: [
                'Autopilot supports more programming languages',
                'Google manages and auto-provisions nodes — you only need to describe your pods',
                'Autopilot is always cheaper than Standard mode',
                'Autopilot runs on faster custom hardware',
              ],
              answer: 1,
              explanation: 'GKE Autopilot removes node management entirely. Google handles provisioning, patching, scaling, and securing nodes. You just submit pod manifests and GKE figures out where to run them.',
            },
          },
        ],
      },

      // ─── Advanced Terraform Patterns ──────────────────────────────────────
      {
        id: 'tf-advanced',
        name: 'Advanced Terraform Patterns',
        level: 'Intermediate',
        description: 'Stop copy-pasting! These patterns let you loop, make decisions, and manage multiple environments without duplicating code. If you find yourself writing the same resource block repeatedly, one of these patterns is your answer.',
        concepts: [
          {
            id: 'tf-foreach-count',
            name: 'for_each & count — Stop Copy-Pasting!',
            summary: 'Instead of writing 5 identical resource blocks, use for_each (map/set) or count (number) to create multiple resources in a loop. for_each is preferred — it gives stable keys so removing one item doesn\'t accidentally affect others.',
            codeExample: `# ── count — create N identical things
resource "aws_instance" "web" {
  count         = 3
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"
  tags = { Name = "web-\${count.index}" }  # web-0, web-1, web-2
}
# Access: aws_instance.web[0].public_ip

# ── for_each (map) — create things from a map (better stability)
variable "environments" {
  default = {
    dev  = { instance_type = "t3.micro",  region = "us-east-1" }
    prod = { instance_type = "t3.medium", region = "eu-west-1" }
  }
}
resource "aws_instance" "env_server" {
  for_each      = var.environments
  instance_type = each.value.instance_type
  tags          = { Name = "server-\${each.key}" }
  # each.key   = "dev" or "prod"
  # each.value = { instance_type = ..., region = ... }
}
# Access: aws_instance.env_server["prod"].id

# ── for_each (set) — create IAM users from a list
variable "dev_team" { default = ["alice", "bob", "carol"] }
resource "aws_iam_user" "devs" {
  for_each = toset(var.dev_team)   # toset() converts list to set
  name     = each.value
}

# ── Dynamic blocks — avoid repeated nested blocks
variable "ingress_rules" {
  default = [
    { port = 80,  protocol = "tcp", cidr = "0.0.0.0/0" },
    { port = 443, protocol = "tcp", cidr = "0.0.0.0/0" },
    { port = 8080, protocol = "tcp", cidr = "10.0.0.0/8" },
  ]
}
resource "aws_security_group" "app" {
  vpc_id = aws_vpc.main.id
  dynamic "ingress" {
    for_each = var.ingress_rules
    content {
      from_port   = ingress.value.port
      to_port     = ingress.value.port
      protocol    = ingress.value.protocol
      cidr_blocks = [ingress.value.cidr]
    }
  }
}`,
            funFact: '⚠️ count vs for_each gotcha: with count = 3, if you remove the middle item from a list, Terraform re-numbers indices and may destroy+recreate other resources. for_each uses stable string keys — removing "bob" only removes "bob". Always prefer for_each!',
            quiz: {
              question: 'Why is for_each preferred over count when creating multiple resources?',
              options: [
                'for_each is always faster to execute than count',
                'for_each uses stable string keys — removing one item only affects that item, not others',
                'count cannot create more than 10 resources',
                'for_each works with all providers; count only works with AWS',
              ],
              answer: 1,
              explanation: 'count uses numeric indices. Remove index 1 from 3 items and Terraform re-maps index 2 → 1, potentially destroying and recreating it. for_each uses named keys so each resource is independently tracked.',
            },
          },
          {
            id: 'tf-workspaces',
            name: 'Workspaces & Multi-Environment Setup',
            summary: 'Terraform workspaces let you use the same code for dev/staging/prod with different state files. A simple approach: one workspace per environment, one tfvars file per environment.',
            codeExample: `# Option 1: Terraform Workspaces
# Each workspace has its own state file
terraform workspace new dev
terraform workspace new staging
terraform workspace new prod
terraform workspace select prod

# Use workspace name in resources to differentiate
resource "aws_instance" "api" {
  instance_type = terraform.workspace == "prod" ? "t3.medium" : "t3.micro"
  tags = { Env = terraform.workspace }
}

# Option 2 (recommended): separate tfvars per environment (simpler & clearer)
# Directory structure:
# ├── main.tf         ← your resources
# ├── variables.tf    ← variable declarations
# ├── envs/
# │   ├── dev.tfvars  ← dev values
# │   ├── staging.tfvars
# │   └── prod.tfvars

# envs/prod.tfvars
instance_type    = "t3.medium"
desired_count    = 4
db_instance_class = "db.t3.small"
environment      = "prod"

# envs/dev.tfvars
instance_type    = "t3.micro"
desired_count    = 1
db_instance_class = "db.t3.micro"
environment      = "dev"

# Deploy to prod:
terraform plan  -var-file=envs/prod.tfvars -out=prod.plan
terraform apply prod.plan

# Deploy to dev:
terraform plan  -var-file=envs/dev.tfvars  -out=dev.plan
terraform apply dev.plan`,
            funFact: '🏗️ Many teams store terraform state per environment in separate S3 paths: prod/api.tfstate, dev/api.tfstate. This means a dev terraform apply can never accidentally touch prod infrastructure — state is completely isolated!',
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

      // ─── Docker Networking & Volumes ──────────────────────────────────────
      {
        id: 'docker-networking',
        name: 'Networking & Volumes',
        level: 'Beginner',
        description: 'How containers talk to each other and how to persist data so it survives container restarts.',
        concepts: [
          {
            id: 'docker-networks',
            name: 'Docker Networking — How Containers Talk',
            summary: 'By default containers are isolated. Put them in the same network and they can reach each other by container name. Docker has a built-in DNS — you never need to hard-code IPs.',
            codeExample: `# The problem: by default containers can't talk to each other

# Solution 1: Create a named bridge network
docker network create my-app-network

# Run containers on the same network
docker run -d \\
  --name postgres \\
  --network my-app-network \\
  -e POSTGRES_PASSWORD=secret \\
  postgres:15

docker run -d \\
  --name api \\
  --network my-app-network \\
  -e DB_URL="postgres://postgres:secret@postgres:5432/appdb" \\
  #                                        ↑ "postgres" = container name!
  my-api:latest

# Docker DNS resolves "postgres" → the container's IP automatically!
# No hardcoded IPs anywhere.

# Network types:
# bridge  (default) → containers on same bridge talk to each other by name
# host    → container uses host machine's network (Linux only, fastest)
# none    → no network at all (for batch jobs that don't need network)

# Useful commands
docker network ls                         # list all networks
docker network inspect my-app-network     # see which containers are connected
docker network connect my-app-network api # connect existing container

# In docker-compose.yml — Compose creates a network automatically!
services:
  api:
    image: my-api
  postgres:
    image: postgres:15
# api can reach postgres at hostname "postgres" automatically!`,
            funFact: '🌐 Docker has a built-in DNS server! When you create a custom network, each container gets a DNS entry matching its name. That\'s why "postgres" works as a hostname — it resolves to the container\'s IP regardless of what it actually is.',
            quiz: {
              question: 'How do two containers on the same Docker bridge network talk to each other?',
              options: [
                'They share the same IP address',
                'Using the container name as the hostname — Docker DNS resolves it automatically',
                'Only through localhost with port forwarding',
                'They cannot communicate — you need host networking for that',
              ],
              answer: 1,
              explanation: 'Docker\'s embedded DNS server resolves container names to their IPs within the same network. If your API is named "api" and DB is "postgres", the API can connect to "postgres:5432" directly.',
            },
          },
          {
            id: 'docker-volumes',
            name: 'Volumes — Persisting Data',
            summary: 'Containers are like whiteboards — all data is erased when the container stops. Volumes are like USB drives plugged into the container — data persists. Named volumes for production, bind mounts for local dev.',
            codeExample: `# Problem: container stopped → ALL data inside is GONE
docker run postgres:15             # start
# add some data
docker stop postgres && docker rm postgres
docker run postgres:15             # restart → EMPTY database again!

# Solution: Named Volume — Docker stores this on the host permanently
docker volume create postgres_data

docker run -d \\
  --name postgres \\
  -v postgres_data:/var/lib/postgresql/data \\   # mount volume here
  -e POSTGRES_PASSWORD=secret \\
  postgres:15

# Now: stop the container, remove it, start again → data is still there!
docker rm -f postgres
docker run -d \\
  --name postgres \\
  -v postgres_data:/var/lib/postgresql/data \\   # same volume = same data
  postgres:15

# Bind Mount — link a HOST directory into the container
# Perfect for local development: edit files in your IDE, instantly reflects in container
docker run -d \\
  -v $(pwd)/src:/app/src \\    # your local ./src folder → /app/src in container
  -v $(pwd)/config:/app/config:ro \\  # :ro = read-only (container can't modify it)
  my-dev-image

# In docker-compose.yml
services:
  api:
    image: my-api
    volumes:
      - api_data:/app/data         # named volume (production - data persists)
      - ./config:/app/config:ro    # bind mount (local dev - live file sync)
volumes:
  api_data:                        # declare named volumes here

# Commands
docker volume ls                   # list all volumes
docker volume inspect postgres_data # where is the data stored on host?
docker volume prune                # remove all unused volumes (careful!)`,
            funFact: '💾 On Linux, named volumes are stored in /var/lib/docker/volumes/. On Mac and Windows, Docker runs in a lightweight VM — volumes live inside that VM, which is why you can\'t easily browse them in Finder or Explorer.',
          },
          {
            id: 'docker-troubleshoot',
            name: 'Essential Docker Commands for Daily Use',
            summary: 'These commands cover 95% of daily Docker work: inspecting containers, reading logs, execing into a running container for debugging, and cleaning up disk space.',
            codeExample: `# ── Running & Inspecting ──────────────────────────────────────────────
docker ps                          # running containers
docker ps -a                       # all containers (including stopped)
docker inspect my-container        # full JSON config of a container
docker stats                       # live CPU/memory usage of all containers

# ── Logs ──────────────────────────────────────────────────────────────
docker logs my-container           # print all logs
docker logs -f my-container        # follow live logs (like tail -f)
docker logs --tail 100 my-container # last 100 lines only
docker logs --since 1h my-container # logs from last 1 hour

# ── Debugging inside a running container ──────────────────────────────
docker exec -it my-container sh    # open a shell (Alpine Linux uses sh)
docker exec -it my-container bash  # open bash (Ubuntu/Debian containers)
docker exec my-container env       # print environment variables
docker exec my-container ls /app   # run any command without entering shell

# ── Cleaning up disk space ────────────────────────────────────────────
docker system df                   # how much disk Docker is using
docker system prune                # remove stopped containers + unused images
docker system prune -a             # also remove images not used by any container
docker image prune                 # remove dangling (untagged) images only

# ── Image management ──────────────────────────────────────────────────
docker images                      # list images
docker pull nginx:alpine           # download latest nginx alpine
docker rmi my-old-image:v1.0       # delete an image
docker image history my-api:v1.0   # see each layer and its size

# ── Copy files to/from container ──────────────────────────────────────
docker cp my-container:/app/logs/app.log ./local-app.log  # copy out
docker cp ./config.yml my-container:/app/config.yml       # copy in`,
            funFact: '🔍 "docker exec -it my-container sh" is the single most useful debugging command. You can explore the filesystem, check env vars, curl internal services, and diagnose issues — all from inside the exact same environment your app runs in.',
          },
        ],
      },

      // ─── Docker in Production ─────────────────────────────────────────────
      {
        id: 'docker-production',
        name: 'Docker in Production',
        level: 'Intermediate',
        description: 'Container registries, image tagging strategy, health checks, security, and CI/CD.',
        concepts: [
          {
            id: 'docker-registry',
            name: 'Container Registries (ECR, GCR, Docker Hub)',
            summary: 'A registry is where you store and version your Docker images. Docker Hub is public. AWS ECR and GCP Artifact Registry are private. Always tag images with a specific version — never "latest" in production.',
            codeExample: `# ── Docker Hub (public / free private repos) ──────────────────────────
docker login
docker build -t myusername/order-api:v1.2.3 .
docker push myusername/order-api:v1.2.3
docker pull myusername/order-api:v1.2.3

# ── AWS ECR (Elastic Container Registry) ──────────────────────────────
# 1. Create repo (one-time)
aws ecr create-repository --repository-name order-api --region us-east-1

# 2. Authenticate (token valid for 12h)
aws ecr get-login-password --region us-east-1 | \\
  docker login --username AWS --password-stdin \\
  123456789.dkr.ecr.us-east-1.amazonaws.com

# 3. Build → Tag → Push
docker build -t order-api:v1.2.3 .
docker tag  order-api:v1.2.3 123456789.dkr.ecr.us-east-1.amazonaws.com/order-api:v1.2.3
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/order-api:v1.2.3

# ── GCP Artifact Registry ──────────────────────────────────────────────
# 1. Create repo (one-time)
gcloud artifacts repositories create my-repo \\
  --repository-format=docker --location=europe-west1

# 2. Authenticate
gcloud auth configure-docker europe-west1-docker.pkg.dev

# 3. Push
docker tag  order-api:v1.0 europe-west1-docker.pkg.dev/my-project/my-repo/order-api:v1.0
docker push europe-west1-docker.pkg.dev/my-project/my-repo/order-api:v1.0

# ── Good Image Tagging Strategy ────────────────────────────────────────
# Production: use git SHA (unique, traceable)
IMAGE_TAG=$(git rev-parse --short HEAD)         # e.g., "a3f9c12"
docker build -t my-api:$IMAGE_TAG .
# Also tag as semver for human readability
docker tag my-api:$IMAGE_TAG my-api:v1.2.3

# NEVER do this in production → "latest" is a moving target, no rollback!
docker build -t my-api:latest .  # ❌ bad practice`,
            funFact: '🏷️ Using git SHA as image tag means you can always trace exactly which code is running in production. "What\'s deployed?" → check the tag → look up that SHA in git → see exactly which commit and PR it came from.',
            quiz: {
              question: 'Why should production deployments avoid the "latest" Docker image tag?',
              options: [
                'latest images are larger in size',
                'You cannot roll back — "latest" always points to the newest push, making rollbacks impossible',
                'Kubernetes does not support the latest tag',
                'latest images are automatically deleted after 30 days',
              ],
              answer: 1,
              explanation: '"latest" is a moving target. When you push a new broken image, "latest" now points to it. You can\'t roll back to the previous "latest" because it no longer has a tag. Always use semver (v1.2.3) or git SHA.',
            },
          },
          {
            id: 'docker-healthcheck',
            name: 'Health Checks & Security Best Practices',
            summary: 'Health checks let Docker and Kubernetes know if your container is actually working (not just running). Security rules: never run as root, use minimal base images, scan for vulnerabilities, don\'t store secrets in ENV vars in images.',
            codeExample: `# ── Production-hardened Dockerfile ───────────────────────────────────
FROM eclipse-temurin:21-jre-alpine AS runtime  # Alpine = tiny image (~50MB vs 150MB)
WORKDIR /app

# Security: create a non-root user and run as them
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
# Copy the JAR (built in a separate builder stage)
COPY --from=builder /app/target/app.jar app.jar
# Change ownership to our non-root user
RUN chown appuser:appgroup app.jar
USER appuser   # ← NEVER run as root in production!

# Health check: Docker calls this every 30s
# If it fails 3 times in a row → container marked "unhealthy"
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=45s \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health \\
      || exit 1

EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]

# ── docker-compose with resource limits ───────────────────────────────
services:
  api:
    image: my-api:v1.0
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:8080/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 40s       # allow 40s for app to warm up before checking
    deploy:
      resources:
        limits:
          cpus: "0.5"         # max 0.5 CPU cores
          memory: 512M        # max 512MB RAM (OOM-killed if exceeded)
        reservations:
          cpus: "0.25"        # guaranteed minimum
          memory: 256M
    # Security: read-only filesystem where possible
    read_only: true
    tmpfs: [/tmp]             # /tmp needs to be writable for Java

  nginx:
    image: nginx:alpine
    depends_on:
      api:
        condition: service_healthy   # wait for api to be healthy before starting`,
            funFact: '🔒 Running as root inside a container is dangerous. If an attacker escapes the container, they have root on the host machine too. Running as a non-root user limits the blast radius of any container escape vulnerability.',
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

      // ─── Kubernetes Networking & Ingress ──────────────────────────────────
      {
        id: 'k8s-networking',
        name: 'Networking & Ingress',
        level: 'Beginner',
        description: 'How pods communicate, Services in depth, Ingress for HTTP routing, and Liveness/Readiness probes.',
        concepts: [
          {
            id: 'k8s-services-deep',
            name: 'Services Explained Simply',
            summary: 'Pods are temporary — they start, crash, and restart with new IPs. A Service gives a stable hostname and IP that always routes to healthy pods. Think of a Service as a forwarder for your pods.',
            codeExample: `# ClusterIP (default) — INTERNAL only, other pods inside the cluster can reach it
# Use for: databases, caches, internal APIs
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
spec:
  selector:
    app: postgres             # routes to any pod with label app=postgres
  ports:
  - port: 5432               # port other pods use to connect
    targetPort: 5432          # port the postgres pod actually listens on
  type: ClusterIP             # only reachable inside cluster

---
# LoadBalancer — creates an actual cloud load balancer (AWS ELB, GCP LB)
# Use for: the one service that faces the internet
# Note: costs money! ($~18/month on AWS per service)
apiVersion: v1
kind: Service
metadata:
  name: api-public
spec:
  selector:
    app: order-api
  ports:
  - port: 80                  # external port (internet traffic)
    targetPort: 8080          # internal container port
  type: LoadBalancer

# After running: kubectl get service api-public
# You'll see an EXTERNAL-IP — your cloud load balancer IP!

---
# NodePort — opens a port on EVERY node (useful for local clusters like minikube)
apiVersion: v1
kind: Service
metadata:
  name: api-nodeport
spec:
  selector: { app: order-api }
  ports:
  - port: 8080
    nodePort: 30080           # port opened on each node (30000-32767 range)
  type: NodePort
# Access: http://NODE_IP:30080

# Useful commands
kubectl get services                      # list all services
kubectl describe service api-public       # see endpoints (which pods it routes to)
kubectl get endpoints api-public          # see the actual pod IPs being used`,
            funFact: '🔄 Services use kube-proxy to maintain iptables rules on every node. When a pod goes down, kube-proxy removes it from the routing rules within seconds. Your clients see no downtime — requests just route to other healthy pods.',
            quiz: {
              question: 'What Service type should a database use to stay private inside the cluster?',
              options: ['LoadBalancer', 'NodePort', 'ClusterIP', 'ExternalName'],
              answer: 2,
              explanation: 'ClusterIP is only reachable within the cluster. LoadBalancer and NodePort expose services outside the cluster. Databases should use ClusterIP to stay private.',
            },
          },
          {
            id: 'k8s-ingress',
            name: 'Ingress — One Load Balancer for Everything',
            summary: 'Without Ingress, each service needs its own LoadBalancer ($18+/month each). An Ingress Controller is ONE load balancer that routes HTTP/S to many services based on hostname or URL path. Massive cost saving.',
            codeExample: `# Step 1 — Install the nginx Ingress Controller (one-time per cluster)
# This creates ONE cloud load balancer for all your services
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml

# OR with Helm (easier):
helm upgrade --install ingress-nginx ingress-nginx \\
  --repo https://kubernetes.github.io/ingress-nginx \\
  --namespace ingress-nginx --create-namespace

# Step 2 — Create Ingress rules that route to your services
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    # Redirect HTTP → HTTPS automatically
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    # Limit each IP to 100 req/minute (DDoS protection)
    nginx.ingress.kubernetes.io/limit-rps: "100"
spec:
  ingressClassName: nginx
  tls:
  - hosts: [api.myapp.com, app.myapp.com]
    secretName: myapp-tls-cert          # TLS certificate stored as a K8s Secret

  rules:
  # Route by hostname: api.myapp.com → order-api service
  - host: api.myapp.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: order-api-service
            port: { number: 8080 }

  # Route by URL path on app.myapp.com:
  - host: app.myapp.com
    http:
      paths:
      - path: /api/v1/orders            # → order microservice
        pathType: Prefix
        backend: { service: { name: order-api, port: { number: 8080 } } }
      - path: /api/v1/users             # → user microservice
        pathType: Prefix
        backend: { service: { name: user-api, port: { number: 8080 } } }
      - path: /                         # → React frontend
        pathType: Prefix
        backend: { service: { name: frontend, port: { number: 80 } } }`,
            funFact: '💸 Without Ingress = 1 LoadBalancer per service = $18/month each. With an Ingress Controller = 1 LoadBalancer shared across ALL services. A 10-service cluster saves $162/month — $1,944/year — just from this one change!',
          },
          {
            id: 'k8s-probes',
            name: 'Liveness, Readiness & Startup Probes',
            summary: 'Three probes tell Kubernetes about your container health. Startup: still booting up? Readiness: ready for traffic? Liveness: frozen/deadlocked and needs a restart? Configure them wrong and deployments get flaky.',
            codeExample: `# All three probes on a Spring Boot API
spec:
  containers:
  - name: order-api
    image: my-api:v1.0
    ports:
    - containerPort: 8080

    # Startup probe — gives the app time to initialize
    # Kubernetes waits for this before starting other probes
    # Allows up to: 30 retries × 10s = 5 minutes to start
    startupProbe:
      httpGet:
        path: /actuator/health/liveness
        port: 8080
      failureThreshold: 30
      periodSeconds: 10

    # Readiness probe — "Am I ready to receive requests from the Service?"
    # Fails → pod removed from Service rotation (no traffic) but NOT restarted
    # Useful: warm-up period, temporary DB connection issues
    readinessProbe:
      httpGet:
        path: /actuator/health/readiness
        port: 8080
      initialDelaySeconds: 10
      periodSeconds: 5
      failureThreshold: 3

    # Liveness probe — "Am I still alive? Or am I deadlocked?"
    # Fails → Kubernetes RESTARTS the container
    # Only check if the app itself is stuck — NOT if a DB is down!
    livenessProbe:
      httpGet:
        path: /actuator/health/liveness
        port: 8080
      initialDelaySeconds: 30
      periodSeconds: 10
      failureThreshold: 3

# Spring Boot exposes these automatically!
# Add to application.yml:
# management.endpoint.health.probes.enabled: true
# management.health.livenessState.enabled: true
# management.health.readinessState.enabled: true`,
            funFact: '⚠️ The most common probe mistake: making liveness probe check the database. If DB goes down, ALL pods fail liveness → all pods restart simultaneously → stampede on the DB → makes recovery worse! Liveness should only check if the app process is deadlocked, not its dependencies.',
            quiz: {
              question: 'What happens when a Readiness probe fails vs when a Liveness probe fails?',
              options: [
                'Both cause the container to restart',
                'Readiness failure removes the pod from Service traffic (no restart); Liveness failure restarts the container',
                'Readiness failure restarts the container; Liveness does not',
                'Both remove the pod from the Service',
              ],
              answer: 1,
              explanation: 'Readiness failure = "I\'m not ready for traffic yet" → pod removed from Service, but continues running. Liveness failure = "I\'m broken/stuck" → Kubernetes kills and restarts the container.',
            },
          },
        ],
      },

      // ─── Kubernetes Storage ───────────────────────────────────────────────
      {
        id: 'k8s-storage',
        name: 'Storage & StatefulSets',
        level: 'Intermediate',
        description: 'PersistentVolumes, PersistentVolumeClaims, StorageClasses, and running stateful apps like databases.',
        concepts: [
          {
            id: 'k8s-pvc',
            name: 'PersistentVolumes & PVCs',
            summary: 'In Kubernetes, a PersistentVolume (PV) is a piece of storage (like an EBS disk). A PersistentVolumeClaim (PVC) is a request for storage. Your pods reference the PVC, not the PV directly. StorageClass handles dynamic provisioning.',
            codeExample: `# StorageClass defines HOW storage is created (cloud provider specific)
# On AWS: uses EBS, on GCP: uses Persistent Disk
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: ebs.csi.aws.com       # AWS EBS CSI driver
parameters:
  type: gp3                         # GP3 SSD (faster than gp2)
  iops: "3000"
reclaimPolicy: Retain               # keep disk even if PVC is deleted!
volumeBindingMode: WaitForFirstConsumer  # create disk in same AZ as the pod

---
# PersistentVolumeClaim — "I need 20GB of fast SSD storage"
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
spec:
  accessModes: [ReadWriteOnce]      # one pod can write at a time
  storageClassName: fast-ssd
  resources:
    requests:
      storage: 20Gi                 # request 20 GB

---
# Use the PVC in a Pod
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: postgres
    image: postgres:15
    env:
    - name: PGDATA
      value: /var/lib/postgresql/data/pgdata
    volumeMounts:
    - name: postgres-storage
      mountPath: /var/lib/postgresql/data    # mount here inside the container
  volumes:
  - name: postgres-storage
    persistentVolumeClaim:
      claimName: postgres-pvc                # reference the PVC by name

# Commands
kubectl get pvc                    # see claim status (Pending/Bound)
kubectl get pv                     # see the actual volumes
kubectl describe pvc postgres-pvc  # see which PV was bound`,
            funFact: '💡 reclaimPolicy: Retain is crucial for databases — it keeps the underlying cloud disk even if the PVC is accidentally deleted. The default is Delete, which means deleting the PVC also deletes all your data permanently!',
          },
          {
            id: 'k8s-statefulset',
            name: 'StatefulSets — Running Databases in K8s',
            summary: 'StatefulSets manage pods that need stable identities and persistent storage — perfect for databases. Each pod gets a stable DNS name (postgres-0, postgres-1) and its own PVC that survives restarts.',
            codeExample: `# StatefulSet for PostgreSQL — each pod gets a stable name + its own disk
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  serviceName: "postgres"          # headless service name (see below)
  replicas: 1                      # for a single primary instance

  selector:
    matchLabels: { app: postgres }

  template:
    metadata:
      labels: { app: postgres }
    spec:
      containers:
      - name: postgres
        image: postgres:15
        env:
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret   # from a K8s Secret
              key: password
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-data
          mountPath: /var/lib/postgresql/data

  # volumeClaimTemplates automatically creates a PVC per pod!
  volumeClaimTemplates:
  - metadata:
      name: postgres-data
    spec:
      accessModes: [ReadWriteOnce]
      storageClassName: fast-ssd
      resources:
        requests:
          storage: 20Gi

---
# Headless Service — gives each pod a stable DNS name
# postgres-0.postgres.default.svc.cluster.local
# postgres-1.postgres.default.svc.cluster.local
apiVersion: v1
kind: Service
metadata:
  name: postgres
spec:
  clusterIP: None               # "headless" — no VIP, direct pod DNS
  selector: { app: postgres }
  ports:
  - port: 5432

# Your app connects to: postgres-0.postgres.default.svc.cluster.local:5432`,
            funFact: '🏛️ StatefulSets delete pods in reverse order (pod-2 before pod-1 before pod-0) and create them in order. This ordered behavior is crucial for databases where the primary (pod-0) must exist before replicas.',
          },
        ],
      },

      // ─── Helm ─────────────────────────────────────────────────────────────
      {
        id: 'k8s-helm',
        name: 'Helm — Kubernetes Package Manager',
        level: 'Intermediate',
        description: 'Package and deploy Kubernetes applications with a single command. Manage upgrades, rollbacks, and environments.',
        concepts: [
          {
            id: 'k8s-helm-basics',
            name: 'Helm Basics — Install & Manage Apps',
            summary: 'Helm is to Kubernetes what npm is to Node.js. A Chart is a package. A Release is a deployed chart. Helm manages the entire lifecycle: install, upgrade, rollback, uninstall. One command deploys a full database cluster.',
            codeExample: `# Install Helm
brew install helm            # Mac
choco install kubernetes-helm  # Windows

# Add chart repositories (like package registries)
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

# Search for available charts
helm search repo bitnami/postgres

# Install a chart → creates a "Release"
helm install my-postgres bitnami/postgresql \\
  --namespace db \\
  --create-namespace \\
  --set auth.postgresPassword=mysecret \\
  --set primary.persistence.size=20Gi

# Better: use a values file (version-controlled, repeatable)
# postgres-values.yaml:
# auth:
#   postgresPassword: mysecret
# primary:
#   persistence:
#     size: 20Gi
#   resources:
#     requests: { cpu: 500m, memory: 512Mi }

helm install my-postgres bitnami/postgresql \\
  --namespace db \\
  --values postgres-values.yaml

# See what's deployed
helm list --all-namespaces

# Upgrade (new values or new chart version)
helm upgrade my-postgres bitnami/postgresql \\
  --namespace db \\
  --values postgres-values.yaml \\
  --set image.tag=15.5.0

# Rollback if something broke
helm history my-postgres -n db        # see all revisions
helm rollback my-postgres 1 -n db     # rollback to revision 1

# Uninstall
helm uninstall my-postgres -n db`,
            funFact: '🎯 Helm 3 (2019) removed "Tiller" — the server-side component that required cluster-admin privileges and was a massive security vulnerability. Helm 3 talks to K8s directly using your current kubectl context permissions.',
            quiz: {
              question: 'What is the difference between a Helm Chart and a Helm Release?',
              options: [
                'They are the same thing',
                'A Chart is a reusable package/template; a Release is a specific deployed instance of that chart with your values',
                'A Release is a newer version of a Chart',
                'Charts are for dev; Releases are for production',
              ],
              answer: 1,
              explanation: 'A Chart is a blueprint (reusable YAML templates). When you run "helm install", you create a Release — a deployed instance with your specific config. You can have postgres-dev and postgres-prod releases from the same bitnami chart.',
            },
          },
          {
            id: 'k8s-helm-create',
            name: 'Writing Your Own Helm Chart',
            summary: 'Package your own app as a Helm chart so deployments are repeatable across dev/staging/prod. The key files: Chart.yaml (metadata), values.yaml (defaults), templates/*.yaml (K8s YAML with templating).',
            codeExample: `# Scaffold a new chart
helm create order-api

# Structure created:
# order-api/
#   Chart.yaml          ← chart name, version, description
#   values.yaml         ← default values (override per environment)
#   templates/
#     deployment.yaml   ← K8s Deployment with {{ .Values.xxx }} placeholders
#     service.yaml      ← K8s Service
#     ingress.yaml      ← K8s Ingress
#     _helpers.tpl      ← shared template functions

# ── values.yaml (your defaults) ──────────────────────────────────────
replicaCount: 2
image:
  repository: 123456789.dkr.ecr.us-east-1.amazonaws.com/order-api
  tag: "v1.0.0"
  pullPolicy: IfNotPresent
service:
  type: ClusterIP
  port: 8080
resources:
  requests: { cpu: 250m, memory: 512Mi }
  limits:   { cpu: 500m, memory: 1Gi }
env:
  DB_URL: "jdbc:postgresql://postgres:5432/appdb"

# ── templates/deployment.yaml ────────────────────────────────────────
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "order-api.fullname" . }}
  labels: {{- include "order-api.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}      # ← from values.yaml
  template:
    spec:
      containers:
      - name: {{ .Chart.Name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        ports:
        - containerPort: {{ .Values.service.port }}
        env:
        {{- range $key, $val := .Values.env }}
        - name: {{ $key }}
          value: {{ $val | quote }}
        {{- end }}
        resources: {{- toYaml .Values.resources | nindent 10 }}

# ── Deploy to different environments ─────────────────────────────────
# Dev: 1 replica, small resources
helm install order-api ./order-api \\
  --set replicaCount=1 \\
  --set resources.requests.cpu=100m

# Prod: 4 replicas, specific image tag
helm install order-api ./order-api \\
  --values values-prod.yaml \\
  --set replicaCount=4 \\
  --set image.tag=v1.2.3

# Preview what would be deployed (dry run)
helm template order-api ./order-api --values values-prod.yaml`,
            funFact: '🏭 Prometheus, Grafana, Cert-Manager, and ArgoCD all distribute as Helm charts. "helm install prometheus prometheus-community/kube-prometheus-stack" deploys a full monitoring stack (Prometheus + Grafana + 20+ exporters) with one command!',
          },
          {
            id: 'k8s-helm-certmanager',
            name: 'Auto TLS with cert-manager',
            summary: 'cert-manager automatically provisions and renews TLS certificates from Let\'s Encrypt. You declare what domain you need a cert for, cert-manager does the rest. No more manual SSL renewals!',
            codeExample: `# Step 1 — Install cert-manager with Helm
helm repo add jetstack https://charts.jetstack.io
helm repo update

helm install cert-manager jetstack/cert-manager \\
  --namespace cert-manager \\
  --create-namespace \\
  --set installCRDs=true    # install Custom Resource Definitions

# Step 2 — Create a ClusterIssuer (tells cert-manager where to get certs)
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@myapp.com           # for certificate expiry notifications
    privateKeySecretRef:
      name: letsencrypt-prod-key
    solvers:
    - http01:
        ingress:
          class: nginx               # use nginx ingress for the ACME challenge

# Step 3 — Add annotation to your Ingress → cert-manager auto-issues the cert!
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"   # ← this is it!
spec:
  ingressClassName: nginx
  tls:
  - hosts: [api.myapp.com]
    secretName: api-myapp-tls        # cert-manager creates this Secret
  rules:
  - host: api.myapp.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: order-api
            port: { number: 8080 }

# cert-manager will:
# 1. See the annotation on the Ingress
# 2. Contact Let's Encrypt
# 3. Prove domain ownership (HTTP-01 challenge)
# 4. Store the certificate in the Secret
# 5. Renew automatically before expiry — you never touch it again!`,
            funFact: '♻️ cert-manager renews certificates automatically 30 days before they expire. With Let\'s Encrypt certs expiring every 90 days, you\'d need to renew every 60 days manually — cert-manager eliminates this entirely!',
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

  // ─── LANGCHAIN / LANGGRAPH / LANGSMITH ────────────────────────────────────
  {
    id: 'langchain',
    name: 'LangChain & LangGraph',
    icon: '🦜',
    gradient: 'from-emerald-500 to-teal-600',
    tagline: 'Build AI apps and agents with LLMs',
    category: 'Framework',
    subtopics: [
      // ── What IS LangChain? ──────────────────────────────────────────────
      {
        id: 'lc-core',
        name: 'LangChain Core Concepts',
        level: 'Beginner',
        description: 'LangChain is a framework for connecting LLMs (like ChatGPT, Claude, or Llama) to tools, databases, and APIs. Think of it as the plumbing that wires an AI brain to the real world.',
        concepts: [
          {
            id: 'lc-what-is',
            name: 'What is LangChain? (The Big Picture)',
            summary: 'Imagine you want an AI assistant that can search the web, query your database, send emails, AND remember what you told it last week. ChatGPT alone can\'t do that — it has no tools and forgets everything after the chat ends. LangChain is the glue that connects an LLM to tools (web search, code execution, APIs), memory (what was said before), and data (your documents, databases). You write Python/JavaScript, call LangChain, and it handles the complex LLM orchestration for you.',
            codeExample: `# Install
pip install langchain langchain-openai langchain-community

# The simplest possible LangChain app
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

messages = [
    SystemMessage("You are a helpful coding assistant."),
    HumanMessage("Explain what a closure is in JavaScript in 2 sentences."),
]

response = llm.invoke(messages)
print(response.content)
# → "A closure is a function that retains access to variables
#    from its outer scope even after that scope has finished executing.
#    Example: inner functions in factory functions."

# ── The LangChain mental model ──────────────────────────────────
# LLM          ← the brain (ChatGPT, Claude, Llama, Gemini...)
# Prompt       ← the instructions you give the brain
# Chain        ← steps connected together: prompt → LLM → output parser
# Tool         ← a function the LLM can call (search, calculator, database)
# Memory       ← conversation history (so the LLM remembers context)
# Agent        ← LLM + Tools + Memory → decides WHICH tool to use`,
            funFact: '🦜 LangChain was created by Harrison Chase in October 2022, just weeks after ChatGPT launched. It went from 0 to 60,000 GitHub stars in 6 months — the fastest-growing AI framework ever!',
            quiz: {
              question: 'What is the main problem LangChain solves?',
              options: [
                'Makes LLMs run faster on your hardware',
                'Connects LLMs to tools, memory, and data sources — turning a chatbot into an agent that can actually DO things',
                'Replaces the need for a backend API',
                'Trains custom LLM models from your data',
              ],
              answer: 1,
              explanation: 'A plain LLM can only generate text. LangChain connects it to external tools (web search, databases, APIs) and memory so it can take real actions and remember context across sessions.',
            },
          },
          {
            id: 'lc-chains',
            name: 'Chains — Connecting Steps Together',
            summary: 'A Chain is a pipeline: output of step 1 becomes input of step 2. The modern way uses LCEL (LangChain Expression Language) with the | pipe operator — exactly like Unix pipes! Read it left-to-right: "format the prompt, THEN send to the LLM, THEN parse the output as a string."',
            codeExample: `from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

llm = ChatOpenAI(model="gpt-4o-mini")

# ── LCEL: build a chain with the | pipe operator ──────────────────
# Step 1: prompt template — fill in variables
# Step 2: send to LLM
# Step 3: parse LLM output as plain string
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an expert in {topic}. Be concise."),
    ("human",  "{question}"),
])

chain = prompt | llm | StrOutputParser()

# Run the chain
result = chain.invoke({
    "topic": "Kubernetes",
    "question": "What is the difference between Deployment and StatefulSet?"
})
print(result)

# ── Chain with transformation step ────────────────────────────────
from langchain_core.runnables import RunnableLambda

def shout(text: str) -> str:
    return text.upper()          # add any Python logic as a chain step

shouting_chain = prompt | llm | StrOutputParser() | RunnableLambda(shout)

# ── Streaming response (word by word) ─────────────────────────────
for chunk in chain.stream({"topic": "Python", "question": "Explain generators"}):
    print(chunk, end="", flush=True)   # prints token by token as it arrives`,
            funFact: '🔗 LCEL (LangChain Expression Language) with the | operator was inspired by Unix pipes. Just like "cat file | grep error | wc -l" chains Unix commands, LCEL chains AI steps. Simple and powerful!',
            quiz: {
              question: 'In LCEL, what does "prompt | llm | StrOutputParser()" mean?',
              options: [
                '"OR" logic — use whichever runs first',
                'A pipeline: format the prompt, pass it to the LLM, then extract the string content from the response',
                'Three separate, unconnected operations',
                'Multiply the outputs together',
              ],
              answer: 1,
              explanation: 'The | pipe operator in LCEL means "pass the output of the left side as input to the right side". It\'s a data pipeline: prompt fills in variables → LLM generates text → parser extracts the string.',
            },
          },
          {
            id: 'lc-prompts',
            name: 'Prompt Templates — Don\'t Hardcode Prompts',
            summary: 'Hard-coding a prompt as a string is like hard-coding a SQL query with user input — messy and broken when variables change. PromptTemplate lets you define prompts as templates with named placeholders. FewShotPromptTemplate adds examples to massively improve output quality. System prompts set the AI\'s persona, human messages are the user input.',
            codeExample: `from langchain_core.prompts import (
    ChatPromptTemplate,
    FewShotChatMessagePromptTemplate,
)

# ── Basic template with variables ─────────────────────────────────
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a {persona} who explains things to {audience}."),
    ("human",  "Explain: {concept}"),
])

# Fill in variables
filled = prompt.format_messages(
    persona="pirate",
    audience="5-year-olds",
    concept="recursion"
)
# → [SystemMessage("You are a pirate who explains things to 5-year-olds."),
#    HumanMessage("Explain: recursion")]

# ── Few-shot prompting — teach by example ─────────────────────────
# Massively improves quality for structured outputs!
examples = [
    {"input": "What is Docker?",    "output": "A box that packages your app and all its dependencies so it runs the same everywhere."},
    {"input": "What is Kubernetes?","output": "A manager that runs and restarts your Docker boxes automatically."},
]
example_prompt = ChatPromptTemplate.from_messages([
    ("human", "{input}"), ("ai", "{output}")
])
few_shot = FewShotChatMessagePromptTemplate(
    examples=examples,
    example_prompt=example_prompt,
)
full_prompt = ChatPromptTemplate.from_messages([
    ("system", "Explain tech concepts simply, like the examples show."),
    few_shot,               # ← inject examples here
    ("human", "{input}"),
])
# Now ask anything and it follows the same pattern as the examples`,
            funFact: '🎯 "Few-shot prompting" (showing 2-5 examples) can improve LLM output quality by 30-50% compared to a prompt with no examples. The LLM pattern-matches to your examples and follows the same format!',
          },
        ],
      },

      // ── Memory & RAG ───────────────────────────────────────────────────────
      {
        id: 'lc-memory-rag',
        name: 'Memory & RAG (Retrieval)',
        level: 'Beginner',
        description: 'LLMs forget everything after each conversation. Memory gives them a short-term brain. RAG (Retrieval Augmented Generation) gives them long-term knowledge by letting them search your documents before answering.',
        concepts: [
          {
            id: 'lc-memory',
            name: 'Conversation Memory',
            summary: 'Every time you call an LLM it starts fresh — like asking someone a question after they got amnesia. To have a real conversation, you need to pass the chat history every time. LangChain\'s memory classes do this automatically. ConversationBufferMemory = remember everything (gets expensive). ConversationSummaryMemory = summarise older messages to save tokens. ConversationBufferWindowMemory = only keep the last N messages.',
            codeExample: `from langchain_openai import ChatOpenAI
from langchain.memory import ConversationBufferWindowMemory
from langchain.chains import ConversationChain

llm = ChatOpenAI(model="gpt-4o-mini")

# Keep only the last 5 exchanges — prevents the conversation growing forever
memory = ConversationBufferWindowMemory(k=5, return_messages=True)

conversation = ConversationChain(llm=llm, memory=memory)

# Turn 1
print(conversation.invoke("My name is Alice and I love Python."))
# → "Nice to meet you, Alice! Python is a great language..."

# Turn 2 — it remembers!
print(conversation.invoke("What\'s my name and favourite language?"))
# → "Your name is Alice and you love Python!"
# (Without memory: "I don't know, you haven't told me.")

# ── Modern approach using RunnableWithMessageHistory ──────────────
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory

# Store one history object per session/user
store: dict[str, BaseChatMessageHistory] = {}

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

chain_with_history = RunnableWithMessageHistory(
    chain,                        # your existing chain
    get_session_history,
    input_messages_key="input",
    history_messages_key="history",
)

# Each user gets their own isolated session
chain_with_history.invoke(
    {"input": "I prefer TypeScript over JavaScript"},
    config={"configurable": {"session_id": "user-123"}}  # ← session ID
)`,
            funFact: '🧠 GPT-4\'s context window is 128,000 tokens (~100,000 words — the length of a novel). But each token costs money and slows responses, so ConversationSummaryMemory compresses old messages into a shorter summary automatically!',
            quiz: {
              question: 'What is the downside of ConversationBufferMemory with a very long conversation?',
              options: [
                'It forgets the most recent messages',
                'The entire history is sent with every request — growing costs and latency without limit',
                'It only works with OpenAI models',
                'It cannot store system messages',
              ],
              answer: 1,
              explanation: 'Every LLM call sends ALL prior messages in the context window. If a conversation has 200 exchanges, call 201 sends all 200 previous messages — expensive! Use WindowMemory (last N) or SummaryMemory (compressed) to cap context size.',
            },
          },
          {
            id: 'lc-rag',
            name: 'RAG — Teaching AI Your Documents',
            summary: 'RAG (Retrieval-Augmented Generation) solves the "AI doesn\'t know my data" problem. Instead of training a new model (expensive, weeks), you do 3 things: 1) Split your docs into chunks, 2) Convert chunks to embedding vectors (numbers that capture meaning), 3) At query time, find the most similar chunks and paste them into the prompt. The LLM now answers based on YOUR data, not just its training data.',
            codeExample: `from langchain_community.document_loaders import PyPDFLoader, WebBaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA

# ── Step 1: Load your documents ────────────────────────────────────
loader = PyPDFLoader("company_handbook.pdf")
docs   = loader.load()
# OR load from web:
# docs = WebBaseLoader("https://docs.mycompany.com").load()

# ── Step 2: Split into small chunks (LLMs can't read huge docs at once)
splitter = RecursiveCharacterTextSplitter(
    chunk_size    = 1000,  # each chunk ~1000 characters
    chunk_overlap = 200,   # overlap prevents cutting a sentence mid-way
)
chunks = splitter.split_documents(docs)
print(f"Split {len(docs)} docs into {len(chunks)} chunks")

# ── Step 3: Convert chunks to vector embeddings and store
# Embeddings = numbers that capture semantic meaning
# "furry animal" and "dog" will have similar vectors!
embeddings = OpenAIEmbeddings()
vectorstore = Chroma.from_documents(
    documents = chunks,
    embedding = embeddings,
    persist_directory = "./chroma_db"  # save to disk — don't re-embed every time!
)

# ── Step 4: Create a RAG chain that retrieves then answers
llm = ChatOpenAI(model="gpt-4o-mini")
qa_chain = RetrievalQA.from_chain_type(
    llm       = llm,
    retriever = vectorstore.as_retriever(search_kwargs={"k": 4}),  # top-4 chunks
)

# Ask questions about YOUR documents
answer = qa_chain.invoke("What is our remote work policy?")
print(answer["result"])
# → "According to the company handbook, employees may work remotely up to 3 days..."`,
            funFact: '📐 Vector embeddings are just lists of ~1500 numbers. "King" and "Queen" will have vectors that differ by almost exactly the same amount as "Man" and "Woman". king - man + woman ≈ queen. Math that captures MEANING!',
            quiz: {
              question: 'Why split documents into small chunks before embedding them in RAG?',
              options: [
                'To save disk space',
                'LLMs have limited context windows — you can only inject the most relevant excerpts, not an entire 500-page PDF',
                'Embeddings only work on short text',
                'To make the database queries faster',
              ],
              answer: 1,
              explanation: 'At query time you find the top-K most relevant chunks and inject them into the prompt. If you didn\'t chunk, you\'d need to paste the entire document into every prompt — impossible for large docs and extremely expensive.',
            },
          },
          {
            id: 'lc-tools',
            name: 'Tools — Giving the AI Hands',
            summary: 'A tool is a Python function that an LLM can choose to call. You define the function and describe it in plain English. The LLM reads the description and decides when to use it. This is how AI agents can search the web, run SQL queries, call APIs, or send emails — the LLM picks the right tool for the job.',
            codeExample: `from langchain_core.tools import tool
from langchain_openai import ChatOpenAI

# ── Define tools as simple Python functions with docstrings ────────
# The docstring IS the description the LLM reads to decide when to use the tool!
@tool
def get_stock_price(ticker: str) -> str:
    """Get the current stock price for a given ticker symbol like AAPL or TSLA."""
    # In real life: call an API. Here we fake it.
    prices = {"AAPL": 189.50, "TSLA": 245.10, "GOOGL": 175.30}
    return f"\${prices.get(ticker.upper(), 'Unknown')}"

@tool
def search_web(query: str) -> str:
    """Search the web for recent information about a topic."""
    # In real life: use DuckDuckGo or Tavily search API
    return f"[Search results for '{query}': ...]"

@tool
def run_python(code: str) -> str:
    """Execute Python code and return the output. Use for maths and data analysis."""
    import io, contextlib
    output = io.StringIO()
    with contextlib.redirect_stdout(output):
        exec(code)
    return output.getvalue()

# ── Bind tools to the LLM ──────────────────────────────────────────
llm = ChatOpenAI(model="gpt-4o-mini")
llm_with_tools = llm.bind_tools([get_stock_price, search_web, run_python])

# ── The LLM now decides which tool (if any) to call ───────────────
response = llm_with_tools.invoke("What is Apple's current stock price?")
# LLM response will contain a "tool_call": { name: "get_stock_price", args: { ticker: "AAPL" } }
# You then execute the tool and send the result back to the LLM

print(response.tool_calls)
# → [{'name': 'get_stock_price', 'args': {'ticker': 'AAPL'}, 'id': 'call_abc'}]`,
            funFact: '🔧 OpenAI calls this "function calling", Anthropic calls it "tool use". Under the hood, the LLM outputs a special JSON object saying "call THIS function with THESE arguments". LangChain standardises this across all LLM providers!',
          },
        ],
      },

      // ── Agents ─────────────────────────────────────────────────────────────
      {
        id: 'lc-agents',
        name: 'Agents — AI That Takes Actions',
        level: 'Intermediate',
        description: 'An agent is an LLM in a loop. It thinks → picks a tool → runs it → sees the result → thinks again → picks another tool → … until it has the answer. This is how AI can book flights, write and run code, and solve complex multi-step tasks.',
        concepts: [
          {
            id: 'lc-react-agent',
            name: 'ReAct Agent — Think, Act, Observe',
            summary: 'ReAct (Reasoning + Acting) is the most popular agent pattern. The loop is: 1) Thought: "I need to find today\'s weather", 2) Action: call weather_tool("London"), 3) Observation: "18°C, cloudy", 4) Thought: "Now I have the answer", 5) Final Answer: "It\'s 18°C and cloudy in London." This loop repeats until the agent has enough info to give a final answer.',
            codeExample: `from langchain.agents import create_react_agent, AgentExecutor
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain import hub

# ── Define tools ───────────────────────────────────────────────────
@tool
def calculator(expression: str) -> str:
    """Evaluate a mathematical expression like '15 * 23 + 100'."""
    return str(eval(expression))   # in prod: use a safe math evaluator!

@tool
def get_weather(city: str) -> str:
    """Get current weather for a city."""
    return f"{city}: 22°C, sunny"   # real impl: call weather API

@tool
def web_search(query: str) -> str:
    """Search for recent information from the internet."""
    return f"[Results for: {query}]"  # real impl: Tavily or SerpAPI

tools = [calculator, get_weather, web_search]

# ── Pull a ready-made ReAct prompt from LangChain Hub ──────────────
prompt = hub.pull("hwchase17/react")   # free, battle-tested prompt

llm   = ChatOpenAI(model="gpt-4o-mini", temperature=0)
agent = create_react_agent(llm, tools, prompt)

# ── AgentExecutor runs the Think → Act → Observe loop ──────────────
executor = AgentExecutor(
    agent   = agent,
    tools   = tools,
    verbose = True,     # print each step — great for debugging!
    max_iterations = 5, # safety: stop after 5 tool calls
)

result = executor.invoke({
    "input": "What is 15% of the population of Tokyo? (Tokyo has 13.96 million people)"
})
# The agent will:
# Thought: "I need to calculate 15% of 13.96 million"
# Action:  calculator("13960000 * 0.15")
# Observation: "2094000"
# Final Answer: "15% of Tokyo's population is approx. 2,094,000 people."
print(result["output"])`,
            funFact: '🔄 The ReAct paper (Google, 2022) showed that combining reasoning AND acting in a loop beat pure reasoning by 11% on knowledge-intensive tasks. It\'s the foundation of almost every AI agent built today!',
            quiz: {
              question: 'In the ReAct agent loop, what is an "Observation"?',
              options: [
                'A human message sent to the agent',
                'The result returned by a tool after the agent called it',
                'The agent\'s final answer to the user',
                'A log entry for debugging',
              ],
              answer: 1,
              explanation: 'After the agent calls a tool (Action), it receives the tool\'s output (Observation). The agent then thinks about this observation and decides the next action. This Thought → Action → Observation loop repeats.',
            },
          },
          {
            id: 'lc-agent-prebuilt',
            name: 'Pre-built Agents: SQL, Python & Web',
            summary: 'LangChain ships ready-to-use agents for common tasks. The SQL agent can turn natural language into SQL queries and run them on your real database. The Python REPL agent can write and execute code. You get production-grade agents in 10 lines.',
            codeExample: `# ── SQL Agent — talk to your database in plain English ────────────
from langchain_community.agent_toolkits.sql.base import create_sql_agent
from langchain_community.utilities import SQLDatabase
from langchain_openai import ChatOpenAI

db  = SQLDatabase.from_uri("postgresql://user:pass@localhost:5432/mydb")
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

agent = create_sql_agent(llm=llm, db=db, verbose=True)

result = agent.invoke("How many orders were placed last month and what is the total revenue?")
# Agent auto-generates:
# SELECT COUNT(*), SUM(total) FROM orders
# WHERE created_at >= NOW() - INTERVAL '1 month';
# Then returns: "Last month had 1,247 orders totaling $89,432."
print(result["output"])

# ── Python Code Agent — writes and runs code to answer questions ───
from langchain_experimental.agents.agent_toolkits import create_python_agent
from langchain_experimental.tools.python.tool import PythonREPLTool

python_agent = create_python_agent(
    llm   = llm,
    tool  = PythonREPLTool(),
    verbose = True,
)
result = python_agent.invoke(
    "Generate a list of the first 15 Fibonacci numbers and sum them."
)
# Agent writes Python, runs it, returns the answer
print(result["output"])   # "The first 15 Fibonacci numbers sum to 1596."`,
            funFact: '🤯 The SQL agent inspects your database schema first (table names, column names) so it can write accurate queries — you don\'t have to tell it anything about your schema! It figures it out by running "SHOW TABLES" and "DESCRIBE table" first.',
          },
        ],
      },

      // ── LangGraph ──────────────────────────────────────────────────────────
      {
        id: 'lc-langgraph',
        name: 'LangGraph — AI Workflows',
        level: 'Intermediate',
        description: 'LangGraph turns your AI app into a graph (nodes = steps, edges = connections). This lets you build complex workflows: loops, branches, multiple AI agents collaborating, human-in-the-loop approval, and reliable stateful pipelines that can be paused and resumed.',
        concepts: [
          {
            id: 'lg-what-is',
            name: 'What is LangGraph and Why Use It?',
            summary: 'LangChain chains are LINEAR (A → B → C). Real AI workflows are GRAPHS — they branch ("if the answer is uncertain, search again"), loop ("keep trying until the code passes tests"), and involve multiple agents ("researcher → writer → editor"). LangGraph lets you draw this as an actual graph with nodes (steps) and edges (connections/conditions). It\'s like Airflow or Prefect, but for LLM workflows.',
            codeExample: `# Without LangGraph: linear chain — no ability to loop or branch
chain = prompt | llm | parser    # only goes A → B → C

# With LangGraph: graph that can LOOP and BRANCH
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
import operator

# ── Define the shared state (like a whiteboard everyone reads/writes)
class ResearchState(TypedDict):
    question:      str
    search_results: list[str]
    answer:        str
    is_complete:   bool

# ── Define nodes (each is just a Python function)
def search_node(state: ResearchState) -> ResearchState:
    """Search the web for relevant information."""
    results = web_search(state["question"])
    return {"search_results": [results]}

def answer_node(state: ResearchState) -> ResearchState:
    """Use search results to generate an answer."""
    context = "\\n".join(state["search_results"])
    answer  = llm.invoke(f"Based on: {context}\\nAnswer: {state['question']}")
    return {"answer": answer.content, "is_complete": True}

def should_search_more(state: ResearchState) -> str:
    """Conditional edge: search more or finish?"""
    return END if state["is_complete"] else "search"   # branch!

# ── Build the graph ────────────────────────────────────────────────
graph = StateGraph(ResearchState)
graph.add_node("search", search_node)
graph.add_node("answer", answer_node)
graph.set_entry_point("search")
graph.add_edge("search", "answer")
graph.add_conditional_edges("answer", should_search_more)

app = graph.compile()
result = app.invoke({"question": "What is RAG?", "is_complete": False})
print(result["answer"])`,
            funFact: '📊 LangGraph was released in January 2024 after LangChain found that real production AI systems needed cycles and branches — not just linear chains. The graph metaphor directly mirrors how human decision-making works: gather info → assess → decide whether you need more info.',
            quiz: {
              question: 'What can LangGraph do that a regular LangChain chain cannot?',
              options: [
                'Call OpenAI models',
                'Loop, branch, and have multiple agents collaborate — chains only go in one linear direction',
                'Use retrieval and vector stores',
                'Handle API timeouts',
              ],
              answer: 1,
              explanation: 'A chain is always A → B → C → end. LangGraph supports cycles (loop back if quality is insufficient), conditional branches (do X if Y, else Z), and parallel nodes (multiple agents running simultaneously).',
            },
          },
          {
            id: 'lg-multi-agent',
            name: 'Multi-Agent Workflows',
            summary: 'For complex tasks, you split the work between specialist agents — just like a company has teams. A Supervisor agent decides which specialist to call next. Each specialist (researcher, coder, writer) is its own LangGraph node. The supervisor routes between them based on what needs doing next.',
            codeExample: `from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from typing import TypedDict

llm = ChatOpenAI(model="gpt-4o-mini")

class BlogState(TypedDict):
    topic:    str
    outline:  str
    draft:    str
    feedback: str
    final:    str
    next:     str      # which agent to call next

# ── Specialist agents (each focused on ONE job) ────────────────────
def researcher(state: BlogState) -> BlogState:
    """Creates a structured outline for the blog post."""
    outline = llm.invoke(
        f"Create a 5-point outline for a blog post about: {state['topic']}"
    ).content
    return {"outline": outline, "next": "writer"}

def writer(state: BlogState) -> BlogState:
    """Writes a draft based on the outline."""
    draft = llm.invoke(
        f"Write a blog post based on this outline:\\n{state['outline']}"
    ).content
    return {"draft": draft, "next": "editor"}

def editor(state: BlogState) -> BlogState:
    """Edits and finalises the draft."""
    final = llm.invoke(
        f"Improve this blog post for clarity:\\n{state['draft']}"
    ).content
    return {"final": final, "next": "end"}

# ── Route between agents based on 'next' field ─────────────────────
def route(state: BlogState) -> str:
    return END if state["next"] == "end" else state["next"]

# ── Build the multi-agent graph ────────────────────────────────────
graph = StateGraph(BlogState)
graph.add_node("researcher", researcher)
graph.add_node("writer",     writer)
graph.add_node("editor",     editor)
graph.set_entry_point("researcher")
graph.add_conditional_edges("researcher", route)
graph.add_conditional_edges("writer",     route)
graph.add_conditional_edges("editor",     route)

app = graph.compile()
result = app.invoke({"topic": "How LangGraph works", "next": "researcher"})
print(result["final"])`,
            funFact: '🏭 AutoGPT (2023) was the viral "agent that can do anything" — but it was unreliable and would loop forever. LangGraph solved this with explicit state machines, controlled loops with max iterations, and human approval checkpoints.',
          },
          {
            id: 'lg-human-in-loop',
            name: 'Human-in-the-Loop Approval',
            summary: 'Some AI actions are too risky to run without a human checking first — sending an email, deleting data, or making a purchase. LangGraph supports "interrupt" points that pause the workflow and wait for a human to approve before continuing. The state is saved to disk so you can resume hours later.',
            codeExample: `from langgraph.graph import StateGraph, END
from langgraph.checkpoint.sqlite import SqliteSaver   # persist state to disk
from langchain_openai import ChatOpenAI
from typing import TypedDict

class EmailState(TypedDict):
    task:      str
    draft:     str
    approved:  bool

llm = ChatOpenAI(model="gpt-4o-mini")

def draft_email(state: EmailState) -> EmailState:
    draft = llm.invoke(
        f"Write a professional email to complete this task: {state['task']}"
    ).content
    return {"draft": draft}

def send_email(state: EmailState) -> EmailState:
    """Only runs after human approval."""
    print(f"✅ SENDING EMAIL:\\n{state['draft']}")
    # real impl: use SendGrid or SMTP
    return {}

# ── Compile WITH a checkpointer — enables pause/resume ────────────
memory = SqliteSaver.from_conn_string(":memory:")   # or use PostgreSQL

graph = StateGraph(EmailState)
graph.add_node("draft",       draft_email)
graph.add_node("send",        send_email)
graph.set_entry_point("draft")
# After draft → pause for human review
graph.add_edge("draft", "send")
graph.add_edge("send",  END)

app = graph.compile(
    checkpointer=memory,
    interrupt_before=["send"],   # PAUSE before the send node!
)
config = {"configurable": {"thread_id": "email-001"}}

# Run until the interrupt
app.invoke({"task": "thank the client for signing the contract"}, config)
# → drafts the email, prints it, STOPS HERE

# A human reviews the draft...
print("Current draft:", app.get_state(config).values["draft"])

# Human approves by resuming with None (no new input)
app.invoke(None, config)   # RESUMES → runs send_email`,
            funFact: '⏸️ LangGraph\'s interrupt + checkpointer combo is what makes "agentic apps" production-safe. You can pause a workflow for 3 days waiting for manager approval, then resume exactly where it left off — all state is preserved in the database.',
          },
        ],
      },

      // ── LangSmith ──────────────────────────────────────────────────────────
      {
        id: 'lc-langsmith',
        name: 'LangSmith — Debug & Monitor AI',
        level: 'Beginner',
        description: 'LangSmith is the observability platform for LangChain apps. When your AI agent gives a wrong answer, LangSmith shows you every prompt sent, every tool called, every token spent — so you can find and fix the problem. Think of it as Datadog for AI.',
        concepts: [
          {
            id: 'ls-tracing',
            name: 'Tracing — See Every LLM Call',
            summary: 'Without LangSmith, debugging an AI app is like debugging a web app without logs. You see the final answer but have no idea what went wrong in the middle. LangSmith records every chain step, every prompt sent, every tool called, and every token spent. Enable it with 3 environment variables — LangChain instruments everything else automatically.',
            codeExample: `# ── Enable LangSmith tracing (add to .env file) ───────────────────
import os
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_ENDPOINT"]   = "https://api.smith.langchain.com"
os.environ["LANGCHAIN_API_KEY"]    = "ls__your_api_key"
os.environ["LANGCHAIN_PROJECT"]    = "my-ai-app"   # group traces by project

# That's it! Now EVERY LangChain call is automatically traced.
# No other code changes needed.

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

llm    = ChatOpenAI(model="gpt-4o-mini")
prompt = ChatPromptTemplate.from_messages([("human", "{question}")])
chain  = prompt | llm | StrOutputParser()

# This call is now traced — visible in LangSmith dashboard
result = chain.invoke({"question": "What is Docker?"})

# In LangSmith you'll see:
# ├── Chain run: 234ms total, 0.0003 credits
# │   ├── ChatPromptTemplate: formatted prompt
# │   ├── ChatOpenAI: sent 15 tokens, received 87 tokens
# │   │   full prompt: "What is Docker?"
# │   │   full response: "Docker is a platform..."
# │   └── StrOutputParser: extracted string

# ── Add custom metadata to track things that matter to you ─────────
from langchain_core.tracers.context import tracing_v2_enabled

with tracing_v2_enabled(tags=["production", "v2.1"], metadata={"user_id": "u-123"}):
    result = chain.invoke({"question": "Explain Kubernetes"})
# Now you can filter traces by tag or user_id in the dashboard`,
            funFact: '🔍 LangSmith stores the FULL prompt and response for every LLM call, including all injected context. You can click any trace and see exactly the 2000-token prompt that went to OpenAI — invaluable for debugging "why did it say that?!"',
            quiz: {
              question: 'What is the main purpose of LangSmith in an LLM application?',
              options: [
                'Training custom LLM models',
                'Observability — trace every prompt, tool call, and token so you can debug why the AI gave a wrong answer',
                'Hosting LLM models on your own hardware',
                'Replacing the need for LangChain',
              ],
              answer: 1,
              explanation: 'LangSmith gives you full visibility into every step of your LangChain app. When a RAG chain gives a wrong answer, you can trace back and see: was the retrieval wrong? Was the chunk irrelevant? Was the prompt unclear?',
            },
          },
          {
            id: 'ls-evaluation',
            name: 'Evaluation & Testing AI Outputs',
            summary: 'How do you know if your AI app got better or worse after you changed the prompt? You can\'t test it like normal code (there\'s no exact right answer). LangSmith\'s evaluators score AI outputs on criteria like correctness, relevance, and faithfulness using another LLM as a judge.',
            codeExample: `from langsmith import Client
from langsmith.evaluation import evaluate
from langchain_openai import ChatOpenAI

client = Client()

# ── Create a test dataset ──────────────────────────────────────────
dataset = client.create_dataset(
    dataset_name = "rag-qa-tests",
    description  = "Questions our RAG app should answer correctly",
)
client.create_examples(
    inputs  = [
        {"question": "What is our refund policy?"},
        {"question": "How do I cancel my subscription?"},
    ],
    outputs = [
        {"answer": "Refunds are available within 30 days of purchase."},
        {"answer": "Go to Settings → Billing → Cancel Subscription."},
    ],
    dataset_id = dataset.id,
)

# ── Define the app being tested ────────────────────────────────────
def my_rag_app(inputs: dict) -> dict:
    # your actual chain/agent goes here
    result = qa_chain.invoke(inputs["question"])
    return {"answer": result}

# ── Run evaluation ─────────────────────────────────────────────────
from langsmith.evaluation import LangChainStringEvaluator

# Uses an LLM to judge if the answer is correct
correctness_eval = LangChainStringEvaluator(
    "labeled_criteria",
    config={"criteria": "correctness"},
    prepare_data=lambda run, example: {
        "prediction": run.outputs["answer"],
        "reference":  example.outputs["answer"],
        "input":      example.inputs["question"],
    }
)

results = evaluate(
    my_rag_app,
    data       = "rag-qa-tests",     # dataset name
    evaluators = [correctness_eval],
    experiment_prefix = "rag-v2",    # track this as experiment version 2
)
# Results show: 8/10 correct (80%) — better than v1 which was 65% ✅`,
            funFact: '⚖️ "LLM as judge" evaluation was pioneered by Google\'s MT-Bench paper (2023). Having a powerful LLM (GPT-4) score the output of a weaker LLM correlates surprisingly well with human judgement — and costs 1000x less than hiring human raters!',
          },
          {
            id: 'ls-observability-prod',
            name: 'Monitoring Production AI Apps',
            summary: 'Once your AI app is live, you need to track: How many tokens are you spending? Which prompts are slowest? Where are users rating answers as bad? LangSmith\'s monitoring dashboard gives you cost per trace, latency charts, user feedback tracking, and alerts when error rates spike.',
            codeExample: `# ── Capture user feedback in your app ─────────────────────────────
from langchain_core.tracers.langchain import wait_for_all_tracers
from langsmith import Client

client = Client()

# When user clicks 👍 or 👎 in your app, record it against the trace
def record_feedback(run_id: str, is_positive: bool):
    client.create_feedback(
        run_id  = run_id,
        key     = "user_rating",
        score   = 1 if is_positive else 0,
        comment = "thumbs up" if is_positive else "thumbs down",
    )

# ── Get the run ID from the response metadata ──────────────────────
from langchain_core.callbacks import collect_runs
with collect_runs() as cb:
    result = chain.invoke({"question": "How do I reset my password?"})
    run_id = cb.traced_runs[0].id

# User clicks 👎 → record it
record_feedback(run_id, is_positive=False)

# ── Annotate for training data ─────────────────────────────────────
# Low-scored traces can be exported and used to fine-tune your prompts
# LangSmith → Datasets → "Add to Dataset from Traces" (1-click)

# ── Key metrics to monitor in LangSmith Dashboard ─────────────────
# Token usage:   $ per day / per user / per endpoint
# Latency p50/p99: are some queries taking 10x longer?
# Error rate:    how often did a tool call fail?
# Feedback:      thumbs-up rate over time (is quality improving?)`,
            funFact: '💰 Token costs are the OPEX of AI apps. GPT-4o-mini is ~100x cheaper than GPT-4. LangSmith lets you see exactly how tokens are split between prompt (your instructions + retrieved context) and completion (the actual answer) — helping you cut costs by trimming unnecessary prompt context.',
          },
        ],
      },

      // ── LangServe & Deployment ──────────────────────────────────────────────
      {
        id: 'lc-deployment',
        name: 'LangServe & Production Deployment',
        level: 'Intermediate',
        description: 'LangServe turns any LangChain chain or agent into a REST API with zero boilerplate. Combine with Docker and a cloud provider to deploy your AI app to production.',
        concepts: [
          {
            id: 'ls-langserve',
            name: 'LangServe — Chain as a REST API',
            summary: 'LangServe wraps any LangChain chain in FastAPI routes automatically. You get /invoke, /batch, /stream, and /stream_log endpoints for free. It also generates an interactive playground UI at /chain/playground where you can test your chain in the browser.',
            codeExample: `pip install "langserve[server]"

# serve.py
from fastapi import FastAPI
from langserve import add_routes
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

app = FastAPI(title="My AI API")

llm    = ChatOpenAI(model="gpt-4o-mini")
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant."),
    ("human",  "{question}"),
])
chain = prompt | llm | StrOutputParser()

# This ONE LINE creates 4 REST endpoints automatically!
add_routes(app, chain, path="/chat")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

# ── Auto-generated endpoints ───────────────────────────────────────
# POST /chat/invoke              ← single call
# POST /chat/batch               ← multiple inputs at once
# POST /chat/stream              ← Server-Sent Events (token by token)
# GET  /chat/input_schema        ← OpenAPI schema for inputs
# GET  /chat/playground          ← interactive browser UI!

# ── Call from your frontend (or curl) ─────────────────────────────
# curl http://localhost:8000/chat/invoke \\
#   -d '{"input": {"question": "What is Docker?"}}' \\
#   -H 'Content-Type: application/json'

# ── Client SDK (no manual HTTP needed) ────────────────────────────
from langserve import RemoteRunnable

remote_chain = RemoteRunnable("http://localhost:8000/chat")
result = remote_chain.invoke({"question": "Explain LangChain in 1 sentence"})
print(result)   # works exactly like a local chain!`,
            funFact: '🚀 LangServe\'s /playground endpoint gives you a beautiful UI to test your chain with different inputs, see the full trace, and share it with your team — all without writing any frontend code. Great for demos!',
            quiz: {
              question: 'What endpoints does LangServe automatically create when you call add_routes(app, chain, path="/chat")?',
              options: [
                'Only GET /chat',
                '/chat/invoke (single), /chat/batch (multiple), /chat/stream (streaming), plus a browser playground UI',
                'You have to define each endpoint manually',
                'Only REST endpoints — no streaming support',
              ],
              answer: 1,
              explanation: 'LangServe generates /invoke, /batch, /stream, /stream_log, /input_schema, and /playground automatically. One add_routes call replaces writing 6+ FastAPI route handlers by hand.',
            },
          },
        ],
      },
    ],
  },
];
