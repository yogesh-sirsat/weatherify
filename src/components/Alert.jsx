import { useEffect, useState } from "react";
import { XIcon, TickIcon, ExclamationTriangle } from "@/components/svgs/AlertSvgs";

function Alert({ type, message, relativeClasses, children }) {
  const [svg, setSvg] = useState(null);

  useEffect(() => {
    switch (type) {
      case "success":
        setSvg(TickIcon);
        break;
      case "error":
        setSvg(XIcon);
        break;
      case "warning":
        setSvg(ExclamationTriangle);
        break;
      default:
        setSvg(null);
        break;
    }
  }, [type])

  return (
    <div
      className={`flex flex-row gap-2 rounded-xl p-3 top-0 z-30 ${relativeClasses}`}
    >
      {svg}
      <span className="flex flex-col md:flex-row md:gap-2" dangerouslySetInnerHTML={{ __html: message }}></span>
      {children}
    </div>
  );
};

export default Alert;
