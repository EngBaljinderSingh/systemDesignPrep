package com.systemdesignprep.infrastructure.web.dto;

import java.util.List;

/**
 * Sent to the client when they request a campaign challenge.
 * Options are already shuffled server-side; answer metadata is NOT exposed.
 */
public record ChallengeResponse(
        String challengeId,
        int regionId,
        String regionName,
        String bossName,
        String scenario,
        List<OptionDto> options
) {
    public record OptionDto(int index, String text) {}
}
