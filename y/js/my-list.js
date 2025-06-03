import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, deleteDoc, getDoc, collection, getDocs } from 'firebase/firestore';

const db = getFirestore();

// Função para adicionar item à lista
export const addToMyList = async (id, type) => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user) {
            throw new Error('Usuário não autenticado');
        }
        
        const userRef = doc(db, 'users', user.uid);
        const listRef = doc(userRef, 'myList', `${type}_${id}`);
        
        await setDoc(listRef, {
            id,
            type,
            addedAt: new Date().toISOString()
        });
        
        console.log(`${type} ${id} adicionado à lista`);
        return true;
    } catch (error) {
        console.error('Erro ao adicionar à lista:', error);
        return false;
    }
};

// Função para remover item da lista
export const removeFromMyList = async (id, type) => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user) {
            throw new Error('Usuário não autenticado');
        }
        
        const userRef = doc(db, 'users', user.uid);
        const listRef = doc(userRef, 'myList', `${type}_${id}`);
        
        await deleteDoc(listRef);
        
        console.log(`${type} ${id} removido da lista`);
        return true;
    } catch (error) {
        console.error('Erro ao remover da lista:', error);
        return false;
    }
};

// Função para verificar se item está na lista
export const isInMyList = async (id, type) => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user) {
            return false;
        }
        
        const userRef = doc(db, 'users', user.uid);
        const listRef = doc(userRef, 'myList', `${type}_${id}`);
        
        const docSnap = await getDoc(listRef);
        return docSnap.exists();
    } catch (error) {
        console.error('Erro ao verificar lista:', error);
        return false;
    }
};

// Função para carregar lista do usuário
export const loadMyList = async () => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user) {
            return [];
        }
        
        const userRef = doc(db, 'users', user.uid);
        const listRef = collection(userRef, 'myList');
        
        const querySnapshot = await getDocs(listRef);
        const list = [];
        
        querySnapshot.forEach((doc) => {
            list.push(doc.data());
        });
        
        return list;
    } catch (error) {
        console.error('Erro ao carregar lista:', error);
        return [];
    }
}; 