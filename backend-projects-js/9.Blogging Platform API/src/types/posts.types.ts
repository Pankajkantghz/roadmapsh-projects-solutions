export interface CreatePostInput {
  title: string;
  content: string;
  category: string;
  tags: string[]; 
}

export interface Post extends CreatePostInput {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}
