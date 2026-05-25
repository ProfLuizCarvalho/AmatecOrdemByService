from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

from config import Config # Importa a configuração

app = Flask(__name__)
app.config.from_object(Config)

db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# --- Modelos do Banco de Dados ---
# (Copie e cole todas as classes de modelo aqui, como Cliente, Tecnico, Produto, Ordem, ItensOrdem, Usuario, Ticket)
# Certifique-se de incluir o método .to_dict() para cada modelo para facilitar a serialização para JSON.

class Cliente(db.Model):
    __tablename__ = 'cliente'
    IDCLIENTE = db.Column(db.Integer, primary_key=True)
    CLINOME = db.Column(db.String(255), nullable=False)
    CLIDOCUMENTO = db.Column(db.String(20), unique=True, nullable=False)
    CLIRESPONSAVEL = db.Column(db.String(255))
    CLITELEFONE = db.Column(db.String(20))
    CLICELULAR = db.Column(db.String(20))
    CLIEMAIL = db.Column(db.String(255), unique=True, nullable=False)
    CLISENHA = db.Column(db.String(255), nullable=False)
    CLITIPO = db.Column(db.Enum('Pessoa Física', 'Pessoa Jurídica'), default='Pessoa Física')
    CLISTATUS = db.Column(db.Enum('Ativo', 'Inativo'), default='Ativo')

    ordens = db.relationship('Ordem', backref='cliente', lazy=True)
    tickets = db.relationship('Ticket', backref='cliente', lazy=True)

    def set_password(self, password):
        self.CLISENHA = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.CLISENHA, password)

    def to_dict(self):
        return {
            'IDCLIENTE': self.IDCLIENTE,
            'CLINOME': self.CLINOME,
            'CLIDOCUMENTO': self.CLIDOCUMENTO,
            'CLIRESPONSAVEL': self.CLIRESPONSAVEL,
            'CLITELEFONE': self.CLITELEFONE,
            'CLICELULAR': self.CLICELULAR,
            'CLIEMAIL': self.CLIEMAIL,
            'CLITIPO': self.CLITIPO,
            'CLISTATUS': self.CLISTATUS
        }

class Tecnico(db.Model):
    __tablename__ = 'tecnico'
    IDTECNICO = db.Column(db.Integer, primary_key=True)
    TECNOME = db.Column(db.String(255), nullable=False)
    TECSTATUS = db.Column(db.Enum('Ativo', 'Inativo'), default='Ativo')

    ordens = db.relationship('Ordem', backref='tecnico', lazy=True)
    usuarios = db.relationship('Usuario', backref='tecnico_associado', lazy=True)

    def to_dict(self):
        return {
            'IDTECNICO': self.IDTECNICO,
            'TECNOME': self.TECNOME,
            'TECSTATUS': self.TECSTATUS
        }

class Produto(db.Model):
    __tablename__ = 'produto'
    IDPRODUTO = db.Column(db.Integer, primary_key=True)
    PRONOME = db.Column(db.String(255), nullable=False)
    PROVALOR = db.Column(db.Numeric(10, 2), nullable=False)
    PROESTOQUE = db.Column(db.Integer, default=0)
    PROMAXDESCONTO = db.Column(db.Numeric(5, 2), default=0.00)
    PROSTATUS = db.Column(db.Enum('Ativo', 'Inativo'), default='Ativo')
    PROTIPO = db.Column(db.Enum('Produto', 'Serviço'), default='Produto')

    itens_ordem = db.relationship('ItensOrdem', backref='produto', lazy=True)

    def to_dict(self):
        return {
            'IDPRODUTO': self.IDPRODUTO,
            'PRONOME': self.PRONOME,
            'PROVALOR': float(self.PROVALOR),
            'PROESTOQUE': self.PROESTOQUE,
            'PROMAXDESCONTO': float(self.PROMAXDESCONTO),
            'PROSTATUS': self.PROSTATUS,
            'PROTIPO': self.PROTIPO
        }

