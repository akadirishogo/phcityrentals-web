import { createBrowserRouter, Outlet } from 'react-router-dom';
import { HomePage } from '../features/home/HomePage';
import { SearchPage } from '../features/search/SearchPage';
import { PropertyDetailsPage } from '../features/property/PropertyDetailsPage';
import { SavedPage } from '../features/saved/SavedPage';
import { Header } from '../components/Header';


function Layout() {
  return (
    <>
      <Header />
      <Outlet/>
    </>
  )
}


export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/', element: <HomePage />,
      },
      {
        path: '/search',
        element: <SearchPage />,
      },
      {
        path: '/property/:id',
        element: < PropertyDetailsPage />,
      },
      {
        path: '/saved',
        element: <SavedPage />,
      },
    ]
    
  },
]);
