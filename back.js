document.addEventListener("DOMContentLoaded", function () {
    const input = document.querySelector("input[type='text']"); 
    const chatContainer = document.querySelector(".chatContainer .mensagens"); 
    const button = document.querySelector(".inputArea button"); 
    
    
    const apiBase = window.location.hostname.includes("localhost")
        ? "http://localhost:8080"
        : "https://projeto-extensao-faculdade.onrender.com";

    button.addEventListener("click", function () {
        const texto = input.value.trim();
        if (texto === "") return; 

        adicionarMensagem(texto, "userMessage");

        
        fetch(`${apiBase}/excel/pergunta?texto=${encodeURIComponent(texto)}`)
            .then(response => response.text())
            .then(resposta => {
                adicionarMensagem(resposta, "botMessage");
            })
            .catch(error => {
                console.error("Erro:", error);
                adicionarMensagem("Erro ao buscar resposta.", "botMessage");
            });

        input.value = ""; 
    });

    function adicionarMensagem(mensagem, classe) {
        const divMensagem = document.createElement("div");
        divMensagem.classList.add("message", classe);
        divMensagem.innerHTML = converterMarkdownParaHTML(mensagem); 
        chatContainer.appendChild(divMensagem);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function converterMarkdownParaHTML(texto) {
        return texto.replace(/\n/g, '<br>');
    }

    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            button.click(); 
        }
    });
});
