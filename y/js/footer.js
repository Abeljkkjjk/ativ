// Função para criar o footer
const createFooter = () => {
    const footer = document.getElementById('footer');
    footer.innerHTML = `
        <div class="container">
            <div class="row">
                <div class="col-md-3">
                    <h5>Netflix</h5>
                    <ul class="footer-links">
                        <li><a href="#">Sobre nós</a></li>
                        <li><a href="#">Carreiras</a></li>
                        <li><a href="#">Termos de Uso</a></li>
                        <li><a href="#">Privacidade</a></li>
                    </ul>
                </div>
                <div class="col-md-3">
                    <h5>Central de Ajuda</h5>
                    <ul class="footer-links">
                        <li><a href="#">Conta</a></li>
                        <li><a href="#">Central de Ajuda</a></li>
                        <li><a href="#">Comunidade</a></li>
                        <li><a href="#">Dispositivos compatíveis</a></li>
                    </ul>
                </div>
                <div class="col-md-3">
                    <h5>Informações</h5>
                    <ul class="footer-links">
                        <li><a href="#">Media Center</a></li>
                        <li><a href="#">Relações com investidores</a></li>
                        <li><a href="#">Comprar cartão pré-pago</a></li>
                        <li><a href="#">Resgatar cartão pré-pago</a></li>
                    </ul>
                </div>
                <div class="col-md-3">
                    <h5>Legal</h5>
                    <ul class="footer-links">
                        <li><a href="#">Termos de Uso</a></li>
                        <li><a href="#">Privacidade</a></li>
                        <li><a href="#">Preferências de cookies</a></li>
                        <li><a href="#">Informações corporativas</a></li>
                    </ul>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col-12 text-center">
                    <p class="text-muted">© 2024 Netflix Clone. Todos os direitos reservados.</p>
                </div>
            </div>
        </div>
    `;
};

// Inicializar o footer quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', createFooter); 