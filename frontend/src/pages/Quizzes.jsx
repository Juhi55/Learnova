import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";

export default function Quizzes() {
  const [documents, setDocuments] =
    useState([]);

  const [quizzes, setQuizzes] =
    useState([]);

  const [selectedDoc, setSelectedDoc] =
    useState("");

  const [answers, setAnswers] =
    useState({});

  const [score, setScore] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const fetchDocuments = async () => {
    try {
      const res = await api.get(
        "/documents"
      );

      setDocuments(
        res.data.documents
      );
    } catch (error) {
      console.error(error);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const res = await api.get(
        "/quizzes"
      );

      setQuizzes(
        res.data.quizzes
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchQuizzes();
  }, []);

  const generateQuiz =
    async () => {
      if (!selectedDoc) {
        return alert(
          "Select a document"
        );
      }

      try {
        setLoading(true);

        await api.post(
          "/quizzes/generate",
          {
            documentId:
              selectedDoc,
          }
        );

        await fetchQuizzes();

        setAnswers({});
        setScore(null);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  const latestQuiz =
    quizzes[0];

  const submitQuiz = () => {
    let correct = 0;

    latestQuiz.questions.forEach(
      (q, index) => {
        if (
          answers[index] ===
          q.answer
        ) {
          correct++;
        }
      }
    );

    setScore(correct);
  };

  return (
    <Layout>

      {/* Header */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          AI Quiz Generator ❓
        </h1>

        <p className="text-gray-500 mt-2">
          Generate quizzes from your uploaded study materials.
        </p>

      </div>

      {/* Generate Quiz Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">

        <h2 className="text-2xl font-semibold mb-4">
          Generate New Quiz
        </h2>

        <select
          className="w-full border rounded-lg p-3 mb-4"
          value={selectedDoc}
          onChange={(e) =>
            setSelectedDoc(
              e.target.value
            )
          }
        >
          <option value="">
            Select Document
          </option>

          {documents.map(
            (doc) => (
              <option
                key={doc._id}
                value={doc._id}
              >
                {doc.fileName}
              </option>
            )
          )}
        </select>

        <button
          onClick={
            generateQuiz
          }
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          {loading
            ? "Generating..."
            : "Generate Quiz"}
        </button>

      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-xl shadow p-6">

          <h3 className="text-gray-500">
            Total Quizzes
          </h3>

          <p className="text-3xl font-bold mt-2">
            {quizzes.length}
          </p>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <h3 className="text-gray-500">
            Documents
          </h3>

          <p className="text-3xl font-bold mt-2">
            {documents.length}
          </p>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <h3 className="text-gray-500">
            Latest Score
          </h3>

          <p className="text-3xl font-bold mt-2">
            {score !== null
              ? `${score}/${latestQuiz?.questions?.length}`
              : "--"}
          </p>

        </div>

      </div>

      {/* Quiz Area */}
      {latestQuiz && (

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-2xl font-bold">
              Quiz Practice
            </h2>

            <span className="text-sm text-gray-500">
              {latestQuiz.documentId?.fileName}
            </span>

          </div>

          {latestQuiz.questions.map(
            (
              question,
              index
            ) => (
              <div
                key={index}
                className="mb-8 border-b pb-6"
              >

                <p className="font-semibold text-lg mb-4">

                  {index + 1}.{" "}
                  {
                    question.question
                  }

                </p>

                <div className="space-y-3">

                  {question.options.map(
                    (
                      option,
                      optionIndex
                    ) => (
                      <label
                        key={
                          optionIndex
                        }
                        className="flex items-center gap-3 cursor-pointer"
                      >

                        <input
                          type="radio"
                          name={`q${index}`}
                          value={option}
                          checked={
                            answers[
                              index
                            ] === option
                          }
                          onChange={(
                            e
                          ) =>
                            setAnswers({
                              ...answers,
                              [index]:
                                e.target
                                  .value,
                            })
                          }
                        />

                        {option}

                      </label>
                    )
                  )}

                </div>

              </div>
            )
          )}

          <button
            onClick={
              submitQuiz
            }
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            Submit Quiz
          </button>

          {score !== null && (

            <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl">

              <h3 className="text-2xl font-bold text-green-700">
                🎉 Quiz Completed
              </h3>

              <p className="text-xl mt-2">

                Score: {score} /{" "}
                {
                  latestQuiz
                    .questions.length
                }

              </p>

              <p className="text-gray-600 mt-2">

                Accuracy:{" "}
                {Math.round(
                  (score /
                    latestQuiz
                      .questions
                      .length) *
                    100
                )}
                %

              </p>

            </div>

          )}

        </div>

      )}

      {!latestQuiz && (

        <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500">

          No quizzes generated yet.

        </div>

      )}

    </Layout>
  );
}