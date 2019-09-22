let express = require('express');

let serverRenderer = require('./middleware/renderer');

const PORT = 3000;
const path = require("path");

const app = express();
const router = express.Router();

router.use('^/$', (...args) => {
    serverRenderer(...args)
});

router.use('/static', express.static(
    path.resolve(__dirname, '..', 'build', 'static'),
    { maxAge: '30d' },
));


router.use('/countries*', (...args) => {
    serverRenderer(...args)
});


app.use(router);

app.listen(PORT, (error) => {
    if (error) {
        return console.log('something bad happened', error);
    }

    console.log("listening on " + PORT + "...");
});