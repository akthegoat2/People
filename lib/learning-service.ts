import { createClient } from "@/lib/supabase"

export interface Module {
  id: string
  title: string
  description: string
  emoji: string
  lessons: Lesson[]
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  xpReward: number
  skills: string[]
  projects: string[]
}

export interface Lesson {
  id: string
  title: string
  description: string
  content: string
  codeExample?: string
  challenge?: string
  starterCode?: string
  expectedOutput?: string
  tips?: string
  type: "theory" | "practice" | "project"
  language?: string
  xpReward: number
  estimatedTime: number
}

export interface Quiz {
  id: string
  title: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  questions: QuizQuestion[]
  timeLimit: number
  xpReward: number
  category: string
  type: "multiple-choice" | "coding" | "mixed"
  attempts: number
  completed: boolean
  score?: number
  locked?: boolean
}

export interface QuizQuestion {
  id: string
  type: "multiple-choice" | "coding" | "true-false"
  question: string
  code?: string
  options?: string[]
  correctAnswer: string
  explanation: string
  points: number
}

class LearningService {
  private get supabase() {
    return createClient()
  }

  // Comprehensive quiz data
  private quizzes: Quiz[] = [
    // ── Module 1: Web Fundamentals Quiz ──
    {
      id: "web-fundamentals",
      title: "Web Fundamentals",
      description: "How the web works, HTTP, and development tools",
      difficulty: "Beginner",
      questions: [
        {
          id: "wf1", type: "multiple-choice",
          question: "What does DNS stand for?",
          options: ["Domain Name System", "Digital Network Service", "Data Network Standard", "Dynamic Name Server"],
          correctAnswer: "Domain Name System",
          explanation: "DNS translates human-readable domain names into IP addresses that computers use to identify each other on the network.",
          points: 10,
        },
        {
          id: "wf2", type: "multiple-choice",
          question: "Which HTTP method is used to retrieve data from a server?",
          options: ["POST", "GET", "PUT", "DELETE"],
          correctAnswer: "GET",
          explanation: "The GET method requests data from a specified resource. It should not have side effects.",
          points: 10,
        },
        {
          id: "wf3", type: "multiple-choice",
          question: "What does HTTPS add to regular HTTP?",
          options: ["Faster loading", "Encryption", "More requests", "Larger responses"],
          correctAnswer: "Encryption",
          explanation: "HTTPS uses TLS/SSL encryption to secure communication between the browser and server.",
          points: 10,
        },
        {
          id: "wf4", type: "multiple-choice",
          question: "What is Git primarily used for?",
          options: ["Writing code", "Version control", "Designing websites", "Database management"],
          correctAnswer: "Version control",
          explanation: "Git tracks changes in source code, enabling collaboration and version history management.",
          points: 10,
        },
      ],
      timeLimit: 10, xpReward: 40, category: "web", type: "multiple-choice",
      attempts: 0, completed: false,
    },
    // ── Module 2: HTML5 Quiz ──
    {
      id: "html5-semantic",
      title: "HTML5 & Semantic Markup",
      description: "HTML document structure, semantic elements, and forms",
      difficulty: "Beginner",
      questions: [
        {
          id: "h1", type: "multiple-choice",
          question: "Which HTML element is used to define navigation links?",
          options: ["<navigation>", "<nav>", "<links>", "<menu>"],
          correctAnswer: "<nav>",
          explanation: "The <nav> element represents a section of a page that links to other pages or parts within the page.",
          points: 10,
        },
        {
          id: "h2", type: "multiple-choice",
          question: "Which attribute is used in HTML forms to send data to a server?",
          options: ["method", "action", "submit", "target"],
          correctAnswer: "action",
          explanation: "The action attribute specifies where to send the form data when a form is submitted.",
          points: 10,
        },
        {
          id: "h3", type: "multiple-choice",
          question: "What is the correct HTML for inserting an image?",
          options: ["<img>image.jpg</img>", "<img src='image.jpg' alt='desc'>", "<image src='image.jpg'>", "<img href='image.jpg'>"],
          correctAnswer: "<img src='image.jpg' alt='desc'>",
          explanation: "The <img> tag uses src for the image path and alt for accessibility text.",
          points: 10,
        },
        {
          id: "h4", type: "multiple-choice",
          question: "Which HTML5 element is best for independent, self-contained content?",
          options: ["<section>", "<div>", "<article>", "<span>"],
          correctAnswer: "<article>",
          explanation: "The <article> element represents a self-contained composition that could be distributed independently.",
          points: 10,
        },
      ],
      timeLimit: 10, xpReward: 40, category: "html", type: "multiple-choice",
      attempts: 0, completed: false,
    },
    // ── Module 3: CSS Quiz ──
    {
      id: "css-grid-responsive",
      title: "CSS Grid & Responsive Design",
      description: "CSS Grid, Flexbox, and responsive design principles",
      difficulty: "Beginner",
      questions: [
        {
          id: "c1", type: "multiple-choice",
          question: "Which CSS property defines a grid container?",
          options: ["display: block", "display: grid", "display: flex", "display: inline"],
          correctAnswer: "display: grid",
          explanation: "display: grid creates a grid container, enabling grid layout for its children.",
          points: 10,
        },
        {
          id: "c2", type: "multiple-choice",
          question: "What CSS unit is relative to the viewport width?",
          options: ["em", "rem", "vw", "px"],
          correctAnswer: "vw",
          explanation: "1vw equals 1% of the viewport width, making it ideal for responsive designs.",
          points: 10,
        },
        {
          id: "c3", type: "multiple-choice",
          question: "Which media feature is used for responsive breakpoints?",
          options: ["max-device", "min-width", "screen-size", "responsive"],
          correctAnswer: "min-width",
          explanation: "@media (min-width: 768px) targets viewports at least 768px wide, enabling responsive layouts.",
          points: 10,
        },
        {
          id: "c4", type: "multiple-choice",
          question: "What does 'justify-content: center' do in Flexbox?",
          options: ["Centers items vertically", "Centers items horizontally", "Centers the entire container", "Stretches all items"],
          correctAnswer: "Centers items horizontally",
          explanation: "justify-content aligns items along the main axis (horizontal by default).",
          points: 10,
        },
      ],
      timeLimit: 10, xpReward: 45, category: "css", type: "multiple-choice",
      attempts: 0, completed: false,
    },
    // ── Module 4: JS Fundamentals Quiz ──
    {
      id: "variables-data-types",
      title: "Variables & Data Types",
      description: "Understanding JavaScript variables, strings, numbers, and booleans",
      difficulty: "Beginner",
      questions: [
        {
          id: "1", type: "multiple-choice",
          question: "What is the correct way to declare a variable in JavaScript?",
          options: ["variable myVar = 5;", "let myVar = 5;", "declare myVar = 5;", "var myVar := 5;"],
          correctAnswer: "let myVar = 5;",
          explanation: "The 'let' keyword is the modern way to declare variables in JavaScript. It provides block scope.",
          points: 10,
        },
        {
          id: "2", type: "multiple-choice",
          question: "Which of the following is NOT a JavaScript data type?",
          options: ["string", "boolean", "integer", "undefined"],
          correctAnswer: "integer",
          explanation: "JavaScript doesn't have a separate 'integer' type. All numbers are 'number' type.",
          points: 10,
        },
        {
          id: "3", type: "multiple-choice",
          question: "What will be the output of: typeof null",
          options: ["null", "undefined", "object", "boolean"],
          correctAnswer: "object",
          explanation: "This is a well-known JavaScript quirk. typeof null returns 'object'.",
          points: 10,
        },
        {
          id: "4", type: "coding",
          question: "Complete the code to create a variable that stores your name:",
          code: `// Create a variable called 'myName' and assign your name to it`,
          correctAnswer: "let myName = ",
          explanation: "Use 'let' or 'const' to declare a variable and assign a string value.",
          points: 15,
        },
        {
          id: "5", type: "multiple-choice",
          question: "What is the result of: '5' + 3 in JavaScript?",
          options: ["8", "'53'", "53", "Error"],
          correctAnswer: "'53'",
          explanation: "JavaScript performs string concatenation when one operand is a string.",
          points: 10,
        },
      ],
      timeLimit: 15, xpReward: 50, category: "javascript", type: "mixed",
      attempts: 0, completed: false,
    },
    // ── Module 4 continued: Functions ──
    {
      id: "functions-scope",
      title: "Functions & Scope",
      description: "Master JavaScript functions, parameters, and variable scope",
      difficulty: "Beginner",
      questions: [
        {
          id: "1", type: "multiple-choice",
          question: "What is the correct syntax for a function declaration?",
          options: ["function myFunc() {}", "def myFunc() {}", "func myFunc() {}", "function: myFunc() {}"],
          correctAnswer: "function myFunc() {}",
          explanation: "Function declarations in JavaScript use the 'function' keyword.",
          points: 10,
        },
        {
          id: "2", type: "coding",
          question: "Write a function that adds two numbers:",
          code: `function addNumbers(a, b) {\n  // Your code here\n}`,
          correctAnswer: "return a + b",
          explanation: "Use the return statement to return the sum of the two parameters.",
          points: 15,
        },
        {
          id: "3", type: "multiple-choice",
          question: "What is function scope?",
          options: [
            "Variables declared inside a function are accessible everywhere",
            "Variables declared inside a function are only accessible within that function",
            "Functions cannot access variables",
            "All variables are global",
          ],
          correctAnswer: "Variables declared inside a function are only accessible within that function",
          explanation: "Function scope means variables declared inside a function are only accessible within that function's body.",
          points: 10,
        },
      ],
      timeLimit: 20, xpReward: 60, category: "javascript", type: "mixed",
      attempts: 0, completed: false,
    },
    // ── Module 4 continued: Arrays & Objects ──
    {
      id: "arrays-objects",
      title: "Arrays & Objects",
      description: "Working with JavaScript arrays and objects",
      difficulty: "Intermediate",
      questions: [
        {
          id: "1", type: "multiple-choice",
          question: "How do you create an empty array in JavaScript?",
          options: ["let arr = {};", "let arr = [];", "let arr = new Array;", "Both B and C"],
          correctAnswer: "Both B and C",
          explanation: "You can create an empty array using either [] literal or the Array constructor.",
          points: 10,
        },
        {
          id: "2", type: "coding",
          question: "Access the first element of an array called 'fruits':",
          code: `let fruits = ['apple', 'banana', 'orange'];\n// Write code to get the first element:`,
          correctAnswer: "fruits[0]",
          explanation: "Array indices start at 0, so the first element is accessed with fruits[0].",
          points: 15,
        },
      ],
      timeLimit: 25, xpReward: 75, category: "javascript", type: "coding",
      attempts: 0, completed: false,
    },
    // ── Module 5: DOM Quiz ──
    {
      id: "dom-manipulation",
      title: "DOM Manipulation & Events",
      description: "Working with the DOM, events, and browser APIs",
      difficulty: "Intermediate",
      questions: [
        {
          id: "d1", type: "multiple-choice",
          question: "Which method selects an element by its ID?",
          options: ["getElementByClass()", "getElementById()", "querySelectorAll()", "getElementsByTag()"],
          correctAnswer: "getElementById()",
          explanation: "getElementById() returns the element with the specified ID attribute.",
          points: 10,
        },
        {
          id: "d2", type: "multiple-choice",
          question: "Which method adds an event listener to an element?",
          options: ["element.onClick()", "element.addEventListener()", "element.attachEvent()", "element.listen()"],
          correctAnswer: "element.addEventListener()",
          explanation: "addEventListener() attaches an event handler to an element without overwriting existing handlers.",
          points: 10,
        },
        {
          id: "d3", type: "coding",
          question: "Write code to change the text content of an element with id 'title':",
          code: `// Change the text content of element with id 'title' to 'Hello'`,
          correctAnswer: "getElementById",
          explanation: "Use document.getElementById('title').textContent = 'Hello' to change text.",
          points: 15,
        },
      ],
      timeLimit: 15, xpReward: 55, category: "javascript", type: "mixed",
      attempts: 0, completed: false,
    },
    // ── Module 6: Advanced JS Quiz ──
    {
      id: "es6-modern-js",
      title: "ES6+ & Modern JavaScript",
      description: "Arrow functions, destructuring, spread, and modern JS features",
      difficulty: "Intermediate",
      questions: [
        {
          id: "e1", type: "multiple-choice",
          question: "What is the arrow function equivalent of 'function(a, b) { return a + b; }'?",
          options: ["(a, b) => return a + b", "(a, b) => a + b", "a, b -> a + b", "function(a, b) => a + b"],
          correctAnswer: "(a, b) => a + b",
          explanation: "Arrow functions have implicit return when the body is a single expression without braces.",
          points: 10,
        },
        {
          id: "e2", type: "multiple-choice",
          question: "What does the spread operator (...) do?",
          options: ["Spreads elements of an iterable into individual elements", "Creates a new array", "Merges objects", "All of the above"],
          correctAnswer: "All of the above",
          explanation: "The spread operator can expand arrays, merge objects, and more.",
          points: 10,
        },
        {
          id: "e3", type: "multiple-choice",
          question: "Which syntax correctly destructures an object?",
          options: ["const {name, age} = person", "const [name, age] = person", "const name, age = person", "destructure person as name, age"],
          correctAnswer: "const {name, age} = person",
          explanation: "Object destructuring uses curly braces to extract properties into variables.",
          points: 10,
        },
      ],
      timeLimit: 15, xpReward: 60, category: "javascript", type: "multiple-choice",
      attempts: 0, completed: false,
    },
    // ── Module 6 continued: Async JS ──
    {
      id: "async-javascript",
      title: "Async JavaScript & Promises",
      description: "Promises, async/await, and the Fetch API",
      difficulty: "Intermediate",
      questions: [
        {
          id: "a1", type: "multiple-choice",
          question: "What does a Promise represent in JavaScript?",
          options: ["A synchronous operation", "A future value or error", "A loop iteration", "A function call"],
          correctAnswer: "A future value or error",
          explanation: "A Promise represents a value that may be available now, later, or never.",
          points: 10,
        },
        {
          id: "a2", type: "multiple-choice",
          question: "What keyword is used before an async function?",
          options: ["await", "async", "promise", "defer"],
          correctAnswer: "async",
          explanation: "The async keyword is placed before a function declaration to make it return a Promise.",
          points: 10,
        },
        {
          id: "a3", type: "coding",
          question: "Complete the code to fetch data from an API:",
          code: `// Fetch data from '/api/users' and log the result\nfetch('/api/users')\n  .then(response => ___)\n  .then(data => console.log(data))`,
          correctAnswer: "response.json()",
          explanation: "response.json() parses the response body as JSON and returns a Promise.",
          points: 15,
        },
      ],
      timeLimit: 15, xpReward: 65, category: "javascript", type: "mixed",
      attempts: 0, completed: false,
    },
    // ── Module 7: React Fundamentals Quiz ──
    {
      id: "react-components",
      title: "Components & Props",
      description: "Understanding React components and prop passing",
      difficulty: "Intermediate",
      questions: [
        {
          id: "1", type: "multiple-choice",
          question: "What is a React component?",
          options: ["A JavaScript function that returns HTML", "A reusable piece of UI", "A function that returns JSX", "All of the above"],
          correctAnswer: "All of the above",
          explanation: "React components are JavaScript functions that return JSX, creating reusable pieces of UI.",
          points: 10,
        },
        {
          id: "2", type: "coding",
          question: "Create a simple React component that displays 'Hello World':",
          code: `function HelloWorld() {\n  // Your code here\n}`,
          correctAnswer: "return <h1>Hello World</h1>",
          explanation: "React components return JSX elements.",
          points: 15,
        },
      ],
      timeLimit: 15, xpReward: 65, category: "react", type: "mixed",
      attempts: 0, completed: false,
    },
    // ── Module 8: React Hooks Quiz ──
    {
      id: "react-state-hooks",
      title: "State & Hooks",
      description: "Master useState, useEffect, and other React hooks",
      difficulty: "Intermediate",
      questions: [
        {
          id: "1", type: "multiple-choice",
          question: "What hook is used to manage state in functional components?",
          options: ["useEffect", "useState", "useContext", "useReducer"],
          correctAnswer: "useState",
          explanation: "useState is the primary hook for managing state in React functional components.",
          points: 10,
        },
        {
          id: "2", type: "multiple-choice",
          question: "When does useEffect run by default?",
          options: ["Only on mount", "After every render", "Only on unmount", "Never"],
          correctAnswer: "After every render",
          explanation: "By default, useEffect runs after every render, including the first one.",
          points: 10,
        },
        {
          id: "3", type: "multiple-choice",
          question: "What is the purpose of the dependency array in useEffect?",
          options: ["To make the effect faster", "To control when the effect re-runs", "To store values", "To create variables"],
          correctAnswer: "To control when the effect re-runs",
          explanation: "The dependency array tells React to only re-run the effect when those values change.",
          points: 10,
        },
      ],
      timeLimit: 20, xpReward: 80, category: "react", type: "mixed",
      attempts: 0, completed: false, locked: true,
    },
    // ── Module 9: Node.js Quiz ──
    {
      id: "nodejs-fundamentals",
      title: "Node.js Fundamentals",
      description: "Node.js runtime, modules, and NPM",
      difficulty: "Intermediate",
      questions: [
        {
          id: "n1", type: "multiple-choice",
          question: "What is Node.js?",
          options: [
            "A frontend framework",
            "A JavaScript runtime built on Chrome's V8 engine",
            "A CSS preprocessor",
            "A database management system",
          ],
          correctAnswer: "A JavaScript runtime built on Chrome's V8 engine",
          explanation: "Node.js allows JavaScript to run on the server-side using the V8 engine.",
          points: 10,
        },
        {
          id: "n2", type: "multiple-choice",
          question: "Which command initializes a new Node.js project?",
          options: ["npm start", "npm init", "npm new", "npm create"],
          correctAnswer: "npm init",
          explanation: "npm init creates a package.json file for your project.",
          points: 10,
        },
        {
          id: "n3", type: "multiple-choice",
          question: "What is the Node.js module system called?",
          options: ["ES Modules", "CommonJS", "AMD", "UMD"],
          correctAnswer: "CommonJS",
          explanation: "Node.js uses the CommonJS module system with require() and module.exports.",
          points: 10,
        },
      ],
      timeLimit: 15, xpReward: 60, category: "node", type: "multiple-choice",
      attempts: 0, completed: false,
    },
    // ── Module 9 continued: Express Quiz ──
    {
      id: "express-rest-apis",
      title: "Express.js & REST APIs",
      description: "Building RESTful APIs with Express.js",
      difficulty: "Intermediate",
      questions: [
        {
          id: "x1", type: "multiple-choice",
          question: "Which method creates a route that listens for GET requests?",
          options: ["app.post()", "app.get()", "app.send()", "app.route()"],
          correctAnswer: "app.get()",
          explanation: "app.get() defines a route handler for HTTP GET requests.",
          points: 10,
        },
        {
          id: "x2", type: "multiple-choice",
          question: "What is middleware in Express?",
          options: ["A database connector", "Functions that execute during the request-response cycle", "A templating engine", "A routing library"],
          correctAnswer: "Functions that execute during the request-response cycle",
          explanation: "Middleware functions have access to the request object, response object, and the next() function.",
          points: 10,
        },
        {
          id: "x3", type: "coding",
          question: "Complete the Express route that returns a JSON response:",
          code: `app.get('/api/users', (req, res) => {\n  // Return JSON with users array\n})`,
          correctAnswer: "res.json",
          explanation: "res.json() sends a JSON response with the correct Content-Type header.",
          points: 15,
        },
      ],
      timeLimit: 15, xpReward: 65, category: "node", type: "mixed",
      attempts: 0, completed: false,
    },
    // ── Module 10: SQL & Databases Quiz ──
    {
      id: "sql-databases",
      title: "SQL & Database Design",
      description: "SQL queries, database design, and relationships",
      difficulty: "Advanced",
      questions: [
        {
          id: "s1", type: "multiple-choice",
          question: "Which SQL statement is used to retrieve data?",
          options: ["GET", "SELECT", "FETCH", "RETRIEVE"],
          correctAnswer: "SELECT",
          explanation: "SELECT is used to query data from a database table.",
          points: 10,
        },
        {
          id: "s2", type: "multiple-choice",
          question: "What is a foreign key?",
          options: ["A key that encrypts data", "A field that references a primary key in another table", "The main identifier of a table", "An index for faster queries"],
          correctAnswer: "A field that references a primary key in another table",
          explanation: "Foreign keys create relationships between tables and enforce referential integrity.",
          points: 10,
        },
        {
          id: "s3", type: "multiple-choice",
          question: "Which SQL clause filters records?",
          options: ["WHERE", "FILTER", "HAVING", "Both WHERE and HAVING"],
          correctAnswer: "Both WHERE and HAVING",
          explanation: "WHERE filters rows before grouping, HAVING filters after GROUP BY.",
          points: 10,
        },
      ],
      timeLimit: 15, xpReward: 70, category: "database", type: "multiple-choice",
      attempts: 0, completed: false,
    },
    // ── Module 11: Full Stack Integration Quiz ──
    {
      id: "fullstack-integration",
      title: "Full Stack Integration",
      description: "Connecting frontend to backend, auth, and deployment",
      difficulty: "Advanced",
      questions: [
        {
          id: "f1", type: "multiple-choice",
          question: "What is CORS?",
          options: [
            "A security feature that controls cross-origin requests",
            "A CSS framework",
            "A database type",
            "A JavaScript library",
          ],
          correctAnswer: "A security feature that controls cross-origin requests",
          explanation: "Cross-Origin Resource Sharing allows servers to specify which origins can access their resources.",
          points: 10,
        },
        {
          id: "f2", type: "multiple-choice",
          question: "What is JWT used for?",
          options: ["Styling web pages", "Authentication and authorization", "Database queries", "File compression"],
          correctAnswer: "Authentication and authorization",
          explanation: "JSON Web Tokens are used to securely transmit information between parties for authentication.",
          points: 10,
        },
        {
          id: "f3", type: "multiple-choice",
          question: "Which environment variable convention is commonly used in Node.js?",
          options: ["process.env", "process.vars", "global.env", "system.env"],
          correctAnswer: "process.env",
          explanation: "process.env contains the user environment variables in Node.js.",
          points: 10,
        },
      ],
      timeLimit: 15, xpReward: 75, category: "fullstack", type: "multiple-choice",
      attempts: 0, completed: false,
    },
    // ── Module 12: Final Assessment ──
    {
      id: "final-fullstack-assessment",
      title: "Final Full Stack Assessment",
      description: "Comprehensive assessment covering the entire bootcamp curriculum",
      difficulty: "Advanced",
      questions: [
        {
          id: "fa1", type: "multiple-choice",
          question: "What is the correct order of the full stack request-response cycle?",
          options: [
            "Browser → Express → Database → Express → React → Browser",
            "Browser → React → Express → Database → Express → Browser",
            "Browser → Database → Express → React → Browser",
            "Express → Browser → React → Database → Express",
          ],
          correctAnswer: "Browser → React → Express → Database → Express → Browser",
          explanation: "The browser sends a request to React, which calls Express, which queries the database, sends the response back through Express, and React renders it.",
          points: 10,
        },
        {
          id: "fa2", type: "multiple-choice",
          question: "Which of the following is NOT a React hook?",
          options: ["useState", "useEffect", "useComponent", "useContext"],
          correctAnswer: "useComponent",
          explanation: "useComponent is not a built-in React hook. useState, useEffect, and useContext are all built-in hooks.",
          points: 10,
        },
        {
          id: "fa3", type: "multiple-choice",
          question: "What is the purpose of a database migration?",
          options: ["Moving data between servers", "Version-controlling database schema changes", "Backing up data", "Optimizing queries"],
          correctAnswer: "Version-controlling database schema changes",
          explanation: "Migrations allow teams to track and apply schema changes systematically across environments.",
          points: 10,
        },
        {
          id: "fa4", type: "multiple-choice",
          question: "What does CI/CD stand for?",
          options: ["Continuous Integration / Continuous Deployment", "Code Integration / Code Deployment", "Continuous Improvement / Continuous Delivery", "Code Inspection / Code Development"],
          correctAnswer: "Continuous Integration / Continuous Deployment",
          explanation: "CI/CD automates building, testing, and deploying applications.",
          points: 10,
        },
      ],
      timeLimit: 20, xpReward: 100, category: "fullstack", type: "multiple-choice",
      attempts: 0, completed: false,
    },
  ]

