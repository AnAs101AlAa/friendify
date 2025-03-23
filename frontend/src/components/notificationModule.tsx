import React, { useEffect, useState } from 'react';
import { useNotification } from '../context/notificationContext';
import { FaCircleInfo, FaCircleCheck, FaCircleXmark } from 'react-icons/fa6';

const NotificationModule: React.FC = () => {
  const { notifications, removeNotification } = useNotification();
  const [animation, setAnimation] = useState<string>('translate-y-48');

  useEffect(() => {
    if (notifications.length > 0) {
      setTimeout(() => {
        setAnimation('translate-y-0');
      }, 30);
    }
    if (notifications.length === 0) {
      setAnimation('translate-y-48');
    }
  }, [notifications]);

  const filteredNotifications = notifications.reduce((acc, notification) => {
    if (notification.type === 'error' && acc.some(n => n.type === 'error')) {
      return acc;
    }
    return [...acc, notification];
  }, [] as typeof notifications);

  return (
    <div className={`fixed bottom-0 left-1/2 transition-all duration-150 ease-in-out -translate-x-1/2 p-4 space-y-2 z-50 ${animation}`}>
      {filteredNotifications.map(notification => (
        <NotificationItem key={notification.id} notification={notification} removeNotification={removeNotification} />
      ))}
    </div>
  );
};

interface NotificationItemProps {
  notification: {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
    duration: number;
  };
  removeNotification: (id: number) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, removeNotification }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      removeNotification(notification.id);
    }, notification.duration);

    return () => clearTimeout(timer);
  }, [notification, removeNotification]);

  return (
    <div className={`transition-all ease-in-out relative rounded-t-xl shadow-2xl bg-[#111B21] text-white min-w-[300px] max-w-[400px] w-full ${notification.type === 'success' ? 'border-[#00a884]' : notification.type === 'error' ? 'border-[#CD3A38]' : 'border-[#272727]'} border-b-4`}>
      <div className='flex gap-3 items-center p-4 font-semibold md:text-[14px] text-[12px]'>
        {notification.type === 'success' ? <FaCircleCheck className='text-[#00a884] size-5 md:size-6' /> : notification.type === 'error' ? <FaCircleXmark className='text-[#CD3A38] size-5 md:size-6' /> : <FaCircleInfo className='text-[#272727] size-5 md:size-6' />}
        <p>{notification.message}</p>
      </div>
    </div>
  );
};

export default NotificationModule;