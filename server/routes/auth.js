const router = require('express').Router();
const { verifyAccessToken, verifyAccessTokenUpdate, createAccessToken, createRefreshToken } = require('../helpers/token');
const { generateCodes, authenticateUser } = require('../helpers/authentication');
const AuthController = require('../controllers/AuthController');
const { verify } = require('jsonwebtoken')
const User = require('../model/User');

router.post('/refresh_token', async (req, res) => {
  const { refresh_token } = req.cookies;
  if (!refresh_token) return res.status(401).json({ ok: false, message: 'message' });

  let payload = null;

  try {
    payload = verify(refresh_token, process.env.REFRESH_TOKEN_SECRET)
  } catch (err) {
    console.log({ err })
    return res.status(402).json({ ok: false, message: 'message' });
  }

  const user = await User.findById(payload.userId)
  if (!user) return res.status(403).json({ ok: false, message: 'message' });

  // To revoke token, change the token version
  // if (user.tokenVersion !== payload.tokenVersion) return res.send({ ok: false, accessToken: '' });

  const accessToken = createAccessToken(user)
  // const refreshToken = createRefreshToken(user)
  // res.cookie('refresh_token', refreshToken, {httpOnly:true})

  return res.status(200).json({ ok: true, accessToken })
})

router.post('/login', AuthController.login)
router.delete('/logout', verifyAccessTokenUpdate, AuthController.logout);

router.post('/activate-account', verifyAccessToken, AuthController.activateAccount);

router.get('/google-authenticator-qrcode', AuthController.getGoogleAuthenticatorQrCode)
router.post('/google-authenticator-verify-code', AuthController.verifyGoogleAuthenticatorCode)

router.get('/googlelogin', generateCodes, AuthController.googleLogin);
router.get('/oauth2callback', authenticateUser);
router.get('/getUser', AuthController.googleUser);


module.exports = router;
