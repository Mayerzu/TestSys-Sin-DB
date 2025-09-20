from datetime import datetime

def get_formatted_date(date_str, format='%Y-%m-%d'):
   try:
      return datetime.strptime(date_str, format)

   except ValueError as e:
      print(f"Error al convertir la fecha: {e}")
      return None
