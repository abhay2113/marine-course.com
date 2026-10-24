const bcrypt = require('bcryptjs');
const { createUser, findUserByEmail } = require('../lib/users');

module.exports = async function handler(req, res) {
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { name, email, password } = body;

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
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

    const normalizedEmail = email.trim().toLowerCase();

    if (await findUserByEmail(normalizedEmail)) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered.',
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const createdUser = await createUser({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    if (!createdUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered.',
      });
    }

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
