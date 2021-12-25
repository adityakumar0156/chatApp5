const socket = io('http://localhost:8000', { transports: ['websocket'] });


const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

let users = [];
//JUGAAAD//
document.getElementById('microphone').value = 0;
//******************/

let name, room, socketId, connection, peerId, myStream, peerIdNames;;
let streamingStatus = {};
let microphone_switch = false;
let mic_status_users = {};

const peer = new Peer(undefined, {
    path: 'peerjs',
    host: '/',
    port: 5500 || process.env.PORT,
    // port: ''

})

let videoGrid = document.getElementById('vids');
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

let peers;


while (true) {

    name = prompt("Enter your name to join:");
    if (name) {
        break;
    }
}

while (true) {
    room = prompt("Enter your room name:");
    if (room) {
        break;
    }
}

const userBtn = document.getElementById('users');
userBtn.innerText = "Connecting...🖐";






peer.on('open', id => {
    peerId = id;
    console.log("peer opened..!!!", id);
    // peers[peerId] = "0156";
    // socket.emit('peer-found', name, id, room);
    socket.emit('new-user-joined', name, room, id);
})

// socket.on('add-peer', (userName, peerId) => {
//     peers[peerId] = userName;
//     console.log("peer added..!!!", peers);
// })

const textInput = document.getElementById('messageInp');
textInput.addEventListener('keypress', (e) => {
    socket.emit('type', name, room);
})


const showRoom = document.getElementById('offcanvasRightLabel');
showRoom.innerHTML += room;


const beep = new Audio('./static/media/whatsapp.mp3');
const entry = new Audio('./static/media/whatsappweb.mp3');
const left_mp3 = new Audio('./static//media/beep.mp3');
const send_mp3 = new Audio('./static/media/mac_os_morse.mp3');
const keypress = new Audio('./static/media/keypress.mp3');
const confailed = new Audio('./static/media/notification_2.mp3');
const consucceeded = new Audio('./static/media/notification (1).mp3');
const streaming = new Audio('./static/media/voiceStreming2.mp3');
const stopedstreaming = new Audio('./static/media/voiceStreming.mp3');
const clicked_mp3 = new Audio('./static/media/click_sound.mp3');



const getFstName = (name) => {
    let str = name.trim();
    let arr = str.split(" ");
    str = arr[0];
    return str;
}


