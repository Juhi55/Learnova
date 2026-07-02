import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";

export default function Summaries() {
  const [documents, setDocuments] =
    useState([]);

  const [summaries, setSummaries] =
    useState([]);

  const [selectedDoc, setSelectedDoc] =
    useState("");

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

  const fetchSummaries = async () => {
    try {
      const res = await api.get(
        "/summaries"
      );

      setSummaries(
        res.data.summaries
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchSummaries();
  }, []);

  const generateSummary =
    async () => {
      if (!selectedDoc) {
        return alert(
          "Select a document"
        );
      }

      try {
        setLoading(true);

        await api.post(
          "/summaries/generate",
          {
            documentId:
              selectedDoc,
          }
        );

        await fetchSummaries();

      } catch (error) {
        console.error(
          error
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <Layout>

      {/* Header */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          AI Summaries 📝
        </h1>

        <p className="text-gray-500 mt-2">
          Generate concise study notes from your uploaded documents.
        </p>

      </div>

      {/* Generate Summary Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">

        <h2 className="text-2xl font-semibold mb-4">
          Generate New Summary
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
            generateSummary
          }
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          {loading
            ? "Generating..."
            : "Generate Summary"}
        </button>

      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-xl shadow p-6">

          <h3 className="text-gray-500">
            Total Summaries
          </h3>

          <p className="text-3xl font-bold mt-2">
            {summaries.length}
          </p>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <h3 className="text-gray-500">
            Documents Available
          </h3>

          <p className="text-3xl font-bold mt-2">
            {documents.length}
          </p>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <h3 className="text-gray-500">
            AI Generated
          </h3>

          <p className="text-3xl font-bold mt-2">
            🤖
          </p>

        </div>

      </div>

      {/* Summary List */}
      <div className="space-y-6">

        {summaries.length === 0 ? (

          <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500">
            No summaries generated yet.
          </div>

        ) : (

          summaries.map(
            (summary) => (
              <div
                key={summary._id}
                className="bg-white rounded-2xl shadow-lg p-8"
              >

                <div className="flex justify-between items-center mb-4">

                  <h2 className="text-xl font-bold">
                    📄{" "}
                    {
                      summary
                        .documentId
                        ?.fileName
                    }
                  </h2>

                  <span className="text-sm text-gray-500">
                    {new Date(
                      summary.createdAt
                    ).toLocaleDateString()}
                  </span>

                </div>

                <div className="border-t pt-4">

                  <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {
                      summary.summary
                    }
                  </p>

                </div>

              </div>
            )
          )

        )}

      </div>

    </Layout>
  );
}
