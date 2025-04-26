import { useState } from "react";
import { Document, KeyDate, Requirements, AIAnalysis } from "@shared/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Share2, 
  CheckCircle, 
  FileQuestion, 
  MessageCircle,
  FileText,
  LightbulbIcon,
  CheckCircle2,
  AlertCircle 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getOpportunityRating, getOpportunityColor } from "@/lib/types";

interface DocumentResultsProps {
  document: Document;
}

export function DocumentResults({ document }: DocumentResultsProps) {
  const [activeRequirementsTab, setActiveRequirementsTab] = useState<'technical' | 'qualifications'>('technical');
  
  // Format key dates
  const getKeyDateIcon = (icon: string) => {
    switch (icon) {
      case 'check':
        return <CheckCircle className="h-4 w-4" />;
      case 'question':
        return <FileQuestion className="h-4 w-4" />;
      case 'comment':
        return <MessageCircle className="h-4 w-4" />;
      case 'file':
        return <FileText className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const opportunityScoreClass = getOpportunityColor(document.opportunityScore || 0);
  const opportunityRating = getOpportunityRating(document.opportunityScore || 0);
  
  return (
    <Card className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
      <CardHeader className="bg-primary px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">{document.title || 'Document Analysis'}</h2>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" className="text-white hover:text-neutral-100" title="Export Results">
              <Download className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:text-neutral-100" title="Share">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Opportunity Score */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-neutral-900">Opportunity Score</h3>
          <div className="flex items-center">
            <div className={`bg-success text-white rounded-full flex items-center justify-center w-12 h-12 font-bold text-lg ${opportunityScoreClass === 'text-success' ? 'bg-success' : opportunityScoreClass === 'text-warning' ? 'bg-warning' : 'bg-error'}`}>
              {document.opportunityScore || 0}
            </div>
            <span className={`ml-2 font-medium ${opportunityScoreClass}`}>{opportunityRating} Match</span>
          </div>
        </div>
        
        {/* Document Summary */}
        <div className="mb-6 pb-6 border-b border-neutral-200">
          <h3 className="text-lg font-medium text-neutral-900 mb-3">Document Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-neutral-700 mb-1">Issuing Agency</p>
              <p className="font-medium text-neutral-900">{document.agency || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-700 mb-1">RFP Number</p>
              <p className="font-medium text-neutral-900">{document.rfpNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-700 mb-1">Due Date</p>
              <p className="font-medium text-neutral-900">{document.dueDate || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-700 mb-1">Estimated Value</p>
              <p className="font-medium text-neutral-900">{document.estimatedValue || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-700 mb-1">Contract Term</p>
              <p className="font-medium text-neutral-900">{document.contractTerm || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-700 mb-1">Contact Person</p>
              <p className="font-medium text-neutral-900">{document.contactPerson || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Key Dates */}
        {document.keyDates && document.keyDates.length > 0 && (
          <div className="mb-6 pb-6 border-b border-neutral-200">
            <h3 className="text-lg font-medium text-neutral-900 mb-3">Key Dates</h3>
            <div className="bg-neutral-100 rounded-lg p-4">
              <div className="relative">
                {(document.keyDates || []).map((date, index) => (
                  <div key={index} className="mb-4 last:mb-0 flex items-start">
                    <div className="flex flex-col items-center mr-4">
                      <div className={`h-6 w-6 rounded-full ${date.passed ? 'bg-primary' : 'bg-warning'} text-white flex items-center justify-center text-xs`}>
                        {getKeyDateIcon(date.icon)}
                      </div>
                      {index < (document.keyDates?.length || 0) - 1 && (
                        <div className="h-full w-0.5 bg-primary mt-1"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{date.event}</p>
                      <p className="text-sm text-neutral-700">{date.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Requirements */}
        {document.requirements && (
          <div className="mb-6 pb-6 border-b border-neutral-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-neutral-900">Key Requirements</h3>
              <span className="text-sm text-neutral-700">
                {((document.requirements.technical?.length || 0) + (document.requirements.qualifications?.length || 0))} requirements found
              </span>
            </div>
            
            <div className="bg-neutral-100 rounded-lg p-4">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-neutral-900">Technical Requirements</h4>
                  <Button 
                    variant="link" 
                    className="text-primary hover:text-secondary text-sm p-0"
                    onClick={() => setActiveRequirementsTab('technical')}
                  >
                    View All
                  </Button>
                </div>
                <ul className="space-y-2">
                  {(document.requirements.technical || []).slice(0, 3).map((req, index) => (
                    <li key={index} className="bg-white p-3 rounded border-l-4 border-primary shadow-sm">
                      <p className="text-neutral-900">{req}</p>
                    </li>
                  ))}
                  {!document.requirements.technical?.length && (
                    <li className="bg-white p-3 rounded text-neutral-500 text-center">
                      <p>No technical requirements found</p>
                    </li>
                  )}
                </ul>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-neutral-900">Qualification Requirements</h4>
                  <Button 
                    variant="link" 
                    className="text-primary hover:text-secondary text-sm p-0"
                    onClick={() => setActiveRequirementsTab('qualifications')}
                  >
                    View All
                  </Button>
                </div>
                <ul className="space-y-2">
                  {(document.requirements.qualifications || []).slice(0, 2).map((req, index) => (
                    <li key={index} className="bg-white p-3 rounded border-l-4 border-warning shadow-sm">
                      <p className="text-neutral-900">{req}</p>
                    </li>
                  ))}
                  {!document.requirements.qualifications?.length && (
                    <li className="bg-white p-3 rounded text-neutral-500 text-center">
                      <p>No qualification requirements found</p>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* AI Analysis */}
        {document.aiAnalysis && (
          <div>
            <h3 className="text-lg font-medium text-neutral-900 mb-3">AI Analysis</h3>
            <div className="bg-neutral-100 rounded-lg p-4">
              <div className="bg-white rounded border border-neutral-200 p-4">
                <h4 className="font-medium text-neutral-900 mb-2">Key Insights</h4>
                <ul className="space-y-2 text-neutral-900">
                  {(document.aiAnalysis.keyInsights || []).map((insight, index) => (
                    <li key={index} className="flex items-start">
                      <LightbulbIcon className="text-warning mt-1 mr-2 h-4 w-4" />
                      <span>{insight}</span>
                    </li>
                  ))}
                  {!document.aiAnalysis.keyInsights?.length && (
                    <li className="text-neutral-500">No key insights available</li>
                  )}
                </ul>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded border border-neutral-200 p-4">
                  <h4 className="font-medium text-neutral-900 mb-2">Strengths</h4>
                  <ul className="space-y-1 text-neutral-900">
                    {(document.aiAnalysis.strengths || []).map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle2 className="text-success mt-1 mr-2 h-4 w-4" />
                        <span>{strength}</span>
                      </li>
                    ))}
                    {!document.aiAnalysis.strengths?.length && (
                      <li className="text-neutral-500">No strengths identified</li>
                    )}
                  </ul>
                </div>
                
                <div className="bg-white rounded border border-neutral-200 p-4">
                  <h4 className="font-medium text-neutral-900 mb-2">Challenges</h4>
                  <ul className="space-y-1 text-neutral-900">
                    {(document.aiAnalysis.challenges || []).map((challenge, index) => (
                      <li key={index} className="flex items-start">
                        <AlertCircle className="text-error mt-1 mr-2 h-4 w-4" />
                        <span>{challenge}</span>
                      </li>
                    ))}
                    {!document.aiAnalysis.challenges?.length && (
                      <li className="text-neutral-500">No challenges identified</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
