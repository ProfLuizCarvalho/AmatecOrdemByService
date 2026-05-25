# backend/config.py
import os

class Config:
    # Para Codespaces/Desenvolvimento, você pode usar um DB local ou o da Locaweb
    # Para produção na Locaweb, use as credenciais fornecidas por eles
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'mysql+pymysql://seu_usuario_locaweb:sua_senha_locaweb@seu_host_locaweb:3306/seu_banco_locaweb'
        # Exemplo para Codespaces com MySQL local (se você configurar um serviço MySQL no devcontainer.json)
        # 'mysql+pymysql://root:password@localhost/sistema_ti_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'sua_chave_secreta_muito_segura_e_longa' # Altere para uma chave forte e única