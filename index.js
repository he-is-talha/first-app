import express from 'express'
const PORT = 3000


const app = express();
app.use(express.json());



app.get('/health',(req,res)=>{
    res.status(201).json("Good health")
})

app.get('/api/hello',(req,res)=>{
    res.status(200).json("Hello World")
})

app.listen(PORT, ()=>{
    console.log(`Server Running on PORT:${PORT}`)
})

