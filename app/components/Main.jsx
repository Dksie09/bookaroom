"use client";
import React, { useEffect, useState } from 'react'
import { HotelRounded } from "@mui/icons-material";
import Booking from './Booking';
import Table from './Table';

function Main() {
    const [refreshTableKey, setRefreshTableKey] = useState(0);

    const handleNewBooking = () => {
        setRefreshTableKey(prevKey => prevKey + 1);
    };
    const handleEditBooking = () => {
        setRefreshTableKey(prevKey => prevKey + 1);
    };

    return (
        <div className=' m-10'>
            <h3 className="mt-8 scroll-m-20 mb-10 text-2xl font-semibold tracking-tight">
                <HotelRounded className="inline-block w-7 h-10 mb-2 mr-2" />
                BookARoom
            </h3>

            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Managing Bookings Made <i><span className='text-[#f7989b] font-medium'>Effortless</span></i>
            </h1>

            <p className="leading-7 [&:not(:first-child)]:mt-6">
                Our platform not only offers a solid booking management interface but also ensures your booking process is smooth and beautiful.
            </p>

            <div className='my-4'>
                <Booking onNewBooking={handleNewBooking} />
            </div>
            <div className=''>
                <Table refreshKey={refreshTableKey} onEditBooking={handleEditBooking} />
            </div>
        </div>
    )
}

export default Main