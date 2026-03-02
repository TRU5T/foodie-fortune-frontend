import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Utensils } from "lucide-react";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import { sanitizeDbError } from "@/lib/sanitizeError";

type MenuItem = Tables<'menu_items'>;

interface MenuItemManagementProps {
  restaurantId: string;
}

export const MenuItemManagement = ({ restaurantId }: MenuItemManagementProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);

  const { data: items, isLoading } = useQuery({
    queryKey: ['menu-items', restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('category', { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!restaurantId
  });

  const createItem = useMutation({
    mutationFn: async (item: TablesInsert<'menu_items'>) => {
      const { data, error } = await supabase.from('menu_items').insert([item]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Menu item created" });
      queryClient.invalidateQueries({ queryKey: ['menu-items', restaurantId] });
      setIsCreateOpen(false);
    },
    onError: (e: Error) => toast({ title: "Error", description: sanitizeDbError(e), variant: "destructive" })
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MenuItem> & { id: string }) => {
      const { data, error } = await supabase.from('menu_items').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Menu item updated" });
      queryClient.invalidateQueries({ queryKey: ['menu-items', restaurantId] });
      setEditingItem(null);
    },
    onError: (e: Error) => toast({ title: "Error", description: sanitizeDbError(e), variant: "destructive" })
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Menu item deleted" });
      queryClient.invalidateQueries({ queryKey: ['menu-items', restaurantId] });
      setDeletingItem(null);
    },
    onError: (e: Error) => toast({ title: "Error", description: sanitizeDbError(e), variant: "destructive" })
  });

  if (isLoading) return <div className="text-center py-8">Loading menu items...</div>;

  return (
    <>
      <div className="mb-6">
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />Add Menu Item
        </Button>
      </div>

      {(!items || items.length === 0) ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Utensils className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Menu Items Yet</h3>
            <p className="text-muted-foreground">Add your first menu item to get started</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <Badge variant={item.is_available ? "default" : "secondary"}>
                    {item.is_available ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {item.image_url && <img src={item.image_url} alt={item.name} className="w-full h-40 object-cover rounded-md mb-4" />}
                <p className="text-sm text-muted-foreground mb-2">{item.description || "No description"}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-bold text-primary">${Number(item.price).toFixed(2)}</span>
                </div>
                {item.category && (
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Category:</span>
                    <span>{item.category}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setEditingItem(item)}>
                  <Edit className="h-4 w-4 mr-2" />Edit
                </Button>
                <Button variant="destructive" size="sm" className="flex-1" onClick={() => setDeletingItem(item)}>
                  <Trash2 className="h-4 w-4 mr-2" />Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <MenuItemDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={(data) => createItem.mutate({ ...data, restaurant_id: restaurantId })}
        isPending={createItem.isPending}
        title="Add Menu Item"
      />

      {editingItem && (
        <MenuItemDialog
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
          onSubmit={(data) => updateItem.mutate({ id: editingItem.id, ...data })}
          isPending={updateItem.isPending}
          title="Edit Menu Item"
          initialData={editingItem}
        />
      )}

      <AlertDialog open={!!deletingItem} onOpenChange={(open) => !open && setDeletingItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
            <AlertDialogDescription>Delete "{deletingItem?.name}"? This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletingItem && deleteItem.mutate(deletingItem.id)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

function MenuItemDialog({ open, onOpenChange, onSubmit, isPending, title, initialData }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; description: string | null; price: number; image_url: string | null; category: string | null; is_available: boolean }) => void;
  isPending: boolean;
  title: string;
  initialData?: MenuItem;
}) {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price?.toString() || "",
    image_url: initialData?.image_url || "",
    category: initialData?.category || "",
    is_available: initialData?.is_available ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: form.name,
      description: form.description || null,
      price: parseFloat(form.price),
      image_url: form.image_url || null,
      category: form.category || null,
      is_available: form.is_available,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name *</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price *</Label>
              <Input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g., Mains" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          </div>
          <div className="flex items-center space-x-2">
            <Switch checked={form.is_available} onCheckedChange={(c) => setForm({ ...form, is_available: c })} />
            <Label>Available</Label>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
