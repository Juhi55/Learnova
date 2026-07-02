
import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import Layout from "../components/Layout";
import api from "../services/api";

export default function CourseDetails() {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [course,
    setCourse] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {
    fetchCourse();
  }, []);

  const fetchCourse =
    async () => {

      try {

        const res =
          await api.get(
            `/library/${id}`
          );

        setCourse(
          res.data
        );

      } catch (error) {

        console.error(
          "Course Details Error:",
          error
        );

      } finally {

        setLoading(false);

      }
    };

  if (loading) {
    return (
      <Layout>
        <div className="p-6">
          Loading...
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="p-6">
          Course not found.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>

      <div>

        {/* Back Button */}

        <button
          onClick={() =>
            navigate("/library")
          }
          className="
            mb-6
            bg-gray-200
            hover:bg-gray-300
            px-4
            py-2
            rounded-lg
            transition
          "
        >
          ← Back to Library
        </button>

        {/* Course Title */}

        <h1 className="text-4xl font-bold mb-8">
          📄 {course.document.fileName}
        </h1>

        {/* Summary */}

        {course.summary && (

          <div className="bg-white p-6 rounded-xl shadow mb-6">

            <h2 className="text-2xl font-bold mb-4">
              📝 Summary
            </h2>

            <p className="whitespace-pre-wrap">
              {course.summary.summary}
            </p>

          </div>

        )}

        {/* Quiz */}

        {course.quiz && (

          <div className="bg-white p-6 rounded-xl shadow mb-6">

            <h2 className="text-2xl font-bold mb-4">
              ❓ Quiz
            </h2>

            {course.quiz.questions.map(
              (q, index) => (

                <div
                  key={index}
                  className="
                    mb-6
                    border
                    border-gray-200
                    rounded-lg
                    p-4
                  "
                >

                  <p className="font-bold text-lg mb-4">
                    {index + 1}. {q.question}
                  </p>

                  <div className="space-y-2">

                    {q.options.map(
                      (option, i) => (

                        <div
                          key={i}
                          className={`
                            p-3
                            rounded-lg
                            border

                            ${
                              option === q.answer
                                ? "bg-green-100 border-green-400 text-green-700 font-semibold"
                                : "bg-gray-50 border-gray-200"
                            }
                          `}
                        >

                          {option}

                          {option === q.answer && (
                            <span className="ml-2">
                              ✅ Correct Answer
                            </span>
                          )}

                        </div>

                      )
                    )}

                  </div>

                  <div
                    className="
                      mt-4
                      bg-green-50
                      border
                      border-green-300
                      text-green-700
                      p-3
                      rounded-lg
                      font-semibold
                    "
                  >
                    Correct Answer:
                    {" "}
                    {q.answer}
                  </div>

                </div>

              )
            )}

          </div>

        )}

        {/* Flashcards */}

        {course.flashcards && (

          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-2xl font-bold mb-4">
              🗂 Flashcards
            </h2>

            {course.flashcards.cards.map(
              (card, index) => (

                <div
                  key={index}
                  className="
                    border
                    rounded-lg
                    p-4
                    mb-4
                  "
                >

                  <h3 className="font-bold text-lg mb-2">
                    {card.front}
                  </h3>

                  <p>
                    {card.back}
                  </p>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </Layout>
  );
}
