import { Button } from '@/components/ui/button';
import React from 'react';
import axios from 'axios';
import { CancelRounded, DeleteOutlineRounded } from '@mui/icons-material';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"



function CancelBooking({ bookingID, onNewBooking, bookingStartTime, price }) {
    const handleCancel = async () => {
        // Calculate the difference in hours between the current time and the booking start time
        const now = new Date();
        const bookingStart = new Date(bookingStartTime); // assuming bookingStartTime is a valid date string or timestamp
        const diffTime = Math.abs(bookingStart - now);
        const diffHours = diffTime / (1000 * 60 * 60);

        let refundAmount = 0; // Default no refund

        if (diffHours > 48) {
            refundAmount = price; // Full refund
        } else if (diffHours >= 24 && diffHours <= 48) {
            refundAmount = price / 2; // 50% refund
        }
        // No need for an else case, refundAmount is already initialized to 0

        try {
            const response = await axios.post('/api/cancelBooking', {
                bookingID,
                refundAmount,
            });
            console.log('Cancellation successful:', response.data);
            onNewBooking();
        } catch (error) {
            console.error('Cancellation error:', error.response || error);
        }
    };

    return (
        <div className='  hover:text-red-600'>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline text-red-500" size="icon" onClick={handleCancel} >
                            <CancelRounded className=" w-full" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Cancel Booking</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            {/* <Button variant="destructive" onClick={handleCancel}>Cancel</Button> */}
        </div>
    );
}

export default CancelBooking;
