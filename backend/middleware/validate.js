function sanitize(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>"'&]/g, c => ({'<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#x27;','&':'&amp;'}[c]));
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(pwd) {
  return pwd && pwd.length >= 8;
}

function sanitizeBody(req, res, next) {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') req.body[key] = sanitize(req.body[key]);
    }
  }
  next();
}

module.exports = { sanitize, validateEmail, validatePassword, sanitizeBody };
