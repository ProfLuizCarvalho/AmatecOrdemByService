# Sistema de Suporte TI - Amatec

Este é o repositório para o sistema de suporte web da Amatec Informática.
Ele consiste em um backend Flask (Python) e um frontend em HTML, CSS e JavaScript.

## Estrutura do Projeto

- `backend/`: Contém o código da API Flask.
- `frontend/`: Contém os arquivos estáticos do frontend (HTML, CSS, JS).
- `database/`: Contém o script SQL para a criação do banco de dados.
- `.devcontainer/`: Configurações para o GitHub Codespaces.

## Configuração e Execução (Codespaces)

1.  **Abrir no Codespaces:** Clique no botão "Open in Codespaces" no GitHub.
2.  **Instalação de Dependências:** O `postCreateCommand` no `.devcontainer/devcontainer.json` irá instalar automaticamente as dependências Python e Node.js.
3.  **Configurar Banco de Dados:**
    *   Conecte-se ao seu banco de dados MySQL na Locaweb usando o MySQL Workbench.
    *   Execute o script `database/schema.sql` para criar as tabelas.
    *   Atualize `backend/config.py` com as credenciais do seu banco de dados da Locaweb.
4.  **Executar o Backend:**
    *   Abra um terminal no Codespaces.
    *   Navegue até a pasta `backend/`: `cd backend`
    *   Ative o ambiente virtual: `source venv/bin/activate`
    *   Execute a aplicação Flask: `flask run`
    *   O Codespaces irá encaminhar a porta 5000.
5.  **Executar o Frontend:**
    *   Abra outro terminal no Codespaces.
    *   Navegue até a pasta `frontend/public`: `cd frontend/public`
    *   Inicie o Live Server: `npx live-server` (ou use a extensão "Open with Live Server" no VS Code).
    *   O Codespaces irá encaminhar a porta 5500.

## Deploy na Locaweb

Consulte a documentação da Locaweb para configurar o deploy de aplicações Python (WSGI) e servir arquivos estáticos. Certifique-se de configurar as variáveis de ambiente para as credenciais do banco de dados e a chave secreta JWT.