const db = require("./db");
const createProffy = require("./createProffy");

db.then(async (db) => {
    proffyValue = {
        name: "Rayan Wilbert",
        avatar: "https://avatars.githubusercontent.com/u/72581482?v=4",
        whatsapp: "24998481698",
        bio: "Físico Quântico"
    }

    classValue = {
        subject: 1, 
        cost: "20",
    },

    classScheduleValues = [
        {
            weekday: 0, 
            time_from: 720, 
            time_to: 1220
        },
        {
            weekday: 1, 
            time_from: 520, 
            time_to: 1020
        }
    ];

    // await createProffy(db, {proffyValue, classValue, classScheduleValues});

    const selectedProffys = await db.all(`SELECT * FROM proffys;`);
    // console.log(selectedProffys);

    const selectedClassesAndProffys = await db.all(`
        SELECT proffys.*, classes.* 
        FROM proffys
        JOIN classes ON (classes.proffy_id = proffys.id) 
        WHERE classes.proffy_id = 1;
    `);
    // console.log(selectedClassesAndProffys);
    

    const selectedClassesSchedule = await db.all(`SELECT * FROM class_schedule WHERE class_id = 1 
    AND weekday = 0 AND time_from <=  720 AND time_to >= 1220;`);
    console.log(selectedClassesSchedule); 
})









