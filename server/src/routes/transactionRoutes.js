const express = require('express');
const prisma = require('@prisma/client').PrismaClient;
const router = express.Router();

// Get transaction history
router.get('/', async (req, res) => {
  const transactions = await prisma.transaction.findMany({
    where: { walletId: req.user.walletId },
    orderBy: { createdAt: 'desc' }
  });
  res.json(transactions);
});

// Create a new transaction
router.post('/', async (req, res) => {
  const { amount, category, type } = req.body;

  // Create transaction
  const transaction = await prisma.transaction.create({
    data: {
      amount,
      category,
      type,
      walletId: req.user.walletId
    },
  });

  // Update wallet balance
  const wallet = await prisma.wallet.update({
    where: { id: req.user.walletId },
    data: {
      balance: type === 'send' ? { decrement: amount } : { increment: amount },
    },
  });

  res.json({ transaction, newBalance: wallet.balance });
});

module.exports = router;
