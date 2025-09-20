export const horizontalSlider = ($container) => {
   const slider = $container;

   let click = false;
   let Xo; // coordenada inicial
   let scrollLeft;

   /*
      e.pageX: devuelve la coordenada (en X) donde damos click con el evento.

      .offsetLeff: espaciado entre el inicio del slider (a la izquierda) y el documento.

      .scrollLetf: cuantos pixeles hemos avanzado.
   */

   const press = (e) => {
      click = true;
      Xo = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
   }

   const move = (e) => {
      if (!click) return;
      const spaced = e.pageX - slider.offsetLeft;
      const distanceTraveled = spaced - Xo;
      slider.scrollLeft = scrollLeft - distanceTraveled;
   }

   const unpress = (e) => { click = false }

   slider.addEventListener('mousedown', press); // Cuando hacemos click con el mouse
   slider.addEventListener('mousemove', move); // Cuando se mueve el mouse manteniendo presionado
   slider.addEventListener('mouseup', unpress); // Cuando soltamos el click
}