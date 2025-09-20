from utils.files.file_config import APP_FOLDERS
import shutil
import os

def delete_files(folder):
   path = APP_FOLDERS[folder]

   if not os.path.exists(path): return {
      'success': False,
      'message': f'El folder {folder} no existe'
   }

   shutil.rmtree(path) # eliminar carpeta y todo su contenido

   os.makedirs(path) # volver a crear la carpeta

   return {
      'success': True,
      'message': 'Archivos eliminados'
   }