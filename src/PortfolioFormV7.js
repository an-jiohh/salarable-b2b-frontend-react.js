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
        `${process.env.REACT_APP_API_URL}/v7/create_question`,
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
      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        alert("제출 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("파일 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  console.log(result);

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
      {/* {result && (
        <div className="mt-4 rounded-lg border border-gray-200 p-4">
          <pre className="whitespace-pre-wrap break-words text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )} */}

      {result && (
        <div className="mt-4 space-y-6">
          {/* 필수 요구사항 관련 질문 */}
          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              자격요건 기준 week point 질문
            </h3>
            <div className="space-y-4">
              {result.main_questions_weakpoint_requirements?.requirements.map(
                (item, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <p className="text-sm mb-2">
                      <span className="font-medium">기술 키워드 : </span>
                      {item.tech_keyword}
                    </p>
                    <p className="text-sm">{item.question}</p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* 우대사항 관련 질문 */}
          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              우대사항 기준 week point 질문
            </h3>
            <div className="space-y-4">
              {result.main_questions_weakpoint_preferences?.preferences.map(
                (item, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <p className="text-sm mb-2">
                      <span className="font-medium">기술 키워드 : </span>
                      {item.tech_keyword}
                    </p>
                    <p className="text-sm">{item.question}</p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* 기술 검증 질문 */}
          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              자격요건 기준 check point 질문
            </h3>
            <div className="space-y-4">
              {result.main_questions_checkpoint_requirements?.requirements.map(
                (item, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <p className="text-sm mb-2">
                      <span className="font-medium">기술 키워드 : </span>
                      {item.tech_keyword}
                    </p>
                    <p className="text-sm">{item.question}</p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* 체크포인트 우대사항 질문 */}
          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              우대사항 기준 check point 질문
            </h3>
            <div className="space-y-4">
              {result.main_questions_checkpoint_preferences?.preferences?.map(
                (item, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <p className="text-sm mb-2">
                      <span className="font-medium">기술 키워드 : </span>
                      {item.tech_keyword}
                    </p>
                    <p className="text-sm">{item.question}</p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* WOW 포인트 질문 */}
          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              WOW 포인트 질문
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium mb-2">기술 관련</h4>
                {result.questions_wowpoint?.questions_wowpoint_tech.map(
                  (question, index) => (
                    <p key={index} className="text-sm mb-2">
                      {question}
                    </p>
                  )
                )}
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium mb-2">경험 관련</h4>
                {result.questions_wowpoint?.questions_wowpoint_experience.map(
                  (question, index) => (
                    <p key={index} className="text-sm mb-2">
                      {question}
                    </p>
                  )
                )}
              </div>
            </div>
          </div>

          {/* 의심 포인트 질문 */}
          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              의심 포인트 질문
            </h3>
            <div className="space-y-4">
              {result.questions_doubtpoint?.questions_doubtpoint.map(
                (question, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <p className="text-sm">{question}</p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* 후속 필수 요구사항 질문 */}
          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              자격요건 기준 week point 꼬리 질문
            </h3>
            <div className="space-y-4">
              {result.followed_questions_weakpoint_requirements?.requirements?.map(
                (item, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <p className="text-sm mb-2">
                      <span className="font-medium">기술 키워드 : </span>
                      {item?.tech_keyword}
                    </p>
                    <div className="space-y-2">
                      {item?.questions?.map((question, qIndex) => (
                        <p key={qIndex} className="text-sm">
                          • {question}
                        </p>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* 후속 우대사항 질문 */}
          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              우대사항 기준 week point 꼬리 질문
            </h3>
            <div className="space-y-4">
              {result.followed_questions_weakpoint_preferences?.preferences?.map(
                (item, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <p className="text-sm mb-2">
                      <span className="font-medium">기술 키워드 : </span>
                      {item?.tech_keyword}
                    </p>
                    <div className="space-y-2">
                      {item?.questions?.map((question, qIndex) => (
                        <p key={qIndex} className="text-sm">
                          • {question}
                        </p>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* 후속 체크포인트 필수 질문 */}
          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              자격요건 기준 check point 꼬리 질문
            </h3>
            <div className="space-y-4">
              {result.followed_questions_checkpoint_requirements?.requirements?.map(
                (item, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <p className="text-sm mb-2">
                      <span className="font-medium">기술 키워드 : </span>
                      {item?.tech_keyword}
                    </p>
                    <div className="space-y-2">
                      {item?.questions?.map((question, qIndex) => (
                        <p key={qIndex} className="text-sm">
                          • {question}
                        </p>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* 후속 체크포인트 우대사항 질문 */}
          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              우대사항 기준 check point 꼬리 질문
            </h3>
            <div className="space-y-4">
              {result.followed_questions_checkpoint_preferences?.requirements?.map(
                (item, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <p className="text-sm mb-2">
                      <span className="font-medium">기술 키워드 : </span>
                      {item?.tech_keyword}
                    </p>
                    <div className="space-y-2">
                      {item?.questions?.map((question, qIndex) => (
                        <p key={qIndex} className="text-sm">
                          • {question}
                        </p>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
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
