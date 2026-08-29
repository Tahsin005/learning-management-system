'use strict';

const { createStrapi, compileStrapi } = require('@strapi/strapi');

const courseSeeds = [
  {
    course: {
      title: 'React 19 Deep Dive: Hooks & Modern Patterns',
      description: '# React 19 Deep Dive\n\nMaster the new hooks and patterns introduced in React 19.\n\n### Highlights:\n- New Hooks (use, useFormStatus, useOptimistic)\n- Rules of Hooks\n- Building real-world components',
      instructorEmail: 'tahsin.ins@gmail.com',
    },
    lessons: [
      {
        title: '1. React 19 Full Course Overview',
        content: "# React 19 Full Course\n\nA complete walkthrough of React 19 fundamentals and what's changed since React 18.\n\n### Key Takeaways:\n- New JSX transform improvements\n- Actions and form handling\n- Building a real app end-to-end",
        videoUrl: 'https://www.youtube.com/watch?v=dCLhUialKPQ',
        order: 1,
      },
      {
        title: '2. Rules of Hooks',
        content: '# Rules of Hooks\n\nUnderstand the constraints that make hooks predictable and safe to use.\n\n### Best Practices:\n- Only call hooks at the top level\n- Only call hooks from React functions\n- Custom hook composition',
        videoUrl: 'https://www.youtube.com/watch?v=YdJPtx-ovWM',
        order: 2,
      },
    ],
    quiz: {
      title: 'Module 1: React 19 Basics Quiz',
      questions: [
        {
          questionText: 'Where can hooks be called according to the Rules of Hooks?',
          options: [
            'Anywhere in a component, including inside loops',
            'Only at the top level of a React function',
            'Only inside class components',
            'Only inside useEffect',
          ],
          correctAnswerIndex: 1,
        },
        {
          questionText: "What is a primary goal of React 19's new Actions API?",
          options: [
            'Replacing CSS with JS-in-CSS',
            'Simplifying form submission and pending/error state handling',
            'Removing the virtual DOM',
            'Deprecating JSX',
          ],
          correctAnswerIndex: 1,
        },
      ],
    },
  },
  {
    course: {
      title: 'Next.js 16: Full-Stack Fundamentals',
      description: '# Next.js 16 Full-Stack Fundamentals\n\nLearn to build full-stack apps with the App Router, Server Components, and Server Actions.\n\n### Highlights:\n- App Router & file-based routing\n- Data fetching strategies\n- Deployment on Vercel',
      instructorEmail: 'tahsin.ins@gmail.com',
    },
    lessons: [
      {
        title: '1. Next.js Crash Course',
        content: '# Next.js Crash Course\n\nAn introduction to Next.js fundamentals: SSR, SSG, routing, data fetching, and API routes.\n\n### Key Takeaways:\n- File-based routing\n- getServerSideProps vs getStaticProps concepts\n- Building and deploying a simple app',
        videoUrl: 'https://www.youtube.com/watch?v=mTz0GXj8NN0',
        order: 1,
      },
      {
        title: '2. Building & Deploying a Production App',
        content: '# Build and Deploy a Production-Ready App\n\nGo further with a full project build covering routing, data fetching, and deployment.\n\n### Best Practices:\n- Structuring a real project\n- Environment variables\n- Shipping to production',
        videoUrl: 'https://www.youtube.com/watch?v=Zq5fmkH0T78',
        order: 2,
      },
    ],
    quiz: {
      title: 'Module 1: Next.js Fundamentals Quiz',
      questions: [
        {
          questionText: 'What does Next.js use for routing by default in the App Router?',
          options: [
            'A central routes.config.js file',
            'File-based routing using the app/ directory',
            'XML route manifests',
            'Manual route registration in server.js',
          ],
          correctAnswerIndex: 1,
        },
        {
          questionText: 'Which platform is commonly used to deploy Next.js apps in these tutorials?',
          options: [
            'Heroku',
            'Vercel',
            'Netlify Functions only',
            'AWS Lambda manually',
          ],
          correctAnswerIndex: 1,
        },
      ],
    },
  },
  {
    course: {
      title: 'Node.js & Express: Building REST APIs',
      description: '# Node.js & Express\n\nLearn backend fundamentals and build REST APIs from scratch.\n\n### Highlights:\n- Node core modules\n- Express routing & middleware\n- Building a working API',
      instructorEmail: 'tahsin.ins@gmail.com',
    },
    lessons: [
      {
        title: '1. Node.js Crash Course',
        content: '# Node.js Crash Course\n\nCovers core Node.js modules, the HTTP module, NPM, and building a simple server.\n\n### Key Takeaways:\n- CommonJS vs ES modules\n- File System and Path modules\n- Building a basic HTTP server',
        videoUrl: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4',
        order: 1,
      },
      {
        title: '2. Express Crash Course',
        content: '# Express Crash Course\n\nLearn the most popular Node.js web framework and build a working API.\n\n### Best Practices:\n- Routing and middleware\n- Environment variables\n- Error handling',
        videoUrl: 'https://www.youtube.com/watch?v=CnH3kAXSrmU',
        order: 2,
      },
    ],
    quiz: {
      title: 'Module 1: Node & Express Quiz',
      questions: [
        {
          questionText: 'Which built-in Node.js module is used to create an HTTP server without Express?',
          options: ['fs', 'path', 'http', 'os'],
          correctAnswerIndex: 2,
        },
        {
          questionText: 'What is Express middleware primarily used for?',
          options: [
            'Compiling TypeScript',
            'Processing requests/responses in a pipeline before reaching route handlers',
            'Styling HTML templates',
            'Managing database migrations',
          ],
          correctAnswerIndex: 1,
        },
      ],
    },
  },
  {
    course: {
      title: 'Docker for Developers: Containerize Your Applications',
      description: '# Docker for Developers\n\nLearn to containerize applications for consistent development and deployment.\n\n### Highlights:\n- Images vs containers\n- Dockerfiles & docker-compose\n- Practical containerization workflows',
      instructorEmail: 'tahsin.ins@gmail.com',
    },
    lessons: [
      {
        title: '1. Docker Crash Course: All About Docker',
        content: '# Docker Crash Course\n\nAn introduction to Docker fundamentals: images, containers, and the Docker CLI.\n\n### Key Takeaways:\n- What problem Docker solves\n- Images vs containers\n- Basic Docker commands',
        videoUrl: 'https://www.youtube.com/watch?v=ay7Rdj7MQQA',
        order: 1,
      },
      {
        title: '2. Docker Crash Course for Beginners',
        content: '# Docker Crash Course for Beginners\n\nA hands-on walkthrough of Dockerfiles, images, containers, and Docker Hub.\n\n### Best Practices:\n- Writing efficient Dockerfiles\n- Managing volumes\n- Using docker-compose',
        videoUrl: 'https://www.youtube.com/watch?v=-eAkQsASIoc',
        order: 2,
      },
    ],
    quiz: {
      title: 'Module 1: Docker Basics Quiz',
      questions: [
        {
          questionText: 'What is the difference between a Docker image and a Docker container?',
          options: [
            'There is no difference, the terms are interchangeable',
            'An image is a running instance of a container',
            'A container is a running instance of an image',
            'Images only work on Linux, containers only on Windows',
          ],
          correctAnswerIndex: 2,
        },
        {
          questionText: 'Which file defines the steps to build a Docker image?',
          options: ['docker-compose.yml', 'Dockerfile', 'package.json', 'container.config'],
          correctAnswerIndex: 1,
        },
      ],
    },
  },
  {
    course: {
      title: 'PostgreSQL Database Mastery',
      description: '# PostgreSQL Database Mastery\n\nLearn relational database design and SQL using PostgreSQL.\n\n### Highlights:\n- Database & table design\n- Writing SQL queries\n- Constraints, joins, and keys',
      instructorEmail: 'tahsin.ins1@gmail.com',
    },
    lessons: [
      {
        title: '1. PostgreSQL Crash Course',
        content: '# PostgreSQL Crash Course\n\nLearn the fundamentals of PostgreSQL, from installation to writing your first queries.\n\n### Key Takeaways:\n- Installing PostgreSQL and pgAdmin\n- Creating databases and tables\n- Basic SELECT queries',
        videoUrl: 'https://www.youtube.com/watch?v=zw4s3Ey8ayo',
        order: 1,
      },
      {
        title: '2. PostgreSQL Introduction: Beginner Crash Course',
        content: '# PostgreSQL Introduction\n\nGo deeper into PostgreSQL fundamentals and hands-on database operations.\n\n### Best Practices:\n- Using constraints properly\n- Filtering with WHERE and comparison operators\n- Aggregate functions',
        videoUrl: 'https://www.youtube.com/watch?v=bssWKAX74uA',
        order: 2,
      },
    ],
    quiz: {
      title: 'Module 1: PostgreSQL Basics Quiz',
      questions: [
        {
          questionText: 'Which SQL clause is used to filter rows based on a condition?',
          options: ['GROUP BY', 'WHERE', 'ORDER BY', 'LIMIT'],
          correctAnswerIndex: 1,
        },
        {
          questionText: 'What kind of database management system is PostgreSQL?',
          options: [
            'A NoSQL document store',
            'An object-relational database management system',
            'A key-value cache',
            'A graph database',
          ],
          correctAnswerIndex: 1,
        },
      ],
    },
  },
  {
    course: {
      title: 'Git & GitHub Essentials for Developers',
      description: '# Git & GitHub Essentials\n\nLearn version control fundamentals and collaborative workflows.\n\n### Highlights:\n- Core Git commands\n- Branching & merging\n- Pull requests on GitHub',
      instructorEmail: 'tahsin.ins1@gmail.com',
    },
    lessons: [
      {
        title: '1. Git & GitHub Crash Course',
        content: '# Git & GitHub Crash Course\n\nLearn the fundamentals of Git version control and the GitHub platform.\n\n### Key Takeaways:\n- git init, add, commit, push\n- Working with remotes\n- Basic branching',
        videoUrl: 'https://www.youtube.com/watch?v=vA5TTz6BXhY',
        order: 1,
      },
      {
        title: '2. Git & GitHub Crash Course for Beginners',
        content: '# Git & GitHub for Beginners\n\nReal workflows including branching, merging, stashing, rebase, and pull requests.\n\n### Best Practices:\n- Writing clear commit messages\n- Resolving merge conflicts\n- Using pull requests for review',
        videoUrl: 'https://www.youtube.com/watch?v=mAFoROnOfHs',
        order: 2,
      },
    ],
    quiz: {
      title: 'Module 1: Git & GitHub Quiz',
      questions: [
        {
          questionText: 'Which command stages changes for the next commit?',
          options: ['git commit', 'git add', 'git push', 'git branch'],
          correctAnswerIndex: 1,
        },
        {
          questionText: 'On GitHub, what is used to propose merging changes from one branch into another?',
          options: ['A commit hook', 'A pull request', 'A gist', 'A fork tag'],
          correctAnswerIndex: 1,
        },
      ],
    },
  },
  {
    course: {
      title: 'TypeScript for Modern Web Development',
      description: '# TypeScript for Modern Web Development\n\nAdd static typing to your JavaScript projects for safer, more maintainable code.\n\n### Highlights:\n- Basic types & interfaces\n- Generics\n- TypeScript with React',
      instructorEmail: 'tahsin.ins@gmail.com',
    },
    lessons: [
      {
        title: '1. TypeScript Crash Course',
        content: '# TypeScript Crash Course\n\nLearn TypeScript fundamentals: types, interfaces, classes, and generics.\n\n### Key Takeaways:\n- Basic types, arrays, and tuples\n- Interfaces vs types\n- Type assertion',
        videoUrl: 'https://www.youtube.com/watch?v=BCg4U1FzODs',
        order: 1,
      },
      {
        title: '2. TypeScript Tutorial for Beginners',
        content: "# TypeScript Tutorial for Beginners\n\nA beginner-friendly walkthrough of TypeScript's type system and tooling.\n\n### Best Practices:\n- Configuring tsconfig.json\n- Using generics for reusable code\n- Integrating TypeScript with existing JS projects",
        videoUrl: 'https://www.youtube.com/watch?v=d56mG7DezGs',
        order: 2,
      },
    ],
    quiz: {
      title: 'Module 1: TypeScript Basics Quiz',
      questions: [
        {
          questionText: 'What is the main benefit TypeScript adds on top of JavaScript?',
          options: [
            'A new runtime that replaces Node.js',
            'Static typing checked at compile time',
            'Built-in database access',
            'Automatic UI rendering',
          ],
          correctAnswerIndex: 1,
        },
        {
          questionText: 'Which TypeScript feature allows writing reusable components that work with multiple types?',
          options: ['Enums', 'Generics', 'Tuples', 'Namespaces'],
          correctAnswerIndex: 1,
        },
      ],
    },
  },
  {
    course: {
      title: 'Django REST Framework: Building APIs with Python',
      description: '# Django REST Framework\n\nBuild robust REST APIs quickly using Django and Django REST Framework.\n\n### Highlights:\n- Serializers & viewsets\n- Routers\n- Authentication & permissions',
      instructorEmail: 'tahsin.ins1@gmail.com',
    },
    lessons: [
      {
        title: '1. Django REST Framework Crash Course',
        content: '# Django REST Framework Crash Course\n\nLearn to build and deploy a REST API with Django REST Framework.\n\n### Key Takeaways:\n- Setting up DRF in a Django project\n- Serializers\n- Basic CRUD endpoints',
        videoUrl: 'https://www.youtube.com/watch?v=Mj3dGdBdiO4',
        order: 1,
      },
      {
        title: '2. Django REST Framework Full Crash Course',
        content: '# Django REST Framework Full Crash Course\n\nBuild REST APIs in Django using DRF viewsets and routers.\n\n### Best Practices:\n- Using ModelViewSets\n- Wiring up routers\n- Testing endpoints with Postman',
        videoUrl: 'https://www.youtube.com/watch?v=wv8b3tzShq4',
        order: 2,
      },
    ],
    quiz: {
      title: 'Module 1: Django REST Framework Quiz',
      questions: [
        {
          questionText: 'What does a DRF serializer primarily do?',
          options: [
            'Converts complex data like querysets into JSON and validates input data',
            'Handles database migrations',
            'Renders HTML templates',
            'Manages static files',
          ],
          correctAnswerIndex: 0,
        },
        {
          questionText: 'What DRF component automatically generates URL patterns for a ViewSet?',
          options: ['Serializer', 'Router', 'Middleware', 'Signal'],
          correctAnswerIndex: 1,
        },
      ],
    },
  },
  {
    course: {
      title: 'Go (Golang) for Backend Developers',
      description: '# Go (Golang) for Backend Developers\n\nLearn the Go programming language fundamentals for building fast backend services.\n\n### Highlights:\n- Syntax, types, and structs\n- Goroutines & concurrency basics\n- Building simple web servers',
      instructorEmail: 'tahsin.ins@gmail.com',
    },
    lessons: [
      {
        title: '1. Go / Golang Crash Course',
        content: '# Go / Golang Crash Course\n\nA comprehensive introduction to Go: variables, slices, conditionals, maps, and structs.\n\n### Key Takeaways:\n- Workspace setup and Hello World\n- Arrays, slices, and maps\n- Structs and interfaces',
        videoUrl: 'https://www.youtube.com/watch?v=SqrbIlUwR0U',
        order: 1,
      },
      {
        title: '2. Golang Crash Course for Beginners',
        content: '# Golang Crash Course for Beginners\n\nContinue building Go fundamentals with practical examples.\n\n### Best Practices:\n- Writing idiomatic Go\n- Error handling patterns\n- Using pointers effectively',
        videoUrl: 'https://www.youtube.com/watch?v=JwAnZeQAaGQ',
        order: 2,
      },
    ],
    quiz: {
      title: 'Module 1: Go Basics Quiz',
      questions: [
        {
          questionText: 'What keyword is used to declare a variable with an inferred type in Go?',
          options: ['var x = 5 only', 'x := 5', 'let x = 5', 'const x = 5 only'],
          correctAnswerIndex: 1,
        },
        {
          questionText: "What is idiomatic Go's approach to error handling?",
          options: [
            'try/catch blocks',
            'Returning error values explicitly and checking them',
            'Throwing exceptions',
            'Ignoring errors by default',
          ],
          correctAnswerIndex: 1,
        },
      ],
    },
  },
  {
    course: {
      title: 'DevOps Fundamentals: Docker, Terraform & CI/CD',
      description: '# DevOps Fundamentals\n\nLearn essential DevOps and cloud infrastructure concepts.\n\n### Highlights:\n- Containers with Docker\n- Infrastructure as Code with Terraform\n- CI/CD with GitHub Actions',
      instructorEmail: 'tahsin.ins1@gmail.com',
    },
    lessons: [
      {
        title: '1. DevOps Crash Course: Docker, Terraform, GitHub Actions',
        content: '# DevOps Crash Course\n\nAn overview of Docker containers, Infrastructure as Code, and CI/CD pipelines.\n\n### Key Takeaways:\n- Dockerizing applications\n- Terraform basics for provisioning infrastructure\n- Automating deployments with GitHub Actions',
        videoUrl: 'https://www.youtube.com/watch?v=OXE2a8dqIAI',
        order: 1,
      },
      {
        title: '2. Docker Tutorial: Crash Course',
        content: '# Docker Tutorial Crash Course\n\nA focused look at building, shipping, and running distributed applications with Docker.\n\n### Best Practices:\n- Multi-stage builds\n- Networking between containers\n- Managing environment configuration',
        videoUrl: 'https://www.youtube.com/watch?v=ccbh5YhxouQ',
        order: 2,
      },
    ],
    quiz: {
      title: 'Module 1: DevOps Fundamentals Quiz',
      questions: [
        {
          questionText: 'What is the main purpose of Infrastructure as Code tools like Terraform?',
          options: [
            'Writing frontend UI components',
            'Provisioning and managing infrastructure through declarative config files',
            'Compiling application source code',
            'Replacing version control systems',
          ],
          correctAnswerIndex: 1,
        },
        {
          questionText: 'What does CI/CD stand for in a DevOps workflow?',
          options: [
            'Code Integration / Code Deployment',
            'Continuous Integration / Continuous Deployment',
            'Container Isolation / Container Delivery',
            'Cloud Infrastructure / Cloud Deployment',
          ],
          correctAnswerIndex: 1,
        },
      ],
    },
  },
];

