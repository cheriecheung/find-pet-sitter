import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  login_default_values,
  email_verification_default_values,
  password_reset_default_values,
  register_default_values,
} from './_formConfig/_defaultValues'
import {
  login_schema,
  send_email_schema,
  password_reset_schema,
  register_schema
} from './_formConfig/_validationSchema'
import { useDispatch, useSelector } from 'react-redux';
import {
  verifyEmail,
  login,
  googleLogin,
  phoneLogin,
} from '../../redux/authentication/actions';
import {
  registration,
  getActivationEmail,
  getPasswordResetEmail,
  resetPassword
} from '../../redux/app/actions';
import { clearError } from '../../redux/error/actions'

function useEmailVerification() {
  const { token } = useParams();
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const activate = useSelector((state) => state.authentication);

  const [emailSubmitted, setEmailSubmitted] = useState(false)

  const defaultValues = email_verification_default_values;
  const resolver = yupResolver(send_email_schema)
  const methods = useForm({ defaultValues, resolver });

  useEffect(() => {
    if (token) {
      dispatch(verifyEmail(token));
    }
  }, [dispatch, token]);

  function onSubmit(data) {
    const { email } = data;
    dispatch(getActivationEmail(email));
    setEmailSubmitted(true)
  }

  const unsuccessfulProps = {
    FormProvider,
    methods,
    onSubmit,
    emailSubmitted
  }

  return {
    t,
    activate,
    unsuccessfulProps
  }
}

function useLogin() {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { loginByPhone } = useSelector((state) => state.authentication);
  const { authenticationError } = useSelector((state) => state.error)

  const phoneLoginMethods = useForm();

  const localLoginMethods = useForm({
    defaultValues: login_default_values,
    resolver: yupResolver(login_schema)
  });

  useEffect(() => {
    dispatch(clearError('authenticationError'))
  }, [])

  function onLocalLogin(data) {
    const { email, password } = data;
    dispatch(login(email, password));
  };

  function onGoogleLogin() {
    dispatch(googleLogin());
  }

  function onPhoneLogin(data) {
    const { code } = data
    dispatch(phoneLogin(code));
  }

  const localLoginProps = {
    FormProvider,
    localLoginMethods,
    onLocalLogin,
  }

  const phoneLoginProps = {
    FormProvider,
    phoneLoginMethods,
    onPhoneLogin,
  }

  return {
    t,
    authenticationError,
    localLoginProps,
    phoneLoginProps,
    onGoogleLogin,
    loginByPhone,
  }
}

function useForgotPassword() {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [emailSubmitted, setEmailSubmitted] = useState(false)

  const defaultValues = email_verification_default_values;
  const resolver = yupResolver(send_email_schema)
  const methods = useForm({ defaultValues, resolver });

  function onSubmitEmail(data) {
    const { email } = data;
    dispatch(getPasswordResetEmail(email))
    setEmailSubmitted(true)
  }

  return {
    t,
    FormProvider,
    methods,
    emailSubmitted,
    onSubmitEmail,
  }
}

function useResetPassword() {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const defaultValues = password_reset_default_values;
  const resolver = yupResolver(password_reset_schema)
  const methods = useForm({ defaultValues, resolver });

  function onSubmitNewPassword(data) {
    const { newPassword } = data;
    dispatch(resetPassword(newPassword))
  }

  return {
    t,
    FormProvider,
    methods,
    onSubmitNewPassword
  }
}

function useRegister() {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  // const { } = useSelector((state) => state.authentication);

  const defaultValues = register_default_values;
  const resolver = yupResolver(register_schema)
  const methods = useForm({ defaultValues, resolver });

  function onRegister(data) {
    const { firstName, lastName, email, password } = data;
    dispatch(registration(firstName, lastName, email, password));
  };

  function onGoogleLogin() {
    dispatch(googleLogin());
  }

  const localRegisterProps = {
    FormProvider,
    methods,
    onRegister
  }

  return {
    t,
    onGoogleLogin,
    localRegisterProps,
  }
}

export { useEmailVerification, useLogin, useForgotPassword, useResetPassword, useRegister }