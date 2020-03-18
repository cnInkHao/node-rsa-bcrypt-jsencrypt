const NodeRSA = require('node-rsa')
const fs = require('fs')

//解密前端传来的通过jsencrypt加密的码


function decryptJSEncrypt () {
  const key = fs.readFileSync('./pem/private.pem'); //读取私钥

  const privateKey = new NodeRSA(key);
  privateKey.setOptions({encryptionScheme: 'pkcs1'}); // 因为jsencrypt自身使用的是pkcs1加密方案, nodejs需要修改成pkcs1。
  decrypted = privateKey.decrypt('Jp/S6Bd/CR6PeEJstoUXD5fRj5FWjoRqEzwJc+qgF1iz4kBCvtRdnrbosvBZ7pd2eCN3z0zvJFbfcaj9APG7Ew==', 'utf8');
  console.log(decrypted)
}

decryptJSEncrypt()

// 运行
// node nodeRsa/decryptJSEncrypt.js


// 存入数据库的密码不可逆 使用hash加salt加密 （bcrypt）

// const bcrypt = require('bcrypt');
// // 前端加密后的密码
// const pwd = 'Jp/S6Bd/CR6PeEJstoUXD5fRj5FWjoRqEzwJc+qgF1iz4kBCvtRdnrbosvBZ7pd2eCN3z0zvJFbfcaj9APG7Ew=='
// // bcrypt.hash(pwd, 10, function(err, hash) {
// //     // Store hash in your password DB.
// //     console.log(hash)
// // });
// // 生成的hash密码并存入数据库
// const hash = '$2b$10$pBk0Rueiqx7hRIcEVuohFOSHPsToQDrOmG4S3iGpMJrAc6JGkVXoe'

// bcrypt.compare(pwd, hash, function(err, result) {
//     // result == true
//     console.log('密码验证', result)
// });