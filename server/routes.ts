import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/user", async (req, res) => {
    // For demo purpose, return a mock user
    // In a real application, this would use auth middleware
    const user = await storage.getCurrentUser();
    res.json(user);
  });

  // Subject routes
  app.get("/api/subjects", async (req, res) => {
    const subjects = await storage.getAllSubjects();
    res.json(subjects);
  });

  // Course routes
  app.get("/api/courses", async (req, res) => {
    const courses = await storage.getEnrolledCourses();
    res.json(courses);
  });

  app.get("/api/courses/all", async (req, res) => {
    const courses = await storage.getAllCourses();
    res.json(courses);
  });

  app.get("/api/courses/recommended", async (req, res) => {
    const courses = await storage.getRecommendedCourses();
    res.json(courses);
  });

  app.get("/api/courses/:id", async (req, res) => {
    const courseId = parseInt(req.params.id);
    const course = await storage.getCourse(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  });

  app.get("/api/courses/:id/lessons", async (req, res) => {
    const courseId = parseInt(req.params.id);
    const lessons = await storage.getLessonsByCourse(courseId);
    res.json(lessons);
  });

  // Enrollment routes
  app.post("/api/enrollments", async (req, res) => {
    const { courseId } = req.body;
    try {
      const enrollment = await storage.createEnrollment(courseId);
      res.status(201).json(enrollment);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  app.patch("/api/enrollments/:id/progress", async (req, res) => {
    const enrollmentId = parseInt(req.params.id);
    const { progress } = req.body;
    try {
      const updatedEnrollment = await storage.updateEnrollmentProgress(enrollmentId, progress);
      res.json(updatedEnrollment);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  // Achievement routes
  app.get("/api/achievements", async (req, res) => {
    const achievements = await storage.getUserAchievements();
    res.json(achievements);
  });

  // Learning streak routes
  app.get("/api/streaks", async (req, res) => {
    const streaks = await storage.getUserStreaks();
    res.json(streaks);
  });

  app.post("/api/streaks/record", async (req, res) => {
    try {
      const streak = await storage.recordLearningStreak();
      res.status(201).json(streak);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
