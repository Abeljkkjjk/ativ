import { fetchTMDB, TMDB_IMAGE_BASE_URL } from './app.js';
import { addToMyList, removeFromMyList, isInMyList } from './my-list.js';

// Função para abrir o modal com detalhes do conteúdo
export const openMovieModal = async (id, type = 'movie') => {
    try {
        console.log(`Abrindo modal para ${type} ID: ${id}`);
        
        const modal = document.getElementById('movieModal');
        if (!modal) {
            throw new Error('Modal não encontrado');
        }
        
        // Buscar detalhes do conteúdo
        const endpoint = type === 'movie' ? `/movie/${id}` : `/tv/${id}`;
        const data = await fetchTMDB(endpoint);
        
        if (!data) {
            throw new Error('Dados não encontrados');
        }
        
        // Verificar se está na lista
        const inMyList = await isInMyList(id, type);
        
        // Atualizar conteúdo do modal
        const modalTitle = modal.querySelector('.modal-title');
        const modalBody = modal.querySelector('.modal-body');
        
        if (modalTitle && modalBody) {
            modalTitle.textContent = data.title || data.name;
            
            const posterPath = data.poster_path;
            const imageUrl = posterPath 
                ? `${TMDB_IMAGE_BASE_URL}/w500${posterPath}`
                : 'https://via.placeholder.com/500x750?text=Imagem+não+disponível';
            
            modalBody.innerHTML = `
                <div class="row">
                    <div class="col-md-4">
                        <img src="${imageUrl}" class="img-fluid rounded" alt="${data.title || data.name}">
                    </div>
                    <div class="col-md-8">
                        <h5>${data.title || data.name}</h5>
                        <p class="text-muted">
                            ${type === 'movie' ? data.release_date : data.first_air_date} • 
                            ${type === 'movie' ? `${data.runtime} min` : `${data.number_of_seasons} temporadas`}
                        </p>
                        <p>${data.overview || 'Descrição não disponível'}</p>
                        <div class="d-flex gap-2">
                            <button class="btn btn-danger play-button" data-id="${id}" data-type="${type}">
                                <i class="fas fa-play"></i> Assistir
                            </button>
                            <button class="btn btn-outline-light list-button" data-id="${id}" data-type="${type}">
                                <i class="fas ${inMyList ? 'fa-check' : 'fa-plus'}"></i>
                                ${inMyList ? 'Remover da Lista' : 'Adicionar à Lista'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // Adicionar eventos aos botões
            const playButton = modalBody.querySelector('.play-button');
            const listButton = modalBody.querySelector('.list-button');
            
            if (playButton) {
                playButton.addEventListener('click', () => {
                    console.log(`Reproduzindo ${type} ID: ${id}`);
                    alert('Funcionalidade de reprodução em desenvolvimento');
                });
            }
            
            if (listButton) {
                listButton.addEventListener('click', async () => {
                    try {
                        const inMyList = await isInMyList(id, type);
                        
                        if (inMyList) {
                            await removeFromMyList(id, type);
                        } else {
                            await addToMyList(id, type);
                        }
                        
                        // Atualizar botão
                        const icon = listButton.querySelector('i');
                        if (icon) {
                            icon.className = inMyList ? 'fas fa-plus' : 'fas fa-check';
                        }
                        listButton.innerHTML = listButton.innerHTML.replace(
                            inMyList ? 'Remover da Lista' : 'Adicionar à Lista',
                            inMyList ? 'Adicionar à Lista' : 'Remover da Lista'
                        );
                    } catch (error) {
                        console.error('Erro ao atualizar lista:', error);
                    }
                });
            }
        }
        
        // Abrir modal
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
        
        console.log('Modal aberto com sucesso');
    } catch (error) {
        console.error('Erro ao abrir modal:', error);
    }
};

// Função para reproduzir conteúdo
window.playContent = (id, type) => {
    console.log(`Reproduzindo ${type} ID: ${id}`);
    // Aqui você pode implementar a lógica de reprodução
    alert('Funcionalidade de reprodução em desenvolvimento');
};

// Função para adicionar/remover da lista
window.toggleMyList = async (id, type) => {
    try {
        const inMyList = await isInMyList(id, type);
        
        if (inMyList) {
            await removeFromMyList(id, type);
        } else {
            await addToMyList(id, type);
        }
        
        // Atualizar botão
        const button = document.querySelector(`button[onclick="toggleMyList(${id}, '${type}')"]`);
        if (button) {
            const icon = button.querySelector('i');
            if (icon) {
                icon.className = inMyList ? 'fas fa-plus' : 'fas fa-check';
            }
            button.innerHTML = button.innerHTML.replace(
                inMyList ? 'Remover da Lista' : 'Adicionar à Lista',
                inMyList ? 'Adicionar à Lista' : 'Remover da Lista'
            );
        }
    } catch (error) {
        console.error('Erro ao atualizar lista:', error);
    }
}; 
import { fetchTMDB, TMDB_IMAGE_BASE_URL } from './app.js';
import { addToMyList, removeFromMyList, isInMyList } from './my-list.js';

// Função para abrir o modal com detalhes do conteúdo
export const openMovieModal = async (id, type = 'movie') => {
    try {
        console.log(`Abrindo modal para ${type} ID: ${id}`);
        
        const modal = document.getElementById('movieModal');
        if (!modal) {
            throw new Error('Modal não encontrado');
        }
        
        // Buscar detalhes do conteúdo
        const endpoint = type === 'movie' ? `/movie/${id}` : `/tv/${id}`;
        const data = await fetchTMDB(endpoint);
        
        if (!data) {
            throw new Error('Dados não encontrados');
        }
        
        // Verificar se está na lista
        const inMyList = await isInMyList(id, type);
        
        // Atualizar conteúdo do modal
        const modalTitle = modal.querySelector('.modal-title');
        const modalBody = modal.querySelector('.modal-body');
        
        if (modalTitle && modalBody) {
            modalTitle.textContent = data.title || data.name;
            
            const posterPath = data.poster_path;
            const imageUrl = posterPath 
                ? `${TMDB_IMAGE_BASE_URL}/w500${posterPath}`
                : 'https://via.placeholder.com/500x750?text=Imagem+não+disponível';
            
            modalBody.innerHTML = `
                <div class="row">
                    <div class="col-md-4">
                        <img src="${imageUrl}" class="img-fluid rounded" alt="${data.title || data.name}">
                    </div>
                    <div class="col-md-8">
                        <h5>${data.title || data.name}</h5>
                        <p class="text-muted">
                            ${type === 'movie' ? data.release_date : data.first_air_date} • 
                            ${type === 'movie' ? `${data.runtime} min` : `${data.number_of_seasons} temporadas`}
                        </p>
                        <p>${data.overview || 'Descrição não disponível'}</p>
                        <div class="d-flex gap-2">
                            <button class="btn btn-danger" onclick="playContent(${id}, '${type}')">
                                <i class="fas fa-play"></i> Assistir
                            </button>
                            <button class="btn btn-outline-light" onclick="toggleMyList(${id}, '${type}')">
                                <i class="fas ${inMyList ? 'fa-check' : 'fa-plus'}"></i>
                                ${inMyList ? 'Remover da Lista' : 'Adicionar à Lista'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Abrir modal
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
        
        console.log('Modal aberto com sucesso');
    } catch (error) {
        console.error('Erro ao abrir modal:', error);
    }
};

// Função para reproduzir conteúdo
window.playContent = (id, type) => {
    console.log(`Reproduzindo ${type} ID: ${id}`);
    // Aqui você pode implementar a lógica de reprodução
    alert('Funcionalidade de reprodução em desenvolvimento');
};

// Função para adicionar/remover da lista
window.toggleMyList = async (id, type) => {
    try {
        const inMyList = await isInMyList(id, type);
        
        if (inMyList) {
            await removeFromMyList(id, type);
        } else {
            await addToMyList(id, type);
        }
        
        // Atualizar botão
        const button = document.querySelector(`button[onclick="toggleMyList(${id}, '${type}')"]`);
        if (button) {
            const icon = button.querySelector('i');
            if (icon) {
                icon.className = inMyList ? 'fas fa-plus' : 'fas fa-check';
            }
            button.innerHTML = button.innerHTML.replace(
                inMyList ? 'Remover da Lista' : 'Adicionar à Lista',
                inMyList ? 'Adicionar à Lista' : 'Remover da Lista'
            );
        }
    } catch (error) {
        console.error('Erro ao atualizar lista:', error);
    }
}; 