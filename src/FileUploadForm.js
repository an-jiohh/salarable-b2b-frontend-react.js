import React, { useState } from "react";
import { Loader2, Upload, Trash2, PlusCircle } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

const FileUploadForm = () => {
  const [file, setFile] = useState(null);
  const [maskingTexts, setMaskingTexts] = useState([""]);
  const [replacementTexts, setReplacementTexts] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPdfUrl(url);
    }
  };

  const handleMaskingTextChange = (index, value) => {
    const newMaskingTexts = [...maskingTexts];
    newMaskingTexts[index] = value;
    setMaskingTexts(newMaskingTexts);
  };

  const handleReplacementTextChange = (index, value) => {
    const newReplacementTexts = [...replacementTexts];
    newReplacementTexts[index] = value;
    setReplacementTexts(newReplacementTexts);
  };

  const addTextFields = () => {
    setMaskingTexts([...maskingTexts, ""]);
    setReplacementTexts([...replacementTexts, ""]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    maskingTexts.forEach((text, index) => {
      formData.append(`masking_text`, text);
    });
    replacementTexts.forEach((text, index) => {
      formData.append(`replacement_text`, text);
    });

    try {
      const response = await fetch("http://localhost:8000/portfolio/mask", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        setPdfUrl(url);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="flex space-x-4">
      <div className="flex-1 max-w-4xl p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          포트폴리오 업로드
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-700"
            >
              파일 업로드:
            </label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"
            />
          </div>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <div className="w-5/12">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  마스킹할 텍스트
                </label>
              </div>
              <div className="w-5/12">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  대체할 텍스트
                </label>
              </div>
              <div className="w-2/12">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  삭제
                </label>
              </div>
            </div>
            {maskingTexts.map((text, index) => (
              <div key={index} className="flex items-center">
                <div className="flex-grow flex space-x-2">
                  <div className="w-1/2">
                    <input
                      type="text"
                      id={`maskingText-${index}`}
                      value={text}
                      onChange={(e) =>
                        handleMaskingTextChange(index, e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                    />
                  </div>
                  <div className="w-1/2">
                    <input
                      type="text"
                      id={`replacementText-${index}`}
                      value={replacementTexts[index]}
                      onChange={(e) =>
                        handleReplacementTextChange(index, e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newMaskingTexts = maskingTexts.filter(
                      (_, i) => i !== index
                    );
                    const newReplacementTexts = replacementTexts.filter(
                      (_, i) => i !== index
                    );
                    setMaskingTexts(newMaskingTexts);
                    setReplacementTexts(newReplacementTexts);
                  }}
                  className="ml-2 px-2 py-2 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={addTextFields}
              className="mt-1 px-2 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusCircle className="h-5 w-5" />
            </button>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !file}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  처리 중...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  제출
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <div
        className="flex-1 max-w-4xl p-6 bg-white rounded-lg shadow-md overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 120px)" }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          제출한 포트폴리오.pdf
        </h2>
        {pdfUrl ? (
          <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            ))}
          </Document>
        ) : (
          <p>여기에 제출한 포트폴리오의 내용이 표시됩니다.</p>
        )}
      </div>
    </div>
  );
};

export default FileUploadForm;
