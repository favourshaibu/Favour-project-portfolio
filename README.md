# Responsive Student Portfolio and Academic Management Website

A multi-page personal portfolio and academic planner built for **COS 106: Introduction to Web Technologies** at Miva Open University.

**Live site:** [https://favourshaibu.github.io/Favour-project-portfolio/]
**page repo:** [https://github.com/favourshaibu/Favour-project-portfolio.git]

## About

This website presents Favour Shaibu, a BSc Software Engineering student, and combines a professional portfolio with a practical academic planner. It is built with plain HTML, CSS and JavaScript, with no frameworks or libraries.

## Pages

| Page     | What it contains                                                                          |
| -------- | ----------------------------------------------------------------------------------------- |
| Home     | Hero section with name, photo, welcome message, short biography and navigation            |
| About    | Intro video, education table, career aspirations, technical skills, hobbies and interests |
| Projects | Three project cards with screenshots, descriptions, technology tags and links             |
| Planner  | Interactive task list: add, complete and delete tasks (saved in the browser)              |
| Contact  | Form with JavaScript validation for name, email, phone number and message                 |

## Features

- Fully responsive, mobile-first design with a hamburger menu on small screens
- Layout built with CSS Grid and Flexbox
- Frosted-glass cards, animated background and hover transitions
- Planner tasks saved with `localStorage`, so they survive a page refresh
- Contact form validation: no empty fields, valid email format, digits-only phone number
- Semantic HTML and accessibility features (labels, ARIA attributes, keyboard support)

## Technologies

- HTML5
- CSS3 (variables, Flexbox, Grid, media queries, animations and transitions)
- JavaScript (ES6)
- Git and GitHub, hosted on GitHub Pages

## Project Structure

```
portfolio/
├── index.html
├── about.html
├── projects.html
├── planner.html
├── contact.html
├── style.css
├── main.js
├── README.md
└── media/
    ├─videoes/─ intro.mp4
    └── images/
```

## JavaScript Highlights

- **Navigation:** toggles the mobile menu and updates ARIA state
- **Planner:** array of task objects, with `push`, `map` and `filter` for add, complete and delete, and event delegation on the list
- **Persistence:** `JSON.stringify`, `JSON.parse` and `localStorage`
- **Contact form:** rule-based validation using regular expressions, with live error messages

## Run Locally

1. Clone the repository:
   `git clone [your repository link]`
2. Open the folder in VS Code.
3. Open `index.html` with Live Server, or directly in a browser.

## Documentation

A separate PDF project report with screenshots, JavaScript explanations and code walkthroughs is submitted with this project.

## Author

**Favour Shaibu**
BSc Software Engineering, Miva Open University
[GitHub profile link](https://github.com/favourshaibu)
