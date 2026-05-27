package com.hype_wizard.review_analyze.model;

import com.opencsv.bean.CsvBindByName;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    // This tells Java: "Look for a column header named 'review' in the CSV"
    @CsvBindByName(column = "review")
    private String text;
}