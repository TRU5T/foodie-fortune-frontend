import { useState } from "react";
import { usePromotions, Promotion } from "@/hooks/usePromotions";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Tag, Percent, Sparkles } from "lucide-react";
import { format } from "date-fns";

interface Props {
  restaurantId: string;
}

const PROMO_TYPE_LABELS: Record<string, { label: string; icon: typeof Tag }> = {
  discount: { label: "Menu Item Discount", icon: Percent },
  double_stamps: { label: "Double Stamps", icon: Sparkles },
  double_points: { label: "Double Points", icon: Sparkles },
  welcome_bonus: { label: "Welcome Bonus", icon: Tag },
};

export const PromotionManagement = ({ restaurantId }: Props) => {
  const { data: promotions, isLoading, createPromotion, updatePromotion, deletePromotion } = usePromotions(restaurantId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [deleting, setDeleting] = useState<Promotion | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    promotion_type: "discount",
    discount_percent: 10,
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
  });

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      description: "",
      promotion_type: "discount",
      discount_percent: 10,
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    });
    setIsDialogOpen(true);
  };

  const openEdit = (promo: Promotion) => {
    setEditing(promo);
    setForm({
      name: promo.name,
      description: promo.description || "",
      promotion_type: promo.promotion_type,
      discount_percent: promo.discount_percent,
      start_date: new Date(promo.start_date).toISOString().split("T")[0],
      end_date: new Date(promo.end_date).toISOString().split("T")[0],
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    const payload = {
      restaurant_id: restaurantId,
      name: form.name,
      description: form.description || null,
      promotion_type: form.promotion_type,
      discount_percent: form.discount_percent,
      applicable_menu_item_id: null,
      start_date: new Date(form.start_date).toISOString(),
      end_date: new Date(form.end_date).toISOString(),
      is_active: true,
    };

    if (editing) {
      updatePromotion.mutate({ id: editing.id, ...payload }, { onSuccess: () => setIsDialogOpen(false) });
    } else {
      createPromotion.mutate(payload, { onSuccess: () => setIsDialogOpen(false) });
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading promotions...</div>;

  return (
    <>
      <div className="mb-6">
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />Create Promotion
        </Button>
      </div>

      {(!promotions || promotions.length === 0) ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Tag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Promotions Yet</h3>
            <p className="text-muted-foreground">Create your first promotion to attract customers</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promo) => {
            const isExpired = new Date(promo.end_date) < new Date();
            const typeInfo = PROMO_TYPE_LABELS[promo.promotion_type] || PROMO_TYPE_LABELS.discount;
            return (
              <Card key={promo.id} className={isExpired ? "opacity-60" : ""}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{promo.name}</CardTitle>
                    <Badge variant={isExpired ? "secondary" : promo.is_active ? "default" : "secondary"}>
                      {isExpired ? "Expired" : promo.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <typeInfo.icon className="h-4 w-4 text-primary" />
                    <span>{typeInfo.label}</span>
                    {promo.promotion_type === "discount" && (
                      <Badge variant="outline">{promo.discount_percent}% off</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{promo.description || "No description"}</p>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(promo.start_date), "MMM d")} — {format(new Date(promo.end_date), "MMM d, yyyy")}
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(promo)}>
                    <Edit className="h-4 w-4 mr-1" />Edit
                  </Button>
                  <Button variant="destructive" size="sm" className="flex-1" onClick={() => setDeleting(promo)}>
                    <Trash2 className="h-4 w-4 mr-1" />Delete
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Promotion" : "Create Promotion"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Summer Special" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Details about the promotion..." />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={form.promotion_type} onValueChange={(v) => setForm({ ...form, promotion_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="discount">Menu Item Discount</SelectItem>
                  <SelectItem value="double_stamps">Double Stamps</SelectItem>
                  <SelectItem value="double_points">Double Points</SelectItem>
                  <SelectItem value="welcome_bonus">Welcome Bonus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.promotion_type === "discount" && (
              <div>
                <Label>Discount Percentage</Label>
                <Input type="number" min={1} max={100} value={form.discount_percent} onChange={(e) => setForm({ ...form, discount_percent: Number(e.target.value) })} />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
              </div>
              <div>
                <Label>End Date</Label>
                <Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!form.name || createPromotion.isPending || updatePromotion.isPending}>
              {editing ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Promotion</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete "{deleting?.name}"?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleting) { deletePromotion.mutate(deleting.id); setDeleting(null); } }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
