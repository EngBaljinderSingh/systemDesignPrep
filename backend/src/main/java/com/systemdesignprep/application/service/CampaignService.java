package com.systemdesignprep.application.service;

import com.systemdesignprep.infrastructure.ai.OllamaCampaignService;
import com.systemdesignprep.infrastructure.ai.OllamaCampaignService.AnswerOption;
import com.systemdesignprep.infrastructure.ai.OllamaCampaignService.ChallengeData;
import com.systemdesignprep.infrastructure.web.dto.ChallengeResponse;
import com.systemdesignprep.infrastructure.web.dto.SubmitAnswerResponse;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.*;

/**
 * Orchestrates campaign challenge generation and answer validation.
 *
 * Challenge lifecycle:
 *  1. {@link #getChallenge} — tries AI generation, falls back to static bank, shuffles options,
 *     stores answer metadata in memory keyed by a UUID (challengeId).
 *  2. {@link #submitAnswer} — looks up the challengeId, validates choice, returns result.
 *
 * State is intentionally in-process (ConcurrentHashMap + TTL) to avoid schema migrations.
 * Entries expire after 15 minutes.
 */
@Service
public class CampaignService {

    // ── Region metadata ─────────────────────────────────────────────────────
    public record RegionMeta(int id, String name, String bossName, String focusArea) {}

    private static final List<RegionMeta> REGIONS = List.of(
            new RegionMeta(1, "The Pre-Screen Gateway",        "Kael the Recruiter Golem",
                    "relocation readiness, compensation negotiation, remote/hybrid policy for Canada/UK/Japan, and expectations calibration for a 10-year Lead Engineer"),
            new RegionMeta(2, "The Concurrency Labyrinth",     "Baron Von Deadlock",
                    "Java 17 concurrency: CompletableFuture composition, Project Loom virtual threads, ReentrantReadWriteLock read-dominant paths, happens-before guarantees, and live-lock prevention strategies"),
            new RegionMeta(3, "The Citadel of Distributed Scale", "The Partition Daemon",
                    "distributed systems: Kafka consumer groups and offset management, Saga choreography pattern, Redis write-through caching, CAP theorem trade-offs, and zero-downtime database migrations"),
            new RegionMeta(4, "The Agentic AI Rift",           "The Hallucination Hydra",
                    "modern LLM integration: MCP Server protocol, RAG pipelines with vector stores, prompt injection hardening, LangChain4j tool-calling, and AI inference cost governance"),
            new RegionMeta(5, "The Council of Captains",       "The Five Warlords",
                    "behavioral leadership: STAR-format incident storytelling, AWS us-east-1 cascade outage triage, cross-functional conflict resolution, and long-term technical vision alignment with non-technical stakeholders")
    );

    // ── In-memory challenge store (challengeId → pending answer options) ────
    private record StoredChallenge(List<AnswerOption> options, long expiresAt) {}
    private final Map<String, StoredChallenge> challengeStore = new ConcurrentHashMap<>();
    private final ScheduledExecutorService cleaner;

    private final OllamaCampaignService ollamaCampaignService;

    public CampaignService(OllamaCampaignService ollamaCampaignService) {
        this.ollamaCampaignService = ollamaCampaignService;
        this.cleaner = Executors.newSingleThreadScheduledExecutor(r -> {
            Thread t = new Thread(r, "campaign-ttl-cleaner");
            t.setDaemon(true);
            return t;
        });
        cleaner.scheduleAtFixedRate(this::evictExpired, 5, 5, TimeUnit.MINUTES);
    }

    // ── Public API ───────────────────────────────────────────────────────────

    public ChallengeResponse getChallenge(int regionId) {
        RegionMeta region = findRegion(regionId);

        // Try AI, fall back to curated static bank
        ChallengeData data = ollamaCampaignService.generateChallenge(regionId, region.name(), region.focusArea());
        if (data == null) {
            data = staticBank(regionId);
        }

        // Shuffle to prevent positional bias
        List<AnswerOption> shuffled = new ArrayList<>(data.options());
        Collections.shuffle(shuffled);

        // Store for validation (15-minute TTL)
        String challengeId = UUID.randomUUID().toString();
        long expires = System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(15);
        challengeStore.put(challengeId, new StoredChallenge(shuffled, expires));

        // Build DTO — options expose index + text only (no type/score)
        List<ChallengeResponse.OptionDto> optionDtos = new ArrayList<>();
        for (int i = 0; i < shuffled.size(); i++) {
            optionDtos.add(new ChallengeResponse.OptionDto(i, shuffled.get(i).text()));
        }

        return new ChallengeResponse(challengeId, regionId, region.name(), region.bossName(),
                data.scenario(), optionDtos);
    }

