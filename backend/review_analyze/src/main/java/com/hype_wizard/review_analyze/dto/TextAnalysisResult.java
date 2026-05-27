package com.hype_wizard.review_analyze.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TextAnalysisResult {
    private List<String> entities;
    private Sentiment sentiment;
    private List<String> pros;
    private List<String> cons;
    private double readability_score;
    private String style;
    private String summary;
}