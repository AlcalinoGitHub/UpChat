import {firestore} from '$lib/Firebase.js'
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import {hash} from '$lib/cipher.js'
const db = getFirestore();
const database = await getDocs(collection(db, 'Users'));


export async function POST(requestEvent){
    const requestBody = await requestEvent.request.json();
    const username = requestBody.username
    let password = requestBody.password
    password  = await hash(password)
    let auth = false

    database.forEach((user) => {
        let DB_username = (user.data().username)
        let DB_password = (user.data().password)

        if (DB_username === username && DB_password === password){
            console.log('logged')
            auth = true
        }

    })
    return new Response(auth)
}