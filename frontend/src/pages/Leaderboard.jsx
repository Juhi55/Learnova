
import {
  useEffect,
  useState,
} from "react";

import Layout from "../components/Layout";
import api from "../services/api";

export default function Leaderboard() {

  const [leaderboard,
    setLeaderboard] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {

    fetchLeaderboard();

  }, []);

  const fetchLeaderboard =
    async () => {

      try {

        const res =
          await api.get(
            "/leaderboard"
          );

        setLeaderboard(
          res.data.leaderboard
        );

      } catch (error) {

        console.error(
          "Leaderboard Error:",
          error
        );

      } finally {

        setLoading(false);

      }
    };

  const getRankIcon =
    (index) => {

      if (index === 0)
        return "🥇";

      if (index === 1)
        return "🥈";

      if (index === 2)
        return "🥉";

      return `#${index + 1}`;
    };

  return (
    <Layout>

      <div>

        <div className="mb-8">

          <h1 className="text-4xl font-bold">
            🏆 Leaderboard
          </h1>

          <p className="text-gray-500 mt-2">
            Top learners ranked by XP.
          </p>

        </div>

        {loading ? (

          <div className="bg-white p-6 rounded-xl shadow">

            Loading leaderboard...

          </div>

        ) : leaderboard.length === 0 ? (

          <div className="bg-white p-6 rounded-xl shadow">

            No leaderboard data available.

          </div>

        ) : (

          <div className="bg-white rounded-xl shadow overflow-hidden">

            <table className="w-full">

              <thead>

                <tr className="bg-gray-100">

                  <th className="text-left p-4">
                    Rank
                  </th>

                  <th className="text-left p-4">
                    User
                  </th>

                  <th className="text-left p-4">
                    Email
                  </th>

                  <th className="text-right p-4">
                    XP
                  </th>

                </tr>

              </thead>

              <tbody>

                {leaderboard.map(
                  (
                    user,
                    index
                  ) => (

                    <tr
                      key={
                        user._id
                      }
                      className="
                        border-t
                        hover:bg-gray-50
                      "
                    >

                      <td className="p-4 text-lg font-bold">

                        {getRankIcon(
                          index
                        )}

                      </td>

                      <td className="p-4">

                        {
                          user.userId
                            ?.name
                        }

                      </td>

                      <td className="p-4 text-gray-500">

                        {
                          user.userId
                            ?.email
                        }

                      </td>

                      <td className="p-4 text-right font-bold text-blue-600">

                        {
                          user.points
                        } XP

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </Layout>
  );
}

