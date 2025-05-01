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
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    }
''
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            button.click(); 
        }
    });
});


document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.querySelector('.procuraVideos');
    const playlist = document.querySelector('.playlistvideo');
    let allVideos = [];


    fetch('videos.json')
        .then(response => response.json())
        .then(videos => {
            allVideos = videos;
            showInitialVideos();
        })
        .catch(error => {
            console.error("Erro ao carregar vídeos:", error);
            playlist.innerHTML = '<p class="error">Erro ao carregar a base de vídeos</p>';
        });


    function showInitialVideos() {
        playlist.innerHTML = '';
        const initialVideos = allVideos.slice(0, 4);
        
        initialVideos.forEach(video => {
            const videoContainer = document.createElement('div');
            videoContainer.className = 'video-container';
            videoContainer.innerHTML = `
                <iframe 
                    src="https://www.youtube.com/embed/${video.id}" 
                    title="${video.title}"
                    frameborder="0"
                    allowfullscreen
                    loading="lazy">
                </iframe>
            `;
            playlist.appendChild(videoContainer);
        });
    }

 
    function searchVideos(searchTerm) {
        playlist.innerHTML = '';
        
        if (!searchTerm.trim()) {
            showInitialVideos(); 
            return;
        }

        const filteredVideos = allVideos.filter(video => 
            video.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filteredVideos.length === 0) {
            playlist.innerHTML = '<p class="no-results">Nenhum vídeo encontrado</p>';
            return;
        }


        filteredVideos.forEach((video, index) => {
            const videoContainer = document.createElement('div');
            videoContainer.className = 'video-container';
            
          
            const shouldLazyLoad = index > 3;
            
            videoContainer.innerHTML = `
                <iframe 
                    src="${shouldLazyLoad ? '' : `https://www.youtube.com/embed/${video.id}`}"
                    data-src="https://www.youtube.com/embed/${video.id}"
                    title="${video.title}"
                    frameborder="0"
                    allowfullscreen
                    loading="${shouldLazyLoad ? 'lazy' : 'eager'}">
                </iframe>
            `;
            playlist.appendChild(videoContainer);
        });

     
        setupLazyLoading();
    }

   
    function setupLazyLoading() {
        const lazyIframes = document.querySelectorAll('iframe[data-src]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const iframe = entry.target;
                    iframe.src = iframe.dataset.src;
                    iframe.removeAttribute('data-src');
                    observer.unobserve(iframe);
                }
            });
        }, { threshold: 0.1 });

        lazyIframes.forEach(iframe => observer.observe(iframe));
    }


    let searchTimeout;
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchVideos(e.target.value);
        }, 300);
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchVideos(e.target.value);
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    
    const suggestions = document.querySelectorAll('.suggestion');
    const chatInput = document.getElementById('chatInput');
    
    
    suggestions.forEach(suggestion => {
        suggestion.addEventListener('click', function() {
            chatInput.value = this.textContent;
            chatInput.focus();
        });
    });
    

    chatInput.addEventListener('focus', function() {
        document.querySelector('.chat-suggestions').style.opacity = '0.5';
    });
    
    chatInput.addEventListener('blur', function() {
        document.querySelector('.chat-suggestions').style.opacity = '1';
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const chatInput = document.getElementById('chatInput');
    const placeholderTexts = [
        "Deixe sua dúvida aqui!",
        "Como criar gráficos?",
        "Fórmulas avançadas",
        "Automatizar planilhas"
    ];
    let currentIndex = 0;
    
    function rotatePlaceholder() {
        chatInput.placeholder = placeholderTexts[currentIndex];
        currentIndex = (currentIndex + 1) % placeholderTexts.length;
    }
    
    let placeholderInterval = setInterval(rotatePlaceholder, 3000);
    

    chatInput.addEventListener('focus', function() {
        clearInterval(placeholderInterval);
        this.placeholder = "Digite sua dúvida...";
    });
    
 
    chatInput.addEventListener('blur', function() {
        if (this.value === '') {
            placeholderInterval = setInterval(rotatePlaceholder, 3000);
            rotatePlaceholder(); 
        }
    });
});