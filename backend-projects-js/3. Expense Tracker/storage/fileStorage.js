import fs from "fs";

const FILE_PATH = "./data/expense.json";

export const readExpenses = () => {

    try {

    const data =
      fs.readFileSync(
        FILE_PATH,
        "utf-8"
      );

    return data
      ? JSON.parse(data)
      : [];

  } catch (error) {

    return [];

  }

};

export const writeExpenses = (expenses) => {

    
    fs.writeFileSync(FILE_PATH, JSON.stringify(
        expenses,
        null,
        2
    ))
  
};
