//-- React --//

//-- AWS SDK --//

//-- CHRT Components --//
import AWS_SDK_V3_CUP_TOKENS from "./components/SDK_CLIENTS/AWS_SDK_V3_CUP_TOKENS";

import LandingPage from "./components/LandingPage/LandingPage.js";
import Layout from "./components/Layout/Layout";

//-- --//
import TradingJournal from "./components/TradingJournal/TradingJournal";
import TradingJournalDashboard from "./components/TradingJournal/TradingJournalDashboard";
import TradingJournalFiles from "./components/TradingJournal/TradingJournalFiles";
import TradingJournalDateContent from "./components/TradingJournal/TradingJournalDateContent";

import FinancialData from "./components/FinancialData/FinancialData";
import FinancialDataIndex from "./components/FinancialData/FinancialDataIndex";
import FinancialDataContent from "./components/FinancialData/FinancialDataContent";

// import Profile from "./components/Profile/Profile";

import Settings from "./components/Settings/Settings";
import AccountSettings from "./components/Settings/AccountSettings/AccountSettings";
import ProfileSettings from "./components/Settings/ProfileSettings/ProfileSettings";
import ThemesSettings from "./components/Settings/ThemeSettings/ThemesSettings";
import CommunicationSettings from "./components/Settings/CommunicationSettings/CommunicationSettings";

import SignIn from "./components/Auth/SignIn/SignIn";
import SignUp from "./components/Auth/SignUp/SignUp";
import SignUpConfirmation from "./components/Auth/SignUp/SignUpConfirmation";

import SignOut from "./components/Auth/SignOut/SignOut";

import ForgotPassword from "./components/Auth/ForgotPassword/ForgotPassword";

//-- npm Package Functions --//
import { Routes, Route } from "react-router-dom";

//-- npm Package Components --//

//-- localStorage --//


export default function App() {

  return (    
        <Routes>
          {/* If not authenticated, show landing page */}
          <Route index element={<LandingPage />} />

          {/* If authenticated, show journal index page */}
          <Route path="main" element={<Layout />}></Route>

          {/*  */}

          <Route path="callback" element={<AWS_SDK_V3_CUP_TOKENS />} />

          <Route path="journal" element={<TradingJournal />}>
            <Route index element={<TradingJournalDashboard />} />
            <Route path="files" element={<TradingJournalFiles />} />
            <Route path=":date" element={<TradingJournalDateContent />} />
          </Route>

          <Route path="data" element={<FinancialData />}>
            <Route index element={<FinancialDataIndex />} />
            <Route path=":dataEntity" element={<FinancialDataContent />} />
          </Route>

          <Route path="settings" element={<Settings />}>
            <Route index element={<AccountSettings />} />
            <Route path="account" element={<AccountSettings />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="themes" element={<ThemesSettings />} />
            <Route path="communication" element={<CommunicationSettings />} />
          </Route>

          <Route path="signin" element={<SignIn />}>
            <Route path=":email/:password" element={<SignIn />} />
          </Route>
          <Route path="signup" element={<SignUp />} />
          <Route path="confirm" element={<SignUpConfirmation />}>
            <Route path=":destination" element={<SignUpConfirmation />} />
          </Route>
          <Route path="forgotpassword" element={<ForgotPassword />} />

          <Route path="signout" element={<SignOut />} />
        </Routes>
  );
}
