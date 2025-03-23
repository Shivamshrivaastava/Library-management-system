
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertTriangle, Clock, BookOpen, X, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLibrary } from '@/context/LibraryContext';
import { Notification } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface NotificationsPanelProps {
  userId: string;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ userId }) => {
  const { getUserNotifications, markNotificationAsRead } = useLibrary();
  const notifications = getUserNotifications(userId);
  
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'due_date':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'custom_reminder':
        return <Calendar className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };
  
  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
  };
  
  if (notifications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            <p>You have no notifications</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {notifications.filter(n => !n.read).length > 0 && (
              <Badge variant="destructive">
                {notifications.filter(n => !n.read).length}
              </Badge>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`relative p-4 border rounded-md ${notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <p className={`${notification.read ? 'text-gray-600' : 'text-gray-800 font-medium'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                  </p>
                </div>
                {!notification.read && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Mark as read</span>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsPanel;
