# Simple Local Secret Vault

`@ibrahimrahhal/simple-secrets-vault` is a lightweight Node.js package for securely managing secrets in a local environment. It uses AES-256-CTR encryption to store secrets in a `.secrets.json` file located in the user's home directory.

**Warning:** SecureVault is not intended for production use. For production environments, consider using more robust solutions like HashiCorp Vault, AWS Secrets Manager, or Azure Key Vault.

## Features

- **Set and encrypt secrets**: Add secrets securely using AES-256 encryption.
- **Retrieve and decrypt secrets**: Access stored secrets with a password.
- **Load secrets to environment variables**: Import all or specific secrets directly into `process.env`.
- **Cross-platform support**: Works on all platforms supported by Node.js.

## Installation

Install the package via npm:

```bash
npm install @ibrahimrahhal/simple-secrets-vault
```

## Usage
The package can be used through command-line commands. Below are the available commands:

### Commands

#### set
Stores an encrypted secret.

```bash
local-vault set <key> <value>
```
`<key>`: The name of the secret.
`<value>`: The secret value.

Example:
```bash
local-vault set API_KEY my-secret-key
```

#### get
Retrieves and decrypts a stored secret.

```bash
local-vault get <key>
```
`<key>`: The name of the secret.

Example:
```bash
local-vault get API_KEY
```

#### load
Loads all secrets into environment variables.

```bash
local-vault load
```

#### load-specific
Loads specific secrets into environment variables.

```bash
local-vault load-specific <keys>
```
`<keys>`: A comma-separated list of secret keys.

Example:
```bash
local-vault load-specific API_KEY,DB_PASSWORD
```

### Password
For all commands, you will be prompted to enter a password used for encryption/decryption.

### Notes
- Ensure the `.secrets.json` file is kept secure, as it stores encrypted data.
- Use a strong password for encryption to enhance security.

## API
If you prefer programmatic usage, the package exposes the following methods:

- `setSecret(key, value, password)`: Encrypts and stores a secret.
- `getSecret(key, password)`: Retrieves and decrypts a secret.
- `loadSecretsToEnv(password)`: Loads all secrets into environment variables.
- `loadSpecificSecretsToEnv(keys, password)`: Loads specific secrets into environment variables.
- `encrypt(text, password)`: Encrypts a given text.
- `decrypt(text, password)`: Decrypts a given text.

### Example
Here's an example of how to use the package programmatically:

```javascript
const { setSecret, getSecret, loadSecretsToEnv } = require('@ibrahimrahhal/simple-secrets-vault');

// Set a secret
setSecret('API_KEY', 'my-secret-key', 'my-password');

// Get a secret
const apiKey = getSecret('API_KEY', 'my-password');
console.log(`API Key: ${apiKey}`);

// Load all secrets into environment variables
loadSecretsToEnv('my-password');
console.log(process.env.API_KEY);
```

## Security
- Secrets are encrypted using the AES-256-CTR algorithm.
- Ensure the password used for encryption is stored securely and not hardcoded.

## License
This package is licensed under the MIT License.


