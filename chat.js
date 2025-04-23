document.addEventListener("DOMContentLoaded", function () {
 
  const input = document.querySelector(".inputArea input");
  const btn = document.querySelector(".inputArea button");
  const mensagensContainer = document.querySelector(".mensagens");


  btn.addEventListener("click", enviarMensagem);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") enviarMensagem();
  });


  function adicionarMensagem(texto, isUser) {
    const msgDiv = document.createElement("div");
    msgDiv.className = isUser ? "message userMessage" : "message botMessage";
    
    // Converter Markdown para HTML (se for mensagem do bot)
    msgDiv.innerHTML = isUser ? texto : marked.parse(texto);
    
    mensagensContainer.appendChild(msgDiv);
    mensagensContainer.scrollTop = mensagensContainer.scrollHeight;
  }

 
  function enviarMensagem() {
    const texto = input.value.trim();
    if (!texto) return;

    adicionarMensagem(texto, true); 

    
    input.value = "";

    setTimeout(() => {
      adicionarMensagem(`Estou pesquisando sobre: "${texto}"...`, false);
    }, 500);

    
    
    fetch(`http://localhost:8080/excel/pergunta?texto=${encodeURIComponent(texto)}`)
      .then(res => res.text())
      .then(resposta => {
        adicionarMensagem(resposta, false);
      })
      .catch(() => {
        adicionarMensagem("Erro ao buscar resposta. Tente novamente.", false);
      });
    
  }

  
  window.enviarMensagem = function (texto) {
    input.value = texto;
    enviarMensagem();
  };
});