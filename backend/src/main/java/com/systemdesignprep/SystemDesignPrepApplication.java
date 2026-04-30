package com.systemdesignprep;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;
import com.systemdesignprep.infrastructure.config.AiConfig;

@SpringBootApplication
@Import(AiConfig.class)
public class SystemDesignPrepApplication {

    static {
        System.out.println("SystemDesignPrepApplication loaded. Forcing import of AiConfig...");
    }
    public static void main(String[] args) {
        SpringApplication.run(SystemDesignPrepApplication.class, args);
    }
}
