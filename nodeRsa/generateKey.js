const NodeRSA = require('node-rsa')
const fs = require('fs')
//生成公钥
function generator () {
    const key = new NodeRSA({ b: 512 })
    key.setOptions({ encryptionScheme: 'pkcs1' }) // 因为jsencrypt自身使用的是pkcs1加密方案, nodejs需要修改成pkcs1

    const privatePem = key.exportKey('pkcs1-private-pem')
    const publicPem = key.exportKey('pkcs8-public-pem')

    fs.writeFile('./pem/public.pem', publicPem, (err) => {
        if (err) throw err
        console.log('公钥已保存！')
    })
    fs.writeFile('./pem/private.pem', privatePem, (err) => {
        if (err) throw err
        console.log('私钥已保存！')
    })
}

generator()


// 运行
// node nodeRsa/generateKey.js