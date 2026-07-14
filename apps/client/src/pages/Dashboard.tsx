import { useLocation, Navigate } from "react-router-dom";
import { DashboardSavedCareersWidget } from "../components/DashboardSavedCareersWidget";
import { useSavedCareers } from "../hooks/useSavedCareers";

function Dashboard() {
  const location = useLocation();
  const userName = location.state?.userName ?? "there";
  const { savedCareers, loading, isSaved, toggleSave } = useSavedCareers();

  if (!location.state?.userName) {
    return <Navigate to="/register" replace />;
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Welcome, {userName}!</h1>
      <p>Your account has been created successfully.</p>

      <div style={{ marginTop: "2rem", maxWidth: "480px" }}>
        <DashboardSavedCareersWidget
          savedCareers={savedCareers}
          loading={loading}
          onToggleSave={toggleSave}
          isSaved={isSaved}
        />
      </div>
    </div>
  );
}

export default Dashboard;
