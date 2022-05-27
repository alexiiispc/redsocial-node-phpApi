const path = require("path")
const express = require("express")
const app = express()
const cors = require('cors');

const SOcketIO = require("socket.io");
const res = require("express/lib/response");

//files
app.use(express.static(path.join(__dirname, "public")))



//settings 
app.set("port", process.env.PORT || 3000);
//star server
const server = app.listen(app.get("port"), () =>{
    console.log("server port:", app.get("port"));
})
const io = SOcketIO(server)



// ---------RUTAS

//HOME
app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, "public/home.html"))
})


//AUTH
app.get("/auth", (req,res)=>{
    res.sendFile(path.join(__dirname, "public/pages/login.html"))
})


//PROFILESS
app.get("/profile", (req, res)=>{
    res.sendFile(path.join(__dirname, "public/pages/profile.html"))
})


//CHAT 
app.get("/chat", (req,res)=>{
    res.sendFile(path.join(__dirname, "public/pages/chat.html"))
})


// CHAT MOVIL INDIVIDUAL
app.get("/c/:token_user", (req, res)=>{
    var token_user = req.params.token_user;
    
    
    res.sendFile(path.join(__dirname, "public/pages/subpages/c.html"))
})


// SERVIDOR DE RESPUESTAS

io.on('connection', (socket)=>{
    console.log("new connection");


    // LISTEN POST 
    socket.on("post:users", (data)=>{
        io.sockets.emit("post:users", data);

        
    })

    socket.on("chat:user", (data)=>{
        socket.broadcast.emit("chat:user", data)
    })

    
    

    socket.on("get:comments", (data)=>{
        io.sockets.emit("get:comments", (data));
    })
    socket.on("chat:sticker", (data)=>{
        socket.broadcast.emit("chat:sticker", data)
    })

    


})