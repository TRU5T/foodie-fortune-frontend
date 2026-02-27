import { useEffect, useState } from "react";
import { useVendorRewards } from "@/hooks/useVendorRewards";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { Tables } from "@/integrations/supabase/types";

type Reward = Tables<'rewards'>;

interface EditRewardDialogProps {
  reward: Reward | null;
  loyaltyType: 'stamps' | 'points';
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditRewardDialog = ({ reward, loyaltyType, open, onOpenChange }: EditRewardDialogProps) => {
  const { updateReward } = useVendorRewards();
  const [formData, setFormData] = useState({
    name: "", description: "", stamps_required: 10, points_required: 0, image_url: "", is_active: true,
  });

  useEffect(() => {
    if (reward) {
      setFormData({
        name: reward.name,
        description: reward.description || "",
        stamps_required: reward.stamps_required,
        points_required: reward.points_required,
        image_url: reward.image_url || "",
        is_active: reward.is_active,
      });
    }
  }, [reward]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reward) return;
    updateReward.mutate({ id: reward.id, ...formData }, { onSuccess: () => onOpenChange(false) });
  };

  if (!reward) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Reward</DialogTitle>
          <DialogDescription>Update your reward details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Reward Name *</Label>
            <Input id="edit-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea id="edit-description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
          </div>
          {loyaltyType === 'stamps' ? (
            <div className="space-y-2">
              <Label htmlFor="edit-stamps">Stamps Required *</Label>
              <Input id="edit-stamps" type="number" min="1" value={formData.stamps_required} onChange={(e) => setFormData({ ...formData, stamps_required: parseInt(e.target.value) })} required />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="edit-points">Points Required *</Label>
              <Input id="edit-points" type="number" min="1" value={formData.points_required} onChange={(e) => setFormData({ ...formData, points_required: parseInt(e.target.value) })} required />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="edit-image">Image URL</Label>
            <Input id="edit-image" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="edit-active" checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} />
            <Label htmlFor="edit-active">Active</Label>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={updateReward.isPending}>{updateReward.isPending ? "Saving..." : "Save Changes"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
