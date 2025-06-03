import { TMDB_IMAGE_BASE_URL, getMovieDetails } from './app.js';

// Função para abrir o modal com detalhes do filme
export const openMovieModal = async (movieId) => {
    try {
        console.log('Abrindo modal para o filme:', movieId);
        const movie = await getMovieDetails(movieId);
        
        if (!movie) {
            console.error('Não foi possível obter detalhes do filme');
            return;
        }

        // Criar o modal se não existir
        let modal = document.getElementById('movieModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'movieModal';
            modal.className = 'modal fade';
            modal.tabIndex = '-1';
            document.body.appendChild(modal);
        }

        // Configurar o conteúdo do modal
        modal.innerHTML = `
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${movie.title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-4">
                                <img src="${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}" 
                                     alt="${movie.title}"
                                     class="img-fluid rounded"
                                     onerror="this.src='https://via.placeholder.com/500x750?text=Imagem+não+disponível'">
                            </div>
                            <div class="col-md-8">
                                <h4>Sinopse</h4>
                                <p>${movie.overview || 'Sinopse não disponível.'}</p>
                                
                                <div class="row mt-3">
                                    <div class="col-6">
                                        <p><strong>Data de Lançamento:</strong><br>${movie.release_date || 'Não disponível'}</p>
                                        <p><strong>Duração:</strong><br>${movie.runtime ? `${movie.runtime} minutos` : 'Não disponível'}</p>
                                    </div>
                                    <div class="col-6">
                                        <p><strong>Avaliação:</strong><br>${movie.vote_average ? `${movie.vote_average.toFixed(1)}/10` : 'Não disponível'}</p>
                                        <p><strong>Gêneros:</strong><br>${movie.genres ? movie.genres.map(genre => genre.name).join(', ') : 'Não disponível'}</p>
                                    </div>
                                </div>

                                ${movie.homepage ? `
                                    <div class="mt-3">
                                        <a href="${movie.homepage}" target="_blank" class="btn btn-primary">
                                            <i class="fas fa-external-link-alt"></i> Visitar Site Oficial
                                        </a>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                    </div>
                </div>
            </div>
        `;

        // Inicializar o modal do Bootstrap
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
    } catch (error) {
        console.error('Erro ao abrir modal do filme:', error);
    }
}; 