  // Module data (12 modules, 52 lessons, 32-week curriculum)
  private modules: Module[] = [
    // ── MODULE 1: Web Development Fundamentals (Week 1-2) ──
    {
      id: "web-fundamentals",
      title: "Web Development Fundamentals",
      description: "Introduction to web development, how the internet works, and development environment setup",
      emoji: "🌐",
      difficulty: "Beginner",
      duration: "2 weeks",
      xpReward: 450,
      skills: ["Web Fundamentals", "Developer Tools", "Version Control", "HTTP/HTTPS"],
      projects: ["Personal Portfolio Setup", "Git Repository Creation"],
      lessons: [
        {
          id: "wf1",
          title: "How the Web Works",
          description: "Understanding the fundamentals of web communication",
          content: `The World Wide Web is a system of interconnected documents and resources, linked by hyperlinks and URLs. When you type a website address into your browser, a complex process begins:

1. **DNS Resolution**: Your browser contacts a DNS server to translate the domain name into an IP address
2. **HTTP Request**: Your browser sends an HTTP request to the server at that IP address
3. **Server Processing**: The server processes your request and prepares a response
4. **HTTP Response**: The server sends back HTML, CSS, JavaScript, and other resources
5. **Rendering**: Your browser interprets and displays the content

This process happens millions of times per second across the internet, enabling the seamless web experience we're familiar with.`,
          codeExample: `// Example of a simple HTTP request in JavaScript
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`,
          type: "theory", xpReward: 25, estimatedTime: 30,
          tips: "Think of the web like a postal system - browsers are like mailboxes, servers are like post offices, and HTTP is the postal service!",
        },
        {
          id: "wf2",
          title: "Setting Up Your Development Environment",
          description: "Installing and configuring essential development tools",
          content: `A proper development environment is crucial for efficient coding. Let's set up the essential tools:

**Visual Studio Code**: A powerful, free code editor with excellent extensions
**Git**: Version control system for tracking changes in your code
**Node.js**: JavaScript runtime for running JavaScript outside the browser
**Browser Developer Tools**: Built-in debugging and inspection tools

Setting up these tools properly will save you countless hours and make your development process much smoother.`,
          challenge: "Set up VS Code with essential extensions and create your first HTML file",
          starterCode: `<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>My First Web Page</title>\n</head>\n<body>\n    <!-- Add your content here -->\n</body>\n</html>`,
          expectedOutput: 'A basic HTML page displaying "Hello, World!"',
          type: "practice", xpReward: 35, estimatedTime: 45,
          tips: "Extensions like Live Server, Prettier, and GitLens will make your coding experience much better!",
        },
        {
          id: "wf3",
          title: "Understanding HTTP and HTTPS",
          description: "Learn about web protocols and security",
          content: `HTTP (HyperText Transfer Protocol) and HTTPS (HTTP Secure) are the foundation of web communication.

**HTTP Methods:**
- GET: Retrieve data from server
- POST: Send data to server
- PUT: Update existing data
- DELETE: Remove data

**Status Codes:**
- 200: Success
- 404: Not Found
- 500: Server Error

**HTTPS** adds encryption for secure communication.`,
          codeExample: `// Different HTTP methods with fetch\nfetch('/api/users')\n  .then(response => response.json())\n\nfetch('/api/users', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ name: 'John' })\n})`,
          type: "theory", xpReward: 30, estimatedTime: 40,
          tips: "Always use HTTPS in production for security!",
        },
        {
          id: "wf4",
          title: "Version Control with Git",
          description: "Learn Git fundamentals for tracking code changes",
          content: `Git is the industry-standard version control system. It tracks changes in your code and enables collaboration.

**Key Concepts:**
- **Repository**: A project folder tracked by Git
- **Commit**: A snapshot of your changes
- **Branch**: An independent line of development
- **Merge**: Combining changes from different branches

**Basic Workflow:**
1. git init — Initialize a new repository
2. git add — Stage changes
3. git commit — Save staged changes
4. git push — Upload to remote repository`,
          challenge: "Initialize a Git repository, make your first commit, and push to GitHub",
          type: "practice", xpReward: 40, estimatedTime: 50,
          tips: "Write clear commit messages that explain WHY you made the change, not just WHAT changed.",
        },
      ],
    },
    // ── MODULE 2: HTML5 Mastery (Week 2-3) ──
    {
      id: "html-fundamentals",
      title: "HTML5 Mastery",
      description: "Complete HTML5 structure, semantic elements, forms, and accessibility best practices",
      emoji: "📄",
      difficulty: "Beginner",
      duration: "2 weeks",
      xpReward: 520,
      skills: ["HTML5", "Semantic Markup", "Web Accessibility", "SEO", "Forms"],
      projects: ["Resume Website", "Contact Form", "Blog Layout"],
      lessons: [
        {
          id: "h1",
          title: "HTML Document Structure",
          description: "Understanding the basic structure of HTML documents",
          content: `Every HTML document follows a standard structure that browsers can understand and process:

**DOCTYPE Declaration**: Tells the browser which version of HTML to use
**HTML Element**: The root element that contains all other elements
**Head Section**: Contains metadata about the document
**Body Section**: Contains the visible content of the page

Understanding this structure is fundamental to creating well-formed web pages.`,
          codeExample: `<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Document Title</title>\n</head>\n<body>\n    <header>\n        <h1>Welcome to My Website</h1>\n    </header>\n    <main>\n        <p>This is the main content area.</p>\n    </main>\n    <footer>\n        <p>&copy; 2024 My Website</p>\n    </footer>\n</body>\n</html>`,
          language: "html",
          type: "theory", xpReward: 25, estimatedTime: 30,
          tips: "Always include the lang attribute in your HTML element for better accessibility!",
        },
        {
          id: "h2",
          title: "Semantic HTML Elements",
          description: "Using meaningful HTML elements for better structure and accessibility",
          content: `Semantic HTML elements provide meaning to your content, making it more accessible and SEO-friendly.

**Key Semantic Elements:**
- <header>: Page or section header
- <nav>: Navigation links
- <main>: Main content area
- <article>: Independent content
- <section>: Thematic grouping
- <aside>: Sidebar content
- <footer>: Page or section footer

These elements help screen readers and search engines understand your content structure.`,
          challenge: "Create a semantic HTML structure for a blog post",
          starterCode: `<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <title>My Blog Post</title>\n</head>\n<body>\n    <!-- Create a semantic structure -->\n</body>\n</html>`,
          expectedOutput: "A properly structured HTML document using semantic elements",
          type: "practice", xpReward: 35, estimatedTime: 45,
          tips: "Think about the meaning of your content, not just how it looks!",
        },
        {
          id: "h3",
          title: "HTML Forms & Input Validation",
          description: "Building interactive forms with validation",
          content: `Forms are the primary way users interact with web applications. HTML5 provides built-in validation.

**Form Elements:**
- <input type="text | email | password | number | date">
- <textarea>: Multi-line text input
- <select> + <option>: Dropdown menus
- <button>: Submit or reset the form

**HTML5 Validation Attributes:**
- required: Field must be filled
- minlength / maxlength: Character limits
- pattern: Regex pattern matching
- type="email": Automatic email validation`,
          challenge: "Build a registration form with name, email, password, and date of birth",
          starterCode: `<!DOCTYPE html>\n<html>\n<body>\n    <form>\n        <!-- Build your form here -->\n    </form>\n</body>\n</html>`,
          expectedOutput: "A fully functional form with HTML5 validation",
          type: "practice", xpReward: 40, estimatedTime: 50,
          tips: "Always provide clear error messages near the input field, not just at the top of the form.",
        },
        {
          id: "h4",
          title: "Multimedia & Embedding Content",
          description: "Working with images, video, audio, and iframes",
          content: `Modern HTML5 supports rich multimedia without plugins.

**Images**: Use <img> with src and alt attributes for accessibility
**Video**: The <video> element supports multiple formats with <source> fallbacks
**Audio**: The <audio> element works similarly to video
**Iframes**: Embed external content like maps or other pages

Always provide fallback content and consider performance with responsive images.`,
          codeExample: `<video controls width="640">\n  <source src="video.mp4" type="video/mp4">\n  <source src="video.webm" type="video/webm">\n  Your browser does not support video.\n</video>`,
          language: "html",
          type: "theory", xpReward: 30, estimatedTime: 35,
          tips: "Use srcset on images to serve different sizes for different screen resolutions.",
        },
      ],
    },
    // ── MODULE 3: CSS3 & Responsive Design (Week 4-5) ──
    {
      id: "css-responsive",
      title: "CSS3 & Responsive Design",
      description: "CSS styling, Flexbox, Grid, and building responsive layouts",
      emoji: "🎨",
      difficulty: "Beginner",
      duration: "2 weeks",
      xpReward: 550,
      skills: ["CSS3", "Flexbox", "CSS Grid", "Responsive Design", "Media Queries"],
      projects: ["Responsive Portfolio", "Landing Page Clone"],
      lessons: [
        {
          id: "c1",
          title: "CSS Selectors & Box Model",
          description: "Understanding CSS selectors and the box model",
          content: `CSS (Cascading Style Sheets) controls the visual presentation of HTML elements.

**Selectors:**
- Element: div { }
- Class: .my-class { }
- ID: #my-id { }
- Attribute: [type="text"] { }
- Pseudo-class: :hover, :focus, :nth-child()

**Box Model:**
Every element is a rectangular box with:
- **Content**: The actual content
- **Padding**: Space between content and border
- **Border**: The edge of the element
- **Margin**: Space outside the border`,
          codeExample: `.card {\n  width: 300px;\n  padding: 20px;\n  border: 1px solid #ccc;\n  margin: 10px;\n  border-radius: 8px;\n  box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n}`,
          type: "theory", xpReward: 30, estimatedTime: 35,
          tips: "Use box-sizing: border-box to include padding and border in the element's total width.",
        },
        {
          id: "c2",
          title: "Flexbox Layout",
          description: "Building flexible one-dimensional layouts with Flexbox",
          content: `Flexbox is a one-dimensional layout system that distributes space along a single axis.

**Container Properties:**
- display: flex — Creates a flex container
- flex-direction: row | column — Main axis direction
- justify-content: center | space-between | space-around — Main axis alignment
- align-items: center | stretch | flex-start — Cross axis alignment

**Item Properties:**
- flex: 1 — Grow factor
- align-self — Override alignment for individual items`,
          codeExample: `.container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 16px;\n}\n\n.item {\n  flex: 1;\n  padding: 20px;\n  background: #f0f0f0;\n}`,
          challenge: "Build a responsive navigation bar using Flexbox",
          type: "practice", xpReward: 40, estimatedTime: 50,
          tips: "Use gap instead of margin on flex items for simpler spacing.",
        },
        {
          id: "c3",
          title: "CSS Grid Layout",
          description: "Creating two-dimensional layouts with CSS Grid",
          content: `CSS Grid creates two-dimensional layouts with rows and columns simultaneously.

**Grid Properties:**
- display: grid — Creates a grid container
- grid-template-columns: repeat(3, 1fr) — Three equal columns
- grid-template-rows: auto — Row sizes
- gap: 20px — Spacing between cells

**Placement:**
- grid-column: span 2 — Span across two columns
- grid-row: 1 / 3 — From row 1 to row 3`,
          codeExample: `.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\n  gap: 24px;\n  padding: 20px;\n}`,
          challenge: "Create a responsive card grid that shows 1 column on mobile, 2 on tablet, 3 on desktop",
          expectedOutput: "A grid of cards that adapts to screen width",
          type: "practice", xpReward: 40, estimatedTime: 50,
          tips: "Use minmax() with auto-fill or auto-fit for truly responsive grids without media queries.",
        },
        {
          id: "c4",
          title: "Responsive Design & Media Queries",
          description: "Building websites that work on any device",
          content: `Responsive design ensures your website looks great on all screen sizes.

**Key Principles:**
1. **Fluid Grids**: Use relative units (%, fr, vw) instead of fixed pixels
2. **Flexible Images**: max-width: 100% ensures images scale down
3. **Media Queries**: Apply styles based on viewport conditions

**Breakpoint Strategy:**
- Mobile: < 768px (default)
- Tablet: 768px - 1024px
- Desktop: > 1024px`,
          codeExample: `/* Mobile first approach */\n.container {\n  grid-template-columns: 1fr;\n}\n\n@media (min-width: 768px) {\n  .container {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n\n@media (min-width: 1024px) {\n  .container {\n    grid-template-columns: repeat(3, 1fr);\n  }\n}`,
          challenge: "Make a multi-section landing page fully responsive",
          type: "practice", xpReward: 45, estimatedTime: 55,
          tips: "Always design mobile-first — it's easier to add complexity than to simplify.",
        },
      ],
    },
    // ── MODULE 4: JavaScript Fundamentals (Week 6-8) ──
    {
      id: "javascript-fundamentals",
      title: "JavaScript Fundamentals",
      description: "Core JavaScript concepts: variables, data types, functions, arrays, objects, and control flow",
      emoji: "📜",
      difficulty: "Beginner",
      duration: "3 weeks",
      xpReward: 600,
      skills: ["JavaScript", "Variables & Types", "Functions", "Arrays & Objects", "Control Flow"],
      projects: ["Interactive Calculator", "Todo List App"],
      lessons: [
        {
          id: "j1",
          title: "Variables, Data Types & Operators",
          description: "Understanding JavaScript variables, primitives, and operators",
          content: `JavaScript is a dynamically-typed language with several primitive data types.

**Declaring Variables:**
- **let**: Mutable, block-scoped variable
- **const**: Immutable reference, block-scoped
- **var**: Function-scoped (avoid in modern JS)

**Primitive Types:** string, number, boolean, null, undefined, symbol, bigint

**Operators:**
- Arithmetic: +, -, *, /, %, **
- Comparison: ===, !==, >, <, >=, <=
- Logical: &&, ||, !
- Assignment: =, +=, -=`,
          codeExample: `let name = "Alice";\nconst age = 25;\nlet isStudent = true;\n\n// Template literals\nconsole.log(\`Hello, \${name}! You are \${age} years old.\`);\n\n// Type coercion\nconsole.log("5" + 3); // "53"\nconsole.log("5" - 3); // 2`,
          type: "theory", xpReward: 30, estimatedTime: 40,
          tips: "Prefer const by default, use let only when you need to reassign.",
        },
        {
          id: "j2",
          title: "Control Flow & Functions",
          description: "Conditionals, loops, and writing reusable functions",
          content: `Control flow determines the order in which code executes.

**Conditionals:**
- if / else if / else
- switch statement
- Ternary operator: condition ? trueValue : falseValue

**Loops:**
- for — Classic loop with counter
- while — Loop while condition is true
- for...of — Iterate over iterables
- for...in — Iterate over object keys

**Functions:**
- Function declaration vs expression
- Parameters and arguments
- Return values
- Arrow functions`,
          codeExample: `// Function declaration\nfunction greet(name) {\n  return \`Hello, \${name}!\`;\n}\n\n// Arrow function\nconst double = (x) => x * 2;\n\n// Conditional logic\nfunction getGrade(score) {\n  if (score >= 90) return 'A';\n  if (score >= 80) return 'B';\n  if (score >= 70) return 'C';\n  return 'D';\n}`,
          challenge: "Write a function that checks if a number is prime",
          type: "practice", xpReward: 40, estimatedTime: 50,
          tips: "Use early returns to avoid deep nesting and make code more readable.",
        },
        {
          id: "j3",
          title: "Arrays, Objects & Loops",
          description: "Working with collections of data",
          content: `Arrays and objects are the fundamental data structures in JavaScript.

**Array Methods:**
- push/pop — Add/remove from end
- map — Transform each element
- filter — Keep matching elements
- reduce — Aggregate values
- find — Find first match
- forEach — Execute for each element

**Objects:**
- Key-value pairs
- Dot vs bracket notation
- Object methods
- Spread operator for copying`,
          codeExample: `const students = [\n  { name: 'Alice', grade: 85 },\n  { name: 'Bob', grade: 92 },\n  { name: 'Charlie', grade: 78 }\n];\n\nconst topStudents = students\n  .filter(s => s.grade >= 80)\n  .map(s => s.name);\n\nconst average = students.reduce(\n  (sum, s) => sum + s.grade, 0\n) / students.length;`,
          challenge: "Create a function that groups an array of objects by a property",
          type: "practice", xpReward: 40, estimatedTime: 45,
          tips: "Learn array methods — they're more expressive and less error-prone than for loops.",
        },
        {
          id: "j4",
          title: "Error Handling & Debugging",
          description: "Handling errors gracefully and debugging effectively",
          content: `Robust code handles errors gracefully and uses proper debugging techniques.

**Error Handling:**
- try/catch/finally blocks
- throw statement
- Custom error types
- Error object properties

**Debugging Tools:**
- console.log, console.table, console.group
- Browser DevTools breakpoints
- Debugger statement
- Source maps for transpiled code`,
          codeExample: `function safeDivide(a, b) {\n  try {\n    if (b === 0) throw new Error('Division by zero');\n    return a / b;\n  } catch (error) {\n    console.error('Error:', error.message);\n    return null;\n  } finally {\n    console.log('Division attempted');\n  }\n}`,
          type: "practice", xpReward: 35, estimatedTime: 40,
          tips: "Don't just catch errors — log them with enough context to debug later.",
        },
      ],
    },
    // ── MODULE 5: DOM Manipulation & Events (Week 9-10) ──
    {
      id: "dom-manipulation",
      title: "DOM Manipulation & Events",
      description: "Interacting with the browser DOM, handling events, and using browser APIs",
      emoji: "🖱️",
      difficulty: "Intermediate",
      duration: "2 weeks",
      xpReward: 520,
      skills: ["DOM API", "Event Handling", "Forms", "Local Storage", "Browser APIs"],
      projects: ["Interactive To-Do App", "Browser-Based Game"],
      lessons: [
        {
          id: "d1",
          title: "Selecting & Traversing the DOM",
          description: "Finding and navigating HTML elements with JavaScript",
          content: `The DOM (Document Object Model) represents your HTML as a tree of objects.

**Selecting Elements:**
- document.getElementById('id')
- document.querySelector('.class')
- document.querySelectorAll('div span')
- element.closest('.parent')

**Traversing:**
- element.parentElement
- element.children
- element.nextElementSibling
- element.previousElementSibling

**Manipulating:**
- element.textContent — Text only
- element.innerHTML — HTML content
- element.classList.add/remove/toggle
- element.style.property — Inline styles`,
          codeExample: `// Create and append elements\nconst ul = document.querySelector('ul');\nconst li = document.createElement('li');\nli.textContent = 'New item';\nli.classList.add('highlight');\nul.appendChild(li);\n\n// Remove element\nli.remove();`,
          challenge: "Build a dynamic list where users can add and remove items",
          type: "practice", xpReward: 35, estimatedTime: 45,
          tips: "Use textContent instead of innerHTML when inserting text to prevent XSS vulnerabilities.",
        },
        {
          id: "d2",
          title: "Events & Event Handling",
          description: "Responding to user interactions with events",
          content: `Events are actions that occur in the browser that you can respond to.

**Common Events:**
- click, dblclick — Mouse clicks
- submit — Form submission
- keydown, keyup — Keyboard input
- mouseenter, mouseleave — Hover
- scroll, resize — Window events
- DOMContentLoaded — Page loaded

**Event Handling:**
- addEventListener(type, handler)
- Event object properties
- Event bubbling vs capturing
- preventDefault() and stopPropagation()`,
          codeExample: `document.querySelector('button')\n  .addEventListener('click', (e) => {\n    console.log('Button clicked!', e.target);\n  });\n\n// Event delegation\nul.addEventListener('click', (e) => {\n  if (e.target.tagName === 'LI') {\n    e.target.classList.toggle('done');\n  }\n});`,
          challenge: "Create a keyboard-controlled game character that moves around the screen",
          type: "practice", xpReward: 40, estimatedTime: 50,
          tips: "Use event delegation for better performance when handling events on many similar elements.",
        },
        {
          id: "d3",
          title: "Forms & Client-Side Validation",
          description: "Handling form input and validating data in the browser",
          content: `Client-side validation provides instant feedback before data reaches the server.

**Form Handling:**
- FormData API for collecting values
- input and change events
- Controlled form components

**Validation Techniques:**
- HTML5 validation attributes (required, pattern)
- Custom JavaScript validation
- Real-time validation with input events
- Displaying error messages dynamically`,
          codeExample: `const form = document.querySelector('form');\nform.addEventListener('submit', (e) => {\n  e.preventDefault();\n  const data = new FormData(form);\n  const email = data.get('email');\n  \n  if (!email.includes('@')) {\n    showError('Please enter a valid email');\n    return;\n  }\n  \n  console.log('Form submitted:', Object.fromEntries(data));\n});`,
          challenge: "Build a registration form with real-time validation feedback",
          type: "practice", xpReward: 40, estimatedTime: 45,
          tips: "Always validate on both client AND server — client validation is for UX, server for security.",
        },
        {
          id: "d4",
          title: "Browser APIs & Local Storage",
          description: "Using built-in browser APIs for storage, geolocation, and more",
          content: `Modern browsers provide powerful APIs for building rich applications.

**Web Storage API:**
- localStorage — Persistent storage across sessions
- sessionStorage — Data cleared when tab closes
- JSON.stringify / JSON.parse for objects

**Other Browser APIs:**
- Geolocation API — User's location
- Notification API — System notifications
- Canvas API — Drawing graphics
- History API — Browser navigation`,
          codeExample: `// Save to localStorage\nlocalStorage.setItem('theme', 'dark');\nconst theme = localStorage.getItem('theme');\n\n// Store objects\nconst user = { name: 'Alice', score: 100 };\nlocalStorage.setItem('user', JSON.stringify(user));\nconst saved = JSON.parse(localStorage.getItem('user'));`,
          challenge: "Build a note-taking app that saves notes to localStorage and displays them on reload",
          type: "practice", xpReward: 45, estimatedTime: 50,
          tips: "Always wrap localStorage calls in try/catch — users can disable storage or be in private mode.",
        },
      ],
    },
    // ── MODULE 6: Advanced JavaScript (Week 11-13) ──
    {
      id: "advanced-javascript",
      title: "Advanced JavaScript",
      description: "ES6+ features, asynchronous programming, fetch API, and modern JavaScript patterns",
      emoji: "⚡",
      difficulty: "Intermediate",
      duration: "3 weeks",
      xpReward: 650,
      skills: ["ES6+", "Async/Await", "Promises", "Fetch API", "Modules"],
      projects: ["Weather App", "Async Data Dashboard"],
      lessons: [
        {
          id: "a1",
          title: "ES6+ Features",
          description: "Modern JavaScript syntax and features",
          content: `ES6 (ES2015) and later versions introduced many features that make JavaScript more powerful and expressive.

**Key Features:**
- **Arrow Functions**: Shorter syntax, lexical this
- **Destructuring**: Extract values from objects/arrays
- **Spread/Rest**: ... operator
- **Template Literals**: String interpolation with backticks
- **Let/Const**: Block-scoped variables
- **Default Parameters**: Function parameter defaults
- **Optional Chaining**: ?. safe property access
- **Nullish Coalescing**: ?? operator`,
          codeExample: `// Destructuring\nconst { name, age, ...rest } = person;\nconst [first, ...others] = array;\n\n// Optional chaining\nconst city = user?.address?.city ?? 'Unknown';\n\n// Default parameters\nfunction greet(name = 'Guest') {\n  return \`Hello, \${name}!\`;\n}`,
          type: "theory", xpReward: 35, estimatedTime: 45,
          tips: "Optional chaining (?.) and nullish coalescing (??) are your best friends for safe data access.",
        },
        {
          id: "a2",
          title: "Promises & Async/Await",
          description: "Handling asynchronous operations cleanly",
          content: `Asynchronous programming is essential for modern web development.

**Promises:**
A Promise represents a value that may not be available yet.
- Pending → Fulfilled or Rejected
- .then() for success
- .catch() for errors
- .finally() always runs

**Async/Await:**
Syntactic sugar over Promises that reads like synchronous code.
- async function always returns a Promise
- await pauses execution until Promise resolves
- try/catch for error handling`,
          codeExample: `// Promise chain\nfetchUser(1)\n  .then(user => fetchPosts(user.id))\n  .then(posts => console.log(posts))\n  .catch(err => console.error(err));\n\n// Async/await (cleaner)\nasync function loadUserPosts(userId) {\n  try {\n    const user = await fetchUser(userId);\n    const posts = await fetchPosts(user.id);\n    return posts;\n  } catch (error) {\n    console.error('Failed to load:', error);\n  }\n}`,
          challenge: "Rewrite a callback-based function to use async/await instead",
          type: "practice", xpReward: 45, estimatedTime: 55,
          tips: "Use Promise.all() to run multiple independent async operations in parallel.",
        },
        {
          id: "a3",
          title: "Fetch API & HTTP Requests",
          description: "Making HTTP requests from the browser",
          content: `The Fetch API provides a modern interface for making HTTP requests.

**Basic Fetch:**
- GET requests for retrieving data
- POST requests for creating data
- PUT/PATCH for updating
- DELETE for removing

**Working with Responses:**
- response.json() — Parse JSON body
- response.text() — Parse as text
- response.status — HTTP status code
- response.headers — Response headers

**Error Handling:**
Fetch only rejects on network errors, not HTTP errors (like 404).`,
          codeExample: `async function apiRequest(url, options = {}) {\n  try {\n    const response = await fetch(url, {\n      headers: { 'Content-Type': 'application/json' },\n      ...options\n    });\n    if (!response.ok) throw new Error(\`HTTP \${response.status}\`);\n    return await response.json();\n  } catch (error) {\n    console.error('API Error:', error);\n    throw error;\n  }\n}\n\n// Usage\nconst users = await apiRequest('/api/users');`,
          challenge: "Build a GitHub user search app using the GitHub API",
          type: "practice", xpReward: 40, estimatedTime: 50,
          tips: "Always check response.ok before parsing — fetch doesn't throw on 404 or 500.",
        },
        {
          id: "a4",
          title: "Modules & Modern JS Patterns",
          description: "Organizing code with modules and modern patterns",
          content: `Modules help organize JavaScript code into reusable, maintainable pieces.

**ES Modules (import/export):**
- Named exports: export function foo() {}
- Default export: export default class Bar {}
- Import: import { foo } from './module.js'

**Module Patterns:**
- Single Responsibility: Each module does one thing
- Revealing Module: Expose only what's needed
- Composition over inheritance
- Factory functions for object creation`,
          codeExample: `// math.js\nexport function add(a, b) { return a + b; }\nexport function multiply(a, b) { return a * b; }\n\n// app.js\nimport { add, multiply } from './math.js';\n\n// Dynamic imports\nconst module = await import('./math.js');\nconsole.log(module.add(2, 3));`,
          type: "practice", xpReward: 35, estimatedTime: 40,
          tips: "Keep modules small and focused on a single concern for better reusability.",
        },
      ],
    },
    // ── MODULE 7: React Fundamentals (Week 14-16) ──
    {
      id: "react-fundamentals",
      title: "React Fundamentals",
      description: "Building user interfaces with React, components, props, and state",
      emoji: "⚛️",
      difficulty: "Intermediate",
      duration: "3 weeks",
      xpReward: 700,
      skills: ["React", "JSX", "Components", "Props", "useState", "Lists & Forms"],
      projects: ["React Counter App", "Interactive Dashboard"],
      lessons: [
        {
          id: "r1",
          title: "Introduction to React & JSX",
          description: "Understanding React's philosophy and JSX syntax",
          content: `React is a declarative, component-based library for building user interfaces.

**Core Concepts:**
- **Declarative**: Describe what you want, not how to do it
- **Component-Based**: Build encapsulated pieces that manage their own state
- **Virtual DOM**: Efficient updates by diffing in memory

**JSX Syntax:**
JavaScript XML — a syntax extension that looks like HTML but compiles to JavaScript.
- Single root element (or Fragment)
- Curly braces {} for JavaScript expressions
- camelCase for attributes (className, onClick)
- Self-closing tags for components`,
          codeExample: `function Welcome({ name }) {\n  return (\n    <div className="welcome">\n      <h1>Hello, {name}!</h1>\n      <p>Welcome to React.</p>\n    </div>\n  );\n}\n\n// Using the component\n<Welcome name="Alice" />`,
          type: "theory", xpReward: 35, estimatedTime: 45,
          tips: "JSX is optional — React can work without it, but JSX makes your code much more readable.",
        },
        {
          id: "r2",
          title: "Components & Props",
          description: "Creating reusable components and passing data with props",
          content: `Components are the building blocks of any React application.

**Component Types:**
- Function components (modern, recommended)
- Class components (legacy)

**Props:**
Props are read-only data passed from parent to child.
- Default props
- Children prop for composition
- PropTypes or TypeScript for type checking

**Composition:**
Combine small components to build complex UIs.`,
          codeExample: `function Card({ title, children, footer }) {\n  return (\n    <div className="card">\n      <div className="card-header">{title}</div>\n      <div className="card-body">{children}</div>\n      {footer && <div className="card-footer">{footer}</div>}\n    </div>\n  );\n}\n\n// Usage\n<Card title="Profile">\n  <p>This is the card content.</p>\n</Card>`,
          challenge: "Create a reusable Button component with variants (primary, secondary, danger)",
          type: "practice", xpReward: 40, estimatedTime: 50,
          tips: "Keep components small and focused. If a component does too much, split it.",
        },
        {
          id: "r3",
          title: "State & Lifecycle with useState",
          description: "Managing component state with the useState hook",
          content: `State allows components to remember and update data over time.

**useState Hook:**
- Returns [value, setValue] pair
- setValue triggers re-render
- State updates are asynchronous
- Never mutate state directly

**State Patterns:**
- Multiple state variables vs single object
- Lazy initialization with a function
- Updating objects and arrays immutably
- Lifting state up to parent components`,
          codeExample: `function Counter() {\n  const [count, setCount] = useState(0);\n  const [history, setHistory] = useState([]);\n\n  const increment = () => {\n    setCount(prev => prev + 1);\n    setHistory(prev => [...prev, 'increment']);\n  };\n\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={increment}>+</button>\n    </div>\n  );\n}`,
          challenge: "Build a temperature converter that converts between Celsius and Fahrenheit",
          type: "practice", xpReward: 45, estimatedTime: 55,
          tips: "Use the functional updater form setState(prev => ...) when the new state depends on the old.",
        },
        {
          id: "r4",
          title: "Conditional Rendering & Lists",
          description: "Rendering content conditionally and displaying lists of data",
          content: `React makes it easy to show different content based on conditions and render collections.

**Conditional Rendering:**
- Ternary: condition ? <A /> : <B />
- && operator: condition && <Component />
- If/else outside JSX
- Early returns from components

**Rendering Lists:**
- Array.map() to transform data into elements
- Key prop for efficient updates
- Filtering before mapping`,
          codeExample: `function TaskList({ tasks, filter }) {\n  const filtered = tasks.filter(task =>\n    filter === 'all' \n      ? true \n      : task.status === filter\n  );\n\n  return (\n    <ul>\n      {filtered.length === 0 ? (\n        <li>No tasks found</li>\n      ) : (\n        filtered.map(task => (\n          <li key={task.id}>\n            {task.title}\n          </li>\n        ))\n      )}\n    </ul>\n  );\n}`,
          challenge: "Build a filterable product list with search and category filters",
          type: "practice", xpReward: 40, estimatedTime: 45,
          tips: "Use stable, unique keys (like database IDs) for list items — never use array index unless the list is static.",
        },
        {
          id: "r5",
          title: "Forms & Controlled Components",
          description: "Building forms with controlled inputs in React",
          content: `In React, form inputs are controlled by component state.

**Controlled Components:**
- Input value comes from state
- onChange updates state
- Single source of truth

**Form Patterns:**
- Handling multiple inputs with a single handler
- Form validation on submit and in real-time
- Reset and pre-fill forms
- Uncontrolled inputs with useRef (when needed)`,
          codeExample: `function LoginForm() {\n  const [form, setForm] = useState({ email: '', password: '' });\n  const [errors, setErrors] = useState({});\n\n  const handleChange = (e) => {\n    const { name, value } = e.target;\n    setForm(prev => ({ ...prev, [name]: value }));\n  };\n\n  const handleSubmit = (e) => {\n    e.preventDefault();\n    const newErrors = {};\n    if (!form.email.includes('@')) newErrors.email = 'Invalid email';\n    if (form.password.length < 6) newErrors.password = 'Too short';\n    setErrors(newErrors);\n    if (Object.keys(newErrors).length === 0) {\n      console.log('Submit:', form);\n    }\n  };\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input name="email" value={form.email} onChange={handleChange} />\n      {errors.email && <span>{errors.email}</span>}\n      <input name="password" type="password" value={form.password} onChange={handleChange} />\n      <button type="submit">Login</button>\n    </form>\n  );\n}`,
          challenge: "Build a multi-step registration form with validation",
          type: "practice", xpReward: 45, estimatedTime: 50,
          tips: "Use a form library like React Hook Form for complex forms with many fields.",
        },
      ],
    },
    // ── MODULE 8: React Advanced (Week 17-19) ──
    {
      id: "react-advanced",
      title: "React Advanced",
      description: "useEffect, useContext, custom hooks, routing, and performance",
      emoji: "🔧",
      difficulty: "Intermediate",
      duration: "3 weeks",
      xpReward: 720,
      skills: ["useEffect", "useContext", "Custom Hooks", "React Router", "Performance"],
      projects: ["Blog with Comments", "Dashboard with Charts"],
      lessons: [
        {
          id: "ra1",
          title: "useEffect & Side Effects",
          description: "Managing side effects in React components",
          content: `useEffect lets you perform side effects in function components.

**When to Use useEffect:**
- Fetching data from APIs
- Subscribing to events
- DOM manipulation
- Timers and intervals
- Syncing with external systems

**Dependency Array:**
- [] — Run once on mount
- [dep1, dep2] — Run when deps change
- No array — Run after every render
- Return cleanup function`,
          codeExample: `function UserProfile({ userId }) {\n  const [user, setUser] = useState(null);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    let cancelled = false;\n    \n    async function fetchUser() {\n      setLoading(true);\n      const data = await api.getUser(userId);\n      if (!cancelled) {\n        setUser(data);\n        setLoading(false);\n      }\n    }\n    \n    fetchUser();\n    \n    return () => { cancelled = true; };\n  }, [userId]);\n\n  if (loading) return <Spinner />;\n  return <div>{user.name}</div>;\n}`,
          challenge: "Build a search component that debounces API calls using useEffect",
          type: "practice", xpReward: 45, estimatedTime: 55,
          tips: "Always clean up subscriptions, timers, and abort fetch requests in the useEffect cleanup function.",
        },
        {
          id: "ra2",
          title: "useContext & Custom Hooks",
          description: "Sharing state across components and extracting reusable logic",
          content: `Context provides a way to pass data through the component tree without props drilling.

**useContext:**
- createContext — Create the context
- Provider — Wraps components with value
- useContext — Consume context value

**Custom Hooks:**
Extract component logic into reusable functions.
- Start with 'use' prefix
- Can use other hooks
- Each call has isolated state`,
          codeExample: `// Theme context\nconst ThemeContext = createContext('light');\n\nfunction App() {\n  const [theme, setTheme] = useState('light');\n  return (\n    <ThemeContext.Provider value={{ theme, setTheme }}>\n      <Toolbar />\n    </ThemeContext.Provider>\n  );\n}\n\n// Custom hook\nfunction useLocalStorage(key, initial) {\n  const [value, setValue] = useState(() => {\n    const stored = localStorage.getItem(key);\n    return stored ? JSON.parse(stored) : initial;\n  });\n  \n  useEffect(() => {\n    localStorage.setItem(key, JSON.stringify(value));\n  }, [key, value]);\n  \n  return [value, setValue];\n}`,
          challenge: "Create a useFetch custom hook that handles loading, data, and error states",
          type: "practice", xpReward: 50, estimatedTime: 60,
          tips: "Custom hooks are the best way to share non-visual logic between components.",
        },
        {
          id: "ra3",
          title: "React Router & Navigation",
          description: "Building multi-page experiences with React Router",
          content: `React Router enables client-side routing in single-page applications.

**Core Components:**
- BrowserRouter — Router provider
- Routes / Route — Define routes
- Link / NavLink — Navigation links
- useNavigate — Programmatic navigation
- useParams — URL parameters

**Route Patterns:**
- Nested routes for layouts
- Protected routes for auth
- Lazy loading with React.lazy`,
          codeExample: `import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';\n\nfunction App() {\n  return (\n    <BrowserRouter>\n      <nav>\n        <Link to="/">Home</Link>\n        <Link to="/about">About</Link>\n        <Link to="/users">Users</Link>\n      </nav>\n      \n      <Routes>\n        <Route path="/" element={<Home />} />\n        <Route path="/about" element={<About />} />\n        <Route path="/users/:id" element={<UserProfile />} />\n        <Route path="*" element={<NotFound />} />\n      </Routes>\n    </BrowserRouter>\n  );\n}`,
          challenge: "Build a multi-page app with a navigation bar and protected routes",
          type: "practice", xpReward: 40, estimatedTime: 50,
          tips: "Use NavLink instead of Link for navigation links — it gives you an 'active' class automatically.",
        },
        {
          id: "ra4",
          title: "Performance Optimization",
          description: "Optimizing React apps for better performance",
          content: `React provides several tools to optimize rendering performance.

**Optimization Techniques:**
- React.memo — Prevent unnecessary re-renders
- useMemo — Memoize computed values
- useCallback — Memoize function references
- Lazy loading — Split code with React.lazy
- Virtualization — Render only visible items

**When to Optimize:**
Measure first, optimize second. Premature optimization adds complexity without benefits.`,
          codeExample: `// Memoize expensive computations\nconst sortedList = useMemo(() => {\n  return items.sort((a, b) => b.score - a.score);\n}, [items]);\n\n// Memoize callbacks\nconst handleClick = useCallback((id) => {\n  setSelected(prev => prev === id ? null : id);\n}, []);\n\n// Memoize components\nconst ExpensiveChart = React.memo(({ data }) => {\n  return <Chart data={data} />;\n});`,
          type: "theory", xpReward: 35, estimatedTime: 40,
          tips: "Profile your app with React DevTools before optimizing. Fix actual bottlenecks, not hypothetical ones.",
        },
      ],
    },
    // ── MODULE 9: Node.js & Express (Week 20-22) ──
    {
      id: "nodejs-express",
      title: "Node.js & Express",
      description: "Server-side JavaScript with Node.js, Express, and building REST APIs",
      emoji: "🖥️",
      difficulty: "Intermediate",
      duration: "3 weeks",
      xpReward: 750,
      skills: ["Node.js", "Express", "REST APIs", "Middleware", "Authentication", "NPM"],
      projects: ["REST API Server", "Authentication System"],
      lessons: [
        {
          id: "n1",
          title: "Introduction to Node.js & NPM",
          description: "Understanding the Node.js runtime and package management",
          content: `Node.js allows JavaScript to run on the server, opening up full-stack development with a single language.

**What is Node.js?**
- JavaScript runtime built on Chrome's V8 engine
- Event-driven, non-blocking I/O
- Perfect for building scalable network applications

**NPM (Node Package Manager):**
- package.json — Project configuration
- npm install — Install dependencies
- node_modules — Where packages are stored
- Scripts for automation

**Modules:**
- Built-in: fs, path, http, os
- Third-party: from npm registry
- Local: Your own modules`,
          codeExample: `// Built-in http module\nconst http = require('http');\n\nconst server = http.createServer((req, res) => {\n  res.writeHead(200, { 'Content-Type': 'application/json' });\n  res.end(JSON.stringify({ message: 'Hello World' }));\n});\n\nserver.listen(3000, () => {\n  console.log('Server running on port 3000');\n});`,
          type: "theory", xpReward: 30, estimatedTime: 40,
          tips: "Use nodemon for automatic server restart during development.",
        },
        {
          id: "n2",
          title: "Express.js & Routing",
          description: "Building web servers with the Express framework",
          content: `Express.js is the most popular Node.js web framework, providing a robust set of features.

**Setting Up Express:**
- const app = express()
- app.listen(port, callback)
- Route definitions with HTTP methods

**Routing:**
- app.get(), app.post(), app.put(), app.delete()
- Route parameters: /users/:id
- Query parameters: /search?q=term
- Multiple route handlers (middleware chain)`,
          codeExample: `const express = require('express');\nconst app = express();\n\napp.use(express.json());\n\napp.get('/api/users', (req, res) => {\n  res.json({ users: [] });\n});\n\napp.get('/api/users/:id', (req, res) => {\n  const { id } = req.params;\n  res.json({ id, name: 'Alice' });\n});\n\napp.post('/api/users', (req, res) => {\n  const user = req.body;\n  res.status(201).json(user);\n});\n\napp.listen(3000);`,
          challenge: "Create an Express server with CRUD routes for a resource of your choice",
          type: "practice", xpReward: 45, estimatedTime: 55,
          tips: "Use express.Router() to organize routes into separate modules.",
        },
        {
          id: "n3",
          title: "Middleware & Error Handling",
          description: "Express middleware pattern and centralized error handling",
          content: `Middleware functions are the backbone of Express — they execute during the request-response cycle.

**Types of Middleware:**
- Application-level: app.use()
- Router-level: router.use()
- Error-handling: (err, req, res, next) => {}
- Built-in: express.json(), express.static()
- Third-party: cors, morgan, helmet

**Error Handling Pattern:**
- Wrap async handlers to catch errors
- Centralized error handler middleware
- Custom error classes`,
          codeExample: `// Async error wrapper\nconst asyncHandler = (fn) => (req, res, next) =>\n  Promise.resolve(fn(req, res, next)).catch(next);\n\n// Centralized error handler\napp.use((err, req, res, next) => {\n  console.error(err.stack);\n  res.status(err.status || 500).json({\n    error: err.message || 'Internal Server Error'\n  });\n});\n\n// Usage\napp.get('/api/data', asyncHandler(async (req, res) => {\n  const data = await db.query('SELECT * FROM data');\n  res.json(data);\n}));`,
          challenge: "Add logging (morgan), CORS, and a custom error handler to your Express app",
          type: "practice", xpReward: 40, estimatedTime: 50,
          tips: "Always use try/catch or async wrappers in Express route handlers — uncaught promise rejections crash the server.",
        },
        {
          id: "n4",
          title: "Building RESTful APIs",
          description: "Designing and implementing RESTful API endpoints",
          content: `REST (Representational State Transfer) is an architectural style for designing networked applications.

**REST Principles:**
- Resources are identified by URLs
- HTTP methods map to CRUD operations
- Stateless communication
- Consistent response formats

**API Design:**
- Use plural nouns: /api/users
- Nest related resources: /api/users/:id/posts
- Version your API: /api/v1/users
- Pagination, filtering, sorting`,
          codeExample: `// RESTful API for posts\nrouter.get('/posts', async (req, res) => {\n  const { page = 1, limit = 10 } = req.query;\n  const posts = await Post.find()\n    .skip((page - 1) * limit)\n    .limit(limit);\n  res.json({ data: posts, page, limit });\n});\n\nrouter.post('/posts', async (req, res) => {\n  const post = await Post.create(req.body);\n  res.status(201).json(post);\n});\n\nrouter.delete('/posts/:id', async (req, res) => {\n  await Post.findByIdAndDelete(req.params.id);\n  res.status(204).send();\n});`,
          challenge: "Design and implement a RESTful API for a blog platform with posts and comments",
          type: "project", xpReward: 50, estimatedTime: 60,
          tips: "Use consistent response formats — consider a wrapper like { success: true, data: ..., error: ... }.",
        },
        {
          id: "n5",
          title: "Authentication & Authorization",
          description: "Implementing secure authentication with JWT",
          content: `Authentication verifies who a user is; authorization determines what they can do.

**JWT (JSON Web Tokens):**
- Header, payload, signature
- Stateless authentication
- Access tokens (short-lived) and refresh tokens (long-lived)

**Implementation:**
- Sign up: Hash password, store user
- Login: Verify credentials, return JWT
- Middleware: Verify JWT on protected routes
- Authorization: Check user roles/permissions`,
          codeExample: `// JWT middleware\nfunction authenticate(req, res, next) {\n  const token = req.headers.authorization?.split(' ')[1];\n  if (!token) return res.status(401).json({ error: 'Unauthorized' });\n  \n  try {\n    const decoded = jwt.verify(token, process.env.JWT_SECRET);\n    req.user = decoded;\n    next();\n  } catch (err) {\n    res.status(401).json({ error: 'Invalid token' });\n  }\n}\n\n// Protected route\napp.get('/api/profile', authenticate, (req, res) => {\n  res.json({ user: req.user });\n});`,
          challenge: "Add JWT-based authentication to your Express API with login and protected routes",
          type: "practice", xpReward: 50, estimatedTime: 60,
          tips: "Never store plain text passwords — use bcrypt to hash them before saving to the database.",
        },
      ],
    },
    // ── MODULE 10: Databases & SQL (Week 23-25) ──
    {
      id: "databases-sql",
      title: "Databases & SQL",
      description: "Relational databases, SQL queries, PostgreSQL, and database design",
      emoji: "🗄️",
      difficulty: "Intermediate",
      duration: "3 weeks",
      xpReward: 650,
      skills: ["SQL", "PostgreSQL", "Database Design", "CRUD", "Relations", "Indexing"],
      projects: ["Database Schema Design", "Data Querying Tool"],
      lessons: [
        {
          id: "db1",
          title: "Database Concepts & SQL",
          description: "Understanding relational databases and SQL fundamentals",
          content: `Relational databases store data in tables with rows and columns.

**SQL Categories:**
- DDL: CREATE, ALTER, DROP — Define structure
- DML: SELECT, INSERT, UPDATE, DELETE — Manipulate data
- DCL: GRANT, REVOKE — Control access

**Basic Queries:**
- SELECT columns FROM table
- WHERE for filtering
- ORDER BY for sorting
- LIMIT / OFFSET for pagination`,
          codeExample: `-- Create table\nCREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(100) NOT NULL,\n  email VARCHAR(255) UNIQUE NOT NULL,\n  created_at TIMESTAMP DEFAULT NOW()\n);\n\n-- Query\nSELECT name, email FROM users\nWHERE created_at > '2024-01-01'\nORDER BY name ASC\nLIMIT 10;`,
          type: "theory", xpReward: 35, estimatedTime: 45,
          tips: "Always use EXPLAIN ANALYZE before optimizing queries to understand the execution plan.",
        },
        {
          id: "db2",
          title: "PostgreSQL & Supabase",
          description: "Setting up PostgreSQL databases with Supabase",
          content: `Supabase provides a hosted PostgreSQL database with a user-friendly interface and additional services.

**Supabase Features:**
- PostgreSQL database with auto-scaling
- Row Level Security (RLS)
- Real-time subscriptions
- Storage for files
- Authentication

**Setting Up:**
- Create a Supabase project
- Use the SQL Editor for queries
- Connect from your app with the Supabase client
- Define tables and relationships`,
          codeExample: `// Supabase client setup\nimport { createClient } from '@supabase/supabase-js';\n\nconst supabase = createClient(\n  process.env.SUPABASE_URL,\n  process.env.SUPABASE_ANON_KEY\n);\n\n// Querying data\nconst { data, error } = await supabase\n  .from('users')\n  .select('id, name, email')\n  .eq('role', 'student')\n  .order('name');`,
          challenge: "Set up a Supabase project and create a table with RLS policies",
          type: "practice", xpReward: 40, estimatedTime: 50,
          tips: "Enable Row Level Security (RLS) on all tables by default — it's your first line of defense.",
        },
        {
          id: "db3",
          title: "CRUD Operations & Queries",
          description: "Performing create, read, update, and delete operations",
          content: `CRUD is the foundation of data manipulation in any application.

**INSERT:**
- Add new records to a table
- Single or batch inserts
- Returning clause for inserted data

**SELECT:**
- Filtering with WHERE
- Joining tables
- Aggregating with GROUP BY
- Subqueries

**UPDATE / DELETE:**
- Always use WHERE conditions
- Use transactions for multi-step operations
- Soft deletes vs hard deletes`,
          codeExample: `-- CRUD examples\n\n-- Create\nINSERT INTO posts (title, content, author_id)\nVALUES ('My First Post', 'Hello world!', 1)\nRETURNING *;\n\n-- Read with join\nSELECT p.title, u.name as author\nFROM posts p\nJOIN users u ON p.author_id = u.id\nWHERE p.published = true;\n\n-- Update\nUPDATE posts SET views = views + 1\nWHERE id = $1\nRETURNING *;\n\n-- Delete\nDELETE FROM posts WHERE id = $1;`,
          challenge: "Write queries to analyze a dataset: total count, averages, and groupings",
          type: "practice", xpReward: 45, estimatedTime: 55,
          tips: "Use parameterized queries ($1, $2) instead of string concatenation to prevent SQL injection.",
        },
        {
          id: "db4",
          title: "Database Design & Relations",
          description: "Designing normalized databases with proper relationships",
          content: `Good database design ensures data integrity and query performance.

**Relationships:**
- One-to-One: User ↔ Profile
- One-to-Many: User → Posts
- Many-to-Many: Posts ↔ Tags (junction table)

**Normalization:**
- 1NF: Atomic values, no repeating groups
- 2NF: No partial dependencies
- 3NF: No transitive dependencies

**Indexing:**
- Primary keys are automatically indexed
- Create indexes on frequently queried columns
- Composite indexes for multi-column queries`,
          codeExample: `-- Many-to-many relationship\nCREATE TABLE posts (\n  id SERIAL PRIMARY KEY,\n  title TEXT NOT NULL\n);\n\nCREATE TABLE tags (\n  id SERIAL PRIMARY KEY,\n  name TEXT UNIQUE NOT NULL\n);\n\nCREATE TABLE post_tags (\n  post_id INT REFERENCES posts(id),\n  tag_id INT REFERENCES tags(id),\n  PRIMARY KEY (post_id, tag_id)\n);\n\n-- Query with many-to-many\nSELECT p.title, t.name\nFROM posts p\nJOIN post_tags pt ON p.id = pt.post_id\nJOIN tags t ON t.id = pt.tag_id;`,
          challenge: "Design a database schema for an e-commerce platform with products, categories, orders, and users",
          type: "project", xpReward: 45, estimatedTime: 50,
          tips: "Index foreign keys — they're used in JOIN conditions but aren't automatically indexed.",
        },
      ],
    },
    // ── MODULE 11: Full Stack Integration (Week 26-28) ──
    {
      id: "fullstack-integration",
      title: "Full Stack Integration",
      description: "Connecting frontend to backend, state management, file uploads, and real-time features",
      emoji: "🔗",
      difficulty: "Advanced",
      duration: "3 weeks",
      xpReward: 780,
      skills: ["Full Stack", "State Management", "File Uploads", "WebSockets", "API Integration"],
      projects: ["Full Stack Blog App", "Real-Time Chat Application"],
      lessons: [
        {
          id: "fs1",
          title: "Connecting Frontend to Backend",
          description: "Integrating React with Express APIs",
          content: `Full stack development connects frontend and backend into a cohesive application.

**Architecture:**
- Frontend (React) → API calls → Backend (Express) → Database
- Deployed separately or together
- CORS configuration for cross-origin requests

**API Integration Patterns:**
- Custom fetch wrapper
- React Query / TanStack Query for data fetching
- Error handling and loading states
- Environment variables for API URLs`,
          codeExample: `// API service layer\nconst API_URL = process.env.NEXT_PUBLIC_API_URL;\n\nasync function apiClient(endpoint, options = {}) {\n  const res = await fetch(\`\${API_URL}\${endpoint}\`, {\n    headers: { 'Content-Type': 'application/json' },\n    ...options,\n  });\n  if (!res.ok) throw new Error(await res.text());\n  return res.json();\n}\n\n// Usage in React component\nfunction UsersPage() {\n  const [users, setUsers] = useState([]);\n  \n  useEffect(() => {\n    apiClient('/api/users')\n      .then(setUsers)\n      .catch(err => console.error(err));\n  }, []);\n\n  return <UserList users={users} />;\n}`,
          challenge: "Create a full stack CRUD app with React frontend and Express backend",
          type: "project", xpReward: 45, estimatedTime: 55,
          tips: "Use environment variables for API URLs so you can switch between dev and production easily.",
        },
        {
          id: "fs2",
          title: "State Management & Data Flow",
          description: "Managing global state and data flow in full stack apps",
          content: `As applications grow, managing state becomes more complex.

**State Management Options:**
- React Context for simple global state
- useReducer for complex state logic
- Redux / Zustand for large applications
- React Query / TanStack Query for server state

**Data Flow Pattern:**
- Server state → Fetch → Cache → UI
- Optimistic updates for better UX
- Cache invalidation on mutations`,
          codeExample: `// Using TanStack Query\nimport { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';\n\nfunction usePosts() {\n  return useQuery({\n    queryKey: ['posts'],\n    queryFn: () => apiClient('/api/posts'),\n  });\n}\n\nfunction useCreatePost() {\n  const queryClient = useQueryClient();\n  \n  return useMutation({\n    mutationFn: (data) => apiClient('/api/posts', {\n      method: 'POST',\n      body: JSON.stringify(data),\n    }),\n    onSuccess: () => {\n      queryClient.invalidateQueries({ queryKey: ['posts'] });\n    },\n  });\n}`,
          challenge: "Refactor a React app to use TanStack Query for all API data fetching",
          type: "practice", xpReward: 40, estimatedTime: 50,
          tips: "Separate server state (API data) from client state (UI state) — they have different lifecycles.",
        },
        {
          id: "fs3",
          title: "File Uploads & Storage",
          description: "Handling file uploads with Supabase Storage",
          content: `File uploads are a common requirement for web applications.

**Upload Flow:**
1. Client selects file
2. Upload to Supabase Storage (or S3, Cloudinary)
3. Save the public URL to the database
4. Display the file using the URL

**Best Practices:**
- Client-side file validation (type, size)
- Progress indicators during upload
- Generate unique filenames
- Set appropriate bucket policies (RLS)
- Image optimization and thumbnails`,
          codeExample: `// Upload file to Supabase Storage\nasync function uploadAvatar(userId, file) {\n  const fileExt = file.name.split('.').pop();\n  const filePath = \`\${userId}/avatar.\${fileExt}\`;\n  \n  const { error } = await supabase.storage\n    .from('avatars')\n    .upload(filePath, file, { upsert: true });\n  \n  if (error) throw error;\n  \n  const { data: { publicUrl } } = supabase.storage\n    .from('avatars')\n    .getPublicUrl(filePath);\n  \n  return publicUrl;\n}`,
          challenge: "Add profile picture upload to your app with preview and progress indicator",
          type: "practice", xpReward: 40, estimatedTime: 50,
          tips: "Validate file type and size on the client before uploading to save bandwidth.",
        },
        {
          id: "fs4",
          title: "Real-Time Features with Supabase",
          description: "Building real-time features using Supabase subscriptions",
          content: `Real-time features create engaging, live-updating experiences.

**Supabase Realtime:**
- Subscribe to database changes
- Broadcast messages between clients
- Presence tracking for online users

**Use Cases:**
- Live chat applications
- Collaborative editing
- Real-time notifications
- Live dashboards`,
          codeExample: `// Subscribe to real-time changes\nconst subscription = supabase\n  .channel('public:messages')\n  .on('postgres_changes',\n    { event: 'INSERT', schema: 'public', table: 'messages' },\n    (payload) => {\n      setMessages(prev => [...prev, payload.new]);\n    }\n  )\n  .subscribe();\n\n// Cleanup on unmount\nreturn () => {\n  subscription.unsubscribe();\n};`,
          challenge: "Build a real-time chat application using Supabase subscriptions",
          type: "project", xpReward: 50, estimatedTime: 65,
          tips: "Unsubscribe from real-time channels when the component unmounts to prevent memory leaks.",
        },
      ],
    },
    // ── MODULE 12: Deployment & Capstone (Week 29-32) ──
    {
      id: "deployment-capstone",
      title: "Deployment & Capstone Project",
      description: "Production deployment, CI/CD, testing, security, and the final capstone project",
      emoji: "🚀",
      difficulty: "Advanced",
      duration: "4 weeks",
      xpReward: 850,
      skills: ["Deployment", "CI/CD", "Testing", "Security", "DevOps"],
      projects: ["Full Stack Capstone Project", "Deployment Pipeline"],
      lessons: [
        {
          id: "dep1",
          title: "Build Process & Deployment",
          description: "Building and deploying full stack applications",
          content: `Deployment makes your application accessible to users on the internet.

**Deployment Platforms:**
- Vercel — Best for Next.js and frontend apps
- Netlify — Static sites and serverless functions
- Render — Full stack apps
- Railway — Full stack with databases

**Build Process:**
- Build command: npm run build
- Environment variables
- Build optimization (minification, code splitting)
- Static vs server-side rendering`,
          codeExample: `// vercel.json for deployment config\n{\n  "buildCommand": "npm run build",\n  "outputDirectory": ".next",\n  "framework": "nextjs",\n  "env": {\n    "NEXT_PUBLIC_API_URL": "@api_url",\n    "DATABASE_URL": "@database_url"\n  }\n}`,
          challenge: "Deploy your full stack application to Vercel and Render",
          type: "project", xpReward: 35, estimatedTime: 45,
          tips: "Use environment variables for all secrets — never hardcode API keys or database credentials.",
        },
        {
          id: "dep2",
          title: "Testing & Quality Assurance",
          description: "Writing tests and ensuring code quality",
          content: `Testing ensures your application works correctly and prevents regressions.

**Testing Levels:**
- Unit tests: Test individual functions
- Integration tests: Test component interactions
- End-to-end tests: Test complete user flows

**Testing Tools:**
- Vitest / Jest — Unit testing
- React Testing Library — Component testing
- Playwright / Cypress — E2E testing
- MSW — Mock service worker for API mocking`,
          codeExample: `// Unit test with Vitest\nimport { describe, it, expect } from 'vitest';\n\nfunction add(a, b) { return a + b; }\n\ndescribe('add', () => {\n  it('adds two positive numbers', () => {\n    expect(add(2, 3)).toBe(5);\n  });\n  \n  it('handles negative numbers', () => {\n    expect(add(-1, 1)).toBe(0);\n  });\n});\n\n// Component test\nimport { render, screen } from '@testing-library/react';\n\ndescribe('Button', () => {\n  it('renders with text', () => {\n    render(<Button>Click me</Button>);\n    expect(screen.getByText('Click me')).toBeDefined();\n  });\n});`,
          challenge: "Write unit tests for your utility functions and integration tests for your React components",
          type: "practice", xpReward: 45, estimatedTime: 55,
          tips: "Write tests that test behavior, not implementation details — this makes refactoring safer.",
        },
        {
          id: "dep3",
          title: "Security & Best Practices",
          description: "Securing your full stack application",
          content: `Security should be built into every layer of your application.

**Frontend Security:**
- Sanitize user input to prevent XSS
- Use HTTPS everywhere
- Implement Content Security Policy (CSP)
- Secure authentication tokens

**Backend Security:**
- SQL injection prevention (parameterized queries)
- Rate limiting to prevent abuse
- Input validation and sanitization
- Proper authentication and authorization
- Helmet.js for security headers

**DevOps Security:**
- Environment variables for secrets
- Regular dependency updates
- Principle of least privilege`,
          codeExample: `// Security middleware setup\nconst helmet = require('helmet');\nconst rateLimit = require('express-rate-limit');\n\napp.use(helmet());\n\nconst limiter = rateLimit({\n  windowMs: 15 * 60 * 1000,\n  max: 100,\n  message: 'Too many requests, please try again later.'\n});\n\napp.use('/api', limiter);\n\n// Input validation\nconst { body, validationResult } = require('express-validator');\n\napp.post('/api/users',\n  body('email').isEmail(),\n  body('password').isLength({ min: 8 }),\n  (req, res) => {\n    const errors = validationResult(req);\n    if (!errors.isEmpty()) {\n      return res.status(400).json({ errors: errors.array() });\n    }\n    // Process request\n  }\n);`,
          challenge: "Perform a security audit of your application and fix any vulnerabilities",
          type: "practice", xpReward: 40, estimatedTime: 50,
          tips: "Use `npm audit` regularly to find and fix dependency vulnerabilities.",
        },
        {
          id: "dep4",
          title: "Capstone Project Planning & Development",
          description: "Building your final full stack capstone project",
          content: `The capstone project demonstrates everything you've learned throughout the bootcamp.

**Project Requirements:**
- Full stack application (React + Node.js + Database)
- User authentication and authorization
- CRUD operations on at least two resources
- Responsive design
- API integration
- Deployment to production

**Development Process:**
1. Plan: Define requirements and user stories
2. Design: Create wireframes and database schema
3. Build: Implement features iteratively
4. Test: Write and run tests
5. Deploy: Deploy to production
6. Present: Demo your project

**Project Ideas:**
- E-commerce platform
- Social media dashboard
- Project management tool
- Learning management system
- Real-time collaboration app`,
          challenge: "Plan, build, test, and deploy a complete full stack application as your capstone project",
          type: "project", xpReward: 100, estimatedTime: 120,
          tips: "Start with a simple MVP (Minimum Viable Product) and add features iteratively.",
        },
      ],
    },
  ]

