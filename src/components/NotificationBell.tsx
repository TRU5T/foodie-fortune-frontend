import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

export const NotificationBell = () => {
  const { data: notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = (notif: { id: string; is_read: boolean; link: string | null }) => {
    if (!notif.is_read) markAsRead.mutate(notif.id);
    if (notif.link) {
      navigate(notif.link);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b">
          <h4 className="font-semibold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-xs h-auto py-1" onClick={() => markAllAsRead.mutate()}>
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-80">
          {(!notifications || notifications.length === 0) ? (
            <p className="text-center text-sm text-muted-foreground py-8">No notifications yet</p>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                className={`w-full text-left p-3 border-b last:border-0 hover:bg-muted/50 transition-colors ${!n.is_read ? "bg-primary/5" : ""}`}
                onClick={() => handleClick(n)}
              >
                <p className={`text-sm ${!n.is_read ? "font-semibold" : ""}`}>{n.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                </p>
              </button>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
