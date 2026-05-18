// Classe para gerenciar faturamentos
class FaturamentoManager {
    constructor() {
        this.storageKey = 'faturamentos_data';
        this.faturamentos = this.loadFromStorage();
        this.faturamentoIdToDelete = null;
    }

    // Carregar dados do localStorage
    loadFromStorage() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    // Salvar dados no localStorage
    saveToStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.faturamentos));
    }

    // Gerar ID único
    generateId() {
        if (this.faturamentos.length === 0) return 'FAT001';
        const lastId = this.faturamentos[this.faturamentos.length - 1].id;
        const number = parseInt(lastId.substring(3)) + 1;
        return 'FAT' + String(number).padStart(3, '0');
    }

    // Adicionar novo faturamento
    addFaturamento(faturamento) {
        faturamento.id = this.generateId();
        this.faturamentos.push(faturamento);
        this.saveToStorage();
        return faturamento;
    }

    // Atualizar faturamento
    updateFaturamento(id, faturamentoData) {
        const index = this.faturamentos.findIndex(f => f.id === id);
        if (index !== -1) {
            this.faturamentos[index] = { ...this.faturamentos[index], ...faturamentoData, id };
            this.saveToStorage();
            return this.faturamentos[index];
        }
        return null;
    }

    // Deletar faturamento
    deleteFaturamento(id) {
        const index = this.faturamentos.findIndex(f => f.id === id);
        if (index !== -1) {
            this.faturamentos.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    // Obter todos os faturamentos
    getAllFaturamentos() {
        return this.faturamentos;
    }

    // Obter faturamento por ID
    getFaturamentoById(id) {
        return this.faturamentos.find(f => f.id === id);
    }
}

// Inicializar o gerenciador
const manager = new FaturamentoManager();

// Referências ao DOM
const faturamentoForm = document.getElementById('faturamentoForm');
const faturamentoIdInput = document.getElementById('faturamentoId');
const faturamentoClienteInput = document.getElementById('faturamentoCliente');
const faturamentoDataInput = document.getElementById('faturamentoData');
const faturamentoValorInput = document.getElementById('faturamentoValor');
const faturamentoDescricaoInput = document.getElementById('faturamentoDescricao');
const faturamentoStatusInput = document.getElementById('faturamentoStatus');
const faturamentoDataVencimentoInput = document.getElementById('faturamentoDataVencimento');
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
confirmDelete.addEventListener('click', confirmDeleteFaturamento);
cancelDelete.addEventListener('click', closeDeleteModal);

// Impedir submissão padrão do formulário
faturamentoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSave();
});

// Formatar valor (moeda)
faturamentoValorInput.addEventListener('blur', (e) => {
    let value = parseFloat(e.target.value);
    if (!isNaN(value)) {
        e.target.value = value.toFixed(2);
    }
});

// Salvar faturamento
function handleSave() {
    // Validar campos obrigatórios
    if (!faturamentoClienteInput.value.trim()) {
        alert('Por favor, preencha o nome do cliente');
        faturamentoClienteInput.focus();
        return;
    }

    if (!faturamentoDataInput.value) {
        alert('Por favor, preencha a data');
        faturamentoDataInput.focus();
        return;
    }

    if (!faturamentoValorInput.value || parseFloat(faturamentoValorInput.value) <= 0) {
        alert('Por favor, preencha um valor válido');
        faturamentoValorInput.focus();
        return;
    }

    if (!faturamentoDescricaoInput.value.trim()) {
        alert('Por favor, preencha a descrição');
        faturamentoDescricaoInput.focus();
        return;
    }

    if (!faturamentoStatusInput.value) {
        alert('Por favor, selecione um status');
        faturamentoStatusInput.focus();
        return;
    }

    if (!faturamentoDataVencimentoInput.value) {
        alert('Por favor, preencha a data de vencimento');
        faturamentoDataVencimentoInput.focus();
        return;
    }

    const faturamentoData = {
        cliente: faturamentoClienteInput.value.trim(),
        data: faturamentoDataInput.value,
        valor: parseFloat(faturamentoValorInput.value).toFixed(2),
        descricao: faturamentoDescricaoInput.value.trim(),
        status: faturamentoStatusInput.value,
        dataVencimento: faturamentoDataVencimentoInput.value
    };

    if (isEditMode && faturamentoIdInput.value) {
        // Atualizar faturamento existente
        manager.updateFaturamento(faturamentoIdInput.value, faturamentoData);
        alert('Faturamento atualizado com sucesso!');
    } else {
        // Adicionar novo faturamento
        manager.addFaturamento(faturamentoData);
        alert('Faturamento cadastrado com sucesso!');
    }

    clearForm();
    renderTable();
}

