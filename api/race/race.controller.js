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

module.exports = {
    getRaces
};