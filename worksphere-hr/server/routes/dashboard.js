const r = require('express').Router();
const Employee = require('../models/Employee'), Department = require('../models/Department'), Attendance = require('../models/Attendance'), Leave = require('../models/Leave');
const { wrap, fail, day } = require('../utils/helpers'), { authenticateUser, requireRole } = require('../middleware/auth');
r.use(authenticateUser);
const cnt = (M, m) => M.countDocuments(m);
const grp = (M, f, m = {}) => M.aggregate([{ $match: m }, { $group: { _id: '$' + f, value: { $sum: 1 } } }, { $sort: { value: -1 } }]).then(a => a.map(x => ({ label: x._id, value: x.value })));
const byDept = () => Employee.aggregate([{ $group: { _id: '$department', value: { $sum: 1 } } }, { $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'd' } }, { $project: { label: { $arrayElemAt: ['$d.name', 0] }, value: 1 } }, { $sort: { value: -1 } }]);
const card = (label, value) => ({ label, value });

r.get('/admin', requireRole('admin'), wrap(async (q, s) => {
  const t = day(new Date());
  const [total, active, inactive, depts, att, pend, onLeave, dept, status, leaves, today] = await Promise.all([
    cnt(Employee, {}), cnt(Employee, { status: 'Active' }), cnt(Employee, { status: { $in: ['Inactive', 'Resigned'] } }), cnt(Department, { isActive: true }),
    cnt(Attendance, { date: t }), cnt(Leave, { status: 'Pending' }), cnt(Employee, { status: 'On Leave' }),
    byDept(), grp(Employee, 'status'), grp(Leave, 'status'), grp(Attendance, 'status', { date: t })]);
  s.json({ cards: [card('Total employees', total), card('Active employees', active), card('Inactive employees', inactive), card('Departments', depts), card("Today's attendance", att), card('Pending leaves', pend), card('On leave', onLeave)],
    charts: [{ title: 'Employees by department', data: dept }, { title: 'Employee status', data: status }, { title: "Today's attendance", data: today }, { title: 'Leave requests by status', data: leaves }] });
}));

r.get('/hr', requireRole('admin', 'hr'), wrap(async (q, s) => {
  const t = day(new Date());
  const [total, att, late, absent, pend, dept, today, recent] = await Promise.all([
    cnt(Employee, {}), cnt(Attendance, { date: t }), cnt(Attendance, { date: t, status: 'Late' }), cnt(Attendance, { date: t, status: 'Absent' }), cnt(Leave, { status: 'Pending' }),
    byDept(), grp(Attendance, 'status', { date: t }), Employee.find().sort({ createdAt: -1 }).limit(5).populate('department', 'name')]);
  s.json({ cards: [card('Total employees', total), card("Today's attendance", att), card('Late today', late), card('Absent today', absent), card('Pending leaves', pend)],
    charts: [{ title: 'Employees by department', data: dept }, { title: "Today's attendance", data: today }],
    recent: { title: 'Recent employee records', headers: ['ID', 'Name', 'Department', 'Designation'], rows: recent.map(e => [e.employeeId, `${e.firstName} ${e.lastName}`, e.department?.name, e.designation]) } });
}));

r.get('/employee', wrap(async (q, s) => {
  const e = q.employee; if (!e) throw fail(404, 'No employee profile linked');
  const m = new Date(); m.setUTCDate(1); m.setUTCHours(0, 0, 0, 0);
  const [month, pend, recent] = await Promise.all([grp(Attendance, 'status', { employee: e._id, date: { $gte: m } }), cnt(Leave, { employee: e._id, status: 'Pending' }), Attendance.find({ employee: e._id }).sort({ date: -1 }).limit(5)]);
  const g = k => (month.find(x => x.label === k) || {}).value || 0;
  s.json({ profile: { name: `${e.firstName} ${e.lastName}`, employeeId: e.employeeId, department: e.department?.name, designation: e.designation, joiningDate: e.joiningDate.toISOString().slice(0, 10) },
    cards: [card('Present (this month)', g('Present')), card('Late (this month)', g('Late')), card('Absent (this month)', g('Absent')), card('Pending leaves', pend)],
    recent: { title: 'Recent attendance', headers: ['Date', 'Check in', 'Check out', 'Status', 'Hours'], rows: recent.map(a => [a.date.toISOString().slice(0, 10), a.checkIn || '-', a.checkOut || '-', a.status, a.workHours]) } });
}));
module.exports = r;
