import React from 'react';
import styled from 'styled-components';
import {Container} from '../components';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {Faq} from '../components/Faq/Faq';

const Forms = require('../assets/img/forms.png');

const PageContainer = styled.div`
  margin: auto;
  width: 100%;
`;

const FaqContainer = styled.div`
  background: #fff;
  position: relative;
`;

const StyledContainer = styled(Container)`
  padding: 2em 0;
  position: relative;
  z-index: 0;
  background: #fff;
  margin-top: 12rem;
`;

const ImageContainer = styled(Row)`
  position: relative;
`;

const Image = styled.img`
  z-index: 0;
  position: absolute;
  opacity: 0.35;
`;

const Content = styled.div`
  position: absolute;
  z-index: 1;
  text-align: left;
  width: 100%;
`;

const FAQTitle = styled.div`
  font-size: 3.75rem;
  font-weight: bold;
`;

const FAQDescription = styled.div`
  font-size: 1rem;
`;

export default () => {
  return (
    <>
      <PageContainer>
        <ImageContainer center={'xs'}>
          <Content>
            <Container size={'lg'}>
              <FAQTitle>FAQ</FAQTitle>
              <FAQDescription>
                Lorem ipsum dolor sit amet, consectetur adpiscing elit.
              </FAQDescription>
            </Container>
          </Content>
          <Image src={Forms} width={'100%'} alt={'Geometric Forms'} />
        </ImageContainer>
        <FaqContainer>
          <StyledContainer size={'lg'}>
            <Faq />
          </StyledContainer>
        </FaqContainer>
      </PageContainer>
    </>
  );
};
