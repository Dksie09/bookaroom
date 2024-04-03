import Bookings from "@/app/models/Bookings";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req) {
    try {
        if (!(req instanceof NextRequest)) {
            throw new Error("Request is not an instance of NextRequest");
        }
        const url = new URL(req.url);
        const roomId = url.searchParams.get("roomId");

        if (!roomId) {
            return new NextResponse(JSON.stringify({ "msg": "Room ID is required" }), { status: 400 });
        }

        const bookings = await Bookings.find({ roomId });

        if (!bookings.length) {
            return new NextResponse(JSON.stringify({ "msg": "No bookings found" }), { status: 404 });
        }

        return new NextResponse(JSON.stringify(bookings));
    } catch (error) {
        return new NextResponse(JSON.stringify({ "msg": error.message }), { status: 500 });
    }
}
