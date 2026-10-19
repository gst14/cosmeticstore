/* ============ CONFIGURACIÓN ============
   Los valores propios de cada tienda vienen de variables de entorno (ver .env.example).
   Ojo: las variables VITE_* quedan dentro del bundle público, no pongas secretos acá.
   VITE_SHEET_CSV_URL: en Google Sheets → Archivo → Compartir → Publicar en la web → elegir la hoja → CSV.
   Si queda vacío, o si falla la carga, se usan los productos de ejemplo (src/data/sample.csv). */
const env = import.meta.env;

export const CONFIG = {
  SHEET_CSV_URL: env.VITE_SHEET_CSV_URL || "",
  WHATSAPP: env.VITE_WHATSAPP || "", // código de país + área + número, sin + ni espacios
  STORE_NAME: env.VITE_STORE_NAME || "Rubor",
  CURRENCY: "ARS",
  LOW_STOCK: 10,
};
