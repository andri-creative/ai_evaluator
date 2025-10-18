import fs from "fs";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PDFParse } = require("pdf-parse");

/**
 * Parse file PDF menjadi teks (kompatibel dengan pdf-parse v2)
 */
export async function parsePdf(filePath: string): Promise<string> {
  console.log("🔍 Membaca file:", filePath);

  if (!fs.existsSync(filePath)) {
    throw new Error(`❌ File tidak ditemukan: ${filePath}`);
  }

  const buffer = fs.readFileSync(filePath);

  // gunakan API baru
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();

  // selalu pastikan parser ditutup
  await parser.destroy();

  const text = result.text.trim();
  console.log("📄 Hasil extract (50 chars):", text.slice(0, 50));

  if (!text) {
    throw new Error(
      "⚠️ PDF kosong atau tidak bisa dibaca (kemungkinan hasil scan gambar)"
    );
  }

  return text;
}
