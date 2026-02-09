import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { getTransactions, getStocks, addTransaction } from "@/services/stockApi";
import { Loader2 } from "lucide-react";

interface Transaction {
  stock_symbol: string;
  transaction_type: string;
  quantity: number;
  price: number;
  brokerage_fee: number;
  total_amount: number;
  transaction_date: string;
}

interface Stock {
  stock_id: number;
  stock_symbol: string;
  company_name: string;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [stockId, setStockId] = useState<number | "">("");
  const [txType, setTxType] = useState<"BUY" | "SELL">("BUY");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [brokerageFee, setBrokerageFee] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const fetchData = () => {
    setLoading(true);
    Promise.all([getTransactions(), getStocks()])
      .then(([txRes, stockRes]) => {
        setTransactions(txRes.data);
        setStocks(stockRes.data);
      })
      .catch((err) => setError(err.response?.data?.message || "Failed to load data"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!stockId || !quantity || !price) {
      setFormError("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    try {
      await addTransaction({
        stock_id: Number(stockId),
        transaction_type: txType,
        quantity: Number(quantity),
        price: Number(price),
        brokerage_fee: Number(brokerageFee) || 0,
      });
      setFormSuccess("Transaction added!");
      setStockId("");
      setQuantity("");
      setPrice("");
      setBrokerageFee("");
      fetchData();
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Failed to add transaction");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <AppLayout>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );

  if (error)
    return (
      <AppLayout>
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center text-destructive">{error}</div>
      </AppLayout>
    );

  const selectClass =
    "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring";
  const inputClass = selectClass;

  return (
    <AppLayout>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Transactions</h1>

      <div className="mb-8 rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Add Transaction</h2>

        {formError && (
          <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{formError}</div>
        )}
        {formSuccess && (
          <div className="mb-4 rounded-lg bg-success/10 px-4 py-3 text-sm text-success">{formSuccess}</div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Stock</label>
            <select value={stockId} onChange={(e) => setStockId(Number(e.target.value) || "")} className={selectClass} required>
              <option value="">Select stock</option>
              {stocks.map((s) => (
                <option key={s.stock_id} value={s.stock_id}>
                  {s.stock_symbol} — {s.company_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Type</label>
            <select value={txType} onChange={(e) => setTxType(e.target.value as "BUY" | "SELL")} className={selectClass}>
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Quantity</label>
            <input type="number" min="1" required value={quantity} onChange={(e) => setQuantity(e.target.value)} className={inputClass} placeholder="0" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Price</label>
            <input type="number" min="0" step="0.01" required value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} placeholder="0.00" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Brokerage Fee</label>
            <input type="number" min="0" step="0.01" value={brokerageFee} onChange={(e) => setBrokerageFee(e.target.value)} className={inputClass} placeholder="0.00" />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold text-foreground">Transaction History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium text-right">Qty</th>
                <th className="px-5 py-3 font-medium text-right">Price</th>
                <th className="px-5 py-3 font-medium text-right">Fee</th>
                <th className="px-5 py-3 font-medium text-right">Total</th>
                <th className="px-5 py-3 font-medium text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">
                    No transactions yet
                  </td>
                </tr>
              ) : (
                transactions.map((t, i) => (
                  <tr key={i} className="border-b border-border last:border-0 transition-colors hover:bg-muted/50">
                    <td className="px-5 py-3 font-medium text-foreground">{t.stock_symbol}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${
                          t.transaction_type === "BUY" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
                        }`}
                      >
                        {t.transaction_type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-foreground">{t.quantity}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-foreground">{formatCurrency(t.price)}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">{formatCurrency(t.brokerage_fee)}</td>
                    <td className="px-5 py-3 text-right tabular-nums font-medium text-foreground">{formatCurrency(t.total_amount)}</td>
                    <td className="px-5 py-3 text-right text-muted-foreground">
                      {new Date(t.transaction_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default TransactionsPage;
