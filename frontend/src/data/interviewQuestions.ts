export type ExperienceLevel = 'Junior' | 'Mid' | 'Senior';
export type Technology =
  | 'Java'
  | 'Spring Boot'
  | 'JavaScript'
  | 'TypeScript'
  | 'React'
  | 'Angular'
  | 'CSS'
  | 'Database'
  | 'JPA'
  | 'Data Structures'
  | 'Java 8'
  | 'Multithreading'
  | 'Frameworks & Patterns'
  | 'Puzzles'
  | 'Coding'
  | 'System Design';

export interface InterviewQuestion {
  id: string;
  question: string;
  answer: string;
  technology: Technology;
  experience: ExperienceLevel[];
  tags: string[];
}

export const interviewQuestions: InterviewQuestion[] = [
  // ── JAVA ──────────────────────────────────────────────────────────────────
  {
    id: 'java-1',
    technology: 'Java',
    experience: ['Junior'],
    tags: ['OOP', 'Basics'],
    question: 'What is the difference between == and .equals() in Java?',
    answer:
      '`==` compares object references (memory addresses). `.equals()` compares the content/value of objects. For primitives, `==` compares values. For `String` and other objects, always use `.equals()` unless you intentionally want reference equality.',
  },
  {
    id: 'java-2',
    technology: 'Java',
    experience: ['Junior', 'Mid'],
    tags: ['Collections'],
    question: 'What is the difference between ArrayList and LinkedList?',
    answer:
      'ArrayList uses a dynamic array internally. Random access O(1), insertion/deletion in middle O(n). LinkedList uses a doubly-linked list. Random access O(n), insertion/deletion at known node O(1). Use ArrayList for read-heavy workloads and LinkedList when frequent insertions/deletions in the middle are needed.',
  },
  {
    id: 'java-3',
    technology: 'Java',
    experience: ['Junior', 'Mid'],
    tags: ['Concurrency'],
    question: 'What is the difference between synchronized and volatile in Java?',
    answer:
      '`volatile` ensures visibility — changes to a variable are immediately visible to all threads. It does NOT guarantee atomicity. `synchronized` provides mutual exclusion AND visibility — only one thread can execute a synchronized block at a time, and changes are flushed to main memory on exit. Use `volatile` for simple flags; use `synchronized` or `java.util.concurrent` locks for compound operations.',
  },
  {
    id: 'java-4',
    technology: 'Java',
    experience: ['Mid', 'Senior'],
    tags: ['Concurrency', 'Threading'],
    question: 'What is the difference between Callable and Runnable?',
    answer:
      'Both can be used to define tasks for a thread. `Runnable.run()` returns void and cannot throw checked exceptions. `Callable<V>.call()` returns a value of type V and can throw checked exceptions. Use `Callable` when you need a result from a thread (via `Future<V>`).',
  },
  {
    id: 'java-5',
    technology: 'Java',
    experience: ['Mid', 'Senior'],
    tags: ['Memory', 'GC'],
    question: 'Explain Java memory model: heap vs stack vs metaspace.',
    answer:
      'Stack: per-thread, stores method frames, local variables, references. LIFO. Fast allocation. Heap: shared across threads. Stores all objects and class instances. Managed by GC. Young generation (Eden + Survivor) and Old generation. Metaspace (Java 8+): replaces PermGen. Stores class metadata. Grows dynamically by default.',
  },
  {
    id: 'java-6',
    technology: 'Java',
    experience: ['Mid', 'Senior'],
    tags: ['Streams', 'Functional'],
    question: 'What is the difference between map() and flatMap() in Java Streams?',
    answer:
      '`map()` applies a 1-to-1 transformation — each element is transformed into exactly one element. `flatMap()` applies a 1-to-many transformation — each element is transformed into a Stream and all resulting streams are flattened into one. Example: `list.stream().flatMap(s -> Arrays.stream(s.split(",")))` splits each string and merges all into a single stream.',
  },
  {
    id: 'java-7',
    technology: 'Java',
    experience: ['Senior'],
    tags: ['Design Patterns', 'Architecture'],
    question: 'What are the SOLID principles and how do you apply them in Java?',
    answer:
      'S — Single Responsibility: a class should have one reason to change. O — Open/Closed: open for extension, closed for modification (use interfaces/abstract classes). L — Liskov Substitution: subclasses should be substitutable for their base class. I — Interface Segregation: prefer many small interfaces over one large one. D — Dependency Inversion: depend on abstractions, not concretions (use dependency injection). Spring Boot enforces DI naturally via @Autowired / constructor injection.',
  },
  {
    id: 'java-8',
    technology: 'Java',
    experience: ['Junior', 'Mid'],
    tags: ['OOP'],
    question: 'What is the difference between abstract class and interface in Java?',
    answer:
      'Abstract class: can have state (fields), constructors, concrete methods. A class can extend only one abstract class. Use when sharing code among related classes. Interface: no state (only constants), all methods are implicitly public. A class can implement multiple interfaces. From Java 8, interfaces can have default and static methods. Use for defining contracts.',
  },
  {
    id: 'java-9',
    technology: 'Java',
    experience: ['Mid', 'Senior'],
    tags: ['Generics'],
    question: 'What is type erasure in Java generics?',
    answer:
      'At compile time, all generic type parameters are erased and replaced with their bounds (or Object if unbounded). This is done for backward compatibility with pre-generics Java code. The result is that generic type information is unavailable at runtime. You cannot do `instanceof List<String>` or create arrays of generic types like `new T[]`.',
  },
  {
    id: 'java-10',
    technology: 'Java',
    experience: ['Mid', 'Senior'],
    tags: ['Exception Handling'],
    question: 'What is the difference between checked and unchecked exceptions?',
    answer:
      'Checked exceptions extend `Exception` (but not `RuntimeException`). They must be declared in the method signature with `throws` or handled with try-catch. Examples: `IOException`, `SQLException`. Unchecked exceptions extend `RuntimeException`. They don\'t need to be declared or caught. Examples: `NullPointerException`, `IllegalArgumentException`. Use checked exceptions for recoverable conditions, unchecked for programming errors.',
  },

  // ── SPRING BOOT ───────────────────────────────────────────────────────────
  {
    id: 'sb-1',
    technology: 'Spring Boot',
    experience: ['Junior'],
    tags: ['Basics'],
    question: 'What is Spring Boot and how is it different from the Spring Framework?',
    answer:
      'Spring Framework is a comprehensive framework for building Java applications. Spring Boot is an opinionated layer on top of Spring that provides auto-configuration, embedded servers (Tomcat/Jetty), and starter POMs to simplify setup. Spring Boot eliminates most XML/Java configuration boilerplate and lets you run a Spring app as a standalone JAR with an embedded server.',
  },
  {
    id: 'sb-2',
    technology: 'Spring Boot',
    experience: ['Junior', 'Mid'],
    tags: ['Dependency Injection'],
    question: 'What is the difference between @Component, @Service, @Repository, and @Controller?',
    answer:
      'All are specializations of @Component and register the class as a Spring bean. @Service — marks business logic layer. @Repository — marks data access layer; also translates persistence exceptions to Spring DataAccessException. @Controller — marks MVC controller; combined with @ResponseBody becomes @RestController. Use the specific annotation that reflects the layer for better readability and tooling support.',
  },
  {
    id: 'sb-3',
    technology: 'Spring Boot',
    experience: ['Junior', 'Mid'],
    tags: ['REST'],
    question: 'What is the difference between @RequestParam and @PathVariable?',
    answer:
      '`@PathVariable` extracts values from the URI path: `GET /users/42` → `@PathVariable Long id`. `@RequestParam` extracts values from query parameters: `GET /users?role=admin` → `@RequestParam String role`. Use @PathVariable for resource identifiers, @RequestParam for optional filters/sorting.',
  },
  {
    id: 'sb-4',
    technology: 'Spring Boot',
    experience: ['Mid', 'Senior'],
    tags: ['Data', 'JPA'],
    question: 'What is the N+1 problem in JPA and how do you fix it?',
    answer:
      'N+1 occurs when you load a list of N parent entities, then JPA issues 1 query per parent to load the child collections — totaling N+1 queries. Fixes: (1) Use `JOIN FETCH` in JPQL to fetch associations in one query. (2) Use `@EntityGraph` to specify fetch paths. (3) Use batch fetching via `@BatchSize`. (4) Use projections / DTOs to fetch only needed fields.',
  },
  {
    id: 'sb-5',
    technology: 'Spring Boot',
    experience: ['Mid', 'Senior'],
    tags: ['Security'],
    question: 'How does Spring Security work at a high level?',
    answer:
      'Spring Security uses a filter chain. Every HTTP request passes through a series of filters before reaching the controller. Key filters include UsernamePasswordAuthenticationFilter (form login), BasicAuthenticationFilter, and JwtAuthenticationFilter (custom). The SecurityContext stores the authenticated principal. You configure security via SecurityFilterChain bean, defining which endpoints are public/protected and which authentication mechanisms to use.',
  },
  {
    id: 'sb-6',
    technology: 'Spring Boot',
    experience: ['Senior'],
    tags: ['Transactions', 'Data'],
    question: 'Explain @Transactional propagation levels.',
    answer:
      'REQUIRED (default): join existing transaction or create a new one. REQUIRES_NEW: always create a new transaction; suspend any existing one. NESTED: create a nested transaction (save point) within the existing one. MANDATORY: must run within an existing transaction; throws if none. NEVER: must NOT run in a transaction; throws if one exists. SUPPORTS: run in transaction if one exists, otherwise non-transactional. NOT_SUPPORTED: always run non-transactionally; suspend any existing.',
  },
  {
    id: 'sb-7',
    technology: 'Spring Boot',
    experience: ['Mid', 'Senior'],
    tags: ['Performance', 'Caching'],
    question: 'How do you implement caching in Spring Boot?',
    answer:
      'Add `@EnableCaching` on a configuration class. Annotate methods with `@Cacheable("cacheName")` to cache results, `@CacheEvict` to remove entries, `@CachePut` to update cache. Spring supports multiple cache providers via abstraction: Caffeine (in-process), Redis (distributed), EhCache. Configure the provider in application.yml (e.g., `spring.cache.type=redis`).',
  },
  {
    id: 'sb-8',
    technology: 'Spring Boot',
    experience: ['Mid'],
    tags: ['Actuator', 'Monitoring'],
    question: 'What is Spring Boot Actuator and what endpoints does it expose?',
    answer:
      'Actuator adds production-ready monitoring endpoints. Key endpoints: `/actuator/health` (health indicators), `/actuator/metrics` (Micrometer metrics), `/actuator/info` (app metadata), `/actuator/env` (environment properties), `/actuator/loggers` (log levels), `/actuator/threaddump`, `/actuator/httptrace`. Enable all via `management.endpoints.web.exposure.include=*`. Secure sensitive endpoints in production.',
  },

  // ── JAVASCRIPT ────────────────────────────────────────────────────────────
  {
    id: 'js-1',
    technology: 'JavaScript',
    experience: ['Junior'],
    tags: ['Basics'],
    question: 'What is the difference between var, let, and const?',
    answer:
      '`var`: function-scoped, hoisted (initialized as undefined), can be re-declared. `let`: block-scoped, hoisted but in TDZ (Temporal Dead Zone) so not accessible before declaration, cannot be re-declared in same scope. `const`: block-scoped, same as let but the binding cannot be reassigned (the object it points to can still be mutated). Prefer `const` by default, use `let` when reassignment is needed, avoid `var`.',
  },
  {
    id: 'js-2',
    technology: 'JavaScript',
    experience: ['Junior', 'Mid'],
    tags: ['Async'],
    question: 'What is the event loop in JavaScript?',
    answer:
      'JavaScript is single-threaded. The event loop allows non-blocking I/O by offloading operations to the browser/Node.js APIs. When an async operation completes, its callback is placed in the task queue (macrotasks: setTimeout, setInterval) or microtask queue (Promises, queueMicrotask). The event loop picks tasks: first empties the microtask queue fully, then processes one macrotask, then empties the microtask queue again, and repeats.',
  },
  {
    id: 'js-3',
    technology: 'JavaScript',
    experience: ['Junior', 'Mid'],
    tags: ['Closures'],
    question: 'What is a closure in JavaScript?',
    answer:
      'A closure is a function that retains access to its lexical scope even when the function is executed outside that scope. Every function in JavaScript is a closure over its surrounding variables. Common use: factory functions, data encapsulation, callbacks that need access to outer variables. Example: a counter function that increments a private `count` variable.',
  },
  {
    id: 'js-4',
    technology: 'JavaScript',
    experience: ['Mid', 'Senior'],
    tags: ['Prototypes', 'OOP'],
    question: 'How does prototypal inheritance work in JavaScript?',
    answer:
      'Every object has a hidden [[Prototype]] link to another object. Property lookup traverses the prototype chain until found or null is reached. Classes in ES6 are syntactic sugar over prototypal inheritance. `Object.create(proto)` creates an object with proto as its prototype. `obj.__proto__` or `Object.getPrototypeOf(obj)` accesses the prototype. Constructor functions set the prototype via `ConstructorFn.prototype`.',
  },
  {
    id: 'js-5',
    technology: 'JavaScript',
    experience: ['Mid', 'Senior'],
    tags: ['Async', 'Promises'],
    question: 'What is the difference between Promise.all, Promise.allSettled, Promise.race, and Promise.any?',
    answer:
      '`Promise.all`: resolves when ALL promises resolve; rejects immediately if any reject (fail-fast). `Promise.allSettled`: waits for ALL promises to settle (resolve or reject), always resolves with array of results. `Promise.race`: resolves/rejects with the first settled promise. `Promise.any`: resolves with the first resolved promise; rejects only if ALL reject (AggregateError).',
  },
  {
    id: 'js-6',
    technology: 'JavaScript',
    experience: ['Junior'],
    tags: ['Types'],
    question: 'What is the difference between null and undefined?',
    answer:
      '`undefined` means a variable has been declared but no value has been assigned, or a function returns no value. `null` is an explicit assignment representing "no value" / intentional absence. `typeof undefined === "undefined"`, `typeof null === "object"` (historical bug). Use `null` for intentional empty values; `undefined` is usually set by the engine.',
  },
  {
    id: 'js-7',
    technology: 'JavaScript',
    experience: ['Mid', 'Senior'],
    tags: ['Performance'],
    question: 'What is debouncing vs throttling?',
    answer:
      'Debounce: delays execution until after a specified time has passed since the last invocation. Useful for search-as-you-type input — fires only after the user stops typing. Throttle: ensures a function fires at most once per specified interval regardless of how many times it\'s called. Useful for scroll or resize events. Libraries like Lodash provide `_.debounce` and `_.throttle`.',
  },

  // ── REACT ─────────────────────────────────────────────────────────────────
  {
    id: 'react-1',
    technology: 'React',
    experience: ['Junior'],
    tags: ['Basics', 'Hooks'],
    question: 'What is the difference between useState and useRef?',
    answer:
      '`useState` holds state that, when updated, triggers a re-render. The value is preserved across renders. `useRef` holds a mutable value that does NOT trigger a re-render when changed. Useful for: accessing DOM nodes, storing previous values, holding mutable values without causing re-render (e.g., timers, animation frame IDs).',
  },
  {
    id: 'react-2',
    technology: 'React',
    experience: ['Junior', 'Mid'],
    tags: ['Hooks', 'Effects'],
    question: 'Explain the useEffect dependency array.',
    answer:
      'useEffect(fn, deps): `[]` — run once after mount. `[a, b]` — run after mount and whenever a or b changes. No array — run after every render. Return a cleanup function to handle teardown (remove listeners, abort fetches, clear timers). Avoid missing dependencies (ESLint rule react-hooks/exhaustive-deps helps catch these).',
  },
  {
    id: 'react-3',
    technology: 'React',
    experience: ['Mid', 'Senior'],
    tags: ['Performance', 'Memoization'],
    question: 'When should you use useMemo vs useCallback?',
    answer:
      '`useMemo(() => expensiveCalc(a, b), [a, b])` — memoizes a computed VALUE. Use when computation is expensive. `useCallback((arg) => doSomething(arg, dep), [dep])` — memoizes a FUNCTION reference. Use when passing callbacks to child components wrapped with React.memo to prevent unnecessary re-renders. Both add complexity; only use when profiling confirms a performance issue.',
  },
  {
    id: 'react-4',
    technology: 'React',
    experience: ['Mid', 'Senior'],
    tags: ['State Management'],
    question: 'What is the Context API and when would you use it over Redux?',
    answer:
      'Context API provides a way to pass data through the component tree without prop drilling. Good for low-frequency updates like theme, locale, auth user. Redux is better for complex state with many actions, need for time-travel debugging, middleware (thunk, saga), or very frequent updates across many components. For most apps, Context + useReducer is sufficient; add Redux when state management complexity justifies it.',
  },
  {
    id: 'react-5',
    technology: 'React',
    experience: ['Mid', 'Senior'],
    tags: ['Rendering', 'Performance'],
    question: 'What is React reconciliation and the virtual DOM?',
    answer:
      'The virtual DOM is an in-memory representation of the real DOM. On state change, React creates a new virtual DOM tree and diffs it against the previous one (reconciliation). Only the changed nodes are updated in the real DOM (batched updates). React uses keys to track list items for efficient reconciliation — keys must be stable, unique identifiers, not array indices.',
  },
  {
    id: 'react-6',
    technology: 'React',
    experience: ['Senior'],
    tags: ['Patterns', 'Advanced'],
    question: 'What are render props and higher-order components (HOCs)? When would you use them vs hooks?',
    answer:
      'HOC: a function that takes a component and returns an enhanced component (e.g., `withAuth(Component)`). Render props: a component that accepts a render function as a prop, passing its internal state to the caller. Both patterns share stateful logic. Hooks are the modern replacement — they\'re simpler, avoid wrapper hell, and compose easily. Use HOCs/render-props mainly when working with class components or library APIs that don\'t support hooks.',
  },
  {
    id: 'react-7',
    technology: 'React',
    experience: ['Junior', 'Mid'],
    tags: ['Basics'],
    question: 'What is the difference between controlled and uncontrolled components?',
    answer:
      'Controlled component: form element value is driven by React state (`value={state}` + `onChange` handler). The component is the single source of truth. Uncontrolled component: form element manages its own state internally; read via `ref`. Use controlled for most form cases (validation, conditional rendering). Use uncontrolled for simple cases like file inputs.',
  },

  // ── ANGULAR ───────────────────────────────────────────────────────────────
  {
    id: 'ng-1',
    technology: 'Angular',
    experience: ['Junior'],
    tags: ['Basics'],
    question: 'What is the difference between a Component and a Directive in Angular?',
    answer:
      'A Component is a Directive with a template (view). It controls a portion of the UI. A Directive adds behavior/structure to an existing element without its own template. Two types of directives: Structural (ngIf, ngFor — change DOM layout) and Attribute (ngClass, ngStyle — change appearance/behavior). Components are the most common building block; use directives to add reusable behavior to elements.',
  },
  {
    id: 'ng-2',
    technology: 'Angular',
    experience: ['Junior', 'Mid'],
    tags: ['Data Binding'],
    question: 'What are the different types of data binding in Angular?',
    answer:
      'Interpolation `{{ value }}` — component → template (one-way). Property binding `[property]="value"` — component → template. Event binding `(event)="handler()"` — template → component. Two-way binding `[(ngModel)]="value"` — both directions (requires FormsModule). Template reference variables `#ref` — access DOM element. Async pipe `observable | async` — unwraps Observable in template.',
  },
  {
    id: 'ng-3',
    technology: 'Angular',
    experience: ['Mid', 'Senior'],
    tags: ['RxJS', 'Observables'],
    question: 'What is the difference between Subject, BehaviorSubject, and ReplaySubject in RxJS?',
    answer:
      'Subject: multicast — emits to current subscribers. No initial value, late subscribers miss past emissions. BehaviorSubject: requires initial value, late subscribers receive the last emitted value immediately on subscribe. ReplaySubject(n): replays the last n emitted values to late subscribers. AsyncSubject: emits only the last value when the source completes.',
  },
  {
    id: 'ng-4',
    technology: 'Angular',
    experience: ['Mid', 'Senior'],
    tags: ['Change Detection'],
    question: 'What is Angular change detection and what is OnPush strategy?',
    answer:
      'By default, Angular checks all components for changes on every event (Default strategy). With `ChangeDetectionStrategy.OnPush`, a component is only checked when: (1) an @Input reference changes, (2) an event originates from the component, (3) an Observable in the template emits via async pipe, (4) manually triggered via ChangeDetectorRef.markForCheck(). OnPush significantly improves performance for large component trees.',
  },
  {
    id: 'ng-5',
    technology: 'Angular',
    experience: ['Mid', 'Senior'],
    tags: ['DI', 'Services'],
    question: 'How does Angular dependency injection work? What is providedIn: root?',
    answer:
      'Angular has a hierarchical DI system. Providers can be registered at: module level (lazy-loaded modules get their own injector), component level (new instance per component), or root level. `@Injectable({ providedIn: "root" })` registers the service as a singleton in the root injector — available app-wide, tree-shaken if unused. Component-level providers create a new instance for each component and its children.',
  },
  {
    id: 'ng-6',
    technology: 'Angular',
    experience: ['Junior', 'Mid'],
    tags: ['Routing'],
    question: 'What is lazy loading in Angular routing and why does it matter?',
    answer:
      'Lazy loading defers loading a feature module until the user navigates to its route. Configuration: `loadChildren: () => import("./feature/feature.module").then(m => m.FeatureModule)`. Benefits: reduces initial bundle size, faster app startup. Angular creates a separate chunk file per lazy-loaded module. In Angular 14+, standalone components can be lazy-loaded directly without a module.',
  },

  // ── CSS ───────────────────────────────────────────────────────────────────
  {
    id: 'css-1',
    technology: 'CSS',
    experience: ['Junior'],
    tags: ['Layout'],
    question: 'What is the difference between Flexbox and CSS Grid?',
    answer:
      'Flexbox is one-dimensional — it lays items out in a row OR column. Best for component-level layout (nav bars, card rows, centering). Grid is two-dimensional — rows AND columns simultaneously. Best for page-level layout, complex overlapping designs. You can (and should) combine them: Grid for overall layout, Flexbox for items within each grid cell.',
  },
  {
    id: 'css-2',
    technology: 'CSS',
    experience: ['Junior'],
    tags: ['Box Model'],
    question: 'What is the CSS box model and what does box-sizing: border-box do?',
    answer:
      'Every element is a box: content + padding + border + margin. By default (box-sizing: content-box), width/height applies to content only — adding padding/border increases the total size. With `box-sizing: border-box`, width/height includes padding and border, making sizing predictable. Most modern CSS resets apply `* { box-sizing: border-box }`.',
  },
  {
    id: 'css-3',
    technology: 'CSS',
    experience: ['Junior', 'Mid'],
    tags: ['Positioning'],
    question: 'What is the difference between position: relative, absolute, fixed, and sticky?',
    answer:
      'relative: offset from its normal position; still in document flow. absolute: removed from flow; positioned relative to nearest positioned ancestor. fixed: removed from flow; positioned relative to viewport; stays on scroll. sticky: hybrid — acts relative until a threshold, then acts fixed within its scroll container. Parent must have `position: relative` for absolute children.',
  },
  {
    id: 'css-4',
    technology: 'CSS',
    experience: ['Mid', 'Senior'],
    tags: ['Specificity', 'Cascade'],
    question: 'How does CSS specificity work?',
    answer:
      'Specificity is calculated as (inline, IDs, classes/attributes/pseudo-classes, elements/pseudo-elements). Inline styles: 1,0,0,0. ID (#id): 0,1,0,0. Class (.class), attribute ([attr]), pseudo-class (:hover): 0,0,1,0. Element (div), pseudo-element (::before): 0,0,0,1. Higher specificity wins. Equal specificity: last rule wins (cascade). `!important` overrides all but should be avoided.',
  },
  {
    id: 'css-5',
    technology: 'CSS',
    experience: ['Junior', 'Mid'],
    tags: ['Responsive'],
    question: 'What is a CSS media query and how do you implement a mobile-first approach?',
    answer:
      'Media queries apply styles conditionally based on viewport size, device type, etc. Mobile-first: start with styles for small screens (base CSS), then use `@media (min-width: 768px)` to add/override styles for larger screens. This is preferred over desktop-first because it ensures a baseline experience on all devices and generally results in smaller CSS for mobile users.',
  },
  {
    id: 'css-6',
    technology: 'CSS',
    experience: ['Mid', 'Senior'],
    tags: ['Variables', 'Modern CSS'],
    question: 'What are CSS custom properties (variables) and how do they differ from preprocessor variables?',
    answer:
      'CSS custom properties (`--primary-color: #3b82f6`) are defined in the cascade and accessible via `var(--primary-color)`. They are scoped to the element they are defined on (:root for global), can be changed at runtime via JavaScript, and respond to media queries and state changes. Preprocessor variables (Sass/LESS) are compiled away at build time — they cannot change at runtime or cascade through the DOM.',
  },

  // ── DATABASE ──────────────────────────────────────────────────────────────
  {
    id: 'db-1',
    technology: 'Database',
    experience: ['Junior', 'Mid', 'Senior'],
    tags: ['Health', 'Operations'],
    question: 'How do you check database health and performance in production?',
    answer:
      'PostgreSQL: `SELECT 1` for liveness. `pg_stat_activity` for active connections and long-running queries. `pg_stat_user_tables` for table stats. `pg_locks` for lock contention. MySQL: `SHOW PROCESSLIST`, `SHOW STATUS`, `SHOW ENGINE INNODB STATUS`. General: monitor connection pool usage, query latency p99, replication lag (for read replicas), disk space, and slow query logs. Spring Boot Actuator `/actuator/health` includes DB health by default.',
  },
  {
    id: 'db-2',
    technology: 'Database',
    experience: ['Junior', 'Mid'],
    tags: ['Indexing'],
    question: 'What is a database index and when should you add one?',
    answer:
      'An index is a data structure (B-tree by default) that allows fast lookup of rows by indexed column(s) without full table scan. Add indexes on: columns used in WHERE/JOIN/ORDER BY clauses that have high cardinality. Avoid over-indexing: each index slows INSERT/UPDATE/DELETE and uses disk space. Composite indexes: column order matters — match the leftmost prefix. Use EXPLAIN to verify index usage.',
  },
  {
    id: 'db-3',
    technology: 'Database',
    experience: ['Mid', 'Senior'],
    tags: ['ACID', 'Transactions'],
    question: 'What are ACID properties in databases?',
    answer:
      'Atomicity: a transaction is all-or-nothing — if any step fails, the whole transaction rolls back. Consistency: a transaction brings the DB from one valid state to another, enforcing all constraints. Isolation: concurrent transactions behave as if sequential; controlled by isolation levels (READ UNCOMMITTED → SERIALIZABLE). Durability: committed transactions survive failures (WAL/redo logs on disk).',
  },
  {
    id: 'db-4',
    technology: 'Database',
    experience: ['Mid', 'Senior'],
    tags: ['Tuning', 'Performance'],
    question: 'What is the difference between EXPLAIN and EXPLAIN ANALYZE in PostgreSQL?',
    answer:
      '`EXPLAIN` shows the query plan the planner would use — estimated costs and rows. No query is actually executed. `EXPLAIN ANALYZE` executes the query and shows actual runtime, rows returned, and planning/execution time. Use EXPLAIN ANALYZE to find slow nodes (e.g., Seq Scan on large tables, Hash Join with bad estimates). `EXPLAIN (ANALYZE, BUFFERS)` also shows cache hits vs disk reads.',
  },
  {
    id: 'db-5',
    technology: 'Database',
    experience: ['Junior', 'Mid'],
    tags: ['SQL Basics'],
    question: 'What is the difference between INNER JOIN, LEFT JOIN, and FULL OUTER JOIN?',
    answer:
      'INNER JOIN: returns rows where there is a match in BOTH tables. LEFT JOIN (LEFT OUTER): returns all rows from the left table; matched rows from the right, NULLs where no match. RIGHT JOIN: reverse of LEFT JOIN. FULL OUTER JOIN: returns all rows from both tables; NULLs where no match on either side. Cross join returns the Cartesian product (every combination).',
  },
  {
    id: 'db-6',
    technology: 'Database',
    experience: ['Senior'],
    tags: ['Scaling', 'Architecture'],
    question: 'What is the difference between vertical and horizontal database scaling? What is sharding?',
    answer:
      'Vertical scaling (scale-up): add more CPU/RAM/disk to a single server. Simple but has limits and is expensive. Horizontal scaling (scale-out): add more servers. Techniques: Read replicas (for read-heavy workloads), sharding (partitioning data across multiple DB instances by shard key). Sharding complexity: cross-shard queries, rebalancing, hotspots. Alternative: CQRS + event sourcing, or managed databases like Aurora/Spanner.',
  },
  {
    id: 'db-7',
    technology: 'Database',
    experience: ['Mid', 'Senior'],
    tags: ['NoSQL'],
    question: 'When would you choose a NoSQL database over a relational database?',
    answer:
      'NoSQL (document, key-value, column-family, graph) excels when: schema is flexible/evolving, horizontal scaling is a priority, data access patterns are simple (no complex joins), high write throughput is needed, or data is hierarchical/graph-shaped. Relational DB is better when: strong consistency is required, complex queries/joins are needed, data relationships matter, ACID transactions span multiple entities.',
  },
  {
    id: 'db-8',
    technology: 'Database',
    experience: ['Mid'],
    tags: ['Connection Pooling'],
    question: 'What is a connection pool and why is it important?',
    answer:
      'Creating a DB connection is expensive (TCP handshake, authentication, buffer allocation). A connection pool maintains a set of pre-opened connections that are reused. HikariCP (Spring Boot default): configure `spring.datasource.hikari.maximum-pool-size`. Key metrics: pool size, active connections, pending requests, connection acquisition time. Symptoms of pool exhaustion: request timeouts, `Unable to acquire JDBC Connection` errors.',
  },

  // ── SYSTEM DESIGN ─────────────────────────────────────────────────────────
  {
    id: 'sd-1',
    technology: 'System Design',
    experience: ['Mid', 'Senior'],
    tags: ['Scalability'],
    question: 'What is the CAP theorem?',
    answer:
      'CAP theorem states a distributed system can guarantee at most 2 of 3 properties: Consistency (all nodes see the same data simultaneously), Availability (every request receives a response), Partition Tolerance (system continues despite network partitions). Since network partitions are unavoidable in distributed systems, you must choose between CP (consistent but may be unavailable during partition — e.g., HBase, Zookeeper) and AP (available but may return stale data — e.g., Cassandra, DynamoDB).',
  },
  {
    id: 'sd-2',
    technology: 'System Design',
    experience: ['Mid', 'Senior'],
    tags: ['Caching'],
    question: 'What caching strategies exist and when do you use each?',
    answer:
      'Cache-aside (lazy loading): app checks cache, on miss fetches from DB and populates cache. Write-through: write to cache AND DB synchronously; cache always consistent. Write-behind (write-back): write to cache first, async flush to DB; high write throughput but risk of data loss. Read-through: cache sits in front; handles DB reads transparently. Eviction policies: LRU (most common), LFU, TTL. Redis is the standard distributed cache.',
  },
  {
    id: 'sd-3',
    technology: 'System Design',
    experience: ['Senior'],
    tags: ['Messaging', 'Async'],
    question: 'What is the difference between a message queue and a pub/sub system?',
    answer:
      'Message queue (point-to-point): one producer, each message consumed by exactly one consumer (e.g., RabbitMQ, SQS). Used for work distribution/load balancing. Pub/Sub: messages published to topics, ALL subscribers receive each message (e.g., Kafka, Google Pub/Sub). Used for event broadcasting, fan-out. Kafka supports both patterns (consumer groups = queue semantics, different groups = pub/sub).',
  },

  // ── ANGULAR (extended) ────────────────────────────────────────────────────
  {
    id: 'ng-7',
    technology: 'Angular',
    experience: ['Junior'],
    tags: ['Architecture', 'Basics'],
    question: 'What is Angular and how would you describe its architecture?',
    answer:
      'Angular is a TypeScript-based SPA framework by Google. Architecture: Components form a tree. Modules (NgModule or standalone) group related components/services. Services hold business logic and are injected via the DI system. Templates use data binding to connect component class to view. The router maps URLs to components. The architecture follows MVVM — the component class is the ViewModel, the template is the View, and services/models are the Model layer.',
  },
  {
    id: 'ng-8',
    technology: 'Angular',
    experience: ['Junior', 'Mid'],
    tags: ['Lifecycle'],
    question: 'What are the Angular component lifecycle hooks and when do they fire?',
    answer:
      'ngOnChanges — fires when @Input properties change (before ngOnInit). ngOnInit — once, after first ngOnChanges. Use for initialization. ngDoCheck — every change detection cycle; expensive, use sparingly. ngAfterContentInit / ngAfterContentChecked — after ng-content projection. ngAfterViewInit / ngAfterViewChecked — after component view and children render. ngOnDestroy — just before the component is destroyed; unsubscribe here.',
  },
  {
    id: 'ng-9',
    technology: 'Angular',
    experience: ['Junior'],
    tags: ['Components'],
    question: 'What does an Angular component consist of?',
    answer:
      'A component is made of: (1) TypeScript class with @Component decorator, (2) HTML template (inline or in a separate .html file), (3) CSS/SCSS styles (inline or separate), (4) metadata in the decorator: selector (how the component is used), templateUrl, styleUrls, changeDetection strategy. Additional parts: @Input / @Output properties for parent-child communication, lifecycle hooks, injected services.',
  },
  {
    id: 'ng-10',
    technology: 'Angular',
    experience: ['Mid', 'Senior'],
    tags: ['RxJS', 'Observables'],
    question: 'What is the difference between Subject, BehaviorSubject, Observable, and Promise?',
    answer:
      'Observable: cold by default (execution starts per subscriber), single value or stream, lazy. Promise: eager (starts immediately), single future value, no cancel. Subject: hot Observable + Observer — you can push values to it manually. Multicast. BehaviorSubject: Subject that requires an initial value and replays the last emitted value to new subscribers immediately. Use Observable for HTTP, BehaviorSubject for shared state (e.g., auth user), Promise for one-time async that doesn\'t need cancel.',
  },
  {
    id: 'ng-11',
    technology: 'Angular',
    experience: ['Mid'],
    tags: ['RxJS'],
    question: 'What is RxJS and why does Angular use it?',
    answer:
      'RxJS (Reactive Extensions for JavaScript) is a library for composing asynchronous and event-based programs using Observables. Angular uses it for: HttpClient (returns Observables), Router events, Reactive Forms (valueChanges), async pipe in templates. Key operators: map, filter, switchMap, mergeMap, catchError, takeUntil, combineLatest, forkJoin. Enables declarative, composable data flows.',
  },
  {
    id: 'ng-12',
    technology: 'Angular',
    experience: ['Junior', 'Mid'],
    tags: ['Components', 'Communication'],
    question: 'How do Angular components communicate with each other?',
    answer:
      'Parent → Child: @Input() property binding. Child → Parent: @Output() EventEmitter. Sibling / Any: shared Service with a Subject/BehaviorSubject. Child accesses Parent: @ViewChild (parent holds ref to child) or @ContentChild. Query DOM: @ViewChild / @ViewChildren. Local template ref with #ref. For complex apps: state management with NgRx.',
  },
  {
    id: 'ng-13',
    technology: 'Angular',
    experience: ['Junior'],
    tags: ['Project Structure'],
    question: 'What are the key configuration files in an Angular project?',
    answer:
      'package.json: npm dependencies and scripts. package-lock.json: exact locked dependency tree for reproducible installs. angular.json: workspace configuration — build options, serve config, asset paths, style preprocessors, test config per project. tsconfig.json: TypeScript compiler options. tsconfig.app.json: app-specific TS config. .browserslistrc: supported browsers. environments/: environment-specific variables.',
  },
  {
    id: 'ng-14',
    technology: 'Angular',
    experience: ['Junior'],
    tags: ['Bootstrap', 'Styling'],
    question: 'How do you add Bootstrap to an Angular project?',
    answer:
      'Option 1 (CSS only): `npm install bootstrap`, then add `"node_modules/bootstrap/dist/css/bootstrap.min.css"` to the `styles` array in angular.json. Option 2: `npm install bootstrap @popperjs/core`, add both CSS and JS to angular.json styles/scripts arrays. Option 3 (recommended): Use `ng-bootstrap` (`npm install @ng-bootstrap/ng-bootstrap`) for Angular-native Bootstrap components with no jQuery dependency.',
  },
  {
    id: 'ng-15',
    technology: 'Angular',
    experience: ['Junior', 'Mid'],
    tags: ['Routing', 'Lazy Loading'],
    question: 'What is lazy loading in Angular and can you give an example?',
    answer:
      'Lazy loading defers loading a feature module until its route is visited, reducing the initial bundle size. Example in app-routing.module.ts: `{ path: "admin", loadChildren: () => import("./admin/admin.module").then(m => m.AdminModule) }`. Angular builds a separate JS chunk for the admin module. With standalone components (Angular 14+): `loadComponent: () => import("./admin/admin.component").then(c => c.AdminComponent)`.',
  },
  {
    id: 'ng-16',
    technology: 'Angular',
    experience: ['Mid'],
    tags: ['Security', 'Routing'],
    question: 'What is an Auth Guard in Angular?',
    answer:
      'An Auth Guard is a route guard that controls navigation. Implement `CanActivate` (or newer functional guards with `inject()`) to check if a user is authenticated before allowing access to a route. Return `true` to allow navigation, `false` or a `UrlTree` to redirect (e.g., to /login). Other guard types: `CanDeactivate` (warn before leaving), `CanLoad`/`CanMatch` (prevent lazy module from loading at all), `Resolve` (prefetch data).',
  },
  {
    id: 'ng-17',
    technology: 'Angular',
    experience: ['Mid'],
    tags: ['Bootstrap', 'Architecture'],
    question: 'How does an Angular application start?',
    answer:
      'main.ts calls `platformBrowserDynamic().bootstrapModule(AppModule)` (or `bootstrapApplication(AppComponent)` for standalone). Angular compiles the root module, instantiates the root injector, creates AppComponent and inserts it into `<app-root>` in index.html. The router then processes the current URL and renders the matching route component. In production, AOT pre-compiles templates so this process is faster.',
  },
  {
    id: 'ng-18',
    technology: 'Angular',
    experience: ['Mid'],
    tags: ['Compilation', 'AOT', 'JIT'],
    question: 'What is the difference between AOT and JIT compilation in Angular?',
    answer:
      'JIT (Just-in-Time): templates are compiled in the browser at runtime. Slower startup, larger bundle (compiler included), used in development (`ng serve`). AOT (Ahead-of-Time): templates are compiled during the build step. Faster rendering (no compiler in bundle), catches template errors at build time, smaller bundle, used in production (`ng build --configuration production`). AOT is the default since Angular 9.',
  },
  {
    id: 'ng-19',
    technology: 'Angular',
    experience: ['Mid'],
    tags: ['Pipes', 'Directives'],
    question: 'What is the difference between a Pipe and a Directive in Angular? What types exist?',
    answer:
      'Directive: changes behavior or appearance of a DOM element. Structural (ngIf, ngFor, ngSwitch) — change DOM structure. Attribute (ngClass, ngStyle, custom) — change element properties. Pipe: transforms displayed values in templates. Does not affect the DOM structure. Built-in pipes: date, currency, uppercase, json, async, slice, number. Custom: implement PipeTransform interface. Key difference: directives act on elements, pipes transform data in interpolations/bindings.',
  },
  {
    id: 'ng-20',
    technology: 'Angular',
    experience: ['Mid'],
    tags: ['Pipes'],
    question: 'What is the difference between pure and impure pipes?',
    answer:
      'Pure pipe (default): Angular only re-executes the pipe when the input VALUE reference changes (primitives: value change, objects/arrays: reference change). Efficient. Impure pipe (`pure: false`): re-executes on every change detection cycle regardless of whether the input changed. Needed for pipes that depend on mutable data (e.g., filtering a mutated array). Use impure sparingly — they can cause performance issues.',
  },
  {
    id: 'ng-21',
    technology: 'Angular',
    experience: ['Junior', 'Mid'],
    tags: ['Data Binding'],
    question: 'What are the different types of data binding in Angular?',
    answer:
      'Interpolation `{{ expr }}`: component → view (string). Property binding `[prop]="expr"`: component → DOM property. Event binding `(event)="handler()"`: DOM event → component method. Two-way binding `[(ngModel)]`: both directions (requires FormsModule). Attribute binding `[attr.aria-label]`: for HTML attributes (not DOM properties). Class/style binding `[class.active]`, `[style.color]`. Input/Output: @Input for parent→child, @Output EventEmitter for child→parent.',
  },
  {
    id: 'ng-22',
    technology: 'Angular',
    experience: ['Mid', 'Senior'],
    tags: ['RxJS', 'Operators'],
    question: 'What is the difference between mergeMap, switchMap, concatMap, and exhaustMap?',
    answer:
      'All flatten a higher-order Observable. mergeMap: all inner Observables run concurrently — no cancellation, no ordering. switchMap: cancels the previous inner Observable when a new outer value arrives. Best for type-ahead search. concatMap: queues inner Observables, completes each before starting the next. Preserves order. exhaustMap: ignores new outer values while the current inner Observable is active. Best for non-repeatable actions like login button clicks.',
  },
  {
    id: 'ng-23',
    technology: 'Angular',
    experience: ['Junior'],
    tags: ['DOM', 'Directives'],
    question: 'How do you hide an element from the DOM in Angular? What is the * in *ngIf?',
    answer:
      '*ngIf="condition" removes/adds the element from the DOM. [hidden]="condition" keeps the element in the DOM but sets display:none. Use *ngIf when you want to save memory and avoid lifecycle hooks for hidden components. The asterisk (*) is syntactic sugar — Angular desugars `*ngIf="x"` into `<ng-template [ngIf]="x"><div>...</div></ng-template>`. The `*` prefix signals a structural directive that uses a template.',
  },
  {
    id: 'ng-24',
    technology: 'Angular',
    experience: ['Mid'],
    tags: ['Observables'],
    question: 'What are the three arguments to observable.subscribe()?',
    answer:
      'subscribe() accepts an observer object or three callbacks: next(value) — called for each emitted value. error(err) — called once if the Observable errors; the stream terminates. complete() — called once when the Observable completes normally (no more values). Example: `observable.subscribe({ next(x) { … }, error(err) { … }, complete() { … } })`. Always unsubscribe (or use takeUntil/async pipe) to prevent memory leaks.',
  },
  {
    id: 'ng-25',
    technology: 'Angular',
    experience: ['Mid'],
    tags: ['Observables', 'Best Practices'],
    question: 'Should you subscribe inside a constructor? What happens when a component is removed from the DOM while subscribed?',
    answer:
      'Avoid subscribing in the constructor — Angular DI is ready but the component lifecycle has not started, so you may subscribe before inputs are set. Prefer ngOnInit. When a component is removed from the DOM without unsubscribing, the subscription continues running in memory — a memory leak. Fix: store the subscription and call `.unsubscribe()` in ngOnDestroy, or use `takeUntil(this.destroy$)` with a Subject that emits in ngOnDestroy, or use the `async` pipe which auto-unsubscribes.',
  },
  {
    id: 'ng-26',
    technology: 'Angular',
    experience: ['Mid'],
    tags: ['View Encapsulation'],
    question: 'What is View Encapsulation in Angular?',
    answer:
      'View Encapsulation controls how component styles are scoped. Emulated (default): Angular adds unique attributes to elements and mimics shadow DOM scoping without native shadow DOM. Styles apply only to the component. Shadow DOM: uses native browser shadow DOM API — true style isolation, limited browser tooling support. None: no encapsulation — styles are global. Use Emulated for most cases; None if you need styles to bleed globally (e.g., a global modal).',
  },
  {
    id: 'ng-27',
    technology: 'Angular',
    experience: ['Mid'],
    tags: ['Change Detection', 'OnPush'],
    question: 'What is OnPush change detection and @HostBinding?',
    answer:
      'OnPush (ChangeDetectionStrategy.OnPush): Angular only checks the component when @Input reference changes, an event originates from it, an async pipe observes a new emit, or markForCheck() is called. Dramatically improves performance for large trees. @HostBinding: binds a component/directive property to a host element property or attribute. Example: `@HostBinding("class.active") isActive = true;` adds the `active` CSS class to the host element whenever isActive is true.',
  },
  {
    id: 'ng-28',
    technology: 'Angular',
    experience: ['Senior'],
    tags: ['State Management', 'NgRx'],
    question: 'What is NgRx and when would you use it?',
    answer:
      'NgRx is a Redux-inspired state management library for Angular built on RxJS. Core pieces: Store (single immutable state tree), Actions (event descriptors), Reducers (pure functions: (state, action) => newState), Selectors (memoized state queries), Effects (handle side effects like HTTP calls). Use when: multiple components need shared state that changes frequently, actions need audit trail/debugging, state transitions are complex. For simple apps, a BehaviorSubject service is usually enough.',
  },

  // ── JAVA (extended) ───────────────────────────────────────────────────────
  {
    id: 'java-11',
    technology: 'Java',
    experience: ['Mid'],
    tags: ['Collections', 'Sorting'],
    question: 'How do you sort a HashMap by value in Java?',
    answer:
      'HashMaps are unordered, so sort by streaming: `map.entrySet().stream().sorted(Map.Entry.comparingByValue()).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1,e2)->e1, LinkedHashMap::new))`. Use LinkedHashMap to preserve insertion order. For descending: `Map.Entry.comparingByValue(Comparator.reverseOrder())`.',
  },
  {
    id: 'java-12',
    technology: 'Java',
    experience: ['Junior', 'Mid'],
    tags: ['Collections'],
    question: 'What are the main types of collection objects in Java?',
    answer:
      'List (ordered, duplicates allowed): ArrayList, LinkedList, Vector. Set (no duplicates): HashSet (no order), LinkedHashSet (insertion order), TreeSet (sorted). Queue/Deque: LinkedList, ArrayDeque, PriorityQueue. Map (key-value): HashMap, LinkedHashMap, TreeMap, Hashtable, ConcurrentHashMap. Stack: legacy Stack class or ArrayDeque. The root interfaces are Collection and Map in java.util.',
  },
  {
    id: 'java-13',
    technology: 'Java',
    experience: ['Mid'],
    tags: ['LinkedList', 'Algorithms'],
    question: 'How do you find the middle element of a LinkedList without knowing its size?',
    answer:
      'Use the two-pointer (slow/fast) technique. Initialize both slow and fast at the head. Move slow by 1 step and fast by 2 steps each iteration. When fast reaches the end (null), slow is at the middle. This is O(n) time, O(1) space. For even-length lists, this returns the second middle node; adjust the termination condition to get the first middle.',
  },
  {
    id: 'java-14',
    technology: 'Java',
    experience: ['Mid'],
    tags: ['Collections', 'HashMap'],
    question: 'If you put the same object reference twice into a HashMap, how many entries are there?',
    answer:
      'Just one. HashMap uses equals() and hashCode() to determine key uniqueness. When you put the same key again, it overwrites the existing value — the map still has one entry. `map.put(a, v1); map.put(a, v2);` → size is 1, value is v2. The "same object" means same reference, so equals() returns true and hashCode() is identical.',
  },
  {
    id: 'java-15',
    technology: 'Java',
    experience: ['Mid', 'Senior'],
    tags: ['Collections', 'Internals'],
    question: 'How do HashMap, HashSet, and LinkedHashMap work internally?',
    answer:
      'HashMap: array of buckets (Node[]). Key\'s hashCode() determines bucket index. Collisions are handled by a linked list within the bucket; from Java 8, if a bucket exceeds 8 entries and the array is ≥64, it converts to a Red-Black Tree (O(log n) worst case). HashSet is backed by a HashMap — elements are stored as keys, value is a shared dummy Object. LinkedHashMap extends HashMap with a doubly-linked list running through all entries to maintain insertion order.',
  },
  {
    id: 'java-16',
    technology: 'Java',
    experience: ['Junior', 'Mid'],
    tags: ['OOP', 'Exception Handling'],
    question: 'How do you create a custom exception class in Java?',
    answer:
      'For a checked exception: `public class InvoiceNotFoundException extends Exception { public InvoiceNotFoundException(String msg) { super(msg); } }`. For unchecked: extend `RuntimeException`. Use unchecked for programming errors or unrecoverable states; checked for recoverable conditions the caller should handle. You can add extra fields (e.g., error code), override `getMessage()`, and provide multiple constructors including one that wraps a `Throwable` cause.',
  },
  {
    id: 'java-17',
    technology: 'Java',
    experience: ['Junior', 'Mid'],
    tags: ['OOP', 'Design'],
    question: 'Interface vs Abstract class — why do we need abstract classes if we have interfaces?',
    answer:
      'Both define contracts, but abstract classes can: hold state (fields), have constructors, and provide concrete methods that share common implementation. Interfaces (Java 8+) can have default/static methods but cannot hold instance state. Use abstract class when subclasses share implementation code and state (template method pattern). Use interface for unrelated classes needing the same capability (Comparable, Serializable). Abstract classes enable the "is-a" relationship with shared behavior; interfaces define "can-do" capabilities.',
  },
  {
    id: 'java-18',
    technology: 'Java',
    experience: ['Mid'],
    tags: ['OOP', 'Inheritance'],
    question: 'How does Java handle multiple inheritance?',
    answer:
      'Java does not allow multiple class inheritance (the "diamond problem"). You can implement multiple interfaces. If two interfaces define the same default method, the implementing class must override it to resolve the ambiguity. From Java 8, this is done explicitly: `@Override public void method() { InterfaceA.super.method(); }`. Composition over inheritance is the idiomatic pattern — compose behaviors via delegation rather than deep inheritance hierarchies.',
  },
  {
    id: 'java-19',
    technology: 'Java',
    experience: ['Mid'],
    tags: ['Initialization'],
    question: 'In what order are static block, instance block, and constructor called in Java?',
    answer:
      'Order: (1) Static block — once when the class is loaded by the JVM. (2) Instance initializer block — each time an object is created, before the constructor body. (3) Constructor — after the instance block. If there\'s inheritance, the parent\'s static block runs before the child\'s, and the parent constructor runs first. Example output for `new Child()`: ParentStaticBlock → ChildStaticBlock → ParentInstanceBlock → ParentConstructor → ChildInstanceBlock → ChildConstructor.',
  },
  {
    id: 'java-20',
    technology: 'Java',
    experience: ['Junior', 'Mid'],
    tags: ['Immutability', 'String'],
    question: 'Why is String immutable in Java? How do you create an immutable class?',
    answer:
      'String is immutable because: (1) String Pool — JVM can safely share the same String object. (2) Security — strings used as class names, DB URLs, keys cannot be altered. (3) Thread safety built-in. (4) HashCode caching. To create an immutable class: declare class final, declare all fields private final, no setters, deep-copy mutable fields in constructor and getter. Example: `final class Money { private final BigDecimal amount; private final String currency; }`.',
  },
  {
    id: 'java-21',
    technology: 'Java',
    experience: ['Junior'],
    tags: ['Recursion', 'Strings'],
    question: 'How do you reverse a String using recursion in Java?',
    answer:
      '`public static String reverse(String s) { if (s.isEmpty()) return s; return reverse(s.substring(1)) + s.charAt(0); }`. Base case: empty string. Recursive case: reverse the tail and append the head character. Each call strips the first character and adds it to the end. Time O(n²) due to String concatenation; use StringBuilder for O(n). Iterative or `new StringBuilder(s).reverse().toString()` is preferred in production.',
  },
  {
    id: 'java-22',
    technology: 'Java',
    experience: ['Mid'],
    tags: ['OOP', 'Interfaces'],
    question: 'What is a Marker Interface? Why does Cloneable not have any methods?',
    answer:
      'A Marker Interface has no methods — it is used as a tag to signal metadata to the JVM or framework. Examples: Serializable, Cloneable, Remote. Cloneable signals to the JVM that the `clone()` method in Object (which is protected and native) can be called on instances. Without implementing Cloneable, calling `clone()` throws CloneNotSupportedException. The actual clone logic lives in Object. Annotations are the modern replacement for marker interfaces.',
  },
  {
    id: 'java-23',
    technology: 'Java',
    experience: ['Mid'],
    tags: ['Server', 'Deployment'],
    question: 'When do you need to restart a server — on change of JSP, Java, or Properties files?',
    answer:
      'Java (compiled classes): always requires server restart (or hot-reload via tools like JRebel/HotSwap). In Spring Boot with DevTools, class changes trigger automatic restart. Properties files: Spring Boot DevTools triggers restart; manually, a restart or `@RefreshScope` + Spring Cloud Config refresh is needed. JSP files: in traditional servlet containers, JSPs are compiled on first request — no restart needed for JSP changes. Spring Boot embedded servers recompile JSPs on change without restart (if jsp-jasper is on classpath).',
  },
  {
    id: 'java-24',
    technology: 'Java',
    experience: ['Senior'],
    tags: ['Diagnostics', 'JVM'],
    question: 'What are a Java thread dump and heap dump, and when do you use each?',
    answer:
      'Thread dump: a snapshot of all threads in the JVM at an instant — their state, stack traces, and held locks. Used to diagnose deadlocks, thread starvation, and CPU spikes. Capture with: `jstack <pid>`, or `kill -3 <pid>`. Heap dump: a snapshot of all live objects in the heap — their types, counts, and references. Used to diagnose OutOfMemoryErrors, memory leaks. Capture with: `jmap -dump:format=b,file=heap.hprof <pid>`, or automatically via `-XX:+HeapDumpOnOutOfMemoryError`. Analyze heap dumps with Eclipse MAT or VisualVM.',
  },
  {
    id: 'java-25',
    technology: 'Java',
    experience: ['Senior'],
    tags: ['Concurrency', 'BlockingQueue'],
    question: 'What is BlockingQueue and why is it thread-safe?',
    answer:
      'BlockingQueue is a Queue that blocks on `take()` when empty and blocks on `put()` when full (for bounded queues). Implementations: LinkedBlockingQueue, ArrayBlockingQueue, PriorityBlockingQueue, SynchronousQueue. Thread safety is built into the implementation using ReentrantLock with two Conditions (notEmpty, notFull). Used in the producer-consumer pattern and in ThreadPoolExecutor work queues. Unlike a plain Queue, you don\'t need external synchronization.',
  },
  {
    id: 'java-26',
    technology: 'Java',
    experience: ['Senior'],
    tags: ['Concurrency', 'Singleton'],
    question: 'How do you make a Singleton thread-safe without using synchronized?',
    answer:
      'Option 1 — Enum Singleton: `public enum Singleton { INSTANCE; }`. Thread-safe by JVM class loading guarantee, handles serialization. Option 2 — Initialization-on-Demand Holder: `private static class Holder { static final Singleton INSTANCE = new Singleton(); }`. The class is loaded lazily by the JVM, which guarantees thread safety without synchronization. Option 3 — volatile + double-checked locking: `private static volatile Singleton instance;`. The `volatile` ensures visibility of the fully constructed object.',
  },
  {
    id: 'java-27',
    technology: 'Java',
    experience: ['Mid'],
    tags: ['Concurrency', 'Keywords'],
    question: 'What does the volatile keyword do in Java?',
    answer:
      'volatile ensures that reads/writes to the variable go directly to main memory, not a CPU cache. This guarantees visibility across threads — if thread A writes to a volatile variable, thread B will always see the updated value. It does NOT provide atomicity for compound operations (check-then-act, increment). Use volatile for simple flags (`boolean running`) or the double-checked locking pattern with Singleton. For compound operations, use AtomicInteger, synchronized, or Locks.',
  },
  {
    id: 'java-28',
    technology: 'Java',
    experience: ['Mid'],
    tags: ['Collections', 'Thread Safety'],
    question: 'What is the difference between HashMap and Hashtable?',
    answer:
      'HashMap: NOT synchronized, allows one null key and multiple null values, fail-fast iterator, faster. Hashtable: synchronized (all methods), no null keys or values, obsolete. Use ConcurrentHashMap instead of Hashtable — it uses segment-level locking (Java 7) or CAS operations (Java 8+) for better concurrency. Use Collections.synchronizedMap(hashMap) only if you need a wrapped synchronized HashMap.',
  },
  {
    id: 'java-29',
    technology: 'Java',
    experience: ['Mid'],
    tags: ['Sorting', 'Comparable', 'Comparator'],
    question: 'What is the difference between Comparable and Comparator in Java?',
    answer:
      'Comparable: the class implements it to define its natural ordering. Override `compareTo(T o)`. A class has only one natural order. Used by Collections.sort() and Arrays.sort() by default. Comparator: an external comparison strategy. Implement `compare(T o1, T o2)`. Multiple Comparators can exist for the same class. Use Comparator when: you don\'t own the class, you need multiple sort orders, or you need sorting by multiple fields (Comparator.comparing().thenComparing()).',
  },
  {
    id: 'java-30',
    technology: 'Java',
    experience: ['Mid'],
    tags: ['Inheritance', 'OOP'],
    question: 'Can a child class decrease the access scope of a method in Java?',
    answer:
      'No. The Liskov Substitution Principle and Java spec prohibit reducing visibility when overriding. A parent method that is `public` cannot be overridden as `protected` or `private` in a child class — the compiler will error. You CAN increase visibility (protected → public). This ensures that code using a parent reference can always call methods they expect to be accessible through a child instance.',
  },
  {
    id: 'java-31',
    technology: 'Java',
    experience: ['Mid'],
    tags: ['OOP', 'Design Patterns'],
    question: 'What is the difference between Association, Aggregation, and Composition?',
    answer:
      'Association: a general relationship between two classes — they know about each other. No ownership. (e.g., Teacher teaches Student). Aggregation: a "has-a" relationship where the child can exist independently of the parent. (e.g., Department has Employees — employees can exist without the department). Composition: a strong "has-a" where the child cannot exist without the parent. If the parent is destroyed, so are the children. (e.g., House has Rooms — rooms can\'t exist without the house).',
  },

  // ── JAVASCRIPT / TYPESCRIPT (extended) ────────────────────────────────────
  {
    id: 'ts-1',
    technology: 'TypeScript',
    experience: ['Junior', 'Mid'],
    tags: ['Basics'],
    question: 'What is hoisting in JavaScript?',
    answer:
      'Hoisting is the JavaScript engine\'s behavior of moving declarations (not initializations) to the top of their scope before execution. var declarations are hoisted and initialized as `undefined`. Function declarations are fully hoisted (both declaration and body). `let` and `const` are hoisted but remain in the Temporal Dead Zone until the declaration line — accessing them before that throws a ReferenceError.',
  },
  {
    id: 'ts-2',
    technology: 'TypeScript',
    experience: ['Junior', 'Mid'],
    tags: ['Scoping'],
    question: 'What are the different scopes in JavaScript?',
    answer:
      'Global scope: variables defined outside any function/block; accessible everywhere. Function (local) scope: variables declared with var inside a function. Block scope: variables declared with let/const inside {}. Lexical (closure) scope: inner functions have access to the variables of their outer function at the time of creation, even after the outer function returns. Module scope (ES Modules): variables are scoped to the module by default.',
  },
  {
    id: 'ts-3',
    technology: 'TypeScript',
    experience: ['Mid'],
    tags: ['Types'],
    question: 'What are JavaScript data types?',
    answer:
      'Primitives (immutable, by value): undefined, null, boolean, number, bigint, string, symbol. Non-primitives / Reference types (by reference): object (includes array, function, Date, RegExp, Map, Set). `typeof null === "object"` is a known legacy bug. `typeof undefined === "undefined"`. Arrays are objects with numeric keys. Functions are callable objects.',
  },
  {
    id: 'ts-4',
    technology: 'TypeScript',
    experience: ['Junior'],
    tags: ['Arrays', 'Objects'],
    question: 'What is the difference between a[1] and a["abc"] in JavaScript?',
    answer:
      'In JavaScript, all object keys are strings (or Symbols). `a[1]` coerces the number 1 to the string "1" — it is equivalent to `a["1"]`. Array indices are string keys internally. `a["abc"]` accesses the property named "abc" on the object/array. On a plain array, using a string key adds a property to the array object (not an element) — `a.length` does not change. This is why numeric keys on arrays should always be integers.',
  },
  {
    id: 'ts-5',
    technology: 'TypeScript',
    experience: ['Junior'],
    tags: ['Functions'],
    question: 'What happens when you declare the same function multiple times in JavaScript?',
    answer:
      'Function declarations are fully hoisted. If you declare the same function name multiple times, the LAST declaration wins at runtime — each one overwrites the previous. Example: if you declare `function greet()` twice, only the second definition is available. This is different from function expressions assigned to variables — the variable hoisting rules apply instead.',
  },
  {
    id: 'ts-6',
    technology: 'TypeScript',
    experience: ['Junior'],
    tags: ['Async', 'Event Loop'],
    question: 'What is the output? `setTimeout(()=>console.log("a"), 2000); console.log("b");`',
    answer:
      '"b" prints first, then "a" after ~2 seconds. setTimeout registers a callback in the browser\'s Web API timer. The current synchronous code (`console.log("b")`) runs to completion. Only after the call stack is empty and the timer expires does the event loop pick up the callback and push it onto the stack.',
  },
  {
    id: 'ts-7',
    technology: 'TypeScript',
    experience: ['Junior'],
    tags: ['Equality', 'Types'],
    question: '`undefined == null` vs `undefined === null` — what do they return?',
    answer:
      '`undefined == null` → `true`. The abstract equality operator (==) has a special rule: null and undefined are only equal to each other (and themselves). `undefined === null` → `false`. The strict equality operator (===) checks both value AND type. `typeof undefined === "undefined"` and `typeof null === "object"`, so they are different types. Always use === in production code to avoid surprises.',
  },
  {
    id: 'ts-8',
    technology: 'TypeScript',
    experience: ['Junior'],
    tags: ['Storage'],
    question: 'What is the difference between sessionStorage and localStorage?',
    answer:
      'Both are Web Storage APIs storing key-value strings in the browser. localStorage: persists indefinitely until explicitly cleared, shared across tabs of the same origin. sessionStorage: cleared when the browser tab/session closes, NOT shared across tabs. Both have ~5MB limit. Neither is secure for sensitive data — accessible via JS. Use cookies with HttpOnly for auth tokens. Both follow same-origin policy.',
  },
  {
    id: 'ts-9',
    technology: 'TypeScript',
    experience: ['Junior'],
    tags: ['DOM'],
    question: 'What is the DOM?',
    answer:
      'The Document Object Model is a tree-structured in-memory representation of an HTML document. The browser parses HTML and builds this tree of nodes (Elements, Text nodes, Comments). JavaScript can read and modify it via the DOM API (`document.getElementById`, `element.classList`, `element.appendChild`, etc.). Modifying the DOM triggers browser reflow/repaint. Frameworks like React/Angular maintain a virtual DOM or change detection to minimize direct DOM manipulation.',
  },
  {
    id: 'ts-10',
    technology: 'TypeScript',
    experience: ['Junior', 'Mid'],
    tags: ['Functions', 'this'],
    question: 'What is the difference between call/apply and bind?',
    answer:
      '`call(thisArg, arg1, arg2)`: invokes the function immediately with the given `this` and arguments passed individually. `apply(thisArg, [arg1, arg2])`: same but arguments passed as an array. `bind(thisArg, arg1, ...)`: returns a NEW function permanently bound to the given `this` (and optionally pre-filling arguments — partial application). Use bind when you need to pass a method as a callback while preserving context.',
  },
  {
    id: 'ts-11',
    technology: 'TypeScript',
    experience: ['Junior'],
    tags: ['Arrow Functions', 'this'],
    question: 'Why does `dog.getBreed()` return undefined when defined as an arrow function, but `dog.getSound()` works as a regular function?',
    answer:
      'Arrow functions capture `this` lexically from the enclosing scope at definition time. The object literal `{}` does not create a new `this` scope, so inside the arrow function `this` refers to the outer scope (global/window in non-strict mode, where `breed` is undefined). Regular functions have their own `this` determined by how they are called — `dog.getSound()` sets `this` to `dog` at call time, so `this.sound` works correctly. Always use regular functions for object methods.',
  },
  {
    id: 'ts-12',
    technology: 'TypeScript',
    experience: ['Junior'],
    tags: ['Types', 'Null'],
    question: 'What does typeof(null) return? Why are null and undefined == equal?',
    answer:
      '`typeof null === "object"` — a historical bug in JavaScript that cannot be fixed for backward compatibility. `typeof undefined === "undefined"`. They are loosely equal (`null == undefined`) because the spec explicitly defines this: both represent "absence of value" and the abstract equality check has a special rule that null and undefined are only equal to each other. Strictly (`===`) they are not equal because they are different types.',
  },
  {
    id: 'ts-13',
    technology: 'TypeScript',
    experience: ['Junior', 'Mid'],
    tags: ['Hoisting', 'var'],
    question: 'What is the output of: `var x = 21; var print = function() { console.log(x); var x = 20; console.log(x); }; print(); console.log(x);`',
    answer:
      'Output: `undefined`, `20`, `21`. Inside `print()`, `var x` is hoisted to the top of the function, so the first `console.log(x)` sees the hoisted (uninitialized) `x` as `undefined`. The second log shows `20` after assignment. Outside `print()`, the outer `x` is `21` and was never changed.',
  },
  {
    id: 'ts-14',
    technology: 'TypeScript',
    experience: ['Junior', 'Mid'],
    tags: ['TypeScript'],
    question: 'How do you assign multiple data types to a variable in TypeScript?',
    answer:
      'Use union types: `let val: string | number | boolean;`. TypeScript will enforce that only the allowed types can be assigned. Use type guards (`typeof`, `instanceof`, or custom type predicates) to narrow the type in conditional blocks. You can also use `unknown` (safer) or `any` (no type checking — avoid in production). Combined with generics, you can write flexible, type-safe functions: `function wrap<T>(val: T): T { return val; }`.',
  },

  // ── SPRING BOOT (extended) ─────────────────────────────────────────────────
  {
    id: 'sb-9',
    technology: 'Spring Boot',
    experience: ['Junior'],
    tags: ['MVC', 'Annotations'],
    question: 'What is the difference between @GetMapping, @PostMapping, and @RequestMapping?',
    answer:
      '@RequestMapping is the generic annotation for any HTTP method — specify the method via `method = RequestMethod.GET`. @GetMapping, @PostMapping, @PutMapping, @PatchMapping, @DeleteMapping are shorthand specializations. Also: GET is idempotent and cached; POST creates; PUT replaces (full update); PATCH partially updates; DELETE removes. Prefer the specific shortcuts for readability.',
  },
  {
    id: 'sb-10',
    technology: 'Spring Boot',
    experience: ['Junior', 'Mid'],
    tags: ['REST', 'HTTP'],
    question: 'What is the difference between GET/POST and PUT/PATCH in Spring Boot?',
    answer:
      'GET: retrieve data, no body, idempotent, cacheable. POST: create a resource, body required, NOT idempotent. PUT: full update — replace the entire resource at the URI, idempotent. PATCH: partial update — only send fields to change, NOT required to be idempotent. Spring mapping: @GetMapping, @PostMapping, @PutMapping, @PatchMapping, @DeleteMapping.',
  },
  {
    id: 'sb-11',
    technology: 'Spring Boot',
    experience: ['Junior'],
    tags: ['Logging'],
    question: 'How does logging work in Spring Boot?',
    answer:
      'Spring Boot uses SLF4J as the logging facade with Logback as the default implementation. Configure via `application.yml`: `logging.level.root=WARN`, `logging.level.com.myapp=DEBUG`. Inject a logger: `private static final Logger log = LoggerFactory.getLogger(MyClass.class);` or use Lombok\'s `@Slf4j`. For structured logging, configure Logback with a JSON appender. `logback-spring.xml` allows Spring-aware configuration with profiles.',
  },
  {
    id: 'sb-12',
    technology: 'Spring Boot',
    experience: ['Junior'],
    tags: ['REST', 'Annotations'],
    question: 'What is the difference between @PathVariable and @RequestParam in Spring Boot?',
    answer:
      '@PathVariable extracts values from the URI path: `GET /users/{id}` → `@PathVariable Long id`. @RequestParam extracts query string values: `GET /users?role=admin` → `@RequestParam String role`. @RequestParam is optional with a default: `@RequestParam(defaultValue = "ASC") String sort`. Use @PathVariable for resource identifiers, @RequestParam for optional filters/pagination.',
  },
  {
    id: 'sb-13',
    technology: 'Spring Boot',
    experience: ['Mid'],
    tags: ['Security', 'REST'],
    question: 'Is a REST call thread-safe in Spring Boot? Is @Autowired on a static field correct?',
    answer:
      'Spring MVC creates one instance of a Controller and shares it across all threads. Instance variables are NOT thread-safe — avoid mutable instance state in controllers/services. Method-local variables are stack-based and thread-safe. @Autowired on a static field: NOT supported by Spring — Spring performs DI on instance fields only; a static field is class-level and not managed by the container. Workaround: use a static setter method with @Autowired on the setter.',
  },
  {
    id: 'sb-14',
    technology: 'Spring Boot',
    experience: ['Mid'],
    tags: ['JSON', 'Serialization'],
    question: 'What is JSON serialization/deserialization in Spring Boot? What does @JsonIgnore do?',
    answer:
      'Spring Boot uses Jackson for JSON. Serialization: Java object → JSON. Deserialization: JSON → Java object. Annotations: @JsonProperty (rename field), @JsonIgnore (exclude from both), @JsonIgnoreProperties(ignoreUnknown=true) (ignore unknown JSON fields), @JsonInclude to control null inclusion. To include a @JsonIgnore field in a specific direction: use @JsonProperty with access=JsonProperty.Access.WRITE_ONLY or READ_ONLY.',
  },
  {
    id: 'sb-15',
    technology: 'Spring Boot',
    experience: ['Junior', 'Mid'],
    tags: ['Configuration'],
    question: 'How do you read from application.properties/yml and how do you read a JSON config file?',
    answer:
      'Properties: `@Value("${my.prop}")` for scalar values. `@ConfigurationProperties(prefix="my")` for binding a group of properties to a POJO (annotate with @Component or use @EnableConfigurationProperties). JSON file: load via `@Value("classpath:config.json")` with a Resource, then parse with ObjectMapper. Or map it in application.yml as a nested structure under a key.',
  },
  {
    id: 'sb-16',
    technology: 'Spring Boot',
    experience: ['Mid'],
    tags: ['DTO', 'Design'],
    question: 'What is a DTO and why use it?',
    answer:
      'DTO (Data Transfer Object) is a plain object used to carry data between layers or across network boundaries. Benefits: decouples the API contract from the database entity (you can expose only what is needed), prevents over-posting security issues, allows shaping the response differently from the entity (e.g., flattening nested objects). Use MapStruct or ModelMapper for mapping between Entity ↔ DTO. Entities should not be exposed directly in REST responses.',
  },
  {
    id: 'sb-17',
    technology: 'Spring Boot',
    experience: ['Senior'],
    tags: ['Architecture', 'Cross Cutting'],
    question: 'What is a cross-cutting concern? Give examples.',
    answer:
      'A cross-cutting concern is a functionality that spans multiple application layers and is not tied to any single business domain. Examples: logging, security, transaction management, caching, error handling, auditing, rate limiting. In Spring, these are handled via AOP (Aspect-Oriented Programming) — @Aspect, @Before, @After, @Around. This keeps business code clean by removing infrastructure concerns from the business logic.',
  },
  {
    id: 'sb-18',
    technology: 'Spring Boot',
    experience: ['Mid', 'Senior'],
    tags: ['Filters', 'Interceptors'],
    question: 'What is the difference between Filters and Interceptors in Spring Boot?',
    answer:
      'Filter (javax/jakarta.servlet.Filter): operates at the Servlet level before the DispatcherServlet. Configured via FilterRegistrationBean. Can intercept ALL requests. Used for: CORS, encoding, security headers. Interceptor (HandlerInterceptor): operates inside Spring MVC after the DispatcherServlet. Has access to the handler (controller method). Methods: preHandle, postHandle, afterCompletion. Use interceptors when you need access to Spring context (authenticated user, annotations on the controller).',
  },
  {
    id: 'sb-19',
    technology: 'Spring Boot',
    experience: ['Senior'],
    tags: ['Architecture', 'Auto Configuration'],
    question: 'How does Spring Boot work internally? What does @SpringBootApplication do?',
    answer:
      '@SpringBootApplication is a convenience annotation combining: @Configuration (marks it as a bean source), @EnableAutoConfiguration (triggers Spring Boot\'s auto-config mechanism via spring.factories / META-INF/spring/AutoConfiguration.imports), @ComponentScan (scans the current package and sub-packages for @Component beans). Auto-configuration: Spring Boot checks conditions (@ConditionalOnClass, @ConditionalOnMissingBean) to decide which beans to auto-create. To exclude: `@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})`.',
  },

  // ── DATA STRUCTURES ───────────────────────────────────────────────────────
  {
    id: 'ds-1',
    technology: 'Data Structures',
    experience: ['Junior'],
    tags: ['Collections', 'Basics'],
    question: 'What data structure would you use to implement a Queue and why?',
    answer:
      'Use a LinkedList or ArrayDeque (not a List or Map). Queue operations are FIFO — enqueue at tail, dequeue at head. LinkedList: O(1) add/remove at both ends. ArrayDeque: resizable array backed, faster in practice (better cache locality, no node allocation overhead). ArrayDeque is the recommended Queue implementation in Java. Do NOT use an ArrayList as a Queue — removing from the head is O(n).',
  },
  {
    id: 'ds-2',
    technology: 'Data Structures',
    experience: ['Junior', 'Mid'],
    tags: ['Complexity'],
    question: 'What is Big O notation? Give time/space complexity for common collections.',
    answer:
      'Big O describes the upper bound of an algorithm\'s growth rate as input size n grows. Common complexities: O(1) constant, O(log n) binary search, O(n) linear, O(n log n) merge sort, O(n²) nested loops, O(2ⁿ) exponential. Collections: ArrayList get O(1), add O(1) amortized, remove from middle O(n). LinkedList get O(n), add/remove at ends O(1). HashMap get/put O(1) average, O(n) worst (hash collision). TreeMap get/put O(log n). HashSet same as HashMap.',
  },
  {
    id: 'ds-3',
    technology: 'Data Structures',
    experience: ['Mid'],
    tags: ['Performance', 'Strings'],
    question: 'Should you use StringBuilder or StringBuffer inside a REST API handler?',
    answer:
      'Use StringBuilder — it is NOT synchronized, which makes it faster. StringBuffer is synchronized (thread-safe) but comes with overhead. Inside a REST handler method, local variables are on the thread\'s stack and are inherently thread-safe — there is no need for StringBuffer\'s synchronization. Use StringBuffer only if you are sharing a StringBuilder across multiple threads (very rare). In general, avoid both in hot paths — use `join()`, streams, or template engines.',
  },
  {
    id: 'ds-4',
    technology: 'Data Structures',
    experience: ['Mid'],
    tags: ['Trees'],
    question: 'What is a balanced binary search tree?',
    answer:
      'A balanced BST maintains a height of O(log n) by automatically rebalancing on insert/delete. Unbalanced BSTs degrade to O(n) for all operations. Types: AVL tree — strictly balanced, height difference between subtrees ≤ 1, more rotations on insert. Red-Black Tree — less strictly balanced, at most 2× height difference, fewer rotations (used in Java\'s TreeMap and HashMap bucket chains). B-Tree — used in databases, generalizes BST to multiple children per node.',
  },
  {
    id: 'ds-5',
    technology: 'Data Structures',
    experience: ['Mid', 'Senior'],
    tags: ['Graph', 'BFS', 'DFS'],
    question: 'How do you find the shortest path in a graph? What is the difference between BFS and DFS?',
    answer:
      'BFS (Breadth-First Search): explores level by level using a Queue. Guarantees shortest path (in unweighted graphs). For weighted shortest path use Dijkstra\'s (priority queue). DFS (Depth-First Search): explores as far as possible before backtracking, using a Stack or recursion. Better for: cycle detection, topological sort, maze solving, connected components. For shortest path in unweighted graph: BFS. Weighted graph: Dijkstra. Negative weights: Bellman-Ford.',
  },
  {
    id: 'ds-6',
    technology: 'Data Structures',
    experience: ['Mid'],
    tags: ['Sorting'],
    question: 'Explain QuickSort — how does it work and what is its complexity?',
    answer:
      'QuickSort is a divide-and-conquer algorithm. Choose a pivot. Partition the array so elements < pivot are left, elements > pivot are right. Recursively sort each partition. Time complexity: O(n log n) average, O(n²) worst case (sorted array with bad pivot). Space: O(log n) stack frames. Improvements: random pivot selection, three-way partitioning (Dutch National Flag) for arrays with duplicates. Java\'s Arrays.sort() uses Dual-Pivot QuickSort for primitives.',
  },

  // ── JPA ───────────────────────────────────────────────────────────────────
  {
    id: 'jpa-1',
    technology: 'JPA',
    experience: ['Mid'],
    tags: ['Transactions', 'Spring'],
    question: 'What does @Transactional do and how are transactions managed in Spring Boot?',
    answer:
      '@Transactional wraps the method in a DB transaction. Spring creates a proxy that begins a transaction before the method and commits on success, rolls back on RuntimeException (by default). Configure rollback: `@Transactional(rollbackFor = Exception.class)`. Transaction attributes: propagation (REQUIRED, REQUIRES_NEW, etc.), isolation, readOnly (hint for HikariCP to optimize connection), timeout. Keep transactions short — long transactions hold DB locks.',
  },
  {
    id: 'jpa-2',
    technology: 'JPA',
    experience: ['Junior', 'Mid'],
    tags: ['Relationships'],
    question: 'How do @OneToMany and @ManyToOne work in JPA?',
    answer:
      '@ManyToOne on the child (owning) side: `@ManyToOne @JoinColumn(name="dept_id") private Department department;`. @OneToMany on the parent (inverse) side: `@OneToMany(mappedBy="department", cascade=CascadeType.ALL, orphanRemoval=true) private List<Employee> employees;`. mappedBy tells JPA the child owns the FK. Cascade propagates operations. FetchType: @ManyToOne is EAGER by default (often change to LAZY), @OneToMany is LAZY by default.',
  },
  {
    id: 'jpa-3',
    technology: 'JPA',
    experience: ['Junior', 'Mid'],
    tags: ['Queries'],
    question: 'How do you write queries in Spring Data JPA?',
    answer:
      'Three ways: (1) Derived query methods from method name: `findByLastNameAndAgeGreaterThan(String name, int age)` — Spring generates the JPQL automatically. (2) @Query with JPQL: `@Query("SELECT e FROM Employee e WHERE e.age > :age")`. (3) @Query with native SQL: `@Query(value="SELECT * FROM employees WHERE age > :age", nativeQuery=true)`. For complex queries use Specification API or Querydsl for type-safe dynamic queries.',
  },
  {
    id: 'jpa-4',
    technology: 'JPA',
    experience: ['Mid'],
    tags: ['Transactions', 'Rollback'],
    question: 'If an error occurs inside a @Transactional method, does it roll back all changes?',
    answer:
      'By default, Spring rolls back only on unchecked exceptions (RuntimeException, Error). Checked exceptions do NOT trigger rollback unless specified: `@Transactional(rollbackFor = Exception.class)`. Rollback applies to the entire unit: if three DB writes happen before the exception, all three are rolled back. Note: if the exception is caught inside the method and not re-thrown, the rollback will NOT happen. Use `TransactionAspectSupport.currentTransactionStatus().setRollbackOnly()` to mark rollback without re-throwing.',
  },
  {
    id: 'jpa-5',
    technology: 'JPA',
    experience: ['Mid'],
    tags: ['Keys', 'Composite'],
    question: 'How do you create a composite primary key in JPA?',
    answer:
      'Option 1 — @EmbeddedId: create a @Embeddable class with the key fields implementing Serializable, then `@EmbeddedId private OrderItemKey id;` in the entity. Option 2 — @IdClass: create a plain class with the same field names/types, annotate the entity with `@IdClass(OrderItemKey.class)`, and annotate each key field with @Id in the entity. @EmbeddedId is preferred as the key is encapsulated in one object.',
  },
  {
    id: 'jpa-6',
    technology: 'JPA',
    experience: ['Senior'],
    tags: ['Relationships', 'Design'],
    question: 'Laptop and Student have a many-to-many relationship. How do you store the number of days left for each assignment?',
    answer:
      'A many-to-many with extra attributes cannot be modeled with just @ManyToMany — you need an explicit join entity. Create a `StudentLaptop` entity with its own @Id, `@ManyToOne Student student`, `@ManyToOne Laptop laptop`, and `int daysRemaining`. Replace the @ManyToMany with @OneToMany on both Student and Laptop pointing to StudentLaptop. This is the standard pattern for "association with attributes."',
  },
  {
    id: 'jpa-7',
    technology: 'JPA',
    experience: ['Mid'],
    tags: ['Lifecycle'],
    question: 'What is the lifecycle of a JPA entity (Spring Bean lifecycle)?',
    answer:
      'JPA entity states: Transient (new, not managed), Managed/Persistent (attached to EntityManager, changes tracked), Detached (was managed, EM closed), Removed (scheduled for deletion). Spring Bean lifecycle: instantiation → dependency injection → @PostConstruct → bean ready → use → @PreDestroy → destroy. For JPA: EntityManager is typically request-scoped; OpenSessionInView pattern keeps the session open for lazy loading (controversial — prefer explicit fetching).',
  },

  // ── JAVA 8 ────────────────────────────────────────────────────────────────
  {
    id: 'j8-1',
    technology: 'Java 8',
    experience: ['Junior', 'Mid'],
    tags: ['Streams'],
    question: 'What is the output of: `Stream.iterate("", s -> s + "x").limit(3).map(s -> s + "y").forEach(System.out::println)`?',
    answer:
      'Output: `y`, `xy`, `xxy`. Stream.iterate generates: "", "x", "xx" (limit 3). Each is mapped by appending "y": "", "x", "xx" → "y", "xy", "xxy". forEach prints each. Note the seed "" mapped with "y" becomes "y", not an empty line.',
  },
  {
    id: 'j8-2',
    technology: 'Java 8',
    experience: ['Senior'],
    tags: ['Concurrency', 'CompletableFuture'],
    question: 'What is CompletableFuture and when do you use it?',
    answer:
      'CompletableFuture is a Java 8 class for asynchronous, non-blocking computation chains. Unlike Future, it supports: `thenApply` (transform result), `thenCompose` (chain async calls), `thenCombine` (combine two futures), `exceptionally` (handle errors), `allOf` / `anyOf`. Run async: `CompletableFuture.supplyAsync(() -> fetchData(), executor)`. Use when you need to compose multiple async operations without blocking threads — common in microservices for parallel API calls.',
  },
  {
    id: 'j8-3',
    technology: 'Java 8',
    experience: ['Mid'],
    tags: ['Concurrency', 'ExecutorService'],
    question: 'What is ExecutorService and Callable?',
    answer:
      'ExecutorService manages a pool of threads and submits tasks. `Executors.newFixedThreadPool(5)` creates a pool of 5 threads. `submit(Callable<V>)` returns a `Future<V>` — call `future.get()` to block for the result. `submit(Runnable)` returns `Future<?>`. `shutdown()` gracefully stops after current tasks; `shutdownNow()` sends interrupt. Always shutdown the executor in a finally block or try-with-resources to avoid thread leaks.',
  },
  {
    id: 'j8-4',
    technology: 'Java 8',
    experience: ['Junior', 'Mid'],
    tags: ['Streams'],
    question: 'How do you find employees with age > 40 and get distinct employees by name with age > 20 using Java Streams?',
    answer:
      '`employees.stream().filter(e -> e.getAge() > 40).collect(Collectors.toList())`. Distinct by name with age > 20: `employees.stream().filter(e -> e.getAge() > 20).collect(Collectors.toMap(Employee::getName, e -> e, (e1, e2) -> e1)).values()`. Or with TreeSet: `employees.stream().filter(e -> e.getAge() > 20).collect(Collectors.collectingAndThen(Collectors.toCollection(() -> new TreeSet<>(Comparator.comparing(Employee::getName))), ArrayList::new))`.',
  },
  {
    id: 'j8-5',
    technology: 'Java 8',
    experience: ['Junior'], 
    tags: ['Features'],
    question: 'What are the key Java 8 features?',
    answer:
      'Lambda expressions: `(a, b) -> a + b`. Functional interfaces (Function, Predicate, Consumer, Supplier). Stream API for declarative data processing. Optional<T> to avoid NullPointerException. Default and static methods in interfaces. Date/Time API (java.time): LocalDate, LocalDateTime, ZonedDateTime, Duration, Period — replacing Calendar/Date. Method references: `String::toUpperCase`. CompletableFuture. Collectors utility class. Nashorn JavaScript engine (removed in Java 15). Base64 encoding.',
  },
  {
    id: 'j8-6',
    technology: 'Java 8',
    experience: ['Junior', 'Mid'],
    tags: ['Streams', 'Sorting'],
    question: 'How do you sort a list of objects by salary using Java Streams?',
    answer:
      '`employees.stream().sorted(Comparator.comparing(Employee::getSalary)).collect(Collectors.toList())`. Descending: `.sorted(Comparator.comparing(Employee::getSalary).reversed())`. Multiple fields: `.sorted(Comparator.comparing(Employee::getDept).thenComparing(Employee::getSalary))`. To sort in place: `list.sort(Comparator.comparing(Employee::getSalary))`. Use `Collections.sort(list, comparator)` for older APIs.',
  },

  // ── MULTITHREADING ────────────────────────────────────────────────────────
  {
    id: 'mt-1',
    technology: 'Multithreading',
    experience: ['Junior', 'Mid'],
    tags: ['Thread Creation'],
    question: 'What are the ways to create a thread in Java?',
    answer:
      '(1) Extend Thread class and override run(). (2) Implement Runnable interface and pass to new Thread(runnable). (3) Implement Callable<V> and submit to ExecutorService for a Future result. (4) Use lambda with ExecutorService: `executorService.submit(() -> { ... })`. (5) CompletableFuture.runAsync() or supplyAsync(). Recommended: prefer ExecutorService over raw Thread creation to benefit from thread pooling.',
  },
  {
    id: 'mt-2',
    technology: 'Multithreading',
    experience: ['Mid'],
    tags: ['Thread State'],
    question: 'What happens if you call start() on a thread that is already running?',
    answer:
      'Calling start() on an already started thread throws `IllegalThreadStateException`. A Thread object can only transition from NEW → RUNNABLE once. After it completes (TERMINATED state), you cannot restart it — create a new Thread instance. If you want to run the same task again, use an ExecutorService and resubmit the task instead of managing Thread lifecycle directly.',
  },
  {
    id: 'mt-3',
    technology: 'Multithreading',
    experience: ['Senior'],
    tags: ['Deadlock'],
    question: 'Give an example of creating a deadlock in Java.',
    answer:
      'Thread 1 locks A then tries to lock B. Thread 2 locks B then tries to lock A. If both acquire their first lock simultaneously, each waits for the other forever. Prevention: always acquire locks in the same order (lock ordering), use tryLock() with timeout, use higher-level abstractions (java.util.concurrent). Detection: look for "waiting to lock" in thread dumps. `jstack` shows threads in BLOCKED state with a circular dependency.',
  },

  // ── FRAMEWORKS & PATTERNS ─────────────────────────────────────────────────
  {
    id: 'fp-1',
    technology: 'Frameworks & Patterns',
    experience: ['Junior', 'Mid'],
    tags: ['Design Patterns'],
    question: 'What are the main types of design patterns?',
    answer:
      'Creational: Singleton, Factory, Abstract Factory, Builder, Prototype — how objects are created. Structural: Adapter, Decorator, Proxy, Facade, Bridge, Composite, Flyweight — how objects are composed. Behavioral: Strategy, Observer, Command, Iterator, Template Method, Chain of Responsibility, State, Mediator — how objects communicate. In Spring: Singleton (beans), Factory (BeanFactory), Proxy (AOP, @Transactional), Template (JdbcTemplate), Observer (ApplicationEvent).',
  },
  {
    id: 'fp-2',
    technology: 'Frameworks & Patterns',
    experience: ['Senior'],
    tags: ['Distributed Systems', 'Saga'],
    question: 'What is the Saga pattern and how does it handle compensation?',
    answer:
      'Saga manages distributed transactions across microservices without a two-phase commit. Each service performs its local transaction and publishes an event. If a downstream step fails, previously completed steps run compensating transactions (rollback actions). Two styles: Choreography (each service listens for events and decides what to do) and Orchestration (a central Saga orchestrator coordinates all steps and compensations). Compensation must be idempotent and domain-safe (e.g., refund an order instead of deleting it).',
  },
  {
    id: 'fp-3',
    technology: 'Frameworks & Patterns',
    experience: ['Senior'],
    tags: ['GC', 'JVM'],
    question: 'What are the types of garbage collectors in Java and what is G1GC?',
    answer:
      'Serial GC: single-threaded, small heaps. Parallel GC (default up to Java 8): multi-threaded young GC. CMS (deprecated): low-pause old-gen GC. G1GC (default Java 9+): divides heap into equal-sized regions (Eden, Survivor, Old, Humongous). Collects regions with most garbage first (Garbage-First). Balanced throughput and latency. ZGC (Java 11+): concurrent, sub-millisecond pauses regardless of heap size. Shenandoah: similar to ZGC. Tune G1: `-XX:MaxGCPauseMillis=200 -XX:G1HeapRegionSize=4m`.',
  },
  {
    id: 'fp-4',
    technology: 'Frameworks & Patterns',
    experience: ['Mid', 'Senior'],
    tags: ['Thread Pool'],
    question: 'What are the thread pool implementations in Java?',
    answer:
      'Executors.newFixedThreadPool(n): fixed number of threads, unbounded queue. Executors.newCachedThreadPool(): unbounded threads, creates/reuses, idle threads removed after 60s. Executors.newSingleThreadExecutor(): one thread, guarantees sequential execution. Executors.newScheduledThreadPool(n): for scheduled/periodic tasks. ThreadPoolExecutor: direct constructor for full control over core/max pool size, keepAlive, queue type (LinkedBlockingQueue, SynchronousQueue), RejectedExecutionHandler. ForkJoinPool: work-stealing pool for parallel recursive tasks.',
  },

  // ── CODING QUESTIONS ─────────────────────────────────────────────────────────
  {
    id: 'code-1',
    technology: 'Coding',
    experience: ['Junior', 'Mid'],
    tags: ['Math', 'Excel'],
    question: 'Find the column number for an Excel column name (A=1, Z=26, AA=27, AAA=703).',
    answer:
      'Treat each character as a base-26 digit (1-indexed). For each character c at position i from the right: contribution = (c - \'A\' + 1) * 26^i. Java: `int col = 0; for (char c : s.toCharArray()) { col = col * 26 + (c - \'A\' + 1); }`. A=1, Z=26, AA=26+1=27, AAA=26²+26+1=703.',
  },
  {
    id: 'code-2',
    technology: 'Coding',
    experience: ['Junior', 'Mid'],
    tags: ['LinkedList'],
    question: 'Increment a number represented as a linked list: [1]→[2]→[3] + 1 = [1]→[2]→[4], but [9]→[9]+1 = [1]→[0]→[0].',
    answer:
      'Reverse the list, add carry starting at 1. For each node: sum = node.val + carry; node.val = sum % 10; carry = sum / 10. After all nodes, if carry > 0 append a new node. Reverse back. Alternative: recursive — add 1 from the tail recursively, propagate carry up.',
  },
  {
    id: 'code-3',
    technology: 'Coding',
    experience: ['Junior', 'Mid'],
    tags: ['Arrays', 'Two Pointers'],
    question: 'Find all unique pairs in an array that sum to a given target: {1,2,3,4,5,6}, sum=6 → {1,5},{2,4}.',
    answer:
      'HashSet approach for first pair O(n): iterate, check if `(target - num)` is in seen set. For all unique pairs: use a Set to track visited numbers and a Set<String> for output pairs (sorted key to avoid duplicates). Two-pointer for sorted array: sort, use left/right pointers, move inward on match. For first pair only: return on first match.',
  },
  {
    id: 'code-4',
    technology: 'Coding',
    experience: ['Mid'],
    tags: ['Arrays', 'Kadane'],
    question: 'Find the maximum subarray sum (with position) in an array with positive and negative numbers.',
    answer:
      'Kadane\'s algorithm: track `currentSum` and `maxSum`. `currentSum = Math.max(nums[i], currentSum + nums[i])`. Update `maxSum` when currentSum > maxSum. Track start/end indices: reset start on new maximum starting point, update end on new maxSum. O(n) time, O(1) space. Example: [-2,1,-3,4,-1,2,1,-5,4] → max sum 6 (subarray [4,-1,2,1]).',
  },
  {
    id: 'code-5',
    technology: 'Coding',
    experience: ['Junior'],
    tags: ['Strings'],
    question: 'Check if a string is a pangram (contains every letter of the alphabet at least once).',
    answer:
      '`boolean isPangram(String s) { return s.toLowerCase().chars().filter(Character::isLetter).distinct().count() == 26; }`. Or with a boolean[26] array: mark each letter as seen, check all 26 are true at the end. O(n) time, O(1) space.',
  },
  {
    id: 'code-6',
    technology: 'Coding',
    experience: ['Mid'],
    tags: ['Strings', 'Recursion'],
    question: 'Reverse each word in a string using recursion: "Hello Bye" → "olleH eyB".',
    answer:
      'Split the string by spaces: `String[] words = s.split(" ")`. Reverse each word recursively: `reverseWord(word) = word.isEmpty() ? "" : reverseWord(word.substring(1)) + word.charAt(0)`. Join back: `String.join(" ", reversedWords)`. For the full string recursively: split at first space, reverse the first word, recurse on the rest.',
  },
  {
    id: 'code-7',
    technology: 'Coding',
    experience: ['Mid'],
    tags: ['Strings', 'Sliding Window'],
    question: 'Find the longest substring without repeating characters (sliding window).',
    answer:
      'Use a sliding window with a HashMap<Character, Integer> tracking last-seen index. `maxLen = 0, start = 0`. For each index i: if `map.containsKey(c) && map.get(c) >= start`, move `start = map.get(c) + 1`. Update map with current index. Update maxLen. O(n) time, O(min(n,m)) space where m = charset size.',
  },
  {
    id: 'code-8',
    technology: 'Coding',
    experience: ['Junior'],
    tags: ['Basics'],
    question: 'Swap two numbers without using a third variable.',
    answer:
      'With arithmetic: `a = a + b; b = a - b; a = a - b;` (overflow risk for large ints). With XOR (no overflow): `a = a ^ b; b = a ^ b; a = a ^ b;`. In Java/Python: tuple swap `a, b = b, a` or in Java: `int temp` is simpler and clearer — the XOR trick is an interview artifact, not production code.',
  },
  {
    id: 'code-9',
    technology: 'Coding',
    experience: ['Junior'],
    tags: ['Arrays', 'Duplicates'],
    question: 'Find the duplicate element in a sorted array.',
    answer:
      'For a sorted array, duplicates are adjacent: `for (int i = 1; i < arr.length; i++) { if (arr[i] == arr[i-1]) return arr[i]; }`. O(n) time, O(1) space. For unsorted: use a HashSet — add elements; if add() returns false, that\'s the duplicate. If range is 1..n and exactly one duplicate: use Floyd\'s cycle detection or XOR/sum tricks in O(n) time O(1) space.',
  },
  {
    id: 'code-10',
    technology: 'Coding',
    experience: ['Mid'],
    tags: ['Strings', 'Palindrome'],
    question: 'Find the longest palindromic substring in a string.',
    answer:
      'Expand-around-center O(n²): for each index i, expand outward for both odd (center i) and even (center i, i+1) palindromes, tracking the longest. `expandAroundCenter(s, left, right)` returns the longest palindrome length. Manacher\'s algorithm solves it in O(n) but is complex. DP solution: O(n²) time and space. For most interviews, expand-around-center is the expected answer.',
  },
  {
    id: 'code-11',
    technology: 'Coding',
    experience: ['Mid'],
    tags: ['Strings', 'Sliding Window'],
    question: 'Find the smallest substring of "Naruto Uzumaki Kakashi Hatake" that contains all characters of "umi".',
    answer:
      'Minimum window substring: use a sliding window with two frequency maps — target (character counts for "umi") and window. Expand right: add char to window, increment `formed` when window count matches target count for that char. When all chars are formed, contract left to minimize window, updating the result. O(n) time. For "Naruto Uzumaki Kakashi Hatake" and target "umi": the answer is "umaki".',
  },
  {
    id: 'code-12',
    technology: 'Coding',
    experience: ['Junior'],
    tags: ['Numbers'],
    question: 'Compute the sum of digits of 4567 (4+5+6+7=22).',
    answer:
      'Iterative: `int sum = 0; while (n > 0) { sum += n % 10; n /= 10; }`. Using streams: `String.valueOf(n).chars().map(c -> c - \'0\').sum()`. Recursive: `digitSum(n) = n < 10 ? n : n % 10 + digitSum(n / 10)`. Handle negative numbers: take `Math.abs(n)` first.',
  },

  // ── PUZZLES ───────────────────────────────────────────────────────────────
  {
    id: 'puz-1',
    technology: 'Puzzles',
    experience: ['Junior', 'Mid', 'Senior'],
    tags: ['Logic'],
    question: 'How do you cut a round cake into 8 equal pieces with exactly 3 cuts?',
    answer:
      '2 cuts through the center (making 4 quarters), then 1 horizontal cut parallel to the flat surface — cutting the cake in half through the middle (top half, bottom half). Each of the 4 vertical quarters is now split into 2 by the horizontal cut = 8 pieces. All 8 pieces are equal.',
  },
  {
    id: 'puz-2',
    technology: 'Puzzles',
    experience: ['Junior', 'Mid', 'Senior'],
    tags: ['Logic', 'Time'],
    question: 'You have 2 ropes. Each burns in exactly 60 minutes (non-uniformly). How do you measure exactly 45 minutes?',
    answer:
      'Light rope 1 from BOTH ends simultaneously, and rope 2 from ONE end. When rope 1 burns out (30 minutes have passed), immediately light the other end of rope 2. Rope 2 had 30 minutes of burn time left; burning from both ends halves that to 15 minutes. Total: 30 + 15 = 45 minutes.',
  },
  {
    id: 'puz-3',
    technology: 'Puzzles',
    experience: ['Mid', 'Senior'],
    tags: ['Logic', 'Weighing'],
    question: '100 bottles of pills, each pill weighs 1g. One bottle is faulty: each pill in it weighs 1.1g. You can use a scale only once. How do you identify the faulty bottle?',
    answer:
      'Number the bottles 1 to 100. Take 1 pill from bottle 1, 2 from bottle 2, ..., 100 from bottle 100. Total pills = 5050. If all pills were 1g, the scale would read 5050g. The actual reading will be heavier. Extra weight = (reading − 5050) × 10. If extra weight is, say, 0.3g, the faulty bottle is #3 (it contributed 3 × 0.1g extra). One weighing, no guessing.',
  },

  // ── OTHERS ───────────────────────────────────────────────────────────────────
  {
    id: 'other-1',
    technology: 'System Design',
    experience: ['Mid', 'Senior'],
    tags: ['Programming Paradigms'],
    question: 'What is the difference between imperative and declarative programming?',
    answer:
      'Imperative: you describe HOW to do something — step by step instructions, state mutations (for loops, if statements). Example: classic Java for-loop. Declarative: you describe WHAT you want — the how is abstracted away. Examples: SQL (`SELECT * FROM users WHERE age > 30`), Stream API (`.filter().map().collect()`), React JSX, HTML. Declarative code is usually more concise and easier to reason about; the engine figures out the implementation details.',
  },
];
