package org.example.Controller;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Arrays;

@Component
public class ExcelFiltro {
    private final List<String> keywords = Arrays.asList("excel", "planilha", "tabela dinamica", "macro", "fórmula", "coluna", "linha");

    public boolean eExcel(String texto){
        String lowerText = texto.toLowerCase();
        for (String keyword : keywords){
            if (lowerText.contains(keyword.toLowerCase())){
                return true;
            }
        }
        return false;
    }


    public String respostaFiltro(String Resposta) {
        if (eExcel(Resposta)) {
            return Resposta;
        } else {
            return "A resposta fornecida não está relacionada ao Excel.";
        }
    }
}
