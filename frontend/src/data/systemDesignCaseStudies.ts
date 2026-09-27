// ── HLD Case Studies extracted from "System Design Demo - HLD, Storage & Instance Calculations.pptx"
// Covers: WhatsApp, Rate Limiter, BookMyShow with real capacity math

export interface HLDComponent {
  name: string;
  description: string;
}

export interface CalcStep {
  label: string;
  formula: string;
  result: string;
}

export interface InstanceOption {
  spec: string;
  memoryBound: string;
  cpuBound: string;
  bottleneck: string;
  instancesRequired: number;
}

export interface HLDCaseStudy {
  id: string;
  title: string;
  icon: string;
  tagline: string;
  functionalReqs: string[];
  nonFunctionalReqs: string[];
  components: HLDComponent[];
  scaleMetrics: { label: string; value: string }[];
  storageCalcs: CalcStep[];
  instanceOptions: InstanceOption[];
  takeaway: string;
}

// ── General Capacity Rules (Slide 2) ──────────────────────────────────────
export const capacityRules = [
  {
    title: 'Safety Cap',
    formula: 'Usable Resource = Total Hardware × 70%',
    description: 'Always apply a 70% safety buffer to any hardware spec (RAM, CPU, connections) to account for OS overhead, GC pauses, and burst headroom.',
  },
  {
    title: 'Max QPS per Instance',
    formula: 'Max QPS = min(Memory-Constrained QPS, CPU-Constrained QPS)',
    description: 'Your server capacity is bound by whichever resource runs out first — RAM (thread stacks, active keys) or CPU (core execution time).',
  },
  {
    title: 'Server Count',
    formula: 'Instances = Math.ceil(Peak QPS / Max QPS per Instance)',
    description: 'Divide total peak workload by the per-instance maximum to get minimum instance count. Always round up.',
  },
  {
    title: 'Connection Cap',
    formula: 'Conns = min(RAM-Calculated, Network/OS Cap)',
    description: 'OS file descriptors, kernel TCP buffers, and NIC bandwidth impose a hard ceiling (~3M TCP conns/server) independent of RAM.',
  },
  {
    title: 'Memory Bottleneck',
    formula: 'RAM QPS = (Total RAM × 0.70) / Memory-per-thread / Avg-Latency-sec',
    description: 'Calculates RAM required based on connection state overhead, per-thread allocation, or active key payloads (e.g., Redis RAM caps).',
  },
  {
    title: 'CPU Bottleneck',
    formula: 'CPU QPS = (Cores × 0.70 × 1000ms) / CPU-time-per-request-ms',
    description: 'Calculates compute bounds based on core counts and CPU execution time per request under peak QPS.',
  },
];

