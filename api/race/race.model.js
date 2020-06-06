const { mongoose } = require('../../db/connection');

const raceSchema = new mongoose.Schema({
    contestants: [
        {
            color: String,
            name: String,
            locationHistory: [
                {
                    lat: Number,
                    lng: Number
                }
            ]
        }
    ],
    status: {
        type: String,
        enum: ['waiting', 'inProgress', 'finished'],
        default: 'waiting'
    },
    startingLocation: {
        lat: Number,
        lng: Number
    },
    laps: Number,
    name: String,
    startedAt: Date,
    canCreateLegs: {
        type: Boolean,
        default: false
    },
    legs: [
        { type : mongoose.Schema.Types.ObjectId, ref: 'Race' }
    ],
    legOf: { type : mongoose.Schema.Types.ObjectId, ref: 'Race' }
}, {
    timestamps: true
});

const Race = mongoose.model('Race', raceSchema);
module.exports = {
    Race
};