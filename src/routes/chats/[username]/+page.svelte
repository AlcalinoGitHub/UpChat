<script>
    import './chat.css'
    import Cookies from 'js-cookie';
    import {page} from "$app/stores"
    import { onMount} from 'svelte';
    import { writable } from 'svelte/store';

    let Chatuser = $page.params.username
    const auth = Cookies.get('auth');
    let reqData = {Users: [auth, Chatuser]}


    let ChatData  = writable([])
    
    async function fetchChatData() {
        const response = await fetch('/chats', {
        method: 'POST',
        body: JSON.stringify(reqData)
        });
        const data = await response.json();
        const { Messages } = data;
        ChatData.set(Messages);
  }


    onMount(async () => {
        fetchChatData();
        const interval = setInterval(fetchChatData, 2000);
        return () => clearInterval(interval);
    })

    function SendMessage(){
        let senders = [Chatuser, auth]
        let message = document.getElementById('Message')
        message = message.value
        let reqBody = {
            users: senders,
            text: message,
            sender: auth,
            timestamp: new Date().toISOString(),
        }
        fetch('/chats', {
            method: 'PATCH',
            body: JSON.stringify(reqBody)
        })

        ChatData.update(arr => [...arr, reqBody])
        let form = document.getElementById('sendMessage')
        form.reset();
    }


    function eraseMessage(toDelete){
        console.log(toDelete)
        let senders = [Chatuser, auth]
        let eraseData = {
            mesg: toDelete,
            users: senders,
        }
        fetch('/chats', {
            method: 'DELETE',
            body: JSON.stringify(eraseData)
        })
        fetchChatData()
        ChatData.set(Messages)
    
    }




</script>


<div class = 'chatMessages'>
    <div class = 'chat'>
            {#each $ChatData as message}
                {#if message.sender == auth}
                    <div class = 'own'>
                        {message.sender}:{message.text}<br> {new Date(message.timestamp).getHours()}:{new Date(message.timestamp).getMinutes()} <br> 
                        <button on:click={eraseMessage(message)}>delete</button><br> <br> 
                    </div>
                {:else}
                    <div class = 'other'>
                        {message.sender}:{message.text}<br> {new Date(message.timestamp).getHours()}:{new Date(message.timestamp).getMinutes()} <br> <br>
                    </div>
                {/if}
            {/each}
        </div>
        <form on:submit={SendMessage} class = 'sendMessage' id = 'sendMessage'>
            <textarea name = 'Message' id = 'Message' cols = '100'></textarea>
            <input type = 'submit'>
        </form>
</div>


