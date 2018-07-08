const net = require('net')
const path = require('path')
const fs = require('fs');

const checkContentType = (url) => {
  const contentType = path.parse(url);
  if(url === '/'){
    return 'text/html';
  }
  if(contentType.ext === '.css'){
    return 'text/css';
  }
  if(contentType.ext === '.html'){
    return 'text/html';
  }
}

const server = net.createServer((socket)=>{

  socket.on('data', (data)=>{
    let str = data.toString();
    let lines = str.split('\r\n');
    let [method, url, httpVersion] = lines[0].split(' ');

    let filePath = url;

    if(url ==='/'){
      filePath = '/index.html';
    }
    if(url === '/favicon.ico'){
      return 204;
    }

    let fileStr = fs.readFileSync(path.join(__dirname, 'public' + filePath));


    socket.write('HTTP/1.1 200 OK\n');
    socket.write('Server: Test Node.js Custom Server\n');
    socket.write('Date: ' + (new Date()).toUTCString())
    socket.write('Content-Type: ' + checkContentType(url) + '\n');
    socket.write('Content-Length: ' + fileStr.length + '\n');
    socket.write('\n');

    socket.write(fileStr);

  })
})

server.listen(4000, () => {
  console.log('Server listening: ' + server.address().port)
})

server.on('error', (err) => {
  throw err;
});