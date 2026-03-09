import { useVendorAnalytics } from "@/hooks/useVendorAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, ScanLine, Award, TrendingUp } from "lucide-react";

interface Props {
  restaurantId: string;
}

export const VendorAnalytics = ({ restaurantId }: Props) => {
  const {
    isLoading, chartData, totalScans, uniqueCustomers,
    completedCards, totalStampsAwarded, totalPointsAwarded,
  } = useVendorAnalytics(restaurantId);

  if (isLoading) return <div className="text-center py-8">Loading analytics...</div>;

  const stats = [
    { label: "Total Scans", value: totalScans, icon: ScanLine },
    { label: "Unique Customers", value: uniqueCustomers, icon: Users },
    { label: "Completed Cards", value: completedCards, icon: Award },
    { label: "Stamps Awarded", value: totalStampsAwarded, icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2.5">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scans Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No scan data yet. Start scanning customers to see analytics.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis allowDecimals={false} className="text-xs" />
                <Tooltip />
                <Bar dataKey="scans" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {totalPointsAwarded > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-accent/10 p-2.5">
                <TrendingUp className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalPointsAwarded}</p>
                <p className="text-xs text-muted-foreground">Total Points Awarded</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
