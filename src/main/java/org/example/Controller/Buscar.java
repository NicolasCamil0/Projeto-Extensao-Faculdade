package org.example.Controller;

import org.example.Services.SeekService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/excel")
public class Buscar {

    @Autowired
    private SeekService seekService;

    @GetMapping("/pergunta")
    public ResponseEntity<String> perguntar (@RequestParam(name = "texto") String texto){
        return ResponseEntity.ok(seekService.chamadaApiSeek(texto));
    }

    //Testendo gitHub
}
