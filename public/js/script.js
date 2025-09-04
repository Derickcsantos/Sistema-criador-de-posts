document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('image-form');
    const loadingSpinner = document.getElementById('loading-spinner');
    const resultSection = document.getElementById('result');
    const resultPrompt = document.getElementById('result-prompt');
    const resultSize = document.getElementById('result-size');
    const resultImage = document.getElementById('result-image');
    const downloadBtn = document.getElementById('download-btn');
    const newImageBtn = document.getElementById('new-image-btn');
    
    // Manipular envio do formulário
    form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const prompt = document.getElementById('prompt').value;
    const size = document.getElementById('size').value;
    const sizeText = document.getElementById('size').options[document.getElementById('size').selectedIndex].text;
    
    // Mostrar spinner de carregamento
    loadingSpinner.style.display = 'inline-block';
    
    try {
        // Enviar requisição para o backend
        const response = await fetch('/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, size })
        });
        
        if (!response.ok) {
        throw new Error('Erro ao gerar imagem');
        }
        
        const data = await response.json();
        
        // Preencher a seção de resultados
        resultPrompt.textContent = prompt;
        resultSize.textContent = sizeText;
        resultImage.src = data.imageUrl;
        
        // Configurar o botão de download
        downloadBtn.href = data.imageUrl;
        downloadBtn.download = 'imagem-gerada-postaí.jpg';
        
        // Mostrar a seção de resultados
        resultSection.style.display = 'block';
        
        // Rolar suavemente até os resultados
        resultSection.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao gerar a imagem. Por favor, tente novamente.');
    } finally {
        // Esconder spinner de carregamento
        loadingSpinner.style.display = 'none';
    }
    });
    
    // Botão para criar nova imagem
    newImageBtn.addEventListener('click', function() {
    resultSection.style.display = 'none';
    document.getElementById('prompt').value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});