const { Race } = require('./race.model');
const connection = require('../../sockets/socket').connection();

const getRaces = async (req, res) => {
    try {
        let races = await Race.find({ }).lean();
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
            success: 1,
            race: result
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: 'An error occured while creating the race'
        });
    }
}

const updateRaceData = async (req, res) => {
    try {
        let races = await Race.find({});
        const currentRace = races[0];
        const { name, lat, lng } = req.body;
        const contestant = currentRace.contestants.find(contestant => contestant.name === name);
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
            currentRace.contestants.push(newContestant);
        }
        connection.sendEvent("update", currentRace);
        await currentRace.save();
        res.json({
            success: 1,
            race: currentRace
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: 0,
            msg: 'An error occured while updating the race'
        });
    }
}

module.exports = {
    getRaces, createRace, updateRaceData,
};