const formidable = require('express-formidable');

module.exports = function (app) {

    app.use(formidable({
        multiples: true
    }));

    app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
    });
};
