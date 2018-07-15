module.exports = (app) => {
    app.get('/', getHome);
};

function getHome(request, response) {
    response.render('home');
}