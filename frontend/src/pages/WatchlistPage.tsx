import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { getWatchlist, getStocks, addToWatchlist, removeFromWatchlist } from "@/services/stockApi";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface WatchlistItem {
  stock_id: number;
  stock_symbol: string;
  company_name: string;
  current_price: number;
}

interface Stock {
  stock_id: number;
  stock_symbol: string;
  company_name: string;
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStock, setSelectedStock] = useState<number | "">("");
  const [adding, setAdding] = useState(false);

  const fetchData = () => {
    setLoading(true);
    Promise.all([getWatchlist(), getStocks()])
      .then(([wRes, sRes]) => {
        setWatchlist(wRes.data);
        setStocks(sRes.data);
      })
      .catch((err) => setError(err.response?.data?.message || "Failed to load watchlist"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    if (!selectedStock) return;
    setAdding(true);
    try {
      await addToWatchlist(Number(selectedStock));
      setSelectedStock("");
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add");
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (stockId: number) => {
    try {
      await removeFromWatchlist(stockId);
      setWatchlist((prev) => prev.filter((w) => w.stock_id !== stockId));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to remove");
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

  const watchlistIds = new Set(watchlist.map((w) => w.stock_id));
  const availableStocks = stocks.filter((s) => !watchlistIds.has(s.stock_id));

  return (
    <AppLayout>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Watchlist</h1>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1.5 block text-sm font-medium text-foreground">Add to Watchlist</label>
          <select
            value={selectedStock}
            onChange={(e) => setSelectedStock(Number(e.target.value) || "")}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">Select stock</option>
            {availableStocks.map((s) => (
              <option key={s.stock_id} value={s.stock_id}>
                {s.stock_symbol} — {s.company_name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleAdd}
          disabled={!selectedStock || adding}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Add
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium">Company</th>
                <th className="px-5 py-3 font-medium text-right">Current Price</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">
                    Your watchlist is empty
                  </td>
                </tr>
              ) : (
                watchlist.map((w) => (
                  <tr key={w.stock_id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/50">
                    <td className="px-5 py-3 font-semibold text-foreground">{w.stock_symbol}</td>
                    <td className="px-5 py-3 text-muted-foreground">{w.company_name}</td>
                    <td className="px-5 py-3 text-right tabular-nums font-medium text-foreground">{formatCurrency(w.current_price)}</td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => handleRemove(w.stock_id)}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-destructive transition-colors hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
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

export default WatchlistPage;
