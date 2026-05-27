package com.hype_wizard.review_analyze.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileAnalysisResult {
    private Sentiment sentiment;
    private String pros;
    private String cons;
    private String summary;
}