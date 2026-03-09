export const getGreetingKey = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'home.greeting.morning';
    if (hour < 17) return 'home.greeting.afternoon';
    if (hour < 21) return 'home.greeting.evening';
    return 'home.greeting.night';
};

export const formatDate = (date: string | Date, format: 'short' | 'medium' | 'long' = 'medium'): string => {
    const d = typeof date === 'string' ? new Date(date) : date;

    switch (format) {
        case 'short':
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        case 'long':
            return d.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        case 'medium':
        default:
            return d.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
    }
};

export const formatTime = (date: string | Date): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
};

export const isToday = (date: string | Date): boolean => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    return d.toDateString() === today.toDateString();
};

export const isYesterday = (date: string | Date): boolean => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return d.toDateString() === yesterday.toDateString();
};

export const getRelativeDateLabel = (date: string | Date): string | null => {
    if (isToday(date)) return 'today';
    if (isYesterday(date)) return 'yesterday';
    return null;
};

export const getMonthRange = (year: number, month: number) => {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    return { start, end };
};

export const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
};