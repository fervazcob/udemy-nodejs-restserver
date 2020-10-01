const mongoose = require("mongoose");

// Puerto de la app
process.env.PORT = process.env.PORT || 3000;

// Mongoose
const password = process.env.DBPASSWORD || "",
    dbname = process.env.DBNAME || "";

let url;

if (JSON.parse(process.env.DEV)) {
    url = "mongodb://localhost:27017/cafe";
} else {
    url = `mongodb+srv://cafe_system:${password}@wezck.ui81d.mongodb.net/${dbname}?retryWrites=true&w=majority`;
}

const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
};

mongoose.connect(url, mongooseOptions)
    .then(() => console.log("Base de datos ONLINE"))
    .catch(err => console.error(err));
