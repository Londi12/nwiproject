import React, { useState, useEffect } from "react";
import { Task } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Clock, AlertTriangle, Calendar as CalendarIcon } from "lucide-react";
import { isToday, isPast, format, isSameDay } from "date-fns";
import AddTaskDialog from "../../tasks/AddTaskDialog";
import TaskCalendar from "../../tasks/TaskCalendar";
import DayTasksList from "../../tasks/DayTasksList";

export default function TasksPanel() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskType, setNewTaskType] = useState("Follow-up");
  const [loading, setLoading] = useState(true);
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendarView, setShowCalendarView] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await Task.list('-due_date');
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      await Task.create({
        title: newTaskTitle,
        type: newTaskType,
        status: 'Pending',
        due_date: new Date().toISOString().split('T')[0],
        priority: 'Medium',
        description: `Quick task: ${newTaskTitle}`
      });
      setNewTaskTitle("");
      loadTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTaskStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    try {
      await Task.update(taskId, { status: newStatus });
      loadTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

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

  const todayTasks = tasks.filter(task =>
    task.due_date && isToday(new Date(task.due_date)) && task.status !== 'Completed'
  );

  const overdueTasks = tasks.filter(task =>
    task.due_date && isPast(new Date(task.due_date)) && !isToday(new Date(task.due_date)) && task.status !== 'Completed'
  );

  const selectedDateTasks = tasks.filter(task =>
    task.due_date && isSameDay(new Date(task.due_date), selectedDate)
  );

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowCalendarView(true);
  };

  const toggleCalendarView = () => {
    setShowCalendarView(!showCalendarView);
    if (!showCalendarView) {
      setSelectedDate(new Date()); // Reset to today when opening calendar
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-2">
                {showCalendarView ? (
                  <>
                    <CalendarIcon className="w-5 h-5" />
                    Task Calendar
                  </>
                ) : (
                  <>
                    <Clock className="w-5 h-5" />
                    Today's Tasks ({todayTasks.length})
                  </>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCalendarView}
                className="h-8 px-2 text-xs"
              >
                {showCalendarView ? 'List View' : 'Calendar'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 bg-slate-200 rounded animate-pulse" />
              ))
            ) : showCalendarView ? (
              <div className="space-y-4">
                <TaskCalendar
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  tasks={tasks}
                  className="mb-4"
                />
                {selectedDateTasks.length > 0 && (
                  <DayTasksList
                    selectedDate={selectedDate}
                    tasks={tasks}
                    onToggleTask={toggleTaskStatus}
                  />
                )}
              </div>
            ) : todayTasks.length > 0 ? (
              todayTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Checkbox
                    checked={task.status === 'Completed'}
                    onCheckedChange={() => toggleTaskStatus(task.id, task.status)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{task.title}</p>
                    <p className="text-xs text-slate-500">{task.description}</p>
                  </div>
                  <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <CalendarIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-500 mb-3">No tasks due today</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleCalendarView}
                  className="text-xs"
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  View Calendar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Overdue Tasks ({overdueTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-12 bg-slate-200 rounded animate-pulse" />
              ))
            ) : overdueTasks.length > 0 ? (
              overdueTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                  <Checkbox
                    checked={task.status === 'Completed'}
                    onCheckedChange={() => toggleTaskStatus(task.id, task.status)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{task.title}</p>
                    <p className="text-xs text-red-600">Due: {format(new Date(task.due_date), 'MMM d, yyyy')}</p>
                  </div>
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    Overdue
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-4">No overdue tasks</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm rounded-2xl bg-white">
        <CardHeader className="pb-4">
          <CardTitle>Add New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Task description..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
            />
            <Select value={newTaskType} onValueChange={setNewTaskType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Follow-up">Follow-up</SelectItem>
                <SelectItem value="Document Request">Document Request</SelectItem>
                <SelectItem value="Call">Call</SelectItem>
                <SelectItem value="CV Update">CV Update</SelectItem>
                <SelectItem value="Application Review">Application Review</SelectItem>
                <SelectItem value="Payment Follow-up">Payment Follow-up</SelectItem>
                <SelectItem value="Meeting">Meeting</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addTask} className="bg-slate-900 hover:bg-slate-800">
              Add Task
            </Button>
          </div>
          <Button variant="outline" className="mt-3" onClick={() => setShowAddTaskDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Advanced Add
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm rounded-2xl bg-white">
        <CardHeader className="pb-4">
          <CardTitle>All Tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 rounded animate-pulse" />
            ))
          ) : tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
              <Checkbox
                checked={task.status === 'Completed'}
                onCheckedChange={() => toggleTaskStatus(task.id, task.status)}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`font-medium ${task.status === 'Completed' ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                    {task.title}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {task.type}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {task.assigned_to} • Due: {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : 'No due date'}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
                <Badge variant="secondary" className={getStatusColor(task.status)}>
                  {task.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <AddTaskDialog
        open={showAddTaskDialog}
        onOpenChange={setShowAddTaskDialog}
        onSuccess={loadTasks}
      />
    </div>
  );
}
