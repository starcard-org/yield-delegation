import React from 'react';
import styled from 'styled-components';
import {Grid, Row, Col} from 'react-flexbox-grid';

const d = require('./faq-en.json');

const FAQ = styled.div`
  background: #fff;
`;
const Section = styled.div`
  text-align: left;
`;
const SectionTitle = styled.div`
  color: rgb(255, 95, 38);
  font-size: 1.75rem;
  margin-bottom: 1rem;
  margin-top: 2rem;
  font-weight: bold;
`;
const SectionDescription = styled.div`
  color: #4d4d4d;
  font-size: 1rem;
  margin-bottom: 2rem;
`;
const QuestionTitle = styled.div`
  color: #000000;
  font-size: 1.25rem;
  font-weight: bold;
`;
const QuestionAnswer = styled.div`
  color: #4d4d4d;
  font-size: 1rem;
  margin-bottom: 2rem;
`;

export const Faq = ({children, className}) => {
  const sections = d.sections.map(section => {
    return (
      <Section>
        <SectionTitle>{section.title}</SectionTitle>
        {section.description !== '' && (
          <SectionDescription>{section.description}</SectionDescription>
        )}
        <div>
          {section.questions.map(qa => {
            return (
              <div>
                <QuestionTitle>{qa.q}</QuestionTitle>
                <QuestionAnswer>{qa.a}</QuestionAnswer>
              </div>
            );
          })}
        </div>
      </Section>
    );
  });

  return (
    <FAQ>
      <Grid fluid>
        <Col xs={12}>
          <Row center={'xs'}>{sections}</Row>
        </Col>
      </Grid>
    </FAQ>
  );
};
