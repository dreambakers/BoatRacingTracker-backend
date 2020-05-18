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
    inProgress: { type: Boolean },
    startingLocation: {
        lat: { type: Number },
        lng: { type: Number }
    }
}, {
    timestamps: true
});

const Race = mongoose.model('Race', raceSchema);
module.exports = {
    Race
};