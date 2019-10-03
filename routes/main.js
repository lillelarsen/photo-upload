const fs = require('fs');

module.exports = function (app) {
	app.get('/', (req, res, next) => {
		res.render('main', { });
	});

	app.post('/upload', (req, res, next) => {
		if (!req.files || !req.files.file) return next(new Error('Der var ingen fil med formularen..'));
		fs.readFile(req.files.file.path, (err, data) => {
			if (err) return next(new Error('den midlertidige fil kunne ikke læses'))
			let timestamp = Date.now();
			fs.writeFile(`./public/uploads/${timestamp}_${req.files.file.name}.png`, data, (err) => {
				if (err) return next(new Error('filen kunne ikke gemmes'));
				res.status(200);
				res.end();
			});
		});
	});
};