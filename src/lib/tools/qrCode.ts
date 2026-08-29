import QRCode from "qrcode";

/* ==================================================
   TYPES
================================================== */

export type QRCodeResult = {
  input: string;
  dataUrl: string;
};

/* ==================================================
   VALIDATE INPUT
================================================== */

function validateInput(input: string): void {
  if (!input.trim()) {
    throw new Error(
      "Data QR Code wajib diisi.",
    );
  }
}

/* ==================================================
   GENERATE QR CODE
================================================== */

export async function generateQRCode(
  input: string,
): Promise<QRCodeResult> {
  const value = input.trim();

  validateInput(value);

  try {
    const dataUrl =
      await QRCode.toDataURL(value, {
        errorCorrectionLevel: "M",
        margin: 2,
        width: 320,
      });

    return {
      input: value,
      dataUrl,
    };
  } catch {
    throw new Error(
      "QR Code gagal dibuat.",
    );
  }
}