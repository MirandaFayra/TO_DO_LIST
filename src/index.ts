import express,{Request,Response} from 'express'
import cors from 'cors'
import {AddressInfo} from 'net'
import {connection} from './connection'

const app = express()

type User ={
    name:string,
    nickname:string,
    email:string
}

type Task ={
    title : string,
	description : string,
	limitDate : string,
    creatorUserId:number
}


app.use(express.json())
app.use(cors())


//Create User

app.post('/user',async(req:Request,res:Response)=>{
    const reqBody = req.body
    try{
        
        if(!reqBody.name || !reqBody.nickname || !reqBody.email ){
            throw new Error ('Please, check your information! You need complete all! of then!')
        }
        const newUser: User = {
            name : reqBody.name,
            nickname : reqBody.nickname,
            email : reqBody.email
        }
        await connection('TodoListUser').insert(newUser)
        res.status(200).send(`User ${newUser.name} created successfully! `)

    }catch(error){
        res.status(400).send({message:error.message})
        console.log({message:error.message})
    }
})

//Create Task

app.post('/task',async(req:Request,res:Response)=>{
    const reqBody = req.body
    try{
        const newTask: Task ={
            title : reqBody.title,
            description : reqBody.description,
            limitDate : reqBody.limitDate,
            creatorUserId:reqBody.creatorUserId
        }
        await connection('TaskTable').insert(newTask)
        res.status(200).send(`Task ${newTask.title} created successfully! `)
    }catch(error){
        res.status(400).send({message:error.message})
        console.log({message:error.message})
    }
})

//Update User

app.put('/user/edit/:id',async(req:Request,res:Response)=>{
    try{
        const reqBody = req.body
        if(!reqBody.name){
            throw new Error ('Please, check your information! You need complete your  user name!')
        }

        if(!reqBody.nickname){
            throw new Error ('Please, check your information! You need complete your  user nickname!')
        }

        if(!reqBody.email){
            throw new Error ('Please, check your information! You need complete your  user email!')
        }

        const userUpdate : User = {
            name : reqBody.name,
            nickname : reqBody.nickname,
            email : reqBody.email
        }
        const idParams = req.params.id
        await connection('TodoListUser').update(userUpdate).where({id:idParams})
        res.status(200).send(`User ${userUpdate.name} updated successfully! `)

    }catch(error){
        res.status(400).send({message:error.message})
        console.log({message:error.message})
    }
})

// Get Users

app.get('/user/all',async(req:Request,res:Response)=>{
    try{
        const result = await connection('TodoListUser').select('*')
        res.send(result)
    }catch(error){
        res.status(400).send({message:error.message})
        console.log({message:error.message})
    }
})

//Get User by Id

app.get('/user/:id',async(req:Request,res:Response)=>{
    if(!req.params.id){
        throw new Error('User id is required!Please, insert the id you wish to search!')}
    try{
        const idParams = req.params.id
        const result = await connection('TodoListUser').select('id','name').where({id:idParams})
        res.send(result)
    }catch(error){
        res.status(400).send({message:error.message})
        console.log({message:error.message})
    }
})

//Get tesk by Id
app.get('/task/:id',async(req:Request,res:Response)=>{
    if(!req.params.id){
        throw new Error('Task id is required!Please, insert the id you wish to search!')}
    try{
        const idParams = req.params.id
        const result = await connection('TaskTable').select('*').where({task_id :idParams})
        res.send(result)
    }catch(error){
        res.status(400).send({message:error.message})
        console.log({message:error.message})
    }
})

//Server

const server = app.listen(process.env.PORT || 3003, () => {
    if (server) {
        const address = server.address() as AddressInfo;
        console.log(`Server is running in http://localhost: ${address.port}`);
    } else {
        console.error(`Failure upon starting server.`);
    }
})