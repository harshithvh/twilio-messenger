import { differenceInDays, startOfDay } from 'date-fns';

// Priority for task model
// 0 - Due date is today
// 1 - Due date is between tomorrow and day after tomorrow
// 2 - 3-4
// 3 - 5+
const getNewPriority = (due_date) => {
    const today = startOfDay(new Date());
    const tomorrow = startOfDay(new Date());
    tomorrow.setDate(today.getDate() + 1);
    const dayAfterTomorrow = startOfDay(new Date());
    dayAfterTomorrow.setDate(today.getDate() + 2);

    const daysDifference = differenceInDays(startOfDay(new Date(due_date)), today);

    if (daysDifference <= 0) {
        return 0;
    } else if (daysDifference <= 1) {
        return 1;
    } else if (daysDifference <= 2) {
        return 2;
    } else {
        return 3;
    }
}

export default getNewPriority;