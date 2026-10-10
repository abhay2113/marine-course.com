const bcrypt = require('bcryptjs');
const { getUsers, saveUsers } = require('./lib/users');

module.exports = async function handler(req, res) {
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters.',
      });
    }

    const users = getUsers();
    const normalizedEmail = String(email).trim().toLowerCase();

    if (users.some((user) => user.email === normalizedEmail)) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered.',
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = {
      id: Date.now(),
      name: String(name).trim(),
      email: normalizedEmail,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    return res.status(200).json({
      success: true,
      message: 'Registration successful.',
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error.',
    });
  }
};
