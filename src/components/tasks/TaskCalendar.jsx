import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  addMonths, 
  subMonths, 
  isSameMonth, 
  isSameDay, 
  isToday 
} from 'date-fns';

export default function TaskCalendar({ 
  selectedDate = new Date(), 
  onDateSelect, 
  tasks = [], 
  className = "" 
}) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];

  let days = [];
  let day = startDate;
  let formattedDate = "";

  // Generate calendar grid
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      
      // Check if this date has tasks
      const dayTasks = tasks.filter(task => 
        task.due_date && isSameDay(new Date(task.due_date), day)
      );
      
      const hasTask = dayTasks.length > 0;
      const taskCount = dayTasks.length;
      
      // Check for overdue tasks
      const hasOverdueTask = dayTasks.some(task => 
        task.status !== 'Completed' && new Date(task.due_date) < new Date()
      );

      days.push(
        <div
          className={`
            relative p-1 h-10 flex items-center justify-center cursor-pointer text-sm
            transition-all duration-200 rounded-lg
            ${!isSameMonth(day, monthStart) 
              ? 'text-slate-400 hover:bg-slate-50' 
              : 'text-slate-900 hover:bg-blue-50'
            }
            ${isSameDay(day, selectedDate) 
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
              : ''
            }
            ${isToday(day) && !isSameDay(day, selectedDate)
              ? 'bg-slate-900 text-white hover:bg-slate-800 font-semibold' 
              : ''
            }
            ${hasTask && !isSameDay(day, selectedDate) && !isToday(day)
              ? 'ring-2 ring-blue-200' 
              : ''
            }
          `}
          key={day}
          onClick={() => onDateSelect && onDateSelect(cloneDay)}
          title={hasTask ? `${taskCount} task${taskCount > 1 ? 's' : ''} due` : ''}
        >
          <span className="relative z-10">{formattedDate}</span>
          
          {/* Task indicator */}
          {hasTask && (
            <div className="absolute bottom-0.5 right-0.5 z-20">
              <div className={`
                w-2 h-2 rounded-full flex items-center justify-center text-xs font-bold
                ${hasOverdueTask 
                  ? 'bg-red-500' 
                  : isSameDay(day, selectedDate) || isToday(day)
                    ? 'bg-white' 
                    : 'bg-blue-600'
                }
                ${taskCount > 1 ? 'w-3 h-3' : ''}
              `}>
                {taskCount > 9 ? '9+' : taskCount > 1 ? taskCount : ''}
              </div>
            </div>
          )}
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7 gap-1" key={day}>
        {days}
      </div>
    );
    days = [];
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    onDateSelect && onDateSelect(today);
  };

  return (
    <div className={`bg-white ${className}`}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={prevMonth}
          className="h-8 w-8 p-0 hover:bg-slate-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-900">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={nextMonth}
          className="h-8 w-8 p-0 hover:bg-slate-100"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Today Button */}
      <div className="flex justify-center mb-3">
        <Button
          variant="outline"
          size="sm"
          onClick={goToToday}
          className="text-xs px-3 py-1 h-7 border-slate-200 hover:bg-slate-50"
        >
          Today
        </Button>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-xs font-medium text-slate-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="space-y-1">
        {rows}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-slate-200">
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-slate-900 rounded"></div>
            <span>Today</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-600 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span>Has Tasks</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Overdue</span>
          </div>
        </div>
      </div>
    </div>
  );
}
