import Expense from "../models/expense.model";
import errorHandler from "../helpers/dbErrorHandler";

const create = async (req, res) => {
  try {
    req.body.recorded_by = req.auth._id;
    const expense = new Expense(req.body);
    await expense.save();

    return res.status(200).json({
      message: "Expense recorded!",
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const listByUser = async (req, res) => {
  const firstDay = req.query.firstDay;
  const lastDay = req.query.lastDay;

  try {
    const expenses = await Expense.find({
      $and: [
        { incurred_on: { $gte: firstDay, $lte: lastDay } },
        { recorded_by: req.auth._id },
      ],
    })
      .sort("incurred_on")
      .populate("recorded_by", "_id name");

    return res.status(200).json(expenses);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default { create, listByUser };
