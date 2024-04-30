import { hashMediator } from "@/singletons";
import { keccak256, toHex } from "viem";
import { z } from "zod";

export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hash = searchParams.get("hash");
  const value = await hashMediator.getHash(hash!);
  if (value === null) {
    return new Response("Not found", { status: 404 });
  }
  return new Response(value);
}
export async function POST(request: Request) {
  const data = await request.json();

  const dataSchema = z.record(z.string());

  const validatedData = dataSchema.parse(data);

  const [key, value] = Object.entries(validatedData)[0];

  if (key === keccak256(toHex(value))) {
    await hashMediator.setHash(key, value);
    return new Response(key);
  }

  return new Response("Invalid hash", { status: 400 });
}
