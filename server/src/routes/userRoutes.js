const express = require('express');
const prisma = require('@prisma/client').PrismaClient;
const router = express.Router();

// Get user's wallet balance
router.get('/wallet', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { username: req.user.username },
    include: { wallet: true }
  });
  res.json(user.wallet);
});

module.exports = router;