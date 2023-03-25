<script>
    import { onMount } from 'svelte';
    import Cookies from 'js-cookie';
    import { writable } from 'svelte/store';

    const auth = Cookies.get('auth');

    function logout(){
        Cookies.remove('auth')
        window.location.href = '/'
    }
    const fetchedData = writable([]);

    function getData(data){
        data.forEach(item => {
            fetchedData.update(storeValue => [...storeValue, item.username]);
        });

    }

    onMount(async () => {
        const request = new XMLHttpRequest()
        request.open('GET', '/')
        request.send()
        request.onload = () => {
            //console.log(JSON.parse(request.response))
            getData(JSON.parse(request.response))
        }
    })

 


</script>


<h1>UpChat</h1>

{#if auth && auth.length > 0}
    <div>Welcome {auth}</div>
    <div on:click={logout}>LogOut</div>
    <br>

    <div id = 'users'>
    {#each $fetchedData as user}
        {#if user != auth}
            <div class = 'element'>
                <div>{user}</div>
                <a href = "/chats/{user}">Chat</a>
                <br>
            </div>
        {/if}
    {/each}
    </div>

 
{:else}
    <a href = '/register'>register</a> <a href = '/login'>login</a>
{/if}


