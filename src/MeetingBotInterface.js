import React, { useState } from "react";

const MeetingBotInterface = () => {
  const [meetingUrl, setMeetingUrl] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [category, setCategory] = useState("");

  const supportedPosition = ["BE", "FE"];

  const handlePositionSelect = (position) => {
    if (supportedPosition.includes(position)) {
      setSelectedPosition(position);
    }
  };

  const handleInviteAssistant = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/chat/create-bot`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            meet_link: meetingUrl,
            // selectedPosition: selectedPosition,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("초대 요청에 실패했습니다");
      }

      const data = await response.json();
      // 성공 처리
    } catch (error) {
      console.error("Error:", error);
      // 에러 처리
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            화상 면접 시작하기
          </h2>
          <p className="mt-2 text-gray-600">
            AI 면접 도우미를 화상면접에 초대하세요. 참가자의 음성을 분석하여
            추천질문을 생성해드려요.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">현재 플랜</h3>
            <div className="mt-1 flex items-center space-x-4">
              <span className="px-3 py-1 bg-gray-100 rounded-md text-sm">
                Free Trial
              </span>
              <button className="px-4 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm  transition-colors">
                Upgrade Plan
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              무료 플랜에서는 30분까지 AI 면접 도우미를 사용할 수 있어요.
            </p>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              참여할 주소를 입력해주세요 <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative">
              <input
                type="url"
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="https://meet.google.com/"
              />
            </div>
          </div>
          {/* Language Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              직무를 입력해주세요 <span className="text-red-500">*</span>
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {supportedPosition.map((language) => (
                <button
                  key={language}
                  onClick={() => handlePositionSelect(language)}
                  className={`px-3 py-1 rounded-md text-sm border transition-colors ${
                    selectedPosition.includes(language)
                      ? "bg-blue-100 text-blue-800 border-blue-200"
                      : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                  }`}
                >
                  {language}
                </button>
              ))}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              현재는 두가지 기술 직무만 가능해요.
            </p>
          </div>
          {/* Meeting Categories */}
          {/* <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Meeting Categories{" "}
              <span className="text-gray-400">(Optional)</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">Please Select</option>
              <option value="business">Business Meeting</option>
              <option value="education">Education</option>
              <option value="healthcare">Healthcare</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Selecting categories can improve the quality of your
              transcription.
            </p>
          </div> */}
          {/* Submit Button */}
          <button
            onClick={handleInviteAssistant}
            className="w-full py-3 px-4 text-white rounded-md bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>면접 도우미 초대하기</span>
          </button>
          <p className="text-sm text-center text-gray-500">
            회의 내용 수집을 위해서 AI bot이 면접에 참여하게 됩니다. AI bot을
            제거하지 말아주세요.
          </p>
        </div>
      </div>

      {/* Platform Support */}
    </div>
  );
};

export default MeetingBotInterface;
