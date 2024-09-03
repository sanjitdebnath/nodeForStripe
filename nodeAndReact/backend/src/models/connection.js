const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'media_upload';


MongoClient.connect(uri, function (err, client) {
    if (err) throw err;
    global.dbo = client.db(dbName);
    console.log("Database connected!");
});



