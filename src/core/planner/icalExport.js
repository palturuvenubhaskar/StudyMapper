/**
 * Generates an iCalendar (.ics) format string from a schedule.
 * @param {Object} schedule - Parsed plan_json object { dayIndex: [{ title, durationMinutes }] }
 * @param {Date} startDate - The starting date of the plan (usually today)
 */
export const generateIcsString = (schedule, startDate = new Date()) => {
  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//StudyMapper//Smart Planner//EN',
    'CALSCALE:GREGORIAN'
  ];

  const formatDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const dtstamp = formatDate(new Date());

  for (const [dayStr, tasks] of Object.entries(schedule)) {
    const dayIndex = parseInt(dayStr, 10);
    
    // Set start time at 9:00 AM UTC for the target day
    const targetDate = new Date(startDate);
    targetDate.setUTCDate(targetDate.getUTCDate() + dayIndex);
    targetDate.setUTCHours(9, 0, 0, 0);

    let currentStart = new Date(targetDate);

    for (const task of tasks) {
      const dtstart = formatDate(currentStart);
      
      const currentEnd = new Date(currentStart);
      currentEnd.setUTCMinutes(currentEnd.getUTCMinutes() + (task.durationMinutes || 25));
      const dtend = formatDate(currentEnd);

      ics.push('BEGIN:VEVENT');
      ics.push(`DTSTAMP:${dtstamp}`);
      ics.push(`DTSTART:${dtstart}`);
      ics.push(`DTEND:${dtend}`);
      ics.push(`SUMMARY:Study: ${task.title}`);
      ics.push(`DESCRIPTION:StudyMapper Pomodoro Block`);
      ics.push(`UID:${dtstamp}-${dayIndex}-${task.title.replace(/\s/g, '')}@studymapper`);
      ics.push('END:VEVENT');

      // Add a 5 minute break buffer for the next task
      currentStart = new Date(currentEnd);
      currentStart.setMinutes(currentStart.getMinutes() + 5);
    }
  }

  ics.push('END:VCALENDAR');
  return ics.join('\r\n');
};

/**
 * Triggers a browser download of the ICS file
 */
export const downloadIcsFile = (schedule, startDate = new Date()) => {
  const icsString = generateIcsString(schedule, startDate);
  const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', 'study_plan.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
