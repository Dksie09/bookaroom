"use client";
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { HotelRounded } from "@mui/icons-material";
import Booking from './Booking';
import Table from './Table';

function Main() {
    const [refreshTableKey, setRefreshTableKey] = useState(0);
    const [roomData, setRoomData] = useState([]);
    const [roomCostData, setRoomCostData] = useState([]);
    const [bookings, setBookings] = useState([]);

    const handleNewBooking = () => {
        setRefreshTableKey(prevKey => prevKey + 1);
    };
    const handleEditBooking = () => {
        setRefreshTableKey(prevKey => prevKey + 1);
    };

    useEffect(() => {

        const fetchBookings = async () => {
            try {
                const response = await axios.get('/api/allBookings');
                setBookings(response.data);
            } catch (error) {
                console.error('Failed to fetch bookings:', error);
            }
        };

        const fetchRooms = async () => {
            try {
                const response = await axios.get('/api/allRooms');
                setRoomData(response.data);
            } catch (error) {
                console.error('Failed to fetch rooms:', error);
            }
        };

        const fetchRoomCostData = async () => {
            try {
                const response = await axios.get('/api/roomCost');
                setRoomCostData(response.data);
            } catch (error) {
                console.error('Failed to fetch rooms:', error);
            }
        }

        fetchBookings();
        fetchRooms();
        fetchRoomCostData();
    }, [refreshTableKey]);

    return (
        <div className=' px-10'>
            <h3 className="mt-8 mb-10 text-2xl font-semibold tracking-tight">
                <HotelRounded className="inline-block w-7 h-10 mb-2 mr-2" />
                BookARoom
            </h3>

            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Managing Bookings Made <i><span className='text-[#f7989b] font-medium'>Effortless</span></i>
            </h1>

            <p className="leading-7 [&:not(:first-child)]:mt-6">
                Our platform not only offers a solid booking management interface but also ensures your booking process is smooth and beautiful.
            </p>

            <div className='mt-8'>
                <Booking onNewBooking={handleNewBooking} allBookings={bookings} roomData={roomData} roomCostData={roomCostData} />
            </div>
            <div className=''>
                <Table refreshKey={refreshTableKey} bookings={bookings} roomData={roomData} onEditBooking={handleEditBooking} roomCostData={roomCostData} />
            </div>
        </div>
    )
}

export default Main