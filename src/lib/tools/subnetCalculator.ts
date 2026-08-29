import { Address4 } from "ip-address";

/* ==================================================
   TYPES
================================================== */

export type SubnetRange = {
  subnet: number;
  networkAddress: string;
  firstHost: string;
  lastHost: string;
  broadcastAddress: string;
  totalAddresses: number;
  usableHosts: number;
};

export type SubnetCalculatorResult = {
  input: string;

  networkAddress: string;
  originalPrefix: number;
  originalSubnetMask: string;

  newPrefix: number;
  newSubnetMask: string;

  totalSubnets: number;
  addressesPerSubnet: number;
  usableHostsPerSubnet: number;

  subnetIncrement: number;

  firstSubnet: string;
  lastSubnet: string;

  subnets: SubnetRange[];
};

/* ==================================================
   CIDR → SUBNET MASK
================================================== */

function cidrToSubnetMask(
  cidr: number,
): string {
  const octets: number[] = [];

  for (let index = 0; index < 4; index += 1) {
    const remaining = cidr - index * 8;

    if (remaining >= 8) {
      octets.push(255);
      continue;
    }

    if (remaining <= 0) {
      octets.push(0);
      continue;
    }

    octets.push(
      256 -
        Math.pow(
          2,
          8 - remaining,
        ),
    );
  }

  return octets.join(".");
}

/* ==================================================
   IPV4 → NUMBER
================================================== */

function ipv4ToNumber(
  ip: string,
): number {
  const octets = ip
    .split(".")
    .map(Number);

  return (
    octets[0] * 256 ** 3 +
    octets[1] * 256 ** 2 +
    octets[2] * 256 +
    octets[3]
  );
}

/* ==================================================
   NUMBER → IPV4
================================================== */

function numberToIPv4(
  value: number,
): string {
  const first =
    Math.floor(value / 256 ** 3) % 256;

  const second =
    Math.floor(value / 256 ** 2) % 256;

  const third =
    Math.floor(value / 256) % 256;

  const fourth =
    value % 256;

  return [
    first,
    second,
    third,
    fourth,
  ].join(".");
}

/* ==================================================
   HOST INFORMATION
================================================== */

function getHostInformation(
  networkNumber: number,
  broadcastNumber: number,
  prefix: number,
): {
  firstHost: string;
  lastHost: string;
  usableHosts: number;
} {
  if (prefix === 32) {
    const address =
      numberToIPv4(networkNumber);

    return {
      firstHost: address,
      lastHost: address,
      usableHosts: 1,
    };
  }

  if (prefix === 31) {
    return {
      firstHost:
        numberToIPv4(networkNumber),
      lastHost:
        numberToIPv4(broadcastNumber),
      usableHosts: 2,
    };
  }

  const totalAddresses =
    broadcastNumber -
    networkNumber +
    1;

  if (totalAddresses <= 2) {
    return {
      firstHost:
        numberToIPv4(networkNumber),
      lastHost:
        numberToIPv4(broadcastNumber),
      usableHosts: 0,
    };
  }

  return {
    firstHost:
      numberToIPv4(
        networkNumber + 1,
      ),
    lastHost:
      numberToIPv4(
        broadcastNumber - 1,
      ),
    usableHosts:
      totalAddresses - 2,
  };
}

/* ==================================================
   VALIDATE PREFIX
================================================== */

function validatePrefix(
  prefix: number,
): void {
  if (
    !Number.isInteger(prefix) ||
    prefix < 0 ||
    prefix > 32
  ) {
    throw new Error(
      "Prefix harus berada di antara /0 sampai /32.",
    );
  }
}

/* ==================================================
   CALCULATE SUBNET
================================================== */

export function calculateSubnets(
  input: string,
  newPrefix: number,
): SubnetCalculatorResult {
  const value = input.trim();

  /* -----------------------------------------------
     INPUT
  ------------------------------------------------ */

  if (!value) {
    throw new Error(
      "Network IPv4 wajib diisi.",
    );
  }

  validatePrefix(newPrefix);

  /* -----------------------------------------------
     PARSE CIDR
  ------------------------------------------------ */

  let address: Address4;

  try {
    address = new Address4(value);
  } catch {
    throw new Error(
      "Format IPv4/CIDR tidak valid.",
    );
  }

  const originalPrefix =
    address.subnetMask;

  /* -----------------------------------------------
     PREFIX CHECK
  ------------------------------------------------ */

  if (newPrefix < originalPrefix) {
    throw new Error(
      `Prefix subnet baru /${newPrefix} tidak boleh lebih kecil dari prefix network awal /${originalPrefix}.`,
    );
  }

  /* -----------------------------------------------
     NETWORK
  ------------------------------------------------ */

  const networkAddress =
    address.startAddress().address;

  const networkNumber =
    ipv4ToNumber(networkAddress);

  /* -----------------------------------------------
     SUBNET CALCULATION
  ------------------------------------------------ */

  const borrowedBits =
    newPrefix - originalPrefix;

  const totalSubnets =
    Math.pow(2, borrowedBits);

  const addressesPerSubnet =
    Math.pow(
      2,
      32 - newPrefix,
    );

  const usableHostsPerSubnet =
    newPrefix === 31
      ? 2
      : newPrefix === 32
        ? 1
        : Math.max(
            0,
            addressesPerSubnet - 2,
          );

  /* -----------------------------------------------
     SUBNET INCREMENT
  ------------------------------------------------ */

  const subnetIncrement =
    addressesPerSubnet;

  /* -----------------------------------------------
     BUILD SUBNET TABLE
  ------------------------------------------------ */

  const subnets: SubnetRange[] = [];

  /*
   * Untuk keamanan UI, kita tidak menghasilkan
   * jutaan baris sekaligus.
   *
   * Maximum 4096 subnet ditampilkan.
   */

  const maximumSubnets =
    Math.min(
      totalSubnets,
      4096,
    );

  for (
    let index = 0;
    index < maximumSubnets;
    index += 1
  ) {
    const subnetNetworkNumber =
      networkNumber +
      index *
        addressesPerSubnet;

    const subnetBroadcastNumber =
      subnetNetworkNumber +
      addressesPerSubnet -
      1;

    const hostInformation =
      getHostInformation(
        subnetNetworkNumber,
        subnetBroadcastNumber,
        newPrefix,
      );

    subnets.push({
      subnet: index + 1,

      networkAddress:
        numberToIPv4(
          subnetNetworkNumber,
        ),

      firstHost:
        hostInformation.firstHost,

      lastHost:
        hostInformation.lastHost,

      broadcastAddress:
        numberToIPv4(
          subnetBroadcastNumber,
        ),

      totalAddresses:
        addressesPerSubnet,

      usableHosts:
        hostInformation.usableHosts,
    });
  }

  /* -----------------------------------------------
     LAST SUBNET
  ------------------------------------------------ */

  const lastSubnetNumber =
    networkNumber +
    (totalSubnets - 1) *
      addressesPerSubnet;

  /* -----------------------------------------------
     RESULT
  ------------------------------------------------ */

  return {
    input: value,

    networkAddress,

    originalPrefix,

    originalSubnetMask:
      cidrToSubnetMask(
        originalPrefix,
      ),

    newPrefix,

    newSubnetMask:
      cidrToSubnetMask(
        newPrefix,
      ),

    totalSubnets,

    addressesPerSubnet,

    usableHostsPerSubnet,

    subnetIncrement,

    firstSubnet:
      subnets[0]?.networkAddress ??
      networkAddress,

    lastSubnet:
      numberToIPv4(
        lastSubnetNumber,
      ),

    subnets,
  };
}