module.exports = function(request, response, next) {
    response.append('Access-Control-Allow-Origin', ['*']);
    response.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.append('Access-Control-Allow-Headers', 'Content-Type');
    response.contentType('application/json');
    next();
}