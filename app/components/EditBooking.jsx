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

const frameworks = [
    {
        value: "A001",
        label: "A001",
    },
    {
        value: "A002",
        label: "A002",
    },
    {
        value: "B101",
        label: "B101",
    },
    {
        value: "B102",
        label: "B102",
    },
    {
        value: "B103",
        label: "B103",
    },
    {
        value: "C201",
        label: "C201",
    },
    {
        value: "C202",
        label: "C202",
    },
    {
        value: "C203",
        label: "C203",
    },
    {
        value: "C204",
        label: "C204",
    },
    {
        value: "C205",
        label: "C205",
    },
    {
        value: "C206",
        label: "C206",
    },
]


function EditBooking({ bookingID, onNewBooking, currentBooking }) {
    const [bookings, setBookings] = useState([]);
    const [price, setPrice] = useState(0);
    const [bookingData, setBookingData] = useState(
        currentBooking
    ); const [isConflict, setIsConflict] = useState(false);
    const [isFormIncomplete, setIsFormIncomplete] = useState(false);
    const [roomData, setRoomData] = useState([]);
    const [roomCostData, setRoomCostData] = useState([]);


    useEffect(() => {
        console.log(currentBooking)
        const fetchRooms = async () => {
            try {
                const response = await axios.get('/api/allRooms');
                console.log("all same room:", response.data);
                setRoomData(response.data);
            } catch (error) {
                console.error('Failed to fetch rooms:', error);
            }
        };

        const fetchRoomCostData = async () => {
            try {
                const response = await axios.get('/api/roomCost');
                console.log("room cost:", response.data)
                setRoomCostData(response.data);
            } catch (error) {
                console.error('Failed to fetch rooms:', error);
            }
        }

        fetchRooms();
        fetchRoomCostData();
    }, [bookingID]);

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

    function toLocalDateTimeString(input) {
        if (!input) return '';

        const date = new Date(input);
        if (isNaN(date.getTime())) return '';

        const offset = date.getTimezoneOffset();
        const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
        return adjustedDate.toISOString().slice(0, 16);
    }


    const checkBookingConflict = (newBooking, existingBookings) => {
        return true;
        // return existingBookings.some((booking) => {
        //     if (booking.roomId !== newBooking.roomId || booking.status !== 'active') {
        //         return false;
        //     }

        //     const existingStart = new Date(booking.startTime).getTime();
        //     const existingEnd = new Date(booking.endTime).getTime();
        //     const newStart = new Date(newBooking.startTime).getTime();
        //     const newEnd = new Date(newBooking.endTime).getTime();

        //     return (newStart < existingEnd && newStart >= existingStart) || (newEnd > existingStart && newEnd <= existingEnd) || (newStart <= existingStart && newEnd >= existingEnd);
        // });
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
        return start >= now && start < end && start.getTime() !== end.getTime();
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
        // console.log(bookingID)
        e.preventDefault();
        if (!isValidDateRange(bookingData.startTime, bookingData.endTime)) {
            console.error("Invalid date range.");
            return;
        }

        //TODO: remove entry with same id from conflict
        const hasConflict = checkBookingConflict(bookingData, bookings);

        if (hasConflict) {
            console.error("Booking conflict detected. Please choose a different time or room.");
            return;
        }

        const totalPrice = calculatePrice(bookingData.startTime, bookingData.endTime, bookingData.roomID);

        const submissionData = {
            ...bookingData,
            price: totalPrice
        };

        console.log(submissionData);

        const response = await axios.patch('/api/edit', { updatedBookingData: submissionData, bookingId: bookingID });
        console.log(response);
        if (response.status === 200) {
            onNewBooking();
        } else {
            console.error("Error updating booking");
        }

        setBookingData({
            roomId: "",
            userEmail: "",
            startTime: "",
            endTime: "",
            price: 0,
            status: "active"
        });
    }

    useEffect(() => {

        setIsFormIncomplete(false);
        if (!bookingData.roomId || !bookingData.userEmail || !bookingData.startTime || !bookingData.endTime) {
            setIsFormIncomplete(true);
        }

    }, [bookingData.startTime, bookingData.endTime, bookingData.roomId, bookingData.userEmail]);


    return (
        <div className=''>
            <Sheet>
                <SheetTrigger asChild>
                    <Button className="">Edit</Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Edit booking!</SheetTitle>
                        <SheetDescription>
                            Please enter new booking details below.
                        </SheetDescription>
                    </SheetHeader>
                    <div className=' w-full max-w-md p-8 my-5 space-y-4 bg-white rounded-lg shadow-lg border'>
                        {/* <h2 className='text-2xl text-black font-bold text-center'>New booking!</h2> */}
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
                                    <input type="datetime-local" id="startTime" name="startTime" className='mt-1 text-gray-500  w-full p-2 border border-gray-300 rounded-md' value={toLocalDateTimeString(bookingData.startTime)} onChange={handleChange} placeholder='Start Time' />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <label htmlFor="endTime" className='text-sm font-medium'>End Date</label>
                                    <input type="datetime-local" id="endTime" name="endTime" className='mt-1 w-full text-gray-500  p-2 border border-gray-300 rounded-md' value={toLocalDateTimeString(bookingData.endTime)} onChange={handleChange} placeholder='End Time' />
                                </div>
                            </div>
                            {/* <label className=' text-xs font-medium text-red-500'>Room not available for the selected dates</label> */}
                            <div className=' flex flex-col'>
                                <label className='text-sm font-medium'>Price</label>
                                <label className='text-3xl font-medium text-black text-center w-full'>₹{bookingData.price}</label>
                            </div>
                            <div>
                                <textarea id="message" name="message" rows={4} className='mt-1 w-full p-2 border text-black border-gray-300 rounded-md' placeholder='Any Additional Requests?'></textarea>
                            </div>
                            <SheetClose asChild>
                                {(isFormIncomplete) ? (
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

export default EditBooking;