  // Get all modules — try DB first, fall back to hardcoded
  async getModules(): Promise<Module[]> {
    try {
      const { data: dbModules } = await this.supabase
        .from("modules")
        .select("*, lessons(*)")
        .order("order_index")

      if (dbModules && dbModules.length > 0) {
        return dbModules.map((m: any) => ({
          id: m.id,
          title: m.title,
          description: m.description,
          emoji: m.emoji,
          difficulty: m.difficulty as "Beginner" | "Intermediate" | "Advanced",
          duration: m.duration,
          xpReward: m.xp_reward,
          skills: m.skills || [],
          projects: m.projects || [],
          lessons: (m.lessons || [])
            .sort((a: any, b: any) => a.order_index - b.order_index)
            .map((l: any) => ({
              id: l.id,
              title: l.title,
              description: l.description,
              content: l.content,
              codeExample: l.code_example,
              challenge: l.challenge,
              starterCode: l.starter_code,
              expectedOutput: l.expected_output,
              tips: l.tips,
              type: l.type as "theory" | "practice" | "project",
              xpReward: l.xp_reward,
              estimatedTime: l.estimated_time,
            })),
        }))
      }
    } catch (e) {
      console.error("Error fetching modules from DB, using fallback:", e)
    }
    return this.modules
  }

