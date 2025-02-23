import React from "react";

type ButtonColor = "primary" | "secondary" | "info" | "warning" | "danger";
type ButtonVariant = "outlined" | "filled";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  color?: ButtonColor;
  variant?: ButtonVariant;
  className?: string; 
}

const MyButton: React.FC<ButtonProps> = ({ label, onClick, color="primary", variant="filled", className }) => {
  const buttonClass = `${getButtonClass(color, variant)}`;

  return (
    <button className={`btn ${buttonClass} ${className}`} onClick={onClick}>
      {label}
    </button>
  );
};

const getButtonClass = (color: ButtonColor, variant: ButtonVariant) => {
    let className = ''
    if (color === "secondary") {
        className =  "secondary";
        
    }
    else if(color === "warning") {
        className =  "warning";
        
    } 
    else if(color === "danger") {
        className =  "danger";
    }  
    else  {
        className = "primary";
        
    }
    if (variant === "outlined") {
        className +=  ` btn-outlined btn-outlined-${color}`;  
    }
    else {
        className +=  ` btn-filled btn-filled-${color}`;
    }
    return className
    
};

export default MyButton;
