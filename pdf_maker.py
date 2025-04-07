from weasyprint import HTML
from jinja2 import Template
from datetime import datetime

# Your JSON data
resume_data = {
    # ... your full JSON data here ...
}

# Enhanced HTML template with professional styling for Business Analyst
template = Template('''
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{ parsed_data.Personal_Details.Full_Name }} - Business Analyst Resume</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Montserrat:wght@400;500;600;700&display=swap');
        
        :root {
            --primary-color: #3498db;
            --secondary-color: #2c3e50;
            --accent-color: #e74c3c;
            --light-bg: #f8f9fa;
            --dark-text: #2c3e50;
            --medium-text: #34495e;
            --light-text: #7f8c8d;
            --border-color: #e0e0e0;
            --highlight-color: #f1f9ff;
        }
        
        body {
            font-family: 'Lato', sans-serif;
            line-height: 1.6;
            color: var(--dark-text);
            margin: 0;
            padding: 0;
            background-color: white;
            font-size: 14px;
        }
        
        .resume-container {
            max-width: 800px;
            margin: 20px auto;
            background: white;
            box-shadow: 0 5px 30px rgba(0, 0, 0, 0.08);
            overflow: hidden;
            position: relative;
        }
        
        .header {
            background: linear-gradient(135deg, var(--secondary-color) 0%, #1a2530 100%);
            color: white;
            padding: 35px 40px;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            width: 100px;
            height: 100px;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
            transform: translate(30%, -30%);
        }
        
        .header-content {
            position: relative;
            z-index: 2;
        }
        
        .header h1 {
            font-family: 'Montserrat', sans-serif;
            font-size: 36px;
            margin: 0 0 5px 0;
            letter-spacing: 0.5px;
            font-weight: 700;
        }
        
        .header h2 {
            font-family: 'Lato', sans-serif;
            font-size: 18px;
            margin: 0;
            font-weight: 300;
            opacity: 0.9;
            letter-spacing: 0.5px;
        }
        
        .contact-info {
            margin-top: 15px;
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            font-size: 13px;
        }
        
        .contact-item i {
            margin-right: 8px;
            font-size: 14px;
            color: var(--primary-color);
        }
        
        .content {
            padding: 30px 40px;
        }
        
        .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        
        .section-title {
            font-family: 'Montserrat', sans-serif;
            color: var(--secondary-color);
            font-size: 16px;
            border-bottom: 2px solid var(--primary-color);
            padding-bottom: 8px;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
            display: flex;
            align-items: center;
        }
        
        .section-title::after {
            content: "";
            flex: 1;
            height: 1px;
            background: var(--border-color);
            margin-left: 15px;
        }
        
        .summary {
            font-size: 14px;
            line-height: 1.8;
            color: var(--medium-text);
        }
        
        /* Experience Section */
        .experience-item {
            margin-bottom: 25px;
            border-left: 3px solid var(--primary-color);
            padding-left: 15px;
            position: relative;
        }
        
        .experience-item::before {
            content: "";
            position: absolute;
            left: -6px;
            top: 5px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: white;
            border: 2px solid var(--primary-color);
        }
        
        .experience-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            flex-wrap: wrap;
        }
        
        .job-title {
            font-weight: 600;
            font-size: 16px;
            color: var(--secondary-color);
            margin-right: 10px;
        }
        
        .company {
            font-weight: 600;
            color: var(--primary-color);
        }
        
        .duration {
            color: var(--light-text);
            font-size: 13px;
            background: var(--light-bg);
            padding: 2px 8px;
            border-radius: 4px;
        }
        
        .location {
            font-style: italic;
            color: var(--light-text);
            font-size: 13px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
        }
        
        .location i {
            margin-right: 5px;
            font-size: 12px;
        }
        
        .job-description {
            margin-bottom: 10px;
            font-size: 13px;
            color: var(--medium-text);
        }
        
        .tech-used {
            display: flex;
            flex-wrap: wrap;
            margin: 10px 0;
            gap: 8px;
        }
        
        .tech-tag {
            background: var(--light-bg);
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 12px;
            color: var(--secondary-color);
            border: 1px solid var(--border-color);
        }
        
        /* Skills Section */
        .skills-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
        }
        
        .skill-category {
            background: var(--highlight-color);
            padding: 15px;
            border-radius: 6px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.03);
        }
        
        .skill-category h3 {
            font-family: 'Montserrat', sans-serif;
            font-size: 15px;
            color: var(--secondary-color);
            margin-bottom: 12px;
            padding-bottom: 5px;
            border-bottom: 1px dashed var(--border-color);
            display: flex;
            align-items: center;
        }
        
        .skill-category h3 i {
            margin-right: 8px;
            color: var(--primary-color);
            font-size: 16px;
        }
        
        .skill-list {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }
        
        .skill-list li {
            margin-bottom: 8px;
            position: relative;
            padding-left: 22px;
            font-size: 13px;
            color: var(--medium-text);
        }
        
        .skill-list li:before {
            content: "▹";
            color: var(--primary-color);
            position: absolute;
            left: 5px;
            font-size: 14px;
        }
        
        /* Education Section */
        .education-item {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px dashed var(--border-color);
        }
        
        .education-item:last-child {
            border-bottom: none;
        }
        
        .degree {
            font-weight: 600;
            font-size: 15px;
            color: var(--secondary-color);
        }
        
        .institution {
            font-weight: 600;
            color: var(--primary-color);
            display: flex;
            align-items: center;
            margin: 3px 0;
        }
        
        .institution i {
            margin-right: 8px;
            font-size: 14px;
        }
        
        .education-duration {
            color: var(--light-text);
            font-size: 13px;
            margin-bottom: 5px;
            display: inline-block;
            background: var(--light-bg);
            padding: 2px 8px;
            border-radius: 4px;
        }
        
        .education-details {
            font-size: 13px;
            margin-top: 5px;
            color: var(--medium-text);
        }
        
        /* Projects Section */
        .project-item {
            margin-bottom: 25px;
            background: var(--highlight-color);
            padding: 15px;
            border-radius: 6px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.03);
        }
        
        .project-name {
            font-weight: 600;
            font-size: 15px;
            color: var(--secondary-color);
            margin-bottom: 5px;
            display: flex;
            align-items: center;
        }
        
        .project-name i {
            margin-right: 8px;
            color: var(--primary-color);
            font-size: 16px;
        }
        
        .project-role {
            font-style: italic;
            color: var(--light-text);
            font-size: 13px;
            margin-bottom: 10px;
        }
        
        .project-description {
            margin-bottom: 10px;
            font-size: 13px;
            color: var(--medium-text);
        }
        
        .achievements-list {
            list-style-type: none;
            padding-left: 0;
            margin: 10px 0;
        }
        
        .achievements-list li {
            margin-bottom: 8px;
            position: relative;
            padding-left: 22px;
            font-size: 13px;
            color: var(--medium-text);
        }
        
        .achievements-list li:before {
            content: "•";
            color: var(--primary-color);
            position: absolute;
            left: 8px;
            font-weight: bold;
            font-size: 16px;
        }
        
        /* Certifications Section */
        .certification-item {
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px dashed var(--border-color);
        }
        
        .certification-item:last-child {
            border-bottom: none;
        }
        
        .certification-name {
            font-weight: 600;
            font-size: 14px;
            color: var(--secondary-color);
            display: flex;
            align-items: center;
        }
        
        .certification-name i {
            margin-right: 8px;
            color: var(--primary-color);
            font-size: 16px;
        }
        
        .certification-org {
            font-size: 13px;
            color: var(--light-text);
            margin: 3px 0;
        }
        
        .certification-duration {
            font-size: 12px;
            color: var(--light-text);
            display: inline-block;
            background: var(--light-bg);
            padding: 2px 8px;
            border-radius: 4px;
        }
        
        /* Additional Info Section */
        .additional-info {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
        }
        
        .info-category {
            background: var(--highlight-color);
            padding: 15px;
            border-radius: 6px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.03);
        }
        
        .info-category h3 {
            font-family: 'Montserrat', sans-serif;
            font-size: 15px;
            color: var(--secondary-color);
            margin-bottom: 12px;
            padding-bottom: 5px;
            border-bottom: 1px dashed var(--border-color);
            display: flex;
            align-items: center;
        }
        
        .info-category h3 i {
            margin-right: 8px;
            color: var(--primary-color);
            font-size: 16px;
        }
        
        .info-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .info-tag {
            background: white;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 12px;
            color: var(--secondary-color);
            border: 1px solid var(--border-color);
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        
        .footer {
            background: var(--secondary-color);
            color: white;
            text-align: center;
            padding: 15px;
            font-size: 11px;
            opacity: 0.8;
        }
        
        /* Two-column layout for certain sections */
        .two-column {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
        }
        
        @media (max-width: 700px) {
            .two-column {
                grid-template-columns: 1fr;
            }
        }
        
        /* Icon font for symbols */
        @font-face {
            font-family: 'icomoon';
            src: url('https://i.icomoon.io/public/temp/5c9e4a0fbb/UntitledProject/style.css') format('css');
        }
        
        .icon {
            font-family: 'icomoon' !important;
            speak: none;
            font-style: normal;
            font-weight: normal;
            font-variant: normal;
            text-transform: none;
            line-height: 1;
            -webkit-font-smoothing: antialiased;
        }
    </style>
</head>
<body>
    <div class="resume-container">
        <div class="header">
            <div class="header-content">
                <h1>{{ parsed_data.Personal_Details.Full_Name }}</h1>
                <h2>{{ parsed_data.Personal_Details.Job_Title }}</h2>
                <div class="contact-info">
                    <div class="contact-item">
                        <i>✉</i> {{ parsed_data.Personal_Details.Email }}
                    </div>
                    <div class="contact-item">
                        <i>📱</i> {{ parsed_data.Personal_Details.Phone }}
                    </div>
                    <div class="contact-item">
                        <i>📍</i> {{ parsed_data.Personal_Details.Location }}
                    </div>
                    {% if parsed_data.Personal_Details.LinkedIn %}
                    <div class="contact-item">
                        <i>🔗</i> {{ parsed_data.Personal_Details.LinkedIn }}
                    </div>
                    {% endif %}
                </div>
            </div>
        </div>
        
        <div class="content">
            <!-- Professional Summary -->
            <div class="section">
                <h2 class="section-title">Professional Profile</h2>
                <div class="summary">
                    {{ parsed_data.Professional_Summary.Summary }}
                </div>
            </div>
            
            <!-- Core Competencies -->
            <div class="section">
                <h2 class="section-title">Core Competencies</h2>
                <div class="skills-container">
                    <div class="skill-category">
                        <h3><i>📊</i> Business Analysis</h3>
                        <ul class="skill-list">
                            {% for skill in parsed_data.Skills_Details.Business_Analysis_skills %}
                            <li>{{ skill }}</li>
                            {% endfor %}
                        </ul>
                    </div>
                    <div class="skill-category">
                        <h3><i>💻</i> Technical Skills</h3>
                        <ul class="skill-list">
                            {% for skill in parsed_data.Skills_Details.Technical_skills %}
                            <li>{{ skill }}</li>
                            {% endfor %}
                        </ul>
                    </div>
                    <div class="skill-category">
                        <h3><i>🛠️</i> Tools & Software</h3>
                        <ul class="skill-list">
                            {% for tool in parsed_data.Skills_Details.Tools_Software %}
                            <li>{{ tool }}</li>
                            {% endfor %}
                        </ul>
                    </div>
                    <div class="skill-category">
                        <h3><i>📈</i> Methodologies</h3>
                        <ul class="skill-list">
                            {% for method in parsed_data.Skills_Details.Methodologies %}
                            <li>{{ method }}</li>
                            {% endfor %}
                        </ul>
                    </div>
                </div>
            </div>
            
            <!-- Work Experience -->
            <div class="section">
                <h2 class="section-title">Professional Experience</h2>
                {% for experience in parsed_data.Work_Experience.list_of_experience %}
                <div class="experience-item">
                    <div class="experience-header">
                        <div>
                            <span class="job-title">{{ experience.title }}</span>
                            <span class="company">{{ experience.company }}</span>
                        </div>
                        <div class="duration">{{ experience.duration }}</div>
                    </div>
                    <div class="location">
                        <i>📍</i> {{ experience.location }}
                    </div>
                    {% if experience.job_description %}
                    <div class="job-description">{{ experience.job_description }}</div>
                    {% endif %}
                    {% if experience.key_achievements %}
                    <ul class="achievements-list">
                        {% for achievement in experience.key_achievements %}
                        <li>{{ achievement }}</li>
                        {% endfor %}
                    </ul>
                    {% endif %}
                    {% if experience.technologies_used %}
                    <div class="tech-used">
                        {% for tech in experience.technologies_used %}
                        <span class="tech-tag">{{ tech }}</span>
                        {% endfor %}
                    </div>
                    {% endif %}
                </div>
                {% endfor %}
            </div>
            
            <!-- Projects -->
            <div class="section">
                <h2 class="section-title">Key Projects</h2>
                {% for project in parsed_data.Projects_Details.list_of_projects %}
                <div class="project-item">
                    <div class="project-name">
                        <i>📌</i> {{ project.Project_name }}
                    </div>
                    <div class="project-role">{{ project.Role }} | {{ project.Duration }}</div>
                    <div class="project-description">{{ project.Project_description }}</div>
                    {% if project.Key_achievements %}
                    <ul class="achievements-list">
                        {% for achievement in project.Key_achievements %}
                        <li>{{ achievement }}</li>
                        {% endfor %}
                    </ul>
                    {% endif %}
                    {% if project.technologies_used %}
                    <div class="tech-used">
                        {% for tech in project.technologies_used %}
                        <span class="tech-tag">{{ tech }}</span>
                        {% endfor %}
                    </div>
                    {% endif %}
                </div>
                {% endfor %}
            </div>
            
            <!-- Two-column layout for Education and Certifications -->
            <div class="two-column">
                <div class="column">
                    <!-- Education -->
                    <div class="section">
                        <h2 class="section-title">Education</h2>
                        {% for education in parsed_data.Education_Details.list_of_education %}
                        <div class="education-item">
                            <div class="degree">{{ education.degree }}</div>
                            <div class="institution">
                                <i>🏫</i> {{ education.institution }}
                            </div>
                            <div class="education-duration">{{ education.years }}</div>
                            {% if education.specialization %}
                            <div class="education-details">Specialization: {{ education.specialization }}</div>
                            {% endif %}
                            {% if education.achievements %}
                            <div class="education-details">Achievements: {{ education.achievements|join(', ') }}</div>
                            {% endif %}
                        </div>
                        {% endfor %}
                    </div>
                </div>
                
                <div class="column">
                    <!-- Certifications -->
                    <div class="section">
                        <h2 class="section-title">Certifications</h2>
                        {% for cert in parsed_data.Certifications_Details.list_of_certificates %}
                        <div class="certification-item">
                            <div class="certification-name">
                                <i>🏆</i> {{ cert.Certification_name }}
                            </div>
                            <div class="certification-org">{{ cert.Issuing_organization }}</div>
                            <div class="certification-duration">{{ cert.Date_obtained }} - {{ cert.Expiration_date }}</div>
                        </div>
                        {% endfor %}
                    </div>
                </div>
            </div>
            
            <!-- Additional Information -->
            <div class="section">
                <h2 class="section-title">Additional Information</h2>
                <div class="additional-info">
                    <div class="info-category">
                        <h3><i>🌐</i> Languages</h3>
                        <div class="info-tags">
                            {% for lang in parsed_data.Additional_Information.Languages %}
                            <span class="info-tag">{{ lang }}</span>
                            {% endfor %}
                        </div>
                    </div>
                    <div class="info-category">
                        <h3><i>🎯</i> Interests</h3>
                        <div class="info-tags">
                            {% for hobby in parsed_data.Additional_Information.Hobbies %}
                            <span class="info-tag">{{ hobby }}</span>
                            {% endfor %}
                            {% for interest in parsed_data.Additional_Information.Interests %}
                            <span class="info-tag">{{ interest }}</span>
                            {% endfor %}
                        </div>
                    </div>
                    {% if parsed_data.Additional_Information.Availability %}
                    <div class="info-category">
                        <h3><i>⏱️</i> Availability</h3>
                        <div style="font-size: 13px; color: var(--medium-text);">{{ parsed_data.Additional_Information.Availability }}</div>
                    </div>
                    {% endif %}
                </div>
            </div>
        </div>
        
        <div class="footer">
            &copy; {{ parsed_data.Personal_Details.Full_Name }} - {{ now.year }} | Last Updated: {{ now.strftime("%B %d, %Y") }}
        </div>
    </div>
</body>
</html>
''')

def pdfmaker(resume_data):
    html_content = template.render(
        parsed_data=resume_data.get('parsed_data', {}),
        now=datetime.now()
    )
    HTML(string=html_content).write_pdf('/home/ritik/Documents/vscode/AI_Agent/Resume_AI_Agent/RecruiAI/resumes/professional_resume.pdf')