  // Get specific module
  async getModule(moduleId: string): Promise<Module | null> {
    const modules = await this.getModules()
    return modules.find((m) => m.id === moduleId) || null
  }

  // Get lesson from module
  async getLesson(moduleId: string, lessonId: string): Promise<Lesson | null> {
    const module = await this.getModule(moduleId)
    return module?.lessons.find((l) => l.id === lessonId) || null
  }

  // Get all quizzes — try DB first, fall back to hardcoded
  private async fetchQuizzesFromDB(): Promise<Quiz[] | null> {
    try {
      const { data: dbQuizzes } = await this.supabase
        .from("quizzes")
        .select("*, questions(*)")
        .order("order_index")

      if (!dbQuizzes || dbQuizzes.length === 0) return null

      return dbQuizzes.map((q: any) => ({
        id: q.id,
        title: q.title,
        description: q.description,
        difficulty: q.difficulty as "Beginner" | "Intermediate" | "Advanced",
        timeLimit: q.time_limit,
        xpReward: q.xp_reward,
        category: q.category,
        type: q.type as "multiple-choice" | "coding" | "mixed",
        attempts: 0,
        completed: false,
        locked: false,
        questions: (q.questions || [])
          .sort((a: any, b: any) => a.order_index - b.order_index)
          .map((qs: any) => ({
            id: qs.id,
            type: qs.type as "multiple-choice" | "coding" | "true-false",
            question: qs.question,
            code: qs.code,
            options: qs.options,
            correctAnswer: qs.correct_answer,
            explanation: qs.explanation,
            points: qs.points,
          })),
      }))
    } catch (e) {
      console.error("Error fetching quizzes from DB:", e)
      return null
    }
  }

