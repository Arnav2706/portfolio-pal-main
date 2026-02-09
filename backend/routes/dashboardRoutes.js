const express = require("express");
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const userId = req.user.user_id;

  const [portfolio] = await db.query(
    "SELECT SUM(total_quantity * average_price) AS invested FROM portfolio WHERE user_id = ?",
    [userId]
  );

  const [currentValue] = await db.query(
    `SELECT SUM(p.total_quantity * s.current_price) AS value
     FROM portfolio p
     JOIN stocks s ON p.stock_id = s.stock_id
     WHERE p.user_id = ?`,
    [userId]
  );

  const [transactions] = await db.query(
    `SELECT s.stock_symbol, t.transaction_type, t.quantity, t.price, t.transaction_date
     FROM transactions t
     JOIN stocks s ON t.stock_id = s.stock_id
     WHERE t.user_id = ?
     ORDER BY t.transaction_date DESC
     LIMIT 5`,
    [userId]
  );

  res.json({
    totalInvested: portfolio[0].invested || 0,
    currentValue: currentValue[0].value || 0,
    totalProfitLoss: (currentValue[0].value || 0) - (portfolio[0].invested || 0),
    totalStocks: transactions.length,
    recentTransactions: transactions
  });
});

module.exports = router;