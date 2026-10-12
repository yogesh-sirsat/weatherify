import React, { FC, ReactNode } from "react";
import { XIcon, TickIcon, ExclamationTriangle } from "@/components/svgs/AlertSvgs";

export interface AlertProps {
  type: "success" | "error" | "warning" | string;
  message: string;
  relativeClasses?: string;
  children?: ReactNode;
}

const Alert: FC<AlertProps> = ({ type, message, relativeClasses = "", children }) => {
  const renderIcon = () => {
    switch (type) {
      case "success":
        return <TickIcon />;
      case "error":
        return <XIcon />;
      case "warning":
        return <ExclamationTriangle />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex flex-row gap-2 rounded-xl p-3 top-0 z-30 ${relativeClasses}`}
    >
      {renderIcon()}
      <span
        className="flex flex-col md:flex-row md:gap-2"
        dangerouslySetInnerHTML={{ __html: message }}
      />
      {children}
    </div>
  );
};

export default Alert;
