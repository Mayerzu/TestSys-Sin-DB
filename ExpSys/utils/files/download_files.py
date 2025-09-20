from utils.files.file_config import APP_FOLDERS
import io
import zipfile
import os

def download_files(folder):
   extension = '.pdf' if folder == 'pdfs' else '.docx'
   _folder = APP_FOLDERS[folder]

   # Crear archivo ZIP en memoria
   buffer = io.BytesIO()

   with zipfile.ZipFile(buffer, 'w') as zipf:
      for file in os.listdir(_folder):
         if file.endswith(extension):
            path = os.path.join(_folder, file)
            zipf.write(path, arcname=file)

   buffer.seek(0)

   return buffer