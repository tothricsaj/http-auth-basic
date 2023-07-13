const http = require('http');
const fs = require('fs');

//create a server object:
http.createServer(function (req, res) {
  fs.readFile('./index.html', (err, data) => {
    res.writeHead(401, {
      'WWW-Authenticate': 'Basic realm="Home"' // chellenge the client
    });
    const encodedAuth = req.headers.authorization || '';
    const encodedUserNameAndPass = encodedAuth ? encodedAuth.split(' ')[1] : '';

    console.log(encodedAuth);
    console.log(encodedUserNameAndPass);

    if(encodedUserNameAndPass) {
      const [user, pass] = Buffer.from(encodedUserNameAndPass, 'base64')
        .toString('utf-8')
        .split(':')
      ;
      console.log(user, pass);

      if(user === 'ricsi' && pass === 'password') {
        res.writeHead(200, {
          'Content-type': 'text/html',
          'Cache-Control': 'no-cache'
        });
        res.write(data)
        return res.end();
      } 
    }

    res.writeHead(403, {
      'Content-type': 'text/plain'
    });
    res.write('403 Forbidden!');
    return res.end();
  });
}).listen(8080); //the server object listens on port 8080