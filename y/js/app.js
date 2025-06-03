// Importar a função do modal primeiro
import { openMovieModal } from './modal.js';
import { addToMyList, removeFromMyList, markAsWatched, getUserMovies } from './userList.js';

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX",
    authDomain: "projeto-abel.firebaseapp.com",
    projectId: "projeto-abel",
    storageBucket: "projeto-abel.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// Inicialização do Firebase apenas se ainda não estiver inicializado
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Configuração da API do TMDB
const TMDB_API_KEY = 'ccc8b62cbbecfab848e5084f061cbd17';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Funções auxiliares para a API do TMDB
const fetchTMDB = async (endpoint) => {
    try {
        console.log('Buscando dados do TMDB:', endpoint);
        const url = `${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&language=pt-BR`;
        console.log('URL da requisição:', url);
        
        const response = await fetch(url);
        console.log('Status da resposta:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Dados recebidos:', data);
        return data;
    } catch (error) {
        console.error('Erro ao buscar dados do TMDB:', error);
        return null;
    }
};

// Função para buscar filmes populares
export const getPopularMovies = async () => {
    try {
        console.log('Iniciando busca de filmes populares...');
        const data = await fetchTMDB('/movie/popular');
        
        if (!data) {
            console.error('Nenhum dado recebido da API');
            return [];
        }
        
        if (!data.results) {
            console.error('Dados recebidos não contêm resultados:', data);
            return [];
        }
        
        console.log(`${data.results.length} filmes encontrados`);
        console.log('Primeiro filme:', data.results[0]);
        
        return data.results;
    } catch (error) {
        console.error('Erro ao buscar filmes populares:', error);
        return [];
    }
};

// Função para buscar séries populares
export const getPopularTVShows = async () => {
    try {
        console.log('Buscando séries populares...');
        const data = await fetchTMDB('/tv/popular');
        if (!data || !data.results) {
            console.error('Dados inválidos recebidos da API');
            return [];
        }
        console.log(`${data.results.length} séries encontradas`);
        return data.results;
    } catch (error) {
        console.error('Erro ao buscar séries populares:', error);
        return [];
    }
};

// Função para buscar detalhes de um filme
export const getMovieDetails = async (movieId) => {
    try {
        console.log('Buscando detalhes do filme:', movieId);
        const data = await fetchTMDB(`/movie/${movieId}`);
        if (!data) {
            console.error('Dados inválidos recebidos da API');
            return null;
        }
        console.log('Detalhes do filme recebidos:', data);
        return data;
    } catch (error) {
        console.error('Erro ao buscar detalhes do filme:', error);
        return null;
    }
};

