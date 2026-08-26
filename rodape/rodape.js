// Seleciona o elemento pelo ID correto configurado no HTML
const rodape = document.getElementById('footer-footer');

// Injeta o HTML corrigindo a classe 'site-footer' e fechando as aspas
rodape.innerHTML = `
    <footer class="site-footer">
        <div class="container footer-grid">
            <div class="footer-col brand-col">
                <img src="/Sobre Nós/img/logocomfundobranco.png" alt="Logo Feirinha Pai d'Égua" class="footer-logo">
                <p>Valorizando a arte, a cultura e a identidade paraense através das mãos dos nossos mestres artesãos.</p>
            </div>
            <div class="footer-col links-col">
                <h4>Navegação</h4>
                <ul>
                    <li><a href="/Tela Inicial/pagina_inicial.html">Início</a></li>
                    <li><a href="/História do Artesão/historiaartesao.html">Artesãos</a></li>
                    <li><a href="/Categorias/pagina_categorias.html">Categorias</a></li>
                    <li><a href="/Sobre Nós/sobrenos.html">Sobre a Feirinha</a></li>
                </ul>
            </div>
            <div class="footer-col contact-col">
                <h4>Atendimento</h4>
                <p><i class="fa-solid fa-envelope"></i> contato@feirinhapaidegua.com.br</p>
                <p><i class="fa-solid fa-location-dot"></i> Belém — Pará, Brasil</p>
                <div class="social-links">
                    <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                    <a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook"></i></a>
                    <a href="#" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <div class="container">
                <p>&copy; 2026 Feirinha Pai d'Égua. Todos os direitos reservados. Orgulhosamente produzido no Pará.</p>
            </div>
        </div>
    </footer>
`;