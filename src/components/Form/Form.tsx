import { ReactNode, FormEvent } from 'react';
import styled from 'styled-components';


interface FormProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    text-align: center;
`

const Form: React.FC<FormProps> = ({ onSubmit, children }) => {
  return (
    <StyledForm onSubmit={onSubmit}>
      {children}
    </StyledForm>
  );
};

export default Form;
