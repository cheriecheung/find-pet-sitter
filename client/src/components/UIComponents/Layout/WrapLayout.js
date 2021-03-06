import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const defaultStyle = css`
  display: flex;
  justify-content: space-between;
`

const defaultWrapLayout = ({ variant }) => {
  if (!variant) return css`
    flex-direction: column;

    @media (min-width: 770px) {
      flex-direction: row;
    }
  `;

  return css``;
};

const profile = ({ variant }) => {
  if (variant === 'profile') return css`
  flex-direction: row;
  padding: 60px 60px 30px 60px;
  text-align: left;

  @media (max-width: 900px) {
    flex-direction: column-reverse;
    padding: 40px 60px;
  }

  @media (max-width: 750px) {
    padding: 40px;
  }

  @media (max-width: 650px) {
    padding: 40px 30px;
  }

  @media (max-width: 550px) {
    padding: 40px 20px;
  }

  @media (max-width: 550px) {
    padding: 40px 15px;
  }
`;

  return css``;
}

const catInfo = ({ variant }) => {
  if (variant === 'catInfo') return css`
    @media (max-width: 600px) {
      flex-direction: column;
    }
  `

  return css``;
}

const settings = ({ variant }) => {
  if (variant === 'settings') return css`
    flex-wrap: wrap;
    text-align: justify;

    & > p, 
    & > div {
      flex: 0 50%;
    }

    @media (max-width: 700px) {
      flex-direction: column;
      align-items: center;

      & > button {
        width: 50%;
      }
    }

    @media (max-width: 450px) {
      & > button {
        width: 70%;
      }
    }
  `

  return css``;
}

const contact = ({ variant }) => {
  if (variant === 'contact') return css`
    flex-direction: column;

    @media (min-width: 800px) {
      flex-direction: row;
    }
  `;

  return css``;
};

const WrapLayout = styled.div`
  ${defaultStyle}
  ${defaultWrapLayout}

  ${profile}
  ${catInfo}
  ${settings}
  ${contact}
`

export default WrapLayout;

WrapLayout.propTypes = {
  variant: PropTypes.node,
};

WrapLayout.defaultProps = {
  variant: undefined,
};