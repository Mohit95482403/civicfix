import React, { useState, useEffect } from 'react';
import { complaintsService } from '../../services/complaints.service';
import { ComplaintCategory } from '../../types/complaint';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Plus, Tag, Clock } from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<ComplaintCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    complaintsService.getCategories().then((cats) => {
      if (isMounted) {
        setCategories(cats);
        setIsLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brandText">Complaint Categories</h1>
          <p className="text-sm text-brandText-muted mt-1">
            Configure citizen complaint types, target resolution SLAs, and assigned departments.
          </p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4 mr-1.5" /> Add Category
        </Button>
      </div>

      <Card>
        {isLoading ? (
          <div className="py-12 flex justify-center items-center">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border-light text-left text-xs">
              <thead className="bg-slate-50 font-semibold text-brandText-muted uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Category Name</th>
                  <th className="py-3 px-4">Identifier / Slug</th>
                  <th className="py-3 px-4">Target Resolution SLA</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-bold text-brandText">
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{cat.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-brandText-muted">
                      {cat.slug || cat.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-brandText flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {cat.slaHours} hours
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="green">Active</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button variant="ghost" size="sm" className="text-xs text-primary">
                        Edit SLA
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
