import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintsService } from '../../services/complaints.service';
import { Complaint } from '../../types/complaint';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { getStatusBadgeVariant, getPriorityBadgeVariant, formatTimeAgo } from '../../utils/formatters';
import { Wrench, MapPin, Clock, CheckCircle2 } from 'lucide-react';

export const StaffAssignedPage: React.FC = () => {
  const [tasks, setTasks] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    complaintsService.getAllComplaints().then((all) => {
      if (isMounted) {
        // Filter tasks that are actively assigned or in progress
        setTasks(all.filter((c) => c.status === 'assigned' || c.status === 'in_progress'));
        setIsLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-brandText">My Assigned Tasks</h1>
        <p className="text-sm text-brandText-muted mt-1">
          Active field work orders specifically queued for your team today.
        </p>
      </div>

      <Card>
        {isLoading ? (
          <div className="py-12 flex justify-center items-center">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="py-12 text-center text-brandText-muted space-y-2">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500" />
            <h3 className="text-sm font-bold text-brandText">All Caught Up!</h3>
            <p className="text-xs text-brandText-muted">You have no pending assignments in your active queue.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 border border-border-light rounded-xl hover:border-primary/40 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary bg-primary-50 px-2 py-0.5 rounded">
                      {task.trackingNumber}
                    </span>
                    <Badge variant={getStatusBadgeVariant(task.status)}>
                      {task.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant={getPriorityBadgeVariant(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>

                  <h3 className="text-sm font-bold text-brandText">{task.title}</h3>

                  <div className="flex items-center gap-4 text-xs text-brandText-muted pt-1">
                    {task.address && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {task.address}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Assigned {formatTimeAgo(task.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <Link to={`/staff/complaints/${task.id}`}>
                    <Button variant="primary" size="sm" className="text-xs">
                      <Wrench className="w-3.5 h-3.5 mr-1" /> Open Order
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
