async function handleSignup(event) {
	event.preventDefault();
	const name = document.getElementById('signup-name').value;
	const email = document.getElementById('signup-email').value;
	const password = document.getElementById('signup-password').value;
	const msg = document.getElementById('msg');
	msg.textContent = '';

	try {
		const response = await fetch('/api/auth/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name, email, password })
		});
		const result = await response.json();
		if (response.ok) {
			msg.style.color = 'green';
			msg.textContent = result.message;
		} else {
			msg.style.color = 'crimson';
			msg.textContent = 'Error: ' + (result && result.message ? result.message : 'Unknown error');
		}
	} catch (error) {
		msg.style.color = 'crimson';
		msg.textContent = 'Network error. Please try again.';
	}
}

const signupForm = document.getElementById('signup-form');
if (signupForm) {
	signupForm.addEventListener('submit', handleSignup);
}

async function handleLogin(event) {
	event.preventDefault();
	const email = document.getElementById('login-email').value;
	const password = document.getElementById('login-password').value;
	const msg = document.getElementById('login-msg');
	msg.textContent = '';
	try {
		const response = await fetch('/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});
		const result = await response.json();
		if (response.ok) {
			msg.style.color = 'green';
			msg.textContent = result.message;
		} else {
			msg.style.color = 'crimson';
			msg.textContent = 'Error: ' + (result && result.message ? result.message : 'Invalid email or password.');
		}
	} catch (error) {
		msg.style.color = 'crimson';
		msg.textContent = 'Network error. Please try again.';
	}
}

const loginForm = document.getElementById('login-form');
if (loginForm) {
	loginForm.addEventListener('submit', handleLogin);
}


