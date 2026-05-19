// Classe para gerenciar clientes
class ClienteManager {
    constructor() {
        this.storageKey = 'clientes_data';
        this.clientes = this.loadFromStorage();
        this.clientIdToDelete = null;
    }

    // Carregar dados do localStorage
    loadFromStorage() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    // Salvar dados no localStorage
    saveToStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.clientes));
    }

    // Gerar ID único
    generateId() {
        if (this.clientes.length === 0) return 'CLI001';
        const lastId = this.clientes[this.clientes.length - 1].id;
        const number = parseInt(lastId.substring(3)) + 1;
        return 'CLI' + String(number).padStart(3, '0');
    }

    // Adicionar novo cliente
    addCliente(cliente) {
        cliente.id = this.generateId();
        this.clientes.push(cliente);
        this.saveToStorage();
        return cliente;
    }

    // Atualizar cliente
    updateCliente(id, clienteData) {
        const index = this.clientes.findIndex(c => c.id === id);
        if (index !== -1) {
            this.clientes[index] = { ...this.clientes[index], ...clienteData, id };
            this.saveToStorage();
            return this.clientes[index];
        }
        return null;
    }

    // Deletar cliente
    deleteCliente(id) {
        const index = this.clientes.findIndex(c => c.id === id);
        if (index !== -1) {
            this.clientes.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    // Obter todos os clientes
    getAllClientes() {
        return this.clientes;
    }

    // Obter cliente por ID
    getClienteById(id) {
        return this.clientes.find(c => c.id === id);
    }
}

// Inicializar o gerenciador
const manager = new ClienteManager();

// Referências ao DOM
const clientForm = document.getElementById('clientForm');
const clientIdInput = document.getElementById('clientId');
const clientNomeInput = document.getElementById('clientNome');
const clientDocumentoInput = document.getElementById('clientDocumento');
const clientTelefoneInput = document.getElementById('clientTelefone');
const clientCelularInput = document.getElementById('clientCelular');
const clientTipoInput = document.getElementById('clientTipo');
const clientResponsavelInput = document.getElementById('clientResponsavel');
const clientStatusInput = document.getElementById('clientStatus');
const tableBody = document.getElementById('tableBody');

const btnSalvar = document.getElementById('btnSalvar');
const btnNovo = document.getElementById('btnNovo');
const btnCancelar = document.getElementById('btnCancelar');
const btnFechar = document.getElementById('btnFechar');

const deleteModal = document.getElementById('deleteModal');
const confirmDelete = document.getElementById('confirmDelete');
const cancelDelete = document.getElementById('cancelDelete');

// Estado do formulário
let isEditMode = false;

// Event listeners dos botões
btnSalvar.addEventListener('click', handleSave);
btnNovo.addEventListener('click', handleNew);
btnCancelar.addEventListener('click', handleCancel);
btnFechar.addEventListener('click', handleClose);
confirmDelete.addEventListener('click', confirmDeleteClient);
cancelDelete.addEventListener('click', closeDeleteModal);

// Impedir submissão padrão do formulário
clientForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSave();
});

// Formatar Documento
clientDocumentoInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 14) {
        value = value.replace(/(\d{2})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1/$2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
    }
    e.target.value = value;
});

// Formatar Telefone
clientTelefoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    e.target.value = value;
});

