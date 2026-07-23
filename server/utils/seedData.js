const supabase = require('../lib/supabase');

async function seedDefaultData() {
  try {
    // 1. Seed Exam Settings (only if table is empty)
    const { data: existingSettings } = await supabase
      .from('exam_settings')
      .select('id')
      .limit(1);

    if (!existingSettings || existingSettings.length === 0) {
      await supabase.from('exam_settings').insert({
        cftri_date: '2026-08-20T09:00:00Z',
        cuet_date: '2026-09-05T09:00:00Z',
        break_start: '17:00',
        break_end: '17:30',
        pomodoro_work: 25,
        pomodoro_short_break: 5,
        pomodoro_long_break: 15
      });
      console.log('🌱 Seeded default Exam Settings');
    }

    // 2. Seed Subjects if empty
    const { data: existingSubjects } = await supabase
      .from('subjects')
      .select('id')
      .limit(1);

    if (!existingSubjects || existingSubjects.length === 0) {
      await supabase.from('subjects').insert([
        { name: 'Chemistry', category: 'CFTRI', progress: 65, color: '#3b82f6', target_hours: 50 },
        { name: 'Physics', category: 'CFTRI', progress: 45, color: '#06b6d4', target_hours: 40 },
        { name: 'Biology & Biochemistry', category: 'CFTRI', progress: 70, color: '#10b981', target_hours: 45 },
        { name: 'General Aptitude', category: 'CFTRI', progress: 80, color: '#f59e0b', target_hours: 30 },
        { name: 'Domain Subjects', category: 'CUET', progress: 55, color: '#8b5cf6', target_hours: 60 },
        { name: 'General Test', category: 'CUET', progress: 60, color: '#787774', target_hours: 35 },
        { name: 'Language & Verbal', category: 'CUET', progress: 75, color: '#6366f1', target_hours: 25 }
      ]);
      console.log('🌱 Seeded default Subjects');
    }

    // 3. Seed Timeline Events if empty
    const { data: existingTimeline } = await supabase
      .from('timeline_events')
      .select('id')
      .limit(1);

    if (!existingTimeline || existingTimeline.length === 0) {
      await supabase.from('timeline_events').insert([
        { title: 'CFTRI Application Deadline', date: '2026-07-28T23:59:59Z', notes: 'Submit online application form with certificates', tag: 'CFTRI' },
        { title: 'CUET Admit Card Release', date: '2026-08-10T10:00:00Z', notes: 'Download admit card from NTA portal', tag: 'CUET' },
        { title: 'CFTRI Entrance Exam 2026', date: '2026-08-20T09:00:00Z', notes: 'Main CFTRI M.Sc. Food Tech Entrance Exam', tag: 'CFTRI' },
        { title: 'CUET PG Entrance Exam 2026', date: '2026-09-05T09:00:00Z', notes: 'CUET PG Examination Day', tag: 'CUET' },
        { title: 'Result Declaration & Counselling', date: '2026-09-25T10:00:00Z', notes: 'Check merit list and attend online counselling slot', tag: 'General' }
      ]);
      console.log('🌱 Seeded default Timeline Events');
    }

    // 4. Seed Revision Tasks if empty
    const { data: existingRevision } = await supabase
      .from('revision_tasks')
      .select('id')
      .limit(1);

    if (!existingRevision || existingRevision.length === 0) {
      await supabase.from('revision_tasks').insert([
        { title: 'Review Food Chemistry reaction mechanisms', category: 'CFTRI', completed: false },
        { title: 'Solve 50 CUET General Test Aptitude MCQs', category: 'CUET', completed: true },
        { title: 'Revise Enzyme Kinetics & Biochemistry formulas', category: 'CFTRI', completed: false },
        { title: 'Practice Reading Comprehension passages', category: 'CUET', completed: false },
        { title: 'Go over weak topics from last Mock Test', category: 'General', completed: true }
      ]);
      console.log('🌱 Seeded default Revision Tasks');
    }

    // 5. Seed sample study logs for current week if empty
    const { data: existingLogs } = await supabase
      .from('study_logs')
      .select('id')
      .limit(1);

    if (!existingLogs || existingLogs.length === 0) {
      const todayObj = new Date();
      const formatDate = (d) => d.toISOString().split('T')[0];
      const sampleLogs = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(todayObj);
        d.setDate(d.getDate() - i);
        const dateStr = formatDate(d);
        sampleLogs.push(
          { date: dateStr, subject_name: 'Chemistry', hours: Math.floor(Math.random() * 3) + 1 },
          { date: dateStr, subject_name: 'Biology & Biochemistry', hours: Math.floor(Math.random() * 2) + 1 }
        );
      }
      await supabase.from('study_logs').insert(sampleLogs);
      console.log('🌱 Seeded default Study Logs');
    }

    // 6. Seed mock tests for the past 5 days if empty
    const { data: existingMock } = await supabase
      .from('mock_tests')
      .select('id')
      .limit(1);

    if (!existingMock || existingMock.length === 0) {
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
      await supabase.from('mock_tests').insert(mockDates);
      console.log('🌱 Seeded default Mock Tests');
    }
  } catch (err) {
    console.error('Error seeding default data:', err.message);
  }
}

module.exports = seedDefaultData;
