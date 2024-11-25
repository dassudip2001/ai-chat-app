import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";

// prisma client
const prisma = new PrismaClient();

// initialize the model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY! || "");

// get all the messages
export async function GET() {
  try {
    const messages = await prisma.chat.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// post a message
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userInput } = body;
  console.log(userInput);

  if (!userInput) {
    return NextResponse.json(
      { message: "Please provide a message" },
      { status: 400 }
    );
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent(userInput);

    if (!response || !response.response) {
      return NextResponse.json(
        { message: "Invalid response from Generative AI" },
        { status: 500 }
      );
    }

    const botReply = response.response.text(); // Ensure this matches the SDK's response structure.

    // Optionally save to the database
    await prisma.chat.create({
      data: {
        userInput,
        botReply,
      },
    });

    return NextResponse.json({ userInput, message: botReply }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
