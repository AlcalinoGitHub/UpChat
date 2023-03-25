import {firestore} from '$lib/Firebase.js'
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import {hash} from '$lib/cipher.js'
const db = getFirestore();
const usersRef = collection(db, 'Users');

export async function GET(){
    const querySnapshot = await getDocs(usersRef);
    const users = querySnapshot.docs.map(doc => doc.data());
    return new Response(JSON.stringify(users));
}


export async function POST(requestEvent){
    console.log('posted')
    return new Response('Posted')
}

