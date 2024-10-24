import React, { useState } from "react";
import { Loader2, Upload, Trash2, PlusCircle, EyeOff } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import Modal from "react-modal";
import "./styles/modal.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

const ModalFileUploadForm = ({ isOpen, onRequestClose, onFileUpload }) => {
  const [file, setFile] = useState(null);
  const [maskingTexts, setMaskingTexts] = useState([""]);
  const [replacementTexts, setReplacementTexts] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [maskingText, setMaskingText] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  //파일 선택
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append(`masking_text`, "");
      formData.append(`replacement_text`, "");

      try {
        const response = await fetch("http://localhost:8000/portfolio/mask", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(new Blob([blob]));
          setPdfUrl(url);
          //const text = await blob.text();
          const text = "asdf";
          setMaskingText(text);
          //onFileUpload(text);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  //마스킹 시
  const handleMasking = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(`masking_text`, "");
    formData.append(`replacement_text`, "");
    maskingTexts.forEach((text, index) => {
      if (text.trim() !== "") {
        formData.append(`masking_text`, text);
      }
    });
    replacementTexts.forEach((text, index) => {
      if (text.trim() !== "") {
        formData.append(`replacement_text`, text);
      }
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
        //const text = await blob.text();
        const text = "asdf";
        setMaskingText(text);
        //onFileUpload(text);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  //제출 시
  const handleSubmit = async (event) => {
    setPdfUrl(false);
    setMaskingTexts([]);
    setReplacementTexts([]);
    onRequestClose();
    onFileUpload("asdf");
    // event.preventDefault();

    // try {
    //   // 파일 이름 가져오기 (file 상태가 File 객체라고 가정)
    //   const fileName = file ? file.name : "";

    //   const response = await fetch("http://localhost:8000/maskedText", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ file_name: fileName }),
    //   });

    //   if (response.ok) {
    //     const result = await response.json();
    //     // 결과 처리
    //     onFileUpload(result.masked_text); // 서버 응답에 masked_text가 포함되어 있다고 가정
    //     onRequestClose();
    //     setPdfUrl(false);
    //   } else {
    //     console.error("서버 응답 오류:", response.status);
    //   }
    // } catch (error) {
    //   console.error("제출 오류:", error);
    // }
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

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal"
      overlayClassName="overlay"
    >
      <div className="flex space-x-4">
        <div className="flex-1 max-w-4xl p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            포트폴리오 업로드
          </h1>
          <form onSubmit={handleMasking} className="space-y-6">
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
                      <select
                        id={`replacementText-${index}`}
                        value={replacementTexts[index]}
                        onChange={(e) =>
                          handleReplacementTextChange(index, e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 bg-white align-middle"
                        style={{ height: "2.6rem" }}
                      >
                        <option value="" disabled hidden>
                          선택하세요
                        </option>
                        <option value="name">name</option>
                        <option value="univ">univ</option>
                        <option value="etc">etc</option>
                      </select>
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
            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || isUploading || !file}
                onClick={handleMasking}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    마스킹 중...
                  </>
                ) : isUploading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    업로드 중...
                  </>
                ) : (
                  <>
                    <EyeOff className="mr-2 h-5 w-5" />
                    마스킹
                  </>
                )}
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
              >
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  제출
                </>
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
                  scale={1.0}
                  width={600}
                />
              ))}
            </Document>
          ) : (
            <p>
              {loading ? (
                <Loader2 className="animate-spin inline-block h-5 w-5 text-gray-500" />
              ) : (
                "여기에 제출한 포트폴리오의 내용이 표시됩니다."
              )}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ModalFileUploadForm;
