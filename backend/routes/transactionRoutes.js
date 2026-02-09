const express = require("express");
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const userId = req.user.user_id;

  const [rows] = await db.query(
    `SELECT s.stock_symbol, t.transaction_type, t.quantity,
            t.price, t.brokerage_fee, t.total_amount, t.transaction_date
     FROM transactions t
     JOIN stocks s ON t.stock_id = s.stock_id
     WHERE t.user_id = ?
     ORDER BY t.transaction_date DESC`,
    [userId]
  );

  res.json(rows);
});

router.post("/", auth, async (req, res) => {
  const userId = req.user.user_id;
  const { stock_id, transaction_type, quantity, price, brokerage_fee } = req.body;

  const total_amount = quantity * price + brokerage_fee;

  await db.query(
    `INSERT INTO transactions 
     (user_id, stock_id, transaction_type, quantity, price, brokerage_fee, total_amount)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, stock_id, transaction_type, quantity, price, brokerage_fee, total_amount]
  );

  res.json({ message: "Transaction added successfully" });
});

module.exports = router;