export type Career = {
  _id: string;
  title: string;
  description: string;
  category: string;
  requiredSkills: string[];
  educationRequired: string;
  averageSalary: string;
  growthOutlook: string;
  workEnvironment: string;
};

export type SavedCareerRecord = {
  _id: string;
  userId: string;
  careerId: string;
  savedAt: string;
  career: Career;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};
