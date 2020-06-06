const { Race } = require('./race.model');
const { getRandomColor } = require('../utils/utility');
const constants = require('../../constants');
const connection = require('../../sockets/socket').connection();

const getRaces = async (req, res) => {
    try {
        let races = await Race.find({}).populate('legs').lean();
        return res.json({
            success: 1,
            races
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: 'An error occured while getting the races'
        });
    }
}

const createRace = async (req, res) => {
    try {
        const race = new Race(req.body);
        let result = await race.save();
        return res.status(200).json({
            success: !!result,
            race: result
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: 0,
            msg: 'An error occured while creating the race'
        });
    }
}

const updateRaceData = async (req, res) => {
    const getOpenLeg = race => {
        return race.legs.find(leg => leg.status !== constants.raceStatus.finished);
    }
    try {
        let race = await Race.findById({ _id: req.params.id }).populate('legs');
        if (race) {
            if (race.status === constants.raceStatus.finished && !!!getOpenLeg(race)) {
                throw { message: 'Race is closed' };
            } else {
                race = race.status === constants.raceStatus.finished ? getOpenLeg(race) : race;
                const { name, lat, lng } = req.body;
                const contestant = race.contestants.find(contestant => contestant.name === name);
                if (contestant) {
                    contestant.locationHistory.push(
                        {
                            lat,
                            lng
                        }
                    );
                } else {
                    const newContestant = {
                        color: getRandomColor(race.contestants.map(contestant => contestant.color)),
                        name,
                        locationHistory: [
                            {
                                lat,
                                lng
                            }
                        ]
                    }
                    race.contestants.push(newContestant);
                }
                connection.sendEvent("update", race);
                race = await race.save();

                return res.json({
                    success: !!race,
                    race
                });
            }
        }
        throw { message: 'No race found against the provided ID' };
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: error.message || 'An error occured while updating the race'
        });
    }
}

const startRace = async (req, res) => {
    try {
        const result = await Race.findByIdAndUpdate({ _id: req.params.id }, { status: constants.raceStatus.inProgress, startedAt: Date.now() }, { new: true });
        return res.json({
            success: !!result.startedAt,
            race: result
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: 'An error occured while starting the race'
        });
    }
}

const stopRace = async (req, res) => {
    try {
        const result = await Race.findByIdAndUpdate({ _id: req.params.id }, {
            status: constants.raceStatus.finished,
            canCreateLegs: !!req.body.allowLegCreation
        }, { new: true });
        return res.json({
            success: !!result.status && result.status === constants.raceStatus.finished,
            race: result
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: 'An error occured while stopping the race'
        });
    }
}

const deleteRace = async (req, res) => {
    try {
        const results = await Promise.all([
            Race.findByIdAndDelete({ _id: req.params.id }),
            Race.deleteMany({ legOf: req.params.id })
        ]);
        return res.json({
            success: !!results[0]._id,
            race: results[0]
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: 'An error occured while deleting the race'
        });
    }
}


module.exports = {
    getRaces, createRace, updateRaceData, startRace, stopRace, deleteRace
};