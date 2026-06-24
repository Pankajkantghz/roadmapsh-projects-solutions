import { query } from "../config/db.js";

export const createExpense = async (userId, data) => {
  const { title, amount, category, description, expenseDate } = data;
  const result = await query(
    `INSERT INTO expenses (user_id, title, amount, category, description, expense_date) 
     VALUES ($1, $2, $3, $4, $5, COALESCE($6, CURRENT_DATE))
     RETURNING id, title, amount, category, description, expense_date AS "expenseDate", created_at AS "createdAt", updated_at AS "updatedAt"`,
    [userId, title, amount, category, description, expenseDate],
  );
  return result.rows[0];
};

export const getFilteredExpenses = async (userId, filters) => {
  const {
    filter,
    category,
    startDate,
    endDate,
    sortBy = "expenseDate",
    order = "desc",
    page = 1,
    limit = 10,
  } = filters;

  const parsedPage = parseInt(page, 10) || 1;
  const parsedLimit = parseInt(limit, 10) || 10;
  const offset = (parsedPage - 1) * parsedLimit;

  // --- STEP 1: BUILD THE WHERE CLAUSE DYNAMICALLY ---
  let conditions = ["user_id = $1"];
  let queryParams = [userId];

  // Handle preset intervals
  if (filter === "week")
    conditions.push(`expense_date >= CURRENT_DATE - INTERVAL '7 days'`);
  if (filter === "month")
    conditions.push(`expense_date >= CURRENT_DATE - INTERVAL '1 month'`);
  if (filter === "3months")
    conditions.push(`expense_date >= CURRENT_DATE - INTERVAL '3 months'`);

  // Handle custom date ranges
  if (!filter && startDate && endDate) {
    conditions.push(`expense_date BETWEEN $2 AND $3`);
    queryParams.push(startDate, endDate);
  }

  // Handle category filtering
  if (category) {
    // Determine parameter index position dynamically ($2, $3, or $4)
    const nextIndex = queryParams.length + 1;
    conditions.push(`category = $${nextIndex}`);
    queryParams.push(category);
  }

  const whereString = `WHERE ` + conditions.join(" AND ");

  // --- STEP 2: GET TOTAL COUNT ---
  const countResult = await query(
    `SELECT COUNT(*) FROM expenses ${whereString}`,
    queryParams,
  );
  const totalCount = parseInt(countResult.rows[0].count, 10);

  // --- STEP 3: RUN THE SELECTION QUERY ---
  const sortMap = { expenseDate: "expense_date", amount: "amount" };
  const dbSortColumn = sortMap[sortBy] || "expense_date";
  const dbOrder = order.toLowerCase() === "asc" ? "ASC" : "DESC";

  // Use a fresh array for data extraction to cleanly append limit/offset parameters
  const limitIndex = queryParams.length + 1;
  const offsetIndex = queryParams.length + 2;
  const dataParams = [...queryParams, parsedLimit, offset];

  const dataQuery = `
    SELECT id, title, amount, category, expense_date AS "expenseDate"
    FROM expenses
    ${whereString}
    ORDER BY ${dbSortColumn} ${dbOrder}, created_at DESC
    LIMIT $${limitIndex} OFFSET $${offsetIndex}
  `;

  const dataResult = await query(dataQuery, dataParams);
  const totalPages = Math.ceil(totalCount / parsedLimit) || 1;

  return {
    count: totalCount,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      totalPages,
      hasNextPage: parsedPage < totalPages,
      hasPreviousPage: parsedPage > 1,
    },
    expenses: dataResult.rows,
  };
};


export const getExpenseById = async (id, userId) => {
  const result = await query(
    `SELECT id, title, amount, category, description, expense_date AS "expenseDate", created_at AS "createdAt", updated_at AS "updatedAt"
     FROM expenses WHERE id = $1 AND user_id = $2`,
    [id, userId],
  );
  return result.rows[0];
};

export const updateExpense = async (id, userId, updateData) => {
  const fields = [];
  const params = [id, userId];
  let index = 3;

  const map = {
    amount: "amount",
    description: "description",
    title: "title",
    category: "category",
    expenseDate: "expense_date",
  };

  for (const [key, dbCol] of Object.entries(map)) {
    if (updateData[key] !== undefined) {
      fields.push(`${dbCol} = $${index}`);
      params.push(updateData[key]);
      index++;
    }
  }

  if (fields.length === 0) return null;
  fields.push(`updated_at = CURRENT_TIMESTAMP`);

  const result = await query(
    `UPDATE expenses SET ${fields.join(", ")} WHERE id = $1 AND user_id = $2 
     RETURNING id, title, amount, category, description, expense_date AS "expenseDate"`,
    params,
  );
  return result.rows[0];
};

export const deleteExpense = async (id, userId) => {
  const result = await query(
    "DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING id",
    [id, userId],
  );
  return result.rowCount > 0;
};
