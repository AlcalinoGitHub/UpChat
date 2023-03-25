import {firestore} from '$lib/Firebase.js'
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import {hash} from '$lib/cipher.js'
const db = getFirestore();
const database = await getDocs(collection(db, 'Users'));



export async function POST(requestEvent){
    console.log('register')
    const requestBody = await requestEvent.request.json();
    const username = requestBody.username
    let password = requestBody.password
    password  = await hash(password)

    let user = {
        Friends: [],
        Notifications: [],
        password: password,
        username: username
    }
    let Avalible = true

    

    database.forEach((doc) => {
        let DB_username = (doc.data().username)
        if (username.toLowerCase() === DB_username.toLowerCase()) {Avalible = false};
    })

    if (Avalible){
    const userRef = firestore.collection('Users').doc(username)
    await userRef.set(user);
    }

    return new Response(Avalible);
}