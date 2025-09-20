import { getNormalCurrentDate } from './get_current_date.js';

const $reportContainer = document.querySelector('.report-container');
const $reportTitle = document.getElementById('report-title');
const $btnEdit = document.getElementById('btn-edit-report');
const $btnEditAreas = document.getElementById('btn-edit-areas');
const $btnEditCareers = document.getElementById('btn-edit-careers');
const $modal = document.getElementById('modal');
const $boxAreas = document.getElementById('box-areas');
const $boxCareers = document.getElementById('box-careers');
const $inputs = document.querySelectorAll('input');

export const $name = document.getElementById('name');
export const $evaluationDate = document.getElementById('evaluation_date');
export const $age = document.getElementById('age');
export const $phone = document.getElementById('phone');
export const $email = document.getElementById('email');
export const $areas = document.getElementById('areas');
export const $careers = document.getElementById('careers');

const splitDate = getNormalCurrentDate().split('-');
const currentDate = `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`;

$evaluationDate.placeholder = `Fecha de evaluación (${currentDate})`;
$btnEditAreas.classList.add('hidden');
$btnEditCareers.classList.add('hidden');

function setEditionMode(mode) {
   if (mode === 'reading') {
      $name.removeAttribute('readonly');
      $evaluationDate.removeAttribute('readonly');
      $age.removeAttribute('readonly');
      $phone.removeAttribute('readonly');
      $email.removeAttribute('readonly');
      $btnEdit.style.backgroundColor = 'green';
      $btnEditAreas.classList.remove('hidden');
      $btnEditCareers.classList.remove('hidden');
      $inputs.forEach(input => input.style.borderBottom = '2px solid #3b82f6');
      return;
   }

   $name.setAttribute('readonly', true);
   $evaluationDate.setAttribute('readonly', true);
   $age.setAttribute('readonly', true);
   $phone.setAttribute('readonly', true);
   $email.setAttribute('readonly', true);
   $btnEdit.style.backgroundColor = 'blue';
   $btnEditAreas.classList.add('hidden');
   $btnEditCareers.classList.add('hidden');
   $inputs.forEach(input => input.style.borderBottom = 0);
}

$btnEdit && $btnEdit.addEventListener('click', () => {
   const mode = $reportContainer.dataset.mode;
   $reportContainer.dataset.mode = mode === 'reading' ? 'edition' : 'reading';
   setEditionMode(mode);
});

let isDeletingDate = false;

// VALIDATIONS
$name.addEventListener('input', () => {
   $name.value = $name.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
   $reportTitle.innerHTML = $name.value.trim();
});

$evaluationDate.addEventListener('keydown', (e) => {
   if (e.key === 'Backspace') {
      isDeletingDate = true;
   }
   else {
      isDeletingDate = false;
   }
});

$evaluationDate.addEventListener('input', () => {
   let value = $evaluationDate.value.trim();
   value = value.replace(/\D/g, '');

   if (isDeletingDate) return;

   if (value.length >= 2 && value.length < 4) {
      value = value.slice(0, 2) + '/' + value.slice(2);
   }
   else if (value.length === 4) {
      value = value.slice(0, 2) + '/' + value.slice(2) + '/';
   }
   else if (value.length > 4) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 8);
   }

   $evaluationDate.value = value;
});

$email.addEventListener('input', () => {
   $email.value = $email.value.replace(/[^a-zA-Z0-9@._+-]/g, '');
});

$age.addEventListener('input', () => {
   const value = $age.value;
   $age.value = value.replace(/\D/g, '');
   if (value.length > 0 && value[0] === '0') $age.value = value.slice(1);
   if (value.length > 3) $age.value = value.slice(0, 3);
});

$phone.addEventListener('input', () => {
   const value = $phone.value;
   $phone.value = value.replace(/\D/g, '');
   if (value.length > 8) $phone.value = value.slice(0, 8);
});

$areas.addEventListener('input', () => {
   $areas.value = $areas.value.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ\s\n\r,.-]/g, '')
});

$careers.addEventListener('input', () => {
   $careers.value = $careers.value.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ\s\n\r,.-]/g, '')
});

// MODAL
$btnEditAreas.addEventListener('click', () => {
   $modal.classList.remove('hidden');
   $boxAreas.classList.remove('hidden');
   $boxCareers.classList.add('hidden');
});

$btnEditCareers.addEventListener('click', () => {
   $modal.classList.remove('hidden');
   $boxCareers.classList.remove('hidden');
   $boxAreas.classList.add('hidden');
});