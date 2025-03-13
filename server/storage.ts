import {
  users,
  courses,
  subjects,
  lessons,
  enrollments,
  achievements,
  userAchievements,
  learningStreaks,
  type User,
  type InsertUser,
  type Course,
  type InsertCourse,
  type Subject,
  type InsertSubject,
  type Lesson,
  type InsertLesson,
  type Enrollment,
  type InsertEnrollment,
  type Achievement,
  type InsertAchievement,
  type UserAchievement,
  type InsertUserAchievement,
  type LearningStreak,
  type InsertLearningStreak
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getCurrentUser(): Promise<User>;

  // Subject methods
  getSubject(id: number): Promise<Subject | undefined>;
  getAllSubjects(): Promise<Subject[]>;
  createSubject(subject: InsertSubject): Promise<Subject>;

  // Course methods
  getCourse(id: number): Promise<Course | undefined>;
  getAllCourses(): Promise<(Course & { enrolled?: boolean, status?: string, progress?: number })[]>;
  getEnrolledCourses(): Promise<(Course & { status: string, progress: number })[]>;
  getRecommendedCourses(): Promise<(Course & { studentCount: string })[]>;
  createCourse(course: InsertCourse): Promise<Course>;

  // Lesson methods
  getLesson(id: number): Promise<Lesson | undefined>;
  getLessonsByCourse(courseId: number): Promise<(Lesson & { completed?: boolean })[]>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;

  // Enrollment methods
  getEnrollment(id: number): Promise<Enrollment | undefined>;
  getEnrollmentByCourseAndUser(courseId: number, userId: number): Promise<Enrollment | undefined>;
  createEnrollment(courseId: number): Promise<Enrollment>;
  updateEnrollmentProgress(id: number, progress: number): Promise<Enrollment>;

  // Achievement methods
  getAchievement(id: number): Promise<Achievement | undefined>;
  getAllAchievements(): Promise<Achievement[]>;
  getUserAchievements(): Promise<(Achievement & { earnedAt: Date })[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  awardAchievementToUser(achievementId: number): Promise<UserAchievement>;

  // Learning streak methods
  getUserStreaks(): Promise<{ date: Date; count: number }[]>;
  recordLearningStreak(): Promise<LearningStreak>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private subjects: Map<number, Subject>;
  private courses: Map<number, Course>;
  private lessons: Map<number, Lesson>;
  private enrollments: Map<number, Enrollment>;
  private achievements: Map<number, Achievement>;
  private userAchievements: Map<number, UserAchievement>;
  private learningStreaks: Map<number, LearningStreak>;

  private currentUserId: number = 1;
  private currentSubjectId: number = 1;
  private currentCourseId: number = 1;
  private currentLessonId: number = 1;
  private currentEnrollmentId: number = 1;
  private currentAchievementId: number = 1;
  private currentUserAchievementId: number = 1;
  private currentLearningStreakId: number = 1;

  constructor() {
    this.users = new Map();
    this.subjects = new Map();
    this.courses = new Map();
    this.lessons = new Map();
    this.enrollments = new Map();
    this.achievements = new Map();
    this.userAchievements = new Map();
    this.learningStreaks = new Map();

    // Initialize with some data
    this.initializeData();
  }

  private initializeData() {
    // Create a demo user
    const userId = this.currentUserId++;
    const user: User = {
      id: userId,
      username: "alex",
      password: "password123",
      name: "Alex Johnson",
      email: "alex@example.com",
      avatar: null
    };
    this.users.set(userId, user);

    // Create subjects directly rather than using async method
    const mathSubjectId = this.currentSubjectId++;
    const mathSubject: Subject = { id: mathSubjectId, name: "Mathematics" };
    this.subjects.set(mathSubjectId, mathSubject);
    
    const physicsSubjectId = this.currentSubjectId++;
    const physicsSubject: Subject = { id: physicsSubjectId, name: "Physics" };
    this.subjects.set(physicsSubjectId, physicsSubject);
    
    const csSubjectId = this.currentSubjectId++;
    const csSubject: Subject = { id: csSubjectId, name: "Computer Science" };
    this.subjects.set(csSubjectId, csSubject);
    
    const biologySubjectId = this.currentSubjectId++;
    const biologySubject: Subject = { id: biologySubjectId, name: "Biology" };
    this.subjects.set(biologySubjectId, biologySubject);
    
    const chemistrySubjectId = this.currentSubjectId++;
    const chemistrySubject: Subject = { id: chemistrySubjectId, name: "Chemistry" };
    this.subjects.set(chemistrySubjectId, chemistrySubject);

    // Create courses directly
    const calculusCourseId = this.currentCourseId++;
    const calculusCourse: Course = {
      id: calculusCourseId,
      title: "Calculus I: Derivatives",
      description: "Learn the fundamentals of calculus with a focus on derivatives and their applications.",
      thumbnailUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=300&q=80",
      duration: "8 weeks",
      lessonCount: 24,
      subjectId: mathSubjectId
    };
    this.courses.set(calculusCourseId, calculusCourse);

    const dataScienceCourseId = this.currentCourseId++;
    const dataScienceCourse: Course = {
      id: dataScienceCourseId,
      title: "Introduction to Data Science",
      description: "Explore the fundamentals of data science, including statistics, Python, and data visualization.",
      thumbnailUrl: "https://images.unsplash.com/photo-1677442135148-1456f53e4787?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=300&q=80",
      duration: "10 weeks",
      lessonCount: 32,
      subjectId: csSubjectId
    };
    this.courses.set(dataScienceCourseId, dataScienceCourse);

    const physicsCourseId = this.currentCourseId++;
    const physicsCourse: Course = {
      id: physicsCourseId,
      title: "Physics: Mechanics",
      description: "Master the principles of classical mechanics, including motion, forces, and energy.",
      thumbnailUrl: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=300&q=80",
      duration: "6 weeks",
      lessonCount: 18,
      subjectId: physicsSubjectId
    };
    this.courses.set(physicsCourseId, physicsCourse);

    const biologyCourseId = this.currentCourseId++;
    const biologyCourse: Course = {
      id: biologyCourseId,
      title: "Biology: Cellular Processes",
      description: "Explore the fascinating world of cells and biological processes.",
      thumbnailUrl: "https://images.unsplash.com/photo-1581089781785-603411fa81e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=300&q=80",
      duration: "6 weeks",
      lessonCount: 20,
      subjectId: biologySubjectId
    };
    this.courses.set(biologyCourseId, biologyCourse);

    const computerScienceCourseId = this.currentCourseId++;
    const computerScienceCourse: Course = {
      id: computerScienceCourseId,
      title: "Computer Science Principles",
      description: "Learn the foundations of computer science and programming.",
      thumbnailUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=300&q=80",
      duration: "8 weeks",
      lessonCount: 24,
      subjectId: csSubjectId
    };
    this.courses.set(computerScienceCourseId, computerScienceCourse);

    // Create lessons for Calculus course
    for (let i = 1; i <= 24; i++) {
      const lessonId = this.currentLessonId++;
      const lesson: Lesson = {
        id: lessonId,
        courseId: calculusCourseId,
        title: `Lesson ${i}: ${i === 1 ? "Introduction to Calculus" : `Advanced Topic ${i - 1}`}`,
        content: `This is the content for lesson ${i} of the Calculus course.`,
        order: i,
        videoUrl: i === 1 ? "https://example.com/calculus-intro.mp4" : null
      };
      this.lessons.set(lessonId, lesson);
    }

    // Create lessons for Data Science course
    for (let i = 1; i <= 32; i++) {
      const lessonId = this.currentLessonId++;
      const lesson: Lesson = {
        id: lessonId,
        courseId: dataScienceCourseId,
        title: `Lesson ${i}: ${i === 1 ? "Introduction to Data Science" : `Data Analysis Technique ${i - 1}`}`,
        content: `This is the content for lesson ${i} of the Data Science course.`,
        order: i,
        videoUrl: null
      };
      this.lessons.set(lessonId, lesson);
    }

    // Create lessons for Physics course
    for (let i = 1; i <= 18; i++) {
      const lessonId = this.currentLessonId++;
      const lesson: Lesson = {
        id: lessonId,
        courseId: physicsCourseId,
        title: `Lesson ${i}: ${i === 1 ? "Introduction to Mechanics" : `Physics Principle ${i - 1}`}`,
        content: `This is the content for lesson ${i} of the Physics course.`,
        order: i,
        videoUrl: null
      };
      this.lessons.set(lessonId, lesson);
    }

    // Enroll user in courses and set progress immediately to avoid async issues
    const calcEnrollment = {
      id: this.currentEnrollmentId++,
      userId: 1, // User ID is expected to be 1
      courseId: calculusCourse.id,
      progress: 75,
      status: "in-progress",
      enrolledAt: new Date(),
    };
    this.enrollments.set(calcEnrollment.id, calcEnrollment);

    const dsEnrollment = {
      id: this.currentEnrollmentId++,
      userId: 1, // User ID is expected to be 1
      courseId: dataScienceCourse.id,
      progress: 0,
      status: "not-started",
      enrolledAt: new Date(),
    };
    this.enrollments.set(dsEnrollment.id, dsEnrollment);

    const physicsEnrollment = {
      id: this.currentEnrollmentId++,
      userId: 1, // User ID is expected to be 1
      courseId: physicsCourse.id,
      progress: 100,
      status: "completed",
      enrolledAt: new Date(),
    };
    this.enrollments.set(physicsEnrollment.id, physicsEnrollment);

    // Create achievements directly
    const problemSolverAchievementId = this.currentAchievementId++;
    const problemSolverAchievement: Achievement = {
      id: problemSolverAchievementId,
      name: "Problem Solver",
      description: "Complete 10 practice problems",
      icon: "trophy",
      type: "problem"
    };
    this.achievements.set(problemSolverAchievementId, problemSolverAchievement);

    const streakAchievementId = this.currentAchievementId++;
    const streakAchievement: Achievement = {
      id: streakAchievementId,
      name: "Learning Streak",
      description: "Learn for 5 consecutive days",
      icon: "flashlight",
      type: "streak"
    };
    this.achievements.set(streakAchievementId, streakAchievement);

    const masterAchievementId = this.currentAchievementId++;
    const masterAchievement: Achievement = {
      id: masterAchievementId,
      name: "Subject Master",
      description: "Complete all courses in a subject",
      icon: "brain",
      type: "course"
    };
    this.achievements.set(masterAchievementId, masterAchievement);

    // Award achievements to user directly
    const ua1Id = this.currentUserAchievementId++;
    const ua1: UserAchievement = {
      id: ua1Id,
      userId: userId,
      achievementId: problemSolverAchievementId,
      earnedAt: new Date()
    };
    this.userAchievements.set(ua1Id, ua1);

    const ua2Id = this.currentUserAchievementId++;
    const ua2: UserAchievement = {
      id: ua2Id,
      userId: userId,
      achievementId: streakAchievementId,
      earnedAt: new Date()
    };
    this.userAchievements.set(ua2Id, ua2);

    const ua3Id = this.currentUserAchievementId++;
    const ua3: UserAchievement = {
      id: ua3Id,
      userId: userId,
      achievementId: masterAchievementId,
      earnedAt: new Date()
    };
    this.userAchievements.set(ua3Id, ua3);

    // Record learning streaks for the past 4 days
    const today = new Date();
    for (let i = 4; i >= 1; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const streakId = this.currentLearningStreakId++;
      const streak: LearningStreak = {
        id: streakId,
        userId: userId,
        date
      };
      this.learningStreaks.set(streakId, streak);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      avatar: insertUser.avatar || null
    };
    this.users.set(id, user);
    return user;
  }

  async getCurrentUser(): Promise<User> {
    // For demo purposes, return the first user
    return this.users.get(1)!;
  }

  // Subject methods
  async getSubject(id: number): Promise<Subject | undefined> {
    return this.subjects.get(id);
  }

  async getAllSubjects(): Promise<Subject[]> {
    return Array.from(this.subjects.values());
  }

  async createSubject(insertSubject: InsertSubject): Promise<Subject> {
    const id = this.currentSubjectId++;
    const subject: Subject = { ...insertSubject, id };
    this.subjects.set(id, subject);
    return subject;
  }

  // Course methods
  async getCourse(id: number): Promise<Course | undefined> {
    const course = this.courses.get(id);
    if (!course) return undefined;

    // Check if the user is enrolled in this course
    const user = await this.getCurrentUser();
    const enrollment = await this.getEnrollmentByCourseAndUser(id, user.id);
    
    if (enrollment) {
      return {
        ...course,
        progress: enrollment.progress,
        status: enrollment.status,
      };
    }

    return course;
  }

  async getAllCourses(): Promise<(Course & { enrolled?: boolean, status?: string, progress?: number })[]> {
    const courses = Array.from(this.courses.values());
    const user = await this.getCurrentUser();
    const enrollments = Array.from(this.enrollments.values()).filter(
      enrollment => enrollment.userId === user.id
    );

    return courses.map(course => {
      const enrollment = enrollments.find(e => e.courseId === course.id);
      if (enrollment) {
        return {
          ...course,
          enrolled: true,
          status: enrollment.status,
          progress: enrollment.progress,
        };
      }
      return { ...course, enrolled: false };
    });
  }

  async getEnrolledCourses(): Promise<(Course & { status: string, progress: number })[]> {
    const user = await this.getCurrentUser();
    const enrollments = Array.from(this.enrollments.values()).filter(
      enrollment => enrollment.userId === user.id
    );

    return Promise.all(
      enrollments.map(async enrollment => {
        const course = await this.getCourse(enrollment.courseId);
        return {
          ...course!,
          status: enrollment.status,
          progress: enrollment.progress,
        };
      })
    );
  }

  async getRecommendedCourses(): Promise<(Course & { studentCount: string })[]> {
    // For demo purposes, return 2 courses that the user is not enrolled in
    const user = await this.getCurrentUser();
    const enrollments = Array.from(this.enrollments.values()).filter(
      enrollment => enrollment.userId === user.id
    );
    const enrolledCourseIds = enrollments.map(enrollment => enrollment.courseId);
    
    const recommendedCourses = Array.from(this.courses.values())
      .filter(course => !enrolledCourseIds.includes(course.id))
      .slice(0, 2);

    return recommendedCourses.map(course => ({
      ...course,
      studentCount: course.id === 5 ? "15k+" : "9k+", // Mock student counts
    }));
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.currentCourseId++;
    const course: Course = { ...insertCourse, id };
    this.courses.set(id, course);
    return course;
  }

  // Lesson methods
  async getLesson(id: number): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async getLessonsByCourse(courseId: number): Promise<(Lesson & { completed?: boolean })[]> {
    const lessons = Array.from(this.lessons.values())
      .filter(lesson => lesson.courseId === courseId)
      .sort((a, b) => a.order - b.order);

    // Mark some lessons as completed for demo purposes
    if (courseId === 1) {
      // For Calculus course (75% complete)
      return lessons.map((lesson, index) => ({
        ...lesson,
        completed: index < 18, // First 18 lessons are completed (75% of 24)
      }));
    } else if (courseId === 3) {
      // For Physics course (100% complete)
      return lessons.map(lesson => ({
        ...lesson,
        completed: true, // All lessons completed
      }));
    }

    return lessons.map(lesson => ({
      ...lesson,
      completed: false,
    }));
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const id = this.currentLessonId++;
    const lesson: Lesson = { ...insertLesson, id };
    this.lessons.set(id, lesson);
    return lesson;
  }

  // Enrollment methods
  async getEnrollment(id: number): Promise<Enrollment | undefined> {
    return this.enrollments.get(id);
  }

  async getEnrollmentByCourseAndUser(courseId: number, userId: number): Promise<Enrollment | undefined> {
    return Array.from(this.enrollments.values()).find(
      enrollment => enrollment.courseId === courseId && enrollment.userId === userId
    );
  }

  async createEnrollment(courseId: number): Promise<Enrollment> {
    const user = await this.getCurrentUser();
    
    // Check if already enrolled
    const existingEnrollment = await this.getEnrollmentByCourseAndUser(courseId, user.id);
    if (existingEnrollment) {
      return existingEnrollment;
    }
    
    const id = this.currentEnrollmentId++;
    const enrollment: Enrollment = {
      id,
      userId: user.id,
      courseId,
      progress: 0,
      status: "in-progress",
      enrolledAt: new Date(),
    };
    this.enrollments.set(id, enrollment);
    return enrollment;
  }

  async updateEnrollmentProgress(id: number, progress: number): Promise<Enrollment> {
    const enrollment = await this.getEnrollment(id);
    if (!enrollment) {
      throw new Error("Enrollment not found");
    }

    const updatedEnrollment: Enrollment = {
      ...enrollment,
      progress,
      status: progress >= 100 ? "completed" : "in-progress",
    };
    this.enrollments.set(id, updatedEnrollment);
    return updatedEnrollment;
  }

  // Achievement methods
  async getAchievement(id: number): Promise<Achievement | undefined> {
    return this.achievements.get(id);
  }

  async getAllAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async getUserAchievements(): Promise<(Achievement & { earnedAt: Date })[]> {
    const user = await this.getCurrentUser();
    const userAchievementsList = Array.from(this.userAchievements.values()).filter(
      ua => ua.userId === user.id
    );

    return Promise.all(
      userAchievementsList.map(async ua => {
        const achievement = await this.getAchievement(ua.achievementId);
        return {
          ...achievement!,
          earnedAt: ua.earnedAt,
        };
      })
    );
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = this.currentAchievementId++;
    const achievement: Achievement = { ...insertAchievement, id };
    this.achievements.set(id, achievement);
    return achievement;
  }

  async awardAchievementToUser(achievementId: number): Promise<UserAchievement> {
    const user = await this.getCurrentUser();
    const id = this.currentUserAchievementId++;
    const userAchievement: UserAchievement = {
      id,
      userId: user.id,
      achievementId,
      earnedAt: new Date(),
    };
    this.userAchievements.set(id, userAchievement);
    return userAchievement;
  }

  // Learning streak methods
  async getUserStreaks(): Promise<{ date: Date; count: number }[]> {
    const user = await this.getCurrentUser();
    const streaks = Array.from(this.learningStreaks.values())
      .filter(streak => streak.userId === user.id)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Group by date and count
    const streakCounts = new Map<string, number>();
    
    streaks.forEach(streak => {
      const dateString = streak.date.toISOString().split('T')[0];
      const count = (streakCounts.get(dateString) || 0) + 1;
      streakCounts.set(dateString, count);
    });
    
    return Array.from(streakCounts.entries()).map(([dateString, count]) => ({
      date: new Date(dateString),
      count,
    }));
  }

  async recordLearningStreak(): Promise<LearningStreak> {
    const user = await this.getCurrentUser();
    const id = this.currentLearningStreakId++;
    const streak: LearningStreak = {
      id,
      userId: user.id,
      date: new Date(),
    };
    this.learningStreaks.set(id, streak);
    return streak;
  }
}

export const storage = new MemStorage();
