import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";

export default function Documents() {
  const [file, setFile] = useState(null);

  const [documents, setDocuments] =
    useState([]);

  const [message, setMessage] =
    useState("");

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

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      return setMessage(
        "Select a file first"
      );
    }

    try {
      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      await api.post(
        "/documents/upload",
        formData
      );

      setMessage(
        "Upload successful ✅"
      );

      setFile(null);

      fetchDocuments();

    } catch (error) {
      setMessage(
        error.response?.data
          ?.message ||
          "Upload failed"
      );
    }
  };

  return (
    <Layout>

      {/* Header */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Documents 📄
        </h1>

        <p className="text-gray-500 mt-2">
          Upload and manage your study materials.
        </p>

      </div>

      {/* Upload Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">

        <h2 className="text-2xl font-semibold mb-4">
          Upload Document
        </h2>

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">

          <input
            type="file"
            onChange={(e) =>
              setFile(
                e.target.files[0]
              )
            }
            className="mb-4"
          />

          <div>
            <button
              onClick={
                handleUpload
              }
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Upload File
            </button>
          </div>

          {message && (
            <p className="mt-4 text-green-600 font-medium">
              {message}
            </p>
          )}

        </div>

      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-xl shadow p-6">

          <h3 className="text-gray-500">
            Total Documents
          </h3>

          <p className="text-3xl font-bold mt-2">
            {documents.length}
          </p>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <h3 className="text-gray-500">
            PDFs Uploaded
          </h3>

          <p className="text-3xl font-bold mt-2">
            {
              documents.filter(
                (doc) =>
                  doc.fileType?.includes(
                    "pdf"
                  )
              ).length
            }
          </p>

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <h3 className="text-gray-500">
            Latest Uploads
          </h3>

          <p className="text-3xl font-bold mt-2">
            {documents.length > 0
              ? "✓"
              : "0"}
          </p>

        </div>

      </div>

      {/* Documents List */}
      <div className="bg-white rounded-2xl shadow-lg p-8">

        <h2 className="text-2xl font-semibold mb-6">
          Uploaded Documents
        </h2>

        {documents.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No documents uploaded yet.
          </div>
        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="text-left py-3">
                    File Name
                  </th>

                  <th className="text-left py-3">
                    Type
                  </th>

                  <th className="text-left py-3">
                    Uploaded
                  </th>

                </tr>

              </thead>

              <tbody>

                {documents.map(
                  (doc) => (
                    <tr
                      key={doc._id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="py-4">
                        📄{" "}
                        {
                          doc.fileName
                        }
                      </td>

                      <td className="py-4">
                        {
                          doc.fileType
                        }
                      </td>

                      <td className="py-4">
                        {new Date(
                          doc.createdAt
                        ).toLocaleDateString()}
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