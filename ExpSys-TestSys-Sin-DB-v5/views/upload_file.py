from utils.files.file_config import EXCEL_TEST_PATH, REPORT_PATH
from services.excel.get_excel_data import get_excel_data

def upload_file(request, allowed_file):
   data = request.form
   filetype = data['filetype'].lower()

   if 'file' not in request.files: return {
      'success': False,
      'message': 'No se envió ningún archivo',
      'code': 400
   }

   file = request.files['file']

   if file.filename == '': return {
      'success': False,
      'message': 'Nombre de archivo vacío',
      'code': 400
   }

   if file and allowed_file(file.filename):
      if filetype == 'excel':
         file.save(EXCEL_TEST_PATH)
         data = get_excel_data()

         if 'success' in data and not data['success']:
            return data

      else:
         file.save(REPORT_PATH)

      return { 
         'success': True,
         'message': 'Archivo subido correctamente',
         'code': 200
      }

   return { 
      'success': False, 
      'message': 'Archivo no permitido',
      'code': 400
   }