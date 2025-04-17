package org.example.Services;

import org.example.usuario.Mensagem;

import java.util.List;

public class PromptResponse {
    private List<Choice> choices;

    public List<Choice> getChoices() {
        return choices;
    }

    public void setChoices(List<Choice> choices) {
        this.choices = choices;
    }

    public static class Choice {
        private Mensagem message;

        public Mensagem getMessage() {
            return message;
        }

        public void setMessage(Mensagem message) {
            this.message = message;
        }
    }
}
