from weasyprint import HTML
from datetime import datetime
import pymongo



from weasyprint import HTML
from datetime import datetime
def generate_resume_html(data):
    personal = data.get("Personal_Details", {})
    summary = data.get("Professional_Summary", {})
    experience = data.get("Work_Experience", {}).get("list_of_experience", [])
    education = data.get("Education_Details", {}).get("list_of_education", [])
    skills = data.get("Skills_Details", {})
    certifications = data.get("Certifications_Details", {}).get("list_of_certificates", [])
    projects = data.get("Projects_Details", {}).get("list_of_projects", [])
    additional = data.get("Additional_Information", {})
    achievements = data.get("Achievements_Details", {}).get("list_of_achievements", [])

    def format_date(date_str):
        for fmt in ('%B %Y', '%Y-%m-%d'):
            try:
                return datetime.strptime(date_str, fmt).strftime('%b %Y')
            except:
                continue
        return date_str or ""

    def list_items(items, bullet_char="•"):
        return ''.join(f"<li>{bullet_char} {item}</li>" for item in items)

    def format_skills(skill_items):
        html = ""
        for skill in skill_items:
            parts = skill.split(':')
            if len(parts) > 1:
                html += f"<li><strong>{parts[0].strip()}:</strong> {parts[1].strip()}</li>"
            else:
                html += f"<li>{parts[0]}</li>"
        return html

    html = f"""
    <html>
    <head>
        <style>
            body {{
                font-family: 'Segoe UI', sans-serif;
                font-size: 10.5pt;
                margin: 20px;
                color: #333;
                line-height: 1.5;
                background-color: #ffffff;
            }}
            h1 {{
                font-size: 24px;
                margin: 0 0 5px 0;
                color: #1e3a8a;
                border-bottom: 2px solid #1e40af;
                padding-bottom: 5px;
            }}
            h2 {{
                font-size: 16px;
                border-bottom: 1px solid #d1d5db;
                margin-top: 20px;
                color: #1d4ed8;
                padding-bottom: 3px;
            }}
            h3 {{
                font-size: 14px;
                margin: 10px 0 5px;
                color: #374151;
            }}
            .header {{
                margin-bottom: 15px;
            }}
            .contact-info {{
                font-size: 10pt;
                margin-bottom: 5px;
                color: #4b5563;
            }}
            .contact-links a {{
                color: #2563eb;
                text-decoration: none;
                margin-right: 10px;
            }}
            .section {{
                margin-bottom: 20px;
            }}
            ul {{
                padding-left: 20px;
                margin: 8px 0;
                list-style-type: none;
            }}
            li {{
                margin-bottom: 5px;
                position: relative;
                padding-left: 15px;
            }}
            li:before {{
                content: "•";
                position: absolute;
                left: 0;
                color: #2563eb;
                font-weight: bold;
            }}
            .inline-list li {{
                display: inline-block;
                background: #e0f2fe;
                color: #0c4a6e;
                margin: 3px 5px 3px 0;
                padding: 3px 8px;
                border-radius: 4px;
                font-size: 9.5pt;
            }}
            .inline-list li:before {{
                content: none;
            }}
            .two-col {{
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
            }}
            .item {{
                margin-bottom: 12px;
                width: 100%;
            }}
            .meta {{
                font-size: 9.5pt;
                color: #6b7280;
                margin-bottom: 5px;
                font-style: italic;
            }}
            .job-description {{
                margin-left: 15px;
            }}
            .project-item {{
                margin-bottom: 15px;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>{personal.get("Full_Name", "")}</h1>
            <div class="contact-info">
                {personal.get("Email_Address", "")} | {personal.get("Phone_Number", "")} | {personal.get("City", "")}, {personal.get("State", "")}
            </div>
            <div class="contact-links">
                {" | ".join(filter(None, [
                    f'<a href="{personal.get("LinkedIn_Profile", "#")}">LinkedIn</a>' if personal.get("LinkedIn_Profile") else "",
                    f'<a href="{personal.get("GitHub_Profile", "#")}">GitHub</a>' if personal.get("GitHub_Profile") else "",
                    f'<a href="{personal.get("Portfolio_Website")}">Portfolio</a>' if personal.get("Portfolio_Website") else ""
                ]))}
            </div>
        </div>

        <div class="section">
            <h2>Professional Summary</h2>
            <ul>
                <li>{summary.get("Summary", "")}</li>
                {f'<li>{summary["Objective"]}</li>' if summary.get("Objective") else ''}
            </ul>
        </div>

        <div class="section">
            <h2>Work Experience</h2>
    """
    for exp in experience:
        start = format_date(exp.get("start_date"))
        end = format_date(exp.get("end_date") or "Present")
        duration = f"{start} - {end}" if start or end else exp.get("duration", "")
        html += f"""
            <div class="item">
                <h3>{exp.get("company", "")}</h3>
                <div class="meta">{exp.get("title", "")} | {exp.get("location", "")} | {duration}</div>
                {f'<div><strong>Technologies Used:</strong> <ul class="inline-list">{list_items(exp["technologies_used"], "")}</ul></div>' if exp.get("technologies_used") else ''}
            </div>
        """

    html += """
        </div>

        <div class="section">
            <h2>Education</h2>
    """
    for edu in education:
        years = edu.get("years", f"{format_date(edu.get('start_date'))} - {format_date(edu.get('end_date'))}")
        html += f"""
            <div class="item">
                <h3>{edu.get("degree", "")}</h3>
                <div class="meta">{edu.get("institution", "")} | {years} {f"| GPA: {edu.get('percentage')}" if edu.get("percentage") else ''}</div>
                {f'<div><strong>Specialization:</strong> {edu["specialization"]}</div>' if edu.get("specialization") else ''}
                {f'<div><strong>Relevant Coursework:</strong> <ul class="inline-list">{list_items(edu["relevant_coursework"], "")}</ul></div>' if edu.get("relevant_coursework") else ''}
                {f'<div><strong>Achievements:</strong> <ul>{list_items(edu["achievements"])}</ul></div>' if edu.get("achievements") else ''}
            </div>
        """

    html += """
        </div>

        <div class="section">
            <h2>Technical Skills</h2>
    """
    for title, key in [("Programming Languages", "Programming_Languages"), 
                      ("Frameworks & Libraries", "Frameworks_Libraries"),
                      ("Tools & Software", "Tools_Software"),
                      ("Methodologies", "Methodologies")]:
        if skills.get(key):
            html += f"""
            <h3>{title}</h3>
            <ul class="inline-list">{list_items(skills[key], "")}</ul>
            """


    if certifications:
        html += """
        <div class="section">
            <h2>Certifications</h2>
            <ul>
        """
        for cert in certifications:
            html += f"""
                <li><strong>{cert.get('Certification_name')}</strong> - {cert.get('Issuing_organization')}</li>
            """
        html += "</ul></div>"

    if projects:
        html += """
        <div class="section">
            <h2>Projects</h2>
        """
        for proj in projects:
            html += f"""
            <div class="project-item">
                <h3>{proj.get("Project_name")}</h3>
                <div class="meta"><strong>Role:</strong> {proj.get("Role", "")} | <strong>Duration:</strong> {proj.get("Duration", "")}</div>
                <div>{proj.get("Project_description", "")}</div>
                {f'<div><strong>Technologies Used:</strong> <ul class="inline-list">{list_items(proj["Technologies_used"], "")}</ul></div>' if proj.get("Technologies_used") else ''}
                {f'<div><strong>Key Achievements:</strong> <ul>{list_items(proj["Key_achievements"])}</ul></div>' if proj.get("Key_achievements") else ''}
            </div>
            """
        html += "</div>"

    if additional:
        html += """
        <div class="section">
            <h2>Additional Information</h2>
        """
        for key, label in [("Hobbies", "Hobbies"), ("Interests", "Interests"), ("Languages", "Languages")]:
            if additional.get(key):
                html += f"""
                <h3>{label}</h3>
                <ul class="inline-list">{list_items(additional[key], "")}</ul>
                """
        if additional.get("Availability"):
            html += f"""
            <h3>Availability</h3>
            <div>{additional['Availability']}</div>
            """
        html += "</div>"

    if achievements:
        html += """
        <div class="section">
            <h2>Key Achievements</h2>
            <ul>
        """
        for ach in achievements:
            impact = f" <em>(Impact: {ach['Impact']})</em>" if ach.get("Impact") else ""
            html += f"""
                <li>{ach.get('Achievement_description', '')}{impact}</li>
            """
        html += "</ul></div>"

    html += "</body></html>"
    return html




client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["resumedb"]
collection = db["job_application"]
resume_data = list(collection.find())

def pdfmaker(resume_data):
    html_content = generate_resume_html(resume_data["parsed_data"])
    HTML(string=html_content).write_pdf("/home/ritik/Documents/ResumeFlow/RecruitAI/resumes/professional_resume.pdf")
    print(f"PDF Resume generated")

# pdfmaker(resume_data[0])

