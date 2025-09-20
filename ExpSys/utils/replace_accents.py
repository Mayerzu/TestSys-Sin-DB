import unicodedata
import re

def replace_accents(text):
   text = unicodedata.normalize('NFD', text)  # Descomponer caracteres acentuados
   text = re.sub(r'[\u0300-\u036f]', '', text)  # Eliminar marcas de acento
   return text