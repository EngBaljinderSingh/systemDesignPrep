// ── HLD Case Studies with Capacity Math, Bottleneck Simulation & Architecture Deep Dives
// Extracted and extended from "System Design Demo - HLD, Storage & Instance Calculations.pptx"

export interface HLDComponent {
  name: string;
  role: string;
  technology: string;
  description: string;
}

export interface CalcStep {
  label: string;
  formula: string;
  result: string;
  explanation: string;
}

export interface InstanceOption {
  spec: string;
  ramGB: number;
  cores: number;
  memoryBound: string;
  cpuBound: string;
  bottleneck: 'Memory' | 'CPU' | 'Network/OS Cap' | 'Storage IOPS';
  bottleneckExplanation: string;
  instancesRequired: number;
  costEstimate: string;
  isRecommended?: boolean;
}

export interface InterviewQA {
  question: string;
  interviewerIntent: string;
  recommendedAnswer: string;
}

export interface ArchitecturalTradeoff {
  decision: string;
  chosen: string;
  alternative: string;
  rationale: string;
}

export interface SimulatorPreset {
  defaultDau: number;
  dauUnit: string;
  defaultActionsPerUser: number;
  actionLabel: string;
  defaultPayloadBytes: number;
  payloadLabel: string;
  defaultPeakMultiplier: number;
  defaultCpuTimeMs: number;
  defaultThreadStackMB: number;
  isConnectionWorkload?: boolean;
  maxSocketCapPerNode?: number;
}

export interface HLDCaseStudy {
  id: string;
  title: string;
  icon: string;
  category: 'Messaging & Realtime' | 'Traffic & Security' | 'E-Commerce & High Concurrency' | 'Distributed Storage' | 'Media & Streaming';
  tagline: string;
  diagramImage: string;
  functionalReqs: string[];
  nonFunctionalReqs: string[];
  components: HLDComponent[];
  scaleMetrics: { label: string; value: string; hint: string }[];
  storageCalcs: CalcStep[];
  instanceOptions: InstanceOption[];
  primaryBottleneck: 'Memory' | 'CPU' | 'Network/OS Cap' | 'Storage IOPS';
  bottleneckSummary: string;
  bottleneckWhy: string;
  simulatorPreset: SimulatorPreset;
  interviewQAs: InterviewQA[];
  tradeoffs: ArchitecturalTradeoff[];
  takeaway: string;
}

// ── General Capacity Rules & Heuristics ──────────────────────────────────────
export const capacityRules = [
  {
    title: 'The 70% Safe Utilization Rule',
    formula: 'Usable Resource = Total Hardware Spec × 0.70',
    description: 'Never provision hardware to 100% capacity. Allocate a 30% safety cushion for Garbage Collection (GC) pauses, OS kernel socket buffers, sudden traffic spikes, and failover overhead.',
    keyRule: 'Rule of thumb: 70% threshold is where latency degrades exponentially under queueing theory (M/M/1 queue).',
  },
  {
    title: 'Max QPS per Instance Formulation',
    formula: 'Safe QPS = min(Memory-Bound QPS, CPU-Bound QPS, OS Socket Limit)',
    description: 'A server can only process as many requests as its tightest bottleneck allows. If RAM runs out, CPU sits idle. If CPU pegs at 100%, RAM goes wasted.',
    keyRule: 'Always calculate both Memory QPS and CPU QPS independently, then take the minimum.',
  },
  {
    title: 'Linux OS Socket & Connection Ceiling',
    formula: 'Max Conns = min(Usable RAM / Conn State, ~3,000,000 Sockets)',
    description: 'Linux systems hit limits on file descriptors, ephemeral ports, and kernel TCP receive/transmit buffer memory around 3 million concurrent persistent TCP/WebSocket connections per box.',
    keyRule: 'Adding 256 GB RAM will NOT give you 20M connections on a single machine due to OS network stack serialization.',
  },
  {
    title: 'Mental Math: The 86,400s Conversion Shortcut',
    formula: '1 Million req/day ≈ 12 QPS | 100 Million req/day ≈ 1,200 QPS',
    description: '1 day has 24 × 60 × 60 = 86,400 seconds. In live interviews, approximate 86,400 as 100,000 for effortless mental arithmetic. Multiply by 2× or 3× for peak QPS.',
    keyRule: 'Mental shortcut: Requests per day / 100,000 = Baseline QPS. Multiply by 2.5 for peak.',
  },
  {
    title: 'Memory-Bound QPS Calculation',
    formula: 'RAM QPS = (Usable RAM in MB) / (Thread Stack MB × Request Latency in sec)',
    description: 'In traditional multi-threaded servers (e.g. Tomcat/Java), each active request ties up a thread stack (typically 1-2 MB). If requests take 50ms, threads cycle 20× per second.',
    keyRule: 'Heavy thread stacks choke memory on small VMs before CPU cores are even 20% utilized.',
  },
  {
    title: 'CPU-Bound QPS Calculation',
    formula: 'CPU QPS = (CPU Cores × 0.70 × 1,000 ms) / CPU Time per Request (ms)',
    description: 'Determines the maximum number of requests the processor cores can execute per second based on the active compute time (hashing, serialization, lock acquisition).',
    keyRule: 'For 4 cores and 2ms CPU execution: (4 × 0.7 × 1000) / 2 = 1,400 QPS max.',
  },
];

