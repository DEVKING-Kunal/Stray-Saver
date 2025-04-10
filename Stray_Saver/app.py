from flask import Flask, request, render_template_string
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

from flask import Flask, request, render_template
# (other imports stay the same)

@app.route('/')
def index():
    return render_template('index.html')
@app.route('/submit', methods=['POST'])
def submit():
    file = request.files['image']
    location = request.form.get('location')
    severity = request.form.get('severity')
    injury = request.form.get('injury')

    filename = secure_filename(file.filename)
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    return f"""
    <h2>Report Submitted!</h2>
    <p><strong>Location:</strong> {location}</p>
    <p><strong>Severity:</strong> {severity}</p>
    <p><strong>Injury:</strong> {injury}</p>
    <p><strong>File:</strong> {filename}</p>
    <a href='/'>Back to Home</a>
    """

if __name__ == '__main__':
    app.run(debug=True)