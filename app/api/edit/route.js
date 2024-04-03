import Bookings from "@/app/models/Bookings";
import { NextResponse } from "next/server";

export async function PATCH(req) {

    try {
        const body = await req.json();
        const { updatedBookingData, bookingId } = body;
        const booking = await Bookings.findById(bookingId);

        if (!booking) {
            return NextResponse.json({ "msg": "Booking not found" }, { status: 404 });
        }

        Object.assign(booking, updatedBookingData);
        await booking.save();
        return NextResponse.json({ "msg": "Booking updated successfully" });
    } catch (error) {
        return NextResponse.json({ "msg": error.message }, { status: 500 });
    }
}
