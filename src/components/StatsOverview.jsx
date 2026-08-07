import React from 'react';
import { Users, Clock, CheckCircle, TrendingUp } from 'lucide-react';

export const StatsOverview = ({ leads }) => {
  const total = leads.length;
  const todo = leads.filter((l) => l.status === 'todo').length;
  const completed = leads.filter((l) => l.status === 'completed').length;
  const conversionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md-grid-cols-4 gap-4 my-6">
      {/* Total Leads */}
      <div className="glass-panel p-4 flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-amber-500 text-slate-950 font-bold">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl font-black font-heading text-white">{total}</div>
          <div className="text-xs text-gray-400">Total Leads</div>
        </div>
      </div>

      {/* To-Do Pending */}
      <div className="glass-panel p-4 flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-amber-500 text-slate-950 font-bold">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl font-black font-heading text-amber-400">{todo}</div>
          <div className="text-xs text-gray-400">Pending To-Do</div>
        </div>
      </div>

      {/* Completed */}
      <div className="glass-panel p-4 flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-emerald-400 text-slate-950 font-bold">
          <CheckCircle className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl font-black font-heading text-emerald-400">{completed}</div>
          <div className="text-xs text-gray-400">Completed & Sent</div>
        </div>
      </div>

      {/* Conversion Rate */}
      <div className="glass-panel p-4 flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-purple-400 text-slate-950 font-bold">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl font-black font-heading text-purple-300">{conversionRate}%</div>
          <div className="text-xs text-gray-400">Conversion Rate</div>
        </div>
      </div>
    </div>
  );
};
