export type Role = "admin" | "trainer" | "trainee";
export interface Course {
  id: string;
  title: string;
  code: string;
  category: string;
  level: string;
  duration: string;
  progress: number;
  learners: number;
  tag: string;
  accent: string;
}
