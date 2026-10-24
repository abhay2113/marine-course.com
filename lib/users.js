const { sql, ensureUsersTable } = require('./database');

async function findUserByEmail(email) {
  await ensureUsersTable();

  const [user] = await sql`
    SELECT id, name, email, password_hash AS "passwordHash"
    FROM users
    WHERE email = ${email}
    LIMIT 1
  `;

  return user || null;
}

async function createUser(user) {
  await ensureUsersTable();

  const [createdUser] = await sql`
    INSERT INTO users (name, email, password_hash)
    VALUES (${user.name}, ${user.email}, ${user.passwordHash})
    ON CONFLICT (email) DO NOTHING
    RETURNING id
  `;

  return createdUser || null;
}

module.exports = {
  findUserByEmail,
  createUser,
};
