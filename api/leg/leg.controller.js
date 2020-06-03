const { Race } = require('../race/race.model');
const constants = require('../../constants');

const stop = async (req, res) => {
    try {
        let leg = await Race.findById({ _id: req.params.id });
        if (leg) {
            const promises = [
                Race.findByIdAndUpdate({ _id: req.params.id }, { status: constants.raceStatus.finished }, { new: true }),
                Race.findByIdAndUpdate({ _id: leg.legOf }, { canCreateLegs: !!req.body.allowLegCreation }, { new: true })
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

const create = async (req, res) => {
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
    create, stop
};