const mongoose = require("mongoose");
const Course = require("../models/Course");
const Category = require("../models/Category");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const User = require("../models/User");
const Profile = require("../models/Profile");
const bcrypt = require("bcryptjs");

const SAMPLE_COURSES = [
  {
    courseName: "Full-Stack Web Development: React, Node.js & Next.js",
    categoryName: "Web Development",
    categoryDesc: "Frontend, backend, and full-stack web development with modern technologies.",
    courseDescription:
      "Master modern web development from ground up. Build production-ready fullstack applications with Next.js 15, TailwindCSS, Express.js, and MongoDB.",
    whatYouWillLearn:
      "Build complete scalable web applications, master React state management, design secure REST APIs, and deploy cloud-native fullstack apps.",
    price: 1499,
    thumbnail:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=800&auto=format&fit=crop",
    tag: ["React", "Node.js", "Fullstack", "Next.js", "MongoDB"],
    instructions: [
      "Basic understanding of JavaScript and HTML/CSS",
      "Computer with Node.js and code editor installed",
      "Passion for building web applications",
    ],
    sections: [
      {
        sectionName: "Getting Started & Foundations",
        subsections: [
          {
            title: "Course Overview & Modern Web Architecture",
            description: "Understand the modern full-stack web landscape and tooling.",
            timeDuration: "12m",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          },
          {
            title: "Setting Up Your Development Environment",
            description: "Install Node.js, VSCode extensions, and git workflow.",
            timeDuration: "18m",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          },
        ],
      },
      {
        sectionName: "Building the Backend API with Node & Express",
        subsections: [
          {
            title: "RESTful API Architecture & Routing",
            description: "Design and implement scalable endpoints with Express.",
            timeDuration: "25m",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          },
          {
            title: "JWT Authentication & Role Protection",
            description: "Secure endpoints with cookies, Bearer tokens, and RBAC.",
            timeDuration: "30m",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          },
        ],
      },
      {
        sectionName: "Modern Frontend with React & Tailwind",
        subsections: [
          {
            title: "Component Design & Responsive Layouts",
            description: "Build clean reusable components with TailwindCSS.",
            timeDuration: "35m",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          },
          {
            title: "Deploying Full-Stack Applications",
            description: "Production deployment with Vercel, Render, and MongoDB Atlas.",
            timeDuration: "20m",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          },
        ],
      },
    ],
  },
  {
    courseName: "Machine Learning & AI Masterclass with Python",
    categoryName: "Data Science & AI",
    categoryDesc: "Artificial intelligence, machine learning algorithms, deep learning, and data analytics.",
    courseDescription:
      "Comprehensive hands-on course covering Supervised & Unsupervised Learning, Neural Networks, PyTorch, Scikit-Learn, and Generative AI prompt engineering.",
    whatYouWillLearn:
      "Understand core ML algorithms, train deep neural networks with PyTorch, preprocess data like a pro, and deploy AI models to production.",
    price: 1999,
    thumbnail:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=800&auto=format&fit=crop",
    tag: ["Python", "Machine Learning", "AI", "Data Science", "PyTorch"],
    instructions: [
      "High school mathematics and basic Python syntax",
      "No prior AI experience required",
    ],
    sections: [
      {
        sectionName: "Mathematical Foundations & NumPy/Pandas",
        subsections: [
          {
            title: "Linear Algebra & Probability for ML",
            description: "Vectors, matrices, gradients, and probability basics.",
            timeDuration: "22m",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          },
          {
            title: "Data Manipulation with Pandas & NumPy",
            description: "Clean, filter, and transform real-world datasets.",
            timeDuration: "28m",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          },
        ],
      },
      {
        sectionName: "Supervised & Unsupervised Algorithms",
        subsections: [
          {
            title: "Regression & Classification with Scikit-Learn",
            description: "Linear regression, logistic regression, decision trees.",
            timeDuration: "32m",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          },
        ],
      },
      {
        sectionName: "Deep Learning with PyTorch",
        subsections: [
          {
            title: "Building Your First Neural Network",
            description: "Tensors, autograd, forward pass, and backpropagation.",
            timeDuration: "40m",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          },
        ],
      },
    ],
  },
  {
    courseName: "Cloud Architecture & DevOps: Docker, Kubernetes & AWS",
    categoryName: "Cloud & DevOps",
    categoryDesc: "Cloud computing, infrastructure as code, containerization, and automated CI/CD pipelines.",
    courseDescription:
      "Learn industry DevOps practices. Master CI/CD pipelines, Docker containerization, Kubernetes cluster orchestration, and AWS cloud architecture.",
    whatYouWillLearn:
      "Containerize microservices with Docker, manage clusters with Kubernetes, automate releases with GitHub Actions, and architect secure AWS infrastructure.",
    price: 1799,
    thumbnail:
      "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=800&auto=format&fit=crop",
    tag: ["DevOps", "Docker", "Kubernetes", "AWS", "CI/CD"],
    instructions: [
      "Basic Linux terminal command knowledge",
      "Free AWS account for hands-on practice",
    ],
    sections: [
      {
        sectionName: "Docker & Container Fundamentals",
        subsections: [
          {
            title: "Dockerizing Modern Applications",
            description: "Dockerfiles, multi-stage builds, and docker-compose.",
            timeDuration: "24m",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          },
        ],
      },
      {
        sectionName: "Kubernetes in Production",
        subsections: [
          {
            title: "Pods, Deployments, Services & Ingress",
            description: "Managing containerized applications declaratively.",
            timeDuration: "35m",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          },
        ],
      },
    ],
  },
  {
    courseName: "Cyber Security & Ethical Hacking Bootcamp",
    categoryName: "Cyber Security",
    categoryDesc: "Information security, network defense, penetration testing, and vulnerability assessment.",
    courseDescription:
      "Learn network security, penetration testing, vulnerability assessment, cryptography, and real-world ethical hacking techniques.",
    whatYouWillLearn:
      "Identify web and network vulnerabilities, execute penetration tests legally, secure Linux systems, and defend against cyber attacks.",
    price: 1899,
    thumbnail:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
    tag: ["Cyber Security", "Ethical Hacking", "Networking", "Pen Testing"],
    instructions: [
      "Curiosity about systems security and networking",
      "Virtual machine software (VirtualBox/VMware)",
    ],
    sections: [
      {
        sectionName: "Network Security & Protocol Analysis",
        subsections: [
          {
            title: "TCP/IP, Wireshark, & Port Scanning",
            description: "Analyze network packets and discover open services.",
            timeDuration: "30m",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          },
        ],
      },
      {
        sectionName: "Web Application Penetration Testing",
        subsections: [
          {
            title: "OWASP Top 10 Vulnerabilities Explained",
            description: "SQL Injection, XSS, CSRF, and broken access control.",
            timeDuration: "42m",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          },
        ],
      },
    ],
  },
  {
    courseName: "Advanced PostgreSQL & Scalable Database Architecture",
    categoryName: "Database Management",
    categoryDesc: "Relational and NoSQL database management, query optimization, and data modeling.",
    courseDescription:
      "Deep dive into relational databases. Master query optimization, indexing strategies, ACID transactions, database partitioning, and replication.",
    whatYouWillLearn:
      "Design normalized schemas, optimize slow queries with EXPLAIN ANALYZE, implement connection pooling, and manage high-availability clusters.",
    price: 1299,
    thumbnail:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop",
    tag: ["SQL", "PostgreSQL", "Database Design", "Indexing", "Performance"],
    instructions: [
      "Basic SQL query writing knowledge",
      "PostgreSQL installed locally or using Docker",
    ],
    sections: [
      {
        sectionName: "Schema Design & Normalization",
        subsections: [
          {
            title: "Relational Modeling & Foreign Key Integrity",
            description: "1NF to BCNF, constraints, and data integrity.",
            timeDuration: "20m",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          },
        ],
      },
      {
        sectionName: "Query Tuning & Indexing",
        subsections: [
          {
            title: "B-Tree, GIN, GiST Indexes & Execution Plans",
            description: "Diagnose query bottlenecks with EXPLAIN ANALYZE.",
            timeDuration: "34m",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          },
        ],
      },
    ],
  },
  {
    courseName: "Cross-Platform Mobile App Development with Flutter",
    categoryName: "Mobile Development",
    categoryDesc: "Native and cross-platform mobile apps for iOS and Android devices.",
    courseDescription:
      "Build high-performance native iOS and Android apps with Flutter & Dart. Covers state management with Riverpod, Firebase integration, and animation.",
    whatYouWillLearn:
      "Create reactive Flutter UIs, master Dart programming, integrate REST APIs & Firebase, and publish apps to Google Play & App Store.",
    price: 1599,
    thumbnail:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop",
    tag: ["Flutter", "Dart", "Mobile", "iOS", "Android"],
    instructions: [
      "Object-oriented programming basics",
      "Flutter SDK installed on computer",
    ],
    sections: [
      {
        sectionName: "Flutter & Dart Fundamentals",
        subsections: [
          {
            title: "Widget Tree, Layouts & Theming",
            description: "Stateless vs Stateful widgets, material components.",
            timeDuration: "28m",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          },
        ],
      },
      {
        sectionName: "State Management & API Integration",
        subsections: [
          {
            title: "Riverpod Architecture & HTTP Requests",
            description: "Manage global state clean and efficiently.",
            timeDuration: "36m",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
          },
        ],
      },
    ],
  },
];

