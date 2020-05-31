const { mongoose } = require('../../db/connection');

const raceSchema = new mongoose.Schema({
    contestants: [
        {
            name: { type: String },
            locationHistory: [
                {
                    lat: { type: Number },
                    lng: { type: Number }
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
        lat: { type: Number },
        lng: { type: Number }
    },
    laps: Number,
    name: String,
    startedAt: Date,
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