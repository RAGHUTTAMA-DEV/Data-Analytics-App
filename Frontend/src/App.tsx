import { Toaster } from "./components/ui/toaster";
import {Toaster as Sonner} from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import IndexPage from "./pages/index";
import AnalyticsForm from "./pages/AnalyticsPage";
import SignUp from "./components/Auth/SignUp";
import SignIn from "./components/Auth/SignIn";
import DatasetCard from "./components/DashBoard/DashBoardCard";

function App() {
  

  return (
    <TooltipProvider>
      {/* Use the index page component */}
      
      <Toaster />
      <Sonner />
      <SignIn/>

      

    </TooltipProvider>)
}

export default App;