exports.seedDefaultCourses = async () => {
  try {
    // 1. Ensure at least one Instructor exists
    let instructor = await User.findOne({
      accountType: { $regex: /^instructor$/i },
    });

    if (!instructor) {
      console.log("No instructor found. Creating default verified Instructor...");
      const profile = await Profile.create({
        gender: "Female",
        dateOfBirth: "1994-05-15",
        about: "Lead Fullstack & AI Instructor at SkillBridge with 8+ years industry experience.",
        contactNumber: "9876543210",
      });

      const hashedPassword = await bcrypt.hash("InstructorPass123", 10);
      instructor = await User.create({
        firstName: "Sarah",
        lastName: "Jenkins",
        email: "instructor@skillbridge.com",
        password: hashedPassword,
        accountType: "Instructor",
        additionalDetails: profile._id,
        Image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop",
      });
      console.log("Created default instructor: instructor@skillbridge.com / InstructorPass123");
    }

    // 2. Loop through sample courses and seed if not already present
    for (const item of SAMPLE_COURSES) {
      const existingCourse = await Course.findOne({
        courseName: item.courseName,
      });

      if (existingCourse) {
        continue;
      }

      console.log(`Seeding course: "${item.courseName}"...`);

      // Find or create category
      let category = await Category.findOne({
        name: { $regex: new RegExp(`^${item.categoryName}$`, "i") },
      });

      if (!category) {
        category = await Category.create({
          name: item.categoryName,
          description: item.categoryDesc,
          courses: [],
        });
      }

      // Create Sections & Subsections
      const sectionIds = [];
      for (const sec of item.sections) {
        const subSectionIds = [];
        for (const sub of sec.subsections) {
          const createdSub = await SubSection.create({
            title: sub.title,
            description: sub.description,
            timeDuration: sub.timeDuration,
            videoUrl: sub.videoUrl,
          });
          subSectionIds.push(createdSub._id);
        }

        const createdSec = await Section.create({
          sectionName: sec.sectionName,
          subSection: subSectionIds,
        });
        sectionIds.push(createdSec._id);
      }

      // Create Course
      const newCourse = await Course.create({
        courseName: item.courseName,
        courseDescription: item.courseDescription,
        instructor: instructor._id,
        whatYouWillLearn: item.whatYouWillLearn,
        courseContent: sectionIds,
        ratingAndReviews: [],
        price: item.price,
        thumbnail: item.thumbnail,
        tag: item.tag,
        category: category._id,
        studentsEnrolled: [],
        instructions: item.instructions,
        status: "Published",
        createdAt: new Date(),
      });

      // Link course in category
      category.courses.push(newCourse._id);
      await category.save();

      // Link course in instructor
      instructor.courses = instructor.courses || [];
      instructor.courses.push(newCourse._id);
      await instructor.save();

      console.log(`Successfully seeded: "${item.courseName}" in category "${category.name}"`);
    }

    console.log("Course and category seeding complete.");
  } catch (error) {
    console.error("Course seed error:", error);
  }
};
