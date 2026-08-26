'use strict';

const fs = require('fs-extra');
const path = require('path');
const mime = require('mime-types');
const { categories, authors, articles, global, about } = require('../data/data.json');

async function seedExampleApp() {
  const shouldImportSeedData = await isFirstRun();

  if (shouldImportSeedData) {
    try {
      console.log('Setting up the template and LMS seed data...');
      await importSeedData();
      await seedLmsData();
      console.log('Ready to go');
    } catch (error) {
      console.log('Could not import seed data');
      console.error(error);
    }
  } else {
    console.log(
      'Seed data has already been imported. We cannot reimport unless you clear your database first.'
    );
  }
}

async function isFirstRun() {
  const pluginStore = strapi.store({
    environment: strapi.config.environment,
    type: 'type',
    name: 'setup',
  });
  const initHasRun = await pluginStore.get({ key: 'initHasRun' });
  await pluginStore.set({ key: 'initHasRun', value: true });
  return !initHasRun;
}

async function setPublicPermissions(newPermissions) {
  const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });

  if (!publicRole) return;

  const allPermissionsToCreate = [];
  Object.keys(newPermissions).forEach((controller) => {
    const actions = newPermissions[controller];
    const permissionsToCreate = actions.map((action) => {
      return strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: `api::${controller}.${controller}.${action}`,
          role: publicRole.id,
        },
      });
    });
    allPermissionsToCreate.push(...permissionsToCreate);
  });
  await Promise.all(allPermissionsToCreate);
}

function getFileSizeInBytes(filePath) {
  const stats = fs.statSync(filePath);
  return stats['size'];
}

function getFileData(fileName) {
  const filePath = path.join('data', 'uploads', fileName);
  const size = getFileSizeInBytes(filePath);
  const ext = fileName.split('.').pop();
  const mimeType = mime.lookup(ext || '') || '';

  return {
    filepath: filePath,
    originalFileName: fileName,
    size,
    mimetype: mimeType,
  };
}

async function uploadFile(file, name) {
  return strapi
    .plugin('upload')
    .service('upload')
    .upload({
      files: file,
      data: {
        fileInfo: {
          alternativeText: `An image uploaded to Strapi called ${name}`,
          caption: name,
          name,
        },
      },
    });
}

async function createEntry({ model, entry }) {
  try {
    /** @type {any} */
    const uid = `api::${model}.${model}`;
    await strapi.documents(uid).create({
      data: entry,
    });
  } catch (error) {
    console.error({ model, entry, error });
  }
}

async function checkFileExistsBeforeUpload(files) {
  const existingFiles = [];
  const uploadedFiles = [];
  const filesCopy = [...files];

  for (const fileName of filesCopy) {
    const fileWhereName = await strapi.query('plugin::upload.file').findOne({
      where: {
        name: fileName.replace(/\..*$/, ''),
      },
    });

    if (fileWhereName) {
      existingFiles.push(fileWhereName);
    } else {
      const filePath = path.join('data', 'uploads', fileName);
      if (fs.existsSync(filePath)) {
        const fileData = getFileData(fileName);
        const fileNameNoExtension = fileName.split('.').shift();
        const [file] = await uploadFile(fileData, fileNameNoExtension);
        uploadedFiles.push(file);
      }
    }
  }
  const allFiles = [...existingFiles, ...uploadedFiles];
  return allFiles.length === 1 ? allFiles[0] : allFiles;
}

async function updateBlocks(blocks) {
  if (!blocks) return [];
  const updatedBlocks = [];
  for (const block of blocks) {
    if (block.__component === 'shared.media') {
      const uploadedFiles = await checkFileExistsBeforeUpload([block.file]);
      const blockCopy = { ...block };
      blockCopy.file = uploadedFiles;
      updatedBlocks.push(blockCopy);
    } else if (block.__component === 'shared.slider') {
      const existingAndUploadedFiles = await checkFileExistsBeforeUpload(block.files);
      const blockCopy = { ...block };
      blockCopy.files = existingAndUploadedFiles;
      updatedBlocks.push(blockCopy);
    } else {
      updatedBlocks.push(block);
    }
  }
  return updatedBlocks;
}

async function importArticles() {
  for (const article of articles) {
    const cover = await checkFileExistsBeforeUpload([`${article.slug}.jpg`]);
    const updatedBlocks = await updateBlocks(article.blocks);

    await createEntry({
      model: 'article',
      entry: {
        ...article,
        cover,
        blocks: updatedBlocks,
        publishedAt: Date.now(),
      },
    });
  }
}

async function importGlobal() {
  const favicon = await checkFileExistsBeforeUpload(['favicon.png']);
  const shareImage = await checkFileExistsBeforeUpload(['default-image.png']);
  return createEntry({
    model: 'global',
    entry: {
      ...global,
      favicon,
      publishedAt: Date.now(),
      defaultSeo: {
        ...global.defaultSeo,
        shareImage,
      },
    },
  });
}

