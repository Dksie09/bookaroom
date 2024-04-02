const { default: Rooms } = require("../(models)/Rooms");
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const roomData = body.roomData;
        await Rooms.create(roomData);
        return NextResponse.json({ "msg": "success" })
    }
    catch (error) {
        return NextResponse.json({ "msg": error })
    }
}