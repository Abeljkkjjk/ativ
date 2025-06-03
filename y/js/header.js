import { searchMovies, createMovieCard } from './app.js';

// Função para criar o header
const createHeader = () => {
    const header = document.getElementById('header');
    header.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark">
            <div class="container">
                <a class="navbar-brand" href="#">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" alt="Netflix">
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item">
                            <a class="nav-link" href="#">Início</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Séries</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Filmes</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Bombando</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Minha Lista</a>
                        </li>
                    </ul>
                    <form class="d-flex" id="search-form">
                        <input class="form-control search-bar me-2" type="search" placeholder="Títulos, pessoas, gêneros" id="search-input">
                        <button class="btn btn-outline-light" type="submit">Buscar</button>
                    </form>
                </div>
            </div>
        </nav>
    `;

    // Adicionar evento de pesquisa
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        
        if (query) {
            const movies = await searchMovies(query);
            const moviesContainer = document.getElementById('movies-container');
            
            // Limpar container
            moviesContainer.innerHTML = '';
            
            if (movies.length > 0) {
                // Adicionar cards de filmes encontrados
                movies.forEach(movie => {
                    const card = createMovieCard(movie);
                    moviesContainer.appendChild(card);
                });
            } else {
                // Mostrar mensagem de nenhum resultado
                moviesContainer.innerHTML = `
                    <div class="col-12 text-center">
                        <h3 class="text-light">Nenhum resultado encontrado para "${query}"</h3>
                    </div>
                `;
            }
        }
    });
};

// Inicializar o header quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', createHeader); 