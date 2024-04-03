import { Button } from '@/components/ui/button';
import React from 'react';
import axios from 'axios'; // Make sure you've installed axios

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
        <div>
            <Button
                className="text-red-600 border-red-600 border bg-red-500 bg-opacity-20 hover:opacity-80 hover:bg-red-500 hover:text-white"
                onClick={handleCancel}
            >
                Cancel
            </Button>
        </div>
    );
}

export default CancelBooking;
