const { Race } = require('./race.model');
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

            return res.json({
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
        const { allowLegCreation } = req.body;
        const result = await Race.findByIdAndUpdate({ _id: req.params.id }, {
            status: 'finished',
            canCreateLegs: !!allowLegCreation
        }, { new: true });
        return res.json({
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

const stopLeg = async (req, res) => {
    try {
        let leg = await Race.findById({ _id: req.params.id });
        const { allowLegCreation } = req.body;

        if (leg) {

            const promises = [
                Race.findByIdAndUpdate({ _id: req.params.id }, { status: 'finished' }, { new: true }),
                Race.findByIdAndUpdate({ _id: leg.legOf }, { canCreateLegs: !!allowLegCreation }, { new: true })
            ]

            const results = await Promise.all(promises);

            const updatedLeg = results[0];
            const updatedParent = results[1];

            return res.json({
                success: !!updatedLeg && !!updatedParent,
                leg: updatedLeg,
                race: updatedParent
            });
        }
        throw { message: 'No leg found against the provided ID' };
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
        return res.json({
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

const createLeg = async (req, res) => {
    try {
        let parentRace = await Race.findById({ _id: req.params.id });
        if (parentRace) {
            let newLeg = new Race(req.body);
            newLeg = await newLeg.save();
            parentRace.canCreateLegs = false;
            parentRace.legs = [ ...parentRace.legs, newLeg._id ];
            parentRace = await parentRace.save();
            return res.json({
                success: !!newLeg,
                leg: newLeg,
                race: parentRace
            });
        }
        throw { message: 'No parent race found against the provided ID' };
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: 'An error occured while creating the leg'
        });
    }
}

module.exports = {
    getRaces, createRace, updateRaceData, startRace, stopRace, deleteRace, createLeg, stopLeg
};