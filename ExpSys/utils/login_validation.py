import re

def is_valid_email(email):
   email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
   return re.match(email_regex, email) is not None

def is_valid_password(password):
   # Contraseña con 8 caracteres, con 1 mayúscula, 1 minúscula, 1 dígito, 1 carácter especial
   password_regex = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'
   return re.match(password_regex, password) is not None

def is_valid_name(name):
   name_regex = r'^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$'
   return re.match(name_regex, name) is not None