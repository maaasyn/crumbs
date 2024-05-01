export function keccakHashResolver(keccak: string): string {
  if (
    keccak ===
    "0x903618ee4423de6b15c1c05aaa9e60457558a25fef1e8620436245656021e3a7"
  ) {
    return "freedom at all costs";
  } else {
    return keccak;
  }
}
