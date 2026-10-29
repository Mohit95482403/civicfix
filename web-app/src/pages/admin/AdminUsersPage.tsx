import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Search, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

interface UserRecord {
  id: string;
  fullName: string;
  email: string;
  role: string;
  joinedDate: string;
  verified: boolean;
  complaintsCount: number;
}

const mockUsers: UserRecord[] = [
  {
    id: 'u-1',
    fullName: 'Mohit Sharma',
    email: 'mohit@example.com',
    role: 'citizen',
    joinedDate: '2026-10-15T10:00:00Z',
    verified: true,
    complaintsCount: 3,
  },
  {
    id: 'u-2',
    fullName: 'Priya Narayanan',
    email: 'priya.n@example.com',
    role: 'citizen',
    joinedDate: '2026-10-18T14:30:00Z',
    verified: true,
    complaintsCount: 5,
  },
  {
    id: 'u-3',
    fullName: 'Ramesh Kumar',
    email: 'ramesh.kumar@bbmp.gov.in',
    role: 'staff',
    joinedDate: '2026-10-01T09:00:00Z',
    verified: true,
    complaintsCount: 0,
  },
  {
    id: 'u-4',
    fullName: 'Ananya Deshmukh',
    email: 'ananya@example.com',
    role: 'citizen',
    joinedDate: '2026-10-24T18:15:00Z',
    verified: true,
    complaintsCount: 1,
  },
];

export const AdminUsersPage: React.FC = () => {
  const [users] = useState<UserRecord[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = users.filter((u) =>
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-brandText">Users Directory</h1>
        <p className="text-sm text-brandText-muted mt-1">
          Registered citizens and municipal staff associated with your municipal zone.
        </p>
      </div>

      <Card className="p-4">
        <div className="max-w-md">
          <Input
            placeholder="Search users by name, email, or role..."
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
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">System Role</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4">Complaints Logged</th>
                <th className="py-3 px-4">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-brandText">{user.fullName}</div>
                    <div className="text-[11px] text-brandText-muted">{user.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={user.role === 'staff' ? 'blue' : 'gray'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    {user.verified ? (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="text-amber-600 font-medium">Pending Verification</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-brandText">
                    {user.complaintsCount} tickets
                  </td>
                  <td className="py-3.5 px-4 text-brandText-muted">
                    {formatDate(user.joinedDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
