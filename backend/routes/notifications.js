const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');

const notifications = {};

router.get('/', authMiddleware, (req, res) => {
  const userNotifs = notifications[req.user.id] || [];
  res.json(userNotifs);
});

router.post('/mark-read', authMiddleware, (req, res) => {
  if (notifications[req.user.id]) {
    notifications[req.user.id].forEach(n => n.read = true);
  }
  res.json({ message: 'Notifications marquées comme lues.' });
});

router.delete('/:id', authMiddleware, (req, res) => {
  if (notifications[req.user.id]) {
    notifications[req.user.id] = notifications[req.user.id].filter(n => n.id !== req.params.id);
  }
  res.json({ message: 'Notification supprimée.' });
});

// Internal: push notification (called by other routes)
function pushNotification(userId, notif) {
  if (!notifications[userId]) notifications[userId] = [];
  notifications[userId].unshift({ id: 'n_'+Date.now(), ...notif, read: false, time: new Date() });
}

module.exports = router;
module.exports.pushNotification = pushNotification;
