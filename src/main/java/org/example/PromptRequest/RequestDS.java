package org.example.PromptRequest;

import org.example.Services.SeekService;
import org.example.usuario.Mensagem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.List;

public class RequestDS {
    private String model;
    private List<Mensagem> messages;

    public RequestDS() {
    }

    public RequestDS(String model, List<Mensagem> messages) {
        this.model = model;
        this.messages = messages;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public List<Mensagem> getMessages() {
        return messages;
    }

    public void setMessages(List<Mensagem> messages) {
        this.messages = messages;
    }



}
