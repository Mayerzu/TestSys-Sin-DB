export function getCurrentDate() {
   const date = new Date();
   const day = String(date.getDate()).padStart(2, '0');
   const month = String(date.getMonth() + 1).padStart(2, '0');
   const year = date.getFullYear();
   const formatedDate = `${day}/${month}/${year}`;
   return formatedDate;
}

export function getNormalCurrentDate() {
   const date = new Date();
   const yeary = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, '0');
   const day = String(date.getDate()).padStart(2, '0');
   const formatedDate = `${yeary}-${month}-${day}`;
   return formatedDate;
}