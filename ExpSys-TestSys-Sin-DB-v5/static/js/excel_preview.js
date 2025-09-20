import { renderExcelTable, reportIdsToGenerate } from './templates/excel_table.js';
import { horizontalSlider } from './horizontal_slider.js';
import { getCurrentDate } from './get_current_date.js';
import { redirectTo } from './redirect_to.js';
import { handleMenu } from './menu.js';

const $btnGenerateReport = document.getElementById('btn-generate-report');
const $searchInput = document.getElementById('input-search');
const $btnSearch = document.getElementById('btn-search');
const $tableBox = document.querySelector('.box-table');
const $message = document.querySelector('.message');
const $loader = document.querySelector('.loader');
let searchInputIsFocus = false;

$tableBox.classList.add('hidden');
$message.classList.add('hidden');

async function generateReports() {
   if (reportIdsToGenerate.length <= 0)
      return alert('Por favor, selecciona al menos un registro.');

   $loader.classList.remove('hidden');

   try {
      const resp = await fetch('/generate-report-excel', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({ report_ids: reportIdsToGenerate })
      });

      const data = await resp.json();
      if (data) $loader.classList.add('hidden');

      if (data.status === 'error') return setTimeout(() => {
         alert(data.message + '. Sube la plantilla del informe.');
      }, 300);

      if (data.success) setTimeout(() => {
         const ok = confirm('Informes generados, ¿Quieres verlos?');
         ok && redirectTo('excel-reports');
      }, 300);

      if (data.status === 'exists') setTimeout(() => {
         const ok = confirm('Los informes ya fueron generados, ¿Quieres verlos?');
         ok && redirectTo('excel-reports');
      }, 300);
   } catch (err) {
      console.error(err);
   }
}

async function getExcelData() {
   const isValidDate = /^\d{2}\/\d{2}\/\d{4}$/.test($searchInput.value.trim());
   const dateErrorMessage = `La fecha debe tener el siguente formato ${getCurrentDate()}`;

   // if (
   //    $searchInput.dataset.filter === 'date' &&
   //    $searchInput.value.trim() !== '' && !isValidDate
   // ) return alert(dateErrorMessage);

   $loader.classList.remove('hidden');
   $message.classList.add('hidden');
   $tableBox.classList.add('hidden');

   const value = $searchInput.value.trim();
   const filter = $searchInput.dataset.filter.trim();

   try {
      const response = await fetch('/excel-preview', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({ value, filter })
      });

      const data = await response.json();
      if (data) $loader.classList.add('hidden');
      renderExcelTable($tableBox, data);

      if (data.length > 0) {
         $btnGenerateReport.classList.remove('hidden');
         $message.classList.add('hidden');
      }
      else {
         $btnGenerateReport.classList.add('hidden');
         $message.classList.remove('hidden');
      }
   } catch (err) {
      console.error(err);
   }
}

$btnGenerateReport.addEventListener('click', generateReports);
$btnSearch.addEventListener('click', getExcelData);

$searchInput.addEventListener('focus', () => { searchInputIsFocus = true });
$searchInput.addEventListener('blur', () => { searchInputIsFocus = false });

$searchInput.addEventListener('focus', () => {
   $searchInput.style.borderTop = '2px solid #2d99ff';
   $searchInput.style.borderBottom = '2px solid #2d99ff';
});

$searchInput.addEventListener('blur', () => {
   $searchInput.value.trim() !== '' ?
      ($searchInput.style.borderTop = '2px solid #2d99ff',
         $searchInput.style.borderBottom = '2px solid #2d99ff') :
      $searchInput.style.border = 0;
});

document.addEventListener('keydown', function (e) {
   if (searchInputIsFocus && e.key === 'Enter') getExcelData();
});

$tableBox.addEventListener('mousedown', (e) => {
   if (e.target.tagName !== 'SPAN') e.target.style.cursor = 'grab';
});

$tableBox.addEventListener('mouseup', (e) => { e.target.style.cursor = 'default'; });

window.addEventListener('DOMContentLoaded', () => {
   getExcelData();
   handleMenu('menu-label');
   horizontalSlider($tableBox); // TABLE SCROLL
});