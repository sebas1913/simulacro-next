import React, { ReactNode } from 'react';
import { IoClose } from "react-icons/io5";
import Button from '../UI/Button/Button';
import styled from 'styled-components';

interface ModalProps {
	isVisible: boolean;
	onClose: () => void;
	children: ReactNode;
};

const StyledModalContainer = styled.nav`
	position: fixed;
    z-index: 2;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: var(--modal-color);
    display: flex;
    justify-content: center;
    align-items: center;
`

const StyledModalContent = styled.div`
    background-color: var(--tertiary-color);
    margin: 10% auto;
    padding: 1rem 1rem;
    width: 100%;
    max-width: 32rem;
    border-radius: 0.5rem;
`

const StyledModalClose = styled.div`
    text-align: right;
`

const Modal: React.FC<ModalProps> = ({ isVisible, onClose, children }) => {
	if (!isVisible) return null;

	return (
		<StyledModalContainer>
			<StyledModalContent>
				<StyledModalClose>
					<Button type='submit' className='' onClick={onClose}>
						<IoClose size={30}/>
					</Button>
				</StyledModalClose>
				{children}
			</StyledModalContent>
		</StyledModalContainer>
	);
};

export default Modal;
