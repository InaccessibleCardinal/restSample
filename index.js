let app = require('express')();
let bodyParser = require('body-parser');
let router = require('./routers/apiRouter');
let headerMiddleware = require('./headerMiddleware');

app.get('/', (request, response) => {
    response.send('Welcome to the app');
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(headerMiddleware);

router(app);

app.listen(9000, () => {
    console.log('app is listening on port 9000...');
});