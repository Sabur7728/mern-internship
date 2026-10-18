export const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
export const APPLICATION_STATUSES = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Rejected', 'Selected'];
export const dashboardPath = (role) => ({ candidate: '/candidate', recruiter: '/recruiter', admin: '/admin' }[role] || '/');
