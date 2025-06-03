# Netflix Clone

Este é um clone da interface da Netflix, desenvolvido como projeto de estudo. O projeto utiliza a API do TMDB (The Movie Database) para exibir informações sobre filmes e séries.

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5
- Firebase Hosting
- TMDB API

## Configuração do Projeto

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/netflix-clone.git
cd netflix-clone
```

2. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto
   - Adicione sua chave da API do TMDB:
   ```
   TMDB_API_KEY=sua_chave_api_aqui
   ```

3. Configure o Firebase:
   - Crie um projeto no Firebase Console
   - Atualize as configurações do Firebase no arquivo `js/app.js`
   - Execute o comando de deploy:
   ```bash
   firebase deploy
   ```

## Estrutura do Projeto

```
netflix-clone/
├── y/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── app.js
│   │   ├── carousel.js
│   │   ├── footer.js
│   │   ├── header.js
│   │   ├── modal.js
│   │   └── search.js
│   └── index.html
├── firebase.json
└── README.md
```

## Funcionalidades

- Exibição de filmes populares
- Carrossel de filmes em destaque
- Pesquisa de filmes
- Visualização de detalhes dos filmes
- Interface responsiva
- Design moderno inspirado na Netflix

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Agradecimentos

- [TMDB](https://www.themoviedb.org/) pela API de filmes
- [Bootstrap](https://getbootstrap.com/) pelo framework CSS
- [Firebase](https://firebase.google.com/) pelo serviço de hosting 