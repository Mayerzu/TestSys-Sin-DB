const $reportsTotal = document.querySelector('#btn-generate-report span');
const $thead = document.querySelector('.box-table thead');
const $tbody = document.querySelector('.box-table tbody');
const $tooltip = document.querySelector('.tooltip');

export let reportIdsToGenerate = [];

$reportsTotal.innerHTML = `(${reportIdsToGenerate.length})`;

export function renderExcelTable($tableBox, data) {
   $reportsTotal.innerHTML = `(${data.length})`;
   $thead.innerHTML = '';
   $tbody.innerHTML = '';

   if (data.length <= 0) return;

   const orderedkeys = ['evaluation_date', 'default_email', 'name', 'user_email', 'phone', 'age', 'birth_date', 'careers', 'scores'];
   const tooltipExcludeKeys = ['evaluation_date', 'phone', 'age', 'birth_date'];

   let tbody = '';
   let thead = `
      <tr>
         <th>
            <label class="custom-checkbox">
               <input type="checkbox" id="all-items" />
               <span></span>
            </label>
         </th>
         <th>Fecha de evaluación</th>
         <th>Dirección de correo electrónico</th>
         <th>Nombre</th>
         <th>Correo electrónico</th>
         <th>Teléfono</th>
         <th>Edad</th>
         <th>Fecha de nacimiento</th>
         <th>Marque 3 carreras</th>
   `;

   if (data[0].hasOwnProperty('scores')) {
      const scores = data[0]['scores'];

      for (const area in scores) {
         thead += `<th>${scores[area].area_name}</th>`;
      }
   }

   thead += '</tr>';

   data.forEach(user => {
      tbody += `
         <tr>
            <td>
               <label class="custom-checkbox">
                  <input type="checkbox" id="${user.index}" class="item-selected" />
                  <span></span>
               </label>
            </td>
      `;

      orderedkeys.forEach(key => {
         if (!user.hasOwnProperty(key)) return;

         if (key !== 'scores' && key !== 'careers') tbody += `
            <td
               ondblclick="window.location.href='/excel-report/${user.index}';"
               class="${user[key] !== '' && !tooltipExcludeKeys.includes(key) ? 'tooltip-text' : ''}"
               >
               ${user[key]}
            </td>
         `;

         if (key === 'careers') tbody += `
            <td
               ondblclick="window.location.href='/excel-report/${user.index}';"
               class="${user[key] !== '' ? 'tooltip-text' : ''}"
               >
               ${user[key]}
            </td>
         `;

         if (key === 'scores') {
            const scores = user['scores'];

            for (const area in scores) {
               tbody += `
                  <td
                     ondblclick="window.location.href='/excel-report/${user.index}';"
                     class="score"
                     >
                     ${scores[area].score}
                  </td>
               `;
            }
         }
      });

      tbody += '</tr>';
   });

   $thead.innerHTML = thead;
   $tbody.innerHTML = tbody;
   
   $tableBox.classList.remove('hidden');

   document.querySelectorAll('.tooltip-text').forEach(element => {
      element.addEventListener('mouseover', () => {
         $tooltip.innerHTML = element.innerHTML;
         $tooltip.classList.remove('hidden');
      });

      element.addEventListener('mouseout', () => {
         $tooltip.innerHTML = '';
         $tooltip.classList.add('hidden');
      });
   });

   $tooltip.style.bottom = $tableBox.offsetHeight + 20 + 1 + 'px'; // 20 = main padding

   let ids = new Set();
   const $allItems = document.querySelector('#all-items');
   const $inputs = document.querySelectorAll('.item-selected');

   function updateAllItemsCheckbox() {
      const total = data.length;
      const selected = ids.size;

      if (selected === 0) {
         $allItems.checked = false;
         $allItems.indeterminate = false;
      } else if (selected === total) {
         $allItems.checked = true;
         $allItems.indeterminate = false;
      } else {
         $allItems.checked = false;
         $allItems.indeterminate = true;
      }

      reportIdsToGenerate = Array.from(ids);
      $reportsTotal.innerHTML = `(${reportIdsToGenerate.length})`;
   }

   $allItems.addEventListener('click', () => {
      const isChecked = $allItems.checked;

      $inputs.forEach($input => {
         $input.checked = isChecked;
         const index = parseInt($input.id);

         if (isChecked) {
            ids.add(index);
         } else {
            ids.delete(index);
         }
      });

      updateAllItemsCheckbox();
   });

   $inputs.forEach($input => {
      const index = parseInt($input.id);
      $input.checked = true;
      ids.add(index);

      $input.addEventListener('click', function () {
         if (this.checked) {
            ids.add(index);
         } else {
            ids.delete(index);
         }

         updateAllItemsCheckbox();
      });
   });

   updateAllItemsCheckbox();
}