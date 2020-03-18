const NodeRSA = require('node-rsa')
const fs = require('fs')

// 加密

function encrypt () {
    fs.readFile('./pem/private.pem', 'utf-8', function (err, data) {
        const privateKey = new NodeRSA(data)
        let cipherText = privateKey.encryptPrivate('hello world', 'base64')
        console.log(data, cipherText)
    })
}

encrypt()


// 运行
// node nodeRsa/encryptKey.js