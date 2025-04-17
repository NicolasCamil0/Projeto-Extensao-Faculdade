package org.example.usuario;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Mensagem {
    public String role;
    @JsonProperty("content")
    public String conteudo;

    public Mensagem() {
    }

    public Mensagem(String role, String conteudo) {
        this.role = role;
        this.conteudo = conteudo;

    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getConteudo() {
        return conteudo;
    }

    public void setConteudo(String conteudo) {
        this.conteudo = conteudo;
    }
}
