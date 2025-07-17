# Resume Tailor - Wireframes

## User Flow Diagrams

```
[Login Screen] -> [Dashboard] -> [Resume Upload/Edit] -> [Job Analysis] -> [Optimization]
                     |               |                          |              |
                     v               v                          v              v
                [Profile]    [Template Selection]    [AI Analysis Results]  [Export]
```

## Screen Layouts

### 1. Login Screen
```
+------------------+
|   Resume Tailor  |
|                  |
|  Email Input     |
|  [ _________ ]   |
|                  |
|  [Login Button]  |
|                  |
| Magic Link Auth  |
+------------------+
```

### 2. Dashboard
```
+------------------+------------------+
| Resume Tailor    |  Profile  Logout|
+------------------+------------------+
| My Resumes    | Stats & Analytics  |
| [Resume 1]    |   Success Rate     |
| [Resume 2]    |   Applications     |
| [+ New]       |   Optimizations    |
|               |                    |
| Recent Jobs   | Suggestions        |
| - Job 1       | - Improvement 1    |
| - Job 2       | - Improvement 2    |
+---------------+--------------------+
```

### 3. Resume Upload/Edit
```
+----------------------------------+
| Upload Resume                     |
|                                  |
| [Drag & Drop Area]               |
|          or                      |
| [Choose File]                    |
|                                  |
| Supported Formats:               |
| PDF, DOCX                        |
|                                  |
| [Next]                          |
+----------------------------------+
```

### 4. Job Analysis
```
+----------------------------------+
| Job Description Analysis         |
|                                  |
| [Paste Job Description]          |
| ________________________        |
| ________________________        |
|                                  |
| [Start Analysis]                 |
|                                  |
| Results:                         |
| - Key Skills Match               |
| - Missing Keywords               |
| - Suggested Changes              |
+----------------------------------+
```

### 5. Resume Optimization
```
+----------------+------------------+
| Original       | Optimized        |
|               |                   |
| [Resume       | [Resume          |
|  Content]     |  Content]        |
|               |                   |
| Skills:       | Suggested:        |
| - Skill 1     | - New Skill 1    |
| - Skill 2     | - New Skill 2    |
|               |                   |
| [Accept All]  [Review Changes]   |
+----------------+------------------+
```

### 6. Export Options
```
+----------------------------------+
| Export Resume                     |
|                                  |
| Format:                          |
| [PDF] [DOCX] [TXT]              |
|                                  |
| Optimization Score: 95%          |
|                                  |
| [Download] [Share] [Print]       |
+----------------------------------+
```

## Mobile Responsiveness

All screens will adapt to mobile views with:
- Hamburger menu for navigation
- Single column layouts
- Touch-friendly buttons
- Swipe gestures for common actions
- Responsive typography

## Color Scheme
- Primary: #2563EB (Blue)
- Secondary: #059669 (Green)
- Accent: #7C3AED (Purple)
- Background: #F3F4F6 (Light Gray)
- Text: #1F2937 (Dark Gray)

## Typography
- Headings: Inter
- Body: Roboto
- Monospace: JetBrains Mono
