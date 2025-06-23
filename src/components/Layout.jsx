import React, { useState, useEffect } from 'react';
import { User as AuthUser } from '@/entities/User';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  User,
  LogOut,
  Settings,
  BookOpen,
  Plane,
  Globe,
  Users,
  FileText,
  Calendar,
  CheckSquare,
  Phone,
  FolderOpen,
  Award,
  Search,
  HelpCircle,
  MessageSquare,
  Menu,
  X
} from "lucide-react";

export default function Layout({ children, currentPageName, onNavigate }) {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New lead assigned: Michael Chen",
      message: "Express Entry application from South Africa",
      time: "2 minutes ago",
      type: "lead",
      unread: true
    },
    {
      id: 2,
      title: "Task due today: Follow up with Sarah Johnson",
      message: "Document review for Provincial Nominee Program",
      time: "1 hour ago",
      type: "task",
      unread: true
    },
    {
      id: 3,
      title: "Application approved for David Wilson",
      message: "Work Permit application successfully processed",
      time: "3 hours ago",
      type: "success",
      unread: true
    }
  ]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = async () => {
    try {
      await AuthUser.logout();
      onNavigate?.('welcome');
    } catch (error) {
      console.error('Logout error:', error);
      onNavigate?.('welcome');
    }
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'lead': return <Users className="w-4 h-4 text-blue-600" />;
      case 'task': return <CheckSquare className="w-4 h-4 text-orange-600" />;
      case 'success': return <Award className="w-4 h-4 text-green-600" />;
      default: return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate?.('Dashboard')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-r from-slate-900 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Plane className="text-white w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl lg:text-2xl font-bold text-slate-900">Visa Flow</h1>
                <p className="text-xs text-slate-500">Immigration Services</p>
              </div>
            </button>
            
            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6">
              <button
                onClick={() => onNavigate?.('Dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  currentPageName === 'Dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Globe className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => onNavigate?.('KnowledgeBase')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  currentPageName === 'KnowledgeBase'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Knowledge Base
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            {/* Search Button */}
            <Button variant="ghost" size="icon" className="hidden md:flex rounded-full">
              <Search className="h-5 w-5" />
            </Button>

            {/* Knowledge Base Quick Access */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full">
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Quick Reference
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onNavigate?.('KnowledgeBase')}>
                  <div className="flex items-start gap-3 w-full">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Express Entry Process</p>
                      <p className="text-xs text-slate-500">Complete guide for Canadian immigration</p>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNavigate?.('KnowledgeBase')}>
                  <div className="flex items-start gap-3 w-full">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FolderOpen className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Required Documents</p>
                      <p className="text-xs text-slate-500">Checklist for South African applicants</p>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNavigate?.('KnowledgeBase')}>
                  <div className="flex items-start gap-3 w-full">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Processing Times</p>
                      <p className="text-xs text-slate-500">Current estimated timelines</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center p-0 bg-red-500">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {unreadCount} new
                    </Badge>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((notification) => (
                  <DropdownMenuItem 
                    key={notification.id} 
                    className="p-3 cursor-pointer"
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        notification.type === 'lead' ? 'bg-blue-100' :
                        notification.type === 'task' ? 'bg-orange-100' :
                        notification.type === 'success' ? 'bg-green-100' : 'bg-slate-100'
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm ${notification.unread ? 'text-slate-900' : 'text-slate-600'}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{notification.message}</p>
                        <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                      </div>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center text-sm text-blue-600 hover:text-blue-700">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 cursor-pointer">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">Immigration Consultant</p>
                    <p className="text-xs text-slate-500">consultant@visaflow.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onNavigate?.('profile')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-slate-200">
            <nav className="flex flex-col gap-2">
              <button
                onClick={() => {
                  onNavigate?.('Dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  currentPageName === 'Dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Globe className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => {
                  onNavigate?.('KnowledgeBase');
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  currentPageName === 'KnowledgeBase'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Knowledge Base
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="p-4 lg:p-6">
        {children}
      </main>
    </div>
  );
}
