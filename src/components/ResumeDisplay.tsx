import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Download, Mail, Phone, MapPin, Share2 } from 'lucide-react';
import { generateResumePdf } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface ResumeDisplayProps {
  data: {
    Personal_Details?: {
      Full_Name?: string;
      Email_Address?: string;
      Phone_Number?: string;
      LinkedIn_Profile?: string | null;
      GitHub_Profile?: string | null;
      Portfolio_Website?: string | null;
      Address?: string;
      City?: string;
      State?: string;
      Country?: string;
      Pincode?: string | null;
    };
    Professional_Summary?: {
      Summary?: string;
      Objective?: string;
      Years_of_Experience?: number;
      Industry_Focus?: string[];
    };
    Work_Experience?: {
      list_of_experience?: Array<{
        company?: string;
        title?: string;
        duration?: string;
        location?: string;
        technologies_used?: string[];
      }>;
    };
    Education_Details?: {
      list_of_education?: Array<{
        degree?: string;
        institution?: string;
        years?: string;
        specialization?: string;
        percentage?: string;
        relevant_coursework?: string[];
      }>;
    };
    Certifications_Details?: {
      list_of_certificates?: Array<{
        Certification_name?: string;
        Issuing_organization?: string;
        Date_obtained?: string;
        Expiration_date?: string;
      }>;
    };
    Skills_Details?: {
      Technical_skills?: string[];
      Soft_Skills?: string[];
      Programming_Languages?: string[];
      Frameworks_Libraries?: string[];
      Tools_Software?: string[];
      Languages?: string[];
    };
    Projects_Details?: {
      list_of_projects?: Array<{
        Project_name?: string;
        Project_description?: string;
        Role?: string;
        Duration?: string;
        Technologies_used?: string[];
        URL?: string;
        Key_achievements?: string[];
      }>;
    };
    Achievements_Details?: {
      list_of_achievements?: Array<{
        Achievement_description?: string;
        Date?: string;
        Awarding_organization?: string;
        Impact?: string;
      }>;
    };
    Additional_Information?: {
      Hobbies?: string[];
      Interests?: string[];
      Languages?: string[];
      Availability?: string;
    };
  };
}