class Ordem(db.Model):
    __tablename__ = 'ordem'
    IDORDEM = db.Column(db.Integer, primary_key=True)
    ORDDATAABERTURA = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    ORDIDCLIENTE = db.Column(db.Integer, db.ForeignKey('cliente.IDCLIENTE'), nullable=False)
    ORDSETOR = db.Column(db.String(100))
    ORDTERMINAL = db.Column(db.String(100))
    ORDNUMEQUIPAMENTO = db.Column(db.String(100))
    ORDRECLAMADO = db.Column(db.Text)
    ORDDIAGNOSTICO = db.Column(db.Text)
    ORDSOLUCAO = db.Column(db.Text)
    ORDDATAAGENDAMENTO = db.Column(db.DateTime)
    ORDDATAATENDIMENTO = db.Column(db.DateTime)
    ORDVENCIMENTO = db.Column(db.DateTime)
    ORDTECNICO = db.Column(db.Integer, db.ForeignKey('tecnico.IDTECNICO'))
    ORDGARANTIA = db.Column(db.Boolean, default=False)
    ORDSTATUS = db.Column(db.Enum('Aberta', 'Em Atendimento', 'Aguardando Peças', 'Concluída', 'Cancelada'), default='Aberta')
    ORDVALORTOTAL = db.Column(db.Numeric(10, 2), default=0.00)

    itens_ordem = db.relationship('ItensOrdem', backref='ordem', lazy=True)
    tickets = db.relationship('Ticket', backref='ordem_associada', lazy=True)

    def to_dict(self):
        return {
            'IDORDEM': self.IDORDEM,
            'ORDDATAABERTURA': self.ORDDATAABERTURA.isoformat() if self.ORDDATAABERTURA else None,
            'ORDIDCLIENTE': self.ORDIDCLIENTE,
            'ORDSETOR': self.ORDSETOR,
            'ORDTERMINAL': self.ORDTERMINAL,
            'ORDNUMEQUIPAMENTO': self.ORDNUMEQUIPAMENTO,
            'ORDRECLAMADO': self.ORDRECLAMADO,
            'ORDDIAGNOSTICO': self.ORDDIAGNOSTICO,
            'ORDSOLUCAO': self.ORDSOLUCAO,
            'ORDDATAAGENDAMENTO': self.ORDDATAAGENDAMENTO.isoformat() if self.ORDDATAAGENDAMENTO else None,
            'ORDDATAATENDIMENTO': self.ORDDATAATENDIMENTO.isoformat() if self.ORDDATAATENDIMENTO else None,
            'ORDVENCIMENTO': self.ORDVENCIMENTO.isoformat() if self.ORDVENCIMENTO else None,
            'ORDTECNICO': self.ORDTECNICO,
            'ORDGARANTIA': self.ORDGARANTIA,
            'ORDSTATUS': self.ORDSTATUS,
            'ORDVALORTOTAL': float(self.ORDVALORTOTAL)
        }

class ItensOrdem(db.Model):
    __tablename__ = 'itensOrdem'
    IDITENSORDEM = db.Column(db.Integer, primary_key=True)
    ITEIDORDEM = db.Column(db.Integer, db.ForeignKey('ordem.IDORDEM'), nullable=False)
    ITEIDPRODUTO = db.Column(db.Integer, db.ForeignKey('produto.IDPRODUTO'), nullable=False)
    ITEVALOR = db.Column(db.Numeric(10, 2), nullable=False)
    ITEQTD = db.Column(db.Integer, nullable=False)
    ITEPERCDESCONTO = db.Column(db.Numeric(5, 2), default=0.00)
    ITESUBTOTAL = db.Column(db.Numeric(10, 2), nullable=False)
    ITESTATUS = db.Column(db.Enum('Ativo', 'Cancelado'), default='Ativo')

    def to_dict(self):
        return {
            'IDITENSORDEM': self.IDITENSORDEM,
            'ITEIDORDEM': self.ITEIDORDEM,
            'ITEIDPRODUTO': self.ITEIDPRODUTO,
            'ITEVALOR': float(self.ITEVALOR),
            'ITEQTD': self.ITEQTD,
            'ITEPERCDESCONTO': float(self.ITEPERCDESCONTO),
            'ITESUBTOTAL': float(self.ITESUBTOTAL),
            'ITESTATUS': self.ITESTATUS
        }

class Usuario(db.Model):
    __tablename__ = 'usuario'
    IDUSUARIO = db.Column(db.Integer, primary_key=True)
    USUNOME = db.Column(db.String(255), nullable=False)
    USUEMAIL = db.Column(db.String(255), unique=True, nullable=False)
    USUSENHA = db.Column(db.String(255), nullable=False)
    USUTIPO = db.Column(db.Enum('Administrador', 'Técnico'), nullable=False)
    USUSTATUS = db.Column(db.Enum('Ativo', 'Inativo'), default='Ativo')
    USUIDTECNICO = db.Column(db.Integer, db.ForeignKey('tecnico.IDTECNICO'))

    def set_password(self, password):
        self.USUSENHA = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.USUSENHA, password)

    def to_dict(self):
        return {
            'IDUSUARIO': self.IDUSUARIO,
            'USUNOME': self.USUNOME,
            'USUEMAIL': self.USUEMAIL,
            'USUTIPO': self.USUTIPO,
            'USUSTATUS': self.USUSTATUS,
            'USUIDTECNICO': self.USUIDTECNICO
        }

