import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, DollarSign, AlertCircle, CheckCircle2 } from "lucide-react";

type SubRow = {
  id: string;
  restaurant_id: string;
  user_id: string;
  plan: string;
  billing_cycle: string;
  price_cents: number;
  status: string;
  current_period_start: string;
  current_period_end: string;
  restaurant?: { name: string | null } | null;
  vendor?: { email: string | null; full_name: string | null } | null;
};

const formatCurrency = (cents: number) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(cents / 100);

const daysUntil = (iso: string) => {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
};

export const BillingTab = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ["admin-vendor-subscriptions"],
    queryFn: async () => {
      const { data: subs, error } = await supabase
        .from("vendor_subscriptions")
        .select("*, restaurant:restaurants(name)")
        .order("current_period_end", { ascending: true });
      if (error) throw error;

      const userIds = [...new Set((subs ?? []).map((s) => s.user_id))];
      if (userIds.length === 0) return [] as SubRow[];

      const { data: profs } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .in("id", userIds);
      const profMap = new Map((profs ?? []).map((p) => [p.id, p]));

      return (subs ?? []).map((s) => ({
        ...s,
        vendor: profMap.get(s.user_id)
          ? {
              email: profMap.get(s.user_id)!.email,
              full_name: profMap.get(s.user_id)!.full_name,
            }
          : null,
      })) as SubRow[];
    },
  });

  const markPaid = useMutation({
    mutationFn: async (sub: SubRow) => {
      const next = new Date(sub.current_period_end);
      if (sub.billing_cycle === "annual") {
        next.setFullYear(next.getFullYear() + 1);
      } else {
        next.setMonth(next.getMonth() + 1);
      }
      const { error } = await supabase
        .from("vendor_subscriptions")
        .update({
          status: "active",
          current_period_start: sub.current_period_end,
          current_period_end: next.toISOString(),
        })
        .eq("id", sub.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vendor-subscriptions"] });
      toast({
        title: "Marked as paid",
        description: "Billing period extended.",
      });
    },
    onError: (e: Error) =>
      toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const cancelSub = useMutation({
    mutationFn: async (sub: SubRow) => {
      const { error } = await supabase
        .from("vendor_subscriptions")
        .update({ status: "cancelled" })
        .eq("id", sub.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vendor-subscriptions"] });
      toast({ title: "Subscription cancelled" });
    },
    onError: (e: Error) =>
      toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return (subscriptions ?? []).filter(
      (s) =>
        !q ||
        s.restaurant?.name?.toLowerCase().includes(q) ||
        s.vendor?.email?.toLowerCase().includes(q) ||
        s.vendor?.full_name?.toLowerCase().includes(q)
    );
  }, [subscriptions, search]);

  const totals = useMemo(() => {
    const active = filtered.filter((s) => s.status === "active");
    const overdue = active.filter((s) => daysUntil(s.current_period_end) < 0);
    const dueSoon = active.filter((s) => {
      const d = daysUntil(s.current_period_end);
      return d >= 0 && d <= 7;
    });
    const monthly = active.reduce(
      (sum, s) =>
        sum + (s.billing_cycle === "annual" ? s.price_cents / 12 : s.price_cents),
      0
    );
    return { active: active.length, overdue: overdue.length, dueSoon: dueSoon.length, monthly };
  }, [filtered]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Loading subscriptions…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium text-muted-foreground">Active subs</p>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">{totals.active}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium text-muted-foreground">Overdue</p>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </div>
          <p className="text-2xl font-bold text-destructive">{totals.overdue}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium text-muted-foreground">Due ≤ 7 days</p>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">{totals.dueSoon}</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium text-muted-foreground">MRR (active)</p>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">{formatCurrency(totals.monthly)}</p>
        </Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by restaurant or vendor…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Restaurant</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Cycle</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Period ends</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((sub) => {
              const days = daysUntil(sub.current_period_end);
              const isOverdue = sub.status === "active" && days < 0;
              const isDueSoon = sub.status === "active" && days >= 0 && days <= 7;
              return (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">
                    {sub.restaurant?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm">
                    <div>{sub.vendor?.full_name ?? "—"}</div>
                    <div className="text-muted-foreground text-xs">
                      {sub.vendor?.email ?? ""}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{sub.billing_cycle}</TableCell>
                  <TableCell>{formatCurrency(sub.price_cents)}</TableCell>
                  <TableCell>
                    <div>{new Date(sub.current_period_end).toLocaleDateString()}</div>
                    {sub.status === "active" && (
                      <div
                        className={`text-xs ${
                          isOverdue
                            ? "text-destructive font-medium"
                            : isDueSoon
                              ? "text-orange-600"
                              : "text-muted-foreground"
                        }`}
                      >
                        {isOverdue
                          ? `${Math.abs(days)}d overdue`
                          : `${days}d remaining`}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        sub.status === "active"
                          ? isOverdue
                            ? "destructive"
                            : "default"
                          : "secondary"
                      }
                    >
                      {isOverdue ? "overdue" : sub.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      {sub.status !== "cancelled" && (
                        <Button
                          size="sm"
                          onClick={() => markPaid.mutate(sub)}
                          disabled={markPaid.isPending}
                        >
                          Mark paid
                        </Button>
                      )}
                      {sub.status === "active" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => cancelSub.mutate(sub)}
                          disabled={cancelSub.isPending}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-8"
                >
                  No subscriptions yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
