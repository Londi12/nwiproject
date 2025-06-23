import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { format, isSameDay, isToday } from 'date-fns';
import { Clock, AlertTriangle } from 'lucide-react';

export default function DayTasksList({ 
  selectedDate, 
  tasks = [], 
  onToggleTask,
  className = "" 
}) {
  // Filter tasks for the selected date
  const dayTasks = tasks.filter(task => 
    task.due_date && isSameDay(new Date(task.due_date), selectedDate)
  );

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'bg-blue-100 text-blue-800',
      'Medium': 'bg-orange-100 text-orange-800',
      'High': 'bg-slate-100 text-slate-800',
      'Urgent': 'bg-slate-200 text-slate-900'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const isOverdue = (task) => {
    return task.due_date && 
           new Date(task.due_date) < new Date() && 
           !isToday(new Date(task.due_date)) && 
           task.status !== 'Completed';
  };

  const formatDateHeader = (date) => {
    if (isToday(date)) {
      return "Today's Tasks";
    }
    return `Tasks for ${format(date, 'EEEE, MMMM d, yyyy')}`;
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
        <Clock className="w-4 h-4 text-slate-600" />
        <h4 className="font-medium text-slate-900">
          {formatDateHeader(selectedDate)}
        </h4>
        <Badge variant="secondary" className="ml-auto">
          {dayTasks.length}
        </Badge>
      </div>

      {/* Tasks List */}
      {dayTasks.length > 0 ? (
        <div className="space-y-2">
          {dayTasks.map((task) => (
            <div 
              key={task.id} 
              className={`
                flex items-center gap-3 p-3 rounded-lg border transition-colors
                ${isOverdue(task) 
                  ? 'bg-red-50 border-red-200' 
                  : task.status === 'Completed'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }
              `}
            >
              <Checkbox
                checked={task.status === 'Completed'}
                onCheckedChange={() => onToggleTask && onToggleTask(task.id, task.status)}
                className="flex-shrink-0"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className={`
                    font-medium truncate
                    ${task.status === 'Completed' 
                      ? 'line-through text-slate-500' 
                      : 'text-slate-900'
                    }
                  `}>
                    {task.title}
                  </p>
                  {isOverdue(task) && (
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  )}
                </div>
                
                {task.description && (
                  <p className="text-xs text-slate-600 mb-2 line-clamp-2">
                    {task.description}
                  </p>
                )}
                
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Badge variant="outline" className="text-xs">
                    {task.type}
                  </Badge>
                  {task.assigned_to && (
                    <span>• {task.assigned_to}</span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col gap-1 items-end">
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getPriorityColor(task.priority)}`}
                >
                  {task.priority}
                </Badge>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getStatusColor(task.status)}`}
                >
                  {task.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">
            No tasks scheduled for {format(selectedDate, 'MMMM d, yyyy')}
          </p>
        </div>
      )}
    </div>
  );
}
