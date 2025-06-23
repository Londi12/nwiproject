import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle,
  Plus,
  User,
  Flag
} from "lucide-react";
import { Task } from '@/entities/all';

export default function TasksOverview({ loading }) {
  const [tasks, setTasks] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoadingData(true);
    try {
      const data = await Task.list('-created_date');
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const getTasksByCategory = () => {
    const overdue = tasks.filter(task => {
      if (!task.due_date || task.status === 'Completed') return false;
      return new Date(task.due_date) < new Date();
    });

    const dueToday = tasks.filter(task => {
      if (!task.due_date || task.status === 'Completed') return false;
      const today = new Date().toDateString();
      const dueDate = new Date(task.due_date).toDateString();
      return today === dueDate;
    });

    const highPriority = tasks.filter(task => 
      task.priority === 'High' && task.status !== 'Completed'
    );

    return { overdue, dueToday, highPriority };
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'High': 'bg-orange-100 text-orange-800',
      'Urgent': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Not Started': 'bg-gray-100 text-gray-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
      'On Hold': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loadingData) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const { overdue, dueToday, highPriority } = getTasksByCategory();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Tasks & Overdue Summary</h2>
          <p className="text-sm text-slate-600">Global task view across all associates</p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Task Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              Overdue Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 mb-2">{overdue.length}</div>
            <p className="text-sm text-red-700">Require immediate attention</p>
            <div className="mt-4 space-y-2">
              {overdue.slice(0, 3).map(task => (
                <div key={task.id} className="flex items-center justify-between text-sm">
                  <span className="text-red-800 truncate">{task.title}</span>
                  <Badge className="bg-red-200 text-red-800 text-xs">{task.assigned_to}</Badge>
                </div>
              ))}
              {overdue.length > 3 && (
                <div className="text-xs text-red-600">+{overdue.length - 3} more</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Clock className="w-5 h-5" />
              Due Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600 mb-2">{dueToday.length}</div>
            <p className="text-sm text-yellow-700">Tasks due today</p>
            <div className="mt-4 space-y-2">
              {dueToday.slice(0, 3).map(task => (
                <div key={task.id} className="flex items-center justify-between text-sm">
                  <span className="text-yellow-800 truncate">{task.title}</span>
                  <Badge className="bg-yellow-200 text-yellow-800 text-xs">{task.assigned_to}</Badge>
                </div>
              ))}
              {dueToday.length > 3 && (
                <div className="text-xs text-yellow-600">+{dueToday.length - 3} more</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Flag className="w-5 h-5" />
              High Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 mb-2">{highPriority.length}</div>
            <p className="text-sm text-orange-700">High priority tasks</p>
            <div className="mt-4 space-y-2">
              {highPriority.slice(0, 3).map(task => (
                <div key={task.id} className="flex items-center justify-between text-sm">
                  <span className="text-orange-800 truncate">{task.title}</span>
                  <Badge className="bg-orange-200 text-orange-800 text-xs">{task.assigned_to}</Badge>
                </div>
              ))}
              {highPriority.length > 3 && (
                <div className="text-xs text-orange-600">+{highPriority.length - 3} more</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Tasks Table */}
      <Card className="rounded-2xl border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            All Tasks
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-200">
                  <TableHead className="font-semibold">Task</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Priority</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Assigned To</TableHead>
                  <TableHead className="font-semibold">Due Date</TableHead>
                  <TableHead className="font-semibold">Related</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.slice(0, 20).map((task) => (
                  <TableRow key={task.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-slate-900">{task.title}</div>
                        {task.description && (
                          <div className="text-sm text-slate-600 truncate max-w-xs">
                            {task.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {task.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(task.status)} text-xs`}>
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-600" />
                        <span className="text-sm text-slate-900">{task.assigned_to}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-slate-600">
                        {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-slate-600">
                        {task.related_application_id && (
                          <span>App: {task.related_application_id}</span>
                        )}
                        {task.related_lead_id && (
                          <span>Lead: {task.related_lead_id}</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
