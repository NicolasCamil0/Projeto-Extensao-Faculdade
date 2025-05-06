document.addEventListener("DOMContentLoaded", function() {

    const input = document.getElementById("chatInput");
    const chatBox = document.getElementById("chatBox");
    const chatContainer = document.getElementById("chatContainer");
    const mainContent = document.getElementById("mainContent");
    

    const apiBase = window.location.hostname.includes("localhost")
        ? "http://localhost:8080"
        : "https://projeto-extensao-faculdade.onrender.com";


    function enviarMensagem() {
        const texto = input.value.trim();
        if (texto === "") return;


        if (chatBox.classList.contains("hidden")) {
            chatBox.classList.remove("hidden");
            chatBox.style.display = "block";
            chatContainer.style.paddingBottom = "40px";
        }


        adicionarMensagem(`Você: ${texto}`, "user");


        const carregandoMsg = adicionarMensagem("Bot: Digitando...", "bot typing");


        fetch(`${apiBase}/excel/pergunta?texto=${encodeURIComponent(texto)}`)
            .then(response => response.text())
            .then(resposta => {
                chatBox.removeChild(carregandoMsg);
                adicionarMensagem(`Bot: ${resposta}`, "bot");
            })
            .catch(error => {
                console.error("Erro na requisição:", error);
                chatBox.removeChild(carregandoMsg);
                adicionarMensagem("Bot: Erro ao conectar com o servidor. Tente novamente mais tarde.", "bot error");
            });

        input.value = "";
        ajustarLayout();
    }


    function adicionarMensagem(texto, tipo) {
        const divMsg = document.createElement("div");
        divMsg.classList.add("message", tipo.split(" ")[0]);
        divMsg.innerHTML = converterMarkdownParaHTML(texto);
        chatBox.appendChild(divMsg);
        
        
        if (chatBox.querySelectorAll('.message').length === 1) {
            chatBox.style.height = "500px"; // 
        }
        
        
        chatBox.scrollTop = chatBox.scrollHeight;
        
        return divMsg;
    }


    function ajustarLayout() {
        setTimeout(() => {
            const chatBoxHeight = chatBox.scrollHeight;
            const alturaMaxima = window.innerHeight * 0.7;
            chatBox.style.height = `${Math.min(chatBoxHeight, alturaMaxima)}px`;
            mainContent.style.marginTop = `${chatBox.offsetHeight + 30}px`;
            chatContainer.style.paddingBottom = "40px";
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 10);
        
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

    input.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            enviarMensagem();
        }
    });

 
    document.querySelectorAll('.sugestao').forEach(sugestao => {
        sugestao.addEventListener('click', function() {
            input.value = this.textContent.replace(/"/g, '');
            input.focus();
        });
    });


    const placeholderTexts = [
        "Deixe sua dúvida aqui!",
        "Como criar gráficos?",
        "Fórmulas avançadas",
        "Automatizar planilhas"
    ];
    let currentIndex = 0;
    
    function rotatePlaceholder() {
        input.placeholder = placeholderTexts[currentIndex];
        currentIndex = (currentIndex + 1) % placeholderTexts.length;
    }
    
    let placeholderInterval = setInterval(rotatePlaceholder, 3000);
    
    input.addEventListener('focus', function() {
        clearInterval(placeholderInterval);
        this.placeholder = "Digite sua dúvida...";
    });
    
    input.addEventListener('blur', function() {
        if (this.value === '') {
            placeholderInterval = setInterval(rotatePlaceholder, 3000);
            rotatePlaceholder();
        }
    });


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