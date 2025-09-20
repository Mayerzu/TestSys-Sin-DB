import { renderFiles } from './templates/report_files.js';
import { getNormalCurrentDate } from './get_current_date.js';
import { rightArrowIcon } from './icons/right_arrow_icon.js';

const $searchInput = document.getElementById('search-input');

const $inputs = document.querySelectorAll('input[type="radio"]');
const $btnConvert = document.getElementById(`btn-convert`);
const $btnSearch = document.getElementById('btn-search');

const $wordFiles = document.getElementById('word-files');
const $pdfFiles = document.getElementById('pdf-files');

const $btnDeleteWords = document.querySelector('#word-files .btn-delete-files');
const $btnDeletePdfs = document.querySelector('#pdf-files .btn-delete-files');
const $btnIconDeleteWords = document.querySelector('#word-files .btn-delete-icon');
const $btnIconDeletePdfs = document.querySelector('#pdf-files .btn-delete-icon');

const $btnDownloadAllWords = document.querySelector('#word-files #btn-download-all-words');
const $btnDownloadAllPdfs = document.querySelector('#pdf-files #btn-download-all-pdfs');
const $btnDownloadFilteredWords = document.querySelector('#word-files #btn-download-filtered-words');
const $btnDownloadFilteredPdfs = document.querySelector('#pdf-files #btn-download-filtered-pdfs');

const $loader = document.querySelector('.loader');
const $infoMessage = document.getElementById('info-message');
const $infoIncon = document.querySelector('.info-icon');

const $wordModal = $wordFiles.querySelector('.modal-box');
const $wordSection = $wordFiles.querySelector('section');
$wordFiles.querySelector('.modal-box .text').innerHTML = '¿Seguro que quieres eliminar todos los archivos word?';

const $pdfModal = $pdfFiles.querySelector('.modal-box');
const $pdfSection = $pdfFiles.querySelector('section');
$pdfFiles.querySelector('.modal-box .text').innerHTML = '¿Seguro que quieres eliminar todos los archivos pdf?';

const styles = {
   searchInput: {
      border: '2px solid #2d99ff',
   },
   btnConvert: {
      background: '#007fff',
      opacity: 'rgba(0, 127, 255, 0.5)',
      hoverBg: 'rgb(7, 95, 217)'
   }
}

$infoMessage.classList.add('hidden');
$pdfFiles.classList.add('hidden');
$btnDownloadFilteredWords.classList.add('hidden');
$btnDownloadFilteredPdfs.classList.add('hidden');

$searchInput.addEventListener('focus', () => {
   $searchInput.style.borderTop = styles.searchInput.border;
   $searchInput.style.borderBottom = styles.searchInput.border;
});

$searchInput.addEventListener('blur', () => {
   if ($searchInput.value.trim() !== '') {
      $searchInput.style.borderTop = styles.searchInput.border;
      $searchInput.style.borderBottom = styles.searchInput.border;
   }
   else {
      $searchInput.style.border = 0;
   }
});

$infoIncon.addEventListener('mouseover', () => $infoMessage.classList.remove('hidden'));
$infoIncon.addEventListener('mouseout', () => $infoMessage.classList.add('hidden'));

$btnConvert.addEventListener('mouseover', () => {
   if (fileType === 'word' && !$btnConvert.disabled) $btnConvert.style.background = styles.btnConvert.hoverBg;
});

$btnConvert.addEventListener('mouseout', () => {
   if (!$btnConvert.disabled) $btnConvert.style.background = styles.btnConvert.background;
});

document.getElementById('info-message').innerHTML = `
   Puedes buscar informes por:
   
   <span>
      📌 Fecha y nombre ${rightArrowIcon} ${getNormalCurrentDate()}_kenia...
   </span>
   <span>
      📌 Fecha ${rightArrowIcon} ${getNormalCurrentDate()}
   </span>
   <span>
      📌 Nombre ${rightArrowIcon} kenia...
   </span>
   <span>
      📌 Mes ${rightArrowIcon} ${getNormalCurrentDate().slice(0, 7)}
   </span>
   <span>
      📌 Año ${rightArrowIcon} ${getNormalCurrentDate().slice(0, 4)}
   </span>
`;

let fileType = 'word';

