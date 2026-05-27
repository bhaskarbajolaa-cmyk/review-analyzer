package com.hype_wizard.review_analyze.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileAnalysisResponse {
    private FileAnalysisResult summary;
}
