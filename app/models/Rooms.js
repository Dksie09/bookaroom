import mongoose, { Schema } from 'mongoose'

const roomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true,
    },
    typeId: {
        type: String,
        // ref: 'RoomType',
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['available', 'booked'],
    },
},
    {
        timestamps: true
    });

const Room = mongoose.models.Rooms || mongoose.model('Rooms', roomSchema);
export default Rooms;