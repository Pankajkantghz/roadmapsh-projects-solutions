import React from "react";

const Button = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`text-xl
        px-4 py-1
        text-gray-700
        bg-transparent
        rounded-md
        cursor-pointer
        transition-all
        duration-300
        ease-in-out
        hover:text-gray-900
        hover:scale-105
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:hover:scale-100
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
