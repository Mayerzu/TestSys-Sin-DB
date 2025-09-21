from flask import Flask, request, render_template, redirect, url_for, send_file
from imports import *
import os

HOST = '127.0.0.1'
PORT = 5001

ALLOWED_EXTENSIONS = { 'docx', 'xlsx', 'xls' }

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = 'clave_secreta'

file_config()
get_excel_data()

filtered_files_to_download = None

def allowed_file(filename):
   return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def redirectTo(route):
   return redirect(url_for(route))

@app.route('/', methods=['GET'])
def index():
   return redirectTo('home')

@app.route('/home', methods=['GET', 'POST'])
def home():
   return render_template('home.html')

@app.route('/upload', methods=['POST'])
def upload():
   return upload_file(request, allowed_file)

@app.route('/upload-word', methods=['GET'])
def upload_word():
   return render_template('upload_word.html')

@app.route('/upload-excel', methods=['GET'])
def upload_excel():
   return render_template('upload_excel.html')

@app.route('/excel-preview', methods=['GET', 'POST'])
def excel_preview():
   if not os.path.exists(EXCEL_TEST_PATH): 
      return render_template('excel_message.html', message='Sube un archivo excel con los datos del test')
   if request.method == 'POST':
      params = request.get_json()
      return excel_search_engine(params)
   return render_template('excel_preview.html')

@app.route('/excel-reports', methods=['GET', 'POST'])
def excel_report_docs():
   global filtered_files_to_download
   data = {}; folders = { 'input_folder': 'docs', 'output_folder': 'pdfs' }
   if request.method == 'POST':
      params = request.get_json()
      filetype = params.get('filetype').strip()
      value = params.get('value').strip()
      data, folders, buffer = get_report_files(filetype, value, 'docs', 'pdfs')
      filtered_files_to_download = buffer
      return data
   return render_template('reports.html', data=data, folders=folders, download_name='Informes')

@app.route('/excel-report/<int:id>', methods=['GET', 'POST'])
def excel_report(id):
   data = get_excel_report(id)
   return render_template('report.html', data=data, folder='docs')

@app.route('/download/<folder>/<filename>')
def download(folder, filename):
   _folder = f'{UPLOAD_FOLDER}/{folder}'
   path = os.path.join(_folder, filename) 
   if not os.path.exists(path):
      return "<h1>Archivo no encontrado.</h1>", 404
   return send_file(path, as_attachment=True)

@app.route('/download-all/<folder>/<filetype>')
def download_all(folder, filetype):
   buffer = download_files(folder)
   download_name = f'Informes ({filetype}).zip'
   return send_file(
      buffer,
      as_attachment=True,
      download_name=download_name,
      mimetype='application/zip'
   )

@app.route('/download-filtered-files/<filetype>')
def download_filtered_files(filetype):
   buffer = filtered_files_to_download
   download_name=f'Informes filtrados ({filetype}).zip'
   if not buffer:return f"""
      <div style="{div_styles}">
         <p style="{p_styles}">No hay archivos filtrados para descargar</p>
         <a style="{a_styles}" href="/excel-reports">Volver</a>
      </div>
   """
   return send_file(
      buffer,
      as_attachment=True,
      download_name=download_name,
      mimetype='application/zip'
   )

@app.route('/generate-report', methods=['POST'])
def report_generator():
   params = request.get_json()
   data = params.get('user')
   folder = params.get('folder')
   return generate_report(data, APP_FOLDERS[folder], 'Informe generado correctamente')

@app.route('/generate-report-excel', methods=['POST'])
def generate_report_excel():
   params = request.get_json()
   report_ids = params.get('report_ids')
   return generate_report_from_excel(report_ids)

@app.route('/pdf-conversion', methods=['POST'])
def pdf_conversion():
   return generate_pdf(request.get_json())

@app.route('/convert-to-pdf', methods=['POST'])
def convert_to_pdf():
   data = request.get_json()
   folders = data.get('folders')
   file = data.get('file')
   return pdf_converter(folders, file)

@app.route('/remove-files', methods=['POST'])
def remove_files():
   data = request.get_json()
   folder = data.get('folder')
   return delete_files(folder)

@app.route('/remove-file', methods=['POST'])
def remove_file():
   data = request.get_json()
   folder = data.get('folder')
   file = data.get('file')
   return delete_file(folder, file)

if __name__ == '__main__':
   app.run(debug=True, host=HOST, port=PORT)