// ── Case Studies ──────────────────────────────────────────────────────────
export const hldCaseStudies: HLDCaseStudy[] = [
  {
    id: 'whatsapp',
    title: 'WhatsApp / Chat App',
    icon: '💬',
    category: 'Messaging & Realtime',
    tagline: 'Real-time messaging at 100M DAU with persistent WebSocket connections & offline queuing',
    diagramImage: '/hld-whatsapp.jpg',
    functionalReqs: [
      'One-on-One Real-Time Messaging (<100ms delivery)',
      'Message Delivery Status (Sent, Delivered, Read ticks)',
      'Online Presence & Last Seen timestamp updates',
      'Offline Storage & Device Sync when user reconnects',
      'End-to-End Encryption (E2EE) key exchange',
      'Media sharing via pre-signed URL uploads',
    ],
    nonFunctionalReqs: [
      'Ultra-Low Latency (<100ms message roundtrip worldwide)',
      'High Availability (99.999% uptime — communication critical)',
      'Massive Scalability (100M+ DAU, 20M concurrent connections)',
      'Zero Message Loss (Durability & guaranteed delivery order)',
      'Storage Efficiency (Auto-archive after delivery or retention cutoff)',
    ],
    components: [
      {
        name: 'WebSocket Gateway Cluster',
        role: 'Connection Termination',
        technology: 'Erlang / Go / Netty',
        description: 'Maintains long-lived duplex TCP/WebSocket connections with mobile and desktop clients, handling heartbeats and message ingress.',
      },
      {
        name: 'Session & Presence Manager',
        role: 'Connection Mapping',
        technology: 'Redis Cluster / Memcached',
        description: 'Maps User_ID → Gateway Server IP. When User A messages User B, Session Manager tells Gateway A which Gateway holds User B’s socket.',
      },
      {
        name: 'Message Store',
        role: 'Persistent Storage',
        technology: 'Apache Cassandra / ScyllaDB',
        description: 'NoSQL wide-column store optimized for high-write append-only chat logs partitioned by Conversation_ID and clustered by timestamp.',
      },
      {
        name: 'Push Notification Fallback',
        role: 'Offline Alerting',
        technology: 'Apple APNs / Google FCM + Kafka',
        description: 'If User B is offline (no active socket in Session Manager), enqueues a push alert to wake up the recipient device.',
      },
      {
        name: 'Media Object Store',
        role: 'Asset Hosting',
        technology: 'AWS S3 / Cloudflare R2 + CDN',
        description: 'Stores encrypted photos and videos. Messages only carry the media metadata and short-lived download token.',
      },
    ],
    scaleMetrics: [
      { label: 'Daily Active Users (DAU)', value: '100,000,000', hint: '100M active mobile devices' },
      { label: 'Messages per User / Day', value: '50 msgs', hint: 'Average daily volume' },
      { label: 'Total Daily Messages', value: '5 Billion msgs', hint: '5 × 10⁹ messages / 24 hours' },
      { label: 'Peak Concurrent Conns', value: '20,000,000', hint: '20% of DAU connected simultaneously' },
    ],
    storageCalcs: [
      {
        label: 'Average Text Message Size',
        formula: 'Header (32B) + Text Payload (128B) + Metadata/Timestamps (40B)',
        result: '200 bytes / message',
        explanation: 'E2EE ciphertext payload with metadata headers.',
      },
      {
        label: 'Daily Text Data Ingress',
        formula: '5,000,000,000 msgs × 200 bytes',
        result: '1,000 GB / day (1 TB / day)',
        explanation: 'Append-only raw chat stream generated daily across the planet.',
      },
      {
        label: '5-Year Message Retention',
        formula: '1 TB / day × 365 days × 5 years',
        result: '~1.825 Petabytes',
        explanation: 'Requires tiered storage with cold-data archiving to S3 Glacier after 90 days.',
      },
      {
        label: 'Media Storage (10% with photo/video)',
        formula: '500M media files / day × 100 KB avg compressed size',
        result: '50 TB / day (18.25 PB / year)',
        explanation: 'Stored in distributed object stores with CDN caching for popular media.',
      },
    ],
    instanceOptions: [
      {
        spec: 'Standard 4 GB Server (4 Cores)',
        ramGB: 4,
        cores: 4,
        memoryBound: 'Usable RAM = 2,800 MB. At 10 KB/connection socket = ~280,000 connections',
        cpuBound: '4 Cores handles ~30,000 QPS packet routing',
        bottleneck: 'Memory',
        bottleneckExplanation: '4 GB is exhausted by socket buffers before OS connection caps are approached.',
        instancesRequired: 72,
        costEstimate: '~$2,880 / month',
      },
      {
        spec: 'High-Density 64 GB Server (16 Cores)',
        ramGB: 64,
        cores: 16,
        memoryBound: 'RAM can theoretically support 4.5M sockets (44.8 GB usable / 10 KB)',
        cpuBound: '16 Cores handles >100,000 QPS packet routing',
        bottleneck: 'Network/OS Cap',
        bottleneckExplanation: 'Linux OS networking stack, ephemeral ports, and NIC file descriptors impose a hard safety ceiling at ~3,000,000 TCP sockets per node, irrespective of remaining RAM.',
        instancesRequired: 8,
        costEstimate: '~$1,920 / month',
        isRecommended: true,
      },
    ],
    primaryBottleneck: 'Network/OS Cap',
    bottleneckSummary: 'WebSocket Gateway nodes are bound by Linux OS TCP Socket & File Descriptor limits (~3M conns/box), NOT CPU.',
    bottleneckWhy: 'Each active connection requires a Linux file descriptor, kernel socket memory (rmem/wmem buffers), and heartbeat tracking. Even if you install 256 GB RAM, the Linux networking stack cannot reliably multiplex 10M TCP sockets on one machine without packet loss and kernel lock contention. Sizing at ~2.5M to 3M connections per 64GB box is the industry sweet spot.',
    simulatorPreset: {
      defaultDau: 100000000,
      dauUnit: 'Users',
      defaultActionsPerUser: 50,
      actionLabel: 'Messages / User / Day',
      defaultPayloadBytes: 200,
      payloadLabel: 'Avg Message Size (Bytes)',
      defaultPeakMultiplier: 2.5,
      defaultCpuTimeMs: 0.1,
      defaultThreadStackMB: 0.01, // 10 KB lightweight socket state
      isConnectionWorkload: true,
      maxSocketCapPerNode: 3000000,
    },
    interviewQAs: [
      {
        question: 'Why not use HTTP Long Polling instead of WebSockets for messaging?',
        interviewerIntent: 'Testing protocol knowledge and connection overhead awareness.',
        recommendedAnswer: 'HTTP long polling incurs massive header overhead (500B-1KB per request/response roundtrip) and requires re-establishing TCP handshakes continuously. For 5B daily messages, HTTP headers alone would consume over 4 TB of unnecessary bandwidth daily. WebSockets establish one persistent 2-way TCP duplex connection where each message frame only adds 2-6 bytes of protocol overhead.',
      },
      {
        question: 'What happens when a user is in a 500-person group chat?',
        interviewerIntent: 'Checking understanding of Fan-Out on write vs Fan-Out on read.',
        recommendedAnswer: 'For large groups, writing 500 distinct messages per chat line (fan-out on write) overwhelms storage. Instead, store the message once under Group_ID in Cassandra. The Gateway looks up all active group members in Redis Session Manager and streams the message reference to the connected members sockets.',
      },
      {
        question: 'How do you prevent data loss if a Gateway node crashes with 2M connections?',
        interviewerIntent: 'Testing fault-tolerance and client reconnection strategies.',
        recommendedAnswer: 'WebSocket connections are stateless conduits; state lives in Cassandra and Redis. If a gateway dies, clients reconnect using Exponential Backoff with Jitter to prevent a Thundering Herd on remaining gateway instances. Reconnecting clients fetch unread messages from Cassandra using their Last_Ack_Message_ID.',
      },
    ],
    tradeoffs: [
      {
        decision: 'Connection Protocol',
        chosen: 'WebSocket (Full Duplex)',
        alternative: 'HTTP/2 Server-Sent Events (SSE) or Polling',
        rationale: 'WebSockets allow client-to-server and server-to-client instantaneous delivery on a single persistent TCP socket with minimal per-frame byte overhead.',
      },
      {
        decision: 'Message Database',
        chosen: 'Apache Cassandra (Wide Column)',
        alternative: 'PostgreSQL (RDBMS)',
        rationale: 'Cassandra offers linear horizontal write scaling, append-only LSM trees without write locking, and automatic TTL deletion for ephemeral chats.',
      },
    ],
    takeaway: 'In connection-heavy systems (chat, push notifications), high-spec machines hit Linux kernel TCP buffer and socket limits around 3M connections per server. Scale out horizontally with 64 GB instances capped at ~2.5M to 3M connections each.',
  },

  {
    id: 'rate-limiter',
    title: 'Distributed Rate Limiter',
    icon: '🚦',
    category: 'Traffic & Security',
    tagline: 'Distributed high-throughput API throttling at 116K peak QPS using Redis Lua scripting',
    diagramImage: '/hld-ratelimiter.jpg',
    functionalReqs: [
      'Granular Identity Limiting (by User_ID, IP address, or API Client Key)',
      'Configurable Rule Matrix (Tiered limits: Free=60 rpm, Pro=10,000 rpm)',
      'Standardized Telemetry Headers (X-RateLimit-Limit, Remaining, Reset)',
      'Graceful HTTP 429 Rejection with Retry-After header',
      'Support Token Bucket and Sliding Window Log algorithms',
    ],
    nonFunctionalReqs: [
      'Ultra-Low Overhead (<1ms latency added to API request path)',
      'High Throughput (100K+ QPS across multiple regions)',
      'Strict Concurrency & Atomicity (Zero race conditions on token counts)',
      'Fault Tolerance (Fail-Open policy: if rate limiter crashes, allow traffic)',
      'Minimal Memory Footprint for millions of active keys',
    ],
    components: [
      {
        name: 'API Gateway / Reverse Proxy',
        role: 'Traffic Interceptor',
        technology: 'Envoy / Kong / Nginx',
        description: 'Edge filter that extracts identity tokens (Bearer token, IP) and queries the rate limiter filter before routing upstream.',
      },
      {
        name: 'Rate Limiter Service Middleware',
        role: 'Policy Evaluation',
        technology: 'Go / Rust microservice',
        description: 'Evaluates rate limit policies, checks local L1 in-memory caches, and delegates atomic increments to Redis.',
      },
      {
        name: 'Redis Cluster (Atomic Store)',
        role: 'Distributed Counter',
        technology: 'Redis Cluster with Lua Scripts',
        description: 'Executes atomic token deduction or sliding window timestamps in a single thread without distributed lock overhead.',
      },
      {
        name: 'Local L1 Cache (Per-Host)',
        role: 'Spike Protection',
        technology: 'In-Memory LRU (Caffeine / Ristretto)',
        description: 'Caches blocked IPs locally for 5 seconds to instantly drop abusive DDoS attacks without putting load on Redis.',
      },
    ],
    scaleMetrics: [
      { label: 'Total Daily Requests', value: '5,000,000,000', hint: '100M users × 50 requests/day' },
      { label: 'Average QPS', value: '58,000 QPS', hint: '5B requests / 86,400 seconds' },
      { label: 'Peak Traffic QPS', value: '116,000 QPS', hint: '2× peak surge multiplier' },
      { label: 'Active Rate Limit Keys', value: '100,000,000', hint: '100M unique client keys in Redis' },
    ],
    storageCalcs: [
      {
        label: 'Redis Key-Value Payload',
        formula: 'Key "rl:{user_id}" (24B) + Counter (8B) + Timestamp (8B) + Redis dict overhead (24B)',
        result: '64 bytes / key',
        explanation: 'Compact binary packing in Redis string or hash structures.',
      },
      {
        label: 'Total Redis Cluster RAM',
        formula: '100,000,000 active keys × 64 bytes',
        result: '~6.4 GB RAM',
        explanation: 'Astonishingly small! The entire rate-limiting state of 100M users fits in a single Redis instance or 3-node replica.',
      },
      {
        label: 'Network Bandwidth per Check',
        formula: 'TCP Ingress (60B) + Lua Script Response (40B)',
        result: '100 bytes / request',
        explanation: 'Ultra-lightweight RPC between API Gateway and Redis.',
      },
      {
        label: 'Peak Bandwidth at 116K QPS',
        formula: '116,000 QPS × 100 bytes',
        result: '11.6 MB / sec (92.8 Mbps)',
        explanation: 'Negligible on standard 10 Gbps cloud network interfaces.',
      },
    ],
    instanceOptions: [
      {
        spec: 'Small 4 GB Server (4 Cores)',
        ramGB: 4,
        cores: 4,
        memoryBound: '2,800 MB usable / 2 MB thread stack = 1,400 threads → ~750 QPS',
        cpuBound: '4 Cores × 0.70 × 1000ms / 1ms = 2,800 QPS',
        bottleneck: 'Memory',
        bottleneckExplanation: 'In multi-threaded architectures, thread stacks (1-2MB each) exhaust RAM long before CPU cores are fully loaded.',
        instancesRequired: 155,
        costEstimate: '~$6,200 / month',
      },
      {
        spec: 'Optimized 64 GB Server (8 Cores)',
        ramGB: 64,
        cores: 8,
        memoryBound: '44,800 MB / 2 MB thread stack = 22,400 threads → ~12,000 QPS',
        cpuBound: '8 Cores × 0.70 × 1000ms / 1ms = 5,600 QPS',
        bottleneck: 'CPU',
        bottleneckExplanation: 'With ample RAM, the bottleneck flips to CPU execution time (network deserialization, Lua evaluation, and crypto hash verification).',
        instancesRequired: 21,
        costEstimate: '~$2,520 / month',
        isRecommended: true,
      },
    ],
    primaryBottleneck: 'CPU',
    bottleneckSummary: 'At scale, rate limiters on modern high-RAM instances are CPU-bound by network I/O serialization and Lua script evaluation.',
    bottleneckWhy: 'Because the data footprint is tiny (6.4 GB fits completely in memory), RAM is never the issue on modern servers. Instead, processing 116,000 incoming checks per second requires CPU interrupts, JSON/Protobuf decoding, and Redis single-threaded Lua script serialization. 8 CPU cores with 1ms execution per check max out at 5,600 QPS.',
    simulatorPreset: {
      defaultDau: 100000000,
      dauUnit: 'Users',
      defaultActionsPerUser: 50,
      actionLabel: 'API Calls / User / Day',
      defaultPayloadBytes: 64,
      payloadLabel: 'Key State Size (Bytes)',
      defaultPeakMultiplier: 2.0,
      defaultCpuTimeMs: 1.0,
      defaultThreadStackMB: 2.0,
      isConnectionWorkload: false,
    },
    interviewQAs: [
      {
        question: 'Why use Redis Lua scripts instead of standard GET then SET commands?',
        interviewerIntent: 'Testing concurrency knowledge and race condition mitigation.',
        recommendedAnswer: 'GET and SET are two separate operations. In a high-concurrency window, 10 parallel requests could all read "counter = 99", see it is under the 100 limit, and all increment to 100, letting 109 requests through. A Lua script executes atomically within Redis’s single-threaded event loop, guaranteeing zero race conditions without slow distributed locks.',
      },
      {
        question: 'What happens if the Redis Cluster completely crashes?',
        interviewerIntent: 'Testing resilience and system trade-offs (Availability vs Consistency).',
        recommendedAnswer: 'We implement a Fail-Open policy. If the rate limiter times out (>5ms) or Redis is unreachable, log an urgent alert and let the request proceed to backend services. Rejecting all legitimate customer traffic (Fail-Closed) is usually far worse for business revenue than temporarily allowing rate surges.',
      },
    ],
    tradeoffs: [
      {
        decision: 'Rate Limiting Algorithm',
        chosen: 'Token Bucket',
        alternative: 'Sliding Window Log',
        rationale: 'Token Bucket uses only 2 numbers per user (timestamp + token count = 16B) and easily handles bursts. Sliding Window Log stores timestamps for every single call, which requires unbounded memory.',
      },
      {
        decision: 'Failure Policy',
        chosen: 'Fail-Open',
        alternative: 'Fail-Closed',
        rationale: 'Protecting availability is paramount. Circuit breakers protect downstream databases if an actual flood occurs.',
      },
    ],
    takeaway: 'Small 4 GB instances are severely memory-bound by thread stack allocations. Scaling up to 64 GB instances flips the bottleneck to CPU core execution time. Always prefer fewer CPU-optimized compute nodes over hundreds of tiny memory-constrained VMs.',
  },

  {
    id: 'bookmyshow',
    title: 'BookMyShow / Ticketmaster',
    icon: '🎬',
    category: 'E-Commerce & High Concurrency',
    tagline: 'High-consistency seat reservation with distributed locks at 50K peak QPS for flash sales',
    diagramImage: '/hld-bookmyshow.jpg',
    functionalReqs: [
      'Movie & Venue Search across 500+ cities with showtime schedules',
      'Interactive Real-Time Seat Layout & Availability map',
      'Temporary 10-Minute Seat Reservation Hold during checkout',
      'Strict ACID Payment Processing (Zero double-booking)',
      'Automated Seat Release Timer if payment is abandoned',
    ],
    nonFunctionalReqs: [
      'Absolute Consistency on Seat Allocation (Overbooking is illegal)',
      'Extreme Flash Sale Peak Handling (50,000 QPS during blockbuster releases)',
      'Sub-50ms catalog read latency via caching',
      'Isolation of booking write traffic from read search traffic',
      'PCI-DSS compliance for payment tokenization',
    ],
    components: [
      {
        name: 'Catalog & Search Engine',
        role: 'Read Traffic Handling',
        technology: 'ElasticSearch + Redis Cache',
        description: 'Caches showtimes, venue maps, and movie posters. 99% of user traffic is read-only browsing.',
      },
      {
        name: 'Distributed Seat Lock Engine',
        role: 'Seat Reservation State',
        technology: 'Redis SETNX with 10-min TTL',
        description: 'Atomically locks seat IDs using `SET seat:{show_id}:{seat_no} {user_id} NX EX 600`. Prevents double reservations in memory.',
      },
      {
        name: 'Booking & Payment Transaction DB',
        role: 'ACID Finalization',
        technology: 'PostgreSQL with Row-Level Locks',
        description: 'Executes the final booking transaction inside a serializable database transaction once payment gateway confirms authorization.',
      },
      {
        name: 'TTL Expiry Scanner',
        role: 'Seat Reclamation',
        technology: 'Redis Keyspace Notifications + RabbitMQ',
        description: 'When a 10-minute lock key expires without payment confirmation, emits an event to restore the seat status to AVAILABLE on the UI.',
      },
    ],
    scaleMetrics: [
      { label: 'Cinemas & Screens', value: '500 cities × 10 theaters × 5 screens', hint: '25,000 active screens' },
      { label: 'Active Show-Seats / Day', value: '4,000,000 seats', hint: '4M bookable seats daily' },
      { label: 'Flash Sale Peak QPS', value: '50,000 QPS', hint: 'Avengers/Coldplay ticket drops' },
      { label: 'Completed Daily Bookings', value: '1,000,000 bookings', hint: 'Finalized transactions' },
    ],
    storageCalcs: [
      {
        label: 'Active Seat Lock RAM in Redis',
        formula: '4,000,000 active seats × 64 bytes (Seat_ID, Show_ID, User_ID, Status, TTL)',
        result: '256 MB RAM',
        explanation: 'Extremely lightweight! Even for millions of seats, lock states take less than a gigabyte of RAM.',
      },
      {
        label: 'Daily Completed Bookings Storage',
        formula: '1,000,000 bookings × 500 bytes (Customer, Ticket IDs, Price, Payment Ref)',
        result: '500 MB / day',
        explanation: 'Relational ACID records stored in PostgreSQL with write-ahead logging.',
      },
      {
        label: '1-Year Historical Database Footprint',
        formula: '500 MB / day × 365 days',
        result: '~182.5 GB / year',
        explanation: 'Easily managed on a managed RDS PostgreSQL cluster with Read Replicas.',
      },
    ],
    instanceOptions: [
      {
        spec: '4 GB Server (4 Cores)',
        ramGB: 4,
        cores: 4,
        memoryBound: '2,800 MB / 1.5 MB per thread = 1,866 threads → ~3,733 QPS',
        cpuBound: '4 Cores × 0.70 × 1000ms / 2.5ms processing = 1,120 QPS',
        bottleneck: 'CPU',
        bottleneckExplanation: 'Distributed lock verification, token generation, and DB query preparation take ~2.5ms of active CPU time per request.',
        instancesRequired: 45,
        costEstimate: '~$1,800 / month',
      },
      {
        spec: 'High-Core 64 GB Server (16 Cores)',
        ramGB: 64,
        cores: 16,
        memoryBound: '44,800 MB / 1.5 MB per thread = 29,866 threads → ~59,733 QPS',
        cpuBound: '16 Cores × 0.70 × 1000ms / 2.5ms = 4,480 QPS',
        bottleneck: 'CPU',
        bottleneckExplanation: 'Even on a 64GB box, memory could support 59K QPS, but 16 cores top out at ~4,480 QPS due to lock synchronization overhead.',
        instancesRequired: 12,
        costEstimate: '~$1,680 / month',
        isRecommended: true,
      },
    ],
    primaryBottleneck: 'CPU',
    bottleneckSummary: 'Ticketing engines are severely CPU-bound during flash sales due to distributed lock contention and crypto payment token signing.',
    bottleneckWhy: 'RAM requirements are negligible (256 MB in Redis). The bottleneck is compute: every user click triggers a Redis atomic SETNX check, database connection pool acquisition, and SHA256 payment signature hashing. Each seat hold takes 2-3ms of core compute time.',
    simulatorPreset: {
      defaultDau: 20000000,
      dauUnit: 'Users',
      defaultActionsPerUser: 10,
      actionLabel: 'Seat Searches & Holds / User',
      defaultPayloadBytes: 500,
      payloadLabel: 'Booking Record Size (Bytes)',
      defaultPeakMultiplier: 3.0,
      defaultCpuTimeMs: 2.5,
      defaultThreadStackMB: 1.5,
      isConnectionWorkload: false,
    },
    interviewQAs: [
      {
        question: 'How do you prevent two users from booking the exact same seat simultaneously?',
        interviewerIntent: 'Testing concurrency control in distributed environments.',
        recommendedAnswer: 'Two-phase lock approach: Phase 1 is in-memory via Redis SETNX with key `seat:{show_id}:{seat_number}` and a 10-minute TTL. Only the first request succeeds (returns 1); all competitors immediately receive a "Seat temporarily held by another user" response. Phase 2 occurs when payment succeeds: execute an ACID SQL transaction `UPDATE seats SET status = BOOKED WHERE id = ? AND status = LOCKED`.',
      },
      {
        question: 'What if Redis loses power right after locking a seat?',
        interviewerIntent: 'Testing distributed state recovery.',
        recommendedAnswer: 'Redis AOF (Append Only File) with `fsync everysec` provides durability. Furthermore, we run Redis Sentinel / Cluster with synchronous replication to a read-replica. If the primary crashes, failover occurs within 3 seconds.',
      },
    ],
    tradeoffs: [
      {
        decision: 'Seat Hold Storage',
        chosen: 'Redis Distributed Lock with TTL',
        alternative: 'Direct SQL Row Locks (SELECT FOR UPDATE)',
        rationale: 'Running 50,000 QPS of row locks directly on PostgreSQL would exhaust the connection pool and lock tables, crashing the database. Redis buffers lock attempts at sub-millisecond speeds.',
      },
      {
        decision: 'Catalog Read Strategy',
        chosen: 'ElasticSearch + CDN Caching',
        alternative: 'Live SQL queries',
        rationale: '99% of user clicks are browsing movies and showtimes. Offloading reads to Elasticsearch keeps database IOPS 100% dedicated to checkout transactions.',
      },
    ],
    takeaway: 'Flash-sale seat reservation systems are CPU-bound by lock verification and cryptographic security. Size your cluster based on CPU core execution time (ms per lock attempt) rather than RAM.',
  },

  {
    id: 'tinyurl',
    title: 'URL Shortener (TinyURL / Bitly)',
    icon: '🔗',
    category: 'Distributed Storage',
    tagline: 'High read-to-write ratio (100:1) with Base62 encoding & Key Generation Service (KGS)',
    diagramImage: '/hld-ratelimiter.jpg',
    functionalReqs: [
      'Shortening: Convert long URL to unique 7-character alias (e.g. tiny.cc/xyz123)',
      'Redirection: Redirect short alias to original long URL via HTTP 301 / 302',
      'Custom Aliases (optional vanity URLs like tiny.cc/my-launch)',
      'Link Analytics: Click counts, geographic region, and referrer tracking',
      'Configurable Link Expiration (default 5 years or custom date)',
    ],
    nonFunctionalReqs: [
      'Ultra-Low Redirection Latency (<15ms via aggressive Redis caching)',
      '100:1 Read to Write Ratio (Reads must never block on writes)',
      '100% Collision-Free Short Codes (Guaranteed uniqueness)',
      'High Availability (99.99% uptime — broken links destroy trust)',
      'Predictable Storage Sizing over 5+ years',
    ],
    components: [
      {
        name: 'API Gateway & Load Balancer',
        role: 'Traffic Routing',
        technology: 'Cloudflare / AWS ALB',
        description: 'Routes short link GET requests to Redirection nodes and POST requests to Creation nodes.',
      },
      {
        name: 'Key Generation Service (KGS)',
        role: 'Collision-Free Code Producer',
        technology: 'Go Worker + In-Memory Token Ring',
        description: 'Pre-generates billions of unique Base62 7-character tokens offline and keeps a buffer in memory. Eliminates database collision checking during write requests.',
      },
      {
        name: 'Redirection Caching Tier',
        role: 'Hot Link Caching',
        technology: 'Redis Cluster (LRU Eviction)',
        description: 'Caches the top 20% most accessed short URLs. Serves 80%+ of redirection requests directly from RAM in <2ms.',
      },
      {
        name: 'Distributed Link Store',
        role: 'Permanent Record',
        technology: 'MongoDB / DynamoDB / Cassandra',
        description: 'NoSQL key-value store mapping `short_hash → long_url`. Key-value lookups are O(1) partitioned by short_hash.',
      },
    ],
    scaleMetrics: [
      { label: 'New URLs Shortened', value: '500,000,000 / month', hint: '100M URLs per week' },
      { label: 'Read Redirections', value: '50 Billion / month', hint: '100:1 Read to Write ratio' },
      { label: 'Write QPS', value: '~200 QPS (Peak 500)', hint: '500M / (30 days × 86,400s)' },
      { label: 'Read QPS', value: '~20,000 QPS (Peak 50,000)', hint: '50B / (30 days × 86,400s)' },
    ],
    storageCalcs: [
      {
        label: 'Base62 7-Character Capacity',
        formula: '62⁷ combinations (characters [a-z, A-Z, 0-9])',
        result: '3.52 Trillion unique URLs',
        explanation: 'At 500M URLs/month, 7 characters lasts over 580 years without collisions.',
      },
      {
        label: 'Single URL Record Size',
        formula: 'Short Hash (7B) + Long URL (500B avg) + User_ID (16B) + Created_At (8B)',
        result: '~550 bytes / record',
        explanation: 'Compact document in DynamoDB or MongoDB.',
      },
      {
        label: 'Monthly New Storage',
        formula: '500 Million URLs × 550 bytes',
        result: '275 GB / month',
        explanation: '~3.3 TB / year. Easily stored across modern SSD clusters.',
      },
      {
        label: 'Redis Cache Sizing (80-20 Rule)',
        formula: '20% of daily read volume cached in RAM',
        result: '~180 GB RAM cache',
        explanation: 'A 3-node Redis cluster with 64GB RAM each caches all hot links with 95%+ hit rate.',
      },
    ],
    instanceOptions: [
      {
        spec: 'Read Server: 8 Cores, 16 GB RAM',
        ramGB: 16,
        cores: 8,
        memoryBound: '11,200 MB / 1 MB thread = 11,200 concurrent requests',
        cpuBound: '8 Cores × 0.70 × 1000ms / 0.5ms (Redis read) = 11,200 QPS',
        bottleneck: 'Network/OS Cap',
        bottleneckExplanation: 'Redirection is so lightweight (reading from Redis and returning a 301 header) that network throughput and connection pooling become the limiting factors.',
        instancesRequired: 5,
        costEstimate: '~$450 / month',
        isRecommended: true,
      },
      {
        spec: 'Write Server: 4 Cores, 8 GB RAM',
        ramGB: 8,
        cores: 4,
        memoryBound: 'Ample RAM for KGS token ring',
        cpuBound: '4 Cores handles >5,000 writes/sec with KGS',
        bottleneck: 'Storage IOPS',
        bottleneckExplanation: 'Database write commits determine latency if not properly batched.',
        instancesRequired: 2,
        costEstimate: '~$180 / month',
      },
    ],
    primaryBottleneck: 'Memory',
    bottleneckSummary: 'Read performance depends entirely on Redis RAM cache hit ratio; database disk lookups create latency spikes.',
    bottleneckWhy: 'At 50,000 peak read QPS, querying a relational database or disk-based NoSQL for every link would overwhelm disk IOPS and inflate latency to 40ms+. With an 80-20 Pareto distribution, sizing Redis RAM to hold 20% of daily traffic ensures 95%+ of queries resolve in sub-millisecond RAM.',
    simulatorPreset: {
      defaultDau: 50000000,
      dauUnit: 'Clicks / Day',
      defaultActionsPerUser: 1,
      actionLabel: 'Reads per Click',
      defaultPayloadBytes: 550,
      payloadLabel: 'URL Record Size (Bytes)',
      defaultPeakMultiplier: 2.5,
      defaultCpuTimeMs: 0.5,
      defaultThreadStackMB: 1.0,
      isConnectionWorkload: false,
    },
    interviewQAs: [
      {
        question: 'Should we return HTTP 301 Permanent Redirect or HTTP 302 Temporary Redirect?',
        interviewerIntent: 'Testing understanding of HTTP caching vs telemetry tracking.',
        recommendedAnswer: 'HTTP 301 tells browser to cache redirect locally. Subsequent clicks never touch our servers, reducing server load. HOWEVER, this prevents us from tracking click analytics! HTTP 302 forces every request through our servers so we can log click timestamps, device types, and referrers. Recommended: Use HTTP 302 if analytics are required; HTTP 301 if raw cost reduction is the priority.',
      },
      {
        question: 'How does a Key Generation Service (KGS) prevent hash collisions?',
        interviewerIntent: 'Testing creative architectural solutions to hashing bottlenecks.',
        recommendedAnswer: 'Hashing a URL (e.g. MD5/SHA256) and taking the first 7 characters causes collisions that require expensive DB lookups. KGS solves this by pre-generating sequential 7-character Base62 keys in a background worker, marking them unused, and storing them in an in-memory queue. When a user requests a short URL, the server pops a ready-made unique key in O(1) time with 0% chance of collision.',
      },
    ],
    tradeoffs: [
      {
        decision: 'Short Code Generation',
        chosen: 'Pre-generated KGS (Key Generation Service)',
        alternative: 'MD5 Hash with collision retry loop',
        rationale: 'KGS guarantees O(1) write time without querying the database to check if a hash already exists.',
      },
      {
        decision: 'Redirect Status Code',
        chosen: 'HTTP 302 Found',
        alternative: 'HTTP 301 Moved Permanently',
        rationale: 'Enables real-time click tracking, geolocation analytics, and abuse monitoring on every visit.',
      },
    ],
    takeaway: 'TinyURL is the quintessential read-heavy system (100:1 read ratio). Pre-generate keys with KGS to make writes O(1), and size Redis cache for 20% of daily hot links to keep 95% of reads in sub-millisecond RAM.',
  },

  {
    id: 'netflix-streaming',
    title: 'Video Streaming (Netflix / YouTube)',
    icon: '🎬',
    category: 'Media & Streaming',
    tagline: 'Adaptive bitrate streaming (HLS/DASH) at 100M concurrent streams & Petabit egress',
    diagramImage: '/hld-bookmyshow.jpg',
    functionalReqs: [
      'Video Upload & Automated Multi-Resolution Transcoding (4K, 1080p, 720p, 360p)',
      'Adaptive Bitrate Streaming (HLS / MPEG-DASH chunking based on user network bandwidth)',
      'Playback Resume across multiple devices (Continue Watching)',
      'Personalized Recommendations & Search catalog',
      'Content Delivery Network (CDN) Edge Caching',
    ],
    nonFunctionalReqs: [
      'Zero Playback Buffering (<500ms initial playback start)',
      'Massive Egress Bandwidth Handling (Petabits per second globally)',
      'High Video Availability (99.999% video availability)',
      'Global Low Latency CDN Edge Presence',
      'Optimized Transcoding Cost & Queue Management',
    ],
    components: [
      {
        name: 'Transcoding & Chunking Pipeline',
        role: 'Media Preparation',
        technology: 'FFmpeg + Kubernetes / AWS Batch',
        description: 'Splits raw 100 GB source video into 4-second .ts chunks across multiple codecs (H.264, AV1) and resolutions with an `.m3u8` master manifest.',
      },
      {
        name: 'Edge CDN (Open Connect / Cloudflare)',
        role: 'Global Video Delivery',
        technology: 'Custom ISP Embedded Edge Appliances',
        description: 'Caches video chunks inside local ISP networks. 95%+ of video bytes are served directly from the viewers local ISP router, bypassing the public internet.',
      },
      {
        name: 'Playback Metadata & DRM Service',
        role: 'Session & License Validation',
        technology: 'Go microservices + Widevine/FairPlay DRM',
        description: 'Authenticates subscription tier, checks device DRM capabilities, and issues playback session tokens.',
      },
      {
        name: 'User Viewing History & State Store',
        role: 'Resume State Tracker',
        technology: 'Redis Cluster + Cassandra',
        description: 'Heartbeat ping every 10 seconds records playback offset (e.g. 01:23:45) so users can resume seamlessly.',
      },
    ],
    scaleMetrics: [
      { label: 'Active Subscribers', value: '200,000,000', hint: '200M paying accounts' },
      { label: 'Concurrent Streamers', value: '10,000,000', hint: 'Peak evening viewing (5% of base)' },
      { label: 'Average Stream Bitrate', value: '5 Mbps', hint: '1080p HD stream average' },
      { label: 'Peak Network Egress', value: '50 Terabits / sec (50 Tbps)', hint: '10M streams × 5 Mbps' },
    ],
    storageCalcs: [
      {
        label: 'Single 2-Hour Movie (Master + Formats)',
        formula: '4K (15 GB) + 1080p (4 GB) + 720p (2 GB) + Mobile (800 MB) across 3 codecs',
        result: '~65 GB per movie title',
        explanation: 'Transcoded into thousands of 4-second chunk files.',
      },
      {
        label: 'Catalog Storage (20,000 Titles)',
        formula: '20,000 titles × 65 GB',
        result: '1,300 Terabytes (1.3 Petabytes)',
        explanation: 'Entire catalog easily stored in AWS S3 or Google Cloud Storage.',
      },
      {
        label: 'Peak Egress Bandwidth',
        formula: '10,000,000 concurrent streams × 5 Mbps average bitrate',
        result: '50,000,000 Mbps = 50 Tbps',
        explanation: 'UNFEASIBLE to serve from central cloud datacenters! CDN edge caching inside ISPs is mandatory.',
      },
      {
        label: 'Viewing History Heartbeats',
        formula: '10M streamers × 1 heartbeat / 10s = 1,000,000 QPS write stream',
        result: '1M QPS to Kafka / Redis',
        explanation: 'Batched in memory and flushed periodically to Cassandra.',
      },
    ],
    instanceOptions: [
      {
        spec: 'Origin API Server: 16 Cores, 32 GB RAM',
        ramGB: 32,
        cores: 16,
        memoryBound: 'Handles 30,000 metadata requests/sec',
        cpuBound: '16 Cores handles 8,000 auth/DRM token sign ops/sec',
        bottleneck: 'CPU',
        bottleneckExplanation: 'Origin only serves metadata and manifest manifests; video bytes NEVER hit this server.',
        instancesRequired: 15,
        costEstimate: '~$1,800 / month',
      },
      {
        spec: 'CDN Edge Appliance (Open Connect Box)',
        ramGB: 256,
        cores: 32,
        memoryBound: '100 Gbps network card saturated at 100% capacity',
        cpuBound: 'Kernel zero-copy `sendfile()` uses minimal CPU',
        bottleneck: 'Network/OS Cap',
        bottleneckExplanation: 'Bandwidth egress and network interface card (NIC) throughput are the hard ceiling.',
        instancesRequired: 500,
        costEstimate: 'Edge ISP Co-location',
        isRecommended: true,
      },
    ],
    primaryBottleneck: 'Network/OS Cap',
    bottleneckSummary: 'Video streaming is overwhelmingly Network Egress Bandwidth-bound (Tbps scale); central datacenters cannot withstand the egress cost.',
    bottleneckWhy: 'At 50 Terabits per second, cloud bandwidth egress costs would be millions of dollars every single month. By placing custom CDN storage boxes (like Netflix Open Connect) directly inside internet service providers (ISPs) like Comcast and Airtel, 95% of video chunks travel only a few miles over local fiber rather than crossing long-distance transit backbones.',
    simulatorPreset: {
      defaultDau: 10000000,
      dauUnit: 'Concurrent Viewers',
      defaultActionsPerUser: 1,
      actionLabel: 'Active Stream',
      defaultPayloadBytes: 5000000, // 5 Mbps
      payloadLabel: 'Bitrate (bps)',
      defaultPeakMultiplier: 1.5,
      defaultCpuTimeMs: 1.0,
      defaultThreadStackMB: 2.0,
      isConnectionWorkload: false,
    },
    interviewQAs: [
      {
        question: 'How does Adaptive Bitrate Streaming (HLS) work in practice?',
        interviewerIntent: 'Testing deep knowledge of modern video transport protocols.',
        recommendedAnswer: 'The video is transcoded into multiple bitrates (e.g. 360p at 500kbps up to 4K at 15Mbps) and cut into uniform 4-second `.ts` chunks. A master playlist file (`.m3u8`) indexes these streams. The video player client on the user device continuously measures available download bandwidth. If Wi-Fi drops, the player seamlessly requests the next 4-second chunk from the 480p stream instead of 1080p, preventing any video buffering.',
      },
      {
        question: 'Why does Netflix install physical servers inside local ISPs rather than using standard AWS CloudFront?',
        interviewerIntent: 'Testing hardware economics and edge distribution architecture.',
        recommendedAnswer: 'Standard cloud CDN egress at 50 Tbps would cost hundreds of millions annually. Through the Open Connect program, Netflix gives free appliance servers loaded with SSDs directly to ISPs. Netflix populates them with popular shows during off-peak night hours. When users press play, traffic stays within the local ISP network, costing $0 in cloud egress and delivering zero buffering.',
      },
    ],
    tradeoffs: [
      {
        decision: 'Video Delivery Architecture',
        chosen: 'Edge CDN embedded inside ISPs',
        alternative: 'Centralized AWS S3 Direct Streaming',
        rationale: 'Centralized egress at 50 Tbps is physically bandwidth-prohibitive and financially catastrophic. Edge caching reduces origin load by 98%.',
      },
      {
        decision: 'Video Chunk Duration',
        chosen: '4-second chunks',
        alternative: '30-second chunks',
        rationale: 'Shorter 4-second chunks allow the client player to adapt quickly to sudden network drops and reduces initial playback start delay.',
      },
    ],
    takeaway: 'Video platforms are bounded by Network Egress Bandwidth (Tbps). The master architecture strategy is offloading 95%+ of traffic to embedded ISP edge CDNs using 4-second adaptive bitrate chunks.',
  },
];
