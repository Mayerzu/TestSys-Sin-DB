import { getCurrentDate } from './get_current_date.js';
import { menuIcon } from './icons/menu_icon.js';

const $searchInput = document.querySelector('#input-search');

export function handleMenu(selectorId) {
   const $label = document.getElementById(selectorId);
   const $input = $label.querySelector("input");
   const $menuBox = $label.nextElementSibling;
   const $menu = $menuBox.querySelector('ul');
   const menuBorder = parseFloat(getComputedStyle($menu).borderWidth.replace(/[^\d.]/g, ''));

   if (!$input || !$menuBox) return;

   const newWidth = $label.offsetWidth + 30 + 20; // 30 = li padding
   $label.style.width = newWidth + "px"; // 20 = label padding
   $menuBox.style.width = newWidth + "px";
   $menu.style.width = newWidth + "px";

   const toggle = () => {
      if ($input.checked) {
         $menuBox.style.height = $menu.offsetHeight + menuBorder + "px";
      } else {
         $menuBox.style.height = 0;
      }
   }

   toggle();
   $input.addEventListener("click", toggle);

   let filter_type = 'name';

   /* CERRAR MENU AL CLIQUEAR UN ITEM */
   $menuBox.addEventListener('click', (e) => {
      if (e.target.nodeName === 'LI') {
         const filter = e.target.dataset.filter.trim();
         const text = e.target.textContent.trim();
         $searchInput.dataset.filter = filter;
         $searchInput.placeholder = `Buscar por ${text.toLowerCase()}...`;

         filter_type = filter.toLowerCase();
         // const date = getCurrentDate().split('/');

         if (filter_type === 'date') {
            $searchInput.value = '';
            // $searchInput.placeholder = `${getCurrentDate()} -> Sólo números (${date.join('')})`;
            $searchInput.placeholder = getCurrentDate();
         }

         $label.innerHTML = text + menuIcon;
         $label.appendChild($input);
         $label.click();
      }
   });

   // let isDeleting = false;

   // $searchInput.addEventListener('keydown', (e) => {
   //    if (e.key === 'Backspace') {
   //       isDeleting = true;
   //    }
   //    else {
   //       isDeleting = false;
   //    }
   // });

   $searchInput.addEventListener('input', function () {
      let value = this.value.trim();

      if (filter_type === 'date') {
         // value = value.replace(/\D/g, '');

         // if (isDeleting) return;

         // if (value.length >= 2 && value.length < 4) {
         //    value = value.slice(0, 2) + '/' + value.slice(2);
         // }
         // else if (value.length === 4) {
         //    value = value.slice(0, 2) + '/' + value.slice(2) + '/';
         // }
         // else if (value.length > 4) {
         //    value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 8);
         // }

         value = value.replace(/[^\d\/]/g, '');
         if (value.length > 10) value = value.slice(0, 10);
         this.value = value;
      }
   });

   document.addEventListener('click', () => $input.checked && $label.click());
}