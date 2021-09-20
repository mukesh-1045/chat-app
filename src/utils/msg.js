const generateMsg = (username, text) => {
    return {
        text,
        createdAt: new Date().getTime(),
        username,
    }
}

const generateLocationMsg = (username, url) => {
    return {
        url,
        createdAt: new Date().getTime(),
        username,
    }
}

module.exports = {
    generateMsg,
    generateLocationMsg,
}