async function importAbout() {
  const updatedBlocks = await updateBlocks(about.blocks);

  await createEntry({
    model: 'about',
    entry: {
      ...about,
      blocks: updatedBlocks,
      publishedAt: Date.now(),
    },
  });
}

async function importCategories() {
  for (const category of categories) {
    await createEntry({ model: 'category', entry: category });
  }
}

async function importAuthors() {
  for (const author of authors) {
    const avatar = await checkFileExistsBeforeUpload([author.avatar]);
    await createEntry({
      model: 'author',
      entry: {
        ...author,
        avatar,
      },
    });
  }
}

async function importSeedData() {
  await setPublicPermissions({
    global: ['find', 'findOne'],
    about: ['find', 'findOne'],
  });

  await importGlobal();
  await importAbout();
}

async function seedLmsData() {
  console.log('Seeding LMS users, courses, lessons, and quizzes...');

  // ensure role lookup
  const getRole = async (type) => {
    return strapi.query('plugin::users-permissions.role').findOne({ where: { type } });
  };

  const adminRole = await getRole('admin');
  const cmRole = await getRole('content_manager');
  const instructorRole = await getRole('instructor');
  const studentRole = await getRole('student');

  const createUserIfNotExist = async (userData) => {
    const existing = await strapi.query('plugin::users-permissions.user').findOne({
      where: { email: userData.email },
    });
    if (!existing) {
      return strapi.plugin('users-permissions').service('user').add(userData);
    }
    return existing;
  };

  // seed sample users for all 4 roles
  const adminUser = await createUserIfNotExist({
    username: 'admin_demo',
    email: 'admin@lms.local',
    password: 'Password123!',
    role: adminRole ? adminRole.id : undefined,
    confirmed: true,
  });

  const cmUser = await createUserIfNotExist({
    username: 'manager_demo',
    email: 'manager@lms.local',
    password: 'Password123!',
    role: cmRole ? cmRole.id : undefined,
    confirmed: true,
  });

  const instructorUser = await createUserIfNotExist({
    username: 'instructor_demo',
    email: 'instructor@lms.local',
    password: 'Password123!',
    role: instructorRole ? instructorRole.id : undefined,
    confirmed: true,
  });

  const studentUser = await createUserIfNotExist({
    username: 'student_demo',
    email: 'student@lms.local',
    password: 'Password123!',
    role: studentRole ? studentRole.id : undefined,
    confirmed: true,
  });

  // seed Course
  const course = await strapi.documents('api::course.course').create({
    data: {
      title: 'Full-Stack Next.js and Strapi Mastery',
      description: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: 'Comprehensive hands-on course covering modern web development with Next.js App Router, TailwindCSS, and Strapi v5 Headless CMS.',
            },
          ],
        },
      ],
      owner: instructorUser.id,
    },
  });

  // seed Lessons
  const lesson1 = await strapi.documents('api::lesson.lesson').create({
    data: {
      title: '1. Introduction to Headless Architecture',
      content: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: 'In this lesson, we introduce the decoupled architecture separating Next.js on the frontend from Strapi v5 on the backend.',
            },
          ],
        },
      ],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      order: 1,
      course: course.documentId,
    },
  });

  const lesson2 = await strapi.documents('api::lesson.lesson').create({
    data: {
      title: '2. Role-Based Access Control (RBAC) in Strapi v5',
      content: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: 'Deep dive into implementing custom policies, secure auto-grading controllers, and document ownership checks.',
            },
          ],
        },
      ],
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      order: 2,
      course: course.documentId,
    },
  });

  // seed Quiz with MCQ Questions
  await strapi.documents('api::quiz.quiz').create({
    data: {
      title: 'Next.js & Strapi Architecture Assessment',
      course: course.documentId,
      questions: [
        {
          questionText: 'What is the primary document API used in Strapi v5 for CRUD operations?',
          options: [
            'strapi.entityService',
            'strapi.documents',
            'strapi.db.query',
            'strapi.services',
          ],
          correctAnswerIndex: 1,
        },
        {
          questionText: 'Which role in our LMS is authorized to promote or change user roles?',
          options: ['Instructor', 'Content Manager', 'Admin', 'Student'],
          correctAnswerIndex: 2,
        },
        {
          questionText: 'How is student quiz auto-grading evaluated?',
          options: [
            'On the client-side before sending the score',
            'On the backend inside the quiz-result controller comparing answers against correctAnswerIndex',
            'Manually reviewed by instructor only',
            'Calculated via a third-party plugin',
          ],
          correctAnswerIndex: 1,
        },
      ],
    },
  });

  // seed Blog Post
  await strapi.documents('api::blog-post.blog-post').create({
    data: {
      title: 'Building Enterprise LMS with Strapi v5 & Next.js',
      body: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: 'Discover best practices for building secure, scalable learning management platforms with role-based access control.',
            },
          ],
        },
      ],
      author: cmUser.id,
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  console.log('LMS Demo data seeded successfully.');
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  app.log.level = 'error';

  await seedExampleApp();
  await app.destroy();

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
