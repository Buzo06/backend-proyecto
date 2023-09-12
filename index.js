import express from 'express'
import cors from 'cors'
import { initializeApp } from 'firebase/app'
import {getFirestore, collection, getDocs, addDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA7M1gAk0gyArwALjhdnBc1c4EaPveAwr0",
    authDomain: "proyecto-backfront-723a8.firebaseapp.com",
    projectId: "proyecto-backfront-723a8",
    storageBucket: "proyecto-backfront-723a8.appspot.com",
    messagingSenderId: "606372485569",
    appId: "1:606372485569:web:a4795c72b5191632323740"
  }

  const firebase = initializeApp(firebaseConfig)
  const db = getFirestore( firebase )

// settings de la app
const app = express()
app.use(express.json())
app.use(cors())

//creacion de rutas
app.get('/', async(rq,res)=>{
    try{
        const Users = await collection(db, 'Users')
        const listUsers = await getDocs(Users)
        const aux = []
        listUsers.forEach((doc) =>{
            const obj = {
                id: doc.id,
                ...doc.data()
            }
            aux.push(obj)
        })
        res.send({
        'msg': 'success',
        'data': aux
    })
    } catch (error){
        res.send({
            'msg': 'error',
            'data': error
        })
    }
})

app.post('/create', async (req, res)=>{
    try{
        const body = req.body
        const Users = await collection(db, 'Users')
        await addDoc(Users, body)
        res.send({
            'msg':'success'
        })
    }catch(error){
        res.send({
            'msg': 'error',
            'data': error
        })
    }
})

app.get('/delete/:id', async(req,res) =>{
    console.log('@@@ param => ', req.params.id)
    const id = req.params.id
    try{
        await deleteDoc(doc(db, 'Users', id))
        res.end({
            'msg': 'user deleted'
        })
    }catch (error){
        res.send({
        'msg': 'error',
        'data': error
        })
    }
})

app.get('/get-update/:id', async (req, res) =>{
    
    const id = req.params.id

    const userRef = doc(db, 'Users', id)
    const user = await getDoc(userRef)

    if (user.exists()){
        res.send({
            'msg': 'success',
            'data': user.data()
        })
    } else{
        res.send({
            'msg': 'user doesnt exist'
        })
    }
})

//prendemos el servidor
app.listen(9000, () =>{
    console.log('Servidor trabajando')
})