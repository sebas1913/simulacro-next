"use client";
import styled from "styled-components";

const StyledContainer = styled.div`
  width: 55%;
  height: 80vh;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledContainerLeft = styled.div`
  width: 50%;
`;

const StyledContainerRight = styled.div`
  width: 20%;
  display: flex;
  justify-content: center;
`;

const StyledTitle = styled.h1`
  font-size: 5rem;
  font-weight: 800;
`;

const StyledImage = styled.img`
  width: 12rem;
`

const StyledDescription = styled.h2``;

export default function Home() {
  return (
    <StyledContainer>
      <StyledContainerLeft>
        <StyledTitle>POSTS</StyledTitle>
        <StyledDescription>Inicia sesión o regístrate para visualizar las publicaciones</StyledDescription>
      </StyledContainerLeft>
      <StyledContainerRight>
        <StyledImage src="https://cdn-icons-png.flaticon.com/512/2297/2297887.png"></StyledImage>
      </StyledContainerRight>
    </StyledContainer>
  );
}
