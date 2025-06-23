import React, { useState, useEffect } from "react";
import { KnowledgeBase, OccupationKnowledge } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Filter,
  BookOpen,
  Globe,
  Clock,
  ExternalLink,
  Edit,
  Plus,
  Eye,
  Calendar,
  DollarSign,
  Users,
  CheckCircle,
  Award,
  FileText
} from "lucide-react";
import KnowledgeBaseDetailsDialog from "../../knowledge-base/KnowledgeBaseDetailsDialog";
import OccupationDetailsDialog from "../../knowledge-base/OccupationDetailsDialog";

export default function KnowledgeBasePanel({ onEdit, onViewModeChange }) {
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [occupationKnowledge, setOccupationKnowledge] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [viewMode, setViewMode] = useState("visas"); // "visas" or "occupations"
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    loadKnowledgeBase();
    loadOccupationKnowledge();
  }, []);

  useEffect(() => {
    filterEntries();
  }, [knowledgeBase, occupationKnowledge, searchTerm, countryFilter, viewMode]);

  const loadKnowledgeBase = async () => {
    setLoading(true);
    try {
      const data = await KnowledgeBase.list('-last_updated');
      setKnowledgeBase(data || []);
    } catch (error) {
      // Silently handle errors - entities already have fallback logic
      setKnowledgeBase([]);
    } finally {
      setLoading(false);
    }
  };

  const loadOccupationKnowledge = async () => {
    try {
      const data = await OccupationKnowledge.list('-last_updated');
      setOccupationKnowledge(data || []);
    } catch (error) {
      // Silently handle errors - entities already have fallback logic
      setOccupationKnowledge([]);
    }
  };

  const filterEntries = () => {
    let filtered = viewMode === "visas" ? knowledgeBase : occupationKnowledge;

    // Filter by search term
    if (searchTerm) {
      if (viewMode === "visas") {
        filtered = filtered.filter(entry =>
          entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.visa_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.visa_code?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else {
        filtered = filtered.filter(entry =>
          entry.occupation_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.anzsco_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.occupation_category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.country.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    }

    // Filter by country
    if (countryFilter !== "all") {
      filtered = filtered.filter(entry => entry.country === countryFilter);
    }

    setFilteredEntries(filtered);
  };

  const handleViewEntry = (entry) => {
    setSelectedEntry(entry);
    setShowDetailsDialog(true);
  };

  const getCountries = () => {
    const allEntries = viewMode === "visas" ? knowledgeBase : occupationKnowledge;
    const countries = [...new Set(allEntries.map(entry => entry.country))];
    return countries.sort();
  };

  const getStatusColor = (entry) => {
    if (entry.isRecent()) {
      return 'bg-green-100 text-green-800';
    }
    return 'bg-yellow-100 text-yellow-800';
  };

  const getVisaTypeIcon = (visaType) => {
    if (visaType.includes('Skilled') || visaType.includes('Worker')) {
      return '👨‍💼';
    }
    if (visaType.includes('Independent')) {
      return '🎯';
    }
    if (visaType.includes('Employer')) {
      return '🏢';
    }
    if (visaType.includes('Express Entry')) {
      return '🚀';
    }
    return '📄';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Knowledge Base</h2>
            <p className="text-sm sm:text-base text-slate-600">
              {viewMode === "visas" ? "Immigration visa information and guidelines" : "Occupation-specific immigration guidance"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex bg-slate-100 rounded-lg p-1">
            <Button
              variant={viewMode === "visas" ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setViewMode("visas");
                onViewModeChange && onViewModeChange("visas");
              }}
              className="h-7 sm:h-8 px-2 sm:px-3 text-xs"
            >
              Visas
            </Button>
            <Button
              variant={viewMode === "occupations" ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setViewMode("occupations");
                onViewModeChange && onViewModeChange("occupations");
              }}
              className="h-7 sm:h-8 px-2 sm:px-3 text-xs"
            >
              Occupations
            </Button>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
            {filteredEntries.length} {filteredEntries.length === 1 ? 'Entry' : 'Entries'}
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-sm rounded-2xl bg-white">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder={viewMode === "visas" ? "Search visas, countries, or codes..." : "Search occupations, ANZSCO codes, or categories..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {getCountries().map(country => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Base Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-sm rounded-2xl bg-white">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-6 bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredEntries.length > 0 ? (
          viewMode === "visas" ? (
            // Visa Cards
            filteredEntries.map((entry) => (
            <Card key={entry.id} className="border-0 shadow-sm rounded-2xl bg-white hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{entry.getCountryFlag()}</div>
                    <div>
                      <CardTitle className="text-lg leading-tight">{entry.title}</CardTitle>
                      <p className="text-sm text-slate-600 mt-1">{entry.country}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className={getStatusColor(entry)}>
                    {entry.isRecent() ? 'Updated' : 'Review'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Visa Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getVisaTypeIcon(entry.visa_type)}</span>
                    <span className="font-medium text-slate-900">{entry.visa_type}</span>
                  </div>
                  {entry.visa_code && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Code: {entry.visa_code}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Key Info */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {entry.processing_times && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span className="text-slate-600">{entry.processing_times}</span>
                    </div>
                  )}
                  {entry.pathway_to_pr && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-slate-600">PR Pathway</span>
                    </div>
                  )}
                  {entry.family_inclusion && (
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-blue-500" />
                      <span className="text-slate-600">Family</span>
                    </div>
                  )}
                  {entry.fees && Object.keys(entry.fees).length > 0 && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-slate-500" />
                      <span className="text-slate-600">Fees Info</span>
                    </div>
                  )}
                </div>

                {/* Last Updated */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>Updated {entry.getFormattedLastUpdated()}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewEntry(entry)}
                      className="h-8 px-3 text-xs"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(entry)}
                        className="h-8 px-3 text-xs text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            ))
          ) : (
            // Occupation Cards
            filteredEntries.map((entry) => (
              <Card key={entry.id} className="border-0 shadow-sm rounded-2xl bg-white hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{entry.getOccupationIcon()}</div>
                      <div>
                        <CardTitle className="text-lg leading-tight">{entry.occupation_title}</CardTitle>
                        <p className="text-sm text-slate-600 mt-1">{entry.country} • ANZSCO {entry.anzsco_code}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className={entry.isRecent() ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {entry.isRecent() ? 'Updated' : 'Review'}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Occupation Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎯</span>
                      <span className="font-medium text-slate-900">{entry.occupation_category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Skill Level {entry.skill_level}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {entry.occupation_list}
                      </Badge>
                    </div>
                  </div>

                  {/* Key Info */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {entry.visa_types && entry.visa_types.length > 0 && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-slate-600">{entry.visa_types.length} Visa Types</span>
                      </div>
                    )}
                    {entry.assessment_authorities && Object.keys(entry.assessment_authorities).length > 0 && (
                      <div className="flex items-center gap-1">
                        <Award className="w-3 h-3 text-blue-500" />
                        <span className="text-slate-600">Assessment Required</span>
                      </div>
                    )}
                    {entry.salary_benchmarks && Object.keys(entry.salary_benchmarks).length > 0 && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-green-500" />
                        <span className="text-slate-600">Salary Info</span>
                      </div>
                    )}
                    {entry.licensing_requirements && Object.keys(entry.licensing_requirements).length > 0 && (
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3 text-orange-500" />
                        <span className="text-slate-600">Licensing</span>
                      </div>
                    )}
                  </div>

                  {/* Last Updated */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar className="w-3 h-3" />
                      <span>Updated {entry.getFormattedLastUpdated()}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewEntry(entry)}
                        className="h-8 px-3 text-xs"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(entry)}
                          className="h-8 px-3 text-xs text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )
        ) : (
          <div className="col-span-full text-center py-12">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No entries found</h3>
            <p className="text-slate-600">
              {searchTerm || countryFilter !== "all" 
                ? "Try adjusting your search or filters" 
                : "No knowledge base entries available"}
            </p>
          </div>
        )}
      </div>

      {/* Details Dialog */}
      {viewMode === "visas" ? (
        <KnowledgeBaseDetailsDialog
          entry={selectedEntry}
          open={showDetailsDialog}
          onOpenChange={setShowDetailsDialog}
          onSuccess={loadKnowledgeBase}
        />
      ) : (
        <OccupationDetailsDialog
          occupation={selectedEntry}
          open={showDetailsDialog}
          onOpenChange={setShowDetailsDialog}
          onSuccess={loadOccupationKnowledge}
        />
      )}
    </div>
  );
}
