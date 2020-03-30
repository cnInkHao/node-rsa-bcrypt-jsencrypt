#node-rsa-bcrypt-jsencrypt

## 介绍

1、用于收集好用的功能和代码片段
2、一个分支一个功能

### 关于前端和服务端加密的思考

​       经常会有后端开发者认为前端加不加密关系不大， 因为传到服务器要加密，而且是不可逆的加密 也就是不能被解析成明文的 然后存进数据库；这样的密码才安全。我认为前端密码传输尽可能的使用密文，不使用明文，防止别人抓包直接登录，或者针对用户一码多账户起的连锁反应；所以前端加密非常有必要，尤其做密码和支付等跟money相关的，慎之又慎啊；建议前端加密采用jsencrypt， 服务端使用node-rsa解密， 在存向数据库之前使用bcrypt 加盐哈希密码， 后面若要从数据库拿数据做登录校验等密码确认时可以通过[bcrypt](https://codahale.com/how-to-safely-store-a-password/)作比较，建议使用异步操作。

### 两种方式

#### 静态秘钥

利用node-rsa生成“公钥”、“私钥”、私钥服务端保留、用于解密、公钥给予前端。每当前端所提交数据需要加密，则使用jsencrypt加密给到服务端、服务端解密，在生成加盐的hash密文，存进数据库；

静态秘钥在于生成的“公钥”、“私钥”是固定的 不变的，分别由双端保留使用即可（建议生产环境，测试环境，开发环境各一套）

#### 动态秘钥

通过接口传递“公钥”，每次前端要加密之前请求接口获取公钥，服务端自动生成“公钥”、“私钥”，每次生成都替换旧的秘钥，将公钥【加密】之后返回给web端。web端解密拿到公钥再去加密需要加密的字段，接下来的操作和上面的方式一样



**[请阅读为什么使用bcrypt而不用{MD5，SHA1，SHA2，SHA3等}？](https://codahale.com/how-to-safely-store-a-password/)**



### [前端加密解密](https://www.npmjs.com/package/jsencrypt)（jsencrypt）



#### 扩展：https VS http

##### http

http（超文本传输协议），以明文形式在web浏览器和服务端传递信息，容易被截取传输报文；

##### https

在http基础上加入SSL协议，依靠证书验证服务器身份，并为浏览器和服务器之间的通信加密；

总结：生产环境使用https协议 密码以密文形式传递，经调研jsencrypt最适合前端加密；

### 安装教程

```shell
npm i jsencrypt
```

### 使用说明

1. 使用服务端node-rsa获取公钥和私钥，后面会介绍，前端加密需要公钥

2. 完整代码请打开jsencrypt.html 尝试

3. 关键代码如下

   加密

   ```javascript
   const encrypt = new JSEncrypt() // 新建JSEncrypt对象
   
   encrypt.setPublicKey(publicKey) // 设置公钥 / publicKey为公钥
   const encrypted = encrypt.encrypt(toEncryptText) // 对密码进行加密
   ```

   解密

   ```javascript
   const decrypt = new JSEncrypt()
   
   const privateKey = document.getElementById('prikey').innerHTML
   decrypt.setPrivateKey(privateKey) // privateKey 为私钥
   const uncrypted = decrypt.decrypt(encryptText)
   ```



### [服务端加密解密](https://www.npmjs.com/package/node-rsa)

#### 安装教程

```shell
npm install node-rsa
```

#### 使用说明

1. 完整代码请查看文件夹(nodeRsa)下js文件

2. 对前端加密生成hash解密 请运行 

   ```shell
   node nodeRsa/decryptJSEncrypt.js
   ```

3. node服务端生成公钥和私钥 请运行

   ```shell
   node nodeRsa/generateKey.js
   ```

4. node服务端加密 请运行

   ```shell
   node nodeRsa/encryptKey.js
   ```

5. node服务端解密 请运行

   ```shell
   node nodeRsa/decryptKey.js
   ```

#### 关键代码如下

1. 对前端加密生成hash解密 关键代码如下

   ```javascript
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
   ```

2. node服务端生成公钥和私钥 关键代码如下

   ```javascript
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
   ```

3. node服务端加密 关键代码如下

   ```javascript
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
   ```

4. node服务端解密 关键代码如下

5. ```javascript
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
   ```

   ### [bcrypt](https://www.npmjs.com/package/bcrypt)

   一个帮助您哈希密码的库

   A library to help you hash passwords.

   #### 通过NPM安装

   ```shell
   npm install bcrypt
   ```

   #### 用法

   ```javascript
   const bcrypt = require （' bcrypt '） ;   
   const saltRounds = 10 ;   
   const myPlaintextPassword = ' s0 / \ / \ P 4 $$ w0rD ' ;   
   const someOtherPlaintextPassword = ' not_bacon ' ;   
   ```

   To hash a password:

   ```javascript
   bcrypt.genSalt(saltRounds, function(err, salt) {
       bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
           // Store hash in your password DB.
       });
   });
   // 或者
   bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
       // Store hash in your password DB.
   });
   ```

   To check a password:

   ```javascript
   // Load hash from your password DB.
   bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
       // result == true
   });
   bcrypt.compare(someOtherPlaintextPassword, hash, function(err, result) {
       // result == false
   });
   
   // Load hash from your password DB.
   bcrypt.compareSync(myPlaintextPassword, hash); // true
   bcrypt.compareSync(someOtherPlaintextPassword, hash); // false
   ```

   **建议使用异步**

### 参与贡献

1.  [jsencrypt](https://www.npmjs.com/package/jsencrypt)
2.  node-[rsa](https://www.npmjs.com/package/node-rsa)
3.  [bcrypt](https://www.npmjs.com/package/bcrypt#to-check-a-password)

