# RecruiAI - AI-Powered Resume Parser and Meeting Scheduler

![Python Version](https://img.shields.io/badge/python-3.9%2B-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Streamlit](https://img.shields.io/badge/UI-Streamlit-FF4B4B)
![Ollama](https://img.shields.io/badge/LLM-Ollama-7F7F7F)

RecruiAI is a comprehensive AI-powered tool designed to streamline the recruitment process by:

- Automatically parsing and extracting structured data from resumes
- Scheduling and managing candidate meetings
- Generating professional resume PDFs
- Classifying resumes into relevant job categories

The system uses advanced natural language processing, local LLMs, and a MongoDB backend, with a Flask-based REST API for seamless integration.

---

## 🚀 Key Features

### 📄 Resume Processing
- Supports PDF and DOCX formats
- Extracts:
  - Personal Details
  - Professional Summary
  - Work Experience
  - Education History
  - Skills, Certifications, Projects, Achievements
- Job category classification
- Generates clean, professional PDF resumes

### 📅 Meeting Management
- Parses meeting details from natural language
- Stores:
  - Title, Date/Time, Duration, Participants, Location
- Calendar integration-ready

---

## 🧠 Technical Architecture

### Core Components
- **Flask API**: REST interface for all functionalities
- **Ollama LLM**: Local NLP processing with models like LLaMA 3.2 or Mistral
- **MongoDB**: Resume and meeting data storage
- **FAISS**: Efficient semantic search engine
- **Pydantic**: Strict data validation and schema enforcement

### Data Flow
1. User uploads a resume
2. Text is extracted and chunked
3. FAISS searches relevant chunks per resume section
4. LLM extracts structured info from chunks
5. Data is validated and stored
6. PDF resume is optionally generated

---

## ⚙️ Installation

### Prerequisites
- Python 3.9+
- MongoDB (local instance)
- Ollama (local with `llama3.2` or `mistral`)
- Required Python packages

### Setup Steps

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/recruiAI.git
cd recruiAI

# 2. Install dependencies
pip install -r requirements.txt

# 3. Start MongoDB (ensure it's running locally)

# 4. Pull & serve the LLM model with Ollama
ollama pull llama3.2
ollama serve

# 5. Run the Flask app
python app.py
```

---

## 📡 API Endpoints

### Resume Endpoints
- `POST /parse_resume`: Upload and parse resume file
- `GET /get_last_resume`: Fetch the last parsed resume
- `POST /generate_resume_pdf`: Generate resume PDF
- `GET /resumes/professional_resume.pdf`: Get generated resume PDF

### Meeting Endpoints
- `POST /schedule_meeting`: Extract meeting info from input text
- `GET /get_meetings`: Retrieve all scheduled meetings

---

## 🧪 Usage Examples

### Parse a Resume

```bash
curl -X POST -F "file=@resume.pdf" http://localhost:5000/parse_resume
```

### Schedule a Meeting

```bash
curl -X POST -H "Content-Type: application/json" \
-d '{"text":"Schedule meeting with John Doe tomorrow at 2pm for 1 hour about backend position"}' \
http://localhost:5000/schedule_meeting
```

### Get Last Resume

```bash
curl http://localhost:5000/get_last_resume
```

---

## 🧩 Configuration

Configuration settings in `app.py`:
- `UPLOAD_FOLDER`: Temporary file storage directory
- MongoDB URI and database
- Selected Ollama LLM model
- Logging levels and targets

---

## 🧱 Data Models

### Resume

```python
class PersonalDetails(BaseModel):
    Full_Name: str
    Email_Address: str
    Phone_Number: Optional[str]
    # ... other fields

class ExperienceItem(BaseModel):
    company: str
    title: str
    # ... other fields
```

### Meeting

```python
class MeetingInfo(BaseModel):
    title: str
    datetime: str
    participants: List[str]
    # ... other fields
```

---

## 🧯 Error Handling

Robust error handling includes:
- File format and input validation
- LLM and FAISS failure management
- MongoDB operation safety
- Detailed logs for debugging

---

## 📜 Logging

Logs are printed to console with timestamps and levels:

- `INFO`: Normal operations
- `WARNING`: Recoverable issues
- `ERROR`: Critical failures

Special loggers:
- `ollama`: LLM activity
- `resume`: Resume operations
- `meeting`: Meeting scheduler
- `streamlit`: (UI, if integrated)

---

## ⚠️ Limitations

- Requires local Ollama and MongoDB
- Resume parsing accuracy depends on formatting
- Meeting scheduling accuracy depends on NLP interpretation
- Performance may vary on low-end systems

---

## 🔮 Future Enhancements

- User authentication system
- Multi-file format support
- Analytics dashboard
- Calendar service integration (Google Calendar, Outlook)
- Multilingual support

---

## 📄 License

[Specify license here, e.g., MIT, Apache 2.0]

---

## 📬 Contact

For queries or contributions:

**[Your Name]**  
Email: [your-email@example.com]  
GitHub: [https://github.com/yourusername](https://github.com/yourusername)
```

Let me know if you'd like help:
- Generating a `requirements.txt`
- Creating a logo/banner
- Writing a short project description for your GitHub repo page
- Creating badges (build status, license, Python version)

Just say the word!
