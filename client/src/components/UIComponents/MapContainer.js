import styled, { css } from 'styled-components';

const defaultMapContainer = props => {
  if (!props.variant) return css`
    height: 40vh;
  `;

  return css``;
};

const findCatSitter = props => {
  if (props.variant !== 'findCatSitter') return css``

  return `
    height: 80vh;
    top: 20px;
    bottom: 20px;
    position: sticky;
  `
}

const MapContainer = styled.div`
  ${defaultMapContainer}
  ${findCatSitter}
`

export default MapContainer