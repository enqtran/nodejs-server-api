/**
 * NODEJS EXPRESS SERVER RESTFUL API
 * @enqtran
 * 27/07/2017
 */
const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Bear = require('./app/models/bear');

const app = express();
const port = Number(process.env.PORT || 3000);

mongoose.connect('mongodb://localhost/Tododb');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


/**
 * ROUTES FOR API
 */
const router = express.Router();

// middleware to use for all requests
router.use((req, res, next) => {
    console.log('Connect ...');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:3000/api)
router.get('/', (req, res) => {
    res.json({ 
        code: 200,
        message: 'Welcome to bears api !',
    });
});


/**
 * MAIN API URL 
 * http://localhost:3000/api
 */ 

 // API bears
router.route('/bears')
    .post((req, res) => {
        // create a bear (accessed at POST http://localhost:3000/api/bears)
        const bear = new Bear();      // create a new instance of the Bear model
        bear.name = req.body.name;  // set the bears name (comes from the request)

        // save the bear and check for errors
        bear.save((err) => {
            if (err)
                res.send(err);
            res.json({ 
                code: 200,
                message: 'Bear created!' 
            });
        });

    })
    .get((req, res) => {
        // get all the bears (accessed at GET http://localhost:3000/api/bears)
        Bear.find((err, bears) => {
            if (err)
                res.send(err);
            res.json({ 
                code: 200, 
                data: bears,
                message: 'Bear get all!' 
            });
        });
    });

//API bears/{bear_id}
router.route('/bears/:bear_id')
    .get((req, res) => {
        // get the bear with that id (accessed at GET http://localhost:3000/api/bears/:bear_id)
        Bear.findById(req.params.bear_id, (err, bear) => {
            if (err)
                res.send(err);
            res.json({
                code: 200,
                data: bear,
                message: 'Bear get by id '+req.params.bear_id 
            });
        });
    })
    .put((req, res) => {
        // update the bear with this id (accessed at PUT http://localhost:3000/api/bears/:bear_id)
        // use our bear model to find the bear we want
        Bear.findById(req.params.bear_id, (err, bear) => {
            if (err)
                res.send(err);
            bear.name = req.body.name;  // update the bears info

            // save the bear
            bear.save((err) => {
                if (err)
                    res.send(err);
                res.json({ 
                    code: 200,
                    message: 'Bear updated!' + req.params.bear_id 
                });
            });

        });
    })
    .delete((req, res) => {
        // delete the bear with this id (accessed at DELETE http://localhost:3000/api/bears/:bear_id)
        Bear.remove({
            _id: req.params.bear_id
        }, (err, bear) => {
            if (err)
                res.send(err);
            res.json({ 
                code: 200,
                message: 'Successfully deleted' + req.params.bear_id 
            });
        });
    });
// END API


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

app.listen(port);
console.log('Bear RESTful API server started on: ' + port);