// Funções para gerenciar a lista de filmes do usuário
import { getMovieDetails } from './app.js';

// Referência para a coleção de filmes do usuário no Firestore
const userMoviesRef = firebase.firestore().collection('userMovies');

// Adicionar filme à lista
const addToMyList = async (movieId, userId) => {
    try {
        const movieDetails = await getMovieDetails(movieId);
        if (!movieDetails) throw new Error('Filme não encontrado');

        await userMoviesRef.doc(`${userId}_${movieId}`).set({
            movieId,
            userId,
            title: movieDetails.title,
            posterPath: movieDetails.poster_path,
            addedAt: firebase.firestore.FieldValue.serverTimestamp(),
            watched: false,
            type: 'movie'
        });

        console.log('Filme adicionado à lista com sucesso');
        return true;
    } catch (error) {
        console.error('Erro ao adicionar filme à lista:', error);
        return false;
    }
};

// Remover filme da lista
const removeFromMyList = async (movieId, userId) => {
    try {
        await userMoviesRef.doc(`${userId}_${movieId}`).delete();
        console.log('Filme removido da lista com sucesso');
        return true;
    } catch (error) {
        console.error('Erro ao remover filme da lista:', error);
        return false;
    }
};

// Marcar filme como assistido
const markAsWatched = async (movieId, userId) => {
    try {
        await userMoviesRef.doc(`${userId}_${movieId}`).update({
            watched: true,
            watchedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('Filme marcado como assistido');
        return true;
    } catch (error) {
        console.error('Erro ao marcar filme como assistido:', error);
        return false;
    }
};

// Obter lista de filmes do usuário
const getUserMovies = async (userId) => {
    try {
        const snapshot = await userMoviesRef.where('userId', '==', userId).get();
        return snapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error('Erro ao obter lista de filmes:', error);
        return [];
    }
};

// Verificar se filme está na lista
const isInMyList = async (movieId, userId) => {
    try {
        const doc = await userMoviesRef.doc(`${userId}_${movieId}`).get();
        return doc.exists;
    } catch (error) {
        console.error('Erro ao verificar filme na lista:', error);
        return false;
    }
};

export {
    addToMyList,
    removeFromMyList,
    markAsWatched,
    getUserMovies,
    isInMyList
}; 