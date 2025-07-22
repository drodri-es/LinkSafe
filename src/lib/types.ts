export type Bookmark = {
  id: string;
  url: string;
  title: string;
  description?: string;
  tags: string[];
  favicon?: string;
  createdAt: string; // ISO date string
};
