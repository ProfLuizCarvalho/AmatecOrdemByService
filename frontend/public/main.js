// frontend/public/main.js
// (Copie e cole o conteúdo do main.js fornecido no exemplo anterior)

// Seletores de elementos HTML
const appContent = document.getElementById('app-content');
const homeLink = document.getElementById('home-link');

const navLoginCliente = document.getElementById('nav-login-cliente');
const navLoginAdmin = document.getElementById('nav-login-admin');
const navAbrirTicket = document.getElementById('nav-abrir-ticket');
const navMeusTickets = document.getElementById('nav-meus-tickets');
const navPainelAdmin = document.getElementById('nav-painel-admin');
const navLogout = document.getElementById('nav-logout');

// Variáveis de estado (simulando login)
let isLoggedIn = false;
let currentUserType = null; // 'cliente', 'admin', 'tecnico'

// --- Funções para Renderizar Conteúdo ---

function renderWelcomePage() {
    appContent.innerHTML = `
        <section id="welcome-section" class="page-section">
            <h2>Bem-vindo ao Sistema de Suporte Amatec</h2>
            <p>Para solicitar suporte, abra um ticket. Se você já é cliente, faça login para acompanhar suas solicitações.</p>
        </section>
    `;
}

function renderLoginForm(type) {
    appContent.innerHTML = `
        <section id="login-section" class="page-section">
            <h2>Login ${type === 'cliente' ? 'de Cliente' : 'de Administrador/Técnico'}</h2>
            <form id="login-form">
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" required>
                </div>
                <div class="form-group">
                    <label for="password">Senha:</label>
                    <input type="password" id="password" required>
                </div>
                <button type="submit" class="form-button">Entrar</button>
            </form>
            <div id="login-message" class="message hidden"></div>
        </section>
    `;

    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const messageDiv = document.getElementById('login-message');

        // Simulação de login
        if (type === 'cliente' && email === 'cliente@teste.com' && password === '123') {
            isLoggedIn = true;
            currentUserType = 'cliente';
            messageDiv.className = 'message success';
            messageDiv.textContent = 'Login de cliente realizado com sucesso!';
            updateNavigation();
            setTimeout(() => renderMeusTicketsPage(), 1500);
        } else if ((type === 'admin' || type === 'tecnico') && email === 'admin@teste.com' && password === '123') {
            isLoggedIn = true;
            currentUserType = 'admin';
            messageDiv.className = 'message success';
            messageDiv.textContent = 'Login de administrador realizado com sucesso!';
            updateNavigation();
            setTimeout(() => renderPainelAdminPage(), 1500);
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = 'Email ou senha inválidos.';
        }
        messageDiv.classList.remove('hidden');
    });
}

function renderAbrirTicketPage() {
    appContent.innerHTML = `
        <section id="abrir-ticket-section" class="page-section">
            <h2>Abrir Novo Ticket de Suporte</h2>
            <form id="abrir-ticket-form">
                <div class="form-group">
                    <label for="ticket-assunto">Assunto:</label>
                    <input type="text" id="ticket-assunto" required>
                </div>
                <div class="form-group">
                    <label for="ticket-descricao">Descrição do Problema:</label>
                    <textarea id="ticket-descricao" rows="5" required></textarea>
                </div>
                <div class="form-group">
                    <label for="ticket-prioridade">Prioridade:</label>
                    <select id="ticket-prioridade">
                        <option value="Baixa">Baixa</option>
                        <option value="Média" selected>Média</option>
                        <option value="Alta">Alta</option>
                        <option value="Urgente">Urgente</option>
                    </select>
                </div>
                <button type="submit" class="form-button">Enviar Ticket</button>
            </form>
            <div id="ticket-message" class="message hidden"></div>
        </section>
    `;

    document.getElementById('abrir-ticket-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const assunto = document.getElementById('ticket-assunto').value;
        const descricao = document.getElementById('ticket-descricao').value;
        const prioridade = document.getElementById('ticket-prioridade').value;
        const messageDiv = document.getElementById('ticket-message');

        console.log('Ticket enviado:', { assunto, descricao, prioridade });
        messageDiv.className = 'message success';
        messageDiv.textContent = 'Ticket enviado com sucesso! Aguarde o contato da nossa equipe.';
        messageDiv.classList.remove('hidden');

        e.target.reset();
    });
}

