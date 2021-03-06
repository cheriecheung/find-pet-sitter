import React from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import { Radio as AntRadio } from 'antd';
import { getErrorProperties } from '../../utility'
import ErrorDisplay from './ErrorDisplay';

export function RadioGroup({ name, children }) {
  const { control, errors } = useFormContext();
  const { hasError, message } = getErrorProperties(name, errors)

  return (
    <div style={{ marginBottom: 20 }}>
      <Controller
        name={name}
        control={control}
        render={({ onChange, value }) => (
          <AntRadio.Group
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="custom-radio-group"
          >
            {children}
          </AntRadio.Group>
        )}
      />
      <ErrorDisplay hidden={!hasError}>{message}</ErrorDisplay>
    </div>
  );
}

export function RadioButton({ value, children, style }) {
  return (
    <AntRadio.Button
      value={value}
      className="custom-radio-button"
      style={style}
    >
      {children}
    </AntRadio.Button>
  );
}

RadioGroup.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

RadioButton.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]).isRequired,
  children: PropTypes.node.isRequired,
  style: PropTypes.object
};

RadioButton.defaultProps = {
  style: {}
};