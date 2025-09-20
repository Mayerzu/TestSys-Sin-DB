from utils.get_formatted_date import get_formatted_date
from datetime import datetime
import os

def get_file_list(folder, extension):
   files = [
      {
         'file': f,
         'name': f.split('_')[1].split('.')[0],
         'date': get_formatted_date(f.split('_')[0]).strftime('%Y-%m-%d')
      }

      for f in os.listdir(folder) if f.endswith(extension)
   ]

   sorted_files = sorted(files, key=lambda x: datetime.strptime(x['date'], '%Y-%m-%d'), reverse=True)
   files = []

   for index, user in enumerate(sorted_files, start=1):
      user['index'] = index
      files.append(user)

   total = len(files)
   
   return { 
      'files': files, 
      'total': total,
      'folder': folder,
      'extension': extension,
      'filetype': 'WORD' if extension == '.docx' else 'PDF'
   }