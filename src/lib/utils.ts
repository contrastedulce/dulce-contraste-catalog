import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'PEN') {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function safeNum(val: any): number {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
}

// Resuelve el color de un profesor/author desde la configuración
export function getProfessorColor(author: string | null | undefined, professorColors?: { name: string; color: string }[]): string | null {
  if (!author || !professorColors || professorColors.length === 0) return null;
  const norm = (s: string) => s.toLowerCase().trim().replace(/\s+/g, ' ');
  const match = professorColors.find(p => {
    const pn = norm(p.name);
    const an = norm(author);
    return pn.includes(an) || an.includes(pn);
  });
  return match ? match.color : null;
}

// Iniciales del profesor para el avatar (ej: "María Gracia Mujica (MGM)" -> "MG")
export function getProfessorInitials(author: string | null | undefined): string {
  if (!author) return '';
  const sinParentesis = author.replace(/\([^)]*\)/g, '').trim();
  const palabras = sinParentesis.split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return '';
  if (palabras.length === 1) return palabras[0].substring(0, 2).toUpperCase();
  return (palabras[0][0] + palabras[1][0]).toUpperCase();
}

// Nombre corto del profesor para mostrar en la etiqueta
export function getProfessorShortName(author: string | null | undefined): string {
  if (!author) return '';
  const entreParentesis = author.match(/\(([^)]+)\)/);
  if (entreParentesis) return entreParentesis[1].trim();
  const palabras = author.trim().split(/\s+/).filter(Boolean);
  return palabras[0] || author.trim();
}
