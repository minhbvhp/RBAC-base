async function postData(url, data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data),
  });

  if (response.status >= 400) {
    throw new Error('invalid credentials');
  }

  return response.json();
}

const AUTH_CREDENTIALS = {
  email: 'Admin1@example.com',
  password: 'Admin1@example.com',
};

postData('/api/auth/login', AUTH_CREDENTIALS)
  .then((data) => {
    setTimeout(() => {
      window.ui.preauthorizeApiKey('token', data.data.access_token);
      console.log('preauth success');
    }, 1000);
  })
  .catch((e) => {
    console.error(`preauth failed: ${e}`);
  });
