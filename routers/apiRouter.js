//api route controller
let mongo = require('mongodb').MongoClient;
const DBURI = 'mongodb://localhost:27017/userDB';
const SERVER_ERROR = {message: 'Internal server error: Something went wrong server side.'};
const CLIENT_ERROR = {message: 'Bad Request: Unsupported query parameter.'};
const CLIENT_NOT_AUTHORIZED = {message: 'Forbidden: Incorrect authentication credentials.'};

const uuidV1 = require('uuid/v1');

//let usersCache = [];
let requiredToken = '';


function getUsers(request, response) {
    console.log('params: ',request.headers)
    let {authorization} = request.headers;
    let {offset, limit} = request.query;
    if (authorization !== requiredToken) {
        response.status(403).json(CLIENT_NOT_AUTHORIZED);
        return
    }
    // if (usersCache.length > 0) {
    //     response.status(200).json(usersCache);
    //     return;
    // }

    mongo.connect(DBURI, {useNewUrlParser: true}, (e, db) => {
        if (e) {
            response.status(500).json(SERVER_ERROR);
        } else {
            let dbo = db.db('userDB');
            dbo.collection('users').find({}).toArray((e, result) => {
                if (e) throw e;
                let $result;
                
                if (offset && limit) {
                    let o = parseInt(offset, 10);
                    let l = parseInt(limit, 10);
                    $result = {page: o, data: result.slice(o, o + l)};
                    
                } else {
                    $result = result;
                }
                //usersCache = $result;
                response.status(200).json($result);
            });
        }
    });
}

function getUserByGender(request, response) {
    let $gender = request.params.gender;
    if (['male', 'female'].indexOf($gender) === -1) {
        response.status(400).json(CLIENT_ERROR);
        return;
    }
    // if (usersCache.length > 0) {
    //     response.status(200).json(getUsersByGender(usersCache, $gender));
    //     return;
    // }
    mongo.connect(DBURI,{useNewUrlParser: true}, (e, db) => {
        if (e) {
            response.status(500).json(SERVER_ERROR);
        } else {

            let dbo = db.db('userDB');
            dbo.collection('users').find({}).toArray((e, result) => {
                if (e) throw e;
                let filteredUsers = getUsersByGender(result, $gender);
                response.status(200).json(filteredUsers);
            });

        }
    });

}

function getUsersByGender(users, gender) {
    return users.filter((u) => u.gender === gender);
}

function getAuth(request, response) {
    
    let {name, password} = request.body;
    if (!name || !password) {
        response.status(400).json(CLIENT_ERROR);
        return;
    }

    mongo.connect(DBURI,{useNewUrlParser: true}, (e, db) => {
        if(e) throw e;
        let dbo = db.db('userDB');
        dbo.collection('users').find({}).toArray((e, result) => {
            if (e) throw e;
            
            let foundUser = result.find((user) => {
                return user.login.username == name && user.login.password == password;
            });
            if (foundUser) {
                requiredToken = uuidV1();
                response.status(201).json({status: 'created', token: requiredToken});
            } else {
                response.status(403).json(CLIENT_NOT_AUTHORIZED);
            }
           
        });

    });
    
}

module.exports = function(app) {
    app.get('/users', getUsers);
    app.get('/users/:gender', getUserByGender);
    app.post('/auth', getAuth);
};