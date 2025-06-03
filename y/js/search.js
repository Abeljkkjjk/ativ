import { searchMovies, TMDB_IMAGE_BASE_URL } from './app.js';
import { openMovieModal } from './modal.js';
import { addToMyList, removeFromMyList, markAsWatched, isInMyList } from './userList.js';

// Função para criar o card de resultado da pesquisa
const createSearchResultCard = (movie) => {
    const card = document.createElement('div');
    card.className = 'col-md-4 mb-4';
    
    const posterPath = movie.poster_path 
        ? `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=Imagem+não+disponível';
    
    card.innerHTML = `
        <div class="card bg-dark text-white">
            <img src="${posterPath}" class="card-img-top" alt="${movie.title}">
            <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text">${movie.overview ? movie.overview.substring(0, 100) + '...' : 'Sinopse não disponível'}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-light view-details" data-movie-id="${movie.id}">
                            <i class="fas fa-info-circle"></i> Detalhes
                        </button>
                        <button class="btn btn-sm btn-outline-light add-to-list" data-movie-id="${movie.id}">
                            <i class="fas fa-plus"></i> Minha Lista
                        </button>
                    </div>
                    <small class="text-muted">
                        <i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}
                    </small>
                </div>
            </div>
        </div>
    `;
    return card;
};

// Função para realizar a pesquisa
const performSearch = async (query) => {
    try {
        const searchResults = document.getElementById('search-results');
        const searchInput = document.getElementById('search-input');
        
        if (!searchResults || !searchInput) return;
        
        // Mostrar loading
        searchResults.innerHTML = '<div class="text-center"><div class="spinner-border text-light" role="status"></div></div>';
        
        // Realizar pesquisa
        const results = await searchMovies(query);
        
        // Limpar resultados anteriores
        searchResults.innerHTML = '';
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="alert alert-info">Nenhum resultado encontrado</div>';
            return;
        }
        
        // Criar cards para cada resultado
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'row';
        
        results.forEach(movie => {
            const card = createSearchResultCard(movie);
            resultsContainer.appendChild(card);
        });
        
        searchResults.appendChild(resultsContainer);
        
        // Adicionar eventos aos botões
        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', async (e) => {
                const movieId = e.target.closest('.view-details').dataset.movieId;
                const movie = results.find(m => m.id === parseInt(movieId));
                if (movie) {
                    openMovieModal(movie);
                }
            });
        });
        
        document.querySelectorAll('.add-to-list').forEach(button => {
            button.addEventListener('click', async (e) => {
                const movieId = e.target.closest('.add-to-list').dataset.movieId;
                const userId = firebase.auth().currentUser?.uid;
                
                if (!userId) {
                    alert('Por favor, faça login para adicionar filmes à sua lista');
                    return;
                }
                
                const isInList = await isInMyList(movieId, userId);
                if (isInList) {
                    await removeFromMyList(movieId, userId);
                    e.target.innerHTML = '<i class="fas fa-plus"></i> Minha Lista';
                } else {
                    await addToMyList(movieId, userId);
                    e.target.innerHTML = '<i class="fas fa-check"></i> Na Lista';
                }
            });
        });
        
    } catch (error) {
        console.error('Erro ao realizar pesquisa:', error);
        const searchResults = document.getElementById('search-results');
        if (searchResults) {
            searchResults.innerHTML = '<div class="alert alert-danger">Erro ao realizar pesquisa</div>';
        }
    }
};

// Inicializar funcionalidade de pesquisa
const initializeSearch = () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                performSearch(query);
            }
        });
        
        // Pesquisa em tempo real
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            if (query) {
                searchTimeout = setTimeout(() => performSearch(query), 500);
            }
        });
    }
};

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initializeSearch);

export { performSearch }; 