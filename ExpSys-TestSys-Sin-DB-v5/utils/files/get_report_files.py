from utils.files.get_file_list import get_file_list
from utils.files.file_config import APP_FOLDERS
from utils.files.download_filtered_files import download_filtered_files
from utils.replace_accents import replace_accents

def get_report_files(filetype, value, docs_folder, pdfs_folder):
   filetype = filetype.lower()
   
   if filetype == 'word':
      folder = APP_FOLDERS[docs_folder]
      extension = '.docx'
      data = get_file_list(folder, extension)
   
   if filetype == 'pdf':
      folder = APP_FOLDERS[pdfs_folder]
      extension = '.pdf'
      data = get_file_list(folder, extension)

   files = data['files']
   filtered_files = []
   buffer = None

   if value != '':
      value = replace_accents(value.lower())

      for file in files:
         name = replace_accents(file['name'].lower())
         filename = replace_accents(file['file'].split('.')[0].lower())

         if value in name or value in filename:
            filtered_files.append(file)

      data['files'] = filtered_files
      data['total'] = len(filtered_files)
   
      buffer = download_filtered_files(extension, folder, data['files'])
   
   # Para convertir los archivos a pdf
   folders = { 
      'input_folder': docs_folder, 
      'output_folder': pdfs_folder 
   }

   return data, folders, buffer