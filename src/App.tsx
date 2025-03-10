
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { UserAuthProvider } from "./context/UserAuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { CustomThemeProvider } from "./context/CustomThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { useEffect } from "react";
import { initializeQuizData } from "./data/quizModels";
import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";
import UserDashboard from "./pages/UserDashboard";
import QuizPage from "./pages/QuizPage";
import QuizList from "./pages/QuizList";
import DatabaseNotice from "./components/DatabaseNotice";
import { HeartFooter } from "./components/HeartFooter";
import UserQuizCreator from "./pages/UserQuizCreator";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize quiz data
    initializeQuizData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CustomThemeProvider>
          <TooltipProvider>
            <AdminAuthProvider>
              <UserAuthProvider>
                <LanguageProvider>
                  <Toaster />
                  <Sonner />
                  <DatabaseNotice />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/admin-login" element={<AdminLogin />} />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="/login" element={<UserLogin />} />
                      <Route path="/register" element={<UserRegister />} />
                      <Route path="/dashboard" element={<UserDashboard />} />
                      <Route path="/quizzes" element={<QuizList />} />
                      <Route path="/quiz/:id" element={<QuizPage />} />
                      <Route path="/create-quiz" element={<UserQuizCreator />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <HeartFooter />
                  </BrowserRouter>
                </LanguageProvider>
              </UserAuthProvider>
            </AdminAuthProvider>
          </TooltipProvider>
        </CustomThemeProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
