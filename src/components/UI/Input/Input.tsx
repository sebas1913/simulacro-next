import React from "react";
import styled from "styled-components";

interface InputProps {
	id?: string;
	type: string;
	placeholder?: string;
	name: string;
	value: string | number;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	className?: string;
	disabled?: boolean; 
};

const StyledInput = styled.input`
    font-family: "Raleway", system-ui;
    font-size: 1rem;
    font-weight: 500;
    padding: 0.5rem;
    margin: 0.4rem auto;
    border-radius: 0.2rem;
    border: 0.1rem solid var(--light-gray);
    color: var(--primary-color);
    width: 85%;
    background: var(--tertiary-color);
`

const Input: React.FC<InputProps> = ({ id, type, placeholder, name, value, onChange, className, disabled }) => {
	return (
		<StyledInput
			id={id}
			type={type}
			placeholder={placeholder}
			name={name}
			value={value}
			onChange={onChange}
			className={className}
			disabled={disabled}
		/>
	);
};

export default Input;
