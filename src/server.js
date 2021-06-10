const express = require("express");
const server = express();
const nunjucks = require("nunjucks");
nunjucks.configure('src/views',{
    express: server,
    noCache: true
})

server.use(express.static("public"));

const proffys = [
    {
        name: "Diego Fernandes", 
        avatar: "https://avatars2.githubusercontent.com/u/2254731?s=460&amp;u=0ba16a79456c2f250e7579cb388fa18c5c2d7d65&amp;v=4", 
        whatsapp: "999999999", 
        bio: "Entusiasta das melhores tecnologias de química avançada. Apaixonado por explodir coisas em laboratório e por mudar a vida das pessoas através de experiências. Mais de 200.000 pessoas já passaram por uma das minhas explosões.", 
        subject: "Química", 
        cost: "20", 
        weekday: [0], 
        time_from: 720, 
        time_to: 1220
    },
    {
        name: "Mayk Brito", 
        avatar: "https://avatars.githubusercontent.com/u/6643122?v=4", 
        whatsapp: "999999999", 
        bio: "Entusiasta das melhores tecnologias de química avançada. Apaixonado por explodir coisas em laboratório e por mudar a vida das pessoas através de experiências. Mais de 200.000 pessoas já passaram por uma das minhas explosões.", 
        subject: "Química", 
        cost: "20", 
        weekday: [0], 
        time_from: 720, 
        time_to: 1220
    },
    {
        name: "Rafaella Ballerini", 
        avatar: "https://avatars.githubusercontent.com/u/54322854?v=4", 
        whatsapp: "999999999", 
        bio: "Entusiasta das melhores tecnologias de química avançada. Apaixonado por explodir coisas em laboratório e por mudar a vida das pessoas através de experiências. Mais de 200.000 pessoas já passaram por uma das minhas explosões.", 
        subject: "Química", 
        cost: "20", 
        weekday: [0], 
        time_from: 720, 
        time_to: 1220
    }
];

server.get("/", function(req, res) {
    return res.render("index.html");
})

server.get("/study", function(req, res) {
    return res.render("study.html", { proffys });
})

server.get("/give-classes", function(req, res) {
    return res.render("give-classes.html");
})


const PORT = process.env.PORT||"3000";
server.listen(PORT, function() {
    console.log(`Go to: http://127.0.0.1:${PORT}/`);
})

