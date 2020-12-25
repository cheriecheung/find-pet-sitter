import React from 'react';
import { AuthenticatorModal } from '../../../../components/Google'
import { useDisable2FA } from '../viewModel';

function Disable2FA() {
  const {
    FormProvider,
    methods,
    onSubmit,
    appError
  } = useDisable2FA();

  const { handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ textAlign: 'left' }}>
        <AuthenticatorModal
          name="code"
          error={appError}
        />
      </form>
    </FormProvider>
  )
}

export default Disable2FA