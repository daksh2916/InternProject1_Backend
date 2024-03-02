const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService ,scoreService} = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const getAll = async (req, res) => {
  try {
      const users = await scoreService.getUsersAll();
      res.status(200).json(users);
  } catch (err) {
      console.error("Error fetching users by score:", err);
      res.status(500).json({
          success: false,
          message: 'Internal server error'
      });
  }
};

const getLastMonth = async (req, res) => {
  try {
      const response = await scoreService.getUsersLastMonth();
      res.status(200).json(response);
  } catch (err) {
      console.error("Error fetching users by score for the last month:", err);
      res.status(500).json({
          success: false,
          message: 'Internal server error'
      });
  }
};

const getLastWeek = async (req, res) => {
  try {
      const response = await scoreService.getUsersLastWeek();
      res.status(200).json(response);
  } catch (err) {
      console.error("Error fetching users by score for the last week:", err);
      res.status(500).json({
          success: false,
          message: 'Internal server error'
      });
  }
};

const getToday = async (req, res) => {
  try {
      const response = await scoreService.getUsersToday();
      res.status(200).json(response);
  } catch (err) {
      console.error("Error fetching users by score for today:", err);
      res.status(500).json({
          success: false,
          message: 'Internal server error'
      });
  }
};

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getAll,
  getLastMonth,
  getLastWeek,
  getToday,
};
