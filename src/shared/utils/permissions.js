// Mirrors backend src/config/permissions.js for showing/hiding UI. The server stays the authority.
const P = {
  'org.manage': ['owner'],
  'school.manage': ['owner', 'admin'],
  'years.manage': ['owner', 'admin'],
  'structure.manage': ['owner', 'admin'],
  'users.manage': ['owner', 'admin'],
  'students.write': ['owner', 'admin', 'clerk', 'teacher'],
  'students.leave': ['owner', 'admin', 'clerk'],
  'students.import': ['owner', 'admin', 'clerk'],
  'attendance.write': ['owner', 'admin', 'teacher'],
  'attendance.override': ['owner', 'admin'],
  'diary.write': ['owner', 'admin', 'teacher'],
  'health.write': ['owner', 'admin', 'clerk', 'teacher'],
  'syllabus.edit': ['owner', 'admin'],
  'syllabus.complete': ['owner', 'admin', 'teacher'],
  'marks.write': ['owner', 'admin', 'teacher'],
  'reports.view': ['owner', 'admin', 'clerk', 'teacher'],
  'audit.view': ['owner', 'admin'],
};

export const can = (role, perm) => Boolean(P[perm]?.includes(role));
export const isStaff = (role) => role === 'owner' || role === 'admin';
