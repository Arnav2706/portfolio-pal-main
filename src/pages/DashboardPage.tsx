import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { getDashboard } from "@/services/stockApi";
import { DollarSign, TrendingUp, TrendingDown, BarChart3, Loader2 } from "lucide-react";

interface DashboardData {
  totalInvested: number;
  currentValue: number;
  totalProfitLoss: number;
  totalStocks: number;
  recentTransactions: {
    stock_symbol: string;
    transaction_type: "BUY" | "SELL";
    quantity: number;
    price: number;
    transaction_date: string;
  }[];
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const DashboardPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

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
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center text-destructive">
          {error}
        </div>
      </AppLayout>
    );

  if (!data) return null;

  const cards = [
    { label: "Total Invested", value: formatCurrency(data.totalInvested), icon: DollarSign, color: "text-foreground" },
    { label: "Current Value", value: formatCurrency(data.currentValue), icon: BarChart3, color: "text-foreground" },
    {
      label: "Profit / Loss",
      value: formatCurrency(data.totalProfitLoss),
      icon: data.totalProfitLoss >= 0 ? TrendingUp : TrendingDown,
      color: data.totalProfitLoss >= 0 ? "text-success" : "text-destructive",
    },
    { label: "Total Stocks", value: data.totalStocks.toString(), icon: BarChart3, color: "text-foreground" },
  ];

  return (
    <AppLayout>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Dashboard</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="stat-card">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </div>
            <p className={`text-2xl font-bold tabular-nums ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold text-foreground">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium text-right">Qty</th>
                <th className="px-5 py-3 font-medium text-right">Price</th>
                <th className="px-5 py-3 font-medium text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                    No recent transactions
                  </td>
                </tr>
              ) : (
                data.recentTransactions.map((t, i) => (
                  <tr key={i} className="border-b border-border last:border-0 transition-colors hover:bg-muted/50">
                    <td className="px-5 py-3 font-medium text-foreground">{t.stock_symbol}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${
                          t.transaction_type === "BUY"
                            ? "bg-success/15 text-success"
                            : "bg-destructive/15 text-destructive"
                        }`}
                      >
                        {t.transaction_type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-foreground">{t.quantity}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-foreground">{formatCurrency(t.price)}</td>
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

export default DashboardPage;
