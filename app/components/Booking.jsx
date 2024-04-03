"use client";

import React, { useEffect, useState } from 'react';
import axios from "axios";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


function Booking({ onNewBooking, allBookings, roomData, roomCostData }) {
    const [bookings, setBookings] = useState([]);
    const [price, setPrice] = useState(0);
    const [sameRoomData, setSameRoomData] = useState({});
    const [isConflict, setIsConflict] = useState(false);
    const [isFormIncomplete, setIsFormIncomplete] = useState(false);
    const [bookingData, setBookingData] = useState({
        roomId: "",
        userEmail: "",
        startTime: "",
        endTime: "",
        price: 0,
        status: "active",
    });

    useEffect(() => {

        if (bookingData.startTime && bookingData.endTime && bookingData.roomId) {
            calculatePrice(bookingData.startTime, bookingData.endTime, bookingData.roomId);
            checkBookingConflict(bookingData);
            if (isValidDateRange(bookingData.startTime, bookingData.endTime) == false) {
                setIsConflict(true);
            }
        }
    }, [bookingData.startTime, bookingData.endTime, bookingData.roomId]);

    useEffect(() => {

        setIsFormIncomplete(false);
        if (!bookingData.roomId || !bookingData.userEmail || !bookingData.startTime || !bookingData.endTime) {
            setIsFormIncomplete(true);
        }

    }, [bookingData.startTime, bookingData.endTime, bookingData.roomId, bookingData.userEmail]);



    useEffect(() => {
        console.log(allBookings);
        const fetchSameRooms = async () => {
            try {
                const sameRoomBookings = allBookings.filter(booking => booking.roomId === bookingData.roomId);
                console.log(sameRoomBookings);
                setSameRoomData(sameRoomBookings);
            } catch (error) {
                console.error("Error fetching same room bookings:", error);
            }
        }

        if (bookingData.roomId) {
            fetchSameRooms();
        }
    }, [bookingData.roomId]);

    const checkBookingConflict = (newBooking) => {
        console.log("called")

        if (sameRoomData.length === 0) {
            setIsConflict(false);
            return false;
        } else {

            try {
                for (const existingBooking of sameRoomData) {
                    if (existingBooking.status == "cancelled") {
                        continue;
                    }

                    const newBookingStart = new Date(newBooking.startTime)
                    const newBookingEnd = new Date(newBooking.endTime)
                    const existingBookingStart = new Date(existingBooking.startTime)
                    const existingBookingEnd = new Date(existingBooking.endTime)

                    console.log(newBookingStart, newBookingEnd, existingBooking)
                    if (
                        (newBookingStart >= existingBookingStart && newBookingStart <= existingBookingEnd) ||
                        (newBookingEnd > existingBookingStart && newBookingEnd <= existingBookingEnd) ||
                        (newBookingStart <= existingBookingStart && newBookingEnd >= existingBookingEnd)
                    ) {
                        setIsConflict(true);
                        return true;
                    }
                }
                setIsConflict(false);
                return false;
            } catch (err) {
                console.log(err)
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookingData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const isValidDateRange = (startTime, endTime) => {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const now = new Date();
        const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        return start >= currentDate && start < end;
    };


    const calculatePrice = (startTime, endTime, roomID) => {
        const room = roomData.find(r => r.roomNumber === roomID);
        const roomCost = roomCostData.find(rc => rc.typeName === room.typeId);
        const hourlyRate = roomCost ? roomCost.pricePerHour : 0;
        const start = new Date(startTime);
        const end = new Date(endTime);
        const durationInHours = (end - start) / (1000 * 60 * 60);
        const price = Math.round(durationInHours * hourlyRate);
        setPrice(price);
        return price;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidDateRange(bookingData.startTime, bookingData.endTime)) {
            console.error("Invalid date range.");
            return;
        }

        const hasConflict = checkBookingConflict(bookingData);

        if (hasConflict) {
            console.error("Booking conflict detected. Please choose a different time or room.");
            return;
        }

        const totalPrice = calculatePrice(bookingData.startTime, bookingData.endTime, bookingData.roomId);

        const submissionData = {
            ...bookingData,
            price: totalPrice
        };

        try {
            const response = await axios.post('/api/newBooking', { bookingData: submissionData });
            console.log(response);
            if (response.data.msg === "success") {
                console.log("Booking Successful");
                setBookings([...bookings, submissionData]);
                onNewBooking();
            } else {
                console.log("Booking Failed");
            }
        } catch (error) {
            console.error("Error during submission:", error);
        }

        setBookingData({
            roomId: "",
            userEmail: "",
            startTime: "",
            endTime: "",
            price: 0,
            status: "active"
        });
    };



    return (
        <div className=''>
            <Sheet>
                <SheetTrigger asChild>
                    <Button className="">New Booking</Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>New booking!</SheetTitle>
                        <SheetDescription>
                            Please enter booking details below.
                        </SheetDescription>
                    </SheetHeader>
                    <div className=' w-full max-w-md p-8 my-5 space-y-4 bg-white rounded-lg shadow-lg border'>
                        <form className='space-y-6' onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="roomId" className='text-sm font-medium'>Room Number</label>
                                <select id="roomId" name="roomId" className='mt-1 w-full text-black p-2 border border-gray-300 rounded-md' value={bookingData.roomId} onChange={handleChange}>
                                    <option value="" disabled>Select a room</option>
                                    <option value="A001">A001</option>
                                    <option value="A002">A002</option>
                                    <option value="B101">B101</option>
                                    <option value="B102">B102</option>
                                    <option value="B103">B103</option>
                                    <option value="C201">C201</option>
                                    <option value="C202">C202</option>
                                    <option value="C203">C203</option>
                                    <option value="C204">C204</option>
                                    <option value="C205">C205</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="userEmail" className='text-sm font-medium'>Email</label>
                                <input type="email" id="userEmail" name="userEmail" className='mt-1 w-full p-2 text-black border border-gray-300 rounded-md' placeholder='Your Email' value={bookingData.userEmail} onChange={handleChange} />
                            </div>

                            <div className='flex lg:flex-row gap-2 flex-col'>
                                <div className='flex-1 min-w-0'>
                                    <label htmlFor="startTime" className='text-sm font-medium'>Start Date</label>
                                    <input type="datetime-local" id="startTime" name="startTime" className='mt-1 text-gray-500  w-full p-2 border border-gray-300 rounded-md' value={bookingData.startTime} onChange={handleChange} placeholder='Start Time' />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <label htmlFor="endTime" className='text-sm font-medium'>End Date</label>
                                    <input type="datetime-local" id="endTime" name="endTime" className='mt-1 w-full text-gray-500  p-2 border border-gray-300 rounded-md' value={bookingData.endTime} onChange={handleChange} placeholder='End Time' />
                                </div>
                            </div>
                            {/* {isFormIncomplete && (
                                <label className='text-xs font-medium text-red-500'>Please fill in all fields. </label>
                            )} */}
                            {isConflict && (
                                <label className='text-xs font-medium text-red-500'>Cannot book room for the selected dates</label>
                            )}
                            <div className=' flex flex-col'>
                                <label className='text-sm font-medium'>Price</label>
                                <label className='text-3xl font-medium text-black text-center w-full'>₹{price}</label>
                            </div>
                            <div>
                                <textarea id="message" name="message" rows={4} className='mt-1 w-full p-2 border text-black border-gray-300 rounded-md' placeholder='Any Additional Requests?'></textarea>
                            </div>
                            <SheetClose asChild>
                                {(isConflict || isFormIncomplete) ? (
                                    <Button disabled type="submit" className='w-full p-3 rounded-md hover:bg-[#FF9496]'>Add Booking</Button>
                                ) : (
                                    <Button type="submit" className='w-full p-3 rounded-md hover:bg-[#FF9496]'>Add Booking</Button>
                                )}

                            </SheetClose>
                        </form>
                    </div>
                </SheetContent>
            </Sheet>

        </div>
    );
}

export default Booking;
