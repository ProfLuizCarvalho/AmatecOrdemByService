// Obter informações do usuário logado
function displayUserInfo() {
    const userName = localStorage.getItem('loggedInUser');
    
    if (!userName) {
        // Se não há usuário logado, redirecionar para login
        window.location.href = 'index.html';
        return;
    }
    
    document.getElementById('userName').textContent = `Bem-vindo, ${userName}!`;
}

// Fazer logout
function logout() {
    if (confirm('Deseja realmente sair?')) {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'index.html';
    }
}

// Inicializar a página
window.addEventListener('load', () => {
    displayUserInfo();
});
