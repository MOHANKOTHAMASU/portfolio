# Kothamasu Mohan Venkata Subba Rao | Software Engineering & IoT Portfolio

[![Live Site](https://img.shields.io/badge/Production%20URL-mohankothamasu.github.io%2Fportfolio-0A66C2?style=flat-square)](https://mohankothamasu.github.io/portfolio/)
[![Repository](https://img.shields.io/badge/GitHub%20Repository-MOHANKOTHAMASU%2Fportfolio-181717?style=flat-square)](https://github.com/MOHANKOTHAMASU/portfolio)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Mohan%20Venkata%20Subba%20Rao-blue?style=flat-square)](https://www.linkedin.com/in/mohan-venkata-subba-rao-kothamasu-4464b433a)
[![HackerRank](https://img.shields.io/badge/HackerRank-kmvsubbarao28-00EA64?style=flat-square)](https://www.hackerrank.com/profile/kmvsubbarao28)
[![LeetCode](https://img.shields.io/badge/LeetCode-Practice%20Profile-FFA116?style=flat-square)](https://leetcode.com/problemset/)
[![License](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)](LICENSE)

---

## 1. Executive Summary

This repository houses the source code, interactive telemetry engines, and technical documentation for the personal portfolio of **Kothamasu Mohan Venkata Subba Rao**.

- **Degree:** Bachelor of Technology in Information Technology (Expected Graduation: 2027)
- **Institution:** QIS College of Engineering and Technology, Ongole, Andhra Pradesh, India
- **Cumulative GPA:** 7.50 / 10.0
- **Target Engineering Domains:** Software Development, Python Backend Systems, Frontend Engineering, Embedded IoT Solutions

The web application is built entirely with vanilla web technologies (HTML5, CSS3 Custom Properties, and modular ES6+ JavaScript), delivering high-performance asset rendering, custom dark/light theme persistence, zero-dependency browser-based physics/hardware simulations, and direct view-only verified credential distribution.

---

## 2. High-Level Architecture

The architecture decouples UI styling, presentation state management, and real-time physical simulation mathematics into isolated vanilla JavaScript modules.

```mermaid
flowchart TB
    subgraph ClientLayer [Client Presentation Layer]
        HTML[index.html - Semantic Document Structure]
        CSS[css/style.css - Design System, Themes, Glassmorphism]
        ATS[assets/resume-preview.html - 1-Page ATS Printable Resume]
    end

    subgraph ControllerLayer [Client Controller & State Management]
        MainJS[js/script.js - Navigation, Theme Persistence, Form Validation, Modals]
    end

    subgraph SimulationEngines [Browser-Based Telemetry & Physics Engines]
        DemoEngine[js/demos.js - Multi-Model Simulation Runtime]
        IrrigationSim[Closed-Loop Irrigation Controller]
        CanvasChart[HTML5 Canvas 2D AQI Telemetry Stream]
        PiezoSim[Kinetic Energy Harvesting & Charge Accumulator]
    end

    subgraph AssetLayer [Verified Artifacts & Document Store]
        PDF1[assets/nptel_iot_certificate.pdf]
        PDF2[assets/aws_eduskills_aiml_certificate.pdf]
        PDF3[assets/aicte_python_fullstack_certificate.pdf]
        PDF4[assets/tata_genai_data_analytics_certificate.pdf]
        PDF5[assets/aincat_rank_scorecard_certificate.pdf]
    end

    HTML --> MainJS
    HTML --> DemoEngine
    HTML --> CSS
    DemoEngine --> IrrigationSim
    DemoEngine --> CanvasChart
    DemoEngine --> PiezoSim
    HTML -.-> AssetLayer
```

---

## 3. Technology Stack & Implementation Details

| Layer | Technologies Used | Architectural Function |
| :--- | :--- | :--- |
| **Markup & Semantics** | HTML5 (W3C Standard) | Semantic document tree, accessibility ARIA tags, OpenGraph metadata |
| **Styling & Theming** | CSS3 (Grid, Flexbox, Custom Properties) | Zero-runtime CSS variables, responsive design, dark/light mode toggle |
| **Client Scripting** | JavaScript (ES6+ Vanilla) | DOM manipulation, modal orchestration, client-side validation |
| **Data Visualization** | HTML5 Canvas 2D API | Custom real-time spline chart plotting without external chart dependencies |
| **Embedded & Hardware** | Embedded C/C++, Arduino Framework | Microcontroller logic for ESP32 and Arduino UNO prototype systems |
| **Database & Scripting**| Python 3.x, MySQL, SQL | Backend algorithm practice, relational queries, complex joins, data pipelines |
| **Hosting & CI/CD** | GitHub Pages, Git | Version-controlled static hosting with zero Jekyll overhead (.nojekyll) |

---

## 4. Deep-Dive Engineering Projects & System Flows

### Project 1: Sustainable Autonomous Irrigation System

An automated fluid regulation system engineered to eliminate water waste, prevent pump dry-running, and ensure uniform multi-zone distribution.

```mermaid
flowchart TD
    Start([System Initialized]) --> ReadLevel[Read Water-Level Sensor]
    ReadLevel --> CheckMoisture{Water Level Below Threshold?}
    
    CheckMoisture -- Yes --> ActivatePump[Activate Water Pump]
    CheckMoisture -- No --> IdleState[Maintain Valve Position & Standby]
    
    ActivatePump --> StartTimer[Start 15s Safety Countdown Timer]
    StartTimer --> SensorCheck{Level Restored or High?}
    
    SensorCheck -- Yes --> ShutOffNormal[Normal Pump Deactivation]
    SensorCheck -- No --> CheckTimer{Safety Timer Expired?}
    
    CheckTimer -- No --> SensorCheck
    CheckTimer -- Yes --> TimerFallback[FAIL-SAFE TRIGGERED: Emergency Pump Shutdown]
    
    ShutOffNormal --> FourBar[Actuate Four-Bar Linkage Mechanical Valve]
    TimerFallback --> FourBar
    FourBar --> LogTelemetry[Emit State to Telemetry UI]
```

- **Mechanical Integration:** Four-bar linkage mechanism converting rotational motor input into precise linear valve displacement.
- **Fail-Safe Mechanism:** In the event of sensor disconnection or failure, a dual-layer countdown timer interrupts power to the pump motor within 15 seconds to prevent thermal stress and cavitation.

---

### Project 2: IoT Air Quality & Hazardous Gas Monitoring System

A multi-sensor environmental telemetry node designed for high-occupancy sensitive facilities such as hospitals, university classrooms, and chemical laboratories.

```mermaid
flowchart LR
    subgraph SensorArray [Sensor Acquisition Array]
        S1[MQ-2 Sensor: Smoke & Flammable LPG]
        S2[MQ-7 Sensor: Carbon Monoxide CO]
        S3[MQ-135 Sensor: Toxic Benzene & Ammonia]
        S4[DHT11 Sensor: Ambient Temperature & RH%]
    end

    subgraph MCUProcessing [ESP32 Processing Core]
        ADC[12-Bit Analog-to-Digital Conversion]
        Calibrate[Baseline Calibration & Smoothing Filter]
        AQICalc[Composite Air Quality Index Algorithm]
    end

    subgraph PresentationOutput [Telemetry Outputs]
        Canvas[HTML5 Canvas Real-Time Trend Curve]
        Alerts[Tri-State Status Indicator: Good / Moderate / Hazardous]
        LED[Hardware Alert Indicator Logic]
    end

    SensorArray --> ADC
    ADC --> Calibrate
    Calibrate --> AQICalc
    AQICalc --> Canvas
    AQICalc --> Alerts
    AQICalc --> LED
```

- **Telemetry Algorithm:** Computes weighted composite Air Quality Index (AQI) values based on calibrated parts-per-million (PPM) readings.
- **Dynamic Simulation:** Features interactive scenarios for Baseline Clean Air, Moderate Urban Smog, and Industrial Gas Hazard.

---

### Project 3: Piezoelectric Footwear Power Generation

A renewable kinetic energy harvester embedded into footwear insoles, capturing mechanical pressure exerted during walking and converting it into regulated DC electrical energy.

```mermaid
flowchart TD
    Footstep[Mechanical Footstep Impact on Sole] --> PiezoArray[Piezoelectric Transducer Disc Array]
    PiezoArray --> ACGen[High-Impedance AC Voltage Spike: 3.2V - 5.8V]
    ACGen --> BridgeRectifier[Full-Wave Bridge Rectifier Circuit]
    BridgeRectifier --> SmoothCap[Capacitive Filter & Storage Bank: Max 5.0V]
    SmoothCap --> VoltageDiv[Voltage Divider Telemetry Line]
    VoltageDiv --> ArduinoADC[Arduino UNO Analog Read Channel]
    ArduinoADC --> MathCalc[Compute Energy: E = 0.5 * C * V^2]
    MathCalc --> LCDDisplay[Simulated 16x2 Character LCD Matrix Display]
    SmoothCap --> OutputLoad{Capacitor Voltage >= 3.0V?}
    OutputLoad -- Yes --> PowerLED[Activate Emergency Output Load LED]
    OutputLoad -- No --> ChargeMore[Continue Kinetic Charge Phase]
```

- **Mathematical Energy Accumulation:** Implements asymptotic charge retention modeling: $V_{cap}(t) = V_{max}(1 - e^{-t/RC})$.
- **Telemetry UI:** Simulates a 16x2 HD44780 LCD display rendering real-time step count, instantaneous voltage, and accumulated milliJoules (mJ).

---

## 5. Verified Credentials & Public Direct Artifacts

All certificates are statically hosted within the repository under [`assets/`](file:///c:/Users/kmvsu/cv%20or%20resume/assets/) and are directly accessible without third-party login or authentication walls.

| Credential Name | Issuing Organization | Verification Details | Direct Public Document |
| :--- | :--- | :--- | :--- |
| **Internet of Things (IoT)** | NPTEL / IIT | Score: 78% (Elite Category) | [nptel_iot_certificate.pdf](https://mohankothamasu.github.io/portfolio/assets/nptel_iot_certificate.pdf) |
| **AI-ML Virtual Internship** | AWS Academy / AICTE – EduSkills | 10-Week Virtual Internship • Grade A (Very Good) • ID: 7c8b584366da4feb9c2c95bc38b2a0f9 | [aws_eduskills_aiml_certificate.pdf](https://mohankothamasu.github.io/portfolio/assets/aws_eduskills_aiml_certificate.pdf) |
| **Python Full Stack Virtual Internship** | AICTE / Edunet Foundation | Full Stack Web & Python Engineering | [aicte_python_fullstack_certificate.pdf](https://mohankothamasu.github.io/portfolio/assets/aicte_python_fullstack_certificate.pdf) |
| **GenAI / Data Analytics Job Simulation** | Tata / Forage | Analytics & Engineering Workflows | [tata_genai_data_analytics_certificate.pdf](https://mohankothamasu.github.io/portfolio/assets/tata_genai_data_analytics_certificate.pdf) |
| **National Competitive Technical Assessment** | AINCAT | All-India Rank: 6000 | [aincat_rank_scorecard_certificate.pdf](https://mohankothamasu.github.io/portfolio/assets/aincat_rank_scorecard_certificate.pdf) |

---

## 6. Algorithmic Problem Solving & Technical Practice

Structured algorithmic practice is maintained across major coding platforms:

- **Core Focus:** Python (Primary algorithm logic, string operations, recursive workflows)
- **Database Systems:** SQL (Relational database management, joins, subqueries, grouping)
- **Object-Oriented Design:** Java (Encapsulation, inheritance, polymorphism, modularity)

| Platform | Profile URL | Focus Area |
| :--- | :--- | :--- |
| **HackerRank** | [hackerrank.com/profile/kmvsubbarao28](https://www.hackerrank.com/profile/kmvsubbarao28) | Python Problem Solving & SQL Query Challenges |
| **LeetCode** | [leetcode.com/problemset](https://leetcode.com/problemset/) | Data Structures & Algorithmic Patterns |
| **GitHub** | [github.com/MOHANKOTHAMASU](https://github.com/MOHANKOTHAMASU) | Source Code, Assignments & Experimental Systems |

---

## 7. Directory Structure

```
.
|-- .gitignore
|-- .nojekyll
|-- README.md
|-- index.html
|-- css/
|   `-- style.css
|-- js/
|   |-- demos.js
|   `-- script.js
`-- assets/
    |-- README.md
    |-- profile.jpg
    |-- resume-preview.html
    |-- nptel_iot_certificate.pdf
    |-- aws_eduskills_aiml_certificate.pdf
    |-- aicte_python_fullstack_certificate.pdf
    |-- tata_genai_data_analytics_certificate.pdf
    |-- aincat_rank_scorecard_certificate.pdf
    |-- airquality_prototype.jpg
    |-- airquality_architecture.jpg
    |-- irrigation_prototype.jpg
    |-- irrigation_architecture.jpg
    |-- piezo_footwear_prototype.jpg
    `-- piezo_architecture.jpg
```

---

## 8. Local Setup & Execution Guide

### Prerequisites
No compilation tools, package managers, or runtime frameworks are required. A modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari) is sufficient.

### Step 1: Clone Repository
```bash
git clone https://github.com/MOHANKOTHAMASU/portfolio.git
cd portfolio
```

### Step 2: Launch Local Server

#### Option A: Python Built-in Server
```bash
python -m http.server 8000
```
Navigate to `http://localhost:8000` in your browser.

#### Option B: Node.js Static Server
```bash
npx serve .
```

#### Option C: VS Code Live Server Extension
Open the directory in VS Code, right-click `index.html`, and select **Open with Live Server**.

---

## 9. Contact & Professional Channels

- **Name:** Kothamasu Mohan Venkata Subba Rao
- **Email:** [kmvsubbarao28@gmail.com](mailto:kmvsubbarao28@gmail.com)
- **Phone:** [+91 9618009899](tel:+919618009899)
- **Location:** Addanki, Andhra Pradesh, India
- **LinkedIn:** [linkedin.com/in/mohan-venkata-subba-rao-kothamasu-4464b433a](https://www.linkedin.com/in/mohan-venkata-subba-rao-kothamasu-4464b433a)
- **GitHub:** [github.com/MOHANKOTHAMASU](https://github.com/MOHANKOTHAMASU)
- **Online ATS Resume:** [View 1-Page Resume Preview](https://mohankothamasu.github.io/portfolio/assets/resume-preview.html)
