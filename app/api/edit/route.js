import Bookings from "@/app/models/Bookings";
import { NextResponse } from "next/server";

export async function PATCH(req) {
    console.log("PATCH request received"); // Debug: Log when a request is received

    try {
        const body = await req.json();
        console.log("Request body:", body); // Debug: Log the request body

        const { updatedBookingData, bookingId } = body;
        console.log(`Booking ID: ${bookingId}`, "Updated Data:", updatedBookingData); // Debug: Log the extracted variables

        const booking = await Bookings.findById(bookingId);
        console.log("Booking found:", booking); // Debug: Log the found booking (if any)

        if (!booking) {
            console.log("Booking not found, ID:", bookingId); // Debug: Log if booking not found
            return NextResponse.json({ "msg": "Booking not found" }, { status: 404 });
        }

        Object.assign(booking, updatedBookingData);
        await booking.save();
        console.log("Booking updated successfully"); // Debug: Log successful update

        return NextResponse.json({ "msg": "Booking updated successfully" });
    } catch (error) {
        console.error("Error in PATCH operation:", error); // Debug: Log any caught errors
        return NextResponse.json({ "msg": error.message }, { status: 500 });
    }
}
