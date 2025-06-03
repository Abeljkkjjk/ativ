// Importar a função do modal primeiro
import { openMovieModal } from './modal.js';
import { addToMyList } from './my-list.js';
import { getAuth } from 'firebase/auth';
import { removeFromMyList, markAsWatched, getUserMovies } from './userList.js';
import firebase from './firebase-config.js';

// Configuração da API do TMDB
const TMDB_API_KEY = 'ccc8b62cbbecfab848e5084f061cbd17';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Verificar se a chave da API está definida
if (!TMDB_API_KEY) {
    console.error('Chave da API do TMDB não está definida!');
}

// Funções auxiliares para a API do TMDB
const fetchTMDB = async (endpoint) => {
    try {
        console.log('Iniciando requisição para o TMDB...');
        console.log('Endpoint:', endpoint);
        console.log('API Key:', TMDB_API_KEY);
        
        const url = `${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&language=pt-BR`;
        console.log('URL completa:', url);
        
        const response = await fetch(url);
        console.log('Status da resposta:', response.status);
        console.log('Headers da resposta:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Resposta de erro:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Dados recebidos:', data);
        
        if (!data) {
            throw new Error('Nenhum dado recebido da API');
        }
        
        if (data.status_code) {
            throw new Error(`Erro da API TMDB: ${data.status_message}`);
        }
        
        return data;
    } catch (error) {
        console.error('Erro ao buscar dados do TMDB:', error);
        console.error('Stack trace:', error.stack);
        return null;
    }
};

// Função para buscar conteúdo popular (filmes e séries)
const getPopularContent = async () => {
    try {
        console.log('Buscando conteúdo popular...');
        
        // Buscar filmes populares
        const moviesData = await fetchTMDB('/movie/popular');
        const movies = moviesData?.results || [];
        console.log(`${movies.length} filmes encontrados`);
        
        // Buscar séries populares
        const seriesData = await fetchTMDB('/tv/popular');
        const series = seriesData?.results || [];
        console.log(`${series.length} séries encontradas`);
        
        // Combinar e ordenar por popularidade
        const allContent = [
            ...movies.map(movie => ({ ...movie, type: 'movie' })),
            ...series.map(show => ({ ...show, type: 'tv' }))
        ].sort((a, b) => b.popularity - a.popularity);
        
        console.log(`Total de ${allContent.length} itens encontrados`);
        return allContent;
    } catch (error) {
        console.error('Erro ao buscar conteúdo popular:', error);
        return [];
    }
};

// Função para buscar filmes por gênero
const getMoviesByGenre = async (genreId) => {
    try {
        const data = await fetchTMDB(`/discover/movie?with_genres=${genreId}`);
        return data?.results || [];
    } catch (error) {
        console.error('Erro ao buscar filmes por gênero:', error);
        return [];
    }
};

// Função para buscar séries por gênero
const getTVShowsByGenre = async (genreId) => {
    try {
        const data = await fetchTMDB(`/discover/tv?with_genres=${genreId}`);
        return data?.results || [];
    } catch (error) {
        console.error('Erro ao buscar séries por gênero:', error);
        return [];
    }
};

// Função para buscar filmes por pesquisa
const searchMovies = async (query) => {
    try {
        const data = await fetchTMDB(`/search/movie?query=${encodeURIComponent(query)}`);
        return data?.results || [];
    } catch (error) {
        console.error('Erro ao buscar filmes por pesquisa:', error);
        return [];
    }
};

// Função para buscar séries por pesquisa
const searchTVShows = async (query) => {
    try {
        const data = await fetchTMDB(`/search/tv?query=${encodeURIComponent(query)}`);
        return data?.results || [];
    } catch (error) {
        console.error('Erro ao buscar séries por pesquisa:', error);
        return [];
    }
};

// Função para criar card de conteúdo
const createContentCard = (item) => {
    console.log('Criando card para:', item.title || item.name);
    const card = document.createElement('div');
    card.className = 'col-md-3 col-sm-6 mb-4';
    
    const title = item.title || item.name;
    const posterPath = item.poster_path 
        ? `${TMDB_IMAGE_BASE_URL}/w500${item.poster_path}`
        : 'https://via.placeholder.com/500x750?text=Imagem+não+disponível';
    
    card.innerHTML = `
        <div class="content-card" data-id="${item.id}" data-type="${item.type}">
            <img src="${posterPath}" 
                 alt="${title}"
                 onerror="this.src='https://via.placeholder.com/500x750?text=Imagem+não+disponível'">
            <div class="content-info">
                <h5 class="content-title">${title}</h5>
                <div class="content-rating">
                    <i class="fas fa-star"></i> ${item.vote_average.toFixed(1)}
                </div>
                <div class="btn-group mt-2">
                    <button class="btn btn-sm btn-outline-light view-details" data-id="${item.id}" data-type="${item.type}">
                        <i class="fas fa-info-circle"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-light add-to-list" data-id="${item.id}" data-type="${item.type}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    return card;
};

// Função para inicializar a página
const initializePage = async () => {
    console.log('Inicializando página...');
    try {
        // Carregar conteúdo popular
        const content = await getPopularContent();
        const contentContainer = document.getElementById('content-container');
        
        if (contentContainer && content.length > 0) {
            console.log('Renderizando conteúdo...');
            contentContainer.innerHTML = '';
            content.forEach(item => {
                const card = createContentCard(item);
                contentContainer.appendChild(card);
            });
        }

        // Adicionar eventos aos botões
        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', async (e) => {
                const id = e.target.closest('[data-id]')?.dataset.id;
                const type = e.target.closest('[data-type]')?.dataset.type;
                
                if (id && type) {
                    await openMovieModal(id, type);
                }
            });
        });

        document.querySelectorAll('.add-to-list').forEach(button => {
            button.addEventListener('click', async (e) => {
                const auth = getAuth();
                if (!auth.currentUser) {
                    alert('Por favor, faça login para adicionar itens à sua lista');
                    return;
                }

                const id = e.target.closest('[data-id]')?.dataset.id;
                const type = e.target.closest('[data-type]')?.dataset.type;
                
                if (id && type) {
                    await addToMyList(id, type);
                    e.target.innerHTML = '<i class="fas fa-check"></i>';
                }
            });
        });

        console.log('Página inicializada com sucesso');

    } catch (error) {
        console.error('Erro ao inicializar a página:', error);
    }
};

// Inicializar a página quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initializePage);

// Exportar funções e constantes necessárias
export {
    TMDB_IMAGE_BASE_URL,
    getPopularContent,
    fetchTMDB,
    createContentCard
}; 