const Score = require('../models/score.model');
const User = require('../models/user.model');

// Function to retrieve user scores based on time range
const getUserScoresByTimeRange = async (startDate, endDate) => {
    try {
        const scores = await Score.find({ updatedAt: { $gte: startDate, $lte: endDate } });

        const userScores = scores.reduce((accumulator, score) => {
            accumulator[score.userId] = (accumulator[score.userId] || 0) + score.score;
            return accumulator;
        }, {});

        // Convert userScores object into an array of { userId, totalScore } objects
        const sortedUsers = Object.keys(userScores).map(userId => ({ userId, totalScore: userScores[userId] }));

        // Sort users based on totalScore in descending order
        sortedUsers.sort((a, b) => b.totalScore - a.totalScore);

        return sortedUsers;
    } catch (err) {
        throw new Error(`Error fetching user scores: ${err.message}`);
    }
};

const getUsersByTimeRange = async (startDate, endDate) => {
    try {
        const sortedUsers = await getUserScoresByTimeRange(startDate, endDate);
        return await getUsersDetails(sortedUsers);
    } catch (err) {
        throw new Error(`Error fetching users by score: ${err.message}`);
    }
};

const getUsersAll = async () => {
    try {
        const sortedUsers = await getUserScoresByTimeRange(new Date(0), new Date());
        return await getUsersDetails(sortedUsers);
    } catch (err) {
        throw new Error(`Error fetching users by score: ${err.message}`);
    }
};



const getUsersLastMonth = async () => {
    try {
        const oneMonthAgo = new Date();
        oneMonthAgo.setDate(oneMonthAgo.getDate() - 31); // Subtract 7 days
        const startDate = new Date(oneMonthAgo.getFullYear(), oneMonthAgo.getMonth(), oneMonthAgo.getDate()); // Last month start date
        const endDate = new Date(); // Current date
        return await getUsersByTimeRange(startDate, endDate);
    } catch (err) {
        throw new Error(`Error fetching users by score for the last week: ${err.message}`);
    }
};

const getUsersLastWeek = async () => {
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Subtract 7 days
        const startDate = new Date(oneWeekAgo.getFullYear(), oneWeekAgo.getMonth(), oneWeekAgo.getDate()); // Last week start date
        const endDate = new Date(); // Current date
        return await getUsersByTimeRange(startDate, endDate);
    } catch (err) {
        throw new Error(`Error fetching users by score for the last week: ${err.message}`);
    }
};

const getUsersToday = async () => {
    try {
        const today = new Date();
        const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Today's start date
        const endDate = new Date(); // Current date
        return await getUsersByTimeRange(startDate, endDate);
    } catch (err) {
        throw new Error(`Error fetching users by score for today: ${err.message}`);
    }
};

// Function to get user details based on sorted users
const getUsersDetails = async (sortedUsers) => {
    const users = await User.find({ userId: { $in: sortedUsers.map(user => user.userId) } });

    // Create response object with user details and total score
    const response = sortedUsers.map(({ userId, totalScore }) => {
        const user = users.find(user => user.userId.toString() === userId);
        return {
            name: user ? user.name : 'Unknown', // Check if user exists
            totalScore
        };
    });

    return response;
};

module.exports = {
    getUsersAll,
    getUsersLastMonth,
    getUsersLastWeek,
    getUsersToday,
};
