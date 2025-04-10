from flask import Flask, render_template, request, redirect, url_for, session
import firebase_admin
from firebase_admin import credentials, auth, firestore
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = os.urandom(24)  # For session management

# Initialize Firebase Admin SDK (replace with your credentials file if you have one)
cred = credentials.Certificate("C:\\Users\\HP\\Downloads\\stray-saver-27f2c-firebase-adminsdk-fbsvc-a6c7251e75.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# --- Authentication Routes ---

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        try:
            user = auth.create_user(
                email=email,
                password=password
            )
            session['uid'] = user.uid
            return redirect(url_for('dashboard'))
        except auth.EmailAlreadyExistsError:
            return render_template('signup.html', error='Email already exists.')
        except auth.WeakPasswordError:
            return render_template('signup.html', error='Password should be at least 6 characters.')
        except Exception as e:
            return render_template('signup.html', error=f'An error occurred: {e}')
    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        try:
            user = auth.sign_in_with_email_and_password(email, password)
            session['uid'] = user['localId']
            return redirect(url_for('dashboard'))
        except auth.UserNotFoundError:
            return render_template('login.html', error='Invalid credentials.')
        except auth.WrongPasswordError:
            return render_template('login.html', error='Invalid credentials.')
        except Exception as e:
            return render_template('login.html', error=f'An error occurred: {e}')
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('uid', None)
    return redirect(url_for('index'))

# --- Form Submission and Display Routes ---

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        if 'uid' not in session:
            return redirect(url_for('login'))

        latitude = request.form['latitude']
        longitude = request.form['longitude']
        image_url = request.form['image_url']  # You'll likely need to handle file uploads to Firebase Storage
        severity_level = request.form['severity_level']
        severity_type = request.form['severity_type']
        road_block = request.form['road_block']
        timestamp = datetime.now()

        doc_ref = db.collection('animal_reports').document()
        doc_ref.set({
            'latitude': latitude,
            'longitude': longitude,
            'image_url': image_url,
            'severity_level': severity_level,
            'severity_type': severity_type,
            'road_block': road_block,
            'timestamp': timestamp,
            'reporter_uid': session['uid']
        })
        return redirect(url_for('submission_success'))
    return render_template('index.html')

@app.route('/submission_success')
def submission_success():
    if 'uid' not in session:
        return redirect(url_for('login'))
    return render_template('submission_success.html')

@app.route('/dashboard')
def dashboard():
    if 'uid' not in session:
        return redirect(url_for('login'))
    reports = db.collection('animal_reports').order_by('timestamp', direction=firestore.Query.DESCENDING).get()
    reports_data = [doc.to_dict() for doc in reports]
    return render_template('dashboard.html', reports=reports_data)

if __name__ == '__main__':
    app.run(debug=True)