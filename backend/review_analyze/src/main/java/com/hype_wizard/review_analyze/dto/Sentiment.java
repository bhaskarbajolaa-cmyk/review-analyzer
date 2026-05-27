package com.hype_wizard.review_analyze.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sentiment {
    private int positive;
    private int neutral;
    private int negative;
}