import os

def delete_file(folder, file):
   try:
      file_path = os.path.join(folder.strip(), file.strip())

      if not os.path.exists(file_path):  return {
         'success': False,
         'message': 'El archivo no existe'
      }

      os.remove(file_path)

      return {
         'success': True,
         'message': 'Archivo eliminado'
      }
   except Exception as e:
      return {
         'success': True,
         'message': f'Error al eliminar archivo: {e}'
      }