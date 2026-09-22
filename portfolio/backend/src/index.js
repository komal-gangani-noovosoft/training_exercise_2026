import express from 'express'
import {initializeApp , cert } from 'firebase-admin/app'
import {getFirestore , FieldValue} from 'firebase-admin/firestore'
import cors from 'cors'
import path from 'path'
import {fileURLToPath} from 'url'
import serviceAccount from '../serviceAccountKey.json' with { type: 'json' };

const app = express()
app.use(cors());

app.use(express.json())
app.use(express.urlencoded({extend: true}))

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)
// app.use(express.static(path.join(__dirname , 'public')))

initializeApp({
    credential: cert(serviceAccount)
})

const db = getFirestore()

const PORT = 3000

app.post('/api/contact' , async (req,res)=>{
    try{
        const {name , email , message} = req.body

        if(!name || !email || !message){
            return res.status(400).json({error : 'Fields are missing'})
        }

        const newContact = {
            name , email , message ,
            timestamp : FieldValue.serverTimestamp()
        }

        const newData = await db.collection('contact').add(newContact)
        res.status(201).json({success:true , newData})
    }catch (e) {
        res.status(500).json({error: e.message})
    }
})

app.get('/api/contact' , async (req,res) => {
    const data = await db.collection('contact').get();
    const mail = new Set()

    const contactList = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const uniqueContacts = contactList.filter(contact => {
        if (!mail.has(contact.email)) {
            mail.add(contact.email)
            return true
        }
        return false
    })

    res.status(200).json(uniqueContacts)
})

app.get('/api/contact/message' , async (req,res)=>{
    const data = await db.collection('contact').orderBy('timestamp','desc').get()

    const messages = data.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    res.status(200).json(messages)
} )

app.listen(PORT , ()=>{
    console.log("Server is running")
})

