import { Address4 } from "ip-address";

export type IPAddressResult = {
  input: string;
  ip: string;
  cidr: number;
  subnetMask: string;
  networkAddress: string;
  broadcastAddress: string;
  firstUsableHost: string;
  lastUsableHost: string;
  totalAddresses: number;
  usableHosts: number;
  ipClass: "A" | "B" | "C" | "D" | "E";
  type: "Private" | "Public" | "Special";
  version: "IPv4";
};

/* ==================================================
   IP CLASS
================================================== */

function getIPClass(ip: string): IPAddressResult["ipClass"] {
  const firstOctet = Number(ip.split(".")[0]);

  if (firstOctet >= 1 && firstOctet <= 126) {
    return "A";
  }

  if (firstOctet >= 128 && firstOctet <= 191) {
    return "B";
  }

  if (firstOctet >= 192 && firstOctet <= 223) {
    return "C";
  }

  if (firstOctet >= 224 && firstOctet <= 239) {
    return "D";
  }

  return "E";
}

/* ==================================================
   PRIVATE IP
================================================== */

function isPrivateIPv4(ip: string): boolean {
  const octets = ip.split(".").map(Number);

  const first = octets[0];
  const second = octets[1];

  // 10.0.0.0/8
  if (first === 10) {
    return true;
  }

  // 172.16.0.0/12
  if (first === 172 && second >= 16 && second <= 31) {
    return true;
  }

  // 192.168.0.0/16
  if (first === 192 && second === 168) {
    return true;
  }

  return false;
}

/* ==================================================
   SPECIAL IP
================================================== */

function isSpecialIPv4(ip: string): boolean {
  const octets = ip.split(".").map(Number);

  const first = octets[0];
  const second = octets[1];
  const third = octets[2];
  const fourth = octets[3];

  // 0.0.0.0
  if (first === 0 && second === 0 && third === 0 && fourth === 0) {
    return true;
  }

  // Loopback 127.0.0.0/8
  if (first === 127) {
    return true;
  }

  // Link-local 169.254.0.0/16
  if (first === 169 && second === 254) {
    return true;
  }

  // Multicast 224.0.0.0/4
  if (first >= 224 && first <= 239) {
    return true;
  }

  // Broadcast
  if (first === 255 && second === 255 && third === 255 && fourth === 255) {
    return true;
  }

  return false;
}

/* ==================================================
   IP TYPE
================================================== */

function getAddressType(ip: string): IPAddressResult["type"] {
  if (isSpecialIPv4(ip)) {
    return "Special";
  }

  if (isPrivateIPv4(ip)) {
    return "Private";
  }

  return "Public";
}

/* ==================================================
   SUBNET MASK
================================================== */

function cidrToSubnetMask(cidr: number): string {
  const mask: number[] = [];

  for (let octet = 0; octet < 4; octet += 1) {
    const remaining = cidr - octet * 8;

    if (remaining >= 8) {
      mask.push(255);
      continue;
    }

    if (remaining <= 0) {
      mask.push(0);
      continue;
    }

    mask.push(256 - Math.pow(2, 8 - remaining));
  }

  return mask.join(".");
}

/* ==================================================
   IPV4 TO NUMBER
================================================== */

function ipv4ToNumber(ip: string): number {
  const octets = ip.split(".").map(Number);

  return (
    octets[0] * 256 ** 3 + octets[1] * 256 ** 2 + octets[2] * 256 + octets[3]
  );
}

/* ==================================================
   NUMBER TO IPV4
================================================== */

function numberToIPv4(value: number): string {
  const first = Math.floor(value / 256 ** 3) % 256;

  const second = Math.floor(value / 256 ** 2) % 256;

  const third = Math.floor(value / 256) % 256;

  const fourth = value % 256;

  return [first, second, third, fourth].join(".");
}

/* ==================================================
   HOST RANGE
================================================== */

function getHostRange(
  networkAddress: string,
  broadcastAddress: string,
  cidr: number,
): {
  first: string;
  last: string;
} {
  if (cidr === 32) {
    return {
      first: networkAddress,
      last: networkAddress,
    };
  }

  if (cidr === 31) {
    return {
      first: networkAddress,
      last: broadcastAddress,
    };
  }

  const networkNumber = ipv4ToNumber(networkAddress);

  const broadcastNumber = ipv4ToNumber(broadcastAddress);

  return {
    first: numberToIPv4(networkNumber + 1),
    last: numberToIPv4(broadcastNumber - 1),
  };
}

/* ==================================================
   USABLE HOSTS
================================================== */

function getUsableHosts(cidr: number, totalAddresses: number): number {
  // Point-to-point subnet
  if (cidr === 31) {
    return 2;
  }

  // Single address
  if (cidr === 32) {
    return 1;
  }

  if (totalAddresses <= 2) {
    return 0;
  }

  return totalAddresses - 2;
}

/* ==================================================
   CALCULATE IPV4
================================================== */

export function calculateIPv4(input: string): IPAddressResult {
  const value = input.trim();

  if (!value) {
    throw new Error("IP address tidak boleh kosong.");
  }

  let address: Address4;

  try {
    address = new Address4(value);
  } catch {
    throw new Error("Format IPv4 atau CIDR tidak valid.");
  }

  const ip = address.address;
  const cidr = address.subnetMask;

  const subnetMask = cidrToSubnetMask(cidr);

  const networkAddress = address.startAddress().address;

  const broadcastAddress = address.endAddress().address;

  const totalAddresses = Math.pow(2, 32 - cidr);

  const usableHosts = getUsableHosts(cidr, totalAddresses);

  const hostRange = getHostRange(networkAddress, broadcastAddress, cidr);

  return {
    input: value,
    ip,
    cidr,
    subnetMask,
    networkAddress,
    broadcastAddress,
    firstUsableHost: hostRange.first,
    lastUsableHost: hostRange.last,
    totalAddresses,
    usableHosts,
    ipClass: getIPClass(ip),
    type: getAddressType(ip),
    version: "IPv4",
  };
}
