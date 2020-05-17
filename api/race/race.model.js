const { mongoose } = require('../../db/connection');

const raceSchema = new mongoose.Schema({
    contestants: [
        { type: String }
    ],
}, {
    timestamps: true
});

const Race = mongoose.model('Poll', raceSchema);
module.exports = {
    Race
};