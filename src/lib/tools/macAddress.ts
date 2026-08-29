import macAddress from "mac-address";

/* ==================================================
   TYPES
================================================== */

export type MACAddressResult = {
  input: string;
  normalized: string;
  colonFormat: string;
  hyphenFormat: string;
  dotFormat: string;
  compactFormat: string;

  type: "Unicast" | "Multicast";
  administration:
    | "Universally Administered"
    | "Locally Administered";

  binary: string;
  oui: string;
  deviceIdentifier: string;
};

/* ==================================================
   NORMALIZE INPUT
================================================== */

function normalizeInput(input: string): string {
  return input
    .trim()
    .replace(/[-:.]/g, "")
    .toLowerCase();
}

/* ==================================================
   VALIDATE MAC
================================================== */

function validateMAC(input: string): void {
  const normalized = normalizeInput(input);

  if (!normalized) {
    throw new Error(
      "MAC Address wajib diisi.",
    );
  }

  if (!/^[0-9a-f]{12}$/.test(normalized)) {
    throw new Error(
      "Format MAC Address tidak valid. Gunakan 12 digit hexadecimal.",
    );
  }
}

/* ==================================================
   FORMAT MAC
================================================== */

function formatColon(
  normalized: string,
): string {
  return normalized.match(/.{2}/g)!.join(":");
}

function formatHyphen(
  normalized: string,
): string {
  return normalized.match(/.{2}/g)!.join("-");
}

function formatDot(
  normalized: string,
): string {
  return normalized.match(/.{4}/g)!.join(".");
}

/* ==================================================
   BINARY
================================================== */

function toBinary(
  normalized: string,
): string {
  return normalized
    .match(/.{2}/g)!
    .map((octet) =>
      parseInt(octet, 16)
        .toString(2)
        .padStart(8, "0"),
    )
    .join(" ");
}

/* ==================================================
   ADDRESS TYPE
================================================== */

function getAddressType(
  normalized: string,
): MACAddressResult["type"] {
  const firstOctet = parseInt(
    normalized.slice(0, 2),
    16,
  );

  /*
   * Bit paling rendah dari octet pertama:
   *
   * 0 = Unicast
   * 1 = Multicast
   */
  return (firstOctet & 1) === 1
    ? "Multicast"
    : "Unicast";
}

/* ==================================================
   ADMINISTRATION TYPE
================================================== */

function getAdministrationType(
  normalized: string,
): MACAddressResult["administration"] {
  const firstOctet = parseInt(
    normalized.slice(0, 2),
    16,
  );

  /*
   * Bit kedua dari kanan:
   *
   * 0 = Universally Administered
   * 1 = Locally Administered
   */
  return (firstOctet & 2) === 2
    ? "Locally Administered"
    : "Universally Administered";
}

/* ==================================================
   CALCULATE MAC
================================================== */

export function calculateMACAddress(
  input: string,
): MACAddressResult {
  validateMAC(input);

  const normalized =
    normalizeInput(input);

  /*
   * Gunakan library mac-address
   * untuk memastikan format MAC
   * benar-benar dapat diparse.
   */
  let buffer: Buffer;

  try {
    buffer =
      macAddress.toBuffer(
        formatColon(normalized),
      );
  } catch {
    throw new Error(
      "MAC Address tidak dapat diproses.",
    );
  }

  const colonFormat =
    macAddress.toString(buffer);

  const hyphenFormat =
    formatHyphen(normalized);

  const dotFormat =
    formatDot(normalized);

  const compactFormat =
    normalized.toUpperCase();

  const oui =
    normalized
      .slice(0, 6)
      .match(/.{2}/g)!
      .join(":")
      .toUpperCase();

  const deviceIdentifier =
    normalized
      .slice(6)
      .match(/.{2}/g)!
      .join(":")
      .toUpperCase();

  return {
    input,

    normalized:
      normalized.toUpperCase(),

    colonFormat:
      colonFormat.toUpperCase(),

    hyphenFormat:
      hyphenFormat.toUpperCase(),

    dotFormat:
      dotFormat.toUpperCase(),

    compactFormat,

    type:
      getAddressType(normalized),

    administration:
      getAdministrationType(
        normalized,
      ),

    binary:
      toBinary(normalized),

    oui,

    deviceIdentifier,
  };
}