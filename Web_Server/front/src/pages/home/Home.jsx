import React from 'react';
import {
  Section,
  SectionsContainer,
  Paragraph,
  TextContainer,
  IconContainer,
  Icon,
} from './Home.styled';
import Section11BG from '../../assets/backgrounds/section1.jpg';
import Section22BG from '../../assets/backgrounds/section2.jpg';
import Statistics1 from '../../assets/backgrounds/statistics1.svg';
import Statistics2 from '../../assets/backgrounds/statistics2.svg';
import Statistics3 from '../../assets/backgrounds/statistics3.svg';
import GoSearchButton from './components/GoSearchButton';
import './Home.css';
import stack from '../../assets/stack';

function Home() {
  window.addEventListener('scroll', reveal);
  function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    for (let i = 0; i < reveals.length; i++) {
      const windowHeight = window.innerHeight;
      const elementTop = reveals[i].getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add('active');
      }
    }
    return reveals;
  }
  React.useEffect(() => {
    const reveals = reveal();
    reveals[0].classList.add('active');
  });
  return (
    <>
      <SectionsContainer>
        <Section bg={'#FF8C22'}>
          <TextContainer className='text reveal'>
            <h1>What we're all about?</h1>
            <Paragraph>
              Introducing our cutting-edge video indexing service designed to
              revolutionize your learning experience! <br /> With our advanced
              technology, you can easily search and access relevant video
              content in mere seconds, allowing you to focus on what truly
              matters - learning and expanding your knowledge.
            </Paragraph>
          </TextContainer>
          <img src={Section11BG} className='image-section' />
        </Section>
        <Seperator primary={'#FF8C22'} secondary={'#e67a40'} />
        <Section
          bg={'#F2F2F2'}
          style={{
            padding: '5%',
            transform: 'translateY(-10%)',
            zIndex: '-1',
            height: '425px',
          }}
        >
          <div
            className='reveal reveal1'
            style={{ minWidth: '500px', minHeight: '350px' }}
          >
            <Statistics />
          </div>
          <Paragraph className='text reveal black'>
            Our indexing system is lightning-fast, providing you with fast
            <br />
            results and an intuitive user interface that is both user-friendly
            and visually stunning.
            <br /> Whether you're a student, teacher, or lifelong learner <br />
            our video indexing service is the ultimate tool for unlocking <br />
            the full potential of online video content.
          </Paragraph>
        </Section>
        <div style={{ transform: 'rotate(180deg)' }}>
          <Seperator primary={'#84CEC5'} secondary={'#7fbcc1'} />
        </div>
        <Section bg={'#84CEC5'}>
          <TextContainer className='text reveal'>
            <h1>Our Search Engine</h1>
            <Paragraph>
              Discover a world of limitless knowledge with our search engine.
              <br />
              Click the button below to start exploring.
              <br /> It's easy and simple, you'll be prompted with other videos
              that
              <br /> you might like or find interesting according to your
              current subject
            </Paragraph>
            <div className='reveal reveal2'>
              <GoSearchButton>Start Searching</GoSearchButton>
            </div>
          </TextContainer>

          <img className='image-section' src={Section22BG} />
        </Section>
        <Seperator primary={'#84CEC5'} secondary={'#7fbcc1'} />
        <Section
          bg={'#F2F2F2'}
          style={{
            padding: '5%',
            transform: 'translateY(-10%)',
            flexDirection: 'column',
            height: '350px',
            zIndex: '-1',
          }}
        >
          <Paragraph className='text reveal black'>
            This project is part of our data science specialization journey.
            <br />
            It's a significant milestone for our team - where we have not only
            gained
            <br /> invaluable knowledge but also experienced personal and
            professional growth.
            <br /> Under the guidance and expertise of Dr. Shay Horovitz, we
            have navigated
            <br /> complex data challenges, implemented algorithms, and explored
            innovative
            <br /> techniques in the realm of data science.
          </Paragraph>
        </Section>
        <IconContainer className='reveal reveal3'>
          {stack.map((ticket) => (
            <Icon key={ticket.text} title={ticket.text}>
              <img key={ticket.text} src={ticket.icon} height={50} width={50} />
            </Icon>
          ))}
        </IconContainer>
      </SectionsContainer>
    </>
  );
}

function Seperator({ primary, secondary }) {
  return (
    <div style={{ zIndex: '1' }}>
      <svg
        style={{ transform: 'translateY(-1%)' }}
        className='separator'
        width='100%'
        height='120'
        viewBox='0.1 0.1 180 40'
        preserveAspectRatio='none'
      >
        <g transform='translate(-18.298844,-77.973964)'>
          <path
            style={{ fill: secondary }}
            d='M 31.615583,86.351641 H 192.16499 v 26.901969 c 0,0 -32.03411,-14.237983 -59.62682,-12.72484 -22.34188,1.2252 -54.779359,9.72634 -54.779359,9.72634 0,0 -22.029534,3.62882 -34.471238,-1.88988 -12.441702,-5.51871 -11.67199,-22.013589 -11.67199,-22.013589 z'
          />
          <path
            style={{ fill: primary }}
            d='M 18.441597,78.106256 H 198.58126 v 39.288614 c 0,0 -43.10672,-27.825245 -73.47599,-19.687823 -30.369264,8.137423 -46.832208,12.548653 -46.832208,12.548653 0,0 -32.775418,8.05972 -46.735258,0 C 17.577964,102.19598 18.441597,78.106256 18.441597,78.106256 Z'
          />
        </g>
      </svg>
    </div>
  );
}

function Statistics() {
  return (
    <div style={{ position: 'relative', width: '50%', margin: '2rem' }}>
      <img src={Statistics1} height={150} style={{ position: 'absolute' }} />
      <img
        src={Statistics2}
        height={150}
        style={{ position: 'absolute', left: '180px' }}
      />
      <img
        src={Statistics3}
        height={150}
        style={{ position: 'absolute', left: '90px', top: '150px' }}
      />
    </div>
  );
}
export default Home;
