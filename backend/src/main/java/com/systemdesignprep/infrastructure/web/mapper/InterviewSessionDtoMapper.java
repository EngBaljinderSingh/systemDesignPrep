package com.systemdesignprep.infrastructure.web.mapper;

import com.systemdesignprep.domain.model.ConversationTurn;
import com.systemdesignprep.domain.model.Feedback;
import com.systemdesignprep.domain.model.InterviewSession;
import com.systemdesignprep.infrastructure.web.dto.InterviewSessionResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InterviewSessionDtoMapper {

    @Mapping(target = "conversationHistory", source = "conversationHistory")
    @Mapping(target = "feedbackItems", source = "feedbackItems")
    InterviewSessionResponse toResponse(InterviewSession session);

    InterviewSessionResponse.ConversationTurnDto toTurnDto(ConversationTurn turn);

    InterviewSessionResponse.FeedbackDto toFeedbackDto(Feedback feedback);
}
