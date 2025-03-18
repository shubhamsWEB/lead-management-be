const express = require('express');
const {
  register,
  login,
  getMe,
  logout,
  updateDetails,
  updatePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateRegisterInput, validateLoginInput, validateUpdateDetailsInput, validateUpdatePasswordInput } = require('../middleware/validator');

const router = express.Router();

router.post('/register', validateRegisterInput, register);
router.post('/login', validateLoginInput, login);
router.get('/me', protect, getMe);
router.get('/logout', logout);
router.put('/updatedetails', protect, validateUpdateDetailsInput, updateDetails);
router.put('/updatepassword', protect, validateUpdatePasswordInput, updatePassword);

module.exports = router;