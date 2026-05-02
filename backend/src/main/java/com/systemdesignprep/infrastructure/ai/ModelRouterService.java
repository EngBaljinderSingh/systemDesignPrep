package com.systemdesignprep.infrastructure.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ModelRouterService {

    /**
     * Model identifier returned when the prompt is short/cheap.
     * Set ai.model.cheap=siliconflow to route cheap prompts to SiliconFlow.
     * The adapter checks modelName.contains("silicon") to select the SiliconFlow client.
     */
    @Value("${ai.model.cheap:openrouter}")
    private String cheapModel;

    @Value("${ai.model.pro:openrouter}")
    private String proModel;

    /**
     * Route to cheap or pro model based on prompt complexity.
     */
    public String routeModel(String prompt, int tokenCount) {
        if (tokenCount < 100 && prompt.length() < 200) {
            return cheapModel;
        }
        return proModel;
    }
}
