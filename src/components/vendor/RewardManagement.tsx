import { useState } from "react";
import { useVendorRewards } from "@/hooks/useVendorRewards";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Award } from "lucide-react";
import { EditRewardDialog } from "./EditRewardDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Reward } from "@/types/database.types";

interface RewardManagementProps {
  restaurantId: string;
}

export const RewardManagement = ({ restaurantId }: RewardManagementProps) => {
  const { rewards, isLoadingRewards, deleteReward } = useVendorRewards(restaurantId);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [deletingReward, setDeletingReward] = useState<Reward | null>(null);

  if (isLoadingRewards) {
    return <div className="text-center py-8">Loading rewards...</div>;
  }

  if (!rewards || rewards.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Rewards Yet</h3>
          <p className="text-muted-foreground">
            Create your first stamp card reward to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <Card key={reward.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{reward.name}</CardTitle>
                <Badge variant={reward.is_active ? "default" : "secondary"}>
                  {reward.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {reward.image_url && (
                <img
                  src={reward.image_url}
                  alt={reward.name}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
              )}
              <p className="text-sm text-muted-foreground mb-4">
                {reward.description || "No description"}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stamps Required:</span>
                  <span className="font-medium">{reward.stamps_required}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Points:</span>
                  <span className="font-medium">{reward.points_required}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setEditingReward(reward)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={() => setDeletingReward(reward)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <EditRewardDialog
        reward={editingReward}
        open={!!editingReward}
        onOpenChange={(open) => !open && setEditingReward(null)}
      />

      <AlertDialog open={!!deletingReward} onOpenChange={(open) => !open && setDeletingReward(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Reward</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingReward?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingReward) {
                  deleteReward.mutate(deletingReward.id);
                  setDeletingReward(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
