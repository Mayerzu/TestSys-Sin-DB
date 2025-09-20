import os

def get_path(name1, name2):
   return os.path.join(name1, name2)

UPLOAD_FOLDER = 'uploads'

DOCS_FOLDER = get_path(UPLOAD_FOLDER, 'docs')
PDFS_FOLDER = get_path(UPLOAD_FOLDER, 'pdfs')

EXCEL_TEST_PATH = get_path(UPLOAD_FOLDER, 'Test.xlsx')
EXCEL_TEST_COLUMNS = 138

REPORT_PATH = get_path(UPLOAD_FOLDER, 'Informe.docx')

APP_FOLDERS = {
   'docs': DOCS_FOLDER,
   'pdfs': PDFS_FOLDER,
}

def file_config():
   os.makedirs(UPLOAD_FOLDER, exist_ok=True)
   os.makedirs(DOCS_FOLDER, exist_ok=True)
   os.makedirs(PDFS_FOLDER, exist_ok=True)