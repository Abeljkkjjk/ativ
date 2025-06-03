// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX",
    authDomain: "projeto-abel.firebaseapp.com",
    projectId: "projeto-abel",
    storageBucket: "projeto-abel.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// Inicialização do Firebase
console.log('Inicializando Firebase...');
if (!firebase.apps.length) {
    try {
        firebase.initializeApp(firebaseConfig);
        console.log('Firebase inicializado com sucesso');
    } catch (error) {
        console.error('Erro ao inicializar Firebase:', error);
    }
} else {
    console.log('Firebase já está inicializado');
}

export default firebase; 