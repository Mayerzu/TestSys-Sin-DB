from services.excel.excel_store import get_excel_data_store
from services.get_top_areas import get_top_areas
from services.get_recommendations import get_recommendations
from utils.get_report_data import get_report_data
from utils.report_generator import generate_report
from utils.files.file_config import EXCEL_TEST_PATH, DOCS_FOLDER, REPORT_PATH
import os

def generate_report_from_excel(report_ids):
   excel_path = EXCEL_TEST_PATH
   excel_data = get_excel_data_store()

   if not os.path.exists(REPORT_PATH): return {
      'success': False,
      'message': f'Plantilla no encontrada',
      'status': 'error'
   }
   
   payload = {
      'message': 'Procesando...'
   }

   if not os.path.exists(excel_path): return {
      'success': False,
      'message': f'Archivo ({excel_path}) no encontrado'
   }

   if len(report_ids) <= 0: return {
      'success': False,
      'message': 'Lista de ids vacia'
   }

   for user in excel_data:
      data = {
         'nombre': user['name'].title(),
         'edad': user['age'],
         'fecha': user['evaluation_date'],
         'telefono': user['phone'],
         'correo': user['email']
      }

      scores = user['scores']

      top_areas = get_top_areas(scores)
      recommendations = get_recommendations(top_areas)
      careers, areas = get_report_data(recommendations, top_areas, scores)

      data['areas'] = areas
      data['carreras'] = careers

      if len(report_ids) > 0 and len(report_ids) != len(excel_data):
         if user['index'] in report_ids:
            payload = generate_report(data, DOCS_FOLDER)
      else:    
         payload = generate_report(data, DOCS_FOLDER)
         
   return payload