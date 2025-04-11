
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SponsorForm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the subscription plans page
    navigate("/subscription");
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p>Redirecting to sponsorship plans...</p>
      </div>
    </div>
  );
};

export default SponsorForm;
