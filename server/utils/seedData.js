const ExamSettings = require('../models/ExamSettings');
const TimelineEvent = require('../models/TimelineEvent');
const Subject = require('../models/Subject');
const RevisionTask = require('../models/RevisionTask');
const StudyLog = require('../models/StudyLog');
const MockTest = require('../models/MockTest');

async function seedDefaultData() {
  try {
    // 1. Seed Exam Settings
    const settingsCount = await ExamSettings.countDocuments();
    if (settingsCount === 0) {
      await ExamSettings.create({
        cftriDate: new Date('2026-08-20T09:00:00'),
        cuetDate: new Date('2026-09-05T09:00:00'),
        breakStart: '17:00',
        breakEnd: '17:30',
        pomodoroWork: 25,
        pomodoroShortBreak: 5,
        pomodoroLongBreak: 15
      });
      console.log('🌱 Seeded default Exam Settings');
    }

    // 2. Seed Subjects if empty
    const subjectsCount = await Subject.countDocuments();
    if (subjectsCount === 0) {
      const defaultSubjects = [
        { name: 'Chemistry', category: 'CFTRI', progress: 65, color: '#3b82f6', targetHours: 50 },
        { name: 'Physics', category: 'CFTRI', progress: 45, color: '#06b6d4', targetHours: 40 },
        { name: 'Biology & Biochemistry', category: 'CFTRI', progress: 70, color: '#10b981', targetHours: 45 },
        { name: 'General Aptitude', category: 'CFTRI', progress: 80, color: '#f59e0b', targetHours: 30 },
        { name: 'Domain Subjects', category: 'CUET', progress: 55, color: '#8b5cf6', targetHours: 60 },
        { name: 'General Test', category: 'CUET', progress: 60, color: '#787774', targetHours: 35 },
        { name: 'Language & Verbal', category: 'CUET', progress: 75, color: '#6366f1', targetHours: 25 }
      ];
      await Subject.insertMany(defaultSubjects);
      console.log('🌱 Seeded default Subjects');
    }

    // 3. Seed Timeline Events if empty
    const timelineCount = await TimelineEvent.countDocuments();
    if (timelineCount === 0) {
      const defaultEvents = [
        { title: 'CFTRI Application Deadline', date: new Date('2026-07-28T23:59:59'), notes: 'Submit online application form with certificates', tag: 'CFTRI' },
        { title: 'CUET Admit Card Release', date: new Date('2026-08-10T10:00:00'), notes: 'Download admit card from NTA portal', tag: 'CUET' },
        { title: 'CFTRI Entrance Exam 2026', date: new Date('2026-08-20T09:00:00'), notes: 'Main CFTRI M.Sc. Food Tech Entrance Exam', tag: 'CFTRI' },
        { title: 'CUET PG Entrance Exam 2026', date: new Date('2026-09-05T09:00:00'), notes: 'CUET PG Examination Day', tag: 'CUET' },
        { title: 'Result Declaration & Counselling', date: new Date('2026-09-25T10:00:00'), notes: 'Check merit list and attend online counselling slot', tag: 'General' }
      ];
      await TimelineEvent.insertMany(defaultEvents);
      console.log('🌱 Seeded default Timeline Events');
    }

    // 4. Seed Revision Tasks if empty
    const revisionCount = await RevisionTask.countDocuments();
    if (revisionCount === 0) {
      const defaultTasks = [
        { title: 'Review Food Chemistry reaction mechanisms', category: 'CFTRI', completed: false },
        { title: 'Solve 50 CUET General Test Aptitude MCQs', category: 'CUET', completed: true },
        { title: 'Revise Enzyme Kinetics & Biochemistry formulas', category: 'CFTRI', completed: false },
        { title: 'Practice Reading Comprehension passages', category: 'CUET', completed: false },
        { title: 'Go over weak topics from last Mock Test', category: 'General', completed: true }
      ];
      await RevisionTask.insertMany(defaultTasks);
      console.log('🌱 Seeded default Revision Tasks');
    }

    // 5. Seed sample study logs for current week if empty
    const logsCount = await StudyLog.countDocuments();
    if (logsCount === 0) {
      const todayObj = new Date();
      const formatDate = (d) => d.toISOString().split('T')[0];
      const sampleLogs = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(todayObj);
        d.setDate(d.getDate() - i);
        const dateStr = formatDate(d);
        sampleLogs.push(
          { date: dateStr, subjectName: 'Chemistry', hours: Math.floor(Math.random() * 3) + 1 },
          { date: dateStr, subjectName: 'Biology & Biochemistry', hours: Math.floor(Math.random() * 2) + 1 }
        );
      }
      await StudyLog.insertMany(sampleLogs);
      console.log('🌱 Seeded default Study Logs');
    }

    // 6. Seed mock tests for current month if empty
    const mockCount = await MockTest.countDocuments();
    if (mockCount === 0) {
      const todayObj = new Date();
      const formatDate = (d) => d.toISOString().split('T')[0];
      const mockDates = [];
      for (let i = 1; i <= 5; i++) {
        const d = new Date(todayObj);
        d.setDate(d.getDate() - i);
        mockDates.push({
          date: formatDate(d),
          completed: true,
          score: 85 + i,
          notes: `Practice test #${i} completed`
        });
      }
      await MockTest.insertMany(mockDates);
      console.log('🌱 Seeded default Mock Tests');
    }
  } catch (err) {
    console.error('Error seeding default data:', err.message);
  }
}

module.exports = seedDefaultData;
