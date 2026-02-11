import { Navigate, Route, Routes } from 'react-router-dom'
import AuthLayout from '@/layouts/AuthLayout'
import { useAuthContext } from '@/context/useAuthContext'
import { lazy } from 'react';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import LoginProtectRoute from './LoginProtectRoute';
import AdminLayout from '@/layouts/AdminLayout'
import SignIn from '@/app/(other)/auth/sign-in/page'
import 'react-toastify/dist/ReactToastify.css'

const ProjectDetails = lazy(() => import('@/app/(admin)/projects/ProjectDetails'))
const ProjectForm = lazy(() => import('@/app/(admin)/projects/ProjectForm'))
const ProjectsList = lazy(() => import('@/app/(admin)/projects/ProjectsList'))
const Analytics = lazy(() => import('@/app/(admin)/dashboard/analytics/page'))
const Dashboard = lazy(() => import('@/app/(admin)/dashboard/page'))
const UserManagement = lazy(() => import('@/app/(admin)/ecommerce/sellers/page'))
const UserCreation = lazy(() => import('@/app/(admin)/forms/basic/page'))
const Blogs = lazy(() => import('@/app/(admin)/apps/contacts/page'))
const EcommerceProductDetails = lazy(() => import('@/app/(admin)/ecommerce/products/[productId]/page'))
const EcommerceProductCreate = lazy(() => import('@/app/(admin)/ecommerce/products/create/page'))
const Settings = lazy(() => import('@/app/(admin)/settings/Page'))

// const Pricing = lazy(() => import('@/app/(admin)/pages/pricing/page'))
// const Cards = lazy(() => import('@/app/(admin)/ui/cards/page'))
// const Invoices = lazy(() => import('@/app/(admin)/invoices/page'))
// import { appRoutes, authRoutes } from '@/routes/index'
// import HeroSectionManagement from '@/app/(admin)/HeroSection/HeroSectionManagement';
// import FAQManagement from '@/app/(admin)/faq/page'
// import EnquiryManagement from '@/app/(admin)/enquiry/EnquiryManagement'
// import SeoLayout from '@/app/(admin)/seo/SeoLayout'

const AppRouter = props => {
  const {
    isAuthenticated
  } = useAuthContext();
  return (<>

    <AuthProvider>

      <Routes>
        <Route path="*" element={<Navigate to="/" replace />} />

        <Route path="/login" element={<LoginProtectRoute><AuthLayout><SignIn /></AuthLayout></LoginProtectRoute>} />
        <Route path="/" element={<ProtectedRoute>
          <AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />

        <Route
          path="/user-management"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <AdminLayout>
                <UserManagement />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-management/add"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>

              <AdminLayout>

                <UserCreation />
              </AdminLayout>
            </ProtectedRoute>
          }
        />      
        <Route
          path="/blogs"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Blogs />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/blogs/details/:blogId"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <EcommerceProductDetails />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/blogs/add-blog"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <EcommerceProductCreate />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/blogs/edit-blog/:blogId"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <EcommerceProductCreate />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/settings"
          element={
            <AdminLayout>
              <Settings />
            </AdminLayout>
          }/>
        <Route
          path="/analytics"
          element={
            <AdminLayout>
              <Analytics />
            </AdminLayout>
          }/>
        <Route
          path="/projects"
          element={
            <AdminLayout>
              <ProjectsList />
            </AdminLayout>
          }/>
        <Route
          path="/projects/add"
          element={
            <AdminLayout>
              <ProjectForm />
            </AdminLayout>
          }/>
          <Route
          path="/projects/edit/:projectId"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ProjectForm />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
          <Route
            path="/projects/:projectId"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ProjectDetails />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
        {/* <Route
          path="/newsletter/subscribers"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Invoices />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/seo"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <SeoLayout />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/gallery"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Cards />
              </AdminLayout>
            </ProtectedRoute>
          }
        /> */}
         {/* <Route
          path="/packages"
          element={
            <AdminLayout>
              <Pricing />
            </AdminLayout>
          }
        />
        <Route
          path="/herosection"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <AdminLayout>
                <HeroSectionManagement />
              </AdminLayout>
            </ProtectedRoute>
          }
        /> */}
         {/* <Route
          path="/faqs"
          element={
            <ProtectedRoute>

              <AdminLayout>

                <FAQManagement />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/enquiry"
          element={
            <ProtectedRoute>
              <AdminLayout>

                <EnquiryManagement />
              </AdminLayout>
            </ProtectedRoute>
          }
        /> */}
       
      </Routes>
    </AuthProvider>

  </>)


};
export default AppRouter;
