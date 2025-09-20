from openpyxl.utils.datetime import from_excel
from utils.is_valid_date import is_valid_date
from utils.extract_digits import extract_digits

def valid_phone(excel_phone):
   phone = extract_digits(excel_phone)
         
   if phone.startswith('503'):
      phone = phone[3:]

   return phone if len(phone) == 8 else ''

def valid_birth_date(excel_birth_date):
   if isinstance(excel_birth_date, int) or isinstance(excel_birth_date, float):
      # Convierte a fecha si es número de serie
      birth_date = from_excel(excel_birth_date).strftime('%d/%m/%Y').strip()

   elif is_valid_date(excel_birth_date):
      birth_date = excel_birth_date.strftime('%d/%m/%Y').strip()
   
   elif is_valid_date(excel_birth_date, '%d-%m-%Y'):
      birth_date = excel_birth_date.strftime('%d/%m/%Y').strip()
   
   elif is_valid_date(excel_birth_date, '%Y/%m/%d'):
      birth_date = excel_birth_date.strftime('%d/%m/%Y').strip()

   elif is_valid_date(excel_birth_date, '%d/%m/%Y'):
      birth_date = excel_birth_date.strftime('%d/%m/%Y').strip()
   
   else:
      birth_date = ''

   return birth_date