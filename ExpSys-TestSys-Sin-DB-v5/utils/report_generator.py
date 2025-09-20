from docxtpl import DocxTemplate
from utils.files.file_config import REPORT_PATH
import os

def generate_report(data, doc_folder, success_message = 'Informes generados correctamente'):
   TEMPLATE_PATH = REPORT_PATH
   
   split_date = list(reversed(data['fecha'].split('/')))
   date = '-'.join(split_date)
   filename = f'{date}_{data['nombre']}.docx'
    
   word_file_output_path = os.path.join(doc_folder, filename)

   if not os.path.exists(TEMPLATE_PATH): return {
      'success': False,
      'message': f'Plantilla no encontrada',
      'status': 'error'
   }

   if os.path.exists(word_file_output_path): return {
      'success': False,
      'message': f'El informe ya existe',
      'status': 'exists'
   }
   
   try:
      doc = DocxTemplate(TEMPLATE_PATH)
      doc.render(data)
      doc.save(word_file_output_path)

      return {
         'success': True,
         'message': success_message,
         'status': 'created'
      }
   
   except Exception as e:     
      return {
         'success': False,
         'message': f'Error al generar informes: {e}'
      }
   
   finally:
      pass