// Credenciais corretas
const CORRECT_USERNAME = 'adm';
const CORRECT_PASSWORD = '123';

// Referências ao DOM
const loginForm = document.getElementById('loginForm');
const messageDiv = document.getElementById('message');
const loginContainer = document.querySelector('.login-container');
const loggedInScreen = document.getElementById('loggedInScreen');
const userDisplay = document.getElementById('userDisplay');

// Event listener para o formulário
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    // Validar credenciais
    if (username === CORRECT_USERNAME && password === CORRECT_PASSWORD) {
        // Login bem-sucedido
        loginContainer.style.display = 'none';
        loggedInScreen.classList.remove('hidden');
        userDisplay.textContent = `Bem-vindo, ${username}!`;
        
        // Limpar formulário
        loginForm.reset();
        messageDiv.className = 'message';
    } else {
        // Login falhou
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Usuário ou senha inválidos!';
        
        // Limpar campo de senha
        document.getElementById('password').value = '';
        document.getElementById('username').focus();
        
        // Remover mensagem após 3 segundos
        setTimeout(() => {
            messageDiv.className = 'message';
        }, 3000);
    }
});

// Função para fazer logout
function logout() {
    loginContainer.style.display = 'flex';
    loggedInScreen.classList.add('hidden');
    loginForm.reset();
    messageDiv.className = 'message';
    document.getElementById('username').focus();
}

// Focar no campo de usuário quando a página carrega
window.addEventListener('load', () => {
    document.getElementById('username').focus();
});
