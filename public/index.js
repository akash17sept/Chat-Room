var connectionOptions={
    "force new connection":true,
    "reconnectionAttempts":"Infinity",
    "timeout":10000,
    "transports":["websocket"]
}

this.socket= io.connect("http://localhost:3001",connectionOptions)

var loginPage = document.getElementById("login-page")
var username = document.getElementById("username")
var chatDiv = document.getElementById("chat-div")
var btnSubmit = document.getElementById('btn-submit')
var userkey = document.getElementById('key')
var disconectUser = document.getElementsByClassName("disconnect-user")
var chatDivUser = document.getElementById('chat-div-user')
var chatMessage = document.getElementById('chat-message')
var messageInput = document.getElementById("message")
var leaveBtn = document.getElementById('leave-btn')
var sendBtn = document.getElementById('send-btn')

username.addEventListener('click',function(){
    if(window.localStorage){
        if(localStorage.getItem('reload')){
            localStorage['reload']=true
            window.location.reload()
        }else{
            localStorage.removeItem('reload')
        }
    }
})

function appendUsers(userArr){
    var count = 0;
    if(disconectUser.length !=0){
        for(var i=0;i<disconectUser.length;i++){
            if(disconectUser[i].innerText === userArr){
                disconectUser[i].className = "active-user"
                count++
            }
        }
    }
    if(count === 0){
        let userlist = document.createElement('li')
        userlist.className="list-user"
        userlist.innerHTML=userArr
        let userlistSpan = document.createElement('span')
        userlistSpan.className="active-user"
        userlist.appendChild(userlistSpan)
        chatDivUser.appendChild(userlist)
        chatDivUser.scrollTop = chatDivUser.scrollHeight
    }
}

function appendMessage(message,name){
    let containerDiv = document.createElement('div')
    let senderName = document.createElement('h4')
    senderName.innerHTML = name
    // containerDiv.appendChild(senderName)
    let senderMessage = document.createElement('span')
    senderMessage.innerHTML = " "+message
    senderName.appendChild(senderMessage)
    containerDiv.appendChild(senderName)
    chatMessage.appendChild(containerDiv)
}

btnSubmit.addEventListener("click",function(){
    if(username.value === '' ||userkey.value ===''){
        return alert("All fildes required")
    }
    else {
        var seacretKey = "123456"
        if(seacretKey !== userkey.value) {
            alert("Invalid Key")
        }
        else {
            const getUser = username.value
            console.log(getUser)
            socket.on('userJoin',getUserList=>{
                for(var i=0; i<Object.values(getUserList).length; i++){
                    appendUsers(Object.values(getUserList)[i])
                }
            })
            appendMessage(" Joined to group","You")
            socket.emit("new-user",getUser)
            username.value = "";
            userkey.value ="";
            loginPage.style.display="none";
            chatDiv.style.display="block";
        }
    }
})

socket.on('user-connected',function(users){
    appendUsers(users)
    appendMessage(` joined to group chatRoom`,`${users}`)
})

sendBtn.addEventListener("click",function(e){
    e.preventDefault()
    if(messageInput.value ===""){
        alert("can't send empty message")
    }
    else {
        const getMessage = messageInput.value
        appendMessage(getMessage,"You")
        socket.emit("send-message",getMessage)
        messageInput.value=""
        // messageInput.focus()
    }
})

socket.on('chat-message',function(msg) {
    appendMessage(msg.message,msg.name)
})

leaveBtn.addEventListener('click',function(){
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?')
    if(leaveRoom){
        loginPage.style.display="block"
        chatDiv.style.display="none"
        socket.emit('user-disconnect')
    }
})

socket.on('user-disconnected',function(name){
    // var disconnectedUser = document.getElementById('active-user')
    var listuser = document.getElementsByClassName("list-user")
    console.log(name)
    for(var i=0; i<listuser.length; i++){
        console.log(listuser[i].innerText)
        if(listuser[i].innerText === name){
            listuser[i].value = `${name}<span class="disconnected-user"></span>`
        }
    }
    appendMessage(`${name} left`,'ChatRoom')
})