import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { Todo } from "../models/todo.model.js";

// 1. POST /todos

export const createTodo = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const { title, description } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized: User identification missing" });
      return;
    }

    const todo = await Todo.create({
      userId,
      title,
      description,
    });

    const todoObj = todo.toObject(); //to convert in simple javascript object

    const { __v, ...result } = todoObj; //destructuring

    res.status(201).json(result);
    return;
  } catch (error) {
    res.status(500).json({ message: "Server error while creating todo" });
    return;
  }
};

// 2. // GET /todos?page=1&limit=10&completed=true&search=Master&sortBy=createdAt_desc
export const getTodos = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized: Access denied" });
      return;
    }

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
    const skip = (page - 1) * limit;

    const queryFilter: any = { userId }; 

    if (req.query.completed !== undefined) { 
      queryFilter.completed = req.query.completed === "true";
    }

    if (req.query.search) { 
      const searchString = String(req.query.search).trim();
      // Escapes regex characters so things like "?" or "(" don't crash your server
      const escapedSearch = searchString.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      queryFilter.title = { $regex: escapedSearch, $options: "i" };
    }

    let sortOptions: any = { createdAt: -1 }; //doing last as first

    if (req.query.sortBy) {//filed two otptions select and asc means first to last and vice versa
      const [field, order] = (req.query.sortBy as string).split("_");
      sortOptions = { [field]: order === "asc" ? 1 : -1 };
    }

    sortOptions._id = -1

    const totalTodos = await Todo.countDocuments(queryFilter);
    const todos = await Todo.find(queryFilter)
      .select("-__v")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    
    res.status(200).json({
      data: todos,
      pagination: {
        page,
        limit,
        totalItems: totalTodos,
        totalPages: Math.ceil(totalTodos / limit),
      },
    });
    return;
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching todos" });
    return;
  }
};

// 3. PUT /todos/:id
export const updateTodo = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized: Access denied" });
      return;
    }

    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId },
      {
        $set: {
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
        },
      },
      { new: true },
    ).select("-__v");

    if (!todo) {
      res.status(404).json({ message: "Todo not found or unauthorized" });
      return;
    }

    res.status(200).json(todo);
    return;
  } catch (error) {
    res.status(500).json({ message: "Server error while updating todo" });
    return;
  }
};

// 4. DELETE /todos/:id
export const deleteTodo = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized: Access denied" });
      return;
    }

    const todo = await Todo.findOneAndDelete({ _id: id, userId });

    if (!todo) {
      res.status(404).json({ message: "Todo not found or unauthorized" });
      return;
    }
    res.status(200).json({ message: "Todo deleted successfully" });
    return;
  } catch (error) {
    res.status(500).json({ message: "Server error while deleting todo" });
    return;
  }
};
