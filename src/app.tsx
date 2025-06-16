import { Route, Switch, useLocation } from 'wouter';
import { useEffect } from 'preact/hooks';
import { getToken } from './utils/api';
import { useQuery } from '@tanstack/react-query';
import LoadCircle from './components/LoadCircle';
import Home from './pages/Home';
import Login from './pages/Login';
import AddSheets from './pages/AddSheets';
import ColumnPage from './pages/ColumnPage';
import { pages } from './utils/pages';

export function App() {
  const [location, navigate] = useLocation();

  useEffect(() => {
    console.log(location);
  }, [location]);

  const discoverAuth = async () => {
    console.log('discoverAuth');
    const foundToken = await getToken(false);
    if (foundToken) {
      navigate('/');
    } else {
      navigate('/login');
    }
    return foundToken;
  };

  const discoverAuthQuery = useQuery({
    queryKey: ['discoverAuth'],
    queryFn: discoverAuth,
    retry: 3,
  });
  // use useQuery here?

  if (discoverAuthQuery.isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <LoadCircle />
      </div>
    );
  }

  if (discoverAuthQuery.isError) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <h1>
          Unable to retrieve authentication information. Please ensure internet connection
        </h1>
      </div>
    );
  }

  if (discoverAuthQuery.data) {
    return (
      <Switch>
        <Route path="/" component={Home} />
        <Route path={pages.importSheets} component={AddSheets} />
        <Route path={pages.inspectColumn} component={ColumnPage} />
        <Route path={pages.login} component={Login} />
      </Switch>
    );
  }
}