export function ResumeDisplay({ data }: ResumeDisplayProps) {
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      const blob = await generateResumePdf();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'professional_resume.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();

      toast({
        title: "Download Success",
        description: "Resume PDF has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast({
        title: "Download Failed",
        description: "Failed to download the resume PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleShare = () => {
    const personal = data.Personal_Details;
    const summary = data.Professional_Summary?.Summary;

    const shareText = `${personal?.Full_Name}\n${personal?.Email_Address}\n${personal?.Phone_Number}\n${personal?.Address}\n\n${summary}`;

    navigator.clipboard.writeText(shareText).then(() => {
      toast({
        title: "Resume Copied",
        description: "Resume details copied to clipboard",
      });
    }).catch(err => {
      console.error("Error copying to clipboard:", err);
      toast({
        title: "Share Failed",
        description: "Could not copy resume to clipboard",
        variant: "destructive"
      });
    });
  };

  const getFullAddress = () => {
    if (!data.Personal_Details) return '';
    const { Address, City, State, Country, Pincode } = data.Personal_Details;
    return [Address, City, State, Country, Pincode].filter(Boolean).join(', ');
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold">{data.Personal_Details?.Full_Name || 'Not specified'}</CardTitle>
            <div className="flex flex-wrap gap-3 mt-2">
              {data.Personal_Details?.Email_Address && (
                <div className="flex items-center text-sm text-neutral-gray">
                  <Mail className="h-4 w-4 mr-1" />
                  <span>{data.Personal_Details.Email_Address}</span>
                </div>
              )}
              {data.Personal_Details?.Phone_Number && (
                <div className="flex items-center text-sm text-neutral-gray">
                  <Phone className="h-4 w-4 mr-1" />
                  <span>{data.Personal_Details.Phone_Number}</span>
                </div>
              )}
              {data.Personal_Details && (
                <div className="flex items-center text-sm text-neutral-gray">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{getFullAddress() || 'Not specified'}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="text-neutral-gray" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button size="sm" className="bg-blue-primary hover:bg-blue-primary/90" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Personal Details */}
        {data.Personal_Details && (
          <div className="resume-section">
            <h3 className="text-lg font-semibold mb-2">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>Full Name:</strong> {data.Personal_Details.Full_Name || 'Not specified'}</p>
                <p><strong>Email:</strong> {data.Personal_Details.Email_Address || 'Not specified'}</p>
                <p><strong>Phone:</strong> {data.Personal_Details.Phone_Number || 'Not specified'}</p>
              </div>
              <div>
                <p><strong>LinkedIn:</strong> {data.Personal_Details.LinkedIn_Profile ? 
                  <a href={data.Personal_Details.LinkedIn_Profile} target="_blank" className="text-blue-500 hover:underline">
                    {data.Personal_Details.LinkedIn_Profile}
                  </a> : 'Not specified'}
                </p>
                <p><strong>GitHub:</strong> {data.Personal_Details.GitHub_Profile ? 
                  <a href={data.Personal_Details.GitHub_Profile} target="_blank" className="text-blue-500 hover:underline">
                    {data.Personal_Details.GitHub_Profile}
                  </a> : 'Not specified'}
                </p>
                <p><strong>Portfolio:</strong> {data.Personal_Details.Portfolio_Website ? 
                  <a href={data.Personal_Details.Portfolio_Website} target="_blank" className="text-blue-500 hover:underline">
                    {data.Personal_Details.Portfolio_Website}
                  </a> : 'Not specified'}
                </p>
              </div>
            </div>
            <div className="mt-2">
              <p><strong>Address:</strong> {getFullAddress() || 'Not specified'}</p>
            </div>
          </div>
        )}

        <Separator />

        {/* Professional Summary */}
        {data.Professional_Summary && (
          <div className="resume-section">
            <h3 className="text-lg font-semibold mb-2">Professional Summary</h3>
            <p>{data.Professional_Summary.Summary || 'No professional summary provided'}</p>
            {data.Professional_Summary.Objective && (
              <div className="mt-2">
                <p><strong>Objective:</strong> {data.Professional_Summary.Objective}</p>
              </div>
            )}
            {data.Professional_Summary.Years_of_Experience && (
              <p className="mt-2">
                <strong>Years of Experience:</strong> {data.Professional_Summary.Years_of_Experience}
              </p>
            )}
            {data.Professional_Summary.Industry_Focus?.length && (
              <p className="mt-2">
                <strong>Industry Focus:</strong> {data.Professional_Summary.Industry_Focus.join(', ')}
              </p>
            )}
          </div>
        )}

        <Separator />

        {/* Work Experience */}
        {data.Work_Experience?.list_of_experience && (
          <div className="resume-section">
            <h3 className="text-lg font-semibold mb-3">Work Experience</h3>
            <div className="space-y-4">
              {data.Work_Experience.list_of_experience.map((exp, index) => (
                <div key={index} className="relative pl-5 border-l-2 border-gray-200 ml-2">
                  <div className="absolute w-3 h-3 bg-blue-primary rounded-full -left-[7px] top-1" />
                  <h4 className="font-medium">{exp.company || 'Unknown Company'}</h4>
                  <p className="text-neutral-gray">{exp.title || 'Unknown Position'}</p>
                  <p className="text-sm text-neutral-gray">{exp.duration || 'No dates specified'}</p>
                  {exp.location && (
                    <p className="text-sm text-neutral-gray mt-1">{exp.location}</p>
                  )}
                  {exp.technologies_used?.length && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Technologies:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {exp.technologies_used.map((tech, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-blue-500 rounded-full text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Education */}
        {data.Education_Details?.list_of_education && (
          <div className="resume-section">
            <h3 className="text-lg font-semibold mb-3">Education</h3>
            <div className="space-y-3">
              {data.Education_Details.list_of_education.map((edu, index) => (
                <div key={index} className="relative pl-5 border-l-2 border-gray-200 ml-2">
                  <div className="absolute w-3 h-3 bg-blue-primary rounded-full -left-[7px] top-1" />
                  <h4 className="font-medium">{edu.degree || 'Unknown Degree'}</h4>
                  <p className="text-neutral-gray">{edu.institution || 'Unknown Institution'}</p>
                  <p className="text-sm text-neutral-gray">{edu.years || 'No dates specified'}</p>
                  {edu.specialization && (
                    <p className="text-sm text-neutral-gray mt-1">
                      <strong>Specialization:</strong> {edu.specialization}
                    </p>
                  )}
                  {edu.percentage && (
                    <p className="text-sm text-neutral-gray mt-1">
                      <strong>Grade/Score:</strong> {edu.percentage}%
                    </p>
                  )}
                  {edu.relevant_coursework?.length && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Relevant Coursework:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {edu.relevant_coursework.map((course, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-blue-500 rounded-full text-xs">
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Certifications */}
        {data.Certifications_Details?.list_of_certificates && (
          <div className="resume-section">
            <h3 className="text-lg font-semibold mb-3">Certifications</h3>
            <div className="space-y-3">
              {data.Certifications_Details.list_of_certificates.map((cert, index) => (
                <div key={index} className="relative pl-5 border-l-2 border-gray-200 ml-2">
                  <div className="absolute w-3 h-3 bg-blue-primary rounded-full -left-[7px] top-1" />
                  <h4 className="font-medium">{cert.Certification_name || 'Unknown Certification'}</h4>
                  <p className="text-neutral-gray">{cert.Issuing_organization || 'Unknown Organization'}</p>
                  {cert.Date_obtained && (
                    <p className="text-sm text-neutral-gray mt-1">
                      <strong>Date Obtained:</strong> {cert.Date_obtained}
                    </p>
                  )}
                  {cert.Expiration_date && (
                    <p className="text-sm text-neutral-gray mt-1">
                      <strong>Expiration Date:</strong> {cert.Expiration_date}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Skills */}
        {data.Skills_Details && (
          <div className="resume-section">
            <h3 className="text-lg font-semibold mb-3">Skills</h3>
            {data.Skills_Details.Technical_skills?.length && (
              <div className="mb-4">
                <h4 className="font-medium">Technical Skills</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.Skills_Details.Technical_skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-blue-500 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {data.Skills_Details.Programming_Languages?.length && (
              <div className="mb-4">
                <h4 className="font-medium">Programming Languages</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.Skills_Details.Programming_Languages.map((lang, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-blue-500 rounded-full text-sm">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {data.Skills_Details.Frameworks_Libraries?.length && (
              <div className="mb-4">
                <h4 className="font-medium">Frameworks & Libraries</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.Skills_Details.Frameworks_Libraries.map((fw, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-blue-500 rounded-full text-sm">
                      {fw}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {data.Skills_Details.Tools_Software?.length && (
              <div className="mb-4">
                <h4 className="font-medium">Tools & Software</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.Skills_Details.Tools_Software.map((tool, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-blue-500 rounded-full text-sm">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {data.Skills_Details.Soft_Skills?.length && (
              <div className="mb-4">
                <h4 className="font-medium">Soft Skills</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.Skills_Details.Soft_Skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-blue-500 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {data.Skills_Details.Languages?.length && (
              <div>
                <h4 className="font-medium">Languages</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.Skills_Details.Languages.map((lang, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-blue-500 rounded-full text-sm">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <Separator />

        {/* Projects */}
        {data.Projects_Details?.list_of_projects && (
          <div className="resume-section">
            <h3 className="text-lg font-semibold mb-3">Projects</h3>
            <div className="space-y-4">
              {data.Projects_Details.list_of_projects.map((proj, index) => (
                <div key={index} className="relative pl-5 border-l-2 border-gray-200 ml-2">
                  <div className="absolute w-3 h-3 bg-blue-primary rounded-full -left-[7px] top-1" />
                  <h4 className="font-medium">{proj.Project_name || 'Untitled Project'}</h4>
                  <p className="text-neutral-gray">{proj.Project_description || 'No description provided'}</p>
                  {proj.Role && (
                    <p className="text-sm text-neutral-gray mt-1">
                      <strong>Role:</strong> {proj.Role}
                    </p>
                  )}
                  {proj.Duration && (
                    <p className="text-sm text-neutral-gray mt-1">
                      <strong>Duration:</strong> {proj.Duration}
                    </p>
                  )}
                  {proj.Technologies_used?.length && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Technologies Used:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {proj.Technologies_used.map((tech, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-blue-500 rounded-full text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {proj.URL && (
                    <p className="text-sm text-neutral-gray mt-1">
                      <strong>URL:</strong> {' '}
                      <a href={proj.URL} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {proj.URL}
                      </a>
                    </p>
                  )}
                  {proj.Key_achievements?.length && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Key Achievements:</p>
                      <ul className="list-disc pl-5 text-sm text-neutral-gray mt-1 space-y-1">
                        {proj.Key_achievements.map((ach, i) => (
                          <li key={i}>{ach}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Achievements */}
        {data.Achievements_Details?.list_of_achievements && (
          <div className="resume-section">
            <h3 className="text-lg font-semibold mb-3">Achievements</h3>
            <div className="space-y-3">
              {data.Achievements_Details.list_of_achievements.map((ach, index) => (
                <div key={index} className="relative pl-5 border-l-2 border-gray-200 ml-2">
                  <div className="absolute w-3 h-3 bg-blue-primary rounded-full -left-[7px] top-1" />
                  <h4 className="font-medium">{ach.Achievement_description || 'Untitled Achievement'}</h4>
                  {ach.Date && (
                    <p className="text-sm text-neutral-gray">
                      <strong>Date:</strong> {ach.Date}
                    </p>
                  )}
                  {ach.Awarding_organization && (
                    <p className="text-sm text-neutral-gray">
                      <strong>Awarding Organization:</strong> {ach.Awarding_organization}
                    </p>
                  )}
                  {ach.Impact && (
                    <p className="text-sm text-neutral-gray">
                      <strong>Impact:</strong> {ach.Impact}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Additional Information */}
        {data.Additional_Information && (
          <div className="resume-section">
            <h3 className="text-lg font-semibold mb-3">Additional Information</h3>
            {data.Additional_Information.Hobbies?.length && (
              <div className="mb-4">
                <h4 className="font-medium">Hobbies</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.Additional_Information.Hobbies.map((hobby, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-blue-500 rounded-full text-sm">
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {data.Additional_Information.Interests?.length && (
              <div className="mb-4">
                <h4 className="font-medium">Interests</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.Additional_Information.Interests.map((interest, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-blue-500 rounded-full text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {data.Additional_Information.Languages?.length && (
              <div className="mb-4">
                <h4 className="font-medium">Languages</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.Additional_Information.Languages.map((lang, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-blue-500 rounded-full text-sm">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {data.Additional_Information.Availability && (
              <div>
                <h4 className="font-medium">Availability</h4>
                <p className="text-neutral-gray">{data.Additional_Information.Availability}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}