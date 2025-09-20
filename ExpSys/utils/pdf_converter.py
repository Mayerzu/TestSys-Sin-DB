from utils.files.file_config import APP_FOLDERS
from docx2pdf import convert
import pythoncom
import os

def pdf_converter(folders, file):
   input_folder = APP_FOLDERS[folders['input_folder']]
   output_folder = APP_FOLDERS[folders['output_folder']]
   
   pythoncom.CoInitialize()

   payload = {
      'success': False,
      'message': f'El informe ya fue convertido a pdf',
      'status': 'exists'
   }

   try:   
      input_path = os.path.join(input_folder, file)
      file_name = file.split('.')[0]
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
         print(f'Error al convertir {file}: {str(e)}')

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