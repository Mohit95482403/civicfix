import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Building2, Plus, Users } from 'lucide-react';

interface Department {
  id: string;
  name: string;
  code: string;
  supervisor: string;
  techniciansCount: number;
  activeOrders: number;
  slaTargetHours: number;
}

const mockDepartments: Department[] = [
  {
    id: 'dept-1',
    name: 'Roads & Infrastructure Engineering',
    code: 'ROADS',
    supervisor: 'Siddharth Rao (EE)',
    techniciansCount: 18,
    activeOrders: 12,
    slaTargetHours: 48,
  },
  {
    id: 'dept-2',
    name: 'Solid Waste Management & Sanitation',
    code: 'SWM',
    supervisor: 'Kavita Reddy (Chief Inspector)',
    techniciansCount: 24,
    activeOrders: 18,
    slaTargetHours: 24,
  },
  {
    id: 'dept-3',
    name: 'Electrical Services & Public Streetlighting',
    code: 'ELEC',
    supervisor: 'Raghavan Iyer (AEE)',
    techniciansCount: 12,
    activeOrders: 7,
    slaTargetHours: 36,
  },
  {
    id: 'dept-4',
    name: 'Water Supply & Underground Drainage',
    code: 'BWSSB',
    supervisor: 'M. Venkat (Divisional Eng)',
    techniciansCount: 16,
    activeOrders: 9,
    slaTargetHours: 24,
  },
];

export const AdminDepartmentsPage: React.FC = () => {
  const [departments] = useState<Department[]>(mockDepartments);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brandText">Departments</h1>
          <p className="text-sm text-brandText-muted mt-1">
            Operational divisions responsible for specific civic grievance categories.
          </p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4 mr-1.5" /> Add Department
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {departments.map((dept) => (
          <Card key={dept.id} className="p-5 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-brandText">{dept.name}</h3>
                  <span className="font-mono text-xs text-brandText-muted uppercase">Code: {dept.code}</span>
                </div>
              </div>
              <Badge variant="blue">{dept.slaTargetHours}h SLA</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border-light text-xs">
              <div>
                <span className="text-brandText-muted block mb-0.5">Assigned Supervisor</span>
                <span className="font-semibold text-brandText">{dept.supervisor}</span>
              </div>
              <div>
                <span className="text-brandText-muted block mb-0.5">Field Technicians</span>
                <span className="font-semibold text-brandText flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-primary" /> {dept.techniciansCount} Staff
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
              <span className="text-brandText-muted">Active Work Orders:</span>
              <span className="font-bold text-primary font-mono">{dept.activeOrders} active</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