function setButtons(data, fileType, value) {
   if (data.length > 0) {
      if (fileType === 'word') {
         $btnConvert.disabled = false;
         $btnConvert.style.background = styles.btnConvert.background;
         $btnIconDeleteWords.classList.remove('hidden');
         $wordSection.classList.remove('hidden');
      }

      $btnIconDeletePdfs.classList.remove('hidden');
      $pdfSection.classList.remove('hidden');
   } else {
      if (fileType === 'word') {
         $btnConvert.disabled = true;
         $btnConvert.style.background = styles.btnConvert.opacity;
         $btnIconDeleteWords.classList.add('hidden');
         $wordSection.classList.add('hidden');
      }

      $btnIconDeletePdfs.classList.add('hidden');
      $pdfSection.classList.add('hidden');
   }

   if (fileType === 'pdf') {
      $btnDownloadAllPdfs.classList.remove('hidden');
      $btnDownloadFilteredPdfs.classList.add('hidden');
      if (value === '') return;
      $btnDownloadAllPdfs.classList.add('hidden');
      $btnDownloadFilteredPdfs.classList.remove('hidden');
   }
   else {
      $btnDownloadAllWords.classList.remove('hidden');
      $btnDownloadFilteredWords.classList.add('hidden');
      if (value === '') return;
      $btnDownloadAllWords.classList.add('hidden');
      $btnDownloadFilteredWords.classList.remove('hidden');
   }
}

async function deleteFiles(folder) {
   const response = await fetch('remove-files', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({ folder })
   });

   const data = await response.json();
   alert(data.message);

   if (fileType === 'pdf') {
      $pdfModal.classList.add('hidden');
   }
   else {
      $wordModal.classList.add('hidden');
   }

   if (data.success) {
      getFiles(fileType, '');

      if (fileType === 'pdf') {
         $btnConvert.disabled = true;
         $btnConvert.style.background = styles.btnConvert.opacity;
      }
   }
}

async function convertAllToPDF() {
   if (!$btnConvert) return;
   if ($btnConvert.disabled) return;

   $loader.classList.remove('hidden');

   try {
      const response = await fetch('/pdf-conversion', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(folders)
      });

      const data = await response.json();
      if (data) $loader.classList.add('hidden');
      setTimeout(() => { alert(data.message) }, 300);
   } catch (err) {
      console.error(err);
   }
}

export async function getFiles(fileType, value) {
   $loader.classList.remove('hidden');

   const response = await fetch('/excel-reports', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({ filetype: fileType, value: value })
   });

   const data = await response.json();
   if (data) $loader.classList.add('hidden');
   setButtons(data.files, fileType, value);
   renderFiles(data, fileType);
}

getFiles('word', '');
getFiles('pdf', '');

$inputs.forEach(input => {
   input.addEventListener('click', () => {
      const type = input.getAttribute('data-type');
      fileType = type;

      if (type === 'pdf') {
         $pdfFiles.classList.remove('hidden');
         $wordFiles.classList.add('hidden');
         getFiles('pdf', '');
         if (!$btnConvert) return;
         $btnConvert.disabled = true;
         $btnConvert.style.background = styles.btnConvert.opacity;
      }
      else {
         $wordFiles.classList.remove('hidden');
         $pdfFiles.classList.add('hidden');
         getFiles('word', '');
         if (!$btnConvert) return;
         $btnConvert.disabled = false;
         $btnConvert.style.backgroundColor = styles.btnConvert.background;
      }
   })
});

let isFocus = false;
$searchInput.addEventListener('focus', () => { isFocus = true });
$searchInput.addEventListener('blur', () => { isFocus = false });

$btnConvert && $btnConvert.addEventListener('click', convertAllToPDF);

// ELIMINAR ARCHIVOS
$btnDeleteWords && $btnDeleteWords.addEventListener('click', () => deleteFiles(folders.input_folder));
$btnDeletePdfs && $btnDeletePdfs.addEventListener('click', () => deleteFiles(folders.output_folder));

$btnSearch.addEventListener('click', () => {
   let value = $searchInput.value.trim();
   getFiles(fileType, value);
});

document.addEventListener('keydown', (e) => {
   if (e.key === 'Enter' && isFocus) {
      let value = $searchInput.value.trim();
      getFiles(fileType, value);
   }
});