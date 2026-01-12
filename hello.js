

function calculateTimeDifference(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
    return { hours: diffInHours, minutes: diffInMinutes };
}

// Generate user-friendly message
function generateTimeDifferenceMessage(date1, date2) {
    const { hours, minutes } = calculateTimeDifference(date1, date2);
    return `The difference is ${hours} hours and ${minutes} minutes.`;
}