function renderMeusTicketsPage() {
    if (!isLoggedIn || currentUserType !== 'cliente') {
        appContent.innerHTML = `<section class="page-section"><p class="message error">Você precisa estar logado como cliente para ver seus tickets.</p></section>`;
        return;
    }

    const tickets = [
        { id: 1, assunto: 'Computador não liga', status: 'Em Análise', prioridade: 'Alta', data: '2026-05-20' },
        { id: 2, assunto: 'Problema com impressora', status: 'Resolvido', prioridade: 'Média', data: '2026-05-18' },
        { id: 3, assunto: 'Internet lenta', status: 'Aberto', prioridade: 'Urgente', data: '2026-05-25' },
    ];

    let ticketsHtml = tickets.map(ticket => `
        <li class="data-list-item">
            <strong>ID:</strong> ${ticket.id}<br>
            <strong>Assunto:</strong> ${ticket.assunto}<br>
            <strong>Status:</strong> <span class="status-${ticket.status.toLowerCase().replace(' ', '-')}">${ticket.status}</span><br>
            <strong>Prioridade:</strong> ${ticket.prioridade}<br>
            <strong>Data:</strong> ${ticket.data}
        </li>
    `).join('');

    appContent.innerHTML = `
        <section id="meus-tickets-section" class="page-section">
            <h2>Meus Tickets</h2>
            <ul class="data-list">
                ${ticketsHtml || '<p>Nenhum ticket encontrado.</p>'}
            </ul>
        </section>
    `;
}

function renderPainelAdminPage() {
    if (!isLoggedIn || currentUserType !== 'admin') {
        appContent.innerHTML = `<section class="page-section"><p class="message error">Acesso negado. Apenas administradores podem acessar este painel.</p></section>`;
        return;
    }

    const tickets = [
        { id: 1, cliente: 'Cliente A', assunto: 'Computador não liga', status: 'Em Análise', prioridade: 'Alta', data: '2026-05-20' },
        { id: 2, cliente: 'Cliente B', assunto: 'Problema com impressora', status: 'Resolvido', prioridade: 'Média', data: '2026-05-18' },
        { id: 3, cliente: 'Cliente C', assunto: 'Internet lenta', status: 'Aberto', prioridade: 'Urgente', data: '2026-05-25' },
    ];

    const ordens = [
        { id: 101, cliente: 'Cliente A', tecnico: 'João', status: 'Em Atendimento', data: '2026-05-20' },
        { id: 102, cliente: 'Cliente B', tecnico: 'Maria', status: 'Concluída', data: '2026-05-19' },
    ];

    let ticketsHtml = tickets.map(ticket => `
        <li class="data-list-item">
            <strong>ID:</strong> ${ticket.id}<br>
            <strong>Cliente:</strong> ${ticket.cliente}<br>
            <strong>Assunto:</strong> ${ticket.assunto}<br>
            <strong>Status:</strong> <span class="status-${ticket.status.toLowerCase().replace(' ', '-')}">${ticket.status}</span><br>
            <strong>Prioridade:</strong> ${ticket.prioridade}<br>
            <strong>Data:</strong> ${ticket.data}
        </li>
    `).join('');

    let ordensHtml = ordens.map(ordem => `
        <li class="data-list-item">
            <strong>ID OS:</strong> ${ordem.id}<br>
            <strong>Cliente:</strong> ${ordem.cliente}<br>
            <strong>Técnico:</strong> ${ordem.tecnico}<br>
            <strong>Status:</strong> <span class="status-${ordem.status.toLowerCase().replace(' ', '-')}">${ordem.status}</span><br>
            <strong>Data:</strong> ${ordem.data}
        </li>
    `).join('');

    appContent.innerHTML = `
        <section id="admin-dashboard-section" class="page-section">
            <h2>Painel Administrativo</h2>

            <h3>Tickets Recentes</h3>
            <ul class="data-list">
                ${ticketsHtml || '<p>Nenhum ticket recente.</p>'}
            </ul>

            <h3>Ordens de Serviço Recentes</h3>
            <ul class="data-list">
                ${ordensHtml || '<p>Nenhuma OS recente.</p>'}
            </ul>
        </section>
    `;
}

// --- Funções de Navegação e Estado ---

function updateNavigation() {
    navLoginCliente.classList.remove('hidden');
    navLoginAdmin.classList.remove('hidden');
    navAbrirTicket.classList.remove('hidden');
    navMeusTickets.classList.add('hidden');
    navPainelAdmin.classList.add('hidden');
    navLogout.classList.add('hidden');

    if (isLoggedIn) {
        navLoginCliente.classList.add('hidden');
        navLoginAdmin.classList.add('hidden');
        navLogout.classList.remove('hidden');

        if (currentUserType === 'cliente') {
            navAbrirTicket.classList.remove('hidden');
            navMeusTickets.classList.remove('hidden');
        } else if (currentUserType === 'admin' || currentUserType === 'tecnico') {
            navAbrirTicket.classList.add('hidden');
            navPainelAdmin.classList.remove('hidden');
        }
    }
}

function handleLogout() {
    isLoggedIn = false;
    currentUserType = null;
    alert('Você foi desconectado.');
    updateNavigation();
    renderWelcomePage();
}

// --- Event Listeners ---
homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    renderWelcomePage();
});

navLoginCliente.addEventListener('click', () => renderLoginForm('cliente'));
navLoginAdmin.addEventListener('click', () => renderLoginForm('admin'));
navAbrirTicket.addEventListener('click', () => renderAbrirTicketPage());
navMeusTickets.addEventListener('click', () => renderMeusTicketsPage());
navPainelAdmin.addEventListener('click', () => renderPainelAdminPage());
navLogout.addEventListener('click', handleLogout);

document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
    renderWelcomePage();
});