// Salvar cliente
function handleSave() {
    // Validar campos obrigatórios
    if (!clientNomeInput.value.trim()) {
        alert('Por favor, preencha o nome do cliente');
        clientNomeInput.focus();
        return;
    }

    if (!clientDocumentoInput.value.trim()) {
        alert('Por favor, preencha o documento');
        clientDocumentoInput.focus();
        return;
    }

    if (!clientTelefoneInput.value.trim()) {
        alert('Por favor, preencha o telefone');
        clientTelefoneInput.focus();
        return;
    }

    if (!clientTipoInput.value) {
        alert('Por favor, selecione o tipo de cliente');
        clientTipoInput.focus();
        return;
    }

    if (!clientResponsavelInput.value.trim()) {
        alert('Por favor, preencha o responsável');
        clientResponsavelInput.focus();
        return;
    }

    if (!clientStatusInput.value) {
        alert('Por favor, selecione um status');
        clientStatusInput.focus();
        return;
    }

    const clienteData = {
        nome: clientNomeInput.value.trim(),
        documento: clientDocumentoInput.value.trim(),
        telefone: clientTelefoneInput.value.trim(),
        celular: clientCelularInput.value.trim(),
        tipo: clientTipoInput.value,
        responsavel: clientResponsavelInput.value.trim(),
        status: clientStatusInput.value
    };

    if (isEditMode && clientIdInput.value) {
        // Atualizar cliente existente
        manager.updateCliente(clientIdInput.value, clienteData);
        alert('Cliente atualizado com sucesso!');
    } else {
        // Adicionar novo cliente
        manager.addCliente(clienteData);
        alert('Cliente cadastrado com sucesso!');
    }

    clearForm();
    renderTable();
}

// Novo cliente
function handleNew() {
    clearForm();
    clientNomeInput.focus();
}

// Cancelar edição
function handleCancel() {
    clearForm();
}

// Fechar (voltar para home)
function handleClose() {
    if (confirm('Deseja realmente sair sem salvar?')) {
        window.location.href = 'index.html';
    }
}

// Limpar formulário
function clearForm() {
    clientForm.reset();
    clientIdInput.value = '';
    isEditMode = false;
    btnSalvar.textContent = ' Salvar';
    btnSalvar.innerHTML = '<i class="fas fa-save"></i> Salvar';
}

// Editar cliente
function editCliente(id) {
    const cliente = manager.getClienteById(id);
    if (cliente) {
        clientIdInput.value = cliente.id;
        clientNomeInput.value = cliente.nome;
        clientDocumentoInput.value = cliente.documento;
        clientTelefoneInput.value = cliente.telefone;
        clientCelularInput.value = cliente.celular;
        clientTipoInput.value = cliente.tipo;
        clientResponsavelInput.value = cliente.responsavel;
        clientStatusInput.value = cliente.status;
        isEditMode = true;
        btnSalvar.innerHTML = '<i class="fas fa-edit"></i> Atualizar';
        clientNomeInput.focus();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Preparar exclusão
function prepareDelete(id) {
    manager.clientIdToDelete = id;
    deleteModal.classList.remove('hidden');
}

// Confirmar exclusão
function confirmDeleteClient() {
    if (manager.clientIdToDelete) {
        manager.deleteCliente(manager.clientIdToDelete);
        closeDeleteModal();
        renderTable();
        alert('Cliente excluído com sucesso!');
    }
}

// Fechar modal de exclusão
function closeDeleteModal() {
    deleteModal.classList.add('hidden');
    manager.clientIdToDelete = null;
}

// Renderizar tabela
function renderTable() {
    const clientes = manager.getAllClientes();

    if (clientes.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-message">Nenhum cliente cadastrado</td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = clientes.map(cliente => `
        <tr>
            <td><strong>${cliente.id}</strong></td>
            <td>${cliente.nome}</td>
            <td>${cliente.documento}</td>
            <td>${cliente.telefone}</td>
            <td>${cliente.celular || '-'}</td>
            <td>${cliente.tipo || '-'}</td>
            <td>${cliente.responsavel}</td>
            <td>
                <span class="status ${cliente.status}">
                    ${cliente.status.charAt(0).toUpperCase() + cliente.status.slice(1)}
                </span>
            </td>
            <td>
                <div class="actions">
                    <button class="btn btn-edit" onclick="editCliente('${cliente.id}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-delete" onclick="prepareDelete('${cliente.id}')">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Fechar modal ao clicar fora dele
deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
        closeDeleteModal();
    }
});

// Inicializar a página
window.addEventListener('load', () => {
    renderTable();
    clientNomeInput.focus();
});
