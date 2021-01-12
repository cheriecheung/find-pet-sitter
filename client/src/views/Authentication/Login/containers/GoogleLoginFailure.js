import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { LinkButton, ResponseDisplayTemplate, VerticalCard } from '../../../../components/UIComponents';
import { themeColor, themeLayout } from '../../../../style/theme';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: -20px auto 0 auto;
  width: 90%;
  height: ${themeLayout.contentHeight};
`

function GoogleLoginFailure() {
  const history = useHistory();

  useEffect(() => {
    // setTimeout(() => {
    //   history.push('/login');
    // }, 5000)
  }, [])

  return (
    <Container>
      <VerticalCard>
        <ResponseDisplayTemplate
          icon={<i className="far fa-grin-beam-sweat fa-5x" style={{ color: themeColor.lightGrey }} />}
          title={'Google Login failed'}
          text={
            <>
              <span>An error has occured</span>
              <h5 style={{ margin: '15px 0' }}>OR</h5>
              <span>The email you used was locally registered on Watch Cats.</span>
              <br />
              <span>(i.e. please use the local login)</span>
              <br />
              <br />
              <span>You will be redirected to the login page in 5 seconds...</span>
            </>
          }
        />
      </VerticalCard>
    </Container>
  )
}

export default GoogleLoginFailure;