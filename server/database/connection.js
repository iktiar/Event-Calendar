
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

    // Build the connection string
    const dbURI = 'mongodb://localhost/events_test';

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', function() {
        mongoose.connection.close(function () {
            console.log('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });

    module.exports = {
        connect: function() {
            // Create the database connection
            if(mongoose.connection.readyState == 0) {
                return mongoose.connect(dbURI, {useMongoClient: true});
            }
        },

        disconnect: function() {
            return mongoose.disconnect();
        }
    }
