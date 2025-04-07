# app.py
from flask import Flask, render_template, request, jsonify, send_file
from werkzeug.utils import secure_filename
import os
import logging
from datetime import datetime
from backend import * 
from flask_cors import CORS

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = '/home/ritik/Documents/vscode/AI_Agent/Resume_AI_Agent/RecruiAI/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB limit

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/')
def index():
    logging.info("Rendering index page.")
    return render_template('index.html')

@app.route('/parse_resume', methods=['POST'])
def parse_resume():
    logging.info("Received request to parse resume.")
    if 'file' not in request.files:
        logging.warning("No file uploaded in the request.")
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        logging.warning("No file selected for upload.")
        return jsonify({'error': 'No selected file'}), 400
    
    try:
        file_extension = file.filename.split('.')[-1].lower()
        if file_extension == 'pdf':
            logging.info("Extracting text from PDF.")
            resume_text = extract_text_from_pdf(file)  # Pass the file object directly
        elif file_extension == 'docx':
            logging.info("Extracting text from DOCX.")
            # Save temporarily to process
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            resume_text = extract_text_from_docx(filepath)
        else:
            logging.error("Unsupported file type.")
            return jsonify({'error': 'Unsupported file type'}), 400
        
        if not resume_text.strip():
            logging.error("Empty resume text after extraction.")
            return jsonify({'error': 'Could not extract text from file'}), 400
        
        structured_data = fn_Resume(resume_text)
        logging.info("Resume parsed successfully.")
        
        save_parsed_resume(structured_data, resume_text, file.filename)
        save_resume()
        logging.info("Parsed resume data saved to database.")
        
        response_data = {
            section_name: section_content.model_dump() if isinstance(section_content, BaseModel) else section_content
            for section_name, section_content in structured_data.items()
        }
        
        return jsonify(response_data)
    
    except Exception as e:
        logging.error(f"Error while parsing resume: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/schedule_meeting', methods=['POST'])
def schedule_meeting():
    logging.info("Received request to schedule a meeting.")
    data = request.get_json()
    if not data or 'text' not in data:
        logging.warning("No text provided in the request.")
        return jsonify({'error': 'No text provided'}), 400
    
    try:
        meeting_data = extract_meeting_info(data['text'])
        if not meeting_data:
            logging.warning("No valid meeting detected in the provided text.")
            return jsonify({'error': 'No valid meeting detected'}), 400
        
        start_datetime = datetime.strptime(meeting_data['datetime'].replace("Z", ""), "%Y-%m-%dT%H:%M:%S")
        end_datetime = start_datetime + timedelta(hours=meeting_data['duration_of_meeting'])
        
        meeting_event = {
            **meeting_data,
            "title": meeting_data['title'],
            "start": meeting_data['datetime'],
            "end": end_datetime.strftime("%Y-%m-%dT%H:%M:%S"),
            "description": f"Participants: {', '.join(meeting_data['participants'])}"
        }
        
        save_data([meeting_event], MEETINGS_FILE)
        logging.info("Meeting data saved successfully.")
        
        return jsonify(meeting_data)
    
    except Exception as e:
        logging.error(f"Error while scheduling meeting: {e}")
        return jsonify({'error': str(e)}), 500
    
@app.route('/get_last_resume', methods=['GET'])
def get_last_resume():
    logging.info("Received request to get the last parsed resume.")
    try:
        collection = mydb['job_application']
        data = list(collection.find().sort('_id', -1).limit(1))
        
        if not data:
            logging.warning("No resume data found in the database.")
            return jsonify({'error': 'No resume data found'}), 404
        
        logging.info("Last parsed resume retrieved successfully.")
        return jsonify(data[0]['parsed_data']['Personal_Details'])
    except Exception as e:
        logging.error(f"Error while retrieving the last parsed resume: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/get_meetings', methods=['GET'])
def get_meetings():
    logging.info("Received request to get meetings.")
    try:
        meetings = load_data(MEETINGS_FILE)
        for meeting in meetings:
            meeting['_id'] = str(meeting['_id'])
        logging.info("Meetings retrieved successfully.")
        return jsonify(meetings)
    except Exception as e:
        logging.error(f"Error while retrieving meetings: {e}")
        return jsonify({'error': str(e)}), 500
    

@app.route('/resumes/professional_resume.pdf', methods=['GET'])
def view_resume_pdf():
    logging.info("Received request to view resume PDF.")
    try:
        file_path = '/home/ritik/Documents/vscode/AI_Agent/Resume_AI_Agent/RecruiAI/resumes/professional_resume.pdf'
        if not os.path.exists(file_path):
            logging.warning("Requested resume PDF not found.")
            return jsonify({'error': 'Resume PDF not found'}), 404
        
        logging.info("Resume PDF found and ready to be displayed.")
        return send_file(
            file_path,
            mimetype='application/pdf'
        )
    except Exception as e:
        logging.error(f"Error while displaying resume PDF: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/generate_resume_pdf', methods=['POST'])
def generate_resume_pdf():
    logging.info("Received request to generate resume PDF.")
    try:
        collection = mydb['job_application']
        data = list(collection.find().sort('_id', -1).limit(1))
        
        if not data:
            logging.warning("No resume data found in the database.")
            return jsonify({'error': 'No resume data found'}), 404
        
        pdfmaker(data[0])
        logging.info("Resume PDF generated successfully.")
        
        return send_file(
            '/home/ritik/Documents/vscode/AI_Agent/Resume_AI_Agent/RecruiAI/resumes/professional_resume.pdf',
            as_attachment=True,
            download_name='professional_resume.pdf'
        )
    except Exception as e:
        logging.error(f"Error while generating resume PDF: {e}")
        return jsonify({'error': str(e)}), 500  

# @app.route('/save_resume', methods=['POST'])
def save_resume():
    logging.info("Received request to generate resume PDF.")
    try:
        collection = mydb['job_application']
        data = list(collection.find().sort('_id', -1).limit(1))
        
        if not data:
            logging.warning("No resume data found in the database.")
            return jsonify({'error': 'No resume data found'}), 404
        
        pdfmaker(data[0])
        logging.info("Resume PDF generated and saved successfully.")
        
        return jsonify({'message': 'Resume PDF generated and saved successfully.'})
    except Exception as e:
        logging.error(f"Error while generating resume PDF: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    logging.info("Starting Flask application.")
    app.run(debug=False)