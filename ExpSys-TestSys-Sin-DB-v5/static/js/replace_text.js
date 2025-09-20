export function replaceText(textToReplace, htmlElement) {
   let text = htmlElement.innerHTML;

   textToReplace.forEach(word => {
      // Usamos RegExp para reemplazar todas las coincidencias (case-sensitive)
      const regex = RegExp(`([\\'"”]?\\b${word}\\b[\\'"”]?)`);
      // const regex = new RegExp(`\\b(${word})\\b`, 'g'); // replace only words
      text = text.replace(regex, '<strong>$1</strong>');
   });

   htmlElement.innerHTML = text;
}