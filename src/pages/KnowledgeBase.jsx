import React, { useState } from 'react';
import { User } from '@/entities/User';
import KnowledgeBasePanel from '@/components/dashboard/panels/KnowledgeBasePanel';
import KnowledgeBaseEditDialog from '@/components/knowledge-base/KnowledgeBaseEditDialog';
import OccupationEditDialog from '@/components/knowledge-base/OccupationEditDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Shield, BookOpen } from 'lucide-react';

export default function KnowledgeBase({ onNavigate }) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showOccupationEditDialog, setShowOccupationEditDialog] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [editingOccupation, setEditingOccupation] = useState(null);
  const [currentViewMode, setCurrentViewMode] = useState("visas");
  const currentUser = User.getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  const handleCreateNew = () => {
    if (currentViewMode === "visas") {
      setEditingEntry(null);
      setShowEditDialog(true);
    } else {
      setEditingOccupation(null);
      setShowOccupationEditDialog(true);
    }
  };

  const handleEdit = (entry) => {
    if (currentViewMode === "visas") {
      setEditingEntry(entry);
      setShowEditDialog(true);
    } else {
      setEditingOccupation(entry);
      setShowOccupationEditDialog(true);
    }
  };

  const handleDialogClose = () => {
    setShowEditDialog(false);
    setShowOccupationEditDialog(false);
    setEditingEntry(null);
    setEditingOccupation(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-3 sm:px-6 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="text-white w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Knowledge Base</h1>
                <p className="text-slate-600 mt-1 text-sm sm:text-base">
                  Comprehensive immigration visa information for associates
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {isAdmin && (
                <>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 flex items-center gap-1 text-xs">
                    <Shield className="w-3 h-3" />
                    <span className="hidden sm:inline">Admin Access</span>
                    <span className="sm:hidden">Admin</span>
                  </Badge>
                  <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm px-3 sm:px-4">
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Add {currentViewMode === "visas" ? "Visa" : "Occupation"}</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </>
              )}
              {!isAdmin && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                  Associate View
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
        <KnowledgeBasePanel
          onEdit={isAdmin ? handleEdit : null}
          onViewModeChange={setCurrentViewMode}
        />
      </div>

      {/* Admin Edit Dialogs */}
      {isAdmin && (
        <>
          <KnowledgeBaseEditDialog
            entry={editingEntry}
            open={showEditDialog}
            onOpenChange={handleDialogClose}
            onSuccess={() => {
              handleDialogClose();
              // Refresh the panel - this would typically be handled by a state management solution
              window.location.reload();
            }}
          />

          <OccupationEditDialog
            occupation={editingOccupation}
            open={showOccupationEditDialog}
            onOpenChange={handleDialogClose}
            onSuccess={() => {
              handleDialogClose();
              // Refresh the panel - this would typically be handled by a state management solution
              window.location.reload();
            }}
          />
        </>
      )}
    </div>
  );
}
