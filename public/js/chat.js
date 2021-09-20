const socket = io();


// for learning
// socket.on('countUpdated', (count) => {
//     console.log('the count is updated that is ', count);
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('clicked');
//     socket.emit('increment')
// })

//elements 
const $msgForm = document.querySelector('#msg-form');
const $msgFormInput = $msgForm.querySelector('input');
const $msgFormButton = $msgForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $msg = document.querySelector('#msg');


//templatrs
const msgTemplate = document.querySelector('#msg-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoScroll = () => {
    //new msg element
    const $newMsg = $msg.lastElementChild;

    //height of new Msg
    const newMsgStyles = getComputedStyle($newMsg);
    const newMsgMargin = parseInt(newMsgStyles.marginBottom);
    const newMsgHeight = $newMsg.offsetHeight + newMsgMargin;

    console.log('height', newMsgHeight)
    //visible height
    const visibleHeight = $msg.offsetHeight;

    //height of msg container
    const containerHeight = $msg.scrollHeight;

    //how far have i scrolled
    const scrollOffset = $msg.scrollTop + visibleHeight;

    if (containerHeight - newMsgHeight <= scrollOffset) {
        $msg.scrollTop = $msg.scrollHeight;
    }

}

socket.on('locationMsg', (msg) => {
    console.log(msg);
    const html = Mustache.render(locationTemplate, {
        url: msg.url,
        createdAt: moment(msg.createdAt).format('h:mm a'),
        username: msg.username,
    });
    $msg.insertAdjacentHTML('beforeend', html);
    autoScroll();
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users,
    })
    document.querySelector('#sidebar').innerHTML = html;
})


socket.on('welcomeMsg', (msg) => {
    console.log(msg);

    const html = Mustache.render(msgTemplate, {
        msg: msg.text,
        createdAt: moment(msg.createdAt).format('h:mm a'),
        username: msg.username,
    });
    $msg.insertAdjacentHTML('beforeend', html);
    autoScroll();

});

$msgForm.addEventListener('submit', (e) => {
    e.preventDefault();

    $msgFormButton.setAttribute('disabled', 'disabled');

    const msg = e.target.elements.msg.value;
    // console.log(msg);

    socket.emit('sendMsg', msg, (sendByServer) => {
        $msgFormButton.removeAttribute('disabled');
        $msgFormInput.value = '';
        $msgFormInput.focus();

        console.log('the msg was delivered', sendByServer)
    });
})

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return console.log('Geolocation is not supported by your browser')
    } else {
        $sendLocationButton.setAttribute('disabled', 'disabled');

        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position);
            socket.emit('sendLocation', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }, (msg) => {

                $sendLocationButton.removeAttribute('disabled');
                console.log(msg);
            });
        })
    }

})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = '/'
    }
});