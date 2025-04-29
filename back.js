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

        console.log(`Fazendo requisição para: ${apiBase}/excel/pergunta?texto=${encodeURIComponent(texto)}`);

        const carregandoMensagem = adicionarMensagem("Carregando...", "botMessage");

        fetch(`${apiBase}/excel/pergunta?texto=${encodeURIComponent(texto)}`)
            .then(response => response.text())
            .then(resposta => {
                carregandoMensagem.innerHTML = converterMarkdownParaHTML(resposta);
            })
            .catch(error => {
                console.error("Erro na requisição:", error);
                carregandoMensagem.innerHTML = "Erro ao buscar resposta do servidor.";
            });

        input.value = ""; 
    });

    function adicionarMensagem(mensagem, classe) {
        const divMensagem = document.createElement("div");
        divMensagem.classList.add("message", classe);
        divMensagem.innerHTML = converterMarkdownParaHTML(mensagem); 
        chatContainer.appendChild(divMensagem);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        return divMensagem; 
    }

    function converterMarkdownParaHTML(texto) {
        return texto
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  
            .replace(/\*(.*?)\*/g, '<em>$1</em>')              
            .replace(/\n/g, '<br>');                           
    }

    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            button.click(); 
        }
    });
});
