import QRCode from "qrcode";

export const generateQrCodeDataUrl = async (
  targetUrl: string,
): Promise<string> => {
  try {
    return QRCode.toDataURL(targetUrl, {
      errorCorrectionLevel: "H",
      type: "image/png",
      margin: 2,
      width: 300,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    });
  } catch (error) {
    throw new Error(
      `Failed to generate QR code visualization: ${(error as Error).message}`,
    );
  }
};
