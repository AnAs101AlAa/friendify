import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  duration: number; // Add duration for the notification
}

interface NotificationContextProps {
  notifications: Notification[];
  addNotification: (message: string, type: 'success' | 'error' | 'info', duration?: number) => void;
  removeNotification: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string, type: 'success' | 'error' | 'info', duration: number = 4000) => {
    const id = new Date().getTime();
    setNotifications([...notifications, { id, message, type, duration }]);
    setTimeout(() => removeNotification(id), duration); // Auto-remove after the specified duration
  };

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};