import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";

export default function Flashcards() {
  const [documents, setDocuments] =
    useState([]);

  const [flashcards, setFlashcards] =
    useState([]);

  const [selectedDoc, setSelectedDoc] =
    useState("");

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [showBack, setShowBack] =
    useState(false);

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

  const fetchFlashcards =
    async () => {
      try {
        const res = await api.get(
          "/flashcards"
        );

        setFlashcards(
          res.data.flashcards
        );
      } catch (error) {
        console.error(error);
      }
    };

  useEffect(() => {
    fetchDocuments();
    fetchFlashcards();
  }, []);

  const generateFlashcards =
    async () => {
      if (!selectedDoc) {
        return alert(
          "Select a document"
        );
      }

      try {
        setLoading(true);

        await api.post(
          "/flashcards/generate",
          {
            documentId:
              selectedDoc,
          }
        );

        await fetchFlashcards();

        setCurrentIndex(0);
        setShowBack(false);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  const latestSet =
    flashcards[0];

  const currentCard =
    latestSet?.cards?.[
      currentIndex
    ];

  return (
    <Layout>

      {/* Header */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          AI Flashcards 🗂
        </h1>

        <p className="text-gray-500 mt-2">
          Learn faster using AI-generated flashcards.
        </p>

      </div>

      {/* Generate Flashcards */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">

        <h2 className="text-2xl font-semibold mb-4">
          Generate Flashcards
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
            generateFlashcards
          }
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          {loading
            ? "Generating..."
            : "Generate Flashcards"}
        </button>

      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">
            Flashcard Sets
          </h3>

          <p className="text-3xl font-bold mt-2">
            {flashcards.length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">
            Total Cards
          </h3>

          <p className="text-3xl font-bold mt-2">
            {latestSet?.cards?.length ||
              0}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">
            Current Progress
          </h3>

          <p className="text-3xl font-bold mt-2">
            {currentCard
              ? `${currentIndex + 1}/${latestSet.cards.length}`
              : "0"}
          </p>
        </div>

      </div>

      {/* Flashcard Study Area */}
      {currentCard ? (

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-2xl font-bold">
              Study Mode
            </h2>

            <span className="text-sm text-gray-500">
              Card {currentIndex + 1}
              {" / "}
              {latestSet.cards.length}
            </span>

          </div>

          {/* Flashcard */}
          <div
            onClick={() =>
              setShowBack(
                !showBack
              )
            }
            className="
              cursor-pointer
              min-h-[300px]
              flex
              items-center
              justify-center
              text-center
              text-2xl
              font-semibold
              rounded-2xl
              border-2
              border-blue-200
              bg-blue-50
              p-10
              transition-all
              duration-300
              hover:shadow-xl
            "
          >

            <div>

              <div className="text-sm text-blue-500 mb-4">
                {showBack
                  ? "Answer"
                  : "Question"}
              </div>

              <div>
                {showBack
                  ? currentCard.back
                  : currentCard.front}
              </div>

            </div>

          </div>

          <p className="text-center text-gray-500 mt-4">
            Click card to flip
          </p>

          {/* Navigation */}
          <div className="flex justify-between mt-8">

            <button
              disabled={
                currentIndex === 0
              }
              onClick={() => {
                setCurrentIndex(
                  currentIndex - 1
                );

                setShowBack(
                  false
                );
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>

            <button
              onClick={() =>
                setShowBack(
                  !showBack
                )
              }
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg"
            >
              Flip Card
            </button>

            <button
              disabled={
                currentIndex ===
                latestSet.cards.length - 1
              }
              onClick={() => {
                setCurrentIndex(
                  currentIndex + 1
                );

                setShowBack(
                  false
                );
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg disabled:opacity-50"
            >
              Next
            </button>

          </div>

        </div>

      ) : (

        <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500">

          No flashcards generated yet.

        </div>

      )}

    </Layout>
  );
}