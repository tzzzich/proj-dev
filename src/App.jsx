import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import ProjectPage from "./pages/project/Project";
import LoginPage from "./pages/welcome/Login";
import RegisterPage from "./pages/welcome/Register";
import { ROUTES } from "./utils/constants/router";


const App = () => {

  const router = createBrowserRouter([
    {
      path:  ROUTES.ROOT,
      element: <Layout />,
      children: [
        {
          path: ROUTES.ROOT,
          element: <LoginPage />,
        },
        {
          path: ROUTES.REGISTRATION,
          element: <RegisterPage />,
        },
        {
          path: ROUTES.LOGIN,
          element: <LoginPage />,
        },
        {
          path: ROUTES.PROJECTS,
          element: <ProjectPage />,
        },
      ],
    },
    
  ]);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false
      }
    }
  });

  return(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
};


export default App;
