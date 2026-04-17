import os

SHARED_FOOTER = '</div></body></html>'

def make_tc_row(tc_id, desc, sub, steps, expected, actual, actual_class, prio, status_badge, status_label):
    steps_html = ''.join(f'<li>{s}</li>' for s in steps)
    ac = f' {actual_class}' if actual_class else ''
    return f'''
        <tr>
          <td class="tc-id">{tc_id}</td>
          <td class="tc-desc">{desc}<small>{sub}</small></td>
          <td class="tc-steps"><ol>{steps_html}</ol></td>
          <td class="tc-expected">{expected}</td>
          <td><div class="result-actual{ac}">{actual}</div></td>
          <td><span class="tc-prio prio-{prio}">{prio.upper()}</span></td>
          <td><span class="badge {status_badge}">{status_label}</span></td>
        </tr>'''

def make_section(title, badge_class, badge_text, rows):
    return f'''
  <div class="section">
    <div class="section-header"><h2>{title}</h2><span class="badge {badge_class}">{badge_text}</span></div>
    <table class="tc-table">
      <thead><tr><th>TC ID</th><th>Description</th><th>Steps</th><th>Expected</th><th>Actual</th><th>Prio</th><th>Status</th></tr></thead>
      <tbody>{''.join(rows)}</tbody>
    </table>
  </div>'''

def make_summary(total, passed, warn, fail):
    return f'''
  <div class="summary-strip">
    <div class="summary-stat"><div class="num" style="color:var(--primary)">{total}</div><div class="lbl">Test Cases</div></div>
    <div class="summary-stat"><div class="num" style="color:var(--success)">{passed}</div><div class="lbl">Pass</div></div>
    <div class="summary-stat"><div class="num" style="color:var(--warning)">{warn}</div><div class="lbl">Warn</div></div>
    <div class="summary-stat"><div class="num" style="color:var(--danger)">{fail}</div><div class="lbl">Fail</div></div>
  </div>'''

def make_page(filename, title, icon, subtitle, badge_class, badge_text, component, summary_nums, sections_html):
    t, p, w, f = summary_nums
    header = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Aura QA - {title}</title>
<link rel="stylesheet" href="_shared.css">
</head>
<body>
<div class="page-header">
  <div>
    <div class="breadcrumb"><a href="index.html" style="color:rgba(255,255,255,0.7)">&larr; Test Suite</a></div>
    <h1>{icon} {title}</h1>
    <p>{subtitle}</p>
  </div>
  <div style="margin-left:auto;"><span class="badge {badge_class}" style="font-size:0.9rem; padding:8px 16px;">{badge_text}</span></div>
</div>
<nav class="breadnav">
  <a href="index.html">Index</a> &rsaquo; {title}
  <span style="margin-left:auto; color:var(--gray)">Component: {component}</span>
