const registerHandler = require('../api/register.js');
const loginHandler = require('../api/login.js');

function makeRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
    send(data) {
      this.body = data;
      return this;
    },
  };
}

(async () => {
  const regRes = makeRes();
  await registerHandler({ body: { name: 'Vercel User', email: 'vercel@example.com', password: 'password123' } }, regRes);

  if (regRes.statusCode !== 200 || !regRes.body || regRes.body.success !== true) {
    console.error('REGISTER_FAILED', regRes);
    process.exit(1);
  }

  const loginRes = makeRes();
  await loginHandler({ body: { email: 'vercel@example.com', password: 'password123' } }, loginRes);

  if (loginRes.statusCode !== 200 || !loginRes.body || loginRes.body.success !== true) {
    console.error('LOGIN_FAILED', loginRes);
    process.exit(1);
  }

  console.log('VERCEL_AUTH_OK');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
