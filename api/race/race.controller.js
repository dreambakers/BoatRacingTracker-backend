const { Race } = require('./race.model');
const connection = require('../../sockets/socket').connection();

const getRaces = async (req, res) => {
    try {
        let races = await Race.find({}).populate('legs').lean();
        res.json({
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
        res.status(200).json({
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
    try {
        let race = await Race.findById({ _id: req.params.id });
        if (race) {
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

            res.json({
                success: !!race,
                race
            });
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
        const result = await Race.findByIdAndUpdate({ _id: req.params.id }, { status: 'inProgress', startedAt: Date.now() }, { new: true });
        res.json({
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
        const result = await Race.findByIdAndUpdate({ _id: req.params.id }, { status: 'finished' }, { new: true });
        res.json({
            success: !!result.status && result.status === 'finished',
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
        const result = await Race.findByIdAndDelete({ _id: req.params.id });
        res.json({
            success: !!result._id,
            race: result
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: 'An error occured while deleting the race'
        });
    }
}

const endLeg = async (req, res) => {
    try {
        let race = await Race.findById({ _id: req.params.id }).populate('legOf');
        if (race) {

            if (race.isLeg) {
                // TODO
            }

            // first leg going to be created
            else {
                let newLeg = new Race({
                    startingLocation: {
                        lat: race.startingLocation.lat,
                        lat: race.startingLocation.lng,
                    },
                    laps: race.laps,
                    name: 'Leg 1',
                    isLeg: true,
                    legOf: race._id
                });

                newLeg = await newLeg.save();
                race.legs = [ ...race.legs, newLeg._id ];
                race = await race.save();

                Race.findById(race._id).populate('legs').then(
                    race => {
                        if (race) {
                            connection.sendEvent("update", race);
                        }
                    }
                );

                return res.json({
                    success: !!newLeg,
                    race
                });
            }
        }
        throw { message: 'No race found against the provided ID' };
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: 'An error occured while deleting the race'
        });
    }
}

module.exports = {
    getRaces, createRace, updateRaceData, startRace, stopRace, deleteRace, endLeg
};