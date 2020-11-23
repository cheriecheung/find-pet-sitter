import styled from 'styled-components';

const LoadingMask = styled.div`
  position: absolute; 
  z-index: 5;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.7); 
  visibility: ${props => props.loading ? 'visible' : 'hidden'};
`

export default LoadingMask