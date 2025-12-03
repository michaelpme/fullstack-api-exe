const express= require("express");
const morgan = require("morgan")
const app = express();
const PORT= 3001



let phonebook=[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const requestLogger = (request,response,next) =>{
    console.log("Method:", request.method)
    console.log("Path:", request.path)
    console.log("Body:", request.body)
    console.log("---")
    next()
}
// morgan.token("body",(req,res)=>{return `{"name":${req.body.name},"number":${req.body.number}}`})

morgan.token("body",(req,res)=>{return JSON.stringify(req.body)})


app.use(express.json());
// app.use(requestLogger)
app.use(morgan((tokens,req,res)=>{
    return [
        tokens.method(req,res),
        tokens.url(req,res),
        tokens.status(req,res),
        tokens.res(req,res,"content-length"), "-",
        tokens["response-time"](req,res),"ms",
        tokens.body(req,res)
    ].join(" ")
}))


app.get("/api/persons",(request,response)=>{
    response.json(phonebook)   
})
 
// Try to fix the string if time allows
app.get("/info",(request,response)=>{

    response.send(`Phonebook has info for ${phonebook.length} people` + "\n" + `${new Date()}`)
})

app.get("/api/persons/:id",(request,response)=>{
    id=request.params.id
    console.log(request)
    console.log("test")
    requestedObj= phonebook.find(item => item.id===id);
    if(requestedObj){
        response.json(requestedObj)
    }else{
        response.status(204).end() 
    }
})


app.delete("/api/persons/:id",(request,response)=>{
    id=request.params.id;
    phonebook= phonebook.filter(item => item.id!==id)
    response.status(202).end()
})

app.post("/api/persons/",(request,response)=>{
    const req = request.body;
    let listName= phonebook.map(item => item.name)
    if(!req.name){
      return response.status(400).json({
            error:"Name is required"
        })

    }else if(!req.number){
        return response.status(400).json({
            error:"Number is required"
        })

    }else if(listName.includes(req.name)){
        return response.status(404).json({
            error:"Name must be unique"
        })
    }
    else{
        phonebook.push({
            "id": (Math.floor(Math.random()*10000)),
            "name": request.body.name, 
            "number": request.body.number
        })
        response.status(200).end()
    }
})

const unknownEndpoint = (request,response)=>{
    response.status(404).send({error:"unknown endpoint"})
}

app.use(unknownEndpoint)

app.listen(PORT,(err)=>{
    console.log(`server is running on port ${PORT}`)
}) 