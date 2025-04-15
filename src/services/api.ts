
// API service for communicating with the Flask backend

const API_BASE_URL = 'http://localhost:5000'; // Change this to your Flask server URL

// Resume parsing API
export async function parseResume(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch(`${API_BASE_URL}/parse_resume`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw error;
  }
}

// Meeting scheduling API
export async function scheduleMeeting(meetingData: {
  title: string;
  datetime: string;
  duration_of_meeting: number;
  participants: string[];
  description?: string;
  location?: string;
  meeting_description: string;
  is_calendar_event: boolean;
  confidence_score: number;
  date: string;
  time: string;
  confirmation_message: string;
  calendar_link: string | null;
  start: string;
  end: string;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/schedule_meeting`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: JSON.stringify(meetingData) }),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error scheduling meeting:', error);
    throw error;
  }
}

// In services/api.js
export const generatePersonResumePdf = async (resumeId) => {
  const response = await fetch(`${API_BASE_URL}/generate_person_resume/${resumeId}`);
  if (!response.ok) {
    throw new Error('Failed to generate PDF');
  }
  return await response.blob();
};

// Get  parsed resume
export async function getResumes() {
  try {
    const response = await fetch(`${API_BASE_URL}/get_resumes`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data; // Returns parsed data from MongoDB
  } catch (error) {
    console.error('Error getting last resume:', error);
    throw error;
  }
}
// Get last parsed resume
export async function getLastResume() {
  try {
    const response = await fetch(`${API_BASE_URL}/get_last_resume`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data; // Returns parsed data from MongoDB
  } catch (error) {
    console.error('Error getting last resume:', error);
    throw error;
  }
}

// Get all meetings
export async function getMeetings() {
  try {
    const response = await fetch(`${API_BASE_URL}/get_meetings`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.map((meeting: any) => ({
      ...meeting,
      _id: meeting._id?.$oid || meeting._id, // MongoDB ObjectId conversion
    }));
  } catch (error) {
    console.error('Error getting meetings:', error);
    throw error;
  }
}

export const sendInterviewEmails = async (data: {
  recipients: string[];
  subject: string;
  text: string;
  html: string;
}) => {
  const response = await fetch('/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error('Failed to send emails');
  }
  
  return response.json();
};

// Get interviewers
export async function getInterviewers() {
  try {
    const response = await fetch(`${API_BASE_URL}/get_interviewers`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    } 
    
    const data = await response.json();
    // Transform MongoDB ObjectId format to string if needed
    return data.map((interviewer: any) => ({
      ...interviewer,
      _id: interviewer._id?.$oid || interviewer._id // Handle possible MongoDB ObjectId format
    }));
  } catch (error) {
    console.error('Error getting interviewers:', error);
    throw error;
  }
}

// Generate resume PDF
export async function generateResumePdf() {
  try {
    const response = await fetch(`${API_BASE_URL}/generate_resume_pdf`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return response.blob();
  } catch (error) {
    console.error('Error generating resume PDF:', error);
    throw error;
  }
}

// Send email
export async function sendEmail(data: {
  recipients: string[];
  subject: string;
  text?: string;
  html?: string;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Format resume data for the UI
export function formatResumeData(apiData: any) {
  if (!apiData) return null;
  
  // Extract personal details
  const personal = {
    name: apiData.Personal_Details?.Full_Name || "Unknown",
    email: apiData.Personal_Details?.Email_Address || "",
    phone: apiData.Personal_Details?.Phone_Number || "",
    location: apiData.Personal_Details?.Address || 
             (apiData.Personal_Details?.City && apiData.Personal_Details?.State ? 
              `${apiData.Personal_Details.City}, ${apiData.Personal_Details.State}` : "")
  };
  
  // Extract summary
  const summary = apiData.Professional_Summary?.Summary || "";
  
  // Extract experience
  let experience = [];
  if (apiData.Work_Experience?.list_of_experience && Array.isArray(apiData.Work_Experience.list_of_experience)) {
    experience = apiData.Work_Experience.list_of_experience.map((exp: any) => ({
      title: exp.title || "",
      company: exp.company || "",
      period: exp.experience_date || "",
      description: exp.technologies_used?.join(", ") || ""
    }));
  }
  
  // Extract education
  let education = [];
  if (apiData.Education_Details?.list_of_education && Array.isArray(apiData.Education_Details.list_of_education)) {
    education = apiData.Education_Details.list_of_education.map((edu: any) => ({
      degree: edu.degree || "",
      institution: edu.institution || "",
      year: edu.percentage || "" // You may need to adjust this based on your data
    }));
  }
  
  // Extract skills
  let skills: string[] = [];
  if (apiData.Skills_Details) {
    // Combine all skills categories
    const allSkills = [
      ...(apiData.Skills_Details.Programming_Languages || []),
      ...(apiData.Skills_Details.Frameworks_Libraries || []),
      ...(apiData.Skills_Details.Tools_Software || []),
      ...(apiData.Skills_Details.Methodologies || [])
    ];
    
    skills = allSkills.filter((skill: string) => typeof skill === 'string');
  }
  
  return {
    personal,
    summary,
    experience,
    education,
    skills
  };
}

// Format meeting data for the UI
export function formatMeetingData(apiData: any) {
  if (!apiData) return null;
  
  return {
    id: apiData._id?.$oid || apiData._id || "",
    title: apiData.title || "",
    date: apiData.date || new Date(apiData.datetime).toLocaleDateString(),
    time: apiData.time || new Date(apiData.datetime).toLocaleTimeString(),
    duration: apiData.duration_of_meeting || 0,
    participants: apiData.participants || [],
    location: apiData.location || "",
    description: apiData.description || ""
  };
}

// Format interviewer data for the UI
export function formatInterviewerData(apiData: any) {
  if (!apiData) return null;
  
  const allMembers: { name: string; email: string; team: string }[] = [];
  
  if (apiData.sub_teams && Array.isArray(apiData.sub_teams)) {
    apiData.sub_teams.forEach((subTeam: any) => {
      if (subTeam.members && Array.isArray(subTeam.members)) {
        subTeam.members.forEach((member: any) => {
          allMembers.push({
            name: member.name,
            email: member.email,
            team: `${apiData.team} - ${subTeam.name}`
          });
        });
      }
    });
  }
  
  return {
    team: apiData.team,
    members: allMembers
  };
}