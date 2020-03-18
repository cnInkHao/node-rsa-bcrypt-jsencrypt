const NodeRSA = require('node-rsa')
const fs = require('fs')

//解密

function decrypt () {
    fs.readFile('./pem/public.pem', function (err, data) {
        // data获取二进制buffer 不要加'utf-8'
        const publicKey = new NodeRSA(data)
        let rawText = publicKey.decryptPublic('SnvxbBM8PufQs1BVKg1SE/fXWJUXuh6yAqDCrpo7fuy04gsHydYUArsBTlk5JOufCuy2Y+O/GEb6H8WGzKWIKg==', 'utf8')
        console.log(data, rawText)
    })
}

decrypt()

// 运行
// node nodeRsa/decryptKey.js