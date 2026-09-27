package com.systemdesignprep.infrastructure.web;

import com.systemdesignprep.application.service.CampaignService;
import com.systemdesignprep.infrastructure.web.dto.ChallengeResponse;
import com.systemdesignprep.infrastructure.web.dto.SubmitAnswerRequest;
import com.systemdesignprep.infrastructure.web.dto.SubmitAnswerResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for the Interview Loop Odyssey Campaign.
 *
 * Endpoints:
 *   GET  /api/campaign/region/{regionId}/challenge  — fetch a challenge for a region (1–5)
 *   POST /api/campaign/region/submit                — submit the player's answer
 */
@RestController
@RequestMapping("/api/campaign")
public class InterviewCampaignController {

    private final CampaignService campaignService;

    public InterviewCampaignController(CampaignService campaignService) {
        this.campaignService = campaignService;
    }

    /**
     * Returns a challenge payload for the given region.
     * Options are already shuffled; answer metadata is never exposed to the client.
     */
    @GetMapping("/region/{regionId}/challenge")
    public ResponseEntity<ChallengeResponse> getChallenge(@PathVariable("regionId") int regionId) {
        if (regionId < 1 || regionId > 5) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(campaignService.getChallenge(regionId));
    }

    /**
     * Validates the player's choice, adjusts their campaign state, and signals whether
     * the next region is unlocked or a "Production Outage / Game Over" state is triggered.
     */
    @PostMapping("/region/submit")
    public ResponseEntity<SubmitAnswerResponse> submitAnswer(
            @Valid @RequestBody SubmitAnswerRequest request) {
        SubmitAnswerResponse response = campaignService.submitAnswer(
                request.challengeId(), request.regionId(), request.choiceIndex());
        return ResponseEntity.ok(response);
    }
}
