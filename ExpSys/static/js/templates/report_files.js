import { wordFileIcon } from '../icons/word_file_icon.js';
import { pdfFileIcon } from '../icons/pdf_file_icon.js';
import { fileDeleteIcon } from '../icons/file_delete_icon.js';
import { downloadIcon } from '../icons/download_icon.js';
import { getFiles } from '../reports.js';

const $ulWords = document.querySelector('#word-files ul');
const $ulPdfs = document.querySelector('#pdf-files ul');
const $totalWords = document.querySelector('#word-files h2');
const $totalPdfs = document.querySelector('#pdf-files h2');
const $loader = document.querySelector('.loader');

async function convertToPdf(folders, file) {
   $loader.classList.remove('hidden');

   const resp = await fetch('/convert-to-pdf', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({ folders, file })
   })

   const data = await resp.json();
   if (data) $loader.classList.add('hidden');
   setTimeout(() => { alert(data.message); }, 300);
   return data;
}

async function deleteFile(folder, file) {
   const resp = await fetch('/remove-file', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({ folder, file })
   })

   const data = await resp.json();
   alert(data.message);
   return data;
}

export function renderFiles(data, fileType) {
   let folder = folders.input_folder;
   let $filesTotal = $totalWords;
   let idSelector = '#word-files'
   let icon = wordFileIcon;
   let $ul = $ulWords;

   if (data.filetype.toLowerCase() === 'pdf') {
      folder = folders.output_folder;
      $filesTotal = $totalPdfs;
      idSelector = '#pdf-files'
      icon = pdfFileIcon;
      $ul = $ulPdfs;
   }

   const filetype = data.filetype;
   const $message = $ul.closest('.files-box').querySelector('.message');

   $filesTotal.innerHTML = `${filetype} (${data.files.length})`;
   $ul.innerHTML = '';

   if (data.files.length <= 0) {
      $message.innerHTML = 'No hay informes';
      $message.classList.remove('hidden');
      return;
   }

   let files = '';

   data.files.forEach(doc => {
      files += `
         <li>
            ${icon}
            <div class="file-info" data-file="${doc.file}" title="${doc.name}">
               <p>${doc.name}</p>
               <span>${doc.date}</span>
            </div>
            
            <div class="files-icons">
               <a
                  href="/download/${folder}/${doc.file}"
                  target="_blank"
               >
                  ${downloadIcon}
               </a>
               <button
                  data-folder="${data.folder}"
                  data-file="${doc.file}"
                  class="btn-delete-file"
                  type="button"
               >
                  ${fileDeleteIcon}
               </button>
            </div>
         </li>
      `;
   });

   $ul.innerHTML = files;
   $message.classList.add('hidden');

   const buttons = document.querySelectorAll(`${idSelector} .btn-delete-file`);

   buttons.forEach(btn => btn.addEventListener('click', () => {
      const folder = btn.dataset.folder;
      const file = btn.dataset.file;
      deleteFile(folder, file)
         .then(resp => resp.success && getFiles(fileType, ''))
         .catch(err => alert(err));
   }));

   if (fileType === 'word') {
      const allFiles = document.querySelectorAll('#word-files .file-info');

      allFiles.forEach(_file => _file.addEventListener('dblclick', () => {
         const file = _file.dataset.file;
         convertToPdf(folders, file);
      }));
   }
}