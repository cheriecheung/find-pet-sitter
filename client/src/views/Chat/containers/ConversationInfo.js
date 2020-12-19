import React from 'react';
import { Image, ImageContainer, LinkButton } from '../../../components/UIComponents'
import defaultProfilePic from '../../../assets/images/default_profile_pic.jpg'

const { REACT_APP_API_DOMAIN } = process.env;

function ConversationInfo({ info }) {
  const { recipient } = info || {}
  const {
    firstName,
    lastName,
    lastSeen,
    profilePicture,
    shortId,
    hasSitterProfile,
    hasOwnerProfile
  } = recipient || {}

  const pictureUrl = profilePicture ?
    `${REACT_APP_API_DOMAIN}/image/${profilePicture}` : defaultProfilePic

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20,
        borderBottom: '1px solid #E8E8E8',
      }}
    >
      <ImageContainer>
        <Image url={pictureUrl} />
      </ImageContainer>
      <h5 style={{ margin: '15px 0 3px 0' }}>
        {firstName} {lastName && lastName.charAt(0)}
      </h5>

      {/* <span style={{ color: '#929292' }}>Active 1h ago</span> */}

      {hasSitterProfile &&
        <LinkButton to={`/profile/catsitter/${shortId}`}>
          View cat sitter profile
        </LinkButton>
      }
      {hasOwnerProfile &&
        <LinkButton to={`/profile/catowner/${shortId}`}>
          View cat owner profile
        </LinkButton>
      }
    </div>
  );
}

export default ConversationInfo;