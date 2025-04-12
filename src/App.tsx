
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MapPage from "./pages/MapPage";
import GalleryPage from "./pages/GalleryPage";
import AudioPage from "./pages/AudioPage";
import QuizPage from "./pages/QuizPage";
import ContributePage from "./pages/ContributePage";
import NotFound from "./pages/NotFound";
import CulturesPage from "./pages/cultures";
import NewCulturePage from "./pages/cultures/new";
import CultureDetailPage from "./pages/cultures/[id]";
import ArticlesPage from "./pages/articles";
import NewArticlePage from "./pages/articles/new";
import ArticleDetailPage from "./pages/articles/[id]";
import ProfilePage from "./pages/profile";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/audio" element={<AudioPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/contribute" element={<ContributePage />} />
          <Route path="/cultures" element={<CulturesPage />} />
          <Route path="/cultures/new" element={<NewCulturePage />} />
          <Route path="/cultures/:id" element={<CultureDetailPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/new" element={<NewArticlePage />} />
          <Route path="/articles/:id" element={<ArticleDetailPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
