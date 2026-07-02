
const Leaderboard =
  require(
    "../models/Leaderboard"
  );

const addPoints =
  async (
    userId,
    points
  ) => {

    let record =
      await Leaderboard.findOne({
        userId,
      });

    if (!record) {

      record =
        await Leaderboard.create({
          userId,
          points,
        });

    } else {

      record.points +=
        points;

      await record.save();
    }
  };

module.exports =
  addPoints;

