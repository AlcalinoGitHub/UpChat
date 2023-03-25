import {firestore} from '$lib/Firebase.js'
import { getFirestore, collection, getDocs, updateDoc, arrayUnion, doc as firestoreDoc} from 'firebase/firestore';
const db = getFirestore();
const usersRef = collection(db, 'Chats');

    /*TODO: 
        Implement sending new messages to the database
        */

function validateChats(Db_Users, ClientUsers){
    for (var i = 0; i < Db_Users.length; i++){
        if (Db_Users[i] != ClientUsers[i]){return false}
    }
    return true;
}


export async function POST(requestEvent){
    
    const requestBody = await requestEvent.request.json();
    const reqUsers = requestBody.Users
    console.log(reqUsers)

    const querySnapshot = await getDocs(usersRef);
    const chats = querySnapshot.docs.map(doc => doc.data());
    
    let Exists = false
    let ChatData;


    chats.forEach((chat) => {
        let users = chat.Users
        let DB_users = users
        try{
            DB_users.sort()
            reqUsers.sort()
            if (validateChats(DB_users, reqUsers)){
                Exists = true;
                ChatData = chat
            }
        } catch {console.log('Exception ocurred while validating chats');return new Response(500)}
    });

    if (Exists){
        console.log('reutning existing chat')
        return new Response(JSON.stringify(ChatData));
    }

    let User1 = reqUsers[0]
    let User2 = reqUsers[1]

    let NewChat = {
        Messages: [],
        Users: [User1, User2]
    }
    if (!Exists){
        console.log('No chat found. Returning new Chat')
        const ChatRef = firestore.collection('Chats').doc()
        await ChatRef.set(NewChat);
    }


    return new Response (JSON.stringify(NewChat))
}


export async function PATCH(requestEvent) {
    const requestBody = await requestEvent.request.json();
    const querySnapshot = await getDocs(usersRef);
    const reqUsers = requestBody.users;
    const sender = requestBody.sender;
    const message = requestBody.text;
    let chatRef;
  
    querySnapshot.forEach((doc) => {
      const chat = doc.data();
      const users = chat.Users;
      const DB_users = users.slice().sort();
      const reqUsersSorted = reqUsers.slice().sort();

      if (validateChats(DB_users, reqUsersSorted)) {
        console.log('found chat');
        chatRef = doc.id;
        console.log(chatRef);
        const chatDocRef = firestoreDoc(usersRef, chatRef);
        
        updateDoc(chatDocRef, {
            Messages: arrayUnion({
                sender: sender,
                text: message,
                timestamp: new Date().toISOString(),
            })

        })
        return new Response('Added message');

      }
    });
    return new Response(200);
  }

export async function DELETE(requestEvent){
    const requestBody = await requestEvent.request.json();
    console.log(requestBody)
    const querySnapshot = await getDocs(usersRef);
    const reqUsers = requestBody.users;
    const sender = requestBody.mesg.sender;
    const message = requestBody.mesg.text;
    const time = requestBody.mesg.timestamp

    querySnapshot.forEach((doc) => {
        const chat = doc.data();
        const users = chat.Users;
        const DB_users = users.slice().sort();
        const reqUsersSorted = reqUsers.slice().sort();
  
        if (validateChats(DB_users, reqUsersSorted)) {
          console.log('found chat');
          let chatRef = doc.id;
          console.log(chatRef);
          const chatDocRef = firestoreDoc(usersRef, chatRef);
          const messages = chat.Messages;
          const messageIndex = messages.findIndex((m) => m.sender === sender && m.text === message && m.timestamp === time);
          if (messageIndex !== -1) {
            // Remove the message from the Messages array
            messages.splice(messageIndex, 1);
    
            // Update the chat document with the updated Messages array
            updateDoc(chatDocRef, {Messages: messages})
          }

  
        }
      });

    return new Response(200)
}