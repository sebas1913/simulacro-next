import React from "react";
import styled from "styled-components";

interface ButtonProps {
	type: 'button' | 'submit' | 'reset';
	onClick?: () => void;
	children: React.ReactNode;
	className?: string;
	disabled?: boolean;
	title?: string;
}

const StyledButton = styled.button`
	border: none;
	border-radius: 0.2rem;
	background: none;
	font-size: 1rem;
	cursor: pointer;
    font-family: "Raleway", system-ui;
	font-weight: 600;

	&:active {
        transform: scale(0.95);
    }
`;

const Button: React.FC<ButtonProps> = ({ type, onClick, children, className, disabled, title }) => {
	return (
		<StyledButton type={type} onClick={onClick} className={className} disabled={disabled} title={title}>
			{children}
		</StyledButton>
	);
}

export default Button;