import mongoose, { Schema } from 'mongoose'

mongoose.connect(process.env.MONGODB_URI)
mongoose.Promise = global.Promise

const roomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true,
    },
    typeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RoomType',
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