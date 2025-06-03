import { getPopularMovies, TMDB_IMAGE_BASE_URL } from './app.js';
import { openMovieModal } from './modal.js';

// Função para criar o carrossel de filmes populares
export const createCarousel = async () => {
    try {
        console.log('Iniciando criação do carrossel...');
        
        // Verificar se o Bootstrap está disponível
        if (typeof bootstrap === 'undefined') {
            console.error('Bootstrap não está disponível');
            return;
        }

        // Buscar filmes populares
        console.log('Buscando filmes populares...');
        const movies = await getPopularMovies();
        console.log('Filmes recebidos:', movies);

        if (!movies || movies.length === 0) {
            console.error('Nenhum filme encontrado para o carrossel');
            return;
        }

        // Verificar elementos do DOM
        const carouselIndicators = document.querySelector('#carousel-indicators');
        const carouselInner = document.querySelector('#carousel-inner');
        const carouselElement = document.querySelector('#carouselExampleCaptions');

        if (!carouselIndicators || !carouselInner || !carouselElement) {
            console.error('Elementos do carrossel não encontrados:', {
                carouselIndicators: !!carouselIndicators,
                carouselInner: !!carouselInner,
                carouselElement: !!carouselElement
            });
            return;
        }

        console.log('Elementos do carrossel encontrados, criando slides...');

        // Limpar carrossel existente
        carouselIndicators.innerHTML = '';
        carouselInner.innerHTML = '';

        // Criar slides com os 5 primeiros filmes
        movies.slice(0, 5).forEach((movie, index) => {
            console.log(`Criando slide ${index + 1} para o filme:`, movie.title);
            
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
            
            const backdropPath = movie.backdrop_path 
                ? `${TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path}`
                : 'https://via.placeholder.com/1920x1080?text=Imagem+não+disponível';
            
            console.log(`URL da imagem do slide ${index + 1}:`, backdropPath);
            
            slide.innerHTML = `
                <img src="${backdropPath}" 
                     class="d-block w-100" 
                     alt="${movie.title}"
                     onerror="this.src='https://via.placeholder.com/1920x1080?text=Imagem+não+disponível'">
                <div class="carousel-caption d-none d-md-block">
                    <h5>${movie.title}</h5>
                    <p>${movie.overview || 'Sinopse não disponível.'}</p>
                    <button class="btn btn-danger" onclick="openMovieModal(${movie.id})">
                        <i class="fas fa-play"></i> Assistir
                    </button>
                </div>
            `;
            carouselInner.appendChild(slide);
        });

        console.log('Slides criados, inicializando carrossel...');

        // Inicializar o carrossel do Bootstrap
        const carousel = new bootstrap.Carousel(carouselElement, {
            interval: 5000,
            wrap: true
        });

        // Adicionar eventos de clique nos botões
        const prevButton = document.querySelector('.carousel-control-prev');
        const nextButton = document.querySelector('.carousel-control-next');

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                carousel.prev();
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                carousel.next();
            });
        }

        console.log('Carrossel criado e inicializado com sucesso');
    } catch (error) {
        console.error('Erro ao criar carrossel:', error);
    }
};

// Inicializar o carrossel quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, iniciando criação do carrossel...');
    createCarousel();
}); 