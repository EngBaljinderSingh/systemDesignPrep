export interface SystemDesignPattern {
  id: string;
  name: string;
  category: 'Scalability' | 'Reliability' | 'Data' | 'Messaging' | 'Architecture';
  description: string;
  useCases: string[];
  pros: string[];
  cons: string[];
  keyComponents: string[];
  realWorldExamples: string[];
  relatedPatterns: string[];
}

export const systemDesignPatterns: SystemDesignPattern[] = [
  {
    id: 'caching',
    name: 'Caching',
    category: 'Scalability',
    description:
      'Store frequently accessed data in a fast-access layer (Redis, Memcached) to reduce database load and lower latency. Multiple strategies exist: cache-aside, write-through, write-behind, and read-through.',
    useCases: [
      'Reducing database read load (90%+ read traffic)',
      'Session storage',
      'API response caching',
      'Computed/aggregated results (leaderboards, feeds)',
    ],
    pros: ['Dramatically reduces latency', 'Cuts DB read load', 'Easily horizontally scalable'],
    cons: ['Cache invalidation is hard', 'Stale data risk', 'Extra operational complexity', 'Memory cost'],
    keyComponents: ['Redis / Memcached', 'CDN (for static assets)', 'Cache eviction policies (LRU, LFU, TTL)'],
    realWorldExamples: ['Twitter timeline cache', 'Facebook social graph', 'YouTube thumbnail caching'],
    relatedPatterns: ['cdn', 'read-replicas'],
  },
  {
    id: 'load-balancing',
    name: 'Load Balancing',
    category: 'Scalability',
    description:
      'Distribute incoming traffic across multiple servers to prevent any single server from becoming a bottleneck. Supports horizontal scaling and enables zero-downtime deployments.',
    useCases: [
      'Distributing HTTP/TCP traffic across application servers',
      'Blue-green / canary deployments',
      'Health-checking and automatic failover',
    ],
    pros: [
      'Linear horizontal scalability',
      'Auto failover on server crash',
      'Enables rolling deployments',
    ],
    cons: [
      'Stateful sessions require sticky sessions or external session store',
      'Single point of failure if not redundant',
    ],
    keyComponents: [
      'L4 Load Balancer (AWS NLB, HAProxy)',
      'L7 Load Balancer (Nginx, AWS ALB)',
      'Algorithms: Round Robin, Least Connections, IP Hash',
    ],
    realWorldExamples: ['AWS ALB in front of ECS services', 'Nginx upstream proxying', 'Google Cloud Load Balancing'],
    relatedPatterns: ['caching', 'horizontal-scaling'],
  },
  {
    id: 'database-sharding',
    name: 'Database Sharding',
    category: 'Data',
    description:
      'Split a large database horizontally across multiple machines (shards) using a shard key. Each shard holds a subset of rows. Enables write scalability beyond a single machine.',
    useCases: [
      'Write-heavy workloads exceeding single-node capacity',
      'Data too large to fit on one machine',
      'Geographic data partitioning',
    ],
    pros: ['Horizontal write scalability', 'Smaller indexes per shard (faster queries)', 'Geographic isolation'],
    cons: [
      'Cross-shard queries are expensive',
      'Rebalancing when adding shards is complex',
      'No cross-shard transactions',
      'Hot shard problem with poor key choice',
    ],
    keyComponents: ['Shard key selection', 'Consistent hashing', 'Shard router / proxy (Vitess, Citus)'],
    realWorldExamples: ['Instagram user sharding', 'Discord message sharding', 'MongoDB sharded clusters'],
    relatedPatterns: ['consistent-hashing', 'cqrs'],
  },
  {
    id: 'rate-limiting',
    name: 'Rate Limiting',
    category: 'Reliability',
    description:
      'Control the rate of requests a user or service can make. Protects downstream services from overload and prevents abuse. Common algorithms: token bucket, leaky bucket, fixed window, sliding window.',
    useCases: [
      'Public API abuse prevention',
      'DDoS mitigation',
      'Throttling expensive operations (AI calls, payments)',
      'Fair resource allocation in multi-tenant systems',
    ],
    pros: ['Protects backend services', 'Prevents cost explosions', 'Enables fair usage policies'],
    cons: [
      'Legitimate traffic can be dropped',
      'Distributed rate limiting requires coordination (Redis)',
      'Choosing right limits is tricky',
    ],
    keyComponents: [
      'Token Bucket algorithm',
      'Sliding Window counter (Redis)',
      'API Gateway (Kong, AWS API GW)',
      '429 Too Many Requests response',
    ],
    realWorldExamples: ['GitHub API rate limits', 'Stripe API throttling', 'Twitter API limits'],
    relatedPatterns: ['circuit-breaker', 'load-balancing'],
  },
  {
    id: 'circuit-breaker',
    name: 'Circuit Breaker',
    category: 'Reliability',
    description:
      'Detects failures in downstream services and stops sending requests for a cooldown period (open state). Prevents cascading failures across the system. Three states: Closed, Open, Half-Open.',
    useCases: [
      'Microservice to microservice calls',
      'External API calls (payment, email, AI)',
      'Database connection failures',
    ],
    pros: [
      'Prevents cascading failures',
      'Fast-fail instead of timeout storms',
      'Allows recovery time for failing services',
    ],
    cons: [
      'State management adds complexity',
      'Threshold tuning required',
      'Not suitable for very short operations',
    ],
    keyComponents: ['Hystrix / Resilience4j', 'Failure rate threshold', 'Timeout + retry policy', 'Fallback logic'],
    realWorldExamples: ['Netflix Hystrix', 'AWS SDK retries', 'Istio service mesh circuit breaking'],
    relatedPatterns: ['rate-limiting', 'bulkhead'],
  },
  {
    id: 'event-driven',
    name: 'Event-Driven Architecture',
    category: 'Messaging',
    description:
      'Services communicate by producing and consuming events via a message broker. Producers are decoupled from consumers. Supports fan-out, audit logs, and eventual consistency.',
    useCases: [
      'Decoupling microservices',
      'Fan-out notifications (email, push, SMS on order placed)',
      'Event sourcing and audit trails',
      'Stream processing pipelines',
    ],
    pros: [
      'Loose coupling between services',
      'Easy to add new consumers without changing producers',
      'Natural audit log',
      'Handles traffic spikes via buffering',
    ],
    cons: [
      'Eventual consistency (not immediate)',
      'Event ordering can be tricky',
      'Debugging distributed flows is harder',
      'Dead letter queues need monitoring',
    ],
    keyComponents: ['Kafka / RabbitMQ / AWS SQS+SNS', 'Event schema / Avro / Protobuf', 'Consumer groups', 'DLQ'],
    realWorldExamples: ['Uber trip events via Kafka', 'LinkedIn activity stream', 'AWS Lambda triggers from SQS'],
    relatedPatterns: ['cqrs', 'saga-pattern'],
  },
  {
    id: 'cqrs',
    name: 'CQRS (Command Query Responsibility Segregation)',
    category: 'Architecture',
    description:
      'Separate read (query) and write (command) models. Write model handles business logic and emits events; read model is an optimized projection for queries. Enables independent scaling of reads and writes.',
    useCases: [
      'Read-heavy systems needing different read/write schemas',
      'Event sourcing',
      'Systems requiring multiple read projections (dashboard, mobile, API)',
    ],
    pros: [
      'Read and write models can be independently optimized',
      'Write side stays simple (append-only)',
      'Multiple read projections from same events',
    ],
    cons: [
      'Eventual consistency between write and read models',
      'More moving parts (projectors, event bus)',
      'Complex for simple CRUD apps',
    ],
    keyComponents: ['Command handlers', 'Event store', 'Read projections (materialized views)', 'Event bus'],
    realWorldExamples: ['Axon Framework', 'EventStoreDB', 'Microsoft Azure Event Sourcing sample'],
    relatedPatterns: ['event-driven', 'database-sharding'],
  },
  {
    id: 'saga-pattern',
    name: 'Saga Pattern',
    category: 'Architecture',
    description:
      'Manage long-running distributed transactions as a sequence of local transactions. Each step publishes an event; on failure, compensating transactions roll back previous steps. Two styles: choreography and orchestration.',
    useCases: [
      'Distributed transactions across microservices (order → payment → inventory)',
      'Long-running workflows',
      'Any scenario requiring eventual consistency with rollback',
    ],
    pros: ['No distributed lock required', 'Services remain loosely coupled', 'Resilient to partial failures'],
    cons: [
      'Compensating transactions add complexity',
      'Hard to reason about failure scenarios',
      'Eventually consistent (not ACID)',
    ],
    keyComponents: ['Saga Orchestrator or Choreography events', 'Compensating transactions', 'Idempotency', 'Outbox pattern'],
    realWorldExamples: ['Amazon order workflow', 'Uber trip lifecycle', 'e-commerce checkout flow'],
    relatedPatterns: ['event-driven', 'cqrs'],
  },
  {
    id: 'cdn',
    name: 'CDN (Content Delivery Network)',
    category: 'Scalability',
    description:
      'Distribute static (and sometimes dynamic) content across geographically distributed edge servers. Users are served from the nearest edge node, reducing latency and origin server load.',
    useCases: [
      'Static assets (JS, CSS, images, videos)',
      'Reducing global latency for distributed users',
      'DDoS protection at the edge',
      'API caching at the edge (CloudFront functions)',
    ],
    pros: ['Dramatically lower latency for global users', 'Offloads origin server', 'Built-in DDoS protection'],
    cons: ['Cache invalidation propagation takes time', 'Cost scales with bandwidth', 'Dynamic content is harder to cache'],
    keyComponents: ['Edge PoP (Points of Presence)', 'Origin pull vs push', 'TTL configuration', 'Cache-Control headers'],
    realWorldExamples: ['Cloudflare', 'AWS CloudFront', 'Akamai', 'Fastly'],
    relatedPatterns: ['caching', 'load-balancing'],
  },
  {
    id: 'consistent-hashing',
    name: 'Consistent Hashing',
    category: 'Data',
    description:
      'A hashing scheme where adding or removing nodes only remaps a fraction (1/n) of keys instead of all keys. Used by distributed caches, databases, and message brokers to minimize rebalancing.',
    useCases: [
      'Distributed cache key routing (Redis Cluster)',
      'Database sharding',
      'Load balancing with minimal disruption when servers join/leave',
    ],
    pros: [
      'Minimal key remapping on topology change',
      'Uniform distribution with virtual nodes',
      'No central coordinator needed',
    ],
    cons: [
      'Slightly uneven distribution without virtual nodes',
      'Complex implementation',
      'Hot spots possible',
    ],
    keyComponents: ['Hash ring', 'Virtual nodes (vnodes)', 'Replication factor', 'Consistent hash function (SHA-1, MD5)'],
    realWorldExamples: ['Amazon Dynamo', 'Apache Cassandra', 'Redis Cluster', 'Chord protocol'],
    relatedPatterns: ['database-sharding', 'caching'],
  },
  {
    id: 'read-replicas',
    name: 'Read Replicas',
    category: 'Data',
    description:
      'Add read-only replica databases that are asynchronously replicated from the primary. Route all reads to replicas and all writes to the primary, scaling read throughput horizontally.',
    useCases: [
      'Read-heavy workloads (>80% reads)',
      'Analytics / reporting queries that would slow primary',
      'Geographic distribution of reads',
    ],
    pros: [
      'Read throughput scales with number of replicas',
      'Offloads primary',
      'Simple to set up (managed by cloud providers)',
    ],
    cons: [
      'Replication lag causes stale reads',
      'Writes still bottleneck on primary',
      'Failover complexity',
    ],
    keyComponents: ['Primary/replica replication', 'Replication lag monitoring', 'Read-your-writes consistency workaround'],
    realWorldExamples: ['AWS RDS read replicas', 'PostgreSQL streaming replication', 'MySQL Group Replication'],
    relatedPatterns: ['caching', 'database-sharding'],
  },
];
