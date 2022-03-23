const crypto = require('crypto');

const algos = require('./algos.js');

const defaultAlgo = 'aes-256-cbc';
const defaultIters = 90;
const defaultHashFunc = 'sha256';

function deriveKeyAndIV(
  password,
  salt,
  algo = defaultAlgo,
  iters = defaultIters,
  hashFunc = defaultHashFunc,
) {
  const { keyLen, ivLen } = algos[algo];
  const kAndV = crypto.pbkdf2Sync(password, salt, iters, keyLen + ivLen, hashFunc);
  return {
    key: kAndV.slice(0, keyLen),
    iv: kAndV.slice(keyLen, keyLen + ivLen),
  };
}

function encrypt(
  data,
  passphrase,
  algo = defaultAlgo,
  iters = defaultIters,
  hashFunc = defaultHashFunc,
) {
  // generate random 8 bytes salt
  const salt = crypto.randomBytes(8);

  // create key and iv from passphrase and salt
  const { key, iv } = deriveKeyAndIV(passphrase, salt, algo, iters, hashFunc);

  // create cipher with key and iv
  const cipher = crypto.createCipheriv(algo, key, iv);

  // create base64 encoded encrypted data including magic word and salt
  const encrypted = Buffer.concat([
    Buffer.from('Salted__'),
    salt,
    cipher.update(data),
    cipher.final(),
  ]).toString('base64');

  return encrypted;
}

function decrypt(
  encdata,
  passphrase,
  algo = defaultAlgo,
  iters = defaultIters,
  hashFunc = defaultHashFunc,
) {
  // create buffer from base64 encoded encrypted data
  const encrypted = Buffer.from(encdata, 'base64');

  // verify magic word
  if (encrypted.slice(0, 8).toString('ascii') !== 'Salted__') {
    return 'Invalid magic word';
  }

  // retrieve salt
  const salt = encrypted.slice(8, 16);

  // create key and iv from passphrase and salt
  const { key, iv } = deriveKeyAndIV(passphrase, salt, algo, iters, hashFunc);

  // create decipher with key and iv
  const decipher = crypto.createDecipheriv(algo, key, iv);

  // decrypt data
  const decrypted = decipher.update(encrypted.slice(16), 'binary', 'utf8') + decipher.final('utf8');

  return decrypted;
}

module.exports = {
  encrypt,
  decrypt,
  defaultAlgo,
  defaultIters,
  defaultHashFunc,
};
