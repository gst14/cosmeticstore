import { CONFIG } from "../config.js";

/* ============ CSV ============ */
export const norm = (s) =>
  String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

export function parseCSV(text) {
  const rows = [];
  let row = [], f = "", q = false;
  text = text.replace(/^﻿/, "");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') {
        if (text[i + 1] === '"') { f += '"'; i++; } else q = false;
      } else f += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(f); f = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(f); rows.push(row); row = []; f = "";
    } else f += c;
  }
  if (f !== "" || row.length) { row.push(f); rows.push(row); }
  const head = (rows.shift() || []).map((h) => norm(h).replace(/\s+/g, "_"));
  return rows
    .filter((r) => r.some((v) => v.trim() !== ""))
    .map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] || "").trim()])));
}

function num(v) {
  let s = String(v || "").replace(/[^\d.,-]/g, "");
  if (!s) return null;
  if (s.includes(",") && s.includes(".")) s = s.replace(/\./g, "").replace(",", ".");
  else if (s.includes(",")) s = s.replace(",", ".");
  else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, "");
  const n = Number(s);
  return isFinite(n) ? n : null;
}
const yes = (v) => !["false", "no", "0", "falso", "n", ""].includes(norm(v));
const yesDefault = (v) => (v === "" || v == null ? true : yes(v));

export function toProduct(r) {
  const precio = num(r.precio), oferta = num(r.precio_oferta);
  const tonos = (r.tonos || "")
    .split(/[|;]/)
    .map((t) => t.trim())
    .filter((t) => /^#?[0-9a-f]{3,8}$/i.test(t))
    .map((t) => (t.startsWith("#") ? t : "#" + t));
  return {
    codigo: r.codigo, nombre: r.nombre, marca: r.marca || "", categoria: r.categoria || "Otros",
    precio, oferta: oferta && precio && oferta < precio ? oferta : null,
    contenido: r.contenido || "", tonos: tonos.length ? tonos : ["#E8B4B8"],
    descripcion: r.descripcion || "", imagen: r.imagen_url || "",
    stock: r.stock === "" || r.stock == null ? null : num(r.stock),
    activo: yesDefault(r.activo), destacado: yes(r.destacado), nuevo: yes(r.nuevo),
    _q: norm([r.nombre, r.marca, r.categoria, r.codigo, r.descripcion].join(" ")),
  };
}

/* ============ Precios ============ */
export const money = new Intl.NumberFormat("es-AR", {
  style: "currency", currency: CONFIG.CURRENCY, maximumFractionDigits: 0,
});
export const finalPrice = (p) => p.oferta ?? p.precio ?? 0;
export const pct = (p) => (p.oferta ? Math.round((1 - p.oferta / p.precio) * 100) : 0);

/* ============ Filtros y orden ============ */
export function applyFilters(list, f, skip) {
  const q = norm(f.q);
  return list.filter((p) =>
    (skip === "cat" || f.cat === "Todo" || p.categoria === f.cat) &&
    (skip === "brand" || !f.brands.size || f.brands.has(p.marca)) &&
    (!q || q.split(/\s+/).every((w) => p._q.includes(w))) &&
    (f.max == null || finalPrice(p) <= f.max) &&
    (!f.sale || p.oferta) && (!f.stock || p.stock !== 0) && (!f.nuevo || p.nuevo));
}

export function sortProducts(list, sort) {
  const l = [...list];
  if (sort === "precio-asc") l.sort((a, b) => finalPrice(a) - finalPrice(b));
  else if (sort === "precio-desc") l.sort((a, b) => finalPrice(b) - finalPrice(a));
  else if (sort === "nombre") l.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  else l.sort((a, b) => b.destacado - a.destacado || (a.stock === 0) - (b.stock === 0));
  return l;
}

/* ============ Carga de datos ============ */
export async function loadProducts(sampleCsv) {
  let rows = null, failed = false;
  if (CONFIG.SHEET_CSV_URL) {
    try {
      const r = await fetch(CONFIG.SHEET_CSV_URL, { cache: "no-store" });
      if (!r.ok) throw new Error(r.status);
      rows = parseCSV(await r.text());
      if (!rows.length) throw new Error("vacío");
    } catch {
      rows = null;
      failed = true;
    }
  }
  if (!rows) rows = parseCSV(sampleCsv.trim());
  const products = rows.map(toProduct).filter((p) => p.activo && p.codigo && p.nombre);
  const pmax = Math.ceil(Math.max(...products.map(finalPrice), 1000) / 1000) * 1000;
  return { products, pmax, failed };
}
