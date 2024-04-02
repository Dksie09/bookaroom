const mongoose = require('mongoose');

const roomTypeSchema = new mongoose.Schema({
    typeId: {
        type: String,
        required: true,
        unique: true,
    },
    typeName: {
        type: String,
        required: true,
    },
    pricePerHour: {
        type: Number,
        required: true,
    },
});

const RoomTypes = mongoose.models.RoomTypes || mongoose.model('RoomTypes', roomTypeSchema);
export default RoomTypes;