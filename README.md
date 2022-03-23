# enc-js
Simple js util to process stuff in an `openSSL enc`-compatible way

# Usage
```
Usage: enc-js <command> [options]

Commands:
  enc-js serve    Serve the crypt server                       [aliases: s, srv]
  enc-js encrypt  Encrypt data                                 [aliases: e, enc]
  enc-js decrypt  Decrypt data                                 [aliases: d, dec]

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

## Encrypt
```
enc-js encrypt

Encrypt data

Options:
      --version     Show version number                                [boolean]
      --help        Show help                                          [boolean]
  -d, --data        Data to encrypt/decrypt                  [string] [required]
  -p, --passphrase  Passphrase to use                        [string] [required]
  -a, --algo        Algorithm to use           [string] [default: "aes-256-cbc"]
  -h, --hashFunc    Hash function to use            [string] [default: "sha256"]
  -i, --iters       Number of iterations                  [number] [default: 90]
```

This command should be equivalent to `echo -n "<data>" | openssl enc -e <algo> -a -salt --iter <iters> -h <hashFunc> -k <passphrase>`

## Decrypt
```
enc-js decrypt

Decrypt data

Options:
      --version     Show version number                                [boolean]
      --help        Show help                                          [boolean]
  -d, --data        Data to encrypt/decrypt                  [string] [required]
  -p, --passphrase  Passphrase to use                        [string] [required]
  -a, --algo        Algorithm to use           [string] [default: "aes-256-cbc"]
  -h, --hashFunc    Hash function to use            [string] [default: "sha256"]
  -i, --iters       Number of iterations                  [number] [default: 90]
```

This command should be equivalent to `echo "<data>" | openssl enc -d <algo> -a --iter <iters> -h <hashFunc> -k <passphrase>`

## Serve
```
enc-js serve

Serve the crypt server

Options:
      --version   Show version number                                  [boolean]
      --help      Show help                                            [boolean]
  -b, --bind      Bind address              [string] [default: "localhost:8080"]
  -a, --algo      Algorithm to use             [string] [default: "aes-256-cbc"]
  -h, --hashFunc  Hash function to use              [string] [default: "sha256"]
  -i, --iters     Number of iterations                    [number] [default: 90]
```

### POST `/encrypt` 
Send a form-urlencoded request with `data` & `passphrase`.

Returns the base64 encoded plain-text.

### POST `/decrypt`
Send a form-urlencoded request with `data` & `passphrase`.

Returns a utf-8 plain-text containing the original text.

# Build
To obtain native distros of this tool you can run the following:

```sh
npm run build 
```
