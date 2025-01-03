const crypto = require('crypto');

function mcgillEmail(email){
    split = email.split('@');
    if (split.length != 2){
        return false
    }
    if (split[1] != "mail.mcgill.ca" && split[1] != "mcgill.ca"){
        return false
    }
    if (!split[0].match(/^[A-Za-z0-9_\-\.]+$/)){
        return false
    }
    return true
}

function hashPassword(password){
    return crypto.createHash('sha256').update(password, 'utf8').digest('hex')
}

function createURL(){
    const chars = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890"
    url = ""
    for(i = 0; i < 30; i++){
        url += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return url
}

function validEmail(email){
    split = email.split('@');
    if (split.length != 2){
        return false
    }
    if (!split[0].match(/^[A-Za-z0-9_\-\.]+$/)){
        return false
    }
    if (!split[1].match(/^[A-Za-z0-9_\-\.]+$/)){
        return false
    }
    return true
}

module.exports = {
    mcgillEmail, hashPassword, createURL, validEmail
}
