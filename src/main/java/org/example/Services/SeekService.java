package org.example.Services;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.Controller.ExcelFiltro;
import org.example.PromptRequest.RequestDS;
import org.example.usuario.Mensagem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class SeekService {
    @Value("${DeepApiKey}") // Certifique-se que está no application.properties
    private String api_key;

    private final RestTemplate restTemplate;
    @Autowired
    private ExcelFiltro filtro;

    public SeekService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String chamadaApiSeek(String perguntaExcel) {
        Mensagem msg = new Mensagem("user", perguntaExcel);
        RequestDS request = new RequestDS("deepseek-chat", List.of(msg));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(api_key);

        try {
            System.out.println(new ObjectMapper().writeValueAsString(request));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        HttpEntity<RequestDS> entity = new HttpEntity<>(request, headers);

        ResponseEntity<PromptResponse> response = restTemplate.postForEntity(
                "https://api.deepseek.com/chat/completions",
                entity,
                PromptResponse.class


        );

        System.out.println(response.getBody());

        String RespostaAPI = response.getBody().getChoices().get(0).getMessage().getConteudo();
        return filtro.respostaFiltro(RespostaAPI);


    }

    public String getApi_key() {
        return api_key;
    }
}
