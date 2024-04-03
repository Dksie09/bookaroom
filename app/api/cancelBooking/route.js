import Bookings from "@/app/models/Bookings";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const { bookingID, refundAmount } = body;

        const booking = await Bookings.findById(bookingID);
        if (!booking) {
            return NextResponse.json({ "msg": "Booking not found" }, { status: 404 });
        }

        booking.set({
            status: 'cancelled',
            price: refundAmount
        });
        await booking.save();

        return NextResponse.json({ "msg": "Booking cancelled successfully" });
    } catch (error) {
        return NextResponse.json({ "msg": error.message }, { status: 500 });
    }
}
