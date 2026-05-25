# backend/wsgi.py
import sys
import os

# Adicione o diretório do seu backend ao PATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__))))

from app import app as application # 'application' é o nome que muitos servidores WSGI esperam