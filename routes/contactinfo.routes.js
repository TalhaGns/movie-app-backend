const express = require('express');
const router = express.Router();

const contactInfoControllers = require('../controllers/contactinfo.controllers');

router.get('/contactinfo', contactInfoControllers.getAllContactInfo);
router.post('/contactinfo', contactInfoControllers.createContactInfo);
router.put('/contactinfo/:id', contactInfoControllers.updateCreateInfo);

module.exports = router;
