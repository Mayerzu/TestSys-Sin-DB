const $initialView = document.getElementById('initial-view');
const $dropArea = document.getElementById('drop-area');
const $fileTrigger = document.getElementById('file-trigger');
const $fileInput = document.getElementById('file-input');
const $fileView = document.getElementById('file-view');
const $fileName = document.getElementById('file-name');
const $fileSize = document.getElementById('file-size');

const $btnUpload = document.querySelector('.btn-upload');
const $btnChange = document.getElementById('btn-change-upload');
const $btnInfo = document.getElementById('btn-info');

const $modalBox = document.querySelector('.modal-box');
const $modalText = document.querySelector('.modal-box .modal-text');

const $boxTitle = document.querySelector('.box-title');
const $subText = document.querySelector('.subtext');
const $loader = document.querySelector('.loader');

const page = document.querySelector('body').dataset.page;
let uploadedFile = null;

// Estilo visual al arrastrar
['dragenter', 'dragover'].forEach(eventName => {
   $dropArea.addEventListener(eventName, e => {
      e.preventDefault();
      $dropArea.classList.add('highlight');
   });
});

// Quitar estilo al salir
['dragleave', 'drop'].forEach(eventName => {
   $dropArea.addEventListener(eventName, () => {
      $dropArea.classList.remove('highlight');
   });
});

// Drop
$dropArea.addEventListener('drop', e => {
   e.preventDefault();
   const file = e.dataTransfer.files[0];
   handleFile(file);
});

$fileTrigger.addEventListener('click', e => {
   e.preventDefault();
   $fileInput.click();
});

$fileInput.addEventListener('change', () => {
   const file = $fileInput.files[0];
   handleFile(file);
});

function handleFile(file) {
   if (!file) return;
   if (!page) return alert('Página inválida');

   let extension = null, validExtension = null;
   uploadedFile = file;

   if (page === 'upload-word') {
      extension = '.docx';
      validExtension = /\.docx$/i.test(file.name);
   }

   if (page === 'upload-excel') {
      extension = '.xlsx';
      validExtension = /\.xlsx$/i.test(file.name);
   }

   if (!extension) return alert('Archivo inválido');
   if (!validExtension) return alert(`Archivo inválido. Asegúrate que sea ${extension}`);

   if (page === 'upload-word') {
      const maxSize = 10 * 1024 * 1024;

      if (!validExtension || file.size > maxSize) {
         alert("Archivo inválido. Asegúrate que sea .docx y no exceda los 10MB");
         return;
      }
   }

   // Mostrar vista de archivo subido
   $boxTitle.style.marginBottom = 20 + 'px';
   $subText.classList.add('hidden');
   $initialView.classList.add('hidden');
   $fileView.classList.remove('hidden');

   // Actualizar nombre y tamaño
   $fileName.textContent = file.name;
   $fileSize.textContent = (file.size / (1024 * 1024)).toFixed(2) + " MB";
}

async function uploadFile() {
   if (!uploadedFile || uploadedFile == null) return alert('No se ha subido un archivo');

   let filetype = 'word';

   if (page === 'upload-excel') {
      filetype = 'excel';
      $loader.classList.remove('hidden');
   }

   const formData = new FormData();
   formData.append('file', uploadedFile);
   formData.append('filetype', filetype);

   try {
      const response = await fetch('/upload', {
         method: 'POST',
         body: formData,
      });

      const data = await response.json();
      if (data && $loader) $loader.classList.add('hidden');
      if (!data.success) data.message = 'Error al subir el archivo: \n' + data.message;

      setTimeout(() => {
         alert(data.message);

         if (data.success) {
            uploadReset();
            if (page === 'upload-excel') window.location.href = '/excel-preview';
         }
      }, 300);
   } catch (err) {
      console.error(err);
   }
}

function uploadReset() {
   $boxTitle.style.marginBottom = 10 + 'px';
   $subText.classList.remove('hidden');
   $initialView.classList.remove('hidden');
   $fileView.classList.add('hidden');
}

function set$ModalText() {
   if (window.innerWidth <= 700) {
      $modalText.innerHTML = 'Plantilla de Informe - Ejemplo';
   }
   else {
      $modalText.innerHTML = 'Ejemplo de la estructura que debe tener la plantilla del informe';
   }
}

$btnInfo && $btnInfo.addEventListener('click', () => $modalBox.classList.remove('hidden'));
$btnChange.addEventListener('click', () => $fileTrigger.click());
$btnUpload.addEventListener('click', uploadFile);

if (page === 'upload-word') {
   window.addEventListener('DOMContentLoaded', set$ModalText);
   window.addEventListener('resize', set$ModalText);
}