const append = (name, message, position) => {

    const messageElement = document.createElement('div');
    const nameElement = document.createElement('div');
    const timeElement = document.createElement('div');

    timeElement.innerText = new Date().toLocaleString();
    nameElement.innerText = name;
    messageElement.innerText = message;

    nameElement.classList.add('name');
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    timeElement.classList.add('time');

    messageElement.append(timeElement);
    messageElement.append(nameElement);
    messageContainer.append(messageElement);

    //scroll to bottom 
    messageContainer.scrollTop = messageContainer.scrollHeight;
}
const append_joined = (name) => {

    const messageElement = document.createElement('div');
    const timeElement = document.createElement('div');

    timeElement.innerText = new Date().toLocaleString();
    messageElement.innerText = name;
    messageElement.classList.add('joined');
    timeElement.classList.add('time');
    messageElement.classList.add('message');
    messageElement.append(timeElement);
    messageContainer.append(messageElement);

    //scroll to bottom 
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

const append_top = (name) => {

    const userBtn = document.getElementById('users');
    userBtn.innerText = `${getFstName(name)} is Typing..✍`;

    keypress.play();

    setTimeout(() => {
        const userBtn = document.getElementById('users');
        count = 0;
        let str = '';
        users.forEach(element => {
            count = count + 1;
            str = str + element + "\n";
        });
        if (count > 1) {
            userBtn.innerText = "Online Users: " + (count - 1) + "🙋‍♂️";
        } else {
            userBtn.innerText = 'No one is Online';

        }
    }, 2500);

}

const update_users_modified_fun = (userName, peerIdNames) => {
    console.log('update_users_modified_fun...fired!!');
    const userList = document.getElementById('userList');
    let str = `<img id="send" width="37px" height="37px" src="./static/media/happy.png" />&nbsp&nbsp
    <b>Online Users :</b> <br><br>`;
    count = 0;
    userName.forEach(element => {
        count = count + 1;

    });

    //logic of showing users list in appropriate way :)

    for (let key in peerIdNames) {
        if (peerIdNames.hasOwnProperty(key)) {

            if (key == peerId) {

                if (mic_status_users[key] == true) {
                    str += `<img id="microphone2"   width="22px" height="22px" value=0 src="./static/media/microphone.png" />` + peerIdNames[key] + '(You)<br>';
                } else {
                    str += `<img id="microphone2"   width="22px" height="22px" value=0 src="./static/media/mute.png" />` + peerIdNames[key] + '(You)<br>';
                }
            } else {
                if (mic_status_users[key] == true) {
                    str += `<img id="microphone2"   width="22px" height="22px" value=0 src="./static/media/microphone.png" />` + peerIdNames[key] + '<br>';
                } else {
                    str += `<img id="microphone2"   width="22px" height="22px" value=0 src="./static/media/mute.png" />` + peerIdNames[key] + '<br>';
                }
            }


        }
    }

    console.log(str);
    //***************************************************/
    const leave = `<a type="button" onClick=click_mp3() class="btn btn-success my-2" href="/" style="font-size:100%;">Leave Room <img width="40px" height="40px" src="./static/media/close.png" alt="" >
    </a>`;
    const about = `<hr>  <img id="send" width="45px" height="45px" src="./static/media/whatsapp.png" />&nbsp&nbsp&nbsp&nbsp<b>ChatApp</b><p style="font-size:78%;"> &nbsp&nbsp&nbsp&nbsp &nbsp&nbsp&nbsp&nbsp &nbsp&nbsp&nbsp&nbsp &nbsp&nbsp&nbsp&nbsp &nbsp&nbsp&nbsp&nbspDeveloped By Aditya</p>`;
    userList.innerHTML = str + "<br>" + leave + "<br>" + about;
    const userBtn = document.getElementById('users');
    if (count > 1) {
        userBtn.innerText = "Online Users: " + (count - 1) + "🙋‍♂️";
    } else {
        userBtn.innerText = 'No one is Online🙁';
    }
}






const update_users = (userName) => {

    const userList = document.getElementById('userList');
    let str = `<img id="send" width="37px" height="37px" src="./static/media/happy.png" />&nbsp&nbsp
    <b>Online Users :</b> <br><br>`;
    count = 0;
    userName.forEach(element => {
        count = count + 1;

    });
    let flag = 0;
    for (let element in userName) {
        if (userName[element] != name) {
            str = str + userName[element] + "<br>";
        } else if (userName[element] == name) {
            if (flag == 0) {
                str = str + userName[element] + " (<b>You</b>) <br>";
                flag = 1;
            } else {
                str = str + userName[element] + "<br>";
            }
        }
    }
    console.log(str);
    const leave = `<a type="button" onClick=click_mp3() class="btn btn-success my-2" href="/" style="font-size:100%;">Leave Room <img width="40px" height="40px" src="./static/media/close.png" alt="" >
    </a>`;
    // const voice_stream = `<a type="button" class="btn btn-success" onClick=voiceStream() id="stream-btn" style="font-size:100%;">Stream Voice<img width="40px" height="40px" src="./static/media/voice-stream.png" alt="" >
    // </a>`;
    const about = `<hr>  <img id="send" width="45px" height="45px" src="./static/media/whatsapp.png" />&nbsp&nbsp&nbsp&nbsp<b>ChatApp</b><p style="font-size:78%;"> &nbsp&nbsp&nbsp&nbsp &nbsp&nbsp&nbsp&nbsp &nbsp&nbsp&nbsp&nbsp &nbsp&nbsp&nbsp&nbsp &nbsp&nbsp&nbsp&nbspDeveloped By Aditya</p>`;
    userList.innerHTML = str + "<br>" + leave + "<br>" + about;
    const userBtn = document.getElementById('users');
    if (count > 1) {
        userBtn.innerText = "Online Users: " + (count - 1) + "🙋‍♂️";
    } else {
        userBtn.innerText = 'No one is Online🙁';
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append('You', message, 'right');
    socket.emit('send', message, room);
    send_mp3.play();
    messageInput.value = '';
})

socket.on('user-joined', (remoteName, userList, socketid, remotePeerId) => {
    if (microphone_switch) {
        const options = { metadata: { "userId": peerId, "name": name } };

        if (peerId != remotePeerId) {
            peer.call(remotePeerId, myStream, options);

        }

    }
    users = userList;
    // socketId = socketid;
    append_joined(`${remoteName} Joined`);
    // update_users(users);
    update_users_modified_fun(users, peerIdNames);
    entry.play();
})

socket.on('recieve', (data) => {
    append(data.name, data.message, 'left');
    beep.play();
})

socket.on('left', (name, userList, peerList, peer, peerNamesList) => {
    console.log('left event recieved!!', userList);

    delete mic_status_users[peer];
    peerIdNames = peerNamesList
    users = userList;
    peers = peerList;
    append_joined(`${name} Left`);
    // update_users(users);
    update_users_modified_fun(users, peerIdNames);

    left_mp3.play();
})

socket.on('typing', (name) => {
    append_top(name);

})

let flag = 0;
socket.on('update-users', (userList, peersList, peerNameList) => {
    users = userList;
    peers = peersList;
    peerIdNames = peerNameList;
    // peers.forEach((id) => {
    //     mic_status_users[id] = false;
    // });

    if (connection == 0) {
        consucceeded.play()
        connection = 1;
        const userBtn = document.getElementById('users');
        userBtn.innerText = "Connected...😍";

    }

    if (flag == 0) {
        const userBtn = document.getElementById('users');
        consucceeded.play()

        userBtn.innerText = "Welcome " + getFstName(name) + "😌!";
        flag = 1;
        setTimeout(() => {
            console.log('update-users event recieved', userList);
            // update_users(userList);
            update_users_modified_fun(users, peerIdNames);

        }, 3000);
    } else {
        console.log('update-users event recieved', userList);
        // update_users(userList);
        update_users_modified_fun(users, peerIdNames);

    }
})

socket.on('disconnect', (msg) => {
    connection = 0;
    confailed.play();
    const userList = document.getElementById('userList');
    const leave = `<a type="button" class="btn btn-success my-2" href="/" style="font-size:100%;">Leave Room <img width="40px" height="40px" src="./static/media/close.png" alt="" >
    </a>`;
    // const voice_stream = `<a type="button" id="stream-btn" class="btn btn-success" onClick=voiceStream() style="font-size:100%;">Stream Voice<img width="40px" height="40px" src="./static/media/voice-stream.png" alt="" >
    // </a>`;
    const about = `<hr>  <img id="send" width="45px" height="45px" src="./static/media/whatsapp.png" />&nbsp&nbsp&nbsp&nbsp<b>ChatApp</b><p style="font-size:78%;"> &nbsp&nbsp&nbsp&nbsp &nbsp&nbsp&nbsp&nbsp &nbsp&nbsp&nbsp&nbsp &nbsp&nbsp&nbsp&nbsp &nbsp&nbsp&nbsp&nbspDeveloped By Aditya</p>`;
    userList.innerHTML = `You are offline 😒` + "<br><br>" + leave + "<br>" + about;
    const userBtn = document.getElementById('users');
    userBtn.innerText = "Reconnecting...";
    console.log("disconnected", msg);
    socket.emit('new-user-joined', name, room, peerId);
})
socket.on('printStopsStreaming', (name, peer) => {
    stopedstreaming.play();
    mic_status_users[peer] = false;
    append_joined(`${getFstName(name)} Stops Voice Streaming`);
    update_users_modified_fun(users, peerIdNames);
})

const click_mp3 = () => {
    clicked_mp3.play();
}

const voiceStream = () => {

    clicked_mp3.play();
    const streamBtn = document.getElementById('stream-btn2');
    const img_microphone = document.getElementById('microphone');
    if (img_microphone.value == 0) {
        mic_status_users[peerId] = true;
        microphone_switch = true;
        img_microphone.value = 1;
        img_microphone.src = "./static/media/mute.png"
            //logict to start voice streaming
        const options = { metadata: { "userId": peerId, "name": name } };
        // var call = peer.call(userId, stream, options); //kis kis user k pas call krna hai

        // peers[peerId] = call;
        getUserMedia({ video: false, audio: true }, stream => {
            myStream = stream;
            console.log("Calling to all users in room: ", room);
            peers.forEach((item, index) => {
                // console.log(item, index);
                if (item != peerId)
                    peer.call(item, stream, options);

            });

        }, err => {
            console.log('Failed to get local stream', err);
        });
        console.log('streaming started');
    } else {
        mic_status_users[peerId] = false;
        microphone_switch = false;
        img_microphone.value = 0;
        img_microphone.src = "./static/media/microphone.png"

        socket.emit('stopsStreaming', name, room, peerId);


        //logic to stop voice streaming  
        const myTrack = myStream.getAudioTracks()[0];
        if (myTrack.readyState == 'live' && myTrack.kind === 'audio') {
            myTrack.stop();
        }

        console.log('streaming stoped');
    }
    update_users_modified_fun(users, peerIdNames);
}


//answering a call (peer call)
peer.on('call', call => {

    append_joined(`${getFstName(call.metadata.name)} Starts Voice Streaming🔊`);
    // peers[call.metadata.userId] = call;
    mic_status_users[call.metadata.userId] = true;
    update_users_modified_fun(users, peerIdNames);
    streaming.play();
    console.log("Answered the call of..!!", call.metadata.name);
    call.answer(); // Answer the call with an A/V stream.
    call.on('stream', (remoteStream) => {
        // Show stream in some video/canvas element..
        //accept call from others without resistance
        // peers[userId] = call;
        console.log('stream recived ', remoteStream);
        const video = document.createElement('video');

        video.srcObject = remoteStream;

        video.addEventListener('loadedmetadata', () => {
            video.play();
        });
        // videoGrid.append(video);

    });
    call.on('close', () => {
        console.log('video removed..fired..!');
    })

});