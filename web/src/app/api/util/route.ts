import { keccak256, toHex } from "viem";

export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const valueToHash = searchParams.get("value-to-hash");

  if (valueToHash === null) {
    return new Response("Wrong input", { status: 400 });
  }

  return new Response(keccak256(toHex(valueToHash)));
}
