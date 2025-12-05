(function enforceLogin() {
  try {
    const token = localStorage.getItem("token");
    const path = (location.pathname || '').toLowerCase();
    const isPublic = path.endsWith('/login.html') || path.endsWith('login.html') || path.endsWith('/newuser.html') || path.endsWith('newuser.html');
    if (!token && !isPublic) {
      location.replace('login.html');
    }
  } catch (_) {
    // If localStorage unavailable, default to login page
    const path = (location.pathname || '').toLowerCase();
    const isPublic = path.endsWith('/login.html') || path.endsWith('login.html') || path.endsWith('/newuser.html') || path.endsWith('newuser.html');
    if (!isPublic) location.replace('login.html');
  }
})();