  // Get all quizzes with user progress
  async getQuizzes(userId?: string): Promise<Quiz[]> {
    if (!userId) return this.quizzes

    try {
      const { data: attempts } = await this.supabase.from("quiz_attempts").select("*").eq("user_id", userId)

      const { data: profile } = await this.supabase
        .from("profiles")
        .select("completed_lessons")
        .eq("id", userId)
        .single()

      const completedLessons = profile?.completed_lessons || 0

      return this.quizzes.map((quiz) => {
        const userAttempts = attempts?.filter((a) => a.quiz_id === quiz.id) || []
        const bestAttempt = userAttempts.reduce(
          (best, current) => (!best || current.percentage > best.percentage ? current : best),
          null,
        )

        const isLocked = quiz.difficulty === "Intermediate" && completedLessons < 2

        return {
          ...quiz,
          attempts: userAttempts.length,
          completed: userAttempts.length > 0,
          score: bestAttempt?.percentage || undefined,
          locked: isLocked,
        }
      })
    } catch (error) {
      console.error("Error fetching quizzes with progress:", error)
      return this.quizzes
    }
  }

  // Get specific quiz — try DB first, fall back to hardcoded
  async getQuiz(quizId: string): Promise<Quiz | null> {
    const dbQuizzes = await this.fetchQuizzesFromDB()
    if (dbQuizzes) return dbQuizzes.find((q) => q.id === quizId) || null
    return this.quizzes.find((q) => q.id === quizId) || null
  }

