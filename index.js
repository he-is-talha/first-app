import express from 'express'
const PORT = 3000


const app = express();
app.use(express.json());



app.get('/health',(req,res)=>{
    res.status(201).json("Good health")
})

app.listen(PORT, ()=>{
    console.log(`Server Running on PORT:${PORT}`)
})