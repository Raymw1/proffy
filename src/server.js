const express = require("express");
const server = express();
const nunjucks = require("nunjucks");
nunjucks.configure('src/views',{
    express: server,
    noCache: true
})

server.use(express.static("public"));
server.use(express.urlencoded({ extended: true }));
const Database = require("./database/db");

const { subjects, weekdays, getSubject, convertHoursToMinutes } = require("./utils/format");

server.get("/", function(req, res) {
    return res.render("index.html");
})
    
server.get("/study", async function(req, res) {
    const filters = req.query;
    if (!filters.subject || !filters.weekday || !filters.time) {
        return res.render("study.html", { filters, subjects, weekdays });
    }
    const timeToMinutes = convertHoursToMinutes(filters.time);
    const query = `
        SELECT classes.*, proffys.*
        FROM proffys
        JOIN classes ON (classes.proffy_id = proffys.id)
        WHERE EXISTS (
            SELECT class_schedule.*
            FROM class_schedule
            WHERE class_schedule.class_id = classes.id
            AND class_schedule.weekday = ${filters.weekday}
            AND class_schedule.time_from <= ${timeToMinutes}
            AND class_schedule.time_to > ${timeToMinutes}
        )
        AND classes.subject = '${filters.subject}'
    `
    try {
        const db = await Database;
        const proffys = await db.all(query);
        proffys.map((proffy) => {
            proffy.subject = getSubject(proffy.subject)
        })
        return res.render("study.html", { proffys, filters, subjects, weekdays });
    } catch (error) {
        console.log(error)
    }
})

server.get("/give-classes", function(req, res) {
    return res.render("give-classes.html", { subjects, weekdays });
})

server.post("/give-classes", async function(req, res) {
    const createProffy = require("./database/createProffy")
    const proffyValue = {
        name: req.body.name,
        avatar: req.body.avatar,
        whatsapp: req.body.whatsapp,
        bio: req.body.bio
    }
    const classValue = {
        subject: req.body.subject,
        cost: req.body.cost
    }
    const classScheduleValues = req.body.weekday.map((weekday, index) => {
        return {
            weekday,
            time_from: convertHoursToMinutes(req.body.time_from[index]),
            time_to: convertHoursToMinutes(req.body.time_to[index])
        }
    });
    try {
        const db = await Database;
        await createProffy(db, {     proffyValue, classValue, classScheduleValues });
        let queryString = "?subject=" + req.body.subject;
        queryString += "&weekday=" + req.body.weekday[0];
        queryString += "&time=" + req.body.time_from[0];
        return res.redirect("/study" + queryString);
    } catch (error) {
        console.log(error);
    }
})


const PORT = process.env.PORT||"3000";
server.listen(PORT, function() {
    console.log(`Go to: http://127.0.0.1:${PORT}/`);
})

