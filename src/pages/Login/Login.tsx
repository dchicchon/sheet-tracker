import { useLocation } from 'wouter';
import { getToken } from '../../utils/api';
import { pages } from '../../utils/pages';

export function Login() {
  const [_location, navigate] = useLocation();
  const initiateUserAuth = async () => {
    const token = await getToken(true);
    if (token) {
      navigate(pages.home);
    }
  };

  return (
    <div>
      <h2>Sheet Tracker</h2>
      <button onClick={initiateUserAuth}>Authenticate with Google</button>
    </div>
  );
}
