import { lazy } from 'react';
import { Navigate } from 'react-router';
import { can, isStaff } from '../shared/utils/permissions';

// Every page is lazy-loaded; `perm` hides routes the role cannot use.
const page = (load) => lazy(load);
const P = {
  Today: page(() => import('../features/today/TodayPage')),
  Dashboard: page(() => import('../features/dashboard/DashboardPage')),
  Attendance: page(() => import('../features/attendance/AttendancePage')),
  TakeAttendance: page(() => import('../features/attendance/TakeAttendancePage')),
  Register: page(() => import('../features/attendance/RegisterPage')),
  Students: page(() => import('../features/students/StudentListPage')),
  Student: page(() => import('../features/students/StudentProfilePage')),
  Import: page(() => import('../features/students/ImportStudentsPage')),
  Syllabus: page(() => import('../features/syllabus/SyllabusPage')),
  Subject: page(() => import('../features/syllabus/SubjectSyllabusPage')),
  Marks: page(() => import('../features/marks/MarksPage')),
  ReportCard: page(() => import('../features/marks/ReportCardPage')),
  Classes: page(() => import('../features/classes/ClassesPage')),
  Staff: page(() => import('../features/staff/StaffPage')),
  StaffDetail: page(() => import('../features/staff/StaffDetailPage')),
  Years: page(() => import('../features/years/YearsPage')),
  Rollover: page(() => import('../features/years/RolloverWizard')),
  Holidays: page(() => import('../features/holidays/HolidaysPage')),
  School: page(() => import('../features/school/SchoolPage')),
  Audit: page(() => import('../features/audit/AuditPage')),
  Profile: page(() => import('../features/profile/ProfilePage')),
};

export const routes = (role) =>
  [
    { path: '/', element: isStaff(role) || role === 'clerk' ? <Navigate to="/dashboard" replace /> : <P.Today /> },
    { path: '/dashboard', element: <P.Dashboard />, perm: 'reports.view' },
    { path: '/attendance', element: <P.Attendance /> },
    { path: '/attendance/register', element: <P.Register />, perm: 'reports.view' },
    { path: '/attendance/:sectionId', element: <P.TakeAttendance /> },
    { path: '/students', element: <P.Students /> },
    { path: '/students/import', element: <P.Import />, perm: 'students.import' },
    { path: '/students/:id', element: <P.Student /> },
    { path: '/report-card/:studentId', element: <P.ReportCard /> },
    { path: '/syllabus', element: <P.Syllabus /> },
    { path: '/syllabus/subjects/:id', element: <P.Subject /> },
    { path: '/marks', element: <P.Marks />, perm: 'marks.write' },
    { path: '/classes', element: <P.Classes />, perm: 'structure.manage' },
    { path: '/staff', element: <P.Staff />, perm: 'users.manage' },
    { path: '/staff/:id', element: <P.StaffDetail />, perm: 'users.manage' },
    { path: '/years', element: <P.Years />, perm: 'years.manage' },
    { path: '/years/new', element: <P.Rollover />, perm: 'years.manage' },
    { path: '/holidays', element: <P.Holidays />, perm: 'structure.manage' },
    { path: '/school', element: <P.School />, perm: 'school.manage' },
    { path: '/audit', element: <P.Audit />, perm: 'audit.view' },
    { path: '/me', element: <P.Profile /> },
  ].filter((r) => !r.perm || can(role, r.perm));
