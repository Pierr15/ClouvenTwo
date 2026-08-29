/* ==================================================
   BINARY CALCULATOR
   CLOEV Tools v1.0

   STEP 7.1  Service
   STEP 7.2  Validation
   STEP 7.3  IPv4 → Binary
   STEP 7.4  Binary → IPv4
   STEP 7.8  Octet visualization data
================================================== */


/* ==================================================
   TYPES
================================================== */

export type BinaryOctet = {
  position: number;
  decimal: number;
  binary: string;
  bits: number[];
};

export type BinaryCalculatorResult = {
  input: string;

  ip: string;
  binary: string;

  decimalOctets: number[];
  binaryOctets: string[];

  octets: BinaryOctet[];

  version: "IPv4";
};


/* ==================================================
   DECIMAL → 8-BIT BINARY
================================================== */

function decimalToBinary(
  value: number,
): string {
  return value
    .toString(2)
    .padStart(8, "0");
}


/* ==================================================
   BINARY → DECIMAL
================================================== */

function binaryToDecimal(
  value: string,
): number {
  return parseInt(value, 2);
}


/* ==================================================
   BINARY → BITS
================================================== */

function binaryToBits(
  value: string,
): number[] {
  return value
    .split("")
    .map(Number);
}


/* ==================================================
   VALIDATE DECIMAL IPV4
================================================== */

function validateIPv4(
  input: string,
): number[] {
  const value = input.trim();

  if (!value) {
    throw new Error(
      "IPv4 address wajib diisi.",
    );
  }

  const octets = value.split(".");

  /* -----------------------------------------------
     JUMLAH OKTET
  ------------------------------------------------ */

  if (octets.length !== 4) {
    throw new Error(
      "IPv4 harus terdiri dari 4 oktet.",
    );
  }

  /* -----------------------------------------------
     VALIDASI SETIAP OKTET
  ------------------------------------------------ */

  const numbers = octets.map(
    (octet, index) => {
      if (!/^\d+$/.test(octet)) {
        throw new Error(
          `Oktet ${index + 1} harus berupa angka.`,
        );
      }

      const number = Number(octet);

      if (
        !Number.isInteger(number) ||
        number < 0 ||
        number > 255
      ) {
        throw new Error(
          `Oktet ${index + 1} harus berada di antara 0 sampai 255.`,
        );
      }

      return number;
    },
  );

  return numbers;
}


/* ==================================================
   VALIDATE BINARY IPV4
================================================== */

function validateBinaryIPv4(
  input: string,
): string[] {
  const value = input.trim();

  if (!value) {
    throw new Error(
      "Binary IPv4 wajib diisi.",
    );
  }

  const octets = value.split(".");

  /* -----------------------------------------------
     JUMLAH OKTET
  ------------------------------------------------ */

  if (octets.length !== 4) {
    throw new Error(
      "Binary IPv4 harus terdiri dari 4 oktet.",
    );
  }

  /* -----------------------------------------------
     VALIDASI 8 BIT
  ------------------------------------------------ */

  octets.forEach(
    (octet, index) => {
      if (!/^[01]{8}$/.test(octet)) {
        throw new Error(
          `Oktet binary ${index + 1} harus terdiri dari tepat 8 bit (0 atau 1).`,
        );
      }
    },
  );

  return octets;
}


/* ==================================================
   BUILD OCTET DATA
================================================== */

function buildOctets(
  decimalOctets: number[],
  binaryOctets: string[],
): BinaryOctet[] {
  return decimalOctets.map(
    (decimal, index) => {
      const binary =
        binaryOctets[index];

      return {
        position: index + 1,

        decimal,

        binary,

        bits:
          binaryToBits(binary),
      };
    },
  );
}


/* ==================================================
   BUILD RESULT
================================================== */

function buildResult(
  input: string,
  decimalOctets: number[],
  binaryOctets: string[],
): BinaryCalculatorResult {
  return {
    input,

    ip: decimalOctets.join("."),

    binary:
      binaryOctets.join("."),

    decimalOctets,

    binaryOctets,

    octets:
      buildOctets(
        decimalOctets,
        binaryOctets,
      ),

    version: "IPv4",
  };
}


/* ==================================================
   STEP 7.3
   IPV4 → BINARY
================================================== */

export function ipv4ToBinary(
  input: string,
): BinaryCalculatorResult {
  const value = input.trim();

  const decimalOctets =
    validateIPv4(value);

  const binaryOctets =
    decimalOctets.map(
      decimalToBinary,
    );

  return buildResult(
    value,
    decimalOctets,
    binaryOctets,
  );
}


/* ==================================================
   STEP 7.4
   BINARY → IPV4
================================================== */

export function binaryToIPv4(
  input: string,
): BinaryCalculatorResult {
  const value = input.trim();

  const binaryOctets =
    validateBinaryIPv4(value);

  const decimalOctets =
    binaryOctets.map(
      binaryToDecimal,
    );

  return buildResult(
    value,
    decimalOctets,
    binaryOctets,
  );
}


/* ==================================================
   AUTO DETECTION
================================================== */

/**
 * Mendeteksi jenis input secara otomatis.
 *
 * IPv4:
 * 192.168.1.10
 *
 * Binary:
 * 11000000.10101000.00000001.00001010
 */

export function calculateBinary(
  input: string,
): BinaryCalculatorResult {
  const value = input.trim();

  if (!value) {
    throw new Error(
      "Input wajib diisi.",
    );
  }

  /*
   * Jika semua karakter terdiri dari
   * 0, 1, dan titik serta memiliki
   * 4 oktet berisi 8 bit → binary.
   */

  const binaryPattern =
    /^(?:[01]{8}\.){3}[01]{8}$/;

  if (binaryPattern.test(value)) {
    return binaryToIPv4(value);
  }

  /*
   * Selain itu diperlakukan
   * sebagai IPv4 decimal.
   */

  return ipv4ToBinary(value);
}