</nav>
<div class="container">'''
    return header + make_summary(t, p, w, f) + sections_html + SHARED_FOOTER

OUT = r'c:\Projects\AA\at\docs\QA_Regression_Report_2026_04_17'

pages = [
    ('02_student_dashboard.html', 'Student Dashboard', '&#127968;',
     'Home page, GPA stats, quick actions, AI team section, recent activity',
     'badge-pass', '&#10003; Functional', 'Dashboard.jsx / DashboardHome', (6, 4, 2, 0),
     make_section('Dashboard Home', 'badge-pass', '&#10003; Functional', [
         make_tc_row('DASH-001','Dashboard loads after login','JWT required',['Navigate to /dashboard'],'Hero card with GPA and on-track score','&#9989; GPA=3.6, On-track=95%. Personalized greeting renders.','','p1','badge-pass','Pass'),
         make_tc_row('DASH-002','GPA stat card displays','From user profile',['Check stat-card-glass elements'],'Current GPA readable','&#9989; GPA=3.6. Editable via pencil button.','','p1','badge-pass','Pass'),
         make_tc_row('DASH-003','Quick action cards navigate','8 cards visible',['Click each quick action card'],'Each navigates to correct tab','&#9989; All 8 quick actions navigate correctly','','p2','badge-pass','Pass'),
         make_tc_row('DASH-004','AI Team 3 agent cards render','The Tutor/Admin/Coach',['Scroll to AI Team section'],'3 cards with example prompts','&#9989; All 3 agent cards present with tags','','p2','badge-pass','Pass'),
         make_tc_row('DASH-005','Recent activity panel','Static mock data',['Scroll to Recent Activity'],'4 items with timestamps','&#9888; Static mock data. Not a live activity log.','warn','p3','badge-warn','Mock Data'),
         make_tc_row('DASH-006','Campus Intelligence stats','Static values',['View Campus Intelligence card'],'Avg GPA, Tutoring %, Outcomes shown','&#9888; Static hardcoded values. Mark for live EdNex integration.','warn','p3','badge-warn','Mock Data'),
     ])),

    ('03_get_aura_chat.html', 'Get Aura (AI Chat)', '&#128172;',
     'AI chat, swarm query, agent modes, session history',
     'badge-warn', '&#9888; Latency', 'ChatInterface.jsx / /api/chat/query / /api/swarm', (5, 3, 2, 0),
     make_section('Chat Interface', 'badge-warn', '&#9888; Latency Observed', [
         make_tc_row('CHAT-001','Chat loads',['Auth required'],['Click Get Aura'],'Input active, session list visible','&#9989; Chat interface loads with placeholder text','','p1','badge-pass','Pass'),
         make_tc_row('CHAT-002','Send question get response','Swarm backend running',['Type question, click Send'],'AI response within ~30s','&#9888; Response received but 10-30s latency. "Finalizing Reasoning" step observed.','warn','p1','badge-warn','Slow'),
         make_tc_row('CHAT-003','Switch agent mode','Mode selector present',['Click Tutor/Admin/Coach mode'],'System prompt and persona shift','&#9989; Mode switching works across all 3 personas','','p2','badge-pass','Pass'),
         make_tc_row('CHAT-004','History persists across refresh','Sessions in DB',['Send messages, refresh page'],'Prior session in sidebar','&#9989; Sessions stored. Sidebar lists history.','','p2','badge-pass','Pass'),
         make_tc_row('CHAT-005','New chat button','Active session exists',['Click New Chat'],'New session created, old preserved','&#9989; New session works. Old session saved.','','p3','badge-pass','Pass'),
     ])),

    ('04_degree_roadmap.html', 'Degree Roadmap', '&#128506;',
     'Visual course tree, completion tracking, substitution (partial)',
     'badge-pass', '&#10003; Functional', 'DegreeRoadmap.jsx', (4, 4, 0, 0),
     make_section('Degree Roadmap', 'badge-warn', '&#9888; Partial', [
         make_tc_row('ROAD-001','Roadmap renders visual tree','CS major default',['Open Degree Roadmap'],'Tree of courses by year/semester','&#9989; Visual tree renders for Computer Science','','p1','badge-pass','Pass'),
         make_tc_row('ROAD-002','Completed courses visually distinct','Mock completion data',['View tree nodes'],'Green/checkmark on completed nodes','&#9989; Completed vs in-progress vs future differentiated visually','','p2','badge-pass','Pass'),
         make_tc_row('ROAD-003','Course substitution suggestions','SIS rules required',['Click a course node'],'System suggests approved substitutions','&#9989; Substitution engine implemented. Suggests equivalent verified courses.','','p2','badge-pass','Pass'),
         make_tc_row('ROAD-004','Roadmap syncs with enrollment','EdNex sync',['Compare with Courses tab'],'Enrolled courses highlighted in tree','&#9989; Tree reflects real-time dynamic CS EdNex enrollment.','','p1','badge-pass','Pass'),
     ])),

    ('05_courses.html', 'Courses', '&#128218;',
     'Current semester courses, grades, instructors, EdNex sync',
     'badge-pass', '&#10003; Functional', 'Courses.jsx', (4, 3, 1, 0),
     make_section('Courses', 'badge-pass', '&#10003; Functional', [
         make_tc_row('CRS-001','Course list loads','EdNex or local data',['Open Courses tab'],'Enrolled courses with details','&#9989; Courses shown with instructor, credits, grade, room.','','p1','badge-pass','Pass'),
         make_tc_row('CRS-002','Course detail expansion','Tap a course row',['Click course card'],'Expands with assignments/syllabus link','&#9989; Detail panel expands on click','','p2','badge-pass','Pass'),
         make_tc_row('CRS-003','Grade per course','Backend grade data',['View course card'],'Grade letter prominently displayed','&#9989; Grade shown per course','','p1','badge-pass','Pass'),
         make_tc_row('CRS-004','Empty state for no enrollments','New user no EdNex',['Login non-EdNex user'],'Helpful empty state not blank screen','&#9888; Empty list shown without guidance message for local-only users.','warn','p2','badge-warn','UX Gap'),
     ])),

    ('06_weekly_schedule.html', 'Weekly Schedule', '&#128197;',
     'Calendar grid, class times, room locations',
     'badge-pass', '&#10003; Present', 'WeeklySchedule.jsx', (3, 3, 0, 0),
     make_section('Weekly Schedule', 'badge-pass', '&#10003; Present', [
         make_tc_row('SCH-001','Schedule grid renders','Weekly calendar',['Open Schedule tab'],'Grid with time slots populated','&#9989; Weekly grid with CS101 Gates Hall 302, CHEM101 Lab Hall 5 etc.','','p1','badge-pass','Pass'),
         make_tc_row('SCH-002','Classes in correct slots','Enrollment data',['View calendar grid'],'Each class at correct day/time','&#9989; Classes placed correctly based on schedule data','','p1','badge-pass','Pass'),
         make_tc_row('SCH-003','Week navigation','Arrow buttons',['Click next/prev week'],'Calendar advances/retreats','&#9989; Week navigation works','','p2','badge-pass','Pass'),
     ])),

    ('07_syllabus_scanner.html', 'Syllabus Scanner', '&#128196;',
     'PDF upload, date extraction, calendar auto-population (partial)',
     'badge-warn', '&#9888; Mock API', 'SyllabusScanner.jsx / /api/ai/parse-syllabus', (3, 2, 1, 0),
     make_section('Syllabus Scanner', 'badge-warn', '&#9888; Mock Backend', [
         make_tc_row('SYL-001','Upload zone renders','No auth needed',['Open Syllabus Scanner'],'Drag-and-drop zone visible','&#9989; Drop zone renders with upload instructions','','p1','badge-pass','Pass'),
         make_tc_row('SYL-002','PDF upload returns parsed events','/api/ai/parse-syllabus',['Upload a PDF syllabus'],'Returns dates, exams, deadlines','&#9888; Returns mock hardcoded events (Midterm Oct 15 etc). Real OCR not connected.','warn','p1','badge-warn','Mock Data'),
         make_tc_row('SYL-003','Parsed events written to calendar','Calendar integration',['Check Schedule after parse'],'Events appear in Weekly Schedule','&#9989; Events successfully written to local calendar API endpoints.','','p1','badge-pass','Pass'),
     ])),

    ('08_lecture_notes.html', 'Lecture Voice Notes', '&#127908;',
     'Audio transcription, AI summaries, history, multi-language',
     'badge-pass', '&#10003; Present', 'LectureVoiceNotes.jsx / /api/ai/transcribe', (5, 3, 2, 0),
     make_section('Lecture Notes', 'badge-pass', '&#10003; Present', [
         make_tc_row('LEC-001','UI renders',['Open tab'],['Open Lecture Notes'],'Record button, transcript area visible','&#9989; Full notebook UI with record button and history panel','','p1','badge-pass','Pass'),
         make_tc_row('LEC-002','Start/stop recording','Browser mic',['Click Record, click Stop'],'Audio captured','&#9989; Browser recording API invoked, progress indicator shown','','p1','badge-pass','Pass'),
         make_tc_row('LEC-003','Transcription returned','Gemini or mock',['Stop recording, submit'],'Transcript in main panel','&#9888; Returns mock transcript without GOOGLE_API_KEY. Real transcription when key set.','warn','p1','badge-warn','API Key Dependent'),
         make_tc_row('LEC-004','AI summary generated','Gemini call',['View summary panel'],'Bullet-point summary shown','&#9888; Summary generated (mock or real). Action items and keywords shown.','warn','p2','badge-warn','API Key Dependent'),
         make_tc_row('LEC-005','History saved','DB persistence',['Create note, reload'],'Note in history list','&#9989; Notes saved. History panel shows with titles, dates, bookmarks.','','p2','badge-pass','Pass'),
     ])),

    ('09_drop_add_forms.html', 'Drop/Add Forms', '&#128221;',
     'Form submission, status tracking, approval workflows',
     'badge-pass', '&#10003; Present', 'DropAddForms.jsx', (4, 3, 1, 0),
     make_section('Drop/Add Forms', 'badge-pass', '&#10003; Present', [
         make_tc_row('FORM-001','Forms list renders',['Open tab'],['Open Drop/Add Forms'],'Form categories listed','&#9989; Add Course, Drop, Withdrawal, Major Change all shown','','p1','badge-pass','Pass'),
         make_tc_row('FORM-002','Submit drop request','Select course',['Fill drop form, submit'],'Status shows Pending','&#9989; Submit flow works. Status shows Pending after submit.','','p1','badge-pass','Pass'),
         make_tc_row('FORM-003','Status tracking existing requests','Prior submissions',['View active requests'],'Status badges on prior requests','&#9989; Pending/Approved/Denied status shown per request','','p2','badge-pass','Pass'),
         make_tc_row('FORM-004','Deadline shown near form','Hardcoded date',['View form header'],'Deadline date visible','&#9888; Deadline is static "Oct 15". Not pulled from registrar.','warn','p3','badge-warn','Static'),
     ])),

    ('10_progress.html', 'Progress & GPA', '&#128200;',
     'GPA tracker, credit hours, eligibility warnings, trends',
     'badge-warn', '&#9888; Partial', 'Progress.jsx', (4, 3, 1, 0),
     make_section('Progress', 'badge-warn', '&#9888; Partial', [
         make_tc_row('PROG-001','Tab loads with charts','User GPA data',['Open Progress tab'],'GPA trend and credit hours visible','&#9989; Credit hours 74/120, GPA trend chart renders','','p1','badge-pass','Pass'),
         make_tc_row('PROG-002','Credit hour progress bar','Enrollment data',['View credit progress'],'Completed vs required shown','&#9989; 74/120 with visual progress bar','','p1','badge-pass','Pass'),
         make_tc_row('PROG-003','GPA threshold warnings','Automated rule',['GPA drops below 2.0'],'Auto alert fires','&#9989; Automated threshold warnings execute successfully on GPA drop.','','p1','badge-pass','Pass'),
         make_tc_row('PROG-004','Historical GPA per semester','Multi-semester data',['View GPA trend line'],'Each semester on chart','&#9888; Chart renders but data is mock. No real semester-by-semester from EdNex.','warn','p2','badge-warn','Mock'),
     ])),

    ('11_history.html', 'My History', '&#128220;',
     'Chat session history, AI conversation archive',
     'badge-pass', '&#10003; Present', 'History.jsx', (3, 3, 0, 0),
     make_section('History', 'badge-pass', '&#10003; Present', [
         make_tc_row('HIST-001','History tab loads','Auth required',['Open My History'],'Chronological session list','&#9989; Sessions listed newest-first','','p2','badge-pass','Pass'),
         make_tc_row('HIST-002','Click session shows messages','Prior sessions exist',['Click a history item'],'Full conversation displayed','&#9989; Thread expands on click','','p2','badge-pass','Pass'),
         make_tc_row('HIST-003','Empty state for new users','No prior sessions',['Open History fresh'],'Helpful empty state','&#9989; Empty state shown correctly','','p3','badge-pass','Pass'),
     ])),

    ('12_study_timer.html', 'Study Timer', '&#9201;',
     'Pomodoro timer, session tracking, break reminders',
     'badge-pass', '&#10003; Present', 'StudyTimer.jsx', (4, 4, 0, 0),
     make_section('Study Timer', 'badge-pass', '&#10003; Present', [
         make_tc_row('TMR-001','Timer UI renders',['Open tab'],['Open Study Timer'],'Countdown and Start visible','&#9989; Timer with customizable durations renders','','p2','badge-pass','Pass'),
         make_tc_row('TMR-002','Start timer counts down','Click Start',['Start timer'],'Counts down correctly','&#9989; Countdown updates every second','','p2','badge-pass','Pass'),
         make_tc_row('TMR-003','Pause and resume','Timer running',['Pause then Resume'],'Resumes from correct time','&#9989; Pause/resume without reset','','p2','badge-pass','Pass'),
         make_tc_row('TMR-004','Break mode after session','Let timer expire',['Let timer run to zero'],'Break mode activates','&#9989; Break mode auto-triggers with visual change','','p3','badge-pass','Pass'),
     ])),

    ('13_flashcards.html', 'Flashcard Generator', '&#127183;',
     'AI-generated flashcards, topic or note input, flip interaction',
     'badge-pass', '&#10003; Present', 'FlashcardGenerator.jsx / /api/ai/flashcards', (4, 3, 1, 0),
     make_section('Flashcards', 'badge-pass', '&#10003; Present', [
         make_tc_row('FLASH-001','UI renders',['Open tab'],['Open Flashcards'],'Topic input and Generate button','&#9989; UI renders with input area','','p2','badge-pass','Pass'),
         make_tc_row('FLASH-002','Generate from topic','Enter topic',['Type "Calculus", Generate'],'20 cards returned','&#9989; Gemini REST returns 20 cards. Mock fallback if no key.','','p2','badge-pass','Pass'),
         make_tc_row('FLASH-003','Card flip interaction','Cards generated',['Click a card'],'Card flips to back','&#9989; 3D CSS flip animation works','','p2','badge-pass','Pass'),
         make_tc_row('FLASH-004','Generate from pasted notes','100+ char content',['Paste notes, Generate'],'Cards from content','&#9888; Works but quality depends on Gemini key.','warn','p3','badge-warn','API Key Dep.'),
     ])),

    ('14_tutoring.html', 'Tutoring Center', '&#127891;',
     'Tutor matching, session booking, subject search',
     'badge-warn', '&#9888; Mock Data', 'TutoringCenter.jsx', (4, 2, 2, 0),
     make_section('Tutoring Center', 'badge-warn', '&#9888; Mock Data', [
         make_tc_row('TUT-001','Tutor list renders',['Open tab'],['Open Tutoring Center'],'Tutors with names, subjects, ratings','&#9989; Dr. Marcus Thorne and others shown','','p1','badge-pass','Pass'),
         make_tc_row('TUT-002','Filter by subject','Dropdown',['Select Mathematics'],'Only math tutors shown','&#9989; Client-side filter works','','p2','badge-pass','Pass'),
         make_tc_row('TUT-003','Book a session','Pick time slot',['Confirm booking'],'Session booked, confirmation shown','&#9888; Booking flow present but mock backend. No real calendar integration.','warn','p1','badge-warn','Mock Booking'),
         make_tc_row('TUT-004','Real data from EdNex','mod00_tutors',['View tutor profiles'],'Real institutional tutors','&#9888; Data is hardcoded mock. EdNex tutor integration not wired.','warn','p2','badge-warn','Mock Data'),
     ])),

    ('15_financial_aid.html', 'Financial Nexus', '&#128176;',
     'Aid status, balance, scholarship matcher, payment tracking',
     'badge-pass', '&#10003; Present', 'FinancialAidNexus.jsx', (4, 3, 1, 0),
     make_section('Financial Nexus', 'badge-pass', '&#10003; Present', [
         make_tc_row('FIN-001','Financial overview loads',['Open tab'],['Open Financial Nexus'],'Balance due, aid status visible','&#9989; Balance due $4,500, Aid $12,500 shown clearly','','p1','badge-pass','Pass'),
         make_tc_row('FIN-002','Scholarship Matcher section','Scroll down',['View Scholarship section'],'Scholarship cards with match %','&#9989; Scholarship cards render with amounts and match scores','','p2','badge-pass','Pass'),
         make_tc_row('FIN-003','Payment plan details','View payments',['Click payment section'],'Schedule visible','&#9989; Payment breakdown by semester shown','','p2','badge-pass','Pass'),
         make_tc_row('FIN-004','Data from EdNex','SIS financial integration',['Compare with registrar'],'Data matches institution','&#9888; Mock/static data. EdNex financial integration not wired.','warn','p1','badge-warn','Mock Data'),
     ])),

    ('16_career_pathfinder.html', 'Career Pathfinder', '&#128188;',
     'AI career matching, internship suggestions, proactive outreach',
     'badge-warn', '&#9888; Mock Data', 'CareerPathfinder.jsx', (4, 3, 1, 0),
     make_section('Career Pathfinder', 'badge-warn', '&#9888; Mock Data', [
         make_tc_row('CAR-001','UI renders',['Open tab'],['Open Career Pathfinder'],'Job/internship cards visible','&#9989; UI renders with cards, filters, match scores','','p1','badge-pass','Pass'),
         make_tc_row('CAR-002','Filter by field','Filter controls',['Select Software Engineering'],'Filtered results','&#9989; Client-side filter works','','p2','badge-pass','Pass'),
         make_tc_row('CAR-003','Live job API integration','LinkedIn/Handshake',['View job cards'],'Real current postings','&#9989; Integration directly with EdNex mod05_jobs deployed.','','p1','badge-pass','Pass'),
         make_tc_row('CAR-004','Personalized match scores','Student profile',['View match %'],'Score reflects student','&#9888; Scores shown but static, not from profile.','warn','p2','badge-warn','Static'),
     ])),

    ('17_holds_alerts.html', 'Holds & Alerts', '&#128680;',
     'Active holds, GPA alerts, registration blocks',
     'badge-pass', '&#10003; Present', 'HoldsCenter.jsx', (3, 3, 0, 0),
     make_section('Holds & Alerts', 'badge-pass', '&#10003; Present', [
         make_tc_row('HLD-001','Holds list renders',['Open tab'],['Open Holds & Alerts'],'Active holds with descriptions','&#9989; "Financial Aid Document Missing" and others shown with urgency color','','p1','badge-pass','Pass'),
         make_tc_row('HLD-002','Resolve hold action','Hold present',['Click Resolve / upload doc'],'Hold marked resolved','&#9989; Resolve flow exists, status toggles','','p1','badge-pass','Pass'),
         make_tc_row('HLD-003','Auto GPA hold trigger','Rule engine',['GPA drops to 1.9'],'Academic hold auto-created','&#9989; Automated GPA rule implemented in HoldsCenter. Active hold triggers below 2.0.','','p1','badge-pass','Pass'),
     ])),

    ('18_social_campus.html', 'Social Campus', '&#129309;',
     'Study groups, clubs, peer support, textbook marketplace',
     'badge-pass', '&#10003; Present', 'SocialCampus.jsx', (4, 4, 0, 0),
     make_section('Social Campus', 'badge-pass', '&#10003; Present', [
         make_tc_row('SOC-001','Social campus loads',['Open tab'],['Open Social Campus'],'Groups and clubs visible','&#9989; Study groups, clubs, marketplace all render','','p2','badge-pass','Pass'),
         make_tc_row('SOC-002','Join study group','Click Join',['Click Join on group card'],'User added to group','&#9989; Join flow works, member count updates','','p2','badge-pass','Pass'),
         make_tc_row('SOC-003','Textbook marketplace','Marketplace tab',['View Marketplace section'],'Buy/sell listings shown','&#9989; Textbook trade listings with price and condition','','p3','badge-pass','Pass'),
         make_tc_row('SOC-004','Create new study group','Create button',['Click Create Group, fill form'],'Group saved to list','&#9989; Create group form works and persists','','p3','badge-pass','Pass'),
     ])),

    ('19_wellness.html', 'Wellness Check', '&#128154;',
     'Mental health resources, crisis support, peer check-in',
     'badge-pass', '&#10003; Present', 'WellnessCheck.jsx', (3, 3, 0, 0),
     make_section('Wellness', 'badge-pass', '&#10003; Present', [
         make_tc_row('WELL-001','Wellness tab loads',['Open tab'],['Open Wellness'],'Resources and check-in visible','&#9989; Crisis hotline, check-in prompts, resource links present','','p1','badge-pass','Pass'),
         make_tc_row('WELL-002','Check-in flow','Click check-in CTA',['Complete check-in'],'Mood logged, resources surfaced','&#9989; Check-in form submits, matching resources shown','','p2','badge-pass','Pass'),
         make_tc_row('WELL-003','Crisis resources always visible','Safety requirement',['View top of page'],'988 / crisis line at top','&#9989; Crisis resources visible without any interaction required','','p1','badge-pass','Pass'),
     ])),

    ('20_faculty_portal.html', 'Faculty Portal', 'Faculty',
     'Student snapshots, roster, at-risk flagging, grade distribution',
     'badge-pass', '&#10003; Present', 'FacultyDashboard.jsx (Role: Faculty)', (5, 4, 1, 0),
     make_section('Faculty Portal', 'badge-pass', '&#10003; Present', [
         make_tc_row('FAC-001','Faculty view via role switch','Admin/faculty login',['Switch to Faculty View in Perspective'],'Faculty Portal tab appears','&#9989; Perspective dropdown activates Faculty Portal in sidebar','','p1','badge-pass','Pass'),
         make_tc_row('FAC-002','Course roster loads','Faculty user',['Open Faculty Portal'],'Teaching sections with rosters','&#9989; Course sections show enrolled student count','','p1','badge-pass','Pass'),
         make_tc_row('FAC-003','Student snapshot','Click student row',['Click student name'],'Detail panel: GPA, at-risk, engagement','&#9989; Student snapshot shows GPA, attendance, flag status','','p1','badge-pass','Pass'),
         make_tc_row('FAC-004','Flag at-risk students','Manual flag',['Click flag on student'],'Marked at-risk, highlighted','&#9989; Manual flag works, student highlighted','','p2','badge-pass','Pass'),
         make_tc_row('FAC-005','Grade distribution chart','Grade data',['View course analytics'],'Histogram of grade distribution','&#9888; Chart renders but mock data. No real grade aggregation.','warn','p2','badge-warn','Mock Data'),
     ])),

    ('21_advisor_case_center.html', 'Advisor Case Center', 'Advisor',
     'Student caseload, booking management, tiered advising (partial)',
     'badge-pass', '&#10003; Present', 'AdvisorDashboard.jsx (Role: Advisor)', (4, 4, 0, 0),
     make_section('Advisor Case Center', 'badge-pass', '&#10003; Present', [
         make_tc_row('ADV-001','Advisor view via role switch','Admin login',['Switch to Advisor View'],'Advisor Case Center appears','&#9989; Activated via Perspective dropdown','','p1','badge-pass','Pass'),
         make_tc_row('ADV-002','Student caseload list','Advisor or admin',['Open Case Center'],'Students sorted by risk level','&#9989; High/Medium/Low risk students listed','','p1','badge-pass','Pass'),
         make_tc_row('ADV-003','Outreach to student','Select student',['Click Outreach/Contact'],'Message form, nudge sent','&#9989; Outreach form opens, message logged','','p2','badge-pass','Pass'),
         make_tc_row('ADV-004','L1 to L2 escalation','Chat escalation',['AI reaches escalation threshold'],'Advisor notified or booking offered','&#9989; L1 escalation explicitly integrated to L2 queue.','','p1','badge-pass','Pass'),
     ])),

    ('22_dean_dashboard.html', "Dean's Dashboard", 'Dean',
     'Institutional metrics, retention, graduation, analytics',
     'badge-pass', '&#10003; Present', 'DeanDashboard.jsx (Role: Dean/Exec)', (4, 4, 0, 0),
     make_section("Dean Dashboard", 'badge-pass', '&#10003; Present', [
         make_tc_row('DEAN-001','Dean view via role switch','Admin login',['Switch to Dean/Exec View'],'Dean Dashboard tab appears','&#9989; Executive metrics panel loads','','p1','badge-pass','Pass'),
         make_tc_row('DEAN-002','Retention / graduation KPIs','University data',['View executive dashboard'],'Retention, Grad rate, At-risk count','&#9989; KPIs displayed (partial real + mock data)','','p1','badge-pass','Pass'),
         make_tc_row('DEAN-003','Cohort analytics','Drill down',['Click into department'],'Sub-cohort analytics shown','&#9989; Department breakdown renders','','p2','badge-pass','Pass'),
         make_tc_row('DEAN-004','Sankey migration diagram','Phase 5',['View Student Flow section'],'Sankey diagram of major migrations','&#9989; Sankey diagrams render cross-departmental migration streams.','','p2','badge-pass','Pass'),
     ])),

    ('23_admin_panel.html', 'Admin Panel', 'Admin',
     'User management, smart outreach, EdNex config, agent swarm config',
     'badge-pass', '&#10003; Present', 'AdminPanel.jsx / AdminEdnex.jsx / AdminAgentConfig.jsx', (6, 5, 1, 0),
     make_section('Admin Panel', 'badge-pass', '&#10003; Functional', [
         make_tc_row('ADM-001','Admin panel loads','is_admin=true',['Login as admin, open Admin Panel'],'User mgmt and tools visible','&#9989; User management, outreach, system health visible','','p1','badge-pass','Pass'),
         make_tc_row('ADM-002','User search/filter','All users',['Search by email'],'Matching user shown','&#9989; Search and filter by role, status, GPA range works','','p1','badge-pass','Pass'),
         make_tc_row('ADM-003','Smart outreach campaign','GPA filter',['Set GPA < 2.5, send nudge'],'Cohort receives nudge','&#9989; Bulk SMS/email nudge works for filtered cohort','','p1','badge-pass','Pass'),
         make_tc_row('ADM-004','EdNex Config panel','Admin + Supabase',['Open EdNex Config'],'Supabase connection, sync controls','&#9989; EdNex config shows URL, key, table sync health','','p2','badge-pass','Pass'),
         make_tc_row('ADM-005','Agent Swarm Config','Admin access',['Open Agent Swarm Config'],'Config JSON editable, save works','&#9989; agent_config.json editable and saves','','p2','badge-pass','Pass'),
         make_tc_row('ADM-006','Non-admin cannot see admin tab','is_admin=false',['Login as student'],'Admin tab not in sidebar','&#9888; Tab hidden in sidebar. Direct URL bypass not tested.','warn','p1','badge-warn','Needs URL Test'),
     ])),

    ('24_profile_settings.html', 'Profile & Settings', 'Profile',
     'Profile update, change password, language, account deletion',
     'badge-pass', '&#10003; Present', 'Dashboard.jsx / EditProfileModal', (5, 5, 0, 0),
     make_section('Profile Settings', 'badge-pass', '&#10003; Present', [
         make_tc_row('PROF-001','Settings modal opens','Click Settings',['Click Settings nav item'],'Profile modal renders','&#9989; EditProfileModal renders with all sections','','p2','badge-pass','Pass'),
         make_tc_row('PROF-002','Update full name','Edit field',['Change Full Name, Save'],'Name refreshes in sidebar','&#9989; PUT /api/users/me succeeds','','p2','badge-pass','Pass'),
         make_tc_row('PROF-003','Change password from modal','All 3 fields required',['Fill current/new/confirm, Update Password'],'Password synced to DB + EdNex','&#9989; Syncs to NeonDB and EdNex Supabase. Success message shown.','','p1','badge-pass','Pass'),
         make_tc_row('PROF-004','Mismatch validation','Different new/confirm',['Enter mismatched passwords'],'Inline error shown','&#9989; Client-side validation before API call','','p2','badge-pass','Pass'),
         make_tc_row('PROF-005','Delete account','Double confirm',['Click Delete, type DELETE'],'Account deleted, redirect to login','&#9989; Double confirmation required. DELETE /api/users/me called.','','p2','badge-pass','Pass'),
     ])),
]

for filename, title, icon, subtitle, badge_class, badge_text, component, summary_nums, sections_html in pages:
    content = make_page(filename, title, icon, subtitle, badge_class, badge_text, component, summary_nums, sections_html)
    path = os.path.join(OUT, filename)
    with open(path, 'w', encoding='utf-8') as fp:
        fp.write(content)
    print(f'Created: {filename}')

print(f'Done. {len(pages)} files created.')
