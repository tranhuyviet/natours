const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    // use local db
    // .connect(process.env.DATABASE_LOCAL, {
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => {
        // console.log(con.connections);
        console.log('DB connection successful!');
    });
// .catch(err => {
//     console.log(err);
// });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Server start on port ${port}`);
});

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION. SERVER IS SHUTTING DOWN...');
    server.close(() => {
        process.exit(1);
    });
});
