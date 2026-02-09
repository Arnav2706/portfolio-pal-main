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

  try {
    // 1️⃣ Insert transaction
    await db.query(
      `INSERT INTO transactions 
       (user_id, stock_id, transaction_type, quantity, price, brokerage_fee, total_amount)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, stock_id, transaction_type, quantity, price, brokerage_fee, total_amount]
    );

    // 2️⃣ Check if portfolio entry exists
    const [rows] = await db.query(
      "SELECT * FROM portfolio WHERE user_id = ? AND stock_id = ?",
      [userId, stock_id]
    );

    if (transaction_type === "BUY") {
      if (rows.length === 0) {
        // First time buying this stock
        await db.query(
          `INSERT INTO portfolio (user_id, stock_id, total_quantity, average_price)
           VALUES (?, ?, ?, ?)`,
          [userId, stock_id, quantity, price]
        );
      } else {
        // Update existing portfolio entry
        const existing = rows[0];

        const newQuantity = existing.total_quantity + quantity;

        const newAverage =
          ((existing.total_quantity * existing.average_price) +
            (quantity * price)) / newQuantity;

        await db.query(
          `UPDATE portfolio
           SET total_quantity = ?, average_price = ?
           WHERE user_id = ? AND stock_id = ?`,
          [newQuantity, newAverage, userId, stock_id]
        );
      }
    }

    if (transaction_type === "SELL") {
      if (rows.length === 0) {
        return res.status(400).json({ message: "No stock to sell" });
      }

      const existing = rows[0];

      if (existing.total_quantity < quantity) {
        return res.status(400).json({ message: "Not enough stock to sell" });
      }

      const newQuantity = existing.total_quantity - quantity;

      if (newQuantity === 0) {
        await db.query(
          "DELETE FROM portfolio WHERE user_id = ? AND stock_id = ?",
          [userId, stock_id]
        );
      } else {
        await db.query(
          `UPDATE portfolio
           SET total_quantity = ?
           WHERE user_id = ? AND stock_id = ?`,
          [newQuantity, userId, stock_id]
        );
      }
    }

    res.json({ message: "Transaction added and portfolio updated" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Transaction failed" });
  }
});
module.exports = router;
