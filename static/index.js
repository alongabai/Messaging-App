$(function() {
    var div = $('#background');
    var innerdiv = $('#chat');
    var width = div.outerWidth();
    var innerwidth = innerdiv.outerWidth();
    var blur = $('.blur');
    div.css('width', width);
    div.css('height', width*0.515);
    innerdiv.css('width', innerwidth);
    innerdiv.css('height', width*0.45);
    blur.css('width', $('#inside').outerWidth());
    blur.css('height', $('#inside').outerHeight());
    blur.css('top', $('#inside').offset().top);
    blur.css('left', $('#inside').offset().left);
});
myStorage = window.localStorage;


document.addEventListener('DOMContentLoaded', load);
    // Load next set of posts.
var channel = myStorage.getItem('lastChannel');
var usernamename = myStorage.getItem('myName');

$(function() {
    if (usernamename != null){
        change_name_close();
    }
    else{
        $('#back-button').hide();
    }
});

$(function() {
    if (channel == null){
        channel=0;
    }
});

function load() {
    //connect to web socket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    socket.on('connect', () => {
        socket.emit('setup', {'channel': channel});

        document.querySelector('#sendmessage').onsubmit = () =>{
            const selection = document.querySelector('#post-message').value;
            if (selection!=""){
                socket.emit('submit message', {'channel': channel, 'name': usernamename, 'Message': selection});
            }
            return false;
        };

        document.querySelector('#namechange').onsubmit = () =>{
            alert("name changed");
            usernamename = document.querySelector('#name').value;
            document.querySelector('#name').value = "";
            myStorage.setItem('myName', usernamename);
            change_name_close();
            return false;
        };

        document.querySelectorAll('.chatroom').forEach(button => {
            button.onclick = () => {
                const selection = button.dataset.channel;
                socket.emit('change channel', {'name': selection});
            };
        });

        document.querySelector('#addchannel').onsubmit = () =>{
            alert("new channel");
            channelname = document.querySelector('#channelname').value;
            document.querySelector('#channelname').value = "";
            socket.emit('add channel', {'ChannelName': channelname});
            add_channel_close();
            return false;
        };
    });

    $('#search').on("keyup", function(){
        var value = $('#search').val();
        if (value!=""){
            $('.chatroom').each( function(index, buttonvalue){
                if (!buttonvalue.innerHTML.toLowerCase().includes(value.toLowerCase())){
                    buttonvalue.style.display='none';
                }
            });
        }
        if (value==""){
            $('.chatroom').each( function(index, buttonvalue){
                buttonvalue.style.display=null;
            });
        }
    });

    socket.on("change the channel", messages => {
        channel = messages["index"];
        myStorage.setItem('lastChannel', channel);
        document.getElementById("message-list").innerHTML = "";
        messages["channel"].forEach(setup);
        var messageBody = document.querySelector('#chat');
        messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
    });

    socket.on('all messages', messages => {
        if (messages.channel == channel){
            add_post(messages);
        }
    });

    socket.on('Error-Channel-Name', name =>{
       alert(name["channelName"]+" already exists, please try again") ;
    });

    socket.on('setup', messages => {
        message = messages["channel"];
        message.forEach(setup);
        var messageBody = document.querySelector('#chat');
        messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
    });

    socket.on('add channel', name =>{
       const channelName = document.createElement('button');
       channelName.className = "chatroom";
       channelName.innerHTML = name["channelName"];
       channelName.dataset.channel = name["channelName"];
       $('#newchannelbutton').before(channelName);
        document.querySelectorAll('.chatroom').forEach(button => {
            button.onclick = () => {
                const selection = button.dataset.channel;
                socket.emit('change channel', {'name': selection});
            };
        });
    });
};

// Add a new post with given contents to DOM.
function setup(contents) {
    const name = document.createElement('span');
    const message=document.createElement('div');
    const post = document.createElement('span');
    if (contents.name!=usernamename){
        name.className = 'sender';
        message.className='message-box';
        post.className = 'message';
    }
    if (contents.name===usernamename){
        name.className = 'sender-local';
        message.className='message-box-local';
        post.className = 'message';
    }
    name.innerHTML = "&nbsp"+contents.name;
    post.innerHTML = "&nbsp&nbsp&nbsp&nbsp&nbsp"+contents.Message;
    const breaking = document.createElement('br');
    message.appendChild(name);
    message.appendChild(breaking);
    message.appendChild(post);
    const listitem = document.createElement('li');
    listitem.appendChild(message);
    // Add post to DOM.
    document.querySelector('#message-list').append(listitem);
};

function add_post(contents){
    const name = document.createElement('span');
    name.innerHTML = "&nbsp"+contents.name;
    name.className = 'sender-local';
    // Create new post.
    const message=document.createElement('div');
    message.className='message-box-local';
    const post = document.createElement('span');
    post.innerHTML = "&nbsp&nbsp&nbsp&nbsp&nbsp"+contents.Message;
    post.className = 'message';
    const breaking = document.createElement('br');
    message.appendChild(name);
    message.appendChild(breaking);
    message.appendChild(post);
    const listitem = document.createElement('li');
    listitem.appendChild(message);
    // Add post to DOM.
    document.querySelector('#message-list').append(listitem);
    document.querySelector('#post-message').value = "";
    var messageBody = document.querySelector('#chat');
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
};

function change_name_close(){
    var element = document.getElementById("close");
    element.style.display='none';
    return false;
};

function change_name_open(){
    var element = document.getElementById("close");
    element.style.display=null;
    return false;
};

function add_channel_close(){
    var element = document.getElementById("closeChannel");
    element.style.display='none';
    return false;
}

function add_channel(){
    var element = document.getElementById("closeChannel");
    element.style.display=null;
    return false;
}

