const http = require('http');
const fs = require('fs/promises');
const url = require('url');

function unAuth(res) {
  res.writeHead(401, {
    'WWW-Authenticate': 'Basic'
  });
  res.end();
}

//create a server object:
http.createServer(async function (req, res) {

  try {
    const { authorization } = req.headers;
    const { query } = url.parse(req.url, true);

    if(query.logout) {
      unAuth(res);
      return;
    }

    if(!authorization) {
      unAuth(res)
      return;
    }

    const encodedAuth = authorization || '';
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

        try {
          const data = await fs.readFile('./index.html');

          res.write(data)

          return res.end();

        } catch(error) {

          console.log(error);

          res.writeHead(500);

          return res.end();
        }

        
      } else {

        unAuth(res);

        return res.end();
      }
    }

    res.write('Hello world!');
    return res.end();



  } catch(error) {
    console.log(error);
    res.writeHead(500)
    res.end
  }
}).listen(8080); //the server object listens on port 8080