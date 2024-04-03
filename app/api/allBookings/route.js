import Bookings from "@/app/models/Bookings";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const bookings = await Bookings.find(); // Use .find() with no arguments to get all documents
        return NextResponse.json(bookings); // Send the bookings back as JSON
    } catch (error) {
        return NextResponse.json({ "msg": error.message }); // Send back the error message
    }
}