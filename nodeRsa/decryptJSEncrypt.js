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