import Bookings from "@/app/models/Bookings";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const bookingData = body.bookingData;
        await Bookings.create(bookingData);
        return NextResponse.json({ "msg": "success" })
    }
    catch (error) {
        return NextResponse.json({ "msg": error })
    }
}

// export async function GET() {
//     try {
//         const bookings = await Bookings.find(); // Use .find() with no arguments to get all documents
//         return NextResponse.json(bookings); // Send the bookings back as JSON
//     } catch (error) {
//         return NextResponse.json({ "msg": error.message }); // Send back the error message
//     }
// }