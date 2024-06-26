import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import RoomPage from "./pages/room/Room";
import ProjectsPage from "./pages/projects/Projects";
import LoginPage from "./pages/welcome/Login";
import RegisterPage from "./pages/welcome/Register";
import { ROUTES } from "./utils/constants/router";

import { Provider } from 'react-redux'
import store from './utils/redux/store'
import ProfilePage from "./pages/profile/ProfilePage";

const App = () => {

  const isAuth = !!localStorage.getItem('token');

  const router = createBrowserRouter([
    {
      path:  ROUTES.ROOT,
      element: <Layout />,
      children: [
        {
          path: ROUTES.ROOT,
          element: isAuth? <ProjectsPage /> : <LoginPage />,
        },
        {
          path: ROUTES.REGISTRATION,
          element:  <RegisterPage />,
        },
        {
          path: ROUTES.LOGIN,
          element: <LoginPage />,
        },
        {
          path: ROUTES.PROJECTS,
          element: <ProjectsPage />,
        },
        {
          path: ROUTES.ROOM,
          element: <RoomPage />,
        },
        {
          path: ROUTES.PROFILE,
          element: <ProfilePage />,
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
      <Provider store={store}>
        <RouterProvider router={router} />  
      </Provider>
    </QueryClientProvider>
  )
};


export default App;
