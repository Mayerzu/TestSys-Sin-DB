import { $name, $evaluationDate, $age, $phone, $email, $areas, $careers } from './report_edit.js';
import { getCurrentDate } from './get_current_date.js';
import { checkIcon } from './icons/check_icon.js';

const $areaTags = document.querySelector('#fortress .tags');
const $skill1 = document.querySelector('#skill-1 p');
const $skill2 = document.querySelector('#skill-2 p');
const $skill3 = document.querySelector('#skill-3 p');
const $recommendations = document.getElementById('recommendations-box');

$areas.value = data.areas.replaceAll(', ', ',\n');
$careers.value = data.careers.replaceAll(', ', ',\n');

$areas.addEventListener('change', () => {
   if (!$areas.value.trim().includes(',')) $areas.value += ',';

   const splitAreas = $areas.value.split(',').map(area => area.trim());
   const area1 = splitAreas[0];
   const area2 = splitAreas[1];
   const area3 = splitAreas[2];

   const tagClass = {
      0: 'green',
      1: 'blue',
      2: 'orange'
   }

   $areaTags.innerHTML = '';

   splitAreas.forEach((area, index) => {
      if (area && area !== '' && index < 3) {
         $areaTags.innerHTML += `<span class="tag ${tagClass[index]}">${area}</span>`;
      }
   });

   if (area1 && area1 !== '') $skill1.innerHTML = area1;
   if (area2 && area2 !== '') $skill2.innerHTML = area2;
   if (area3 && area3 !== '') $skill3.innerHTML = area3;
});

$careers.addEventListener('change', () => {
   if (!$careers.value.trim().includes(',')) $careers.value += ',';

   const splitCareers = $careers.value.split(',').map(career => career.trim());
   $recommendations.innerHTML = '';

   splitCareers.forEach(career => {
      if (career && career !== '') {
         $recommendations.innerHTML += `
            <div>
               ${checkIcon}
               <p>${career}</p>
            </div>
         `;
      }
   });
});

function validations() {
   const isValidDate = /^\d{2}\/\d{2}\/\d{4}$/.test($evaluationDate.value.trim());
   const isValidEmail = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/.test($email.value.trim());
   const age = parseInt($age.value.trim());
   const isValidAreas = $areas.value.trim() !== '' && $areas.value.trim() !== ',' && $areas.value.trim().includes(',');
   const isValidCareers = $careers.value.trim() !== '' && $careers.value.trim() !== ',' && $careers.value.trim().includes(',');

   if ($name.value.length < 2) {
      alert('El nombre debe tener al menos 2 caracteres');
      return false;
   }

   if (!isValidDate) {
      alert(`La fecha de evaluación debe tener el siguente formato ${getCurrentDate()}`);
      return false;
   }

   if ($age.value.trim() === '' || (age < 0 || age > 120)) {
      alert('Edad no válida (entre 1 y 120)');
      return false;
   }

   if ($phone.value.length !== 8) {
      alert('El teléfono debe tener 8 dígitos');
      return false;
   }

   if (!isValidEmail) {
      alert('Correo electrónico no válido');
      return false;
   }

   if (!isValidAreas) {
      alert('Las áreas no pueden quedar vacias y deben estar separadas por una coma. Si es solo una área debe llevar una coma al final.');
      return false;
   }

   if (!isValidCareers) {
      alert('Las carreras no pueden quedar vacias y deben estar separadas por una coma. Si es solo una carrera debe llevar una coma al final.');
      return false;
   }

   return true;
}

async function generateReport() {
   const isValid = validations();
   if (!isValid) return;

   let areas = $areas.value.trim().replaceAll('\n', '');
   let careers = $careers.value.trim().replaceAll('\n', '');

   areas = areas.split(',').map(area => area.trim()).join(', ').trim();
   careers = careers.split(',').map(career => career.trim()).join(', ').trim();

   if (areas.endsWith(',')) areas = areas.slice(0, -1);
   if (careers.endsWith(',')) careers = careers.slice(0, -1);

   const user = {
      'nombre': $name.value.trim(),
      'edad': $age.value.trim(),
      'fecha': $evaluationDate.value.trim(),
      'telefono': $phone.value.trim(),
      'correo': $email.value.trim(),
      'areas': areas,
      'carreras': careers
   }

   try {
      const response = await fetch('/generate-report', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({ user, folder })
      });

      const resp_data = await response.json();

      if (resp_data.status === 'error') {
         alert(resp_data.message + '. Sube la plantilla del informe');
         return;
      }

      alert(resp_data.message);
   } catch (err) {
      console.error(err);
   }
}

const $btnGenerateReport = document.getElementById("btn-generate-report");
$btnGenerateReport && $btnGenerateReport.addEventListener('click', generateReport);