  // Record lesson progress
  async recordLessonProgress(
    userId: string,
    moduleId: string,
    lessonId: string,
    completed: boolean,
    timeSpent: number,
    score?: number,
  ): Promise<boolean> {
    try {
      const lesson = await this.getLesson(moduleId, lessonId)
      if (!lesson) return false

      const { data: existing } = await this.supabase
        .from("lesson_progress")
        .select("completed")
        .eq("user_id", userId)
        .eq("module_id", moduleId)
        .eq("lesson_id", lessonId)
        .single()

      const wasAlreadyCompleted = existing?.completed === true

      const { error } = await this.supabase.from("lesson_progress").upsert({
        user_id: userId,
        module_id: moduleId,
        lesson_id: lessonId,
        lesson_title: lesson.title,
        completed,
        score: score || 0,
        time_spent: Math.round(timeSpent),
        attempts: 1,
        completed_at: completed ? new Date().toISOString() : null,
        last_accessed: new Date().toISOString(),
      })

      if (error) return false

      if (completed && !wasAlreadyCompleted) {
        const { count } = await this.supabase
          .from("lesson_progress")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("completed", true)

        await this.supabase.from("profiles").update({
          completed_lessons: count || 0,
          updated_at: new Date().toISOString(),
        }).eq("id", userId)
      }

      return true
    } catch (error) {
      console.error("Error recording lesson progress:", error)
      return false
    }
  }

