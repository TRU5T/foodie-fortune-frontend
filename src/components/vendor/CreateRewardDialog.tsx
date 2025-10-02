import { useState } from "react";
import { useVendorRewards } from "@/hooks/useVendorRewards";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface CreateRewardDialogProps {
  restaurantId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateRewardDialog = ({
  restaurantId,
  open,
  onOpenChange,
}: CreateRewardDialogProps) => {
  const { createReward } = useVendorRewards();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    stamps_required: 10,
    points_required: 0,
    image_url: "",
    is_active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createReward.mutate(
      {
        restaurant_id: restaurantId,
        ...formData,
      },
      {
        onSuccess: () => {
          setFormData({
            name: "",
            description: "",
            stamps_required: 10,
            points_required: 0,
            image_url: "",
            is_active: true,
          });
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Reward</DialogTitle>
          <DialogDescription>
            Set up a new stamp card reward for your customers
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Reward Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Free Coffee"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your reward..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stamps">Stamps Required *</Label>
              <Input
                id="stamps"
                type="number"
                min="1"
                value={formData.stamps_required}
                onChange={(e) =>
                  setFormData({ ...formData, stamps_required: parseInt(e.target.value) })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="points">Points Required</Label>
              <Input
                id="points"
                type="number"
                min="0"
                value={formData.points_required}
                onChange={(e) =>
                  setFormData({ ...formData, points_required: parseInt(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="active">Active (visible to customers)</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createReward.isPending}>
              {createReward.isPending ? "Creating..." : "Create Reward"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
