const users = [];

const addUser = ({ id, username, room }) => {
    //clean data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    if (!username || !room) {
        return {
            error: "Username and Room are required"
        }
    }

    //check for exisiting user
    const exisitingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if (exisitingUser) {
        return {
            error: "Username alreday exists"
        }
    }

    //store user
    const user = { id, username, room }
    users.push(user);
    return { user }
}

// addUser({
//     id: 21,
//     username: "Wolf",
//     room: "dark"
// })
// const res = addUser({
//     id: 22,
//     username: "Wolf Hunter",
//     room: "light"
// })
// // console.log(res);
// const ress = addUser({
//     id: 22,
//     username: "hunter",
//     room: "dark"
// })
// // console.log(ress)
// console.log(users);


const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if (index === -1) {
        return {
            error: "No User Found"
        }
    }

    return users.splice(index, 1)[0]
}

// const res = removeUser(21);
// console.log(res);

const getUser = (id) => {
    const user = users.find((user) => {
        return user.id === id;
    })

    if (!user) {
        return {
            error: "No User Found"
        }
    }

    return user;
}

// console.log(getUser(21))


const getUsersInRoom = (room) => {
    // room = room.trim().toLowerCase();
    const userInRoom = users.filter((user) => {
        return user.room === room
    })

    if (userInRoom.length === 0) {
        return {
            error: "No User In Given Room"
        }
    }

    return userInRoom
}

// console.log(getUsersInRoom("lightt"));

module.exports = {
    addUser,
    removeUser,
    getUsersInRoom,
    getUser
}