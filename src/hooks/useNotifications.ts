import { useEffect, useCallback } from 'react';
import type { Todo } from '../types/todo';
import { format, parseISO, subMinutes, subHours, isSameMinute } from 'date-fns';

export const useNotifications = (todos: Todo[]) => {
    const requestPermission = useCallback(async () => {
        if (!('Notification' in window)) return false;
        if (Notification.permission === 'granted') return true;

        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }, []);

    const sendNotification = useCallback((title: string, body: string) => {
        if (Notification.permission === 'granted') {
            new Notification(title, {
                body,
                icon: '/vite.svg', // Default icon
            });
        }
    }, []);

    useEffect(() => {
        const checkNotifications = () => {
            const now = new Date();

            todos.forEach(todo => {
                if (todo.completed) return;

                const [hours, minutes] = todo.dueTime.split(':').map(Number);
                const dueDate = parseISO(todo.dueDate);
                const exactTime = new Date(dueDate);
                exactTime.setHours(hours, minutes, 0, 0);

                // On time notification
                if (todo.notifications.onTime && isSameMinute(now, exactTime)) {
                    sendNotification('⏰ 할 일 시간!', todo.title);
                }

                // 10 min before
                if (todo.notifications.tenMinBefore && isSameMinute(now, subMinutes(exactTime, 10))) {
                    sendNotification('🕒 10분 전입니다', todo.title);
                }

                // 30 min before
                if (todo.notifications.thirtyMinBefore && isSameMinute(now, subMinutes(exactTime, 30))) {
                    sendNotification('⌛ 30분 전입니다', todo.title);
                }

                // 1 hour before
                if (todo.notifications.oneHourBefore && isSameMinute(now, subHours(exactTime, 1))) {
                    sendNotification('🚀 1시간 전입니다', todo.title);
                }
            });

            // Special check for 9 AM daily summary
            if (now.getHours() === 9 && now.getMinutes() === 0) {
                const todaysTasks = todos.filter(t => !t.completed && t.dueDate === format(now, 'yyyy-MM-dd'));
                if (todaysTasks.length > 0) {
                    sendNotification('📅 오늘 할 일', `오늘은 ${todaysTasks.length}개의 할 일이 있습니다.`);
                }
            }
        };

        const interval = setInterval(checkNotifications, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [todos, sendNotification]);

    return { requestPermission };
};