  // Submit quiz attempt
  async submitQuizAttempt(
    userId: string,
    quizId: string,
    answers: Record<string, string>,
    timeTaken: number,
  ): Promise<{ success: boolean; score: number; percentage: number; xpEarned: number }> {
    try {
      const quiz = await this.getQuiz(quizId)
      if (!quiz) return { success: false, score: 0, percentage: 0, xpEarned: 0 }

      let correctAnswers = 0
      let totalPoints = 0

      quiz.questions.forEach((question) => {
        totalPoints += question.points
        const userAnswer = answers[question.id]
        if (userAnswer && userAnswer.toLowerCase().includes(question.correctAnswer.toLowerCase())) {
          correctAnswers += question.points
        }
      })

      const percentage = Math.round((correctAnswers / totalPoints) * 100)
      const xpEarned = Math.round((percentage / 100) * quiz.xpReward)

      const { error } = await this.supabase.from("quiz_attempts").insert({
        user_id: userId,
        quiz_id: quizId,
        quiz_title: quiz.title,
        score: correctAnswers,
        max_score: totalPoints,
        percentage,
        time_taken: timeTaken,
        answers,
        correct_answers: Math.round((correctAnswers / totalPoints) * quiz.questions.length),
        total_questions: quiz.questions.length,
        difficulty: quiz.difficulty,
        xp_earned: xpEarned,
      })

      if (error) throw error

      const { data: distinctQuizzes } = await this.supabase
        .from("quiz_attempts")
        .select("quiz_id")
        .eq("user_id", userId)

      const uniqueQuizIds = new Set((distinctQuizzes || []).map((qa: any) => qa.quiz_id))

      await this.supabase.from("profiles").update({
        completed_quizzes: uniqueQuizIds.size,
        updated_at: new Date().toISOString(),
      }).eq("id", userId)

      return { success: true, score: correctAnswers, percentage, xpEarned }
    } catch (error) {
      console.error("Error submitting quiz:", error)
      return { success: false, score: 0, percentage: 0, xpEarned: 0 }
    }
  }