// Novo faturamento
function handleNew() {
    clearForm();
    faturamentoClienteInput.focus();
}

// Cancelar edição
function handleCancel() {
    clearForm();
}

// Fechar (voltar para home)
function handleClose() {
    if (confirm('Deseja realmente sair sem salvar?')) {
        window.location.href = 'home.html';
    }
}

// Limpar formulário
function clearForm() {
    faturamentoForm.reset();
    faturamentoIdInput.value = '';
    isEditMode = false;
    btnSalvar.innerHTML = '<i class="fas fa-save"></i> Salvar';
}

// Editar faturamento
function editFaturamento(id) {
    const faturamento = manager.getFaturamentoById(id);
    if (faturamento) {
        faturamentoIdInput.value = faturamento.id;
        faturamentoClienteInput.value = faturamento.cliente;
        faturamentoDataInput.value = faturamento.data;
        faturamentoValorInput.value = faturamento.valor;
        faturamentoDescricaoInput.value = faturamento.descricao;
        faturamentoStatusInput.value = faturamento.status;
        faturamentoDataVencimentoInput.value = faturamento.dataVencimento;
        isEditMode = true;
        btnSalvar.innerHTML = '<i class="fas fa-edit"></i> Atualizar';
        faturamentoClienteInput.focus();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Preparar exclusão
function prepareDeletFaturamento(id) {
    manager.faturamentoIdToDelete = id;
    deleteModal.classList.remove('hidden');
}

// Confirmar exclusão
function confirmDeleteFaturamento() {
    if (manager.faturamentoIdToDelete) {
        manager.deleteFaturamento(manager.faturamentoIdToDelete);
        closeDeleteModal();
        renderTable();
        alert('Faturamento excluído com sucesso!');
    }
}

// Fechar modal de exclusão
function closeDeleteModal() {
    deleteModal.classList.add('hidden');
    manager.faturamentoIdToDelete = null;
}

// Formatar data para exibição
function formatarData(data) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

// Formatar valor para moeda
function formatarMoeda(valor) {
    return `R$ ${parseFloat(valor).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

// Renderizar tabela
function renderTable() {
    const faturamentos = manager.getAllFaturamentos();

    if (faturamentos.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-message">Nenhum faturamento cadastrado</td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = faturamentos.map(faturamento => `
        <tr>
            <td><strong>${faturamento.id}</strong></td>
            <td>${faturamento.cliente}</td>
            <td>${formatarData(faturamento.data)}</td>
            <td class="valor">${formatarMoeda(faturamento.valor)}</td>
            <td>${faturamento.descricao.substring(0, 30)}${faturamento.descricao.length > 30 ? '...' : ''}</td>
            <td>${formatarData(faturamento.dataVencimento)}</td>
            <td>
                <span class="status ${faturamento.status}">
                    ${faturamento.status.charAt(0).toUpperCase() + faturamento.status.slice(1)}
                </span>
            </td>
            <td>
                <div class="actions">
                    <button class="btn btn-edit" onclick="editFaturamento('${faturamento.id}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-delete" onclick="prepareDeletFaturamento('${faturamento.id}')">
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
    faturamentoClienteInput.focus();
});
