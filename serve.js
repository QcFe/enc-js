const http = require('http');

const { encrypt, decrypt } = require('./crypt.js');

async function parseRequest(req) {
  return new Promise((ok, err) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    }).on('end', () => {
      ok(Object.fromEntries(new URLSearchParams(body)));
    });
    req.on('error', err);
  });
}

function sendResponse(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'text/plain', Encoding: 'utf-8' });
  res.end(data);
}

module.exports = (bind, algo, iters, hashFunc) => http.createServer(async (req, res) => {
  if (req.url === '/encrypt') {
    const { data, passphrase } = await parseRequest(req);
    try {
      return sendResponse(res, encrypt(data, passphrase, algo, iters, hashFunc));
    } catch (e) {
      return sendResponse(res, e.message, 400);
    }
  }

  if (req.url === '/decrypt') {
    const { data, passphrase } = await parseRequest(req);
    try {
      return sendResponse(res, decrypt(data, passphrase, algo, iters, hashFunc));
    } catch (e) {
      return sendResponse(res, e.message, 400);
    }
  }

  return sendResponse(res, 'Invalid request', 400);
}).listen(bind, () => {
  // eslint-disable-next-line no-console
  console.log('Server started. Use Ctrl+C to stop.');
});
