import type { Request, Response, NextFunction } from "express";
import { PostService } from "../services/post.service.js";

export class PostController {
  private postService: PostService;

  constructor() {
    this.postService = new PostService();
  }

  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const newPost = await this.postService.createPost(req.body);
      res.status(201).json(newPost);
    } catch (error) {
      next(error);
    }
  };

  // Handles GET /posts (and GET /posts?term=XYZ)

  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const term = req.query.term ? String(req.query.term) : undefined;

      const posts = await this.postService.getAllPosts(term);
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  };

  // Handles GET /posts/:id

  getById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = parseInt(String(req.params.id), 10);

      const post = await this.postService.getPostById(id);

      if (!post) {
        res.status(404).json({ message: "Blog post not found" });
        return;
      }

      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  };

  //  Handles PUT /posts/:id

  update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = parseInt(String(req.params.id), 10);

      const updatedPost = await this.postService.updatePost(id, req.body);

      if (!updatedPost) {
        res.status(404).json({ message: "Blog post not found" });
        return;
      }

      res.status(200).json(updatedPost);
    } catch (error) {
      next(error);
    }
  };

  // Handles DELETE /posts/:id

  delete = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = parseInt(String(req.params.id), 10);
      const wasDeleted = await this.postService.deletePost(id);

      if (!wasDeleted) {
        res.status(404).json({ message: "Blog post not found" });
        return;
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
