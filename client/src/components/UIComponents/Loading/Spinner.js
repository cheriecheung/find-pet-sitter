import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Spin } from 'antd';
import { themeColor } from '../../../style/theme'

const Spinner = styled(Spin)`
  margin-left: 15px;
  align-self: center;

  & > span {
    margin: 5px 0 5px 5px;
    width: unset;
    height: unset;
    font-size: 15px;
  }

  & > span > i {
    background-color: ${({ colored }) => colored ? themeColor.peach : '#fff'};
  }
`

export default Spinner;

Spinner.propTypes = {
  colored: PropTypes.string,
};

Spinner.defaultProps = {
  colored: undefined,
};