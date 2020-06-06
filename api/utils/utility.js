const constants = require('../../constants');

function getRandomColor(checkIn = null) {
    const keys = Object.keys(constants.colors);
    let randomColor = constants.colors[keys[ keys.length * Math.random() << 0]];
    if (checkIn && checkIn.includes(randomColor)) {
        for (let color of Object.values(constants.colors)) {
            randomColor = color;
            if (!checkIn.includes(randomColor)) {
                return randomColor;
            }
        }
        return '#000000';
    }
    return randomColor;
}

module.exports = {
    getRandomColor
}