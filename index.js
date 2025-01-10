const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

const algorithm = 'aes-256-ctr';
const secretFilePath = path.join(os.homedir(), '.secrets.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function encrypt(text, password) {
  const key = crypto.scryptSync(password, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text, password) {
  const key = crypto.scryptSync(password, 'salt', 32);
  const [ivHex, encryptedText] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function saveSecrets(secrets, password) {
  const encryptedContent = encrypt(JSON.stringify(secrets), password);
  fs.writeFileSync(secretFilePath, encryptedContent);
}

function loadSecrets(password) {
  if (fs.existsSync(secretFilePath)) {
    const encryptedContent = fs.readFileSync(secretFilePath, 'utf8');
    try {
      const decryptedContent = decrypt(encryptedContent, password);
      return JSON.parse(decryptedContent);
    } catch (error) {
      console.error('Failed to decrypt secrets. Incorrect password?');
      return {};
    }
  }
  return {};
}

function setSecret(key, value, password) {
  const secrets = loadSecrets(password);
  secrets[key] = value;
  saveSecrets(secrets, password);
}

function getSecret(key, password) {
  const secrets = loadSecrets(password);
  return secrets[key] || null;
}

function exportToEnv(key, value) {
  const envTmpPath = path.join(os.homedir(), '.env-tmp');
  fs.appendFileSync(envTmpPath, `${key}=${value}\n`);
}

function loadSecretsToEnv(password) {
  const secrets = loadSecrets(password);
  for (const key in secrets) {
    exportToEnv(key, secrets[key]);
  }
}

function loadSpecificSecretsToEnv(keys, password) {
  const secrets = loadSecrets(password);
  keys.split(',').forEach(key => {
    if (secrets[key]) {
      exportToEnv(key, secrets[key]);
    }
  });
}

function getExportString(secrets) {
  const isWindows = process.platform === 'win32';
  const command = isWindows ? 'set' : 'export';
  
  return Object.entries(secrets)
    .map(([key, value]) => `${command} ${key}=${value}`)
    .join('\n');
}

const command = process.argv[2];

if (command === 'set') {
  const key = process.argv[3];
  const value = process.argv[4];
  rl.question('Enter password: ', (password) => {
    process.stdout.moveCursor(0, -1);
    process.stdout.clearLine(1);
    process.stdout.write('Enter password: *****\n');
    
    setSecret(key, value, password);
    console.log('Secret set successfully.');
    rl.close();
  });
} else if (command === 'get') {
  const key = process.argv[3];
  rl.question('Enter password: ', (password) => {
    process.stdout.moveCursor(0, -1);
    process.stdout.clearLine(1);
    process.stdout.write('Enter password: *****\n');

    const secret = getSecret(key, password);
    if (secret) {
      console.log(`Secret: ${secret}`);
    } else {
      console.log('Secret not found or incorrect password.');
    }
    rl.close();
  });
} else if (command === 'load') {
  rl.question('Enter password: ', (password) => {
    process.stdout.moveCursor(0, -1);
    process.stdout.clearLine(1);
    process.stdout.write('Enter password: *****\n');

    loadSecretsToEnv(password);
    console.log('All secrets loaded into environment variables.');
    rl.close();
  });
} else if (command === 'load-specific') {
  const keys = process.argv[3];
  rl.question('Enter password: ', (password) => {
    process.stdout.moveCursor(0, -1);
    process.stdout.clearLine(1);
    process.stdout.write('Enter password: *****\n');

    loadSpecificSecretsToEnv(keys, password);
    console.log('Specific secrets loaded into environment variables.');
    rl.close();
  });
} else if (command === 'load-str') {
  rl.question('Enter password: ', (password) => {
    process.stdout.moveCursor(0, -1);
    process.stdout.clearLine(1);
    process.stdout.write('Enter password: *****\n');

    const secrets = loadSecrets(password);
    console.log(getExportString(secrets));
    rl.close();
  });
} else {
  console.log('Unknown command. Available commands: set, get, load, load-specific, load-str');
  process.exit(1);
}
