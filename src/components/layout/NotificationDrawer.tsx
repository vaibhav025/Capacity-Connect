import { useEffect, useRef } from "react";
import {
  X,
  Bell,
  BookOpen,
  FileText,
  Award,
  Megaphone,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDemo, markNotificationsRead } from "../../lib/demoStore";

export function NotificationDrawer({
  open,
  onClose,
  role,
}: {
  open: boolean;
  onClose: () => void;
  role: string;
}) {
  const { notifications } = useDemo();
  const nav = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => markNotificationsRead(), 3000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [open, onClose]);

  const typeIcon = (type: string) => {
    switch (type) {
      case "course":
        return <BookOpen size={16} />;
      case "deadline":
        return <FileText size={16} />;
      case "certificate":
        return <Award size={16} />;
      case "announcement":
        return <Megaphone size={16} />;
      case "event":
        return <Calendar size={16} />;
      case "feedback":
        return <CheckCircle2 size={16} />;
      default:
        return <Bell size={16} />;
    }
  };

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <>
      {open && (
        <div className="notification-backdrop" onClick={onClose} />
      )}
      <div
        ref={ref}
        className={`notification-drawer ${open ? "open" : ""}`}
        role="dialog"
        aria-label="Notifications"
      >
        <div className="drawer-header">
          <h3>
            <Bell size={18} />
            Notifications
            {unread > 0 && <span className="unread-badge">{unread}</span>}
          </h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="drawer-body">
          {!notifications.length ? (
            <div className="drawer-empty">
              <Bell size={32} />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <button
                key={notif.id}
                className={`notification-item ${!notif.read ? "unread" : ""}`}
                onClick={() => {
                  if (notif.link) {
                    nav(notif.link);
                  }
                  onClose();
                }}
              >
                <div className="notif-icon">{typeIcon(notif.type)}</div>
                <div className="notif-content">
                  <strong>{notif.title}</strong>
                  <p>{notif.body}</p>
                  <small>
                    {new Date(notif.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </small>
                </div>
                {!notif.read && <div className="notif-dot" />}
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}
