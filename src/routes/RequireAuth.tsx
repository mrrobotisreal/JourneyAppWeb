import { Navigate, Outlet, useParams } from "react-router";
import { useAuth } from "@/context/AuthContext";
import FullPageSpinner from "@/components/full-page-spinner";

const RequireAuth: React.FC = () => {
  const { user, loading } = useAuth();
  const { userID } = useParams();

  if (loading) return <FullPageSpinner />;

  if (!user) return <Navigate to="/signin" replace />;

  if (user.uid !== userID)
    return <Navigate to={`/app/${user.uid}/home`} replace />;

  return <Outlet />;
};

export default RequireAuth;
