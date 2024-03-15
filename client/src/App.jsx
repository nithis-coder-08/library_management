import { Route, Routes } from "react-router-dom";
import "./App.css";
import Nav from "./pages/Nav";
import DashboardPage from "./pages/DashboardPage";
import BooksPage from "./pages/BooksPage";

import BorrowPage from "./pages/BorrowPage";
import ReturnPage from "./pages/ReturnPage";
import PaymentPage from "./pages/PaymentPage";
import MembersPage from "./pages/MembersPage";
import EditMemberPage from "./pages/EditMemberPage";
import CreateMemberPage from "./pages/CreateMemberPage";

function App() {
  return (
    <>
      <Nav />
       <div className="max-sm:mx-5 sm:mx-8 md:mx-[6rem] lg:mx-[10rem] mb-16 mt-6 bg-slate-400 rounded-md shadow-lg px-20 py-8"> 
      
       
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/borrow" element={<BorrowPage />} />
          <Route path="/return" element={<ReturnPage />} />
          <Route path="/pay" element={<PaymentPage />} />
          <Route path="/create" element={<CreateMemberPage />} />
          <Route path="/edit/:username" element={<EditMemberPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
