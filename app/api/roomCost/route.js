import RoomTypes from "@/app/models/RoomTypes";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const rooms = await RoomTypes.find();
        return NextResponse.json(rooms);
    } catch (error) {
        return NextResponse.json({ "msg": error.message });
    }
}