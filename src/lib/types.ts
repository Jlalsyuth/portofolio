export type ProjectCategory = 'Web App' | 'Mobile App' | 'UI/UX' | 'Business';

export interface MediaFile {
  type: 'image' | 'video' | 'document';
  url: string;
  name: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: ProjectCategory;
  short_description?: string | null;
  content?: string | null;
  thumbnail_url?: string | null;
  media_files?: MediaFile[] | null;
  tech_stack?: string[] | null;
  live_url?: string | null;
  repo_url?: string | null;
  created_at: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  description: string;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  instagram?: string;
  website?: string;
  [key: string]: string | undefined;
}

export interface Profile {
  id: string;
  full_name: string;
  headline?: string | null;
  about?: string | null;
  photo_url?: string | null;
  experience?: ExperienceItem[] | null;
  education?: EducationItem[] | null;
  skills?: string[] | null;
  contact_email?: string | null;
  social_links?: SocialLinks | null;
  cv_file_url?: string | null;
  updated_at?: string;
}
