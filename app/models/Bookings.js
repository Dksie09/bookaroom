
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI)
mongoose.Promise = global.Promise

const bookingSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'cancelled', 'completed'],
        default: 'active',
    },
    refundAmount: {
        type: Number,
    }
}, {
    timestamps: true
});

const Bookings = mongoose.models.Bookings || mongoose.model('Bookings', bookingSchema);
export default Bookings;