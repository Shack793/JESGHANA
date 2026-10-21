import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DefaultProviders } from "./components/providers/default.tsx";
import PublicLayout from "./components/public-layout.tsx";
import AuthCallback from "./pages/auth/Callback.tsx";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import AboutPage from "./pages/about/page.tsx";
import ServicesPage from "./pages/services/page.tsx";
import ContactPage from "./pages/contact/page.tsx";
import BlogPage from "./pages/blog/page.tsx";
import BlogPostPage from "./pages/blog/post/page.tsx";
import PostsAdminPage from "./pages/admin/posts/page.tsx";
import AdminLayout from "./pages/admin/layout.tsx";
import AdminDashboard from "./pages/admin/page.tsx";
import BannersPage from "./pages/admin/banners/page.tsx";
import ContentPage from "./pages/admin/content/page.tsx";
import InquiriesPage from "./pages/admin/inquiries/page.tsx";
import SettingsPage from "./pages/admin/settings/page.tsx";
import UsersPage from "./pages/admin/users/page.tsx";

export default function App() {
  return (
    <DefaultProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="banners" element={<BannersPage />} />
            <Route path="content" element={<ContentPage />} />
            <Route path="posts" element={<PostsAdminPage />} />
            <Route path="inquiries" element={<InquiriesPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="users" element={<UsersPage />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </DefaultProviders>
  );
}
