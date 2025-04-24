import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const typing = keyframes`
  from { width: 0 }
  to { width: 100% }
`;

const blinkCaret = keyframes`
  from, to { border-color: transparent }
  50% { border-color: #000 }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #fff;
`;

const Logo = styled.div`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: #000;
  animation: ${fadeIn} 0.8s ease-out;
  letter-spacing: -1px;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
`;

const TypingText = styled.div`
  overflow: hidden;
  white-space: nowrap;
  letter-spacing: 0.05em;
  animation: 
    ${typing} 2.2s steps(40, end),
    ${blinkCaret} 0.75s step-end infinite;
  border-right: 0.15em solid #000;
  font-size: 1.2rem;
  color: #333;
  font-weight: 500;
  text-align: center;
  padding-right: 0.2rem;
  margin-bottom: 1.5rem;
  width: fit-content;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 3px;
  background: #eee;
  border-radius: 2px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${props => props.$progress}%;
    background: #000;
    border-radius: 2px;
    transition: width 0.15s ease-out;
  }
`;

const LoadingAnimation = ({ estimatedTime }) => {
  const [currentText, setCurrentText] = useState('');
  const [progress, setProgress] = useState(0);
  const fullText = "Loading your E-LERN experience...";

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setCurrentText(fullText.substring(0, i + 1));
        setProgress((i / fullText.length) * 100);
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, estimatedTime ? estimatedTime / fullText.length : 70);

    return () => clearInterval(typingInterval);
  }, [estimatedTime]);

  return (
    <LoadingContainer>
      <Logo>E-LERN</Logo>
      <TextContainer>
        <TypingText>{currentText}</TypingText>
        <ProgressBar $progress={progress} />
      </TextContainer>
    </LoadingContainer>
  );
};

export default LoadingAnimation;