const db = require("sqlite-async");

function execute(db) {
    return db.exec(`
        CREATE TABLE IF NOT EXISTS proffys (
            id INTEGER, name TEXT NOT NULL, avatar TEXT, whatsapp TEXT NOT NULL, bio TEXT NOT NULL,
            PRIMARY KEY(id)
        );

        CREATE TABLE IF NOT EXISTS classes (
            id INTEGER, subject INTEGER, cost TEXT NOT NULL, proffy_id INTEGER NOT NULL,
            PRIMARY KEY(id), FOREIGN KEY(proffy_id) REFERENCES proffys(id)
        );

        CREATE TABLE IF NOT EXISTS class_schedule (
            id INTEGER, class_id INTEGER NOT NULL, weekday INTEGER NOT NULL, time_from INTEGER NOT NULL, 
            time_to INTEGER NOT NULL,
            PRIMARY KEY(id), FOREIGN KEY(class_id) REFERENCES classes(id)
        );
    `)
}




module.exports = db.open(__dirname + "/db.sqlite").then(execute);   // Use this db in other scripts
