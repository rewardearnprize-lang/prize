// src/pages/Return.tsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Return = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // get query param (e.g., ?prize=car)
  const query = new URLSearchParams(location.search);
  const prize = query.get("prize");

  useEffect(() => {
    if (prize) {
      // ✅ هنا انتِ تعملي لوجيك إنقاص العدد
      // ممكن dispatch action للـ redux تقلل من الكارد الصح
      console.log("User returned for prize:", prize);

      // أو تخلي صفحة الـ Index تظهر مودال Congrats
      // بالـ navigate وترسلي معها state
      navigate("/", { state: { prize, showCongrats: true } });
    }
  }, [prize, navigate]);

  return null; // مش هيعرض حاجة، بس هيعمل redirect
};

export default Return;
