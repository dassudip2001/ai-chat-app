import { NextResponse } from "next/server";

//req is short for request
export async function GET() {
  return NextResponse.json(
    { message: "Server is Running..........." },
    { status: 200 }
  );
}
