module.exports = {
    isInt: value => {
        return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value));
    },
    randomInt: (low, high) => {
        return Math.round(Math.random() * (high - low) + low);
    }
}