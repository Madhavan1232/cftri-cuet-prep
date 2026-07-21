import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { api } from './services/api';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CountdownCard from './components/CountdownCard';
import Timeline from './components/Timeline';
import ScheduleBlock from './components/ScheduleBlock';
import SubjectProgress from './components/SubjectProgress';
import WeeklyStudyChart from './components/WeeklyStudyChart';
import MockTracker from './components/MockTracker';
import PomodoroTimer from './components/PomodoroTimer';
import RevisionPlanner from './components/RevisionPlanner';
import NotesStorage from './components/NotesStorage';
import SettingsModal from './components/SettingsModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Application Data States
  const [examSettings, setExamSettings] = useState(null);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [studyLogs, setStudyLogs] = useState([]);
  const [mockTests, setMockTests] = useState([]);
  const [streakData, setStreakData] = useState({ currentStreak: 0, longestStreak: 0 });
  const [revisionTasks, setRevisionTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load All Dashboard Data
  const loadData = async () => {
    try {
      setLoading(true);
      const [
        examsData,
        timelineData,
        subjectsData,
        logsData,
        mockData,
        streakRes,
        revisionData,
        notesData
      ] = await Promise.all([
        api.getExams(),
        api.getTimeline(),
        api.getSubjects(),
        api.getStudyLogs(),
        api.getMockTests(),
        api.getStreak(),
        api.getRevisionTasks(),
        api.getNotes()
      ]);

      setExamSettings(examsData);
      setTimelineEvents(timelineData);
      setSubjects(subjectsData);
      setStudyLogs(logsData);
      setMockTests(mockData);
      setStreakData(streakRes);
      setRevisionTasks(revisionData);
      setNotes(notesData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers
  const handleSaveSettings = async (updatedSettings) => {
    const res = await api.updateExams(updatedSettings);
    setExamSettings(res);
  };

  const handleAddTimelineEvent = async (eventData) => {
    await api.addTimelineEvent(eventData);
    const updated = await api.getTimeline();
    setTimelineEvents(updated);
  };

  const handleDeleteTimelineEvent = async (id) => {
    await api.deleteTimelineEvent(id);
    setTimelineEvents(prev => prev.filter(e => e._id !== id));
  };

  const handleUpdateSubject = async (id, data) => {
    const updated = await api.updateSubject(id, data);
    setSubjects(prev => prev.map(s => (s._id === id ? updated : s)));
  };

  const handleAddSubject = async (data) => {
    const created = await api.addSubject(data);
    setSubjects(prev => [...prev, created]);
  };

  const handleDeleteSubject = async (id) => {
    await api.deleteSubject(id);
    setSubjects(prev => prev.filter(s => s._id !== id));
  };

  const handleLogStudyHours = async (logData) => {
    await api.logStudyHours(logData);
    const [updatedLogs, streakRes] = await Promise.all([
      api.getStudyLogs(),
      api.getStreak()
    ]);
    setStudyLogs(updatedLogs);
    setStreakData(streakRes);
  };

  const handleToggleMockTest = async (mockData) => {
    await api.toggleMockTest(mockData);
    const [updatedMock, streakRes] = await Promise.all([
      api.getMockTests(),
      api.getStreak()
    ]);
    setMockTests(updatedMock);
    setStreakData(streakRes);
  };

  const handleAddRevisionTask = async (taskData) => {
    const created = await api.addRevisionTask(taskData);
    setRevisionTasks(prev => [created, ...prev]);
  };

  const handleToggleRevisionTask = async (id, completed) => {
    const updated = await api.updateRevisionTask(id, { completed });
    setRevisionTasks(prev => prev.map(t => (t._id === id ? updated : t)));
  };

  const handleDeleteRevisionTask = async (id) => {
    await api.deleteRevisionTask(id);
    setRevisionTasks(prev => prev.filter(t => t._id !== id));
  };

  const handleUploadNote = async (formData) => {
    await api.uploadNote(formData);
    const updatedNotes = await api.getNotes();
    setNotes(updatedNotes);
  };

  const handleDeleteNote = async (id) => {
    await api.deleteNote(id);
    setNotes(prev => prev.filter(n => n._id !== id));
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        {/* Sticky Header */}
        <Header
          streakData={streakData}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Main Content Area with Sidebar */}
        <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />

          <main className="flex-1 p-4 lg:p-8 space-y-6 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Top Exam Countdowns Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <CountdownCard
                        title="CFTRI Entrance Exam 2026"
                        targetDate={examSettings?.cftriDate || '2026-08-20T09:00:00'}
                        badgeColor="blue"
                        onEdit={() => setIsSettingsOpen(true)}
                      />

                      <CountdownCard
                        title="CUET PG Entrance Exam 2026"
                        targetDate={examSettings?.cuetDate || '2026-09-05T09:00:00'}
                        badgeColor="purple"
                        onEdit={() => setIsSettingsOpen(true)}
                      />
                    </div>

                    {/* Schedule Block & Timeline */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 space-y-6">
                        <ScheduleBlock
                          breakStart={examSettings?.breakStart}
                          breakEnd={examSettings?.breakEnd}
                        />

                        <WeeklyStudyChart
                          studyLogs={studyLogs}
                          subjects={subjects}
                          onLogHours={handleLogStudyHours}
                        />
                      </div>

                      <div className="space-y-6">
                        <Timeline
                          events={timelineEvents}
                          onAddEvent={handleAddTimelineEvent}
                          onDeleteEvent={handleDeleteTimelineEvent}
                        />

                        <MockTracker
                          mockTests={mockTests}
                          onToggleMockTest={handleToggleMockTest}
                        />
                      </div>
                    </div>

                    {/* Subject Progress */}
                    <SubjectProgress
                      subjects={subjects}
                      onUpdateSubject={handleUpdateSubject}
                      onAddSubject={handleAddSubject}
                      onDeleteSubject={handleDeleteSubject}
                    />
                  </div>
                )}

                {/* STUDY TRACKER TAB */}
                {activeTab === 'tracker' && (
                  <div className="space-y-6">
                    <WeeklyStudyChart
                      studyLogs={studyLogs}
                      subjects={subjects}
                      onLogHours={handleLogStudyHours}
                    />

                    <SubjectProgress
                      subjects={subjects}
                      onUpdateSubject={handleUpdateSubject}
                      onAddSubject={handleAddSubject}
                      onDeleteSubject={handleDeleteSubject}
                    />

                    <MockTracker
                      mockTests={mockTests}
                      onToggleMockTest={handleToggleMockTest}
                    />
                  </div>
                )}

                {/* POMODORO TAB */}
                {activeTab === 'pomodoro' && (
                  <div className="space-y-6">
                    <PomodoroTimer
                      workMinutes={examSettings?.pomodoroWork || 25}
                      shortBreakMinutes={examSettings?.pomodoroShortBreak || 5}
                      longBreakMinutes={examSettings?.pomodoroLongBreak || 15}
                      subjects={subjects}
                      onLogStudySession={handleLogStudyHours}
                    />
                  </div>
                )}

                {/* REVISION PLANNER TAB */}
                {activeTab === 'revision' && (
                  <div className="space-y-6">
                    <RevisionPlanner
                      tasks={revisionTasks}
                      onAddTask={handleAddRevisionTask}
                      onToggleTask={handleToggleRevisionTask}
                      onDeleteTask={handleDeleteRevisionTask}
                    />
                  </div>
                )}

                {/* NOTES VAULT TAB */}
                {activeTab === 'notes' && (
                  <div className="space-y-6">
                    <NotesStorage
                      notes={notes}
                      subjects={subjects}
                      onUploadNote={handleUploadNote}
                      onDeleteNote={handleDeleteNote}
                    />
                  </div>
                )}
              </>
            )}
          </main>
        </div>

        {/* Global Settings Modal */}
        <SettingsModal
          settings={examSettings}
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onSave={handleSaveSettings}
        />
      </div>
    </ThemeProvider>
  );
}
