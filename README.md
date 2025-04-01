# ResumeParser Pro - AI Resume Analysis & Meeting Scheduler

![Python Version](https://img.shields.io/badge/python-3.9%2B-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Streamlit](https://img.shields.io/badge/UI-Streamlit-FF4B4B)
![Ollama](https://img.shields.io/badge/LLM-Ollama-7F7F7F)

An AI-powered application that parses resumes and schedules meetings using natural language processing.

## Features

✨ **Resume Parsing**
- Extract structured data from PDF/DOCX resumes
- Parse personal info, work experience, education, skills
- Generate professional PDF resumes

📅 **Meeting Scheduling**
- LLM-based meeting extraction from text
- Interactive calendar visualization
- Meeting timeline view

💾 **Data Management**
- MongoDB storage for parsed data
- Persistent meeting records and resume data
- Data validation and cleaning

## Installation

### Prerequisites
- Python 3.9+
- MongoDB (local instance)
- Ollama (with at least one LLM model)

### Setup
```bash
git clone https://github.com/yourusername/resume-parser-ai.git
cd resume-parser-ai
python -m venv venv
source venv/bin/activate  # Linux/MacOS
venv\Scripts\activate    # Windows
pip install -r requirements.txt
ollama pull llama3.2
```

## Usage

1. Start MongoDB service
2. Launch the application:
```bash
streamlit run app.py
```
3. Access at `http://localhost:8501`

## Configuration

Create `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3
```

## File Structure
```
resume-parser-ai/
├── app.py                # Main application
├── pdf_maker.py          # PDF generation
├── requirements.txt      # Dependencies
├── .env.example          # Env template
├── logs/                 # Application logs
├── resumes/              # Resume files
└── README.md             # This file
```

## API Examples

### Parse Resume
```python
from app import parse_resume
data = parse_resume("resumes/sample.pdf")
print(data["work_experience"])
```

### Schedule Meeting
```python
from app import schedule_meeting
meeting = schedule_meeting("Review meeting Friday 3pm")
print(meeting["datetime"])
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License
MIT License

## Contact
Your Name - your.email@example.com  
Project Link: [https://github.com/yourusername/resume-parser-ai](https://github.com/yourusername/resume-parser-ai)
```

Key improvements made:
1. Fixed inconsistent heading levels
2. Properly formatted all code blocks with language identifiers
3. Corrected the Ollama model version to match your code (llama3.2)
4. Fixed indentation and spacing throughout
5. Ensured consistent markdown syntax
6. Added proper link formatting for the project URL
7. Organized sections with clear hierarchy
8. Removed duplicate content
9. Standardized command formatting
10. Added proper line breaks between sections

The README now has:
- Clear, professional structure
- Consistent formatting
- Accurate technical details
- Proper markdown syntax
- Easy-to-follow instructions
- All essential sections in logical order
