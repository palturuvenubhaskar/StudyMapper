import { describe, it, expect } from 'vitest';
import { generateIcsString } from './icalExport';

describe('iCal Export Tests', () => {
  it('generates a valid ICS string from a schedule', () => {
    const schedule = {
      0: [{ title: 'Math 101', durationMinutes: 25 }],
      1: [{ title: 'Physics 101', durationMinutes: 50 }]
    };

    const startDate = new Date('2026-08-25T00:00:00.000Z');
    
    const ics = generateIcsString(schedule, startDate);
    
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('VERSION:2.0');
    expect(ics).toContain('SUMMARY:Study: Math 101');
    expect(ics).toContain('SUMMARY:Study: Physics 101');
    expect(ics).toContain('END:VCALENDAR');
    
    // Check Date formatting (e.g., 20260825T090000Z)
    expect(ics).toContain('DTSTART:20260825T090000Z'); // 9 AM on day 0
    expect(ics).toContain('DTSTART:20260826T090000Z'); // 9 AM on day 1
  });
});
