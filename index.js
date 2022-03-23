/* eslint-disable no-console */
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const crypt = require('./crypt.js');
const serve = require('./serve.js');

const appName = 'enc-js';

const cliCryptOpts = {
  data: {
    alias: 'd',
    describe: 'Data to encrypt/decrypt',
    type: 'string',
    demandOption: true,
  },
  passphrase: {
    alias: 'p',
    describe: 'Passphrase to use',
    type: 'string',
    demandOption: true,
  },
};

const baseCryptOpts = {
  algo: {
    alias: 'a',
    describe: 'Algorithm to use',
    type: 'string',
    default: crypt.defaultAlgo,
  },
  hashFunc: {
    alias: 'h',
    describe: 'Hash function to use',
    type: 'string',
    default: crypt.defaultHashFunc,
  },
  iters: {
    alias: 'i',
    describe: 'Number of iterations',
    type: 'number',
    default: crypt.defaultIters,
  },
};

try {
  // eslint-disable-next-line no-unused-vars
  const _ = yargs(hideBin(process.argv))
    .scriptName(appName)
    .usage('Usage: $0 <command> [options]')
    .command({
      command: 'serve',
      aliases: ['s', 'srv'],
      describe: 'Serve the crypt server',
      builder: {
        bind: {
          alias: 'b',
          describe: 'Bind address',
          type: 'string',
          default: 'localhost:8080',
        },
        ...baseCryptOpts,
      },
      handler: ({
        bind, algo, iters, hashFunc,
      }) => serve(bind, algo, iters, hashFunc),
    })
    .command({
      command: 'encrypt',
      aliases: ['e', 'enc'],
      describe: 'Encrypt data',
      builder: { ...cliCryptOpts, ...baseCryptOpts },
      handler: ({
        data, passphrase, algo, iters, hashFunc,
      }) => console.log(crypt.encrypt(data, passphrase, algo, iters, hashFunc)),
    })
    .command({
      command: 'decrypt',
      aliases: ['d', 'dec'],
      describe: 'Decrypt data',
      builder: { ...cliCryptOpts, ...baseCryptOpts },
      handler: ({
        data, passphrase, algo, iters, hashFunc,
      }) => console.log(crypt.decrypt(data, passphrase, algo, iters, hashFunc)),
    })
    .demandCommand(1)
    .help()
    .strict()
    .argv;
} catch (err) {
  console.log(appName, '\n');
  console.error(err);
  process.exit(1);
}
