const express = require("express");
const server = express();
const nunjucks = require("nunjucks");
nunjucks.configure('src/views',{
    express: server,
    noCache: true
})

server.use(express.static("public"));
const Database = require("./database/db");


// const proffys = [
//     {
//         name: "Diego Fernandes", 
//         avatar: "https://avatars2.githubusercontent.com/u/2254731?s=460&amp;u=0ba16a79456c2f250e7579cb388fa18c5c2d7d65&amp;v=4", 
//         whatsapp: "999999999", 
//         bio: "Entusiasta das melhores tecnologias de química avançada. Apaixonado por explodir coisas em laboratório e por mudar a vida das pessoas através de experiências. Mais de 200.000 pessoas já passaram por uma das minhas explosões.", 
//         subject: "Química", 
//         cost: "20", 
//         weekday: [0], 
//         time_from: 720, 
//         time_to: 1220
//     },
//     {
//         name: "Mayk Brito", 
//         avatar: "https://avatars.githubusercontent.com/u/6643122?v=4", 
//         whatsapp: "999999999", 
//         bio: "Entusiasta das melhores tecnologias de química avançada. Apaixonado por explodir coisas em laboratório e por mudar a vida das pessoas através de experiências. Mais de 200.000 pessoas já passaram por uma das minhas explosões.", 
//         subject: "Química", 
//         cost: "20", 
//         weekday: [0], 
//         time_from: 720, 
//         time_to: 1220
//     },
//     {
//         name: "Rafaella Ballerini", 
//         avatar: "https://avatars.githubusercontent.com/u/54322854?v=4", 
//         whatsapp: "999999999", 
//         bio: "Entusiasta das melhores tecnologias de química avançada. Apaixonado por explodir coisas em laboratório e por mudar a vida das pessoas através de experiências. Mais de 200.000 pessoas já passaram por uma das minhas explosões.", 
//         subject: "Química", 
//         cost: "20", 
//         weekday: [0], 
//         time_from: 720, 
//         time_to: 1220
//     }
// ];

const { subjects, weekdays, getSubject, checkValues, convertHoursToMinutes } = require("./utils/format");

server.get("/", function(req, res) {
    return res.render("index.html");
})
    
server.get("/study", async function(req, res) {
    const filters = req.query;
    if (!filters.subject || !filters.weekday || !filters.time || filters.subject > subjects.length || filters.weekday > (weekdays.length - 1)) {
        return res.render("study.html", { filters, subjects, weekdays });
    }
    const timeToMinutes = convertHoursToMinutes(filters.time);
    const query = `
        SELECT proffys.*, classes.* 
        FROM proffys
        JOIN classes ON (classes.proffy_id = proffys.id) 
        WHERE EXISTS(
            SELECT * FROM class_schedule WHERE class_id = classes.id AND weekday = ${filters.weekday} AND time_from <=  ${timeToMinutes} AND time_to > ${timeToMinutes}
        )
        AND classes.subject = ${filters.subject};
    `
    try {
        const db = await Database;
        const proffys = await db.all(query);
        return res.render("study.html", { proffys, filters, subjects, weekdays });
    } catch (error) {
        console.log(error)
    }
})

server.get("/give-classes", function(req, res) {
    const data = req.query;
    const isNotEmpty = Object .keys(data).length > 0;
    if (isNotEmpty) {
        proffys.push(data);
        data.subject = getSubject(data.subject);
        return res.redirect("/study")
    }
    return res.render("give-classes.html", { subjects, weekdays });
})


const PORT = process.env.PORT||"3000";
server.listen(PORT, function() {
    console.log(`Go to: http://127.0.0.1:${PORT}/`);
})

