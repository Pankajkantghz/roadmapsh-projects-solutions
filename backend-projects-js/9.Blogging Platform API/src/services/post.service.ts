import { PostRepository } from "../repositories/post.repository.js";
import type { CreatePostInput, Post } from "../types/posts.types.js";

export class PostService {
  private postRepository: PostRepository;

  constructor() {
    this.postRepository = new PostRepository();
  }

  async createPost(input: CreatePostInput): Promise<Post> {
    const normalizedInput: CreatePostInput = {
      ...input,
      tags: input.tags.map((tag: string) => tag.toLowerCase()),
    };

    return await this.postRepository.create(normalizedInput);
  }

  async getAllPosts(searchTerm?: string): Promise<Post[]> {
    return await this.postRepository.findAll(searchTerm);
  }

  async getPostById(id: number): Promise<Post | null> {
    return await this.postRepository.findById(id);
  }

  async updatePost(id: number, input: CreatePostInput): Promise<Post | null> {
    const normalizedInput = {
      ...input,
      tags: input.tags.map((tag) => tag.toLowerCase()),
    };

    return await this.postRepository.update(id, normalizedInput);
  }

  async deletePost(id: number): Promise<boolean> {
    return await this.postRepository.delete(id);
  }
}
