package org.example;

import org.example.Services.SeekService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.SpringApplication;


@SpringBootApplication
public class Main {

    @Autowired
    private SeekService seekService;

    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }


}