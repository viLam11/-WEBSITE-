const express = require('express');
const router = express.Router();
const siteController = require('../app/controllers/SiteController');


router.get('/login', siteController.getlogin);
router.post('/login', siteController.login);
router.post('/logout', siteController.logout);
router.get('/', siteController.intro);


module.exports = router;