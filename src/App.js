import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Home, Menu } from "lucide-react";

// 기존의 PortfolioForm 컴포넌트를 import 합니다.
import PortfolioForm from "./PortfolioForm";

// 추가 페이지 컴포넌트들 (예시)
// const Dashboard = () => (
//   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//     <StatCard
//       title="전체 지원자"
//       count={66}
//       icon={<User className="h-6 w-6" />}
//     />
//     <StatCard
//       title="평가 대상"
//       count={15}
//       icon={<FileText className="h-6 w-6" />}
//     />
//     <StatCard title="탈락" count={51} icon={<X className="h-6 w-6" />} />

//     <div className="col-span-3">
//       <ApplicantTable />
//     </div>

//     <div className="col-span-3">
//       <ApplicantChart />
//     </div>
//   </div>
// );

// const Profile = () => <div className="p-6">Profile 페이지</div>;
// const Messages = () => <div className="p-6">Messages 페이지</div>;

// const StatCard = ({ title, count, icon }) => (
//   <div className="bg-white p-6 rounded-lg shadow-md">
//     <div className="flex items-center justify-between">
//       <div className="text-gray-500">{icon}</div>
//       <div className="text-xl font-semibold">{count}명</div>
//     </div>
//     <div className="mt-2 text-sm text-gray-600">{title}</div>
//   </div>
// );

// const ApplicantTable = () => (
//   <div className="bg-white p-6 rounded-lg shadow-md">
//     <h2 className="text-lg font-semibold mb-4">단계별 지원자 현황</h2>
//     <table className="min-w-full">
//       <thead>
//         <tr className="border-b">
//           <th className="text-left py-2">채용단계</th>
//           <th className="text-center py-2">ALL</th>
//           <th className="text-center py-2">평가</th>
//           <th className="text-center py-2">탈락</th>
//           <th className="text-right py-2">평균 평가 소요시간</th>
//         </tr>
//       </thead>
//       <tbody>
//         <ApplicantRow
//           stage="지원접수"
//           all={38}
//           evaluated={18}
//           failed={20}
//           avgTime="2일"
//         />
//         <ApplicantRow
//           stage="대면면접"
//           all={56}
//           evaluated={27}
//           failed={29}
//           avgTime="1일"
//         />
//         <ApplicantRow
//           stage="2차 서류심사"
//           all={22}
//           evaluated={15}
//           failed={7}
//           avgTime="5시간"
//         />
//         <ApplicantRow
//           stage="실무진 면접"
//           all={2}
//           evaluated={2}
//           failed={0}
//           avgTime="3시간"
//         />
//       </tbody>
//     </table>
//   </div>
// );

// const ApplicantRow = ({ stage, all, evaluated, failed, avgTime }) => (
//   <tr className="border-b">
//     <td className="py-2">{stage}</td>
//     <td className="text-center py-2">{all}</td>
//     <td className="text-center py-2">{evaluated}</td>
//     <td className="text-center py-2">{failed}</td>
//     <td className="text-right py-2">{avgTime}</td>
//   </tr>
// );

// const ApplicantChart = () => (
//   <div className="bg-white p-6 rounded-lg shadow-md">
//     <h2 className="text-lg font-semibold mb-4">지원 경로별 평균 평가 점수</h2>
//     <div className="h-64 bg-gray-100 rounded flex items-end justify-around p-4">
//       <ChartBar height="65%" label="지원접수" />
//       <ChartBar height="83%" label="대면면접" />
//       <ChartBar height="45%" label="2차 서류심사" />
//       <ChartBar height="70%" label="실무진 면접" />
//     </div>
//   </div>
// );

// const ChartBar = ({ height, label }) => (
//   <div className="flex flex-col items-center">
//     <div style={{ height }} className="w-16 bg-blue-400 rounded-t"></div>
//     <div className="mt-2 text-sm">{label}</div>
//   </div>
// );

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 사이드바 */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition duration-200 ease-in-out md:flex md:flex-col md:justify-between`}
      >
        <div className="w-64 bg-white h-full shadow-lg">
          <div className="flex items-center justify-between p-4 border-b h-16">
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <img
                src="/gridge_logo.png"
                alt="Salarable 로고"
                className="h-8"
              />
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-6">
            <NavLink to="/" icon={<Home />} label="대질문 생성" />
            {/* <NavLink to="/portfolio" icon={<FileText />} label="대질문 생성" />
            <NavLink to="/upload" icon={<FileText />} label="파일 업로드" /> */}
            {/* <NavLink to="/profile" icon={<User />} label="프로필" /> */}
            {/* <NavLink to="/messages" icon={<Mail />} label="메시지" /> */}
          </nav>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-5">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden mr-2"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">
              대질문 생성
            </h1>
            {/* <div className="flex items-center">
              <span className="bg-gray-200 rounded-full p-2">
                <User className="h-6 w-6" />
              </span>
            </div> */}
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

const NavLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200"
  >
    {icon}
    <span className="mx-4">{label}</span>
  </Link>
);

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<PortfolioForm />} />
          {/* <Route path="/portfolio" element={<PortfolioForm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/upload" element={<FileUploadForm />} /> */}
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
