import Room from "@/app/models/Rooms";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const rooms = await Room.find();
        return NextResponse.json(rooms);
    } catch (error) {
        return NextResponse.json({ "msg": error.message });
    }
}