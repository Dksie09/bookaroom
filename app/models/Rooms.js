import mongoose, { Schema } from 'mongoose'

mongoose.connect(process.env.MONGODB_URI)
mongoose.Promise = global.Promise

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true,
        unique: true,
    },
    typeId: {
        type: String,
        required: true,
    },
},
    {
        timestamps: true
    });

const Rooms = mongoose.models.Rooms || mongoose.model('Rooms', roomSchema);
export default Rooms;