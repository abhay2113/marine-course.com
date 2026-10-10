const fs = require('fs');
const path = require('path');
const os = require('os');

const tempDir = process.env.TMPDIR || process.env.TEMP || os.tmpdir() || '/tmp';
const usersFile = path.join(tempDir, 'globalmove-users.json');

function ensureUsersFile() {
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, '[]', 'utf8');
  }
}

function getUsers() {
  ensureUsersFile();
  const content = fs.readFileSync(usersFile, 'utf8');

  try {
    return JSON.parse(content || '[]');
  } catch (error) {
    fs.writeFileSync(usersFile, '[]', 'utf8');
    return [];
  }
}

function saveUsers(users) {
  ensureUsersFile();
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf8');
}

module.exports = {
  usersFile,
  getUsers,
  saveUsers,
};