// Função para buscar detalhes de uma série
export const getTVShowDetails = async (tvId) => {
    try {
        console.log('Buscando detalhes da série:', tvId);
        const data = await fetchTMDB(`/tv/${tvId}`);
        if (!data) {
            console.error('Dados inválidos recebidos da API');
            return null;
        }
        console.log('Detalhes da série recebidos:', data);
        return data;
    } catch (error) {
        console.error('Erro ao buscar detalhes da série:', error);
        return null;
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

// Função para criar card de filme
const createMovieCard = (movie) => {
    console.log('Criando card para filme:', movie.title);
    const card = document.createElement('div');
    card.className = 'col-md-3 col-sm-6';
    
    const posterPath = movie.poster_path 
        ? `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=Imagem+não+disponível';
    
    card.innerHTML = `
        <div class="movie-card" data-movie-id="${movie.id}">
            <img src="${posterPath}" 
                 alt="${movie.title}"
                 onerror="this.src='https://via.placeholder.com/500x750?text=Imagem+não+disponível'">
            <div class="movie-info">
                <h5 class="movie-title">${movie.title}</h5>
                <div class="movie-rating">
                    <i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}
                </div>
                <div class="btn-group mt-2">
                    <button class="btn btn-sm btn-outline-light view-details" data-movie-id="${movie.id}">
                        <i class="fas fa-info-circle"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-light add-to-list" data-movie-id="${movie.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    return card;
};

// Função para criar card de série
const createTVShowCard = (show) => {
    console.log('Criando card para série:', show.name);
    const card = document.createElement('div');
    card.className = 'col-md-3 col-sm-6';
    
    const posterPath = show.poster_path 
        ? `${TMDB_IMAGE_BASE_URL}/w500${show.poster_path}`
        : 'https://via.placeholder.com/500x750?text=Imagem+não+disponível';
    
    card.innerHTML = `
        <div class="tvshow-card" data-tv-id="${show.id}">
            <img src="${posterPath}" 
                 alt="${show.name}"
                 onerror="this.src='https://via.placeholder.com/500x750?text=Imagem+não+disponível'">
            <div class="tvshow-info">
                <h5 class="tvshow-title">${show.name}</h5>
                <div class="tvshow-rating">
                    <i class="fas fa-star"></i> ${show.vote_average.toFixed(1)}
                </div>
                <div class="btn-group mt-2">
                    <button class="btn btn-sm btn-outline-light view-details" data-tv-id="${show.id}">
                        <i class="fas fa-info-circle"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-light add-to-list" data-tv-id="${show.id}">
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
        // Carregar filmes populares
        const movies = await getPopularMovies();
        const moviesContainer = document.getElementById('movies-container');
        
        if (moviesContainer && movies.length > 0) {
            console.log('Renderizando filmes...');
            moviesContainer.innerHTML = movies.map(movie => `
                <div class="col-md-3 mb-4">
                    <div class="movie-card" onclick="openMovieModal(${movie.id})">
                        <img src="${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}" 
                             alt="${movie.title}"
                             onerror="this.src='https://via.placeholder.com/500x750?text=Imagem+não+disponível'">
                        <div class="movie-info">
                            <h5 class="movie-title">${movie.title}</h5>
                            <p class="movie-rating">
                                <i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}
                            </p>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Carregar séries populares
        const series = await getPopularTVShows();
        const seriesContainer = document.getElementById('series-container');
        
        if (seriesContainer && series.length > 0) {
            console.log('Renderizando séries...');
            seriesContainer.innerHTML = series.map(show => `
                <div class="col-md-3 mb-4">
                    <div class="tvshow-card" onclick="openTVShowModal(${show.id})">
                        <img src="${TMDB_IMAGE_BASE_URL}/w500${show.poster_path}" 
                             alt="${show.name}"
                             onerror="this.src='https://via.placeholder.com/500x750?text=Imagem+não+disponível'">
                        <div class="tvshow-info">
                            <h5 class="tvshow-title">${show.name}</h5>
                            <p class="tvshow-rating">
                                <i class="fas fa-star"></i> ${show.vote_average.toFixed(1)}
                            </p>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Carregar lista do usuário
        const myListContainer = document.getElementById('mylist-container');
        if (myListContainer) {
            const userId = firebase.auth().currentUser?.uid;
            if (userId) {
                const userList = await getUserMovies(userId);
                console.log('Itens na lista do usuário:', userList.length);
                
                myListContainer.innerHTML = '';
                userList.forEach(item => {
                    const card = item.type === 'movie' 
                        ? createMovieCard(item)
                        : createTVShowCard(item);
                    myListContainer.appendChild(card);
                });
            } else {
                myListContainer.innerHTML = '<div class="col-12 text-center"><p>Faça login para ver sua lista</p></div>';
            }
        }

        // Adicionar eventos aos botões
        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', async (e) => {
                const movieId = e.target.closest('[data-movie-id]')?.dataset.movieId;
                const tvId = e.target.closest('[data-tv-id]')?.dataset.tvId;
                
                if (movieId) {
                    const movieDetails = await getMovieDetails(movieId);
                    if (movieDetails) {
                        openMovieModal(movieDetails);
                    }
                } else if (tvId) {
                    const tvDetails = await getTVShowDetails(tvId);
                    if (tvDetails) {
                        openMovieModal(tvDetails);
                    }
                }
            });
        });

        document.querySelectorAll('.add-to-list').forEach(button => {
            button.addEventListener('click', async (e) => {
                const userId = firebase.auth().currentUser?.uid;
                if (!userId) {
                    alert('Por favor, faça login para adicionar itens à sua lista');
                    return;
                }

                const movieId = e.target.closest('[data-movie-id]')?.dataset.movieId;
                const tvId = e.target.closest('[data-tv-id]')?.dataset.tvId;
                
                if (movieId) {
                    await addToMyList(movieId, userId);
                    e.target.innerHTML = '<i class="fas fa-check"></i>';
                } else if (tvId) {
                    await addToMyList(tvId, userId, 'tv');
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
    getPopularMovies,
    getPopularTVShows,
    getMovieDetails,
    getTVShowDetails,
    getMoviesByGenre,
    getTVShowsByGenre,
    searchMovies,
    searchTVShows,
    createMovieCard,
    createTVShowCard
}; 