import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/db.js";
import type { CreatePostInput, Post } from "../types/posts.types.js";

export class PostRepository {
  async create(input: CreatePostInput): Promise<Post> {
    const { title, content, category, tags } = input;

    // 1. MySQL expects array types to be sent as a serialized JSON string
    const serializedTags = JSON.stringify(tags);

    // 2. Write our raw SQL query with positional placeholders (?) to prevent SQL Injection
    const query = `
      INSERT INTO posts (title, content, category, tags)
      VALUES (?, ?, ?, ?)
    `;

    // 3. Execute the query using our connection pool
    // ResultSetHeader gives us information about the operation (like the auto-incremented insertId)
    const [result] = await pool.query<ResultSetHeader>(query, [
      title,
      content,
      category,
      serializedTags,
    ]);

    const insertId = result.insertId;

    // 4. Fetch and return the newly created post so the client gets the full object
    return this.findById(insertId) as Promise<Post>;
  }

  // Helper method to fetch a single post by its ID

  async findById(id: number): Promise<Post | null> {
    const query = `SELECT * FROM posts WHERE id = ?`;

    // RowDataPacket tells TypeScript that this query returns rows of data
    const [rows] = await pool.query<RowDataPacket[]>(query, [id]);

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0]!;

    // Return a properly typed Post object
    return {
      id: row.id,
      title: row.title,
      content: row.content,
      category: row.category,
      // MySQL returns the JSON column as a native JS array/object automatically!
      tags: typeof row.tags === "string" ? JSON.parse(row.tags) : row.tags,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  //   Retrieves all blog posts, optionally filtered by a wildcard search termync

  async findAll(searchTerm?: string): Promise<Post[]> {
    let query = `SELECT * FROM posts`;

    const queryParams: String[] = [];

    if (searchTerm) {
      query += ` WHERE title LIKE ? OR content LIKE ? OR category LIKE ?`;
      const wildcard = `%${searchTerm}%`;
      queryParams.push(wildcard, wildcard, wildcard);
    }

    query += ` ORDER BY createdAt DESC`;

    const [rows] = await pool.query<RowDataPacket[]>(query, queryParams);

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      content: row.content,
      category: row.category,
      tags: typeof row.tags === "string" ? JSON.parse(row.tags) : row.tags,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));
  }

  // Updates an existing blog post and returns the updated record, or null if not found
  async update(id: number, input: CreatePostInput): Promise<Post | null> {
    const { title, content, category, tags } = input;

    const serializedTags = JSON.stringify(tags);

    const query = `
    UPDATE posts 
    SET title = ?, content = ?, category = ?, tags = ? 
    WHERE id = ?
  `;

    const [result] = await pool.query<ResultSetHeader>(query, [
      title,
      content,
      category,
      serializedTags,
      id,
    ]);

    if (result.affectedRows === 0) {
      return null;
    }

    return this.findById(id);
  }

  // Delete the post
  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM posts WHERE id = ?`;

    const [result] = await pool.query<ResultSetHeader>(query, [id]);

    return result.affectedRows > 0;
  }
}
