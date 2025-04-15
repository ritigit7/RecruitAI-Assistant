export async function getIndianHolidays(year: number): Promise<any[]> {
    const API_KEY = '6rbx7rSJykbVCCcjEWqEOTf8nURCsZvT'; 
    const COUNTRY = 'IN';
  
    const url = `https://calendarific.com/api/v2/holidays?&api_key=${API_KEY}&country=${COUNTRY}&year=${year}`;
  
    try {
      const response = await fetch(url);
      const json = await response.json();
      return json.response.holidays.map((holiday: any) => ({
        name: holiday.name,
        date: new Date(holiday.date.iso),
        description: holiday.description,
        type: 'holiday',
      }));
    } catch (error) {
      console.error("Failed to fetch holidays:", error);
      return [];
    }
  }
  