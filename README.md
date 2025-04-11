Stray Saver is a one‑stop, real‑time dashboard that empowers communities to locate, rescue, and care for stray animals. Built by Runtime Terrors during Hackmol 6.0, it brings together mapping, reporting, volunteer coordination, and donation tracking into a sleek, intuitive interface.

🚀 Live Demo
👉 https://stray-saver.netlify.app/dashboard

💡 Key Features

Real‑Time Stray Map

Visualize all reported stray animals on an interactive map
Filter by species (dogs, cats, birds, etc.), urgency level, and region
Click on map markers to view full report details


Report a Stray

Easy multi‑step form to submit a new stray sighting
Attach photos, specify location (via geolocation or address), and add notes
Instant map update upon submission


Volunteer Coordination

Browse open rescue requests
Claim a case to coordinate pickup, fostering, or veterinary care
In‑app chat to communicate with reporters and other volunteers


Donation & Resource Tracker

Track monetary and in‑kind donations in real time
See top donors, trending needs (food, medicine, blankets)
Generate downloadable reports (CSV/PDF) for transparency


Admin & Analytics Panel

Approve or reject new reports and volunteer registrations
View high‑level KPIs: total rescues, active volunteers, donation volume
Graphs & charts showing week‑over‑week trends


User Authentication & Profiles

Secure sign‑up / login via email or OAuth (Google, Facebook)
Profile pages displaying past contributions, rescue history, badges
Role‑based access (Admin, Volunteer, Donor, Guest)


Responsive, Mobile‑First Design

Fully responsive layout powered by React and Tailwind CSS
Optimized for tablets and smartphones
Offline support for reporters in low‑connectivity areas




🛠️ Tech Stack

Frontend: React, Redux, React Router
UI & Styling: Tailwind CSS, Headless UI
Maps & Geolocation: Mapbox GL JS
Charts & Analytics: Recharts
Backend (if applicable): Node.js, Express, MongoDB / Firebase
Authentication: Firebase Auth / Auth0
Deployment: Netlify (Frontend), Heroku / AWS (Backend)


⚙️ Installation & Setup

Clone the repo
bashgit clone https://github.com/your-org/stray-saver.git
cd stray-saver

Install dependencies
bashnpm install

Configure environment variables
Create a .env.local in the root with:
iniREACT_APP_MAPBOX_TOKEN=your_mapbox_token
REACT_APP_API_URL=https://api.stray-saver.example.com

Run locally
bashnpm start
Open http://localhost:3000/dashboard
Build for production
bashnpm run build
Deploy the build/ folder to Netlify or your preferred host.


📸 Screenshots
<div align="center">
  <img src="docs/assets/dashboard-overview.png" alt="Dashboard Overview" width="600" />
  <img src="docs/assets/report-form.png" alt="Report Form" width="600" />
</div>

🏆 Hackmol 6.0
Stray Saver was conceived and developed during Hackmol 6.0, where we competed to build solutions for social impact. Our goal: make stray‑animal rescue as frictionless as possible, leveraging real‑time data and community engagement.

👥 Team Runtime Terrors
Team Leader: Kunal Kashyap
Contributors:

Ashfaak Aalam
Charanjot Singh
Kisna Garg


🤝 Contributing
We welcome contributions! To get started:

Fork the repo
Create a feature branch (git checkout -b feat/YourFeature)
Commit your changes (git commit -m 'feat: add awesome feature')
Push to the branch (git push origin feat/YourFeature)
Open a Pull Request

Please follow our Code of Conduct and Contribution Guidelines.

📄 License
Distributed under the MIT License. See LICENSE for details.

🙏 Acknowledgements

Mapbox for beautiful maps
Tailwind CSS for rapid styling
Recharts for easy‑to‑use charts
Hackmol community for inspiration and support


Built with ❤️ by Runtime TerrorsRetryClaude does not have the ability to run the code it generates yet. Claude does not have internet access. Links provided may not be accurate or up to date.Claude can make mistakes. Please double-check responses.
