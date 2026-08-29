/* ==================================================
   IP VALIDATOR
   CLOEV Network Tools
================================================== */

/* ==================================================
   TYPES
================================================== */

export type IPAddressType =
  | "Private"
  | "Public"
  | "Loopback"
  | "Link-local"
  | "Multicast"
  | "Unspecified"
  | "Limited Broadcast"
  | "Reserved";

export type IPValidatorResult = {
  input: string;
  ipAddress: string;
  version: "IPv4";
  valid: boolean;

  cidr: number | null;
  subnetMask: string | null;

  addressType: IPAddressType;
  ipClass: string;

  binary: string;
  octets: number[];
};

/* ==================================================
   IPV4 → BINARY
================================================== */

function ipv4ToBinary(
  octets: number[],
): string {
  return octets
    .map((octet) =>
      octet
        .toString(2)
        .padStart(8, "0"),
    )
    .join(".");
}

/* ==================================================
   CIDR → SUBNET MASK
================================================== */

function cidrToSubnetMask(
  cidr: number,
): string {
  const octets: number[] = [];

  for (
    let index = 0;
    index < 4;
    index += 1
  ) {
    const remaining =
      cidr - index * 8;

    if (remaining >= 8) {
      octets.push(255);
    } else if (remaining <= 0) {
      octets.push(0);
    } else {
      octets.push(
        256 -
          Math.pow(
            2,
            8 - remaining,
          ),
      );
    }
  }

  return octets.join(".");
}

/* ==================================================
   VALIDATE CIDR
================================================== */

function parseCIDR(
  value: string,
): {
  ip: string;
  cidr: number | null;
} {
  const parts = value.split("/");

  if (parts.length > 2) {
    throw new Error(
      "Format CIDR tidak valid.",
    );
  }

  const ip = parts[0].trim();

  if (!ip) {
    throw new Error(
      "Alamat IPv4 wajib diisi.",
    );
  }

  if (parts.length === 1) {
    return {
      ip,
      cidr: null,
    };
  }

  const prefix = Number(
    parts[1],
  );

  if (
    !Number.isInteger(prefix) ||
    prefix < 0 ||
    prefix > 32
  ) {
    throw new Error(
      "Prefix CIDR harus berada di antara /0 sampai /32.",
    );
  }

  return {
    ip,
    cidr: prefix,
  };
}

/* ==================================================
   VALIDATE IPV4
================================================== */

function parseIPv4(
  ip: string,
): number[] {
  const octets = ip.split(".");

  if (octets.length !== 4) {
    throw new Error(
      "IPv4 harus memiliki 4 octet.",
    );
  }

  const numbers = octets.map(
    (octet) => {
      if (
        octet === "" ||
        !/^\d+$/.test(octet)
      ) {
        throw new Error(
          "Setiap octet IPv4 harus berupa angka.",
        );
      }

      const value = Number(
        octet,
      );

      if (
        value < 0 ||
        value > 255
      ) {
        throw new Error(
          "Setiap octet IPv4 harus berada di antara 0 sampai 255.",
        );
      }

      return value;
    },
  );

  return numbers;
}

/* ==================================================
   ADDRESS TYPE
================================================== */

function getAddressType(
  octets: number[],
): IPAddressType {
  const [a, b] = octets;

  /*
   * 0.0.0.0
   */
  if (
    a === 0 &&
    b === 0 &&
    octets[2] === 0 &&
    octets[3] === 0
  ) {
    return "Unspecified";
  }

  /*
   * 255.255.255.255
   */
  if (
    a === 255 &&
    b === 255 &&
    octets[2] === 255 &&
    octets[3] === 255
  ) {
    return "Limited Broadcast";
  }

  /*
   * 127.0.0.0/8
   */
  if (a === 127) {
    return "Loopback";
  }

  /*
   * 10.0.0.0/8
   */
  if (a === 10) {
    return "Private";
  }

  /*
   * 172.16.0.0/12
   */
  if (
    a === 172 &&
    b >= 16 &&
    b <= 31
  ) {
    return "Private";
  }

  /*
   * 192.168.0.0/16
   */
  if (
    a === 192 &&
    b === 168
  ) {
    return "Private";
  }

  /*
   * 169.254.0.0/16
   */
  if (
    a === 169 &&
    b === 254
  ) {
    return "Link-local";
  }

  /*
   * 224.0.0.0/4
   */
  if (
    a >= 224 &&
    a <= 239
  ) {
    return "Multicast";
  }

  /*
   * Reserved / experimental
   * 240.0.0.0/4
   */
  if (a >= 240) {
    return "Reserved";
  }

  return "Public";
}

/* ==================================================
   IP CLASS
================================================== */

function getIPClass(
  firstOctet: number,
): string {
  if (
    firstOctet >= 1 &&
    firstOctet <= 126
  ) {
    return "A";
  }

  if (
    firstOctet >= 128 &&
    firstOctet <= 191
  ) {
    return "B";
  }

  if (
    firstOctet >= 192 &&
    firstOctet <= 223
  ) {
    return "C";
  }

  if (
    firstOctet >= 224 &&
    firstOctet <= 239
  ) {
    return "D";
  }

  if (
    firstOctet >= 240 &&
    firstOctet <= 255
  ) {
    return "E";
  }

  return "Reserved";
}

/* ==================================================
   MAIN VALIDATOR
================================================== */

export function validateIPAddress(
  input: string,
): IPValidatorResult {
  const value = input.trim();

  if (!value) {
    throw new Error(
      "Alamat IPv4 wajib diisi.",
    );
  }

  /*
   * Parse CIDR
   */
  const {
    ip,
    cidr,
  } = parseCIDR(value);

  /*
   * Parse IPv4
   */
  const octets =
    parseIPv4(ip);

  /*
   * Binary
   */
  const binary =
    ipv4ToBinary(octets);

  /*
   * Address type
   */
  const addressType =
    getAddressType(octets);

  /*
   * IP class
   */
  const ipClass =
    getIPClass(octets[0]);

  /*
   * Subnet mask
   */
  const subnetMask =
    cidr !== null
      ? cidrToSubnetMask(cidr)
      : null;

  return {
    input: value,

    ipAddress: ip,

    version: "IPv4",

    valid: true,

    cidr,

    subnetMask,

    addressType,

    ipClass,

    binary,

    octets,
  };
}