import json
from weasyprint import HTML, CSS
from jinja2 import Template
from datetime import datetime

def generate_resume_pdf(mongodb_document, output_filename='resumes/professional_resume.pdf'):
    """
    Generate a professionally designed resume PDF from MongoDB document data
    
    :param mongodb_document: MongoDB document data
    :param output_filename: Name of the output PDF file
    """
    # Helper functions for data processing
    def get_nested_value(data, *keys):
        for key in keys:
            if isinstance(data, dict) and key in data:
                data = data[key]
            else:
                return None
        return data

    def format_name(name_dict):
        if not name_dict:
            return ""
        first = name_dict.get('first_name', '')
        middle = name_dict.get('middle_name', '')
        last = name_dict.get('last_name', '')
        return " ".join(filter(None, [first, middle, last])).strip()

    def format_date(date_str, fmt='%Y-%m-%d'):
        if not date_str:
            return "Present"
        try:
            return datetime.strptime(date_str, fmt).strftime('%b %Y')
        except (ValueError, TypeError):
            return date_str

    def calculate_experience(start_date_str, end_date_str):
        try:
            start_date = datetime.strptime(start_date_str, '%b %Y') if start_date_str else datetime.now()
            end_date = datetime.strptime(end_date_str, '%b %Y') if end_date_str else datetime.now()
            total_months = (end_date.year - start_date.year) * 12 + (end_date.month - start_date.month)
            years = total_months // 12
            months = total_months % 12
            return f"{years} years {months} months" if years or months else "Less than 1 month"
        except:
            return "Not specified"

    # Extract data from MongoDB document
    parsed_data = mongodb_document.get('parsed_data', {})
    raw_text = mongodb_document.get('raw_text_sample', '')
    
    # Application details
    app_form = get_nested_value(parsed_data, 'Application Form') or {}
    post_applied = app_form.get('post_applied_for', 'Business System Analyst')
    
    # Personal information
    personal_info = get_nested_value(parsed_data, 'Personal Information') or {}
    name = format_name(personal_info.get('name', {}))
    contact_number = personal_info.get('contact_number', 'Not available')
    personal_email = personal_info.get('personal_email', 'Not available') or 'sam@vishconsultingservices.com'
    dob = personal_info.get('date_of_birth', 'Not available')
    age = personal_info.get('age', 'Not available')
    gender = personal_info.get('gender', 'Not available').strip(',') or 'Not available'
    marital_status = personal_info.get('marital_status', 'Not available').strip(',') or 'Not available'
    present_address = personal_info.get('present_address', 'Not available')
    permanent_address = personal_info.get('permanent_address', 'Not available')
    aadhar = personal_info.get('aadhar_no', 'Not available')
    pan = personal_info.get('pan_no', 'Not available')
    height = personal_info.get('height', 'Not available')
    weight = personal_info.get('weight', 'Not available')
    
    # Work experience
    work_experience = []
    exp_details = get_nested_value(parsed_data, 'Experience Details', 'work_experience') or []
    if exp_details and isinstance(exp_details, list):
        work_experience = exp_details
    elif get_nested_value(parsed_data, 'Work Experience'):
        work_experience = [get_nested_value(parsed_data, 'Work Experience')]
    
    # Calculate total experience
    total_exp = 0
    if work_experience:
        for exp in work_experience:
            try:
                start_date = datetime.strptime(exp['start_date'], '%b %Y') if exp.get('start_date') else datetime.now()
                end_date = datetime.strptime(exp['end_date'], '%b %Y') if exp.get('end_date') else datetime.now()
                total_exp += (end_date - start_date).days / 365.25
            except:
                continue
    
    # Education details
    education_details = []
    edu_data = get_nested_value(parsed_data, 'Education Details') or {}
    if edu_data:
        education_details.append({
            'qualification': edu_data.get('qualification', 'Not specified'),
            'college_school': edu_data.get('college_school', 'Not specified'),
            'board_university': edu_data.get('board_university', 'Not specified'),
            'percentage_grade': edu_data.get('percentage_grade', 'Not specified'),
            'year_of_passing': edu_data.get('year_of_passing', 'Not specified')
        })
    
    # Languages known
    languages_known = get_nested_value(parsed_data, 'Languages Known') or {}
    
    # Skills
    technical_skills = []
    skills_data = get_nested_value(parsed_data, 'IT Skills & Certifications') or {}
    if skills_data:
        technical_skills.append({
            'name': skills_data.get('skill_course', 'Not specified'),
            'institute': skills_data.get('institute', ''),
            'year': skills_data.get('year', '')
        })
    
    # Family details
    family_details = get_nested_value(parsed_data, 'Family Details', 'members') or []
    
    # General details
    general_details = get_nested_value(parsed_data, 'General Details') or {}
    hobbies = general_details.get('hobbies', 'Not specified')
    ready_to_sign_bond = "Yes" if general_details.get('ready_to_sign_bond', False) else "No"
    other_info = general_details.get('other_information', '')
    
    # Reference details
    reference_details = []
    ref_data = get_nested_value(parsed_data, 'Reference Details') or {}
    if ref_data:
        reference_details.append({
            'name': ref_data.get('name', 'Not specified'),
            'company_name': ref_data.get('company_name', 'Not specified'),
            'occupation': ref_data.get('occupation', 'Not specified'),
            'contact_number': ref_data.get('contact_number', 'Not specified')
        })
    
    # Generate professional summary from raw text
    professional_summary = "Experienced professional with expertise in business systems analysis."
    if raw_text:
        summary_start = raw_text.find("Summary:")
        if summary_start != -1:
            summary_end = raw_text.find("Professional Skills:")
            if summary_end != -1:
                professional_summary = raw_text[summary_start:summary_end].replace("Summary:", "").strip()
    
    # HTML Template with professional design
    html_template = Template('''
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>{{ name }} - Professional Resume</title>
        <style>
            @page {
                size: A4;
                margin: 1.2cm;
                @top-left {
                    content: element(header);
                }
                @bottom-center {
                    content: "Page " counter(page) " of " counter(pages);
                    font-size: 9pt;
                    color: #6c757d;
                    font-family: 'Montserrat', sans-serif;
                }
            }
            
            @page :first {
                margin-top: 2cm;
                @top-left {
                    content: none;
                }
            }
            
            #header {
                position: running(header);
                width: 100%;
                padding-bottom: 8px;
                margin-bottom: 12px;
                font-size: 9pt;
                border-bottom: 1px solid #e9ecef;
            }
            
            body {
                font-family: 'Montserrat', sans-serif;
                line-height: 1.5;
                color: #495057;
                font-size: 10.5pt;
                background-color: #f8f9fa;
            }
            
            .container {
                background-color: white;
                padding: 20px;
                box-shadow: 0 0 10px rgba(0,0,0,0.03);
            }
            
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
            
            .name {
                color: #2c3e50;
                font-size: 24pt;
                font-weight: 700;
                margin-bottom: 4px;
                letter-spacing: -0.5px;
            }
            
            .title {
                color: #3498db;
                font-size: 12pt;
                font-weight: 500;
                margin-bottom: 10px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .contact-info {
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                gap: 10px 20px;
                margin-top: 8px;
                font-size: 9.5pt;
            }
            
            .contact-item {
                display: flex;
                align-items: center;
                gap: 4px;
            }
            
            .section {
                margin-bottom: 20px;
                page-break-inside: avoid;
            }
            
            .section-title {
                color: #2c3e50;
                font-size: 12.5pt;
                font-weight: 600;
                margin-bottom: 12px;
                padding-bottom: 5px;
                border-bottom: 1px solid #3498db;
                position: relative;
            }
            
            .section-title:after {
                content: "";
                position: absolute;
                bottom: -1px;
                left: 0;
                width: 40px;
                height: 2px;
                background-color: #e74c3c;
            }
            
            .two-column {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
            }
            
            .three-column {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 12px;
            }
            
            .info-item {
                margin-bottom: 8px;
                display: flex;
                font-size: 10pt;
            }
            
            .info-label {
                font-weight: 600;
                color: #2c3e50;
                min-width: 140px;
            }
            
            .work-exp-item {
                margin-bottom: 18px;
                padding-left: 12px;
                border-left: 2px solid #3498db;
                position: relative;
            }
            
            .work-exp-item:before {
                content: "";
                position: absolute;
                left: -5px;
                top: 5px;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: #3498db;
                border: 2px solid white;
            }
            
            .work-exp-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 4px;
                flex-wrap: wrap;
            }
            
            .work-exp-title {
                font-weight: 600;
                color: #2c3e50;
                font-size: 11pt;
            }
            
            .work-exp-company {
                font-weight: 500;
                color: #3498db;
                font-size: 10.5pt;
            }
            
            .work-exp-duration {
                color: #6c757d;
                font-size: 9.5pt;
                background-color: #f8f9fa;
                padding: 2px 6px;
                border-radius: 8px;
            }
            
            .work-exp-details {
                margin-top: 6px;
                padding-left: 8px;
                font-size: 10pt;
            }
            
            .education-item {
                margin-bottom: 16px;
                padding-left: 12px;
                border-left: 1px solid #e9ecef;
                position: relative;
            }
            
            .education-item:before {
                content: "🎓";
                position: absolute;
                left: -12px;
                top: 0;
                font-size: 10pt;
            }
            
            .education-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 4px;
                flex-wrap: wrap;
            }
            
            .education-degree {
                font-weight: 600;
                color: #2c3e50;
                font-size: 10.5pt;
            }
            
            .education-school {
                font-style: italic;
                color: #6c757d;
                font-size: 10pt;
            }
            
            .education-year {
                color: #6c757d;
                font-size: 9.5pt;
                background-color: #f8f9fa;
                padding: 2px 6px;
                border-radius: 8px;
            }
            
            .skill-category {
                margin-bottom: 16px;
            }
            
            .skill-category-title {
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 8px;
                font-size: 10.5pt;
            }
            
            .skill-badge {
                background-color: #3498db;
                color: white;
                padding: 4px 10px;
                margin: 0 6px 6px 0;
                border-radius: 12px;
                display: inline-block;
                font-size: 9.5pt;
                font-weight: 500;
            }
            
            .language-item {
                margin-bottom: 10px;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                font-size: 10pt;
            }
            
            .language-name {
                font-weight: 600;
                min-width: 100px;
                color: #2c3e50;
            }
            
            .language-proficiency {
                display: flex;
                gap: 8px;
            }
            
            .proficiency-item {
                font-size: 9.5pt;
                color: #6c757d;
            }
            
            .family-member {
                margin-bottom: 12px;
                padding: 10px;
                background-color: #f8f9fa;
                border-radius: 4px;
                font-size: 10pt;
            }
            
            .reference-item {
                background-color: #f8f9fa;
                padding: 12px;
                border-radius: 4px;
                margin-bottom: 12px;
                font-size: 10pt;
            }
            
            .personal-info-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                gap: 12px;
            }
            
            .personal-info-card {
                background-color: #f8f9fa;
                padding: 10px;
                border-radius: 4px;
                border-left: 2px solid #3498db;
                font-size: 10pt;
            }
            
            .card-title {
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 4px;
                font-size: 10pt;
            }
            
            .card-value {
                color: #495057;
            }
            
            .summary-box {
                background-color: #f8f9fa;
                padding: 12px;
                border-radius: 4px;
                border-left: 3px solid #3498db;
                font-size: 10.5pt;
                line-height: 1.5;
            }
            
            @media print {
                .container {
                    box-shadow: none;
                }
            }
        </style>
    </head>
    <body>
        <div id="header">
            <span style="font-weight:600;">{{ name }}</span> | 
            <span style="color:#3498db;">{{ post_applied }}</span> | 
            <span style="color:#6c757d;">{{ contact_number }}</span>
        </div>
        
        <div class="container">
            <div class="header">
                <div class="name">{{ name }}</div>
                <div class="title">{{ post_applied }}</div>
                <div class="contact-info">
                    <div class="contact-item">📧 {{ personal_email }}</div>
                    <div class="contact-item">📱 {{ contact_number }}</div>
                    <div class="contact-item">📍 {{ permanent_address }}</div>
                </div>
            </div>

            <div class="section">
                <h2 class="section-title">Professional Summary</h2>
                <div class="summary-box">
                    {{ professional_summary }}
                </div>
            </div>

            <div class="section">
                <h2 class="section-title">Personal Information</h2>
                <div class="personal-info-grid">
                    <div class="personal-info-card">
                        <div class="card-title">Basic Details</div>
                        <div class="card-value">
                            <div>Date of Birth: {{ dob }}</div>
                            <div>Age: {{ age }} years</div>
                            <div>Gender: {{ gender }}</div>
                            <div>Marital Status: {{ marital_status }}</div>
                        </div>
                    </div>
                    
                    <div class="personal-info-card">
                        <div class="card-title">Identification</div>
                        <div class="card-value">
                            <div>Aadhar: {{ aadhar }}</div>
                            <div>PAN: {{ pan }}</div>
                            <div>Height: {{ height }} cm</div>
                            <div>Weight: {{ weight }} kg</div>
                        </div>
                    </div>
                    
                    <div class="personal-info-card">
                        <div class="card-title">Address</div>
                        <div class="card-value">
                            <div>Present: {{ present_address }}</div>
                            <div>Permanent: {{ permanent_address }}</div>
                        </div>
                    </div>
                </div>
            </div>

            {% if work_experience %}
            <div class="section">
                <h2 class="section-title">Work Experience</h2>
                {% for exp in work_experience %}
                <div class="work-exp-item">
                    <div class="work-exp-header">
                        <div>
                            <span class="work-exp-title">{{ exp.designation }}</span> - 
                            <span class="work-exp-company">{{ exp.employer_name }}, {{ exp.location }}</span>
                        </div>
                        <div class="work-exp-duration">
                            {{ format_date(exp.start_date) }} to {{ format_date(exp.end_date) }}
                            ({{ calculate_experience(exp.start_date, exp.end_date) }})
                        </div>
                    </div>
                    <div class="work-exp-details">
                        {% if exp.get('reason_for_leaving') %}
                        <div><span class="info-label">Focus Areas:</span> {{ exp.reason_for_leaving }}</div>
                        {% endif %}
                        {% if exp.get('salary') %}
                        <div><span class="info-label">Salary:</span> {{ exp.salary }}</div>
                        {% endif %}
                    </div>
                </div>
                {% endfor %}
            </div>
            {% endif %}

            {% if education_details %}
            <div class="section">
                <h2 class="section-title">Education</h2>
                {% for edu in education_details %}
                <div class="education-item">
                    <div class="education-header">
                        <div>
                            <span class="education-degree">{{ edu.qualification }}</span>
                            {% if edu.college_school %}
                            - <span class="education-school">{{ edu.college_school }}</span>
                            {% endif %}
                        </div>
                        {% if edu.year_of_passing %}
                        <div class="education-year">{{ edu.year_of_passing }}</div>
                        {% endif %}
                    </div>
                    {% if edu.board_university %}
                    <div><span class="info-label">Board/University:</span> {{ edu.board_university }}</div>
                    {% endif %}
                    {% if edu.percentage_grade %}
                    <div><span class="info-label">Percentage/Grade:</span> {{ edu.percentage_grade }}</div>
                    {% endif %}
                </div>
                {% endfor %}
            </div>
            {% endif %}

            {% if technical_skills %}
            <div class="section">
                <h2 class="section-title">Skills & Certifications</h2>
                <div class="skill-category">
                    <div class="skill-category-title">Technical Skills:</div>
                    {% for skill in technical_skills %}
                    <span class="skill-badge">
                        {{ skill.name }}
                        {% if skill.institute %}({{ skill.institute }}){% endif %}
                        {% if skill.year %}{{ skill.year }}{% endif %}
                    </span>
                    {% endfor %}
                </div>
                
                {% if other_info %}
                <div class="skill-category">
                    <div class="skill-category-title">Additional Skills:</div>
                    <div>{{ other_info }}</div>
                </div>
                {% endif %}
            </div>
            {% endif %}

            {% if languages_known %}
            <div class="section">
                <h2 class="section-title">Languages Known</h2>
                <div style="background-color: #f8f9fa; padding: 12px; border-radius: 4px;">
                    {% for lang, details in languages_known.items() %}
                    <div class="language-item">
                        <span class="language-name">{{ lang|capitalize }}:</span>
                        <div class="language-proficiency">
                            <div class="proficiency-item">Speak: {% if details.speak %}Yes{% else %}No{% endif %}</div>
                            <div class="proficiency-item">Read: {% if details.read %}Yes{% else %}No{% endif %}</div>
                            <div class="proficiency-item">Write: {% if details.write %}Yes{% else %}No{% endif %}</div>
                        </div>
                    </div>
                    {% endfor %}
                </div>
            </div>
            {% endif %}

            {% if family_details %}
            <div class="section">
                <h2 class="section-title">Family Details</h2>
                <div class="two-column">
                    {% for member in family_details %}
                    <div class="family-member">
                        <div><span class="info-label">Name:</span> {{ member.name }}</div>
                        <div><span class="info-label">Relationship:</span> {{ member.relationship }}</div>
                        <div><span class="info-label">Occupation:</span> {{ member.occupation }}</div>
                        <div><span class="info-label">Age:</span> {{ member.age }}</div>
                        <div><span class="info-label">Dependant:</span> {% if member.dependant %}Yes{% else %}No{% endif %}</div>
                    </div>
                    {% endfor %}
                </div>
            </div>
            {% endif %}

            <div class="section">
                <h2 class="section-title">Additional Information</h2>
                <div class="two-column">
                    <div>
                        <div class="info-item"><span class="info-label">Hobbies:</span> {{ hobbies }}</div>
                    </div>
                    <div>
                        <div class="info-item"><span class="info-label">Ready to Sign Bond:</span> {{ ready_to_sign_bond }}</div>
                    </div>
                </div>
            </div>

            {% if reference_details %}
            <div class="section">
                <h2 class="section-title">References</h2>
                <div class="two-column">
                    {% for ref in reference_details %}
                    <div class="reference-item">
                        <div><span class="info-label">Name:</span> {{ ref.name }}</div>
                        <div><span class="info-label">Company:</span> {{ ref.company_name }}</div>
                        <div><span class="info-label">Position:</span> {{ ref.occupation }}</div>
                        <div><span class="info-label">Contact:</span> {{ ref.contact_number }}</div>
                    </div>
                    {% endfor %}
                </div>
            </div>
            {% endif %}

            <div class="section">
                <div style="text-align: right; font-style: italic;">
                    Last updated: {{ current_date }}
                </div>
            </div>
        </div>
    </body>
    </html>
    ''')

    # Render the template with data
    html_out = html_template.render(
        name=name,
        post_applied=post_applied,
        personal_email=personal_email,
        contact_number=contact_number,
        permanent_address=permanent_address,
        professional_summary=professional_summary,
        dob=dob,
        age=age,
        gender=gender,
        marital_status=marital_status,
        aadhar=aadhar,
        pan=pan,
        height=height,
        weight=weight,
        present_address=present_address,
        work_experience=work_experience,
        education_details=education_details,
        technical_skills=technical_skills,
        languages_known=languages_known,
        family_details=family_details,
        hobbies=hobbies,
        ready_to_sign_bond=ready_to_sign_bond,
        other_info=other_info,
        reference_details=reference_details,
        current_date=datetime.now().strftime('%d %b %Y'),
        format_date=format_date,
        calculate_experience=calculate_experience
    )

    # Generate PDF with optimized styling
    HTML(string=html_out).write_pdf(
        output_filename,
        stylesheets=[CSS(string='''
            @page {
                size: A4;
                margin: 1.2cm;
                @top-left {
                    content: element(header);
                }
                @bottom-center {
                    content: "Page " counter(page) " of " counter(pages);
                    font-size: 9pt;
                    color: #6c757d;
                }
            }
            
            @page :first {
                margin-top: 2cm;
                @top-left {
                    content: none;
                }
            }
            
            body {
                font-family: 'Montserrat', sans-serif;
                font-size: 10.5pt;
                line-height: 1.5;
            }
            
            .container {
                padding: 20px;
            }
            
            .name {
                font-size: 24pt;
                margin-bottom: 4px;
            }
            
            .title {
                font-size: 12pt;
                margin-bottom: 10px;
            }
            
            .section-title {
                font-size: 12.5pt;
                margin-bottom: 12px;
            }
            
            .work-exp-item {
                margin-bottom: 18px;
            }
            
            .education-item {
                margin-bottom: 16px;
            }
            
            .skill-badge {
                font-size: 9.5pt;
                padding: 4px 10px;
                margin: 0 6px 6px 0;
            }
        ''')]
    )

    print(f"✔ Professionally designed resume PDF generated: {output_filename}")

def pdfmaker(f):
    generate_resume_pdf(f)
    # Generate PDF