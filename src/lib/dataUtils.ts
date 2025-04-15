
// Format date to human-readable format
export function formatDate(dateString: string): string {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

// Format time to human-readable format
export function formatTime(timeString: string): string {
    if (!timeString) return '';

    try {
        const date = new Date(timeString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    } catch (error) {
        console.error('Error formatting time:', error);
        return timeString;
    }
}

// Generate initials from name
export function getInitials(name: string): string {
    if (!name) return '';

    return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

// Format file size
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number = 100): string {
    if (!text || text.length <= maxLength) return text;

    return text.substring(0, maxLength) + '...';
}

// Convert MongoDB ObjectId format to string
export function formatObjectId(id: any): string {
    if (!id) return '';

    if (typeof id === 'object' && id.$oid) {
        return id.$oid;
    }

    return String(id);
}
// src/lib/dataUtils.ts
export const getMeetings = () => [
    {
      title: 'Team Sync',
      start: '2025-04-12T10:00:00',
      end: '2025-04-12T11:00:00',
    },
    {
      title: 'Client Meeting',
      start: '2025-04-15T15:00:00',
      end: '2025-04-15T16:00:00',
    },
  ];
  
  export const getIndianHolidays = () => [
    { name: 'Republic Day', date: '2025-01-26' },
    { name: 'Independence Day', date: '2025-08-15' },
    { name: 'Diwali', date: '2025-10-20' },
  ];
  