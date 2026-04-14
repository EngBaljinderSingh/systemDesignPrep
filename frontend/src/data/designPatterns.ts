export type PatternCategory = 'SOLID' | 'Creational' | 'Structural' | 'Behavioral';

export interface DesignPattern {
  id: string;
  name: string;
  abbrev?: string;
  category: PatternCategory;
  intent: string;
  problem: string;
  solution: string;
  javaExample: string;
  consequences: string[];
  realWorldExamples: string[];
  relatedPatterns: string[];
  mnemonic: string;
}

export const CATEGORY_ORDER: PatternCategory[] = ['SOLID', 'Creational', 'Structural', 'Behavioral'];

export const CATEGORY_COLORS: Record<PatternCategory, string> = {
  SOLID:       'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  Creational:  'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Structural:  'bg-green-500/20 text-green-300 border-green-500/30',
  Behavioral:  'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

export const designPatterns: DesignPattern[] = [
  // ─── SOLID ──────────────────────────────────────────────────────────────
  {
    id: 'srp',
    name: 'Single Responsibility Principle',
    abbrev: 'S',
    category: 'SOLID',
    intent: 'A class should have only one reason to change.',
    problem: 'A class handling both business logic and persistence is hard to test and modify. Changing DB schema forces edits in business logic.',
    solution: 'Split concerns into separate classes. UserService → business logic; UserRepository → persistence; EmailService → notifications.',
    javaExample: `// ❌ Violation — does too much
class UserManager {
  public void saveUser(User user)          { /* DB logic    */ }
  public void sendWelcomeEmail(User user)  { /* Email logic  */ }
  public boolean validateUser(User user)   { /* Validation   */ }
}

// ✅ SRP Applied — each class has one reason to change
@Repository class UserRepository { public void save(User u) { /* DB only   */ } }
@Service   class EmailService    { public void welcome(User u) { /* email */ } }
@Component class UserValidator   { public boolean validate(User u) { return true; } }`,
    consequences: [
      'Each class is easier to test in isolation',
      'Changes in one concern don\'t ripple into unrelated code',
      'More classes to manage (a worthwhile trade-off)',
    ],
    realWorldExamples: [
      'Spring\'s @Service / @Repository / @Component separation',
      'CQRS — separate command handler vs query handler',
    ],
    relatedPatterns: ['dip', 'facade'],
    mnemonic: 'One class, one job — like a chef who only cooks, not serves tables.',
  },
  {
    id: 'ocp',
    name: 'Open/Closed Principle',
    abbrev: 'O',
    category: 'SOLID',
    intent: 'Software entities should be open for extension but closed for modification.',
    problem: 'Adding a new discount type requires editing a long if/else chain — every edit risks breaking existing logic.',
    solution: 'Define a DiscountStrategy interface. Each new discount is a new class. Existing code stays untouched.',
    javaExample: `// ❌ Violation — add new type = edit existing code
double applyDiscount(String type, double price) {
  if (type.equals("STUDENT"))  return price * 0.9;
  if (type.equals("EMPLOYEE")) return price * 0.8;
  return price; // must edit here for every new type
}

// ✅ OCP Applied — new type = new class only
@FunctionalInterface
interface DiscountStrategy { double apply(double price); }

class StudentDiscount  implements DiscountStrategy { public double apply(double p) { return p * 0.9; } }
class EmployeeDiscount implements DiscountStrategy { public double apply(double p) { return p * 0.8; } }
class SeasonalDiscount implements DiscountStrategy { public double apply(double p) { return p * 0.7; } }

class PriceCalculator {
  double calculate(double price, DiscountStrategy strategy) {
    return strategy.apply(price); // zero changes needed for new strategies
  }
}`,
    consequences: [
      'New features delivered via new classes, not edits to existing ones',
      'Existing code stays stable and regression-free',
      'Requires upfront abstraction design',
    ],
    realWorldExamples: [
      'Spring\'s HandlerInterceptor chain',
      'java.util.Comparator for sorting strategies',
      'Plugin/extension systems',
    ],
    relatedPatterns: ['strategy', 'factory-method'],
    mnemonic: 'Add a new floor to a skyscraper without demolishing existing floors.',
  },
  {
    id: 'lsp',
    name: 'Liskov Substitution Principle',
    abbrev: 'L',
    category: 'SOLID',
    intent: 'Subtypes must be substitutable for their base types without breaking program correctness.',
    problem: 'Square extends Rectangle but overrides setWidth to also set height — a client expecting a Rectangle breaks silently.',
    solution: 'Don\'t inherit just for code reuse. Use a common interface if IS-A doesn\'t fully hold.',
    javaExample: `// ❌ LSP violation — Square changes Rectangle's behaviour
class Rectangle {
  protected int w, h;
  void setWidth(int w)  { this.w = w; }
  void setHeight(int h) { this.h = h; }
  int area() { return w * h; }
}
class Square extends Rectangle {
  @Override void setWidth(int w)  { this.w = w; this.h = w; } // breaks expectation!
  @Override void setHeight(int h) { this.w = h; this.h = h; }
}

// Rectangle r = new Square();
// r.setWidth(5); r.setHeight(3); → area = 9, not 15!

// ✅ LSP fix — honourable IS-A via common interface
interface Shape { int area(); }
class Rectangle implements Shape { private int w, h; ... public int area() { return w*h; } }
class Square    implements Shape { private int s;    ... public int area() { return s*s; } }`,
    consequences: [
      'Polymorphism works correctly — no surprising side effects',
      'Clients using base types need no instanceof checks',
      'Forces honest IS-A relationships',
    ],
    realWorldExamples: [
      'ArrayList and LinkedList are true List substitutes',
      'Spring beans are substitutable implementations of their interfaces',
    ],
    relatedPatterns: ['isp', 'factory-method'],
    mnemonic: 'A penguin IS-A bird but can\'t fly  — don\'t force it to implement fly().',
  },
  {
    id: 'isp',
    name: 'Interface Segregation Principle',
    abbrev: 'I',
    category: 'SOLID',
    intent: 'No client should be forced to depend on methods it does not use.',
    problem: 'A fat Worker interface with work(), eat(), and sleep() forces a Robot class to implement eat() — nonsensical.',
    solution: 'Split into Workable, Eatable, Sleepable. Robot only implements Workable.',
    javaExample: `// ❌ Fat interface — Robot must fake eat() and sleep()
interface Worker { void work(); void eat(); void sleep(); }
class Robot implements Worker {
  public void work() { /* ok */ }
  public void eat()  { throw new UnsupportedOperationException(); } // 💥
  public void sleep(){ throw new UnsupportedOperationException(); }
}

// ✅ ISP — segregated, focused interfaces
interface Workable  { void work(); }
interface Eatable   { void eat(); }
interface Sleepable { void sleep(); }

class Robot implements Workable  { public void work() { /* fine */ } }
class Human implements Workable, Eatable, Sleepable { /* implements all */ }`,
    consequences: [
      'No empty or exception-throwing implementations',
      'Smaller interfaces are easier to mock in unit tests',
      'More interfaces to manage (worth it for testability)',
    ],
    realWorldExamples: [
      'java.io.Closeable vs AutoCloseable',
      'Spring\'s InitializingBean vs DisposableBean',
      'Java 8+ default methods for optional behaviour',
    ],
    relatedPatterns: ['srp', 'dip'],
    mnemonic: 'Don\'t give a vegetarian a menu with only meat dishes.',
  },
  {
    id: 'dip',
    name: 'Dependency Inversion Principle',
    abbrev: 'D',
    category: 'SOLID',
    intent: 'High-level modules should not depend on low-level modules. Both should depend on abstractions.',
    problem: 'OrderService directly instantiates MySQLOrderRepo — swapping to MongoDB requires editing OrderService.',
    solution: 'Define an OrderRepository interface. OrderService depends on the interface; Spring\'s IoC injects the implementation.',
    javaExample: `// ❌ High-level depends on low-level detail
class OrderService {
  private MySQLOrderRepo repo = new MySQLOrderRepo(); // hard-wired!
}

// ✅ DIP — depend on abstraction, inject concrete via constructor
interface OrderRepository { void save(Order o); List<Order> findAll(); }

@Repository class MySQLOrderRepo implements OrderRepository { /* MySQL */ }
@Repository class MongoOrderRepo  implements OrderRepository { /* Mongo — just swap @Primary */ }

@Service
class OrderService {
  private final OrderRepository repo; // depends on abstraction
  OrderService(OrderRepository repo) { this.repo = repo; } // Spring injects

  public void placeOrder(Order order) { repo.save(order); }
}`,
    consequences: [
      'Easy to swap implementations without touching high-level code',
      'Highly testable — just mock the interface',
      'Foundation of Spring\'s entire IoC container',
    ],
    realWorldExamples: [
      'Spring @Autowired / constructor injection',
      'JPA\'s EntityManager interface over Hibernate',
      'Java JDBC DriverManager interface',
    ],
    relatedPatterns: ['srp', 'factory-method'],
    mnemonic: 'Electrical sockets don\'t care about the appliance — both depend on the standard plug shape.',
  },

  // ─── CREATIONAL ─────────────────────────────────────────────────────────
  {
    id: 'singleton',
    name: 'Singleton',
    category: 'Creational',
    intent: 'Ensure a class has only one instance and provide a global access point to it.',
    problem: 'Multiple database connection pools or config managers waste resources and cause inconsistency.',
    solution: 'Private constructor + static singletons. Enum-based Singleton is the safest in Java.',
    javaExample: `// ✅ Enum Singleton — serialization-safe, thread-safe (Josh Bloch recommendation)
public enum DatabasePool {
  INSTANCE;
  private final HikariCP pool = new HikariCP(10);
  public Connection getConnection() { return pool.acquire(); }
}
// Usage: DatabasePool.INSTANCE.getConnection()

// ✅ Double-checked locking (when enum is not suitable)
public class AppConfig {
  private static volatile AppConfig instance; // volatile prevents instruction reordering
  private AppConfig() {}
  public static AppConfig getInstance() {
    if (instance == null) {
      synchronized (AppConfig.class) {
        if (instance == null) instance = new AppConfig();
      }
    }
    return instance;
  }
}`,
    consequences: [
      'Controlled access to sole instance',
      'Global state makes unit testing harder (use Spring @Scope("singleton") instead)',
      'Hard to subclass',
    ],
    realWorldExamples: [
      'Spring beans are singletons by default (@Scope("singleton"))',
      'java.lang.Runtime.getRuntime()',
      'SLF4J LoggerFactory.getLogger()',
    ],
    relatedPatterns: ['factory-method', 'facade'],
    mnemonic: 'Like a country\'s president — one at a time, globally known.',
  },
  {
    id: 'factory-method',
    name: 'Factory Method',
    category: 'Creational',
    intent: 'Define an interface for creating an object, but let subclasses decide which class to instantiate.',
    problem: 'Hardcoding new Truck() or new Ship() in logistics code prevents easy extension to new transport types.',
    solution: 'Abstract createTransport() — subclasses return the appropriate product type.',
    javaExample: `// Product interface
interface Notification { void send(String message); }
class EmailNotification implements Notification { public void send(String m) { /* SMTP */ } }
class SMSNotification   implements Notification { public void send(String m) { /* Twilio */ } }

// Creator — defines factory method
abstract class NotificationService {
  abstract Notification createNotification(); // ← factory method

  public void notify(String msg) {
    createNotification().send(msg); // calls subclass product
  }
}

class EmailService extends NotificationService {
  @Override Notification createNotification() { return new EmailNotification(); }
}
class SMSService extends NotificationService {
  @Override Notification createNotification() { return new SMSNotification(); }
}

// Spring equivalent: @Bean methods in @Configuration are factory methods
@Bean NotificationService notificationService() { return new EmailService(); }`,
    consequences: [
      'Eliminates tight coupling between creator and concrete products',
      'Adding new products requires only a new subclass/config — OCP satisfied',
      'Can result in many parallel class hierarchies',
    ],
    realWorldExamples: [
      'Spring\'s BeanFactory.getBean()',
      'java.util.Calendar.getInstance()',
      'JDBC DriverManager.getConnection()',
    ],
    relatedPatterns: ['abstract-factory', 'prototype', 'ocp'],
    mnemonic: 'A franchise gives you the "how" — each local store decides the local "what".',
  },
  {
    id: 'builder',
    name: 'Builder',
    category: 'Creational',
    intent: 'Construct complex objects step by step, separating construction from representation.',
    problem: 'A User with 10 optional fields leads to telescoping constructors or inconsistent partially-built objects.',
    solution: 'Builder accumulates fields fluently; build() validates and returns immutable object.',
    javaExample: `// Lombok @Builder generates all boilerplate automatically
@Builder @Value  // @Value makes it immutable
public class User {
  String  name;
  String  email;
  String  phone;    // optional
  String  address;  // optional
  LocalDate dob;    // optional
}

// Usage — only set what you need
User user = User.builder()
    .name("Alice")
    .email("alice@acme.com")
    .phone("+1-555-0100")
    .build();

// JDK HttpClient uses builder pattern
HttpClient client = HttpClient.newBuilder()
    .version(HttpClient.Version.HTTP_2)
    .connectTimeout(Duration.ofSeconds(10))
    .followRedirects(HttpClient.Redirect.NORMAL)
    .build();`,
    consequences: [
      'Readable, fluent API for complex object construction',
      'Immutable result when combined with @Value or records',
      'Slightly more verbosity vs constructors — use Lombok to eliminate it',
    ],
    realWorldExamples: [
      'Lombok @Builder in every Spring Boot project',
      'Spring MockMvc request builders in tests',
      'java.lang.StringBuilder',
    ],
    relatedPatterns: ['factory-method', 'prototype'],
    mnemonic: 'Building a burger: choose bun, patty, toppings — then press and serve.',
  },
  {
    id: 'prototype',
    name: 'Prototype',
    category: 'Creational',
    intent: 'Create new objects by copying an existing prototype rather than constructing from scratch.',
    problem: 'Creating a complex document template from scratch on every request is expensive.',
    solution: 'Implement clone(). Copy the prototype and customise only the delta.',
    javaExample: `// Deep clone with copy constructor (preferred over Cloneable)
public class ReportTemplate {
  private String title;
  private List<String> sections;

  // Copy constructor — explicit deep copy
  public ReportTemplate(ReportTemplate source) {
    this.title    = source.title;
    this.sections = new ArrayList<>(source.sections); // deep copy!
  }

  public ReportTemplate clone() { return new ReportTemplate(this); }
}

// Registry pattern + Prototype
class TemplateRegistry {
  private static final Map<String, ReportTemplate> cache = new HashMap<>();

  static { cache.put("quarterly", new ReportTemplate("Q4 Report", ...)); }

  public static ReportTemplate get(String key) {
    return cache.get(key).clone(); // clone, then customise
  }
}`,
    consequences: [
      'Avoids costly initialisation — clone is much faster than new',
      'Deep vs shallow copy complexity is the main pitfall',
      'Reduces subclass explosion',
    ],
    realWorldExamples: [
      'Spring prototype-scoped beans (@Scope("prototype"))',
      'JavaScript\'s Object.create() / spread operator',
      'Copy-on-write collections in JVM',
    ],
    relatedPatterns: ['factory-method', 'composite'],
    mnemonic: 'Photocopying a filled form is faster than filling it out from scratch.',
  },

  // ─── STRUCTURAL ──────────────────────────────────────────────────────────
  {
    id: 'adapter',
    name: 'Adapter',
    category: 'Structural',
    intent: 'Convert the interface of a class into another interface that clients expect.',
    problem: 'A new payment service expects JSON; the legacy gateway speaks XML. You can\'t modify either.',
    solution: 'An Adapter wraps the legacy gateway, translating JSON → XML requests and XML → JSON responses.',
    javaExample: `// Target interface (what our system expects)
interface JsonPaymentGateway {
  PaymentResult charge(JsonPayload payload);
}

// Adaptee (existing legacy system — cannot change)
class LegacyXmlGateway {
  XmlResult chargeXml(XmlRequest req) { /* legacy EJB logic */ return new XmlResult(); }
}

// Adapter — bridges the gap
class PaymentGatewayAdapter implements JsonPaymentGateway {
  private final LegacyXmlGateway legacy;

  PaymentGatewayAdapter(LegacyXmlGateway l) { this.legacy = l; }

  @Override
  public PaymentResult charge(JsonPayload payload) {
    XmlRequest xml    = XmlConverter.from(payload);  // adapt input
    XmlResult  result = legacy.chargeXml(xml);        // delegate
    return JsonConverter.from(result);                // adapt output
  }
}`,
    consequences: [
      'Integrates incompatible interfaces without modifying existing code',
      'Follows OCP — extends functionality via composition',
      'Adds an extra indirection layer',
    ],
    realWorldExamples: [
      'java.io.InputStreamReader (adapts InputStream → Reader)',
      'Spring\'s HandlerAdapter for controllers',
      'Arrays.asList() adapts array to List',
    ],
    relatedPatterns: ['decorator', 'facade', 'proxy'],
    mnemonic: 'A world-travel power adapter — your US plug works in any socket worldwide.',
  },
  {
    id: 'decorator',
    name: 'Decorator',
    category: 'Structural',
    intent: 'Attach additional responsibilities to an object dynamically without subclassing.',
    problem: 'You need logging + caching + retry on a service. Subclassing creates a combinatorial explosion.',
    solution: 'Each cross-cutting concern is a Decorator that wraps the service and adds behaviour before/after.',
    javaExample: `interface OrderService { OrderResult place(Order o); }

class OrderServiceImpl implements OrderService {
  public OrderResult place(Order o) { /* core logic */ return new OrderResult(); }
}

// Logging decorator
class LoggingOrderService implements OrderService {
  private final OrderService delegate;
  LoggingOrderService(OrderService s) { this.delegate = s; }
  public OrderResult place(Order o) {
    log.info("Placing order {}", o.id());
    OrderResult r = delegate.place(o);
    log.info("Order placed: {}", r.status());
    return r;
  }
}

// Caching decorator
class CachingOrderService implements OrderService {
  private final OrderService delegate;
  private final Cache cache;
  // similar wrapping...
}

// Compose at startup — Spring AOP does this automatically for @Transactional etc.
OrderService service =
  new LoggingOrderService(
    new CachingOrderService(
      new OrderServiceImpl()));`,
    consequences: [
      'Combines behaviours at runtime without subclassing',
      'Order of decorators matters — most specific wraps outermost',
      'Many small wrapper objects; can be trickier to debug',
    ],
    realWorldExamples: [
      'java.io.BufferedReader(new FileReader(...))',
      'Spring\'s TransactionAwareDataSourceProxy',
      'Collections.unmodifiableList() / synchronizedList()',
    ],
    relatedPatterns: ['composite', 'adapter', 'strategy'],
    mnemonic: 'Adding ornaments to a Christmas tree — each one adds without replacing the base.',
  },
  {
    id: 'facade',
    name: 'Facade',
    category: 'Structural',
    intent: 'Provide a simple, unified interface to a complex subsystem.',
    problem: 'Client code must orchestrate 5 subsystems (auth, inventory, payment, shipping, notifications) — tightly coupled and complex.',
    solution: 'OrderFacade exposes single placeOrder() method orchestrating all subsystems behind the scenes.',
    javaExample: `// Complex subsystems (each has its own complexity)
@Service class AuthService        { boolean authenticate(User u) { return true; } }
@Service class InventoryService   { boolean reserve(String sku)  { return true; } }
@Service class PaymentService     { void charge(Card c, double amt) { /* Stripe */ } }
@Service class ShippingService    { void schedule(Order o) { /* DHL */ } }
@Service class NotificationService{ void confirm(Order o) { /* SMS/email */ } }

// Facade — one clean entry point for all of the above
@Service
public class OrderFacade {
  // Spring constructor injection of all subsystems...

  public OrderResult placeOrder(User user, Cart cart, Card card) {
    if (!auth.authenticate(user)) throw new AccessDeniedException("Unauthorized");
    cart.items().forEach(i -> inventory.reserve(i.sku()));
    payment.charge(card, cart.total());
    Order order = save(user, cart);
    shipping.schedule(order);
    notification.confirm(order);
    return OrderResult.success(order);
  }
}`,
    consequences: [
      'Hides subsystem complexity — clients have one clean API',
      'Promotes loose coupling between client and subsystems',
      'Facade can become a "god object" — keep it orchestration-only',
    ],
    realWorldExamples: [
      'Spring\'s JdbcTemplate (facade over JDBC boilerplate)',
      'SLF4J over Log4j/Logback',
      'AWS SDK high-level S3Client over raw HTTP requests',
    ],
    relatedPatterns: ['adapter', 'singleton', 'mediator'],
    mnemonic: 'A hotel concierge — say "need a dinner reservation" and they handle everything.',
  },
  {
    id: 'proxy',
    name: 'Proxy',
    category: 'Structural',
    intent: 'Provide a surrogate for another object to control access, add lazy loading, or add cross-cutting concerns.',
    problem: 'Loading a huge image on every call is expensive; you want lazy loading. Alternatively, you need transparent logging/auth without changing the target.',
    solution: 'Proxy implements the same interface and delegates to the real object on demand.',
    javaExample: `interface Image { void display(); }

class RealImage implements Image {
  private final String filename;
  RealImage(String f) { this.filename = f; System.out.println("Loaded: " + f); }
  public void display() { System.out.println("Showing: " + filename); }
}

// Virtual (lazy-loading) proxy
class ImageProxy implements Image {
  private final String filename;
  private RealImage real; // null until first access
  ImageProxy(String f) { this.filename = f; }
  public void display() {
    if (real == null) real = new RealImage(filename); // initialise on demand
    real.display();
  }
}

// Spring AOP dynamic proxy — transparent to callers
@Service
class ProductService {
  @Transactional            // Spring wraps this with a Proxy at startup
  @Cacheable("products")    // another Proxy layer
  public List<Product> findAll() { return repo.findAll(); }
}`,
    consequences: [
      'Lazy initialisation improves startup time',
      'Logging, security, caching added transparently without changing target',
      'Extra indirection — can confuse stack traces',
    ],
    realWorldExamples: [
      'Spring AOP (@Transactional, @Cacheable, @Async)',
      'Hibernate lazy-loaded associations (CGLIB proxy)',
      'Java RMI remote proxies',
    ],
    relatedPatterns: ['decorator', 'adapter'],
    mnemonic: 'A credit card proxies your bank account — same interface, controlled access.',
  },

  // ─── BEHAVIORAL ──────────────────────────────────────────────────────────
  {
    id: 'observer',
    name: 'Observer',
    category: 'Behavioral',
    intent: 'Define a one-to-many dependency so that when one object changes state, all dependents are notified automatically.',
    problem: 'An order placement needs to trigger email, SMS, and analytics — direct calls create tight coupling.',
    solution: 'OrderService publishes an event; Email, SMS, and Analytics handlers independently subscribe.',
    javaExample: `// Spring Event-Driven Observer (recommended approach)
record OrderPlacedEvent(Order order) {}

@Service
class OrderService {
  @Autowired ApplicationEventPublisher events;

  public void placeOrder(Order order) {
    // ... core business logic ...
    events.publishEvent(new OrderPlacedEvent(order)); // fire-and-forget
  }
}

// Subscribers — fully decoupled, can be in any @Component
@Component class EmailNotifier {
  @EventListener
  void onOrderPlaced(OrderPlacedEvent e) { /* send email */ }
}

@Component class AnalyticsTracker {
  @EventListener @Async   // runs in separate thread
  void onOrderPlaced(OrderPlacedEvent e) { /* track */ }
}

@Component class InventoryUpdater {
  @TransactionalEventListener(phase = AFTER_COMMIT) // only on TX success
  void onOrderPlaced(OrderPlacedEvent e) { /* update stock */ }
}`,
    consequences: [
      'Loose coupling — subject knows nothing about its observers',
      'Easy to add new reactions without changing OrderService',
      'Observers notified in non-deterministic order unless you @Order',
    ],
    realWorldExamples: [
      'Spring ApplicationEvent / @EventListener',
      'Kafka — producers and consumer groups',
      'JavaScript addEventListener()',
    ],
    relatedPatterns: ['mediator', 'strategy'],
    mnemonic: 'YouTube subscriptions — one upload notifies millions of subscribers automatically.',
  },
  {
    id: 'strategy',
    name: 'Strategy',
    category: 'Behavioral',
    intent: 'Define a family of algorithms, encapsulate each one, and make them interchangeable at runtime.',
    problem: 'Payment processing with if/else for Credit, PayPal, Crypto is a maintenance nightmare. Adding a new method requires editing the core class.',
    solution: 'Each algorithm lives in its own class implementing a common interface. Swap at runtime.',
    javaExample: `@FunctionalInterface
interface PaymentStrategy { PaymentResult pay(double amount); }

@Component("CREDIT_CARD")
class CreditCardStrategy implements PaymentStrategy {
  public PaymentResult pay(double amount) { /* Stripe API */ }
}
@Component("PAYPAL")
class PayPalStrategy implements PaymentStrategy {
  public PaymentResult pay(double amount) { /* PayPal API */ }
}

@Service
class CheckoutService {
  private final Map<String, PaymentStrategy> strategies;
  CheckoutService(Map<String, PaymentStrategy> strategies) {
    this.strategies = strategies; // Spring auto-maps by bean name
  }
  public PaymentResult checkout(Cart cart, String method) {
    PaymentStrategy strategy = strategies.get(method);
    if (strategy == null) throw new IllegalArgumentException("Unknown: " + method);
    return strategy.pay(cart.total());
  }
}

// Java 8+ — strategy as lambda (for simple cases)
List<Order> sorted = orders.stream()
    .sorted(Comparator.comparing(Order::total).reversed())
    .toList();`,
    consequences: [
      'Algorithms are interchangeable at runtime without touching callers',
      'Eliminates conditional statements in business logic',
      'Clients must know the available strategies',
    ],
    realWorldExamples: [
      'java.util.Comparator',
      'Spring Security AuthenticationProvider chain',
      'javax.servlet.Filter chain',
    ],
    relatedPatterns: ['template-method', 'command', 'ocp'],
    mnemonic: 'GPS navigation — same destination, choose: fastest, shortest, or scenic route.',
  },
  {
    id: 'command',
    name: 'Command',
    category: 'Behavioral',
    intent: 'Encapsulate a request as an object, enabling undo/redo, queuing, and transactional operations.',
    problem: 'Implementing undo/redo in a text editor requires storing the history of every mutation.',
    solution: 'Each mutation is a Command object with execute() and undo(). Push to history stack on execute.',
    javaExample: `interface Command { void execute(); void undo(); }

class TextEditor {
  private final StringBuilder buffer = new StringBuilder();
  private final Deque<Command> history = new ArrayDeque<>();

  void execute(Command cmd) { cmd.execute(); history.push(cmd); }
  void undo()               { if (!history.isEmpty()) history.pop().undo(); }
}

class InsertCommand implements Command {
  private final StringBuilder buf;
  private final String text;
  InsertCommand(StringBuilder b, String t) { this.buf = b; this.text = t; }
  public void execute() { buf.append(text); }
  public void undo()    { buf.delete(buf.length() - text.length(), buf.length()); }
}

// Spring Batch: each Step is a Command — rollback is undo
// @Transactional with rollback on exception is command + undo`,
    consequences: [
      'Natural undo/redo via a history stack',
      'Commands can be queued, logged, or replicated',
      'Class count grows with every new operation',
    ],
    realWorldExamples: [
      'Spring Batch Step execution',
      'java.lang.Runnable / Callable',
      'Git commits (git revert is undo)',
    ],
    relatedPatterns: ['strategy', 'memento'],
    mnemonic: 'A TV remote — each button is a Command object. Power off = undo last state.',
  },
  {
    id: 'template-method',
    name: 'Template Method',
    category: 'Behavioral',
    intent: 'Define the skeleton of an algorithm in a base class, deferring some steps to subclasses.',
    problem: 'Data import pipeline (read → parse → validate → save) is the same for CSV, JSON, and XML — only read and parse differ.',
    solution: 'Abstract base defines the pipeline as final. Subclasses override only the variable steps.',
    javaExample: `abstract class DataImporter {
  // Template method — final ensures the pipeline cannot be overridden
  public final void importData(String source) {
    String      raw  = readData(source);   // ← hook: subclass implements
    List<Row>   rows = parseData(raw);     // ← hook: subclass implements
    validateData(rows);                    // invariant: base class handles
    saveToDatabase(rows);                   // invariant: base class handles
  }

  protected abstract String    readData(String source);
  protected abstract List<Row> parseData(String raw);

  private void validateData(List<Row> rows)  { /* shared validation logic */ }
  private void saveToDatabase(List<Row> rows) { /* shared JPA save logic  */ }
}

class CsvImporter extends DataImporter {
  protected String    readData(String src) { return Files.readString(Path.of(src)); }
  protected List<Row> parseData(String s)  { return CsvParser.parse(s); }
}

class JsonApiImporter extends DataImporter {
  protected String    readData(String url) { return restTemplate.getForObject(url, String.class); }
  protected List<Row> parseData(String s)  { return objectMapper.readValue(s, ROW_LIST_TYPE); }
}`,
    consequences: [
      'Avoids code duplication in invariant pipeline steps',
      'Hollywood Principle: "Don\'t call us, we\'ll call you"',
      'Subclasses can accidentally break the contract without @Override warnings',
    ],
    realWorldExamples: [
      'Spring\'s AbstractBeanFactory',
      'JUnit\'s @BeforeEach / @AfterEach lifecycle',
      'HttpServlet.service() calling doGet() / doPost()',
    ],
    relatedPatterns: ['strategy', 'factory-method'],
    mnemonic: 'Baking recipe template: same steps, different ingredients and temperatures per dish.',
  },
];
