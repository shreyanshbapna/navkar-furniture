import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    const 
    // Process the user data
    console.log(body);
    return NextResponse.json(
        { message: "User data received successfully" }
    );
}