import { getPopularContent, TMDB_IMAGE_BASE_URL } from './app.js';
import { openMovieModal } from './modal.js';

// Função para criar o carrossel
const createCarousel = async () => {
    try {
        console.log('Iniciando criação do carrossel...');
        
        // Verificar se o Bootstrap está disponível
        if (typeof bootstrap === 'undefined') {
            throw new Error('Bootstrap não está disponível');
        }
        
        // Buscar conteúdo popular
        console.log('Buscando conteúdo popular...');
        const content = await getPopularContent();
        
        if (!content || content.length === 0) {
            throw new Error('Nenhum conteúdo encontrado');
        }
        
        // Elementos do DOM
        const carouselInner = document.getElementById('carousel-inner');
        const carouselIndicators = document.getElementById('carousel-indicators');
        
        if (!carouselInner || !carouselIndicators) {
            throw new Error('Elementos do carrossel não encontrados');
        }
        
        // Limpar carrossel existente
        carouselInner.innerHTML = '';
        carouselIndicators.innerHTML = '';
        
        // Criar slides para os primeiros 5 itens
        const slides = content.slice(0, 5);
        console.log(`Criando ${slides.length} slides...`);
        
        slides.forEach((item, index) => {
            // Criar indicador
            const indicator = document.createElement('button');
            indicator.type = 'button';
            indicator.setAttribute('data-bs-target', '#carouselExampleCaptions');
            indicator.setAttribute('data-bs-slide-to', index.toString());
            if (index === 0) indicator.classList.add('active');
            indicator.setAttribute('aria-label', `Slide ${index + 1}`);
            carouselIndicators.appendChild(indicator);
            
            // Criar slide
            const slide = document.createElement('div');
            slide.className = `carousel-item ${index === 0 ? 'active' : ''}`;
            
            // Verificar se o item tem imagem de fundo
            const backdropPath = item.backdrop_path;
            const imageUrl = backdropPath 
                ? `https://image.tmdb.org/t/p/original${backdropPath}`
                : 'https://via.placeholder.com/1920x1080?text=Imagem+não+disponível';
            
            console.log(`Slide ${index + 1}:`, {
                title: item.title || item.name,
                imageUrl: imageUrl
            });
            
            // Criar elemento de imagem para pré-carregar
            const img = new Image();
            img.src = imageUrl;
            img.onload = () => {
                console.log(`Imagem do slide ${index + 1} carregada com sucesso`);
            };
            img.onerror = () => {
                console.error(`Erro ao carregar imagem do slide ${index + 1}`);
                img.src = 'https://via.placeholder.com/1920x1080?text=Imagem+não+disponível';
            };
            
            slide.innerHTML = `
                <div class="carousel-item-background" style="background-image: url('${imageUrl}')"></div>
                <div class="carousel-caption d-none d-md-block">
                    <h5>${item.title || item.name}</h5>
                    <p>${item.overview || 'Descrição não disponível'}</p>
                    <button class="btn btn-danger watch-button" data-id="${item.id}" data-type="${item.type}">
                        <i class="fas fa-play"></i> Assistir
                    </button>
                </div>
            `;
            
            carouselInner.appendChild(slide);
        });
        
        console.log('Carrossel criado com sucesso');
        
        // Adicionar eventos aos botões de assistir
        document.querySelectorAll('.watch-button').forEach(button => {
            button.addEventListener('click', async () => {
                const id = button.dataset.id;
                const type = button.dataset.type;
                if (id && type) {
                    await openMovieModal(id, type);
                }
            });
        });
        
        // Inicializar carrossel do Bootstrap
        const carouselElement = document.getElementById('carouselExampleCaptions');
        if (carouselElement) {
            const carousel = new bootstrap.Carousel(carouselElement, {
                interval: 5000,
                wrap: true
            });
            console.log('Carrossel Bootstrap inicializado');
            
            // Adicionar event listeners para os botões
            const prevButton = carouselElement.querySelector('.carousel-control-prev');
            const nextButton = carouselElement.querySelector('.carousel-control-next');
            
            if (prevButton && nextButton) {
                prevButton.addEventListener('click', () => {
                    console.log('Botão anterior clicado');
                    carousel.prev();
                });
                
                nextButton.addEventListener('click', () => {
                    console.log('Botão próximo clicado');
                    carousel.next();
                });
            }
        }
    } catch (error) {
        console.error('Erro ao criar carrossel:', error);
    }
};

// Inicializar carrossel quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', createCarousel); 