// ── Case Studies ──────────────────────────────────────────────────────────
export const hldCaseStudies: HLDCaseStudy[] = [
  {
    id: 'whatsapp',
    title: 'WhatsApp',
    icon: '💬',
    tagline: 'Real-time messaging at 100M DAU with persistent WebSocket connections',
    functionalReqs: [
      'One-on-One Real-Time Messaging',
      'Message Delivery Status & Receipts',
      'Online Presence & Last Seen',
      'Offline Storage & Sync',
      'Group Chats',
      'Media & File Sharing',
    ],
    nonFunctionalReqs: [
      'Ultra-Low Latency (<100ms message delivery)',
      'High Availability (99.99% uptime)',
      'Massive Scalability (100M+ DAU)',
      'High Reliability & Durability (no message loss)',
      'End-to-End Security (E2EE)',
    ],
    components: [
      {
        name: 'WebSocket Gateway',
        description: 'Maintains persistent duplex TCP connections to active clients for instant real-time message delivery.',
      },
      {
        name: 'Session Manager',
        description: 'Maps User IDs to Gateway server instances using a distributed key-value store (Redis/Memcached).',
      },
      {
        name: 'Message Store',
        description: 'Cassandra / HBase for high-throughput append-only chat history sharded by Conversation_ID.',
      },
      {
        name: 'Push Notification Service',
        description: 'FCM / APNs fallback triggers when recipient is offline.',
      },
    ],
    scaleMetrics: [
      { label: 'Daily Active Users (DAU)', value: '100,000,000' },
      { label: 'Avg Messages / User / Day', value: '50 msgs' },
      { label: 'Total Daily Messages', value: '5 Billion msgs' },
      { label: 'Peak Concurrent Connections', value: '20M (20% of DAU)' },
    ],
    storageCalcs: [
      {
        label: 'Average Message Size',
        formula: 'Header + Payload + Metadata',
        result: '200 bytes / message',
      },
      {
        label: 'Daily Text Storage',
        formula: '5,000,000,000 msgs × 200 bytes',
        result: '1,000 GB/day (1 TB/day)',
      },
      {
        label: '5-Year Retention',
        formula: '1 TB/day × 365 days × 5 years',
        result: '~1.825 Petabytes',
      },
      {
        label: 'Media Storage (10% of msgs)',
        formula: '500M media files/day × 100 KB avg',
        result: '50 TB/day (stored in S3/Blob)',
      },
    ],
    instanceOptions: [
      {
        spec: '4 GB Server',
        memoryBound: 'Usable RAM = 2,936 MB → 293,601 connections',
        cpuBound: 'N/A (connection-based workload)',
        bottleneck: 'RAM',
        instancesRequired: 70,
      },
      {
        spec: '64 GB Server',
        memoryBound: 'RAM allows ~4.7M conns, but OS TCP cap = 3M',
        cpuBound: 'OS Network Cap: 3,000,000 TCP conns/server',
        bottleneck: 'Network/OS TCP Cap',
        instancesRequired: 8,
      },
    ],
    takeaway: 'For connection-heavy architectures, high-RAM servers hit OS file descriptor / kernel TCP buffer limits around 3M connections per server — regardless of available RAM. Scale out horizontally with 64 GB servers capped at ~3M connections each.',
  },

  {
    id: 'rate-limiter',
    title: 'Rate Limiter',
    icon: '🚦',
    tagline: 'Distributed rate limiting at 58K avg QPS / 116K peak QPS using Redis',
    functionalReqs: [
      'Granular Identity-Based Limiting (user/IP/API key)',
      'Configurable Rule Engine (per route, per user tier)',
      'Graceful HTTP Rejection (429 Too Many Requests)',
      'Standardized Telemetry Headers (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset)',
      'Flexible Algorithm Support (Token Bucket / Sliding Window)',
    ],
    nonFunctionalReqs: [
      'Ultra-Low Processing Latency (<1ms overhead)',
      'High Throughput (100K+ QPS)',
      'Fault Tolerance (Fail-Open Policy on Redis outage)',
      'Atomic Consistency (no race conditions on counters)',
      'Low Memory Footprint',
    ],
    components: [
      {
        name: 'API Gateway Integration',
        description: 'Edge proxies (Kong/Envoy) intercept all incoming requests before backend dispatch.',
      },
      {
        name: 'Rate Limiter Middleware',
        description: 'In-memory application tier running Token Bucket / Sliding Window algorithm.',
      },
      {
        name: 'Redis Cluster',
        description: 'Central distributed in-memory counter store using atomic Lua scripts to prevent race conditions.',
      },
      {
        name: 'Local Memory L1 Cache',
        description: 'Short TTL local cache to drop bad traffic locally during extreme traffic surges without hitting Redis.',
      },
    ],
    scaleMetrics: [
      { label: 'Total Daily Requests', value: '5 × 10⁹ (100M DAU × 50 req/user)' },
      { label: 'Average QPS', value: '58,000 QPS' },
      { label: 'Peak Traffic QPS', value: '116,000 QPS (2× avg)' },
      { label: 'Active Rate Limit Keys', value: '100 Million (users/IPs)' },
    ],
    storageCalcs: [
      {
        label: 'Redis Key Size',
        formula: 'User_ID (16 B) + Token_Count + Timestamp (16 B) + Overhead (32 B)',
        result: '64 bytes / key',
      },
      {
        label: 'Total Redis RAM',
        formula: '100M keys × 64 bytes',
        result: '~6.4 GB RAM for all keys',
      },
      {
        label: 'Network Bandwidth per Request',
        formula: 'Payload = 100 bytes (key lookup + counter update)',
        result: '100 bytes/request',
      },
      {
        label: 'Peak Bandwidth',
        formula: '116,000 QPS × 100 bytes',
        result: '11.6 MB/sec (negligible)',
      },
    ],
    instanceOptions: [
      {
        spec: '4 GB Server (4 Cores)',
        memoryBound: '2,800 MB / 2 MB per thread = 1,400 threads → 750 QPS',
        cpuBound: '4 Cores × 0.70 × 1000ms / 1ms = 2,800 QPS',
        bottleneck: 'Memory (750 QPS)',
        instancesRequired: 200,
      },
      {
        spec: '64 GB Server (8 Cores)',
        memoryBound: '56,000 MB / 2 MB per thread = 28,000 threads → 14,000 QPS',
        cpuBound: '8 Cores × 0.70 × 1000ms / 1ms = 5,600 QPS',
        bottleneck: 'CPU (5,600 QPS)',
        instancesRequired: 30,
      },
    ],
    takeaway: 'Small 4 GB instances are severely memory-bound by thread stack allocations (~2 MB each); scaling up to 64 GB shifts the bottleneck from memory to CPU. Prefer fewer large CPU-optimized instances over many small memory-constrained ones.',
  },

  {
    id: 'bookmyshow',
    title: 'BookMyShow',
    icon: '🎬',
    tagline: 'High-consistency seat booking with distributed locks at 50K peak QPS',
    functionalReqs: [
      'Catalog & Show Search (movies, showtimes, venues)',
      'Temporary Seat Locking (10-minute hold)',
      'Booking & Payment Processing (ACID)',
      'Ticket Fulfillment (PDF/QR code generation)',
      'Reservation Expiry Engine (auto-release locked seats)',
    ],
    nonFunctionalReqs: [
      'Strict ACID Consistency (Zero Double-Booking)',
      'Low Latency Read Operations (<50ms for catalog)',
      'High Read-to-Write Ratio Support',
      'Isolation of Booking Engine from catalog reads',
      'Compliance & Security (PCI-DSS for payments)',
    ],
    components: [
      {
        name: 'Catalog & Search',
        description: 'Reads movie showtimes and seat layouts from ElasticSearch / Redis cache (read-heavy, eventual consistency acceptable).',
      },
      {
        name: 'Seat Lock Manager',
        description: 'Redis SETNX distributed lock with a 10-minute TTL to prevent double bookings. State: AVAILABLE → LOCKED → BOOKED.',
      },
      {
        name: 'Booking & Payment Engine',
        description: 'RDBMS (PostgreSQL) enforcing ACID compliance for final seat allocation. Processes only after lock is confirmed.',
      },
      {
        name: 'Expiry Engine',
        description: 'Background TTL scanner releases LOCKED seats back to AVAILABLE if payment is not completed within 10 minutes.',
      },
    ],
    scaleMetrics: [
      { label: 'System Scale', value: '500 cities × 10 cinemas × 5 screens × 200 seats' },
      { label: 'Active Daily Seats', value: '4,000,000 show-seat slots/day' },
      { label: 'Flash Sale Peak', value: '50,000 QPS (blockbuster launches)' },
      { label: 'Daily Completed Bookings', value: '1,000,000 / day' },
    ],
    storageCalcs: [
      {
        label: 'Redis Seat Lock RAM',
        formula: '4,000,000 active seats × 64 bytes (Seat_ID + User_ID + Timestamp + Status)',
        result: '256 MB RAM in Redis cluster',
      },
      {
        label: 'Daily PostgreSQL Storage',
        formula: '1,000,000 bookings/day × 500 bytes/record',
        result: '500 MB/day',
      },
      {
        label: '1-Year DB Storage',
        formula: '500 MB/day × 365 days',
        result: '~182.5 GB/year',
      },
    ],
    instanceOptions: [
      {
        spec: '4 GB Server (4 Cores)',
        memoryBound: '2,800 MB / 1.5 MB per thread = 1,866 threads → 3,733 QPS',
        cpuBound: '4 Cores × 0.70 × 1000ms / 2.5ms = 1,120 QPS',
        bottleneck: 'CPU (1,120 QPS)',
        instancesRequired: 45,
      },
      {
        spec: '64 GB Server (16 Cores)',
        memoryBound: '44,800 MB / 1.5 MB = 29,866 threads → 59,733 QPS',
        cpuBound: '16 Cores × 0.70 × 1000ms / 2.5ms = 4,480 QPS',
        bottleneck: 'CPU (4,480 QPS)',
        instancesRequired: 12,
      },
    ],
    takeaway: 'Seat locking engines are CPU-bound due to distributed lock verification (Redis SETNX + PostgreSQL ACID writes take ~2.5ms each). Scale vertically with higher core counts for flash sales rather than adding many small instances.',
  },
];
