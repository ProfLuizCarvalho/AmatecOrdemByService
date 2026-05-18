// Credenciais corretas
const CORRECT_USERNAME = 'adm';
const CORRECT_PASSWORD = '123';

// Referências ao DOM
const loginForm = document.getElementById('loginForm');
const messageDiv = document.getElementById('message');
const loginContainer = document.querySelector('.login-container');

// Event listener para o formulário
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    // Validar credenciais
    if (username === CORRECT_USERNAME && password === CORRECT_PASSWORD) {
        // Login bem-sucedido
        localStorage.setItem('loggedInUser', username);
        
        // Redirecionar para a página de clientes após um pequeno delay
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 500);
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


// Focar no campo de usuário quando a página carrega
window.addEventListener('load', () => {
    document.getElementById('username').focus();
});
