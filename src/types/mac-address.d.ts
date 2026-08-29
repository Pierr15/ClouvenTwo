declare module "mac-address" {
  const macAddress: {
    toBuffer(mac: string): Buffer;
    toString(buffer: Buffer): string;
  };

  export default macAddress;
}