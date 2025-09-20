import io
import zipfile
import os

def download_filtered_files(extension, folder, files):
   # Crear archivo ZIP en memoria
   buffer = io.BytesIO()

   with zipfile.ZipFile(buffer, 'w') as zipf:
      for doc in files:
         file = doc['file']
         if file.endswith(extension):
            path = os.path.join(folder, file)
            zipf.write(path, arcname=file)

   buffer.seek(0)

   return buffer