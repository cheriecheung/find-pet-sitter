import React, { useState, useEffect, useRef } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import styled from 'styled-components';
import { List } from 'antd';
import moment from 'moment';
import Review from './Review';
import { SectionContainer } from '../../components/FormComponents';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSitterProfile } from '../../_actions/accountActions';
import ThemeButton from '../../components/General/ThemeButton';
import DayPicker from 'react-day-picker';

const ContentContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  @media (max-width: 700px) {
    flex-direction: column-reverse;
  }
`;
const ImageContainer = styled.div`
  width: 100px;
  height: 100px;
  background: pink;
  overflow: hidden;
  border-radius: 10px;
`;

const defaultValues = {
  aboutSitter: '',
  //photos: [],
  experience: '',
  unavailableDates: [],
};

const allReviews = [];
for (let i = 0; i < 23; i++) {
  allReviews.push({ id: i, name: `User ${i}` });
}

function CatSitter() {
  const { id } = useParams();
  const reviewListRef = useRef(null);
  const dispatch = useDispatch();
  const { data: sitterData } = useSelector((state) => state.account);

  const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop);

  const [sitterInfo, setSitterInfo] = useState(defaultValues);

  useEffect(() => {
    if (id) {
      // fetch sitter profile by id
      dispatch(getSitterProfile(id));

      // show 'does not exist' message if no profile with such id
      console.log({ id });
    }
  }, [id]);

  useEffect(() => {
    // if(!sitterData) {
    //   setErrorMsg('Profile doesn\'t exist');
    // }
    if (sitterData) {
      const { aboutSitter, experience, unavailableDates } = sitterData;

      setSitterInfo({
        aboutSitter,
        experience,
        unavailableDates: unavailableDates.map((item) => new Date(item)),
      });
    }
  }, [sitterData]);

  return (
    <div style={{ padding: '30px 60px' }}>
      <div style={{ textAlign: 'left' }}>
        <ContentContainer>
          <div style={{ flexBasis: '60%', marginBottom: 100 }}>
            <ImageSlider />
            <h5 ref={reviewListRef} style={{ paddingTop: 15, marginBottom: 15 }}>
              Reviews(10)
            </h5>

            <div>
              <List
                itemLayout="vertical"
                size="large"
                pagination={{
                  onChange: () => scrollToRef(reviewListRef),
                  pageSize: 3,
                }}
                dataSource={allReviews}
                renderItem={({ name }) => <Review name={name} />}
              />
            </div>
            <About sitterInfo={sitterInfo} />
          </div>

          <SectionContainer
            style={{
              flexBasis: '35%',
              maxHeight: 400,
              position: 'sticky',
              top: 20,
            }}
          >
            <h4>Member's name</h4>
            <ImageContainer>
              <img
                src="https://images.pexels.com/photos/569170/pexels-photo-569170.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                alt="pic"
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </ImageContainer>
            <br />
            <ThemeButton>Send message</ThemeButton>
            <ThemeButton>Send request for sitting job</ThemeButton>
            <hr />
            <h5>Verified</h5>
          </SectionContainer>
        </ContentContainer>
      </div>
    </div>
  );
}

function ImageSlider() {
  return (
    <Carousel interval={null} className="m-0">
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://i.pinimg.com/originals/e0/3b/e0/e03be0d9ea0f716eb57f9dfe3e27c4c6.jpg"
          height="400"
          alt="First slide"
          style={{ objectFit: 'contain' }}
        />
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          height="400"
          src="https://cdn.sortra.com/wp-content/uploads/2016/11/pumpkin-the-cat000.jpg"
          alt="Third slide"
          style={{ objectFit: 'contain' }}
        />

        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          height="400"
          src="https://image.freepik.com/free-photo/cute-golden-british-shorthair-cat-floor_43518-12.jpg"
          alt="Third slide"
          style={{ objectFit: 'contain' }}
        />

        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

function About({ sitterInfo }) {
  console.log({ sitterInfo });
  return (
    <>
      <div>
        <h5>About</h5>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta commodi voluptatum
          recusandae sunt et minima enim aliquid incidunt ipsa maiores, cupiditate tenetur itaque
          eos quae eveniet ullam ipsam ad iste sed voluptatibus nulla hic temporibus? Corrupti ipsam
          adipisci quos accusamus!
        </p>
      </div>

      <div>
        <h5>Experience</h5>
        <p>display icons for types of experience</p>
      </div>

      <div>
        <h5>Availability</h5>
        <DayPicker
          disabledDays={{ before: new Date() }}
          selectedDays={sitterInfo.unavailableDates}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <div className="calendar-available-date-box" />
          <span>Available</span>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginLeft: 50,
          }}
        >
          <div className="calendar-unavailable-date-box" />
          <span>Unavailable</span>
        </div>
        {/* <Calendar
          disabledDate={(current) => {
            return moment().add(-1, 'days') >= current || moment().add(1, 'month') <= current;
          }}
          defaultValue={moment('20200815')}
          fullscreen={false}
          //validRange={[moment(new Date()).format('YYYYMMDD')]}
          // onPanelChange={onPanelChange}
        /> */}
      </div>

      <div>
        <h5>Location</h5>
        <p>Display google map</p>
      </div>
    </>
  );
}

export default CatSitter;
