// Obter informações do usuário logado
function displayUserInfo() {
    const userName = localStorage.getItem('loggedInUser');
    
    if (!userName) {
        // Se não há usuário logado, redirecionar para login
        window.location.href = 'index.html';
        return;
    }
    
    document.getElementById('userNameSidebar').textContent = `Usuário: ${userName}`;
}

// Fazer logout
function logout() {
    if (confirm('Deseja realmente sair?')) {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'index.html';
    }
}

// Abrir/Fechar menu lateral
const toggleMenuBtn = document.getElementById('toggleMenu');
const closeSidebarBtn = document.getElementById('closeSidebar');
const sidebar = document.querySelector('.sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

toggleMenuBtn.addEventListener('click', () => {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
});

closeSidebarBtn.addEventListener('click', () => {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
});

sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
});

// Fechar menu ao clicar em um link
document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', () => {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    });
});

// Inicializar a página
window.addEventListener('load', () => {
    displayUserInfo();
});
