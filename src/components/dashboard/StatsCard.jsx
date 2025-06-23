import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  loading
}) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    slate: "bg-slate-100 text-slate-600",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600",
    indigo: "bg-indigo-100 text-indigo-600"
  };

  return (
    <Card className="rounded-2xl border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
      <CardContent className="p-3 sm:p-5 flex items-start justify-between">
        {loading ? (
          <div className="space-y-2 w-full">
            <Skeleton className="h-4 sm:h-5 w-3/4" />
            <Skeleton className="h-6 sm:h-8 w-1/2" />
            <Skeleton className="h-3 sm:h-4 w-1/2" />
          </div>
        ) : (
          <>
            <div className="space-y-1 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">{title}</p>
              <p className="text-xl sm:text-3xl font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500 truncate">{subtitle}</p>
            </div>
            <div className={`p-2 sm:p-2.5 rounded-full flex-shrink-0 ${colorClasses[color]}`}>
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
