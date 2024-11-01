import React, { useState } from "react";
import { Loader2, Copy } from "lucide-react";
import ModalFileUploadForm from "./ModalFileUploadForm";
import Modal from "react-modal";

Modal.setAppElement("#root");

const PortfolioForm = () => {
  const [portfolio, setPortfolio] = useState("");
  const [jobPosting, setJobPosting] = useState("");
  const [applicationSkill, setApplicationSkill] = useState("FE");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileUpload = (uploadedPortfolio) => {
    setPortfolio(uploadedPortfolio);
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/v4/create_question`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            portfolio_data: portfolio,
            job_description_data: jobPosting,
            input_position: applicationSkill,
          }),
        }
      );
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="portfolio"
            className="block text-sm font-medium text-gray-700"
          >
            포트폴리오
          </label>
          <textarea
            id="portfolio"
            value={portfolio}
            onChange={(e) => setPortfolio(e.target.value)}
            rows={15}
            className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
            placeholder="포트폴리오를 입력하세요..."
          />
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            포트폴리오 첨부
          </button>
        </div>

        <div>
          <label
            htmlFor="jobPosting"
            className="block text-sm font-medium text-gray-700"
          >
            채용공고
          </label>
          <textarea
            id="jobPosting"
            value={jobPosting}
            onChange={(e) => setJobPosting(e.target.value)}
            rows={15}
            className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
            placeholder="채용공고를 입력하세요..."
          />
        </div>

        <div>
          <label
            htmlFor="applicationSkill"
            className="block text-sm font-medium text-gray-700"
          >
            지원역량
          </label>
          <select
            id="applicationSkill"
            value={applicationSkill}
            onChange={(e) => setApplicationSkill(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-1.5 px-2"
          >
            <option value="FE">FE</option>
            <option value="BE">BE</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !portfolio.trim() || !jobPosting.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                처리 중...
              </>
            ) : (
              "제출"
            )}
          </button>
        </div>
      </form>

      {/* {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md relative">
          <h3 className="text-lg font-medium text-gray-900">결과:</h3>
          <button
            onClick={() =>
              navigator.clipboard.writeText(
                Object.entries(result.output_data)
                  .map(([key, values]) => `- ${key}\n${values.join("\n")}`)
                  .join("\n\n")
              )
            }
            className="absolute top-2 right-2 p-2 text-blue-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            title="복사"
          >
            <Copy className="h-5 w-5" />
          </button>
        </div>
      )} */}
      {result && (
        <div className="mt-2 text-sm text-gray-700">
          <h3 className="text-lg font-medium text-gray-900">Wow Point 질문</h3>
          <div className="mt-6 p-4 bg-gray-100 rounded-md relative mb-4">
            <h3 className="text-md font-medium text-gray-900">
              기술기반 Wow point
            </h3>
            {result.questions_wowpoint.questions_wowpoint_tech.map(
              (question, index) => (
                <div key={index} className="mb-2">
                  {question}
                </div>
              )
            )}
          </div>
          <div className="mt-6 p-4 bg-gray-100 rounded-md relative mb-4">
            <h3 className="text-sm font-medium text-gray-900">
              경험기반 Wow point
            </h3>
            {result.questions_wowpoint.questions_wowpoint_experience.map(
              (question, index) => (
                <div key={index} className="mb-2">
                  {question}
                </div>
              )
            )}
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            의심스러운 정황 질문
          </h3>
          <div className="mt-6 p-4 bg-gray-100 rounded-md relative mb-4">
            <h3 className="text-sm font-medium text-gray-900">
              포트폴리오에서의 의심스러운 정황
            </h3>
            {result.questions_doubtpoint.doubt_questions_pf_only.map(
              (question, index) => (
                <div key={index} className="mb-2">
                  {question}
                </div>
              )
            )}
          </div>
          <div className="mt-6 p-4 bg-gray-100 rounded-md relative mb-4">
            <h3 className="text-sm font-medium text-gray-900">
              포트폴리오와 채용공고 모두에서의 의심스러운 정황
            </h3>
            {result.questions_doubtpoint.doubt_questions_jd_and_pf.map(
              (question, index) => (
                <div key={index} className="mb-2">
                  {question}
                </div>
              )
            )}
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            채용공고 - pf의 부합성, [채용공고, 포트폴리오] 교집합 질문:
          </h3>
          <h3 className="text-lg font-medium text-gray-900">자격요건</h3>
          <div className="mt-6 p-4 bg-gray-100 rounded-md relative mb-4">
            {Object.entries(
              result.questions_requirements_in_pf_semantic_search
            ).map(([key, value]) => (
              <div key={key} className="mb-2">
                <div className="font-semibold">{key}</div>
                <ul className="list-disc pl-5">
                  {value.experience_based_questions.map((question, index) => (
                    <li key={index} className="mb-1">
                      {question}
                    </li>
                  ))}
                </ul>
                <ul className="list-disc pl-5">
                  {value.tech_based_questions.map((question, index) => (
                    <li key={index} className="mb-1">
                      {question}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <h3 className="text-lg font-medium text-gray-900">우대사항</h3>
          <div className="mt-6 p-4 bg-gray-100 rounded-md relative mb-4">
            {Object.entries(
              result.questions_preferences_in_pf_semantic_search
            ).map(([key, value]) => (
              <div key={key} className="mb-2">
                <div className="font-bold">{key}</div>
                <ul className="list-disc pl-5">
                  {value.experience_based_questions.map((question, index) => (
                    <li key={index} className="mb-1">
                      {question}
                    </li>
                  ))}
                </ul>
                <ul className="list-disc pl-5">
                  {value.tech_based_questions.map((question, index) => (
                    <li key={index} className="mb-1">
                      {question}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            채용공고 - pf의 부합성, [채용공고, 포트폴리오] 차집합 질문:
          </h3>
          <h3 className="text-lg font-medium text-gray-900">자격요건</h3>
          <div className="mt-6 p-4 bg-gray-100 rounded-md relative mb-4">
            {Object.entries(
              result.questions_requirements_not_in_pf_semantic_search
            ).map(([key, value]) => (
              <div key={key} className="mb-2">
                <div className="font-bold">{key}</div>
                <ul className="list-disc pl-5">
                  {value.map((item, index) => (
                    <li key={index} className="mb-1">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <h3 className="text-lg font-medium text-gray-900">우대사항</h3>
          <div className="mt-6 p-4 bg-gray-100 rounded-md relative mb-4">
            {Object.entries(
              result.questions_preferences_not_in_pf_semantic_search
            ).map(([key, value]) => (
              <div key={key} className="mb-2">
                <div className="font-bold">{key}</div>
                <ul className="list-disc pl-5">
                  {value.map((item, index) => (
                    <li key={index} className="mb-1">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 모달 파일 업로드 폼 */}
      <ModalFileUploadForm
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onFileUpload={handleFileUpload}
      />
    </div>
  );
};

export default PortfolioForm;
