'use strict';

const { createStrapi, compileStrapi } = require('@strapi/strapi');

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
      // ignore if blog-post is not yet populated
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

    console.log('All standard users provisioned cleanly.');
    console.log('Seeding production-ready courses with rich markdown and valid video embeds...');

    const course1 = await strapi.documents('api::course.course').create({
      data: {
        title: 'Full-Stack Next.js 16 & React 19 Architecture',
        description: 'Master the complete lifecycle of modern full-stack web applications with Next.js 16 App Router and React 19. Dive deep into React Server Components (RSC), asynchronous Server Actions, edge middleware proxies, streaming SSR with Suspense, and Turbopack production builds. Perfect for frontend engineers transitioning into full-stack architects.',
        owner: instructor1.id,
      },
    });

    const c1Lesson1 = await strapi.documents('api::lesson.lesson').create({
      data: {
        title: '1. Next.js 16 App Router & RSC Deep Dive',
        content: `# Next.js 16 App Router & Server Components

Welcome to the Next.js 16 masterclass! In this introductory lesson, we explore the core building blocks of the App Router and React 19 architecture.

---

### Key Concepts Covered:
- **Server Components by Default**: Zero-bundle-size React components rendered exclusively on the server.
- **Client Components (\`use client\`)**: Interactive client boundaries for local state and event listeners.
- **Streaming & Suspense**: Progressively rendering UI chunks as data resolves from remote APIs.

### Code Example:
\`\`\`tsx
// app/courses/page.tsx (Server Component)
import { Suspense } from 'react';
import { CourseList } from '@/components/courses/course-list';
import { CourseSkeleton } from '@/components/courses/course-skeleton';

export default async function CoursesPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Available Courses</h1>
      <Suspense fallback={<CourseSkeleton />}>
        <CourseList />
      </Suspense>
    </main>
  );
}
\`\`\`

### Architectural Principles:
1. **Push State to the Leaves**: Keep stateful interactive components as far down the component tree as possible.
2. **Parallel Data Fetching**: Eliminate network waterfalls by initiating requests simultaneously using \`Promise.all()\`.
3. **Automatic Code Splitting**: Client components are automatically split into separate bundle chunks.`,
        videoUrl: 'https://www.youtube.com/watch?v=ZVnjOPwW4ZA',
        order: 1,
        course: course1.documentId,
      },
    });

    const c1Lesson2 = await strapi.documents('api::lesson.lesson').create({
      data: {
        title: '2. Server Actions, Mutations & Optimistic State',
        content: `# Server Actions & Data Mutations

Server Actions allow you to run asynchronous server code directly from forms and event handlers without maintaining ad-hoc API route handlers.

---

### Anatomy of a Server Action:
\`\`\`typescript
'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

export async function enrollInCourse(courseId: string, studentId: string) {
  if (!studentId) {
    throw new Error('Authentication required');
  }

  const enrollment = await db.enrollment.create({
    data: {
      courseId,
      studentId,
      enrolledAt: new Date(),
    },
  });

  // Purge cached course page so UI reflects enrolled status immediately
  revalidatePath(\`/courses/\${courseId}\`);
  return { success: true, enrollment };
}
\`\`\`

### Key Advantages:
- **Progressive Enhancement**: Forms work even if JavaScript fails to load on slow mobile connections.
- **Built-in CSRF Protection**: Next.js automatically validates request origins and tokens.
- **Optimistic UI**: Pair Server Actions with React 19's \`useOptimistic\` hook for instant user feedback.`,
        videoUrl: 'https://www.youtube.com/watch?v=843nec-IvW0',
        order: 2,
        course: course1.documentId,
      },
    });

    const c1Lesson3 = await strapi.documents('api::lesson.lesson').create({
      data: {
        title: '3. Edge Proxy, Authentication & Session Security',
        content: `# Edge Proxy & Authentication Security

Learn how to securely manage session tokens, HttpOnly cookies, and role-based route guards at the network edge using Next.js 16 Proxy layer.

---

### Token Rotation Strategy:
1. **Access Token**: Short-lived (15 minutes), stored in memory or secure HttpOnly cookie.
2. **Refresh Token**: Long-lived (30 days), stored in an \`HttpOnly\`, \`SameSite=Lax\`, \`Secure\` cookie.
3. **Edge Validation**: Proxy intercepts requests to protected routes (\`/dashboard\`, \`/courses/:id/lessons/:id\`) and validates authorization before rendering.

\`\`\`typescript
// proxy.ts (Next.js Edge Proxy)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('jwt')?.value;
  const isAuthRoute = request.nextUrl.pathname.startsWith('/dashboard');

  if (isAuthRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
\`\`\``,
        videoUrl: 'https://www.youtube.com/watch?v=ZVnjOPwW4ZA',
        order: 3,
        course: course1.documentId,
      },
    });

    const c1Lesson4 = await strapi.documents('api::lesson.lesson').create({
      data: {
        title: '4. Turbopack, Streaming Suspense & Caching Lifecycles',
        content: `# Turbopack & Production Optimizations

Explore the speed of the Turbopack engine in Next.js 16 and optimize production builds with font subsets, script offloading, and cache tagging.

---

### Four Levels of Next.js Caching:
| Layer | Where | Purpose | Duration |
| :--- | :--- | :--- | :--- |
| **Request Memoization** | Server | Deduplicates \`fetch\` calls during a single render pass | Per-request |
| **Data Cache** | Server | Persists API data across incoming user requests | Configurable (\`revalidate\`) |
| **Full Route Cache** | Server | Caches HTML and RSC payload at build time | Until revalidated |
| **Router Cache** | Client | In-memory cache in the browser for fast client navigation | Session |

### Revalidation Example:
\`\`\`typescript
// Revalidating specific data tags on demand
import { revalidateTag } from 'next/cache';

export async function publishCourse(courseId: string) {
  await api.publish(courseId);
  revalidateTag('course-list');
}
\`\`\``,
        videoUrl: 'https://www.youtube.com/watch?v=843nec-IvW0',
        order: 4,
        course: course1.documentId,
      },
    });

    await strapi.documents('api::quiz.quiz').create({
      data: {
        title: 'Next.js 16 Architecture & Server Components Assessment',
        course: course1.documentId,
        questions: [
          {
            questionText: 'By default, all components inside the Next.js App Router are:',
            options: [
              'Client Components',
              'React Server Components (RSC)',
              'Static HTML templates only',
              'Web Workers',
            ],
            correctAnswerIndex: 1,
          },
          {
            questionText: 'Which directive marks an asynchronous function as a Server Action?',
            options: ['"use server"', '"use client"', '"use backend"', '"use api"'],
            correctAnswerIndex: 0,
          },
          {
            questionText: 'What is the primary architectural benefit of React Server Components?',
            options: [
              'They can handle browser DOM click events directly',
              'They do not ship any JavaScript bundle to the client, drastically reducing download size',
              'They replace CSS styling completely',
              'They disable server-side rendering',
            ],
            correctAnswerIndex: 1,
          },
          {
            questionText: 'Which function is used to invalidate and purge cached page data in Server Actions?',
            options: ['revalidatePath()', 'refreshRoute()', 'purgeCache()', 'reloadServer()'],
            correctAnswerIndex: 0,
          },
        ],
      },
    });

    const course2 = await strapi.documents('api::course.course').create({
      data: {
        title: 'Advanced TypeScript 5 & Enterprise Design Patterns',
        description: 'Take your TypeScript skills from intermediate to staff engineer level. Learn type-level programming, conditional types, template literal types, mapped types, advanced generics, and enterprise object-oriented design patterns including Dependency Injection, Factory, and Strategy patterns for mission-critical software systems.',
        owner: instructor1.id,
      },
    });

    await strapi.documents('api::lesson.lesson').create({
      data: {
        title: '1. Type-Level Programming & Conditional Types',
        content: `# Type-Level Programming in TypeScript 5

Master type transformations using conditional types, the \`infer\` keyword, and recursive type definitions.

---

### Conditional Type Syntax:
\`\`\`typescript
type TypeName<T> =
  T extends string ? "string" :
  T extends number ? "number" :
  T extends boolean ? "boolean" :
  T extends undefined ? "undefined" :
  T extends Function ? "function" :
  "object";

// Unpack Promise Return Type using infer
type UnpackPromise<T> = T extends Promise<infer R> ? R : T;

type Example = UnpackPromise<Promise<{ id: string; name: string }>>;
// Resolved type: { id: string; name: string }
\`\`\`

### Practical Use Case:
Conditional types allow you to build strictly typed API client builders that dynamically infer response structures based on the endpoint route.`,
        videoUrl: 'https://www.youtube.com/watch?v=30LWjhZzg50',
        order: 1,
        course: course2.documentId,
      },
    });

    await strapi.documents('api::lesson.lesson').create({
      data: {
        title: '2. Advanced Generics & Mapped Utility Types',
        content: `# Advanced Generics & Mapped Utility Types

Learn how to construct custom utility types that enforce immutability, make nested properties optional, or filter object keys dynamically.

---

### Deep Readonly Implementation:
\`\`\`typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

interface UserConfig {
  theme: {
    colors: {
      primary: string;
      secondary: string;
    };
  };
}

const config: DeepReadonly<UserConfig> = {
  theme: {
    colors: {
      primary: '#6366f1',
      secondary: '#10b981',
    },
  },
};

// config.theme.colors.primary = '#000'; // Error: Cannot assign to read only property
\`\`\``,
        videoUrl: 'https://www.youtube.com/watch?v=gieEQFIfgYc',
        order: 2,
        course: course2.documentId,
      },
    });

    await strapi.documents('api::lesson.lesson').create({
      data: {
        title: '3. Dependency Injection & Clean Architecture',
        content: `# Dependency Injection & Clean Architecture

Structure large-scale enterprise applications using loose coupling, interface contracts, and inversion of control.

---

### Strategy Pattern in TypeScript:
\`\`\`typescript
interface PaymentGateway {
  charge(amount: number, currency: string): Promise<boolean>;
}

class StripeGateway implements PaymentGateway {
  async charge(amount: number, currency: string): Promise<boolean> {
    console.log(\`Charging \${amount} \${currency} via Stripe\`);
    return true;
  }
}

class CheckoutService {
  constructor(private gateway: PaymentGateway) {}

  async processOrder(total: number) {
    return this.gateway.charge(total, 'USD');
  }
}
\`\`\``,
        videoUrl: 'https://www.youtube.com/watch?v=30LWjhZzg50',
        order: 3,
        course: course2.documentId,
      },
    });

    await strapi.documents('api::quiz.quiz').create({
      data: {
        title: 'TypeScript Type-Level Mastery Assessment',
        course: course2.documentId,
        questions: [
          {
            questionText: 'What keyword is used in TypeScript conditional types to deduce an inner type parameter?',
            options: ['infer', 'extract', 'deduce', 'yield'],
            correctAnswerIndex: 0,
          },
          {
            questionText: 'Which utility type constructs a type with all properties of T set to optional?',
            options: ['Partial<T>', 'Required<T>', 'Readonly<T>', 'Record<K, T>'],
            correctAnswerIndex: 0,
          },
          {
            questionText: 'In Dependency Injection, high-level modules should depend upon:',
            options: [
              'Concrete implementations directly',
              'Abstractions and interfaces',
              'Global state variables',
              'DOM elements',
            ],
            correctAnswerIndex: 1,
          },
        ],
      },
    });

    const course3 = await strapi.documents('api::course.course').create({
      data: {
        title: 'Headless CMS Masterclass: Strapi v5 Enterprise',
        description: 'Architect and scale enterprise-grade headless content platforms with Strapi v5. Learn how to configure custom Document Services, craft robust Role-Based Access Control (RBAC) policies, build secure server-side auto-grading engines, manage relational lifecycles, and deploy to Railway production environments with zero downtime.',
        owner: instructor2.id,
      },
    });

    await strapi.documents('api::lesson.lesson').create({
      data: {
        title: '1. Strapi v5 Document Service & Architecture',
        content: `# Document Service API in Strapi v5

In Strapi v5, \`strapi.documents\` replaces the legacy Entity Service for typed document manipulation and automated draft/publish lifecycle states.

---

### Querying Documents:
\`\`\`javascript
// Fetch published courses with populated relations
const courses = await strapi.documents('api::course.course').findMany({
  filters: { publishedAt: { $ne: null } },
  populate: ['owner', 'lessons', 'quizzes'],
  sort: { createdAt: 'desc' },
});
\`\`\`

### Document vs Entity Service:
- **Unified Draft & Publish**: Manage draft states cleanly without separate database tables.
- **Stable DocumentId**: The \`documentId\` string remains constant across draft and published versions, while numeric \`id\` represents the specific version row.`,
        videoUrl: 'https://www.youtube.com/watch?v=6FnwAbd2SDY',
        order: 1,
        course: course3.documentId,
      },
    });

    await strapi.documents('api::lesson.lesson').create({
      data: {
        title: '2. Role-Based Access Control (RBAC) & Custom Policies',
        content: `# Custom RBAC Policies & Security Shield

Learn how to write custom policies for fine-grained authorization and prevent unauthorized data leaks.

---

### Creating an Enrollment Policy:
\`\`\`javascript
// src/api/lesson/policies/is-enrolled.js
module.exports = async (policyContext, config, { strapi }) => {
  const user = policyContext.state.user;
  if (!user) return false;

  const lessonId = policyContext.params.id;
  const lesson = await strapi.documents('api::lesson.lesson').findOne({
    documentId: lessonId,
    populate: ['course'],
  });

  if (!lesson || !lesson.course) return false;

  const enrollment = await strapi.documents('api::enrollment.enrollment').findFirst({
    filters: {
      student: { id: user.id },
      course: { documentId: lesson.course.documentId },
    },
  });

  return !!enrollment;
};
\`\`\``,
        videoUrl: 'https://www.youtube.com/watch?v=vfnv_tQyL2A',
        order: 2,
        course: course3.documentId,
      },
    });

    await strapi.documents('api::lesson.lesson').create({
      data: {
        title: '3. Lifecycle Hooks & Custom Controller Pipelines',
        content: `# Lifecycle Hooks & Custom Controller Pipelines

Extend Strapi controllers with custom business logic such as automated score grading and submission auditing.

---

### Auto-Grading Pattern:
\`\`\`javascript
// src/api/quiz-result/controllers/quiz-result.js
module.exports = createCoreController('api::quiz-result.quiz-result', ({ strapi }) => ({
  async submit(ctx) {
    const { user } = ctx.state;
    const { quizId, answers } = ctx.request.body.data;

    // 1. Fetch official answer key from database (server-side only)
    const quiz = await strapi.documents('api::quiz.quiz').findOne({
      documentId: quizId,
      populate: ['questions'],
    });

    // 2. Evaluate score securely
    let score = 0;
    const detailed = quiz.questions.map((q, idx) => {
      const studentAns = answers.find(a => a.questionIndex === idx);
      const isCorrect = studentAns?.selectedOptionIndex === q.correctAnswerIndex;
      if (isCorrect) score++;
      return { questionText: q.questionText, isCorrect };
    });

    // 3. Save result
    return strapi.documents('api::quiz-result.quiz-result').create({
      data: { student: user.id, quiz: quizId, score, answers: detailed },
    });
  },
}));
\`\`\``,
        videoUrl: 'https://www.youtube.com/watch?v=6FnwAbd2SDY',
        order: 3,
        course: course3.documentId,
      },
    });

    await strapi.documents('api::quiz.quiz').create({
      data: {
        title: 'Strapi v5 Core Concepts & Security Assessment',
        course: course3.documentId,
        questions: [
          {
            questionText: 'Which API in Strapi v5 is the official standard for managing document lifecycles?',
            options: ['strapi.documents', 'strapi.entityService', 'strapi.db.query', 'strapi.orm'],
            correctAnswerIndex: 0,
          },
          {
            questionText: 'Where are custom route security checks placed in Strapi?',
            options: ['In policies and custom controller handlers', 'In frontend CSS', 'In next.config.ts only', 'In the public folder'],
            correctAnswerIndex: 0,
          },
          {
            questionText: 'What is the purpose of documentId in Strapi v5?',
            options: [
              'It provides a permanent identifier across draft and published versions',
              'It stores user passwords',
              'It generates random UUIDs for images only',
              'It replaces the database port number',
            ],
            correctAnswerIndex: 0,
          },
        ],
      },
    });

    const course4 = await strapi.documents('api::course.course').create({
      data: {
        title: 'Modern CSS, Tailwind CSS v4 & Design Systems',
        description: 'Build fluid, responsive, accessible, and visually stunning web interfaces using Tailwind CSS v4 and modern CSS features like CSS subgrid, container queries, and CSS variables. Learn how to construct design tokens, dark mode palettes, and component libraries with micro-animations.',
        owner: instructor2.id,
      },
    });

    await strapi.documents('api::lesson.lesson').create({
      data: {
        title: '1. Tailwind CSS v4 Architecture & CSS Variables',
        content: `# Tailwind CSS v4 Architecture

Explore the high-performance Rust-powered Tailwind CSS v4 engine and its unified CSS-first configuration.

---

### Core Enhancements:
- **No \`tailwind.config.js\` needed**: Configure themes directly inside CSS using \`@theme\` directives.
- **Native CSS Variables**: First-class color tokens with OKLCH color space for vibrant gamuts.
- **Lightning Fast Compilation**: Instant hot-module replacement via Lightning CSS.

\`\`\`css
@import "tailwindcss";

@theme {
  --color-brand-500: oklch(0.65 0.24 264.4);
  --font-display: "Outfit", sans-serif;
}
\`\`\``,
        videoUrl: 'https://www.youtube.com/watch?v=ft30zcMlFao',
        order: 1,
        course: course4.documentId,
      },
    });

    await strapi.documents('api::lesson.lesson').create({
      data: {
        title: '2. Design Tokens, Dark Modes & Fluid Typography',
        content: `# Design Tokens & Fluid Typography

Implement robust dark mode color tokens using CSS variables and HSL/OKLCH color models.

---

### Dark Mode Token Pattern:
\`\`\`css
:root {
  --background: hsl(0 0% 100%);
  --foreground: hsl(240 10% 3.9%);
  --card: hsl(0 0% 100%);
  --primary: hsl(240 5.9% 10%);
}

.dark {
  --background: hsl(240 10% 3.9%);
  --foreground: hsl(0 0% 98%);
  --card: hsl(240 10% 4.9%);
  --primary: hsl(0 0% 98%);
}
\`\`\``,
        videoUrl: 'https://www.youtube.com/watch?v=lCxcTsOHrjo',
        order: 2,
        course: course4.documentId,
      },
    });

    await strapi.documents('api::lesson.lesson').create({
      data: {
        title: '3. Accessible Components & Micro-Animations',
        content: `# Accessible Components & Micro-Animations

Create interactive UI components with smooth micro-animations and full keyboard accessibility.

---

### Micro-Animation Best Practices:
- Keep transitions between **150ms and 250ms** for crisp, responsive user feedback.
- Use \`cubic-bezier(0.16, 1, 0.3, 1)\` easing curves for natural organic motion.
- Respect \`prefers-reduced-motion\` for accessibility.`,
        videoUrl: 'https://www.youtube.com/watch?v=ft30zcMlFao',
        order: 3,
        course: course4.documentId,
      },
    });

    await strapi.documents('api::quiz.quiz').create({
      data: {
        title: 'Modern CSS & Tailwind Design Assessment',
        course: course4.documentId,
        questions: [
          {
            questionText: 'What is a key architectural feature introduced in Tailwind CSS v4?',
            options: [
              'CSS-first configuration using @theme without requiring tailwind.config.js',
              'Removal of all CSS utility classes',
              'Requiring PHP runtime for compilation',
              'Deprecation of responsive prefixes',
            ],
            correctAnswerIndex: 0,
          },
          {
            questionText: 'Which CSS media feature detects when a user prefers minimal UI animation?',
            options: ['prefers-reduced-motion', 'prefers-color-scheme', 'min-resolution', 'orientation'],
            correctAnswerIndex: 0,
          },
          {
            questionText: 'What color format in modern CSS provides wider gamut and uniform perceptual lightness?',
            options: ['OKLCH', 'RGB Hex only', 'Named web colors only', 'CMYK'],
            correctAnswerIndex: 0,
          },
        ],
      },
    });

    const course5 = await strapi.documents('api::course.course').create({
      data: {
        title: 'Scalable Backend Engineering with Node.js & Express',
        description: 'Build robust, scalable, and resilient backend microservices and RESTful APIs using Node.js and Express. Explore asynchronous event loop internals, middleware design patterns, rate limiting, JWT token rotation, structured logging, and automated testing with Jest and Supertest.',
        owner: instructor1.id,
      },
    });

    await strapi.documents('api::lesson.lesson').create({
      data: {
        title: '1. Node.js Event Loop & Asynchronous Architecture',
        content: `# Node.js Event Loop Internals

Understand how Node.js manages thousands of concurrent I/O operations on a single thread using libuv and the event loop phases.

---

### Event Loop Phases:
1. **Timers**: Executes callbacks scheduled by \`setTimeout\` and \`setInterval\`.
2. **Pending Callbacks**: Executes I/O callbacks deferred to the next loop iteration.
3. **Poll**: Retrieves new I/O events and executes their callbacks.
4. **Check**: Executes \`setImmediate\` callbacks.
5. **Close Callbacks**: Handles socket closures and cleanup.

\`\`\`javascript
console.log('1: Sync');
setTimeout(() => console.log('2: Timer'), 0);
Promise.resolve().then(() => console.log('3: Microtask'));
console.log('4: Sync');

// Output order: 1 -> 4 -> 3 -> 2
\`\`\``,
        videoUrl: 'https://www.youtube.com/watch?v=Oe421EPjeBE',
        order: 1,
        course: course5.documentId,
      },
    });

    await strapi.documents('api::lesson.lesson').create({
      data: {
        title: '2. RESTful API Design & Error Handling Middleware',
        content: `# Error Handling Middleware Architecture

Implement centralized, structured error handling pipelines in Express.

---

### Central Error Handler:
\`\`\`javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = \`\${statusCode}\`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
  }
}

// Global error handling middleware (must have 4 arguments)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: err.status || 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});
\`\`\``,
        videoUrl: 'https://www.youtube.com/watch?v=f2EqECiTBL8',
        order: 2,
        course: course5.documentId,
      },
    });

    await strapi.documents('api::lesson.lesson').create({
      data: {
        title: '3. JWT Authentication, Refresh Tokens & Rate Limiting',
        content: `# Authentication & Rate Limiting

Protect your API endpoints against brute force attacks and credential stuffing using token rotation and Redis rate limiters.

---

### Rate Limiter Setup:
\`\`\`javascript
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per window
  message: { error: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth/local', authLimiter);
\`\`\``,
        videoUrl: 'https://www.youtube.com/watch?v=Oe421EPjeBE',
        order: 3,
        course: course5.documentId,
      },
    });

    await strapi.documents('api::quiz.quiz').create({
      data: {
        title: 'Backend Architecture & Node.js Assessment',
        course: course5.documentId,
        questions: [
          {
            questionText: 'Which C/C++ library handles the event loop and asynchronous I/O in Node.js?',
            options: ['libuv', 'v8 engine', 'npm', 'glibc'],
            correctAnswerIndex: 0,
          },
          {
            questionText: 'What is the special requirement for an Express middleware to be recognized as an error handler?',
            options: [
              'It must accept exactly 4 arguments (err, req, res, next)',
              'It must be named errorHandler.js',
              'It must return a Promise',
              'It must be placed at the very top of server.js',
            ],
            correctAnswerIndex: 0,
          },
          {
            questionText: 'What is the primary benefit of storing Refresh Tokens in HttpOnly cookies?',
            options: [
              'They cannot be read or stolen by malicious JavaScript via XSS attacks',
              'They make the API 10x faster',
              'They eliminate the need for HTTPS',
              'They are automatically translated into multiple languages',
            ],
            correctAnswerIndex: 0,
          },
        ],
      },
    });

    const course6 = await strapi.documents('api::course.course').create({
      data: {
        title: 'Relational Database Modeling with PostgreSQL & SQL',
        description: 'Master database design, relational normalization, indexing strategies, and query optimization in PostgreSQL. Learn how to write complex SQL joins, window functions, CTEs (Common Table Expressions), ACID transaction rollbacks, and manage database migrations safely in production.',
        owner: instructor2.id,
      },
    });

    await strapi.documents('api::lesson.lesson').create({
      data: {
        title: '1. Relational Schema Design & Normalization',
        content: `# Relational Schema Design & Normalization

Design clean, anomaly-free database structures through 1NF, 2NF, and 3NF normalization principles.

---

### Normalization Forms:
- **1NF (First Normal Form)**: Each column contains atomic (indivisible) values, and each record is unique with a primary key.
- **2NF (Second Normal Form)**: Meets 1NF, and all non-key attributes are fully functionally dependent on the primary key.
- **3NF (Third Normal Form)**: Meets 2NF, and there are no transitive dependencies (non-key columns do not depend on other non-key columns).

\`\`\`sql
-- Normalized Enrollment Table
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_student_course UNIQUE (student_id, course_id)
);
\`\`\``,
        videoUrl: 'https://www.youtube.com/watch?v=qw--VYLpxG4',
        order: 1,
        course: course6.documentId,
      },
    });

    await strapi.documents('api::lesson.lesson').create({
      data: {
        title: '2. Advanced SQL: Window Functions, CTEs & Indexing',
        content: `# Advanced SQL: Window Functions & CTEs

Unlock the power of analytical SQL with Common Table Expressions (CTEs) and Window Functions.

---

### Ranking Top Scores per Course:
\`\`\`sql
WITH RankedResults AS (
  SELECT
    student_id,
    course_id,
    score,
    ROW_NUMBER() OVER (
      PARTITION BY course_id 
      ORDER BY score DESC
    ) as rank_position
  FROM quiz_results
)
SELECT * FROM RankedResults WHERE rank_position <= 3;
\`\`\`

### Indexing Strategy:
- **B-Tree Indexes**: Default index for equality and range queries (\`WHERE status = 'active'\`).
- **Composite Indexes**: Multi-column indexes (\`CREATE INDEX idx_student_course ON enrollments(student_id, course_id)\`).`,
        videoUrl: 'https://www.youtube.com/watch?v=qw--VYLpxG4',
        order: 2,
        course: course6.documentId,
      },
    });

    await strapi.documents('api::lesson.lesson').create({
      data: {
        title: '3. ACID Transactions, Locks & Migration Pipelines',
        content: `# ACID Transactions & Isolation Levels

Ensure absolute data consistency during financial transactions and high-concurrency balance updates.

---

### ACID Principles:
- **Atomicity**: All operations in a transaction succeed or all fail together.
- **Consistency**: The database transitions from one valid state to another valid state.
- **Isolation**: Concurrent transactions execute without interfering with one another.
- **Durability**: Committed data is saved permanently to non-volatile storage.

\`\`\`sql
BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
\`\`\``,
        videoUrl: 'https://www.youtube.com/watch?v=qw--VYLpxG4',
        order: 3,
        course: course6.documentId,
      },
    });

    await strapi.documents('api::quiz.quiz').create({
      data: {
        title: 'PostgreSQL & Database Engineering Assessment',
        course: course6.documentId,
        questions: [
          {
            questionText: 'What does the "A" in ACID database properties stand for?',
            options: ['Atomicity', 'Availability', 'Asynchronous', 'Authorization'],
            correctAnswerIndex: 0,
          },
          {
            questionText: 'Which SQL clause is used to define Common Table Expressions?',
            options: ['WITH', 'HAVING', 'GROUP BY', 'JOIN'],
            correctAnswerIndex: 0,
          },
          {
            questionText: 'What type of index is the default in PostgreSQL for general equality and range queries?',
            options: ['B-Tree', 'GIN', 'GiST', 'BRIN'],
            correctAnswerIndex: 0,
          },
        ],
      },
    });

    console.log('Enrolling tahsin_student in Course 1 with progress records...');
    await strapi.documents('api::enrollment.enrollment').create({
      data: {
        student: studentUser.id,
        course: course1.documentId,
        enrolledAt: new Date(),
      },
    });

    await strapi.documents('api::lesson-progress.lesson-progress').create({
      data: {
        student: studentUser.id,
        lesson: c1Lesson1.documentId,
        completed: true,
        completedAt: new Date(),
      },
    });

    await strapi.documents('api::lesson-progress.lesson-progress').create({
      data: {
        student: studentUser.id,
        lesson: c1Lesson2.documentId,
        completed: true,
        completedAt: new Date(),
      },
    });

    console.log('Seeding editorial blog posts (published and draft articles)...');
    
    await strapi.documents('api::blog-post.blog-post').create({
      data: {
        title: 'The Future of Full-Stack Architecture: React 19 & Next.js 16',
        body: `# The Future of Full-Stack Architecture: React 19 & Next.js 16

Modern web development has undergone a paradigm shift with the convergence of **React 19** and the **Next.js 16 App Router**. Gone are the days when frontend and backend were isolated silos communicating solely over cumbersome REST endpoints.

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
      },
      status: 'published',
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
      },
      status: 'published',
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
      },
      status: 'published',
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
      },
      status: 'draft',
    });

    console.log('LMS Database successfully seeded with 6 rich courses, lessons, quizzes, and editorial blogs!');
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