async function seedDatabase() {
  const appContext = await compileStrapi();
  const strapi = await createStrapi(appContext).load();
  strapi.log.level = 'info';

  console.log('Starting LMS Database Seed & User Provisioning...');

  try {
    const getRole = async (type) => {
      let role = await strapi.query('plugin::users-permissions.role').findOne({ where: { type } });
      if (!role) {
        role = await strapi.query('plugin::users-permissions.role').findOne({ where: { name: type } });
      }
      return role;
    };

    const adminRole = await getRole('admin');
    const cmRole = await getRole('content_manager');
    const instructorRole = await getRole('instructor');
    const studentRole = await getRole('student');

    if (!adminRole || !cmRole || !instructorRole || !studentRole) {
      throw new Error(
        `Required roles missing for seeding. Found: ${JSON.stringify({
          admin: adminRole?.id,
          content_manager: cmRole?.id,
          instructor: instructorRole?.id,
          student: studentRole?.id,
        })}`
      );
    }

    console.log('Roles verified successfully.');

    console.log('Purging existing data (quiz results, progresses, enrollments, quizzes, lessons, courses, blogs, users)...');

    const allQuizResults = await strapi.documents('api::quiz-result.quiz-result').findMany({});
    for (const r of allQuizResults) {
      await strapi.documents('api::quiz-result.quiz-result').delete({ documentId: r.documentId });
    }

    const allProgress = await strapi.documents('api::lesson-progress.lesson-progress').findMany({});
    for (const p of allProgress) {
      await strapi.documents('api::lesson-progress.lesson-progress').delete({ documentId: p.documentId });
    }

    const allEnrollments = await strapi.documents('api::enrollment.enrollment').findMany({});
    for (const e of allEnrollments) {
      await strapi.documents('api::enrollment.enrollment').delete({ documentId: e.documentId });
    }

    const allQuizzes = await strapi.documents('api::quiz.quiz').findMany({});
    for (const q of allQuizzes) {
      await strapi.documents('api::quiz.quiz').delete({ documentId: q.documentId });
    }

    const allLessons = await strapi.documents('api::lesson.lesson').findMany({});
    for (const l of allLessons) {
      await strapi.documents('api::lesson.lesson').delete({ documentId: l.documentId });
    }

    const allCourses = await strapi.documents('api::course.course').findMany({});
    for (const c of allCourses) {
      await strapi.documents('api::course.course').delete({ documentId: c.documentId });
    }

    try {
      const allBlogs = await strapi.documents('api::blog-post.blog-post').findMany({});
      for (const b of allBlogs) {
        await strapi.documents('api::blog-post.blog-post').delete({ documentId: b.documentId });
      }
    } catch {
      // ignore
    }

    const allUsers = await strapi.query('plugin::users-permissions.user').findMany({});
    console.log(`Purging ${allUsers.length} existing user records...`);
    for (const u of allUsers) {
      await strapi.query('plugin::users-permissions.user').delete({ where: { id: u.id } });
    }

    const defaultSeedPassword = process.env.SEED_DEFAULT_PASSWORD || 'Tahsin005';

    console.log('Provisioning fresh standard users...');
    const createUser = async ({ username, email, password = defaultSeedPassword, roleId }) => {
      console.log(`Creating user: ${username}`);
      return strapi.plugin('users-permissions').service('user').add({
        username,
        email: email.toLowerCase(),
        password,
        role: roleId,
        provider: 'local',
        confirmed: true,
        blocked: false,
      });
    };

    const adminUser = await createUser({
      username: 'tahsin_admin',
      email: 'tahsin.admin@gmail.com',
      roleId: adminRole.id,
    });

    const cmUser = await createUser({
      username: 'tahsin_content',
      email: 'tahsin.con@gmail.com',
      roleId: cmRole.id,
    });

    const instructor1 = await createUser({
      username: 'tahsin_instructor',
      email: 'tahsin.ins@gmail.com',
      roleId: instructorRole.id,
    });

    const instructor2 = await createUser({
      username: 'tahsin_instructor_lead',
      email: 'tahsin.ins1@gmail.com',
      roleId: instructorRole.id,
    });

    const studentUser = await createUser({
      username: 'tahsin_student',
      email: 'tahsin.stu@gmail.com',
      roleId: studentRole.id,
    });

    const userMap = {
      'tahsin.ins@gmail.com': instructor1,
      'tahsin.ins1@gmail.com': instructor2,
      'tahsin.admin@gmail.com': adminUser,
      'tahsin.con@gmail.com': cmUser,
    };

    console.log('All standard users provisioned cleanly.');
    console.log(`Seeding ${courseSeeds.length} rich courses, lessons, and quizzes...`);

    const createdCourses = [];

    for (const item of courseSeeds) {
      const instructor = userMap[item.course.instructorEmail] || instructor1;

      const courseDoc = await strapi.documents('api::course.course').create({
        data: {
          title: item.course.title,
          description: item.course.description,
          owner: instructor.id,
        },
      });

      createdCourses.push(courseDoc);

      for (const l of item.lessons) {
        await strapi.documents('api::lesson.lesson').create({
          data: {
            title: l.title,
            content: l.content,
            videoUrl: l.videoUrl,
            order: l.order,
            course: courseDoc.documentId,
          },
        });
      }

      if (item.quiz) {
        await strapi.documents('api::quiz.quiz').create({
          data: {
            title: item.quiz.title,
            course: courseDoc.documentId,
            questions: item.quiz.questions,
          },
        });
      }
    }

    console.log('Enrolling tahsin_student in Course 1 with progress records...');
    if (createdCourses.length > 0) {
      const firstCourse = createdCourses[0];
      await strapi.documents('api::enrollment.enrollment').create({
        data: {
          student: studentUser.id,
          course: firstCourse.documentId,
          enrolledAt: new Date(),
        },
      });

      const firstCourseLessons = await strapi.documents('api::lesson.lesson').findMany({
        filters: { course: { documentId: firstCourse.documentId } },
      });

      if (firstCourseLessons.length > 0) {
        await strapi.documents('api::lesson-progress.lesson-progress').create({
          data: {
            student: studentUser.id,
            lesson: firstCourseLessons[0].documentId,
            completed: true,
            completedAt: new Date(),
          },
        });
      }
    }

    console.log('Seeding editorial blog posts (published and draft articles)...');

    await strapi.documents('api::blog-post.blog-post').create({
      data: {
        title: 'The Future of Full-Stack Architecture: React 19 & Next.js 16 Paradigms',
        body: `# The Future of Full-Stack Architecture: React 19 & Next.js 16 Paradigms

The JavaScript and TypeScript ecosystem has reached a defining milestone with the release of **Next.js 16** and **React 19**. 

---

### Key Architectural Shifts

1. **React Server Components (RSC)**: Compute happens where the data lives. By rendering on the server by default, client bundle sizes drop dramatically while time-to-interactive accelerates.
2. **Server Actions as First-Class RPC**: Mutating database entities directly from UI form components without writing boilerplate Express or NestJS controllers simplifies developer ergonomics.
3. **Streaming SSR with Suspense**: Instead of blocking entire page renders on slow queries, components stream to the client incrementally as data resolves.

\`\`\`typescript
// Example: Async Server Component streaming data directly
export default async function CourseCatalogPage() {
  const courses = await db.course.findMany({ include: { lessons: true } });
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {courses.map((c) => (
        <CourseCard key={c.id} course={c} />
      ))}
    </div>
  );
}
\`\`\`

### Production Takeaways
When architecting enterprise-grade applications, combine RSC with client-side optimistic UI updates for instantaneous user perception and flawless data consistency.`,
        coverImageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
        author: cmUser.id,
        publishedAt: new Date(),
      },
    });

    await strapi.documents('api::blog-post.blog-post').create({
      data: {
        title: 'Demystifying Role-Based Access Control in Headless CMS Systems',
        body: `# Demystifying Role-Based Access Control in Headless CMS Systems

Building secure, scalable multi-tenant platforms requires strict separation of concerns across user tiers: **Administrators**, **Content Managers**, **Instructors**, and **Students**.

---

### The 3 Golden Rules of RBAC

1. **Never Trust the Client**: Hiding a button or disabling an input on the frontend provides zero security. Every mutation must be authorized at the controller or middleware policy layer.
2. **Context-Aware Ownership Checks**: An instructor can edit courses, but only courses where \`course.owner.id === user.id\`. Content managers and admins bypass ownership constraints to maintain the platform-wide library.
3. **Draft vs. Published Isolation**: Unreleased content should never leak to public queries. Enforce publication status filters at the database engine level.

\`\`\`javascript
// Backend policy enforcing owner isolation
if (role === 'Instructor' && course.owner.id !== user.id) {
  throw new ForbiddenError('You can only modify courses you own.');
}
\`\`\`

By codifying these policies directly into the CMS lifecycle, platform integrity remains uncompromised.`,
        coverImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
        author: cmUser.id,
        publishedAt: new Date(),
      },
    });

    await strapi.documents('api::blog-post.blog-post').create({
      data: {
        title: 'Mastering Database Query Optimization & Indexing Strategies',
        body: `# Mastering Database Query Optimization & Indexing Strategies

As application data scales from thousands to millions of rows, database performance becomes the primary bottleneck for user experience.

---

### Effective Indexing Strategies

- **B-Tree Indexes**: Default for equality and range comparisons on primary keys and foreign keys.
- **Composite Indexes**: When querying multiple columns simultaneously (e.g., \`WHERE student_id = ? AND course_id = ?\`), compound indexes eliminate multi-table scans.
- **Partial Indexes**: Index only active or published records to minimize storage overhead and memory cache footprint.

\`\`\`sql
-- Creating composite index on enrollment progress
CREATE INDEX idx_student_lesson_progress ON lesson_progresses (student_id, lesson_id) WHERE completed = true;
\`\`\`

Regularly profile your queries using \`EXPLAIN ANALYZE\` to ensure query plans leverage index scans rather than expensive sequential table scans.`,
        coverImageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&auto=format&fit=crop&q=80',
        author: adminUser.id,
        publishedAt: new Date(),
      },
    });

    await strapi.documents('api::blog-post.blog-post').create({
      data: {
        title: '[DRAFT] Upcoming LMS Platform Features: Live Peer Code Review & AI Tutoring',
        body: `# [DRAFT] Upcoming LMS Platform Features: Live Peer Code Review & AI Tutoring

> *Notice: This is an internal product draft undergoing editorial review by the Content Management team.*

---

### What's Coming in Q4

1. **Interactive Peer Code Review**: Students can submit GitHub repository URLs for algorithmic assignments and receive structured peer feedback.
2. **Context-Aware AI Tutoring**: Instant code debugging assistance trained directly on course lecture slides and video transcripts.
3. **Gamified Learning Streaks**: Weekly cohort leaderboards and milestone badges to boost completion rates.

Stay tuned for our upcoming public beta announcement!`,
        coverImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
        author: cmUser.id,
        publishedAt: null,
      },
    });

    console.log(`LMS Database successfully seeded with ${courseSeeds.length} rich courses, lessons, quizzes, and editorial blogs!`);
  } catch (err) {
    console.error('Error during LMS database seeding:', err);
    throw err;
  } finally {
    await strapi.destroy();
  }
}

seedDatabase()
  .then(() => {
    console.log('Seed process completed cleanly.');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
