import { Toaster } from "./components/ui/toaster";
import {Toaster as Sonner} from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import IndexPage from "./pages/index";
function App() {
  

  return (
    <TooltipProvider>
    <IndexPage /> {/* Use the index page component */}
    <Toaster />
    <Sonner />
  </TooltipProvider>)
}

export default App;
