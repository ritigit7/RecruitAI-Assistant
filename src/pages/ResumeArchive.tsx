import React, { useEffect, useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Search, Filter, Eye, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getResumes, generatePersonResumePdf } from '@/services/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const ResumeArchive = () => {
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResume, setSelectedResume] = useState<any>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const data = await getResumes();
        setResumes(data);
      } catch (err) {
        console.error("Failed to load resumes:", err);
      }
    };

    fetchResumes();
  }, []);

  const handleViewResume = async (resume) => {
    setSelectedResume(resume);
    setIsGeneratingPdf(true);
    try {
      // Pass the specific resume ID
      const resumeId = resume._id.$oid || resume._id;
      const pdfBlob = await generatePersonResumePdf(resumeId);
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfBlobUrl(pdfUrl);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleCloseDialog = () => {
    setSelectedResume(null);
    setPdfBlobUrl(null);
  };

  return (
    <PageLayout title="Resume Archive">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Resume History</h1>
            <p className="text-neutral-gray">
              Access and review all previously parsed resumes.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-blue-primary hover:bg-blue-primary/90" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Parse New
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-gray" />
          <Input
            placeholder="Search resumes by name, position, or skills..."
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-[500px]">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          {["all", "reviewed", "pending", "rejected"].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-4">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {resumes
                  .filter((resume) => tab === "all" || resume.status?.toLowerCase() === tab)
                  .map((resume) => (
                    <ResumeCard 
                      key={resume._id?.$oid || resume.id} 
                      resume={resume} 
                      onViewClick={() => handleViewResume(resume)}
                    />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* PDF View Dialog */}
        <Dialog open={!!selectedResume} onOpenChange={handleCloseDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {selectedResume?.parsed_data?.Personal_Details?.Full_Name || 
                 selectedResume?.filename || 'Resume Preview'}
              </DialogTitle>
            </DialogHeader>
            <div className="h-[80vh]">
              {isGeneratingPdf ? (
                <div className="flex items-center justify-center h-full">
                  <p>Generating PDF preview...</p>
                </div>
              ) : pdfBlobUrl ? (
                <iframe
                  src={pdfBlobUrl}
                  width="100%"
                  height="100%"
                  title="Resume PDF Preview"
                  className="w-full h-full rounded-md border"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p>Failed to load PDF</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
};

const ResumeCard = ({ resume, onViewClick }: { resume: any, onViewClick: () => void }) => {
  const parsed = resume.parsed_data || {};
  const name = parsed?.Personal_Details?.Full_Name || resume.filename || 'Unknown';
  const email = parsed?.Personal_Details?.Email_Address || 'Unknown';
  const position = parsed?.Professional_Summary?.Industry_Focus?.[0] || 'Position not specified';
  const status = resume.status || "Pending";
  const date = new Date(resume.upload_date).toLocaleDateString();

  const statusColor = {
    "Reviewed": "bg-green-100 text-green-800",
    "Pending": "bg-blue-100 text-blue-800",
    "Rejected": "bg-red-100 text-red-800"
  };

  return (
    <Card>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 bg-blue-primary/10 rounded-full flex items-center justify-center mt-1">
            <FileText className="h-5 w-5 text-blue-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="font-medium text-lg">{name}</h3>
            <p className="text-sm text-neutral-gray">{position}</p>
            <p className="text-sm text-neutral-gray">{email}</p>
            <div className="flex items-center text-sm text-neutral-gray mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Uploaded: {date}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[status as keyof typeof statusColor]}`}>
            {status}
          </span>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onViewClick}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-1" />
              Schedule
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeArchive;