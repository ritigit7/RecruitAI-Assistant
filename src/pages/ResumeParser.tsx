import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { FileUpload } from '@/components/FileUpload';
import { ResumeDisplay } from '@/components/ResumeDisplay';
import { generateResumePdf, getInterviewers, getLastResume } from '@/services/api';
import { Button } from '@/components/ui/button';

const ResumeParser = () => {
  const [parsedData, setParsedData] = useState<any>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [interviewers, setInterviewers] = useState<any[]>([]);

  const handleLoadLastResume = async () => {
    try {
      setLoading(true);
      const lastResumeData = await getLastResume();
      if (lastResumeData) {
        setParsedData(lastResumeData);
        setPdfBlobUrl(null); // Clear any existing PDF
        classifyInterviewer(lastResumeData.Classification);
      }
    } catch (error) {
      console.error('Failed to load last resume:', error);
    } finally {
      setLoading(false);
    }
  };


  // Called when resume file is parsed
  const handleFileProcessed = (data: any) => {
    setParsedData(data);
    setPdfBlobUrl(null); // Clear old PDF if any
    classifyInterviewer(data.Classification);
  };

  // Classify interviewer based on resume classification
  const classifyInterviewer = async (classification: any) => {
    if (!classification) return;

    try {
      setLoading(true);
      const interviewersData = await getInterviewers();

      // Find matching team based on category
      const matchingTeam = interviewersData.find(
        (team: any) => team.team === classification.category
      );

      if (matchingTeam) {
        // Find matching sub-team based on subcategory
        const matchingSubTeam = matchingTeam.sub_teams.find(
          (sub: any) => sub.name === classification.subcategory
        );

        if (matchingSubTeam) {
          setInterviewers(matchingSubTeam.members);
        }
      }
    } catch (error) {
      console.error('Error classifying interviewer:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate PDF once parsedData is available
  useEffect(() => {
    const generatePdf = async () => {
      if (!parsedData) return;

      setIsGeneratingPdf(true);
      try {
        const pdfBlob = await generateResumePdf();
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setPdfBlobUrl(pdfUrl);
      } catch (error) {
        console.error("Error generating PDF preview:", error);
      } finally {
        setIsGeneratingPdf(false);
      }
    };

    generatePdf();
  }, [parsedData]);


  return (
    <PageLayout title="Resume Parser">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
          <h1 className="text-2xl font-bold mb-2">Upload and Parse Resume</h1>
              <p className="text-neutral-gray">
                Upload a resume file to extract structured information. We support PDF and DOCX formats.  <Button
                  onClick={handleLoadLastResume}
                  className="bg-blue-primary hover:bg-blue-primary/90"
                >
                  Load Last Resume
                </Button>
              </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
          </div>
          {interviewers.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Domain Info */}
              <div className="border rounded-lg p-4 bg-white shadow">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">🧠 Domain Classification</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><span className="font-medium text-gray-900">Category:</span> {parsedData?.Classification?.category}</p>
                  <p><span className="font-medium text-gray-900">Subcategory:</span> {parsedData?.Classification?.subcategory}</p>
                </div>
              </div>

              {/* Suggested Interviewers */}
              <div className="border rounded-lg p-4 bg-white shadow">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">👥 Suggested Interviewers</h3>
                <ul className="space-y-3">
                  {interviewers.map((interviewer) => (
                    <li key={interviewer.email} className="flex flex-col border border-gray-200 rounded-md p-3 bg-gray-50 hover:bg-gray-100 transition">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">{interviewer.name}</p>
                          <p className="text-sm text-gray-600">{interviewer.email}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <FileUpload onFileProcessed={handleFileProcessed} />
            {/* PDF Preview */}
            {pdfBlobUrl && (
              <div className="border rounded-lg bg-white p-4 shadow mt-4">
                <h3 className="text-lg font-semibold mb-3">Generated Resume PDF</h3>
                <iframe
                  src={pdfBlobUrl}
                  width="100%"
                  height="1000px"
                  title="Resume PDF Preview"
                  className="w-full rounded-md border"
                />
                <p className="text-sm text-gray-500 mt-2 text-center">
                  If you can't see the PDF, please make sure your browser supports embedded PDFs.
                </p>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            {parsedData ? (
              <ResumeDisplay data={parsedData} />
            ) : (
              <div className="border border-dashed rounded-lg h-full flex items-center justify-center p-8 bg-gray-50 text-center">
                <div>
                  <h3 className="text-lg font-medium text-neutral-gray mb-2">Resume Preview</h3>
                  <p className="text-sm text-neutral-gray">
                    Upload a resume to see the parsed information here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>


        {/* Loading */}
        {isGeneratingPdf && !pdfBlobUrl && (
          <div className="text-center text-gray-500">Generating PDF preview...</div>
        )}
      </div>
    </PageLayout>
  );
};

export default ResumeParser;  