class Ticket(db.Model):
    __tablename__ = 'ticket'
    IDTICKET = db.Column(db.Integer, primary_key=True)
    TIDCLIENTE = db.Column(db.Integer, db.ForeignKey('cliente.IDCLIENTE'), nullable=False)
    TIDORDEM = db.Column(db.Integer, db.ForeignKey('ordem.IDORDEM'))
    TASSUNTO = db.Column(db.String(255), nullable=False)
    TDESCRICAO = db.Column(db.Text, nullable=False)
    TDATAA_BERTURA = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    TDATAFECHAMENTO = db.Column(db.DateTime)
    TSTATUS = db.Column(db.Enum('Aberto', 'Em Análise', 'Em Andamento', 'Resolvido', 'Fechado', 'Cancelado'), default='Aberto')
    TPRIORIDADE = db.Column(db.Enum('Baixa', 'Média', 'Alta', 'Urgente'), default='Média')
    TOBSERVACOES = db.Column(db.Text)

    def to_dict(self):
        return {
            'IDTICKET': self.IDTICKET,
            'TIDCLIENTE': self.TIDCLIENTE,
            'TIDORDEM': self.TIDORDEM,
            'TASSUNTO': self.TASSUNTO,
            'TDESCRICAO': self.TDESCRICAO,
            'TDATAA_BERTURA': self.TDATAA_BERTURA.isoformat() if self.TDATAA_BERTURA else None,
            'TDATAFECHAMENTO': self.TDATAFECHAMENTO.isoformat() if self.TDATAFECHAMENTO else None,
            'TSTATUS': self.TSTATUS,
            'TPRIORIDADE': self.TPRIORIDADE,
            'TOBSERVACOES': self.TOBSERVACOES
        }

# --- Rotas da API (Autenticação, Clientes, Tickets, etc.) ---
# (Copie e cole as rotas de login, criar_cliente, abrir_ticket, etc. do exemplo anterior)

@app.route('/')
def index():
    return "Bem-vindo à API de Gerenciamento de TI!"

# --- Rotas de Autenticação ---
@app.route('/login/cliente', methods=['POST'])
def login_cliente():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    cliente = Cliente.query.filter_by(CLIEMAIL=email).first()
    if not cliente or not cliente.check_password(password):
        return jsonify({"message": "Credenciais inválidas"}), 401

    access_token = create_access_token(identity={'id': cliente.IDCLIENTE, 'tipo': 'cliente'})
    return jsonify(access_token=access_token), 200

@app.route('/login/usuario', methods=['POST'])
def login_usuario():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    usuario = Usuario.query.filter_by(USUEMAIL=email).first()
    if not usuario or not usuario.check_password(password):
        return jsonify({"message": "Credenciais inválidas"}), 401

    access_token = create_access_token(identity={'id': usuario.IDUSUARIO, 'tipo': usuario.USUTIPO})
    return jsonify(access_token=access_token), 200

# --- Rotas para Clientes ---
@app.route('/clientes', methods=['POST'])
def criar_cliente():
    data = request.get_json()
    required_fields = ['CLINOME', 'CLIDOCUMENTO', 'CLIEMAIL', 'CLISENHA']
    if not all(field in data for field in required_fields):
        return jsonify({"message": "Campos obrigatórios ausentes"}), 400

    if Cliente.query.filter_by(CLIEMAIL=data['CLIEMAIL']).first():
        return jsonify({"message": "Email já cadastrado"}), 409
    if Cliente.query.filter_by(CLIDOCUMENTO=data['CLIDOCUMENTO']).first():
        return jsonify({"message": "Documento já cadastrado"}), 409

    novo_cliente = Cliente(
        CLINOME=data['CLINOME'],
        CLIDOCUMENTO=data['CLIDOCUMENTO'],
        CLIRESPONSAVEL=data.get('CLIRESPONSAVEL'),
        CLITELEFONE=data.get('CLITELEFONE'),
        CLICELULAR=data.get('CLICELULAR'),
        CLIEMAIL=data['CLIEMAIL'],
        CLITIPO=data.get('CLITIPO', 'Pessoa Física'),
        CLISTATUS=data.get('CLISTATUS', 'Ativo')
    )
    novo_cliente.set_password(data['CLISENHA'])

    db.session.add(novo_cliente)
    db.session.commit()
    return jsonify({"message": "Cliente cadastrado com sucesso!", "cliente": novo_cliente.to_dict()}), 201

@app.route('/clientes', methods=['GET'])
@jwt_required()
def listar_clientes():
    current_user = get_jwt_identity()
    if current_user['tipo'] != 'Administrador':
        return jsonify({"message": "Acesso negado"}), 403

    clientes = Cliente.query.all()
    return jsonify([cliente.to_dict() for cliente in clientes]), 200

# --- Rotas para Tickets ---
@app.route('/tickets', methods=['POST'])
@jwt_required()
def abrir_ticket():
    current_user = get_jwt_identity()
    if current_user['tipo'] != 'cliente':
        return jsonify({"message": "Acesso negado. Apenas clientes podem abrir tickets."}), 403

    data = request.get_json()
    required_fields = ['TASSUNTO', 'TDESCRICAO']
    if not all(field in data for field in required_fields):
        return jsonify({"message": "Assunto e descrição são obrigatórios"}), 400

    novo_ticket = Ticket(
        TIDCLIENTE=current_user['id'],
        TASSUNTO=data['TASSUNTO'],
        TDESCRICAO=data['TDESCRICAO'],
        TPRIORIDADE=data.get('TPRIORIDADE', 'Média'),
        TIDORDEM=data.get('TIDORDEM')
    )
    db.session.add(novo_ticket)
    db.session.commit()
    return jsonify({"message": "Ticket aberto com sucesso!", "ticket": novo_ticket.to_dict()}), 201

@app.route('/tickets/meus', methods=['GET'])
@jwt_required()
def listar_meus_tickets():
    current_user = get_jwt_identity()
    if current_user['tipo'] != 'cliente':
        return jsonify({"message": "Acesso negado. Apenas clientes podem ver seus tickets."}), 403

    tickets = Ticket.query.filter_by(TIDCLIENTE=current_user['id']).all()
    return jsonify([ticket.to_dict() for ticket in tickets]), 200

@app.route('/tickets/<int:ticket_id>', methods=['GET'])
@jwt_required()
def obter_ticket(ticket_id):
    current_user = get_jwt_identity()
    ticket = Ticket.query.get_or_404(ticket_id)

    if current_user['tipo'] == 'cliente' and ticket.TIDCLIENTE != current_user['id']:
        return jsonify({"message": "Acesso negado. Você não tem permissão para ver este ticket."}), 403
    elif current_user['tipo'] not in ['Administrador', 'Técnico', 'cliente']:
        return jsonify({"message": "Acesso negado."}), 403

    return jsonify(ticket.to_dict()), 200

@app.route('/tickets/<int:ticket_id>', methods=['PUT'])
@jwt_required()
def atualizar_ticket(ticket_id):
    current_user = get_jwt_identity()
    if current_user['tipo'] not in ['Administrador', 'Técnico']:
        return jsonify({"message": "Acesso negado. Apenas administradores e técnicos podem atualizar tickets."}), 403

    ticket = Ticket.query.get_or_404(ticket_id)
    data = request.get_json()

    if 'TSTATUS' in data:
        ticket.TSTATUS = data['TSTATUS']
        if ticket.TSTATUS in ['Resolvido', 'Fechado'] and not ticket.TDATAFECHAMENTO:
            ticket.TDATAFECHAMENTO = datetime.now()
        elif ticket.TSTATUS not in ['Resolvido', 'Fechado'] and ticket.TDATAFECHAMENTO:
            ticket.TDATAFECHAMENTO = None

    if 'TPRIORIDADE' in data:
        ticket.TPRIORIDADE = data['TPRIORIDADE']
    if 'TOBSERVACOES' in data:
        ticket.TOBSERVACOES = data['TOBSERVACOES']
    if 'TIDORDEM' in data:
        ticket.TIDORDEM = data['TIDORDEM']

    db.session.commit()
    return jsonify({"message": "Ticket atualizado com sucesso!", "ticket": ticket.to_dict()}), 200


if __name__ == '__main__':
    with app.app_context():
        db.create_all() # Para desenvolvimento, cria as tabelas se não existirem
    app.run(debug=True)