const mongoose = require("mongoose");

let dbConnection = () => {
    return mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@testcluster.yvhccxb.mongodb.net/${process.env.MONGODB_DBNAME}?appName=TestCluster`).then(() => {
        console.log("Database Connected");
    }).catch((err) => {
        console.error("Database connection error:", err);
    });
}

module.exports = dbConnection;
