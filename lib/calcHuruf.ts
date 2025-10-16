export type CalcResult = {
  cleaned: string;
  total: number;
  reduced: number;
};

export const nilaiHuruf: Record<string, number> = {
  "أ":0,"ا":1,"ب":2,"ت":22,"ث":14,"ج":3,"ح":8,
  "خ":6,"د":4,"ذ":52,"ر":38,"ز":7,"س":6,"ش":30,
  "ص":36,"ض":44,"ط":9,"ظ":36,"ع":16,"غ":28,"ف":26,
  "ق":46,"ك":20,"ل":30,"م":40,"ن":50,"و":0,"ه":5,
  "لا":31,"ء":0,"ي":0,"ة":0
};

// buang harakat & tatweel
const isHarakatOrTatweel = (cp: number) =>
  cp === 0x0640 || (cp >= 0x064B && cp <= 0x0652);

export const normalizeArabic = (s: string) => {
  const out: string[] = [];
  for (const ch of s) {
    const cp = ch.codePointAt(0)!;
    if (isHarakatOrTatweel(cp)) continue;
    out.push(ch);
  }
  let t = out.join("");
  // samakan bentuk alif & ligature
  t = t.replace(/ﻻ/g, "لا")  // lam-alif ligature
       .replace(/ٱ/g, "ا")   // alif wasla
       .replace(/آ/g, "ا")   // alif madda
       .replace(/إ/g, "ا");  // alif hamza below
  // pilihan: gugur partikel yg biasa
  t = t.replace(/\sبن\s/g, " ").replace(/\sبنت\s/g, " ");
  return t.trim();
};

export const reduceTo54 = (n: number) => (n > 54 ? (n % 54 || 54) : n);

/** Kira jumlah ikut peta + pasangan khas "لا" */
export function calculateName(raw: string): CalcResult {
  const cleaned = normalizeArabic(raw);
  let total = 0;

  for (let i = 0; i < cleaned.length; ) {
    const ch = cleaned[i];
    if (/\s|[ـ\-_'.,|/]/.test(ch)) { i++; continue; }

    // pasangan khas "لا"
    if (i + 1 < cleaned.length) {
      const two = cleaned.slice(i, i + 2);
      if (two === "لا") { total += (nilaiHuruf["لا"] ?? 0); i += 2; continue; }
    }

    total += (nilaiHuruf[ch] ?? 0);
    i++;
  }

  const reduced = reduceTo54(total);
  return { cleaned, total, reduced };
}