  // Get user progress
  async getUserProgress(userId: string) {
    try {
      const { data: lessonProgress } = await this.supabase.from("lesson_progress").select("*").eq("user_id", userId)

      const { data: quizAttempts } = await this.supabase
        .from("quiz_attempts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      return {
        lessons: lessonProgress || [],
        quizzes: quizAttempts || [],
      }
    } catch (error) {
      console.error("Error fetching user progress:", error)
      return { lessons: [], quizzes: [] }
    }
  }

  // Get leaderboard
  async getLeaderboard(limit = 10) {
    try {
      const { data } = await this.supabase
        .from("profiles")
        .select(
          "id, full_name, course, avatar_url, xp, level, streak, completed_lessons, completed_quizzes, weekly_xp, badges",
        )
        .order("xp", { ascending: false })
        .order("level", { ascending: false })
        .order("completed_lessons", { ascending: false })
        .limit(limit)

      return (data || []).map((user, index) => ({
        ...user,
        rank: index + 1,
        initials: user.full_name
          ? user.full_name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
          : "U",
      }))
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
      return []
    }
  }

  // Award badge
  async awardBadge(userId: string, badgeName: string): Promise<boolean> {
    try {
      const { data: profile } = await this.supabase.from("profiles").select("badges").eq("id", userId).single()

      if (!profile) return false

      const currentBadges = profile.badges || []
      if (currentBadges.includes(badgeName)) return true

      const newBadges = [...currentBadges, badgeName]

      const { error } = await this.supabase.from("profiles").update({ badges: newBadges }).eq("id", userId)

      return !error
    } catch (error) {
      console.error("Error awarding badge:", error)
      return false
    }
  }

  // Generate certificate
  async generateCertificate(userId: string, courseId: string): Promise<boolean> {
    try {
      const { data: profile } = await this.supabase.from("profiles").select("*").eq("id", userId).single()
      const { data: quizAttempts } = await this.supabase.from("quiz_attempts").select("*").eq("user_id", userId)

      if (!profile) return false

      const requiredLessons = 5
      const requiredQuizzes = 2

      if (profile.completed_lessons < requiredLessons || profile.completed_quizzes < requiredQuizzes) {
        return false
      }

      const attempts = quizAttempts ?? []
      const averageScore =
        attempts.length > 0
          ? Math.round(
              attempts.reduce((sum: number, attempt: any) => sum + attempt.percentage, 0) / attempts.length,
            )
          : 0

      const certificateNumber = `LASU-${courseId.toUpperCase()}-${Date.now()}-${userId.slice(-6)}`

      const module = await this.getModule(courseId)
      const courseTitle = module?.title || "Full Stack Development"

      const { error } = await this.supabase.from("certificates").insert({
        user_id: userId,
        course_id: courseId,
        course_title: courseTitle,
        certificate_number: certificateNumber,
        final_score: averageScore,
        total_lessons: profile.completed_lessons,
        total_quizzes: profile.completed_quizzes,
        study_hours: profile.total_study_hours,
        skills: module?.skills || ["Web Development", "JavaScript", "Problem Solving"],
        instructor: "Dr. Adebayo Ogundimu",
        institution: "Lagos State University",
      })

      return !error
    } catch (error) {
      console.error("Error generating certificate:", error)
      return false
    }
  }
}

export const learningService = new LearningService()
