const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const pjson = require('./package.json');

require('./config/index')(app);
require('./routes/index')(app);

app.listen(port, error => {
    if (error) {
        debug(error);
        return;
    }
    console.log(`${pjson.name} v${pjson.version} is running on http://localhost:${port}`);
});
