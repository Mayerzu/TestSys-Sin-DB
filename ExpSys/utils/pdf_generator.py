from utils.files.get_file_list import get_file_list
from utils.files.file_config import APP_FOLDERS
from docx2pdf import convert
import pythoncom
import os

def generate_pdf(params):
   input_folder = APP_FOLDERS[params.get('input_folder')]
   output_folder = APP_FOLDERS[params.get('output_folder')]

   data = get_file_list(input_folder, '.docx')
   
   pythoncom.CoInitialize()

   payload = {
      'success': False,
      'message': 'Los informes ya fueron convertidos a pdf',
      'status': 'exists'
   }

   try:   
      for file in data['files']:
         input_path = os.path.join(input_folder, file['file'])
         file_name = file['file'].split('.')[0]
         output_path = os.path.join(output_folder, f'{file_name}.pdf')

         try:
            if not os.path.exists(output_path):
               payload = convert(input_path, output_path)
               os.system('taskkill /f /im WINWORD.EXE >nul 2>&1')
               
               payload = {
                  'success': True,
                  'message': 'Conversión a pdf finalizada',
                  'status': 'created'
               }

         except Exception as e:
            print(f'Error al convertir {file['file']}: {str(e)}')

            payload = {
               'success': False,
               'message': f'Error al convertir archivo: {str(e)}'
            }

            if str(e) == 'Word.Application.Quit':
               payload['success'] = True
               payload['message'] = 'Conversión a pdf finalizada'
            
      return payload
         
   finally:
      pythoncom.CoUninitialize()