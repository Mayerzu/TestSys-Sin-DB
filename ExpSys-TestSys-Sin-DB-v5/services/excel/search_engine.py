from services.excel.excel_store import get_excel_data_store
from utils.replace_accents import replace_accents

def excel_search_engine(params):
   data = get_excel_data_store()
   
   value = params.get('value').strip().lower()
   filter = params.get('filter').strip().lower()
   filter_data = []

   if value == '': return data

   if filter == 'name':
      value = replace_accents(value)

   for user in data:
      if filter == 'name':
         user_name = replace_accents(user['name'].lower())

         if value in user_name:
            filter_data.append(user)

      elif filter == 'date':
         if value in user['evaluation_date']:
            filter_data.append(user)

      else:
         if value in user['user_email'] or value in user['default_email']:
            filter_data.append(user)

   return filter_data