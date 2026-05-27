package com.hype_wizard.review_analyze.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.hype_wizard.review_analyze.dto.FileAnalysisResponse;
import com.hype_wizard.review_analyze.dto.FileAnalysisResult;
import com.hype_wizard.review_analyze.dto.TextAnalysisResponse;
import com.hype_wizard.review_analyze.dto.TextAnalysisResult;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") 
public class AnalysisController {
    @PostMapping("/analyzefile")
    public FileAnalysisResponse handleFileUpload(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("Cannot process an empty file.");
        }

        try {
            return forwardToN8n(file);
        } catch (Exception e) {
            throw new RuntimeException("Failed to process the uploaded file: " + e.getMessage());
        }
    }
    @PostMapping("/analyzetext")
    public TextAnalysisResponse handleTextAnalysis(@RequestParam("text") String text) {
        if (text == null || text.trim().isEmpty()) {
            throw new RuntimeException("Cannot process an empty text.");
        }

        try {
            return forwardToN8n(text);
        } catch (Exception e) {
            throw new RuntimeException("Failed to analyze the provided text: " + e.getMessage());
        }
    }

    private TextAnalysisResponse forwardToN8n(String text) {
        HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);

    Map<String, String> body = new HashMap<>();
    body.put("text", text);

    HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(body, headers);
    RestTemplate restTemplate = new RestTemplate();

    ResponseEntity<TextAnalysisResult> response = restTemplate.postForEntity(
        "http://localhost:5678/webhook/2c74e942-b323-4326-b1e3-5b780f4cabab",
        requestEntity,
        TextAnalysisResult.class
    );

    TextAnalysisResult n8nSummary = response.getBody();
    if (n8nSummary == null) {
        throw new RuntimeException("Received empty response from n8n webhook.");
    }

    return new TextAnalysisResponse(n8nSummary);
    }
 
    private FileAnalysisResponse forwardToN8n(MultipartFile file) {
        // 1. Set headers for Multipart Form Data
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // 2. Attach the file binary to the "data" key
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("data", file.getResource());

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        RestTemplate restTemplate = new RestTemplate();

        // 3. Send to n8n and expect the Summary DTO in return
        ResponseEntity<FileAnalysisResult> response = restTemplate.postForEntity(
                "http://localhost:5678/webhook/2c74e942-b323-4326-b1e3-5b780f4cabaa", 
                requestEntity, 
                FileAnalysisResult.class
        );

        // 4. Wrap the returned Summary into your AnalysisResponse
        FileAnalysisResult n8nSummary = response.getBody();
        
        if (n8nSummary == null) {
            throw new RuntimeException("Received empty response from n8n webhook.");
        }

        return new FileAnalysisResponse(n8nSummary);
    }
}