    public SubmitAnswerResponse submitAnswer(String challengeId, int regionId, int choiceIndex) {
        StoredChallenge stored = challengeStore.remove(challengeId);
        if (stored == null || System.currentTimeMillis() > stored.expiresAt()) {
            throw new IllegalArgumentException(
                    "Challenge expired or not found. Please fetch a new challenge to continue.");
        }
        if (choiceIndex < 0 || choiceIndex >= stored.options().size()) {
            throw new IllegalArgumentException("Invalid choice index: " + choiceIndex);
        }

        AnswerOption chosen = stored.options().get(choiceIndex);
        boolean gameOver = "OUTAGE".equals(chosen.type());
        boolean unlocked = "LEAD".equals(chosen.type()) && regionId < 5;

        String feedback = switch (chosen.type()) {
            case "LEAD" ->
                    "Outstanding. You demonstrated the instincts of a senior engineering leader. " +
                    (regionId < 5 ? "The next region is now unlocked — press forward." :
                            "You have cleared the final interview loop. The offer is yours.");
            case "AVERAGE" ->
                    "Adequate, but not signal-generating. A solid mid-level response — you'll survive the interview " +
                    "but you won't stand out. Your confidence takes a hit. Try this region again to sharpen your instinct.";
            case "OUTAGE" ->
                    "PRODUCTION OUTAGE TRIGGERED. Your choice cascaded into a critical incident. " +
                    "PagerDuty has fired. The SRE team is bridging. The post-mortem will be painful. Game over.";
            default -> "Response recorded.";
        };

        return new SubmitAnswerResponse(chosen.type(), chosen.scoreImpact(), feedback, unlocked, gameOver);
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

    private RegionMeta findRegion(int regionId) {
        return REGIONS.stream()
                .filter(r -> r.id() == regionId)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown region: " + regionId));
    }

    private void evictExpired() {
        long now = System.currentTimeMillis();
        challengeStore.entrySet().removeIf(e -> now > e.getValue().expiresAt());
    }

    // ── Curated static challenge bank (one per region) ───────────────────────
    private ChallengeData staticBank(int regionId) {
        return switch (regionId) {
            case 1 -> new ChallengeData(
                    "A Tokyo-based fintech is offering you a Staff Engineer role at ¥22M/yr. They require 4 days/week " +
                    "on-site in Shibuya; the relocation package covers housing for 3 months only. You have competing " +
                    "offers from London and Vancouver with fully remote options. How do you respond to the Tokyo offer?",
                    List.of(
                            new AnswerOption(
                                    "Respond in writing: accept contingent on extending housing to 6 months, confirming hybrid " +
                                    "policy post-90 days in the offer letter, and adding one annual return flight — then request " +
                                    "a 72-hour window to compare the equity vesting schedules across all three offers.",
                                    15, "LEAD"),
                            new AnswerOption(
                                    "Say yes immediately — it's a great company, Tokyo sounds exciting, and the salary is strong.",
                                    -10, "AVERAGE"),
                            new AnswerOption(
                                    "Demand fully remote with zero on-site requirement, threatening to withdraw if they insist " +
                                    "on in-person attendance at all.",
                                    -100, "OUTAGE")
                    )
            );
            case 2 -> new ChallengeData(
                    "Your microservice consumes 50 K events/sec from a Kafka topic. A code review before a 2-hour deploy " +
                    "window reveals a junior developer used synchronized(this) inside a CompletableFuture.thenApplyAsync() " +
                    "chain processing sensor data. Load testing shows throughput drops 40% at peak under this lock " +
                    "contention. Staging passed because it ran with 8 threads, not 200.",
                    List.of(
                            new AnswerOption(
                                    "Block the deploy immediately. Refactor the critical path to use a ConcurrentHashMap with " +
                                    "compute() for atomic updates, add a micro-benchmark proving throughput > 48 K/sec under " +
                                    "200 virtual threads, then re-schedule the deploy with the PR linked to the perf results.",
                                    15, "LEAD"),
                            new AnswerOption(
                                    "Add a code comment flagging the issue, wrap it in a feature flag limiting concurrency " +
                                    "to 50 threads in prod, and plan the proper fix for next sprint.",
                                    -10, "AVERAGE"),
                            new AnswerOption(
                                    "Deploy as-is — synchronized has never caused issues in staging. Monitor Datadog post-deploy " +
                                    "and roll back if latency spikes.",
                                    -100, "OUTAGE")
                    )
            );
            case 3 -> new ChallengeData(
                    "Your order service uses a Saga choreography pattern across 4 downstream microservices. During a 20-minute " +
                    "payment processor outage, 1 200 orders stuck in PENDING never received their compensating events. Root " +
                    "cause: the dead-letter topic (order-compensation-dlt) had an incorrect consumer group ID deployed 3 days " +
                    "ago and no one noticed until the outage surfaced it. Finance is asking for a reconciliation report in " +
                    "4 hours.",
                    List.of(
                            new AnswerOption(
                                    "Implement a backpressure-aware replay job: read from the DLT, idempotently re-publish " +
                                    "with original correlation IDs, set a Redis distributed lock per order ID to prevent " +
                                    "duplicate compensation, validate against the audit log before marking orders resolved, " +
                                    "and have a reconciliation diff report ready for Finance before the 4-hour SLA.",
                                    15, "LEAD"),
                            new AnswerOption(
                                    "Manually update all 1 200 orders to CANCELLED in the database and send a bulk email " +
                                    "asking customers to re-submit — it's the simplest way to clear the backlog.",
                                    -10, "AVERAGE"),
                            new AnswerOption(
                                    "Delete all PENDING records to reset the system state — you can restore from backup if " +
                                    "customers complain.",
                                    -100, "OUTAGE")
                    )
            );
            case 4 -> new ChallengeData(
                    "You are architecting a multi-tenant AI code review assistant. User code snippets are chunked into " +
                    "a vector store and retrieved via RAG to form LLM context. A red-team audit flags that a malicious " +
                    "user can inject a payload inside their code snippet that causes the LLM to echo internal system " +
                    "prompts containing other tenants' proprietary API schemas, effectively exfiltrating cross-tenant data. " +
                    "The feature is 2 weeks from GA launch.",
                    List.of(
                            new AnswerOption(
                                    "Delay GA. Implement per-tenant namespace isolation in the vector store, add an input " +
                                    "sanitization layer that strips prompt-injection patterns before embedding, run the LLM " +
                                    "in a sandboxed context with no tool access to secrets, and add an output filter scanning " +
                                    "responses for system-prompt echo patterns — then re-run the red team.",
                                    15, "LEAD"),
                            new AnswerOption(
                                    "Add a UI disclaimer that users must not submit malicious code, and rely on the LLM " +
                                    "provider's built-in safety filters to catch injection attempts.",
                                    -10, "AVERAGE"),
                            new AnswerOption(
                                    "Embed all tenant API schemas directly in the system prompt for convenience — only " +
                                    "authenticated users have access, so cross-tenant exposure is not a real risk.",
                                    -100, "OUTAGE")
                    )
            );
            case 5 -> new ChallengeData(
                    "You are in the final VP Engineering panel. The interviewer says: 'Tell me about a time you had to " +
                    "override a senior technical decision to prevent a production outage. Walk me through the full " +
                    "incident timeline, your decision process, the outcome, and what you changed organizationally " +
                    "afterwards.' You have 4 minutes.",
                    List.of(
                            new AnswerOption(
                                    "Use STAR with precision: Situation — multi-region RDS failover attempted during peak " +
                                    "traffic. Task — CTO wanted a live hotfix; I disagreed given replication lag. Action — " +
                                    "proposed a blue/green swap with a documented rollback SLA, got buy-in in 8 minutes. " +
                                    "Result — zero data loss, 99.97% uptime. Post-incident: the runbook became company-wide " +
                                    "standard. Close with the organisational learning.",
                                    15, "LEAD"),
                            new AnswerOption(
                                    "Tell a story about a minor deployment rollback, frame it loosely as overriding a decision, " +
                                    "and keep technical details vague to avoid appearing to criticise leadership.",
                                    -10, "AVERAGE"),
                            new AnswerOption(
                                    "Say you have never disagreed with a senior leader because you always defer to those " +
                                    "with more experience — you are a strong team player.",
                                    -100, "OUTAGE")
                    )
            );
            default -> throw new IllegalArgumentException("No static challenge for region: " + regionId);
        };
    }
}
