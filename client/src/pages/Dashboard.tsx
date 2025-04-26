import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Document } from "@shared/schema";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Plus, 
  Calendar, 
  BarChart3, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Search,
  Filter
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getOpportunityRating, getOpportunityColor, nullSafeOpportunityScore } from "@/lib/types";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Query to fetch all documents/opportunities
  const { data: documents, isLoading } = useQuery<Document[]>({
    queryKey: ['/api/documents'],
  });
  
  // Function to get status badge
  const getStatusBadge = (document: Document) => {
    if (!document.processed) return <Badge variant="outline">Processing</Badge>;
    
    const score = document.opportunityScore || 0;
    if (score < 40) return <Badge variant="destructive">Not Recommended</Badge>;
    if (score < 70) return <Badge variant="warning">Potential Match</Badge>;
    return <Badge variant="success">Strong Match</Badge>;
  };
  
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
  
  // Filter documents based on search term
  const filteredDocuments = documents?.filter(doc => 
    doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.agency?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.rfpNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-primary">Opportunities Dashboard</h1>
          <Button 
            className="flex items-center gap-2"
            onClick={() => setLocation("/")}
          >
            <Plus size={16} />
            New Opportunity
          </Button>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Opportunities</p>
                  <p className="text-2xl font-bold">{documents?.length || 0}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Due This Month</p>
                  <p className="text-2xl font-bold">{documents?.filter(doc => 
                    doc.dueDate && new Date(doc.dueDate).getMonth() === new Date().getMonth()
                  ).length || 0}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Strong Matches</p>
                  <p className="text-2xl font-bold">{documents?.filter(doc => 
                    (doc.opportunityScore || 0) >= 70
                  ).length || 0}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Score</p>
                  <p className="text-2xl font-bold">
                    {documents && documents.length > 0 
                      ? Math.round(documents.reduce((sum, doc) => sum + (doc.opportunityScore || 0), 0) / documents.length) 
                      : 0}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search opportunities..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={16} />
            Filters
          </Button>
        </div>
        
        {/* Opportunities List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900">Recent Opportunities</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredDocuments && filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredDocuments.map((document) => (
                <Link key={document.id} href={`/opportunities/${document.id}`}>
                  <a className="block">
                    <Card className="hover:shadow-md transition-shadow duration-200">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row md:items-center p-4">
                          <div className="flex-grow md:pr-8">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-lg text-primary">
                                {document.title || document.fileName}
                              </h3>
                              {getStatusBadge(document)}
                            </div>
                            <div className="text-sm text-neutral-700 mb-2">
                              {document.agency && (
                                <span className="block md:inline mr-4">
                                  <span className="font-medium">Agency:</span> {document.agency}
                                </span>
                              )}
                              {document.rfpNumber && (
                                <span className="block md:inline mr-4">
                                  <span className="font-medium">RFP#:</span> {document.rfpNumber}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6 mt-3 md:mt-0">
                            {document.dueDate && (
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 text-neutral-700 mr-1" />
                                <span className="text-sm">{formatDate(document.dueDate)}</span>
                              </div>
                            )}
                            
                            {document.opportunityScore !== undefined && (
                              <div className="flex items-center">
                                <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-white font-medium", 
                                  nullSafeOpportunityScore(document.opportunityScore) >= 70 ? "bg-success" : 
                                  nullSafeOpportunityScore(document.opportunityScore) >= 40 ? "bg-warning" : "bg-destructive"
                                )}>
                                  {nullSafeOpportunityScore(document.opportunityScore)}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center">
                <AlertCircle className="h-12 w-12 text-neutral-400 mb-4" />
                <h3 className="text-lg font-medium text-neutral-700 mb-2">No opportunities found</h3>
                <p className="text-neutral-600 mb-4">
                  {searchTerm 
                    ? "Try adjusting your search terms or clear filters"
                    : "Get started by uploading your first RFP document"}
                </p>
                <Button onClick={() => setLocation("/")}>Upload New Document</Button>
              </div>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}