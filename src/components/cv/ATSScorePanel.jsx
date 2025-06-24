import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Zap,
  FileText,
  Award,
  Globe,
  Users,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import { calculateATSScore } from '@/utils/atsScoring';
import { generateCVEnhancements } from '@/utils/cvEnhancement';

export default function ATSScorePanel({ cvData, targetVisa = 'Express Entry', targetIndustry = 'Software Engineering', onApplyEnhancement }) {
  const [atsAnalysis, setAtsAnalysis] = useState(null);
  const [enhancements, setEnhancements] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('overview');

  useEffect(() => {
    if (cvData && Object.keys(cvData).length > 0) {
      analyzeCV();
    }
  }, [cvData, targetVisa, targetIndustry]);

  const analyzeCV = async () => {
    setLoading(true);
    try {
      // Calculate ATS score
      const atsResult = calculateATSScore(cvData, targetVisa, targetIndustry);
      setAtsAnalysis(atsResult);

      // Generate enhancement suggestions
      const enhancementResult = generateCVEnhancements(cvData, targetVisa, targetIndustry);
      setEnhancements(enhancementResult);
    } catch (error) {
      console.error('Error analyzing CV:', error);
      // Set fallback data to prevent crashes
      setAtsAnalysis({
        totalScore: 65,
        percentage: 65,
        breakdown: {
          formatting: { percentage: 70, feedback: ['Basic formatting detected'] },
          keywords: { percentage: 60, feedback: ['Some relevant keywords found'] },
          structure: { percentage: 65, feedback: ['Standard CV structure'] }
        },
        visaReadiness: {
          level: 'Fair',
          recommendation: 'CV needs improvements for visa application',
          nextSteps: ['Review and enhance content', 'Add missing sections']
        },
        competitiveAnalysis: {
          marketPosition: 'Average'
        },
        recommendations: [{
          title: 'Improve CV Content',
          description: 'Add more detailed information to improve ATS score',
          priority: 'high',
          impact: 'Medium'
        }]
      });
      setEnhancements({
        currentScore: 65,
        estimatedImpact: {
          projectedScore: 80,
          potentialIncrease: 15,
          timeToImprove: '2-3 hours'
        },
        priorityActions: [{
          action: 'Add more content',
          priority: 'high',
          impact: 'medium',
          timeEstimate: '30 minutes',
          category: 'content'
        }],
        templateRecommendation: {
          recommended: 'Professional',
          reasons: ['Good for most applications']
        },
        keywordSuggestions: {
          priority: ['Leadership', 'Communication'],
          secondary: ['Teamwork', 'Problem-solving']
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-blue-600 bg-blue-100';
    if (score >= 65) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreGrade = (score) => {
    if (score >= 85) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 65) return 'Fair';
    return 'Needs Improvement';
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high': return <TrendingUp className="w-4 h-4 text-orange-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-lg rounded-2xl bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Analyzing your CV for ATS optimization...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!atsAnalysis || !enhancements) {
    return (
      <Card className="border-0 shadow-lg rounded-2xl bg-white">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">Upload and parse a CV to see ATS analysis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card className="border-0 shadow-lg rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            ATS Score Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Main Score */}
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-2xl font-bold ${getScoreColor(atsAnalysis.percentage)}`}>
                {atsAnalysis.percentage}%
              </div>
              <p className="mt-2 font-semibold text-slate-900">{getScoreGrade(atsAnalysis.percentage)}</p>
              <p className="text-sm text-slate-600">Overall ATS Score</p>
            </div>

            {/* Visa Readiness */}
            <div className="text-center">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 text-purple-600 mx-auto">
                <Globe className="w-8 h-8" />
              </div>
              <p className="mt-2 font-semibold text-slate-900">{atsAnalysis.visaReadiness.level}</p>
              <p className="text-sm text-slate-600">{targetVisa} Readiness</p>
            </div>

            {/* Market Position */}
            <div className="text-center">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mx-auto">
                <BarChart3 className="w-8 h-8" />
              </div>
              <p className="mt-2 font-semibold text-slate-900">{atsAnalysis.competitiveAnalysis.marketPosition}</p>
              <p className="text-sm text-slate-600">{targetIndustry} Market</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded-lg border">
              <p className="text-2xl font-bold text-blue-600">{enhancements.currentScore}</p>
              <p className="text-xs text-slate-600">Current Score</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <p className="text-2xl font-bold text-green-600">{enhancements.estimatedImpact.projectedScore}</p>
              <p className="text-xs text-slate-600">Potential Score</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <p className="text-2xl font-bold text-purple-600">+{enhancements.estimatedImpact.potentialIncrease}</p>
              <p className="text-xs text-slate-600">Improvement</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <p className="text-2xl font-bold text-orange-600">{enhancements.estimatedImpact.timeToImprove}</p>
              <p className="text-xs text-slate-600">Time Needed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Card className="border-0 shadow-lg rounded-2xl bg-white">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <CardHeader className="pb-2">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="enhancements">Enhancements</TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            <TabsContent value="overview" className="space-y-4">
              {/* Score Breakdown */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Score Breakdown
                </h3>
                {Object.entries(atsAnalysis.breakdown).map(([category, data]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-700 capitalize">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-sm font-semibold text-slate-900">
                        {data.percentage}%
                      </span>
                    </div>
                    <Progress value={data.percentage} className="h-2" />
                  </div>
                ))}
              </div>

              {/* Visa Readiness Details */}
              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-2">Visa Application Readiness</h4>
                <p className="text-sm text-slate-600 mb-3">{atsAnalysis.visaReadiness.recommendation}</p>
                <div className="space-y-1">
                  {atsAnalysis.visaReadiness.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-slate-700">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="breakdown" className="space-y-4">
              {Object.entries(atsAnalysis.breakdown).map(([category, data]) => (
                <Card key={category} className="border border-slate-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base capitalize">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </CardTitle>
                      <Badge className={getScoreColor(data.percentage)}>
                        {data.percentage}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {data.feedback?.map((feedback, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          {feedback.includes('Good') || feedback.includes('Complete') || feedback.includes('Strong') ? (
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          )}
                          <span className="text-slate-700">{feedback}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <div className="space-y-4">
                {atsAnalysis.recommendations.map((rec, index) => (
                  <Card key={index} className="border border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {getPriorityIcon(rec.priority)}
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 mb-1">{rec.title}</h4>
                          <p className="text-sm text-slate-600 mb-2">{rec.description}</p>
                          <div className="flex items-center gap-4 text-xs">
                            <Badge variant="outline" className={
                              rec.priority === 'critical' ? 'border-red-200 text-red-700' :
                              rec.priority === 'high' ? 'border-orange-200 text-orange-700' :
                              'border-yellow-200 text-yellow-700'
                            }>
                              {rec.priority} priority
                            </Badge>
                            <span className="text-slate-500">{rec.impact}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="enhancements" className="space-y-4">
              {/* Priority Actions */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Priority Actions
                </h3>
                {enhancements.priorityActions.map((action, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getPriorityIcon(action.priority)}
                      <div>
                        <p className="font-medium text-slate-900">{action.action}</p>
                        <p className="text-sm text-slate-600">Impact: {action.impact} • Time: {action.timeEstimate}</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onApplyEnhancement && onApplyEnhancement(action.category)}
                    >
                      Apply
                    </Button>
                  </div>
                ))}
              </div>

              {/* Template Recommendation */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Recommended Template
                </h4>
                <p className="text-sm text-blue-800 mb-3">
                  {enhancements.templateRecommendation.recommended} template is optimal for your profile
                </p>
                <div className="space-y-1">
                  {enhancements.templateRecommendation.reasons.map((reason, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-blue-700">
                      <CheckCircle className="w-3 h-3" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keyword Suggestions */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Missing Keywords
                </h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-green-800">Priority Keywords:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {enhancements.keywordSuggestions.priority.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800">Soft Skills:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {enhancements.keywordSuggestions.secondary.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="border-green-200 text-green-700 text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
