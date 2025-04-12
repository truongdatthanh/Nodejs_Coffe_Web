const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payments');

router.post('/create/:cartId', async (req, res) => {
    try {
        let payment = await paymentController.CreatePayment(req.params.cartId, req.body);
        res.status(201).json(payment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        let payment = await paymentController.GetPaymentById(req.params.id);
        res.status(200).json(payment);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        let payments = await paymentController.GetAllPayments();
        res.status(200).json(payments);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;