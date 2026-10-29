import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { UserPlus, Search, CheckCircle2 } from 'lucide-react';

interface StaffMember {
  id: string;
  fullName: string;
  email: string;
  role: 'staff' | 'department_supervisor';
  department: string;
  status: 'active' | 'invited' | 'off_duty';
  activeTickets: number;
}

const initialStaff: StaffMember[] = [
  {
    id: 's-1',
    fullName: 'Ramesh Kumar',
    email: 'ramesh.kumar@bbmp.gov.in',
    role: 'staff',
    department: 'Roads & Infrastructure',
    status: 'active',
    activeTickets: 4,
  },
  {
    id: 's-2',
    fullName: 'Suresh B.',
    email: 'suresh.b@bbmp.gov.in',
    role: 'staff',
    department: 'Electrical & Lighting',
    status: 'active',
    activeTickets: 2,
  },
  {
    id: 's-3',
    fullName: 'Kavita Reddy',
    email: 'kavita.r@bbmp.gov.in',
    role: 'department_supervisor',
    department: 'Solid Waste Management',
    status: 'active',
    activeTickets: 6,
  },
  {
    id: 's-4',
    fullName: 'Anand V.',
    email: 'anand.v@bbmp.gov.in',
    role: 'staff',
    department: 'Water Supply & Sewerage',
    status: 'off_duty',
    activeTickets: 0,
  },
];

export const AdminStaffPage: React.FC = () => {
  const [staffList, setStaffList] = useState<StaffMember[]>(initialStaff);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New staff form state
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDepartment, setNewDepartment] = useState('Roads & Infrastructure');
  const [newRole, setNewRole] = useState<'staff' | 'department_supervisor'>('staff');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredStaff = staffList.filter((s) =>
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProvisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    setTimeout(() => {
      const created: StaffMember = {
        id: `s-${Date.now()}`,
        fullName: newFullName.trim(),
        email: newEmail.trim(),
        role: newRole,
        department: newDepartment,
        status: 'invited',
        activeTickets: 0,
      };

      setStaffList((prev) => [created, ...prev]);
      setIsSubmitting(false);
      setFeedback(`Authorized staff credentials provisioned for ${newEmail}. Invitation email dispatched.`);
      setNewFullName('');
      setNewEmail('');
      setTimeout(() => {
        setIsModalOpen(false);
        setFeedback(null);
      }, 2000);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brandText">Staff & Supervisors</h1>
          <p className="text-sm text-brandText-muted mt-1">
            Provision authorized municipal crew members and assign department oversight roles.
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <UserPlus className="w-4 h-4 mr-1.5" /> Provision New Staff
        </Button>
      </div>

      <Card className="p-4">
        <div className="max-w-md">
          <Input
            placeholder="Search staff by name, email, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            prefixIcon={<Search className="w-4 h-4 text-brandText-muted" />}
            className="py-1.5 text-xs"
          />
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-light text-left text-xs">
            <thead className="bg-slate-50 font-semibold text-brandText-muted uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Shift / Status</th>
                <th className="py-3 px-4">Active Orders</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {filteredStaff.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-brandText">{member.fullName}</div>
                    <div className="text-[11px] text-brandText-muted">{member.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={member.role === 'department_supervisor' ? 'purple' : 'blue'}>
                      {member.role === 'department_supervisor' ? 'Supervisor' : 'Technician'}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-brandText">
                    {member.department}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={member.status === 'active' ? 'green' : 'amber'}>
                      {member.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-brandText">
                    {member.activeTickets} work orders
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button variant="ghost" size="sm" className="text-xs text-primary">
                      Edit Permissions
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Provision Staff Modal */}
      {isModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsModalOpen(false)}
          title="Provision Municipal Staff Account"
        >
          {feedback ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{feedback}</span>
            </div>
          ) : (
            <form onSubmit={handleProvisionSubmit} className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed">
                <span className="font-bold">Security Note:</span> Staff accounts can only be provisioned server-side by organization administrators. Public signups cannot create staff accounts.
              </div>

              <Input
                label="Full Name"
                required
                placeholder="e.g. Ramesh Kumar"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
              />

              <Input
                label="Official Email Address"
                type="email"
                required
                placeholder="staff.name@municipality.gov.in"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />

              <div>
                <label className="block text-xs font-semibold text-brandText mb-1">
                  Assign Department
                </label>
                <select
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  className="w-full rounded-xl border border-border-light bg-white p-2.5 text-xs text-brandText focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Roads & Infrastructure">Roads & Infrastructure</option>
                  <option value="Solid Waste Management">Solid Waste Management</option>
                  <option value="Electrical & Lighting">Electrical & Lighting</option>
                  <option value="Water Supply & Sewerage">Water Supply & Sewerage</option>
                  <option value="Drainage & Stormwater">Drainage & Stormwater</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brandText mb-1">
                  Role Authorization
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full rounded-xl border border-border-light bg-white p-2.5 text-xs text-brandText focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="staff">Field Staff / Technician</option>
                  <option value="department_supervisor">Department Supervisor</option>
                </select>
              </div>

              <div className="pt-3 border-t border-border-light flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={isSubmitting}>
                  Provision Account
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};
