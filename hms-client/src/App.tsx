import { RouterProvider } from 'react-router-dom';
import { router } from './routes'; // Ensure this matches your filename (routes.tsx)
import './App.css'; 

function App() {
  return (
    // The RouterProvider handles all the navigation logic we defined
    <RouterProvider router={router} />
  );
}

export default App;