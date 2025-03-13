import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const HelpContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const HelpHeader = styled.div`
  margin-bottom: 2rem;
`;

const HelpTitle = styled.h2`
  margin-bottom: 0.5rem;
  color: #333;
`;

const HelpDescription = styled.p`
  color: #666;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 2rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(77, 171, 247, 0.2);
  }
`;

const CategorySection = styled.div`
  margin-bottom: 2rem;
`;

const CategoryTitle = styled.h3`
  margin-bottom: 1rem;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CategoryContent = styled.div`
  max-height: ${props => props.isOpen ? '2000px' : '0'};
  overflow: hidden;
  transition: max-height 0.5s ease;
`;

const FaqItem = styled.div`
  margin-bottom: 1rem;
  border: 1px solid #eee;
  border-radius: 4px;
  overflow: hidden;
`;

const FaqQuestion = styled.div`
  padding: 1rem;
  background: ${props => props.isOpen ? 'var(--light-color)' : '#f8f9fa'};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: ${props => props.isOpen ? 'bold' : 'normal'};
  color: ${props => props.isOpen ? 'var(--dark-color)' : '#333'};
  transition: background 0.3s ease;
  
  &:hover {
    background: var(--light-color);
  }
`;

const FaqAnswer = styled.div`
  padding: 0 1rem;
  max-height: ${props => props.isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
  padding-bottom: ${props => props.isOpen ? '1rem' : '0'};
`;

const AnswerText = styled.p`
  color: #555;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const AnswerList = styled.ul`
  padding-left: 1.5rem;
  margin-bottom: 1rem;
`;

const AnswerListItem = styled.li`
  margin-bottom: 0.5rem;
  color: #555;
`;

const ExampleBox = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border-left: 4px solid var(--primary-color);
`;

const ExampleTitle = styled.h5`
  margin-bottom: 0.5rem;
  color: #333;
`;

const ExampleText = styled.p`
  color: #555;
  font-style: italic;
  margin-bottom: 0.5rem;
`;

const ContactSection = styled.div`
  background: var(--light-color);
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
`;

const ContactTitle = styled.h3`
  margin-bottom: 1rem;
  color: #333;
`;

const ContactText = styled.p`
  color: #555;
  margin-bottom: 1rem;
`;

const ContactLink = styled.a`
  color: var(--primary-color);
  font-weight: bold;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ScoringTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
  
  th, td {
    border: 1px solid #ddd;
    padding: 0.75rem;
    text-align: left;
  }
  
  th {
    background-color: #f8f9fa;
    font-weight: bold;
  }
  
  tr:nth-child(even) {
    background-color: #f8f9fa;
  }
`;

const faqData = {
  general: [
    {
      question: 'What is prompt engineering?',
      answer: (
        <>
          <AnswerText>
            Prompt engineering is the process of designing and refining inputs to AI systems (like GPT-4) to get the most effective outputs. It involves crafting clear, specific instructions that guide the AI to produce the desired results.
          </AnswerText>
          <AnswerText>
            Good prompt engineering can dramatically improve the quality, relevance, and usefulness of AI-generated content.
          </AnswerText>
        </>
      )
    },
    {
      question: 'How does the learning path work?',
      answer: (
        <>
          <AnswerText>
            Our learning path consists of three progressive phases:
          </AnswerText>
          <AnswerList>
            <AnswerListItem><strong>Detail Phase:</strong> Learn to create comprehensive, specific prompts that leave little room for misinterpretation.</AnswerListItem>
            <AnswerListItem><strong>Concise Phase:</strong> Master the art of brevity while maintaining clarity and effectiveness.</AnswerListItem>
            <AnswerListItem><strong>Creative Phase:</strong> Develop prompts that encourage innovative and unique responses while maintaining direction.</AnswerListItem>
          </AnswerList>
          <AnswerText>
            You must score at least 9.0/10 in each phase to unlock the next one, ensuring you've mastered the necessary skills before progressing.
          </AnswerText>
        </>
      )
    },
    {
      question: 'How are my prompts evaluated?',
      answer: (
        <>
          <AnswerText>
            Your prompts are evaluated by GPT-4 based on four key criteria:
          </AnswerText>
          <AnswerList>
            <AnswerListItem><strong>Task Clarity:</strong> How clearly the prompt communicates what needs to be done (0-25 points)</AnswerListItem>
            <AnswerListItem><strong>Subject Specificity:</strong> How well the prompt defines the subject matter (0-25 points)</AnswerListItem>
            <AnswerListItem><strong>Completeness:</strong> How thoroughly the prompt covers all necessary aspects (0-25 points)</AnswerListItem>
            <AnswerListItem><strong>Context:</strong> How well the prompt provides relevant background information (0-25 points)</AnswerListItem>
          </AnswerList>
          <AnswerText>
            Each criterion is scored on a scale of 0-25, for a total of 100 points. This is then converted to a 0-10 scale for your final score, with potential deductions for specific issues.
          </AnswerText>
          <ScoringTable>
            <thead>
              <tr>
                <th>Score Range</th>
                <th>Quality Tier</th>
                <th>Progression</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>9.0 - 10.0</td>
                <td>High</td>
                <td>Unlocks next phase</td>
              </tr>
              <tr>
                <td>6.0 - 8.9</td>
                <td>Mid</td>
                <td>Good progress, but needs improvement</td>
              </tr>
              <tr>
                <td>0.0 - 5.9</td>
                <td>Low</td>
                <td>Significant improvement needed</td>
              </tr>
            </tbody>
          </ScoringTable>
        </>
      )
    }
  ],
  phases: [
    {
      question: 'What should I focus on in the Detail Phase?',
      answer: (
        <>
          <AnswerText>
            In the Detail Phase, focus on creating comprehensive prompts that:
          </AnswerText>
          <AnswerList>
            <AnswerListItem>Clearly define the task and desired outcome</AnswerListItem>
            <AnswerListItem>Specify the subject matter in detail</AnswerListItem>
            <AnswerListItem>Include all necessary parameters and constraints</AnswerListItem>
            <AnswerListItem>Provide relevant context and background information</AnswerListItem>
          </AnswerList>
          <ExampleBox>
            <ExampleTitle>Example of a detailed prompt:</ExampleTitle>
            <ExampleText>
              "Create a comprehensive guide for first-time homebuyers in the United States in 2023. Include sections on mortgage pre-approval, down payment options, the house hunting process, making an offer, home inspections, closing costs, and post-purchase considerations. For each section, provide practical advice, potential pitfalls to avoid, and 2-3 actionable tips. The guide should be informative yet accessible to readers with no prior knowledge of real estate transactions. Format the guide with clear headings, bullet points where appropriate, and a summary of key points at the end."
            </ExampleText>
          </ExampleBox>
        </>
      )
    },
    {
      question: 'What should I focus on in the Concise Phase?',
      answer: (
        <>
          <AnswerText>
            In the Concise Phase, focus on creating efficient prompts that:
          </AnswerText>
          <AnswerList>
            <AnswerListItem>Communicate the essential requirements with minimal words</AnswerListItem>
            <AnswerListItem>Eliminate unnecessary details while preserving clarity</AnswerListItem>
            <AnswerListItem>Use precise language and avoid redundancy</AnswerListItem>
            <AnswerListItem>Maintain effectiveness despite brevity</AnswerListItem>
          </AnswerList>
          <ExampleBox>
            <ExampleTitle>Example of a concise prompt:</ExampleTitle>
            <ExampleText>
              "Create a first-time homebuyer's guide for the US (2023). Cover: mortgage pre-approval, down payments, house hunting, offers, inspections, closing costs, and post-purchase tips. Include advice, pitfalls, and actionable tips for each section. Use clear headings and bullet points. End with a key points summary."
            </ExampleText>
          </ExampleBox>
        </>
      )
    },
    {
      question: 'What should I focus on in the Creative Phase?',
      answer: (
        <>
          <AnswerText>
            In the Creative Phase, focus on creating prompts that:
          </AnswerText>
          <AnswerList>
            <AnswerListItem>Encourage innovative and unique responses</AnswerListItem>
            <AnswerListItem>Balance constraints with freedom for exploration</AnswerListItem>
            <AnswerListItem>Inspire the AI to approach topics from unusual angles</AnswerListItem>
            <AnswerListItem>Maintain direction while allowing for creative expression</AnswerListItem>
          </AnswerList>
          <ExampleBox>
            <ExampleTitle>Example of a creative prompt:</ExampleTitle>
            <ExampleText>
              "Imagine you're a time-traveling real estate agent from 2050 creating a guide for first-time homebuyers in 2023. With your future perspective, highlight the most crucial aspects of the home buying process that people often overlook. Include sections on mortgage options, property selection, negotiation tactics, and long-term considerations. Balance practical advice with forward-thinking insights, and incorporate unexpected analogies to make complex concepts accessible. Format as a conversational guide with a touch of humor."
            </ExampleText>
          </ExampleBox>
        </>
      )
    }
  ],
  tips: [
    {
      question: 'How can I improve my prompt clarity?',
      answer: (
        <>
          <AnswerText>
            To improve clarity in your prompts:
          </AnswerText>
          <AnswerList>
            <AnswerListItem>Use simple, direct language</AnswerListItem>
            <AnswerListItem>Clearly state the task or question at the beginning</AnswerListItem>
            <AnswerListItem>Break complex requests into steps or bullet points</AnswerListItem>
            <AnswerListItem>Specify the format you want the response in</AnswerListItem>
            <AnswerListItem>Avoid ambiguous terms or phrases that could be interpreted in multiple ways</AnswerListItem>
          </AnswerList>
        </>
      )
    },
    {
      question: 'How can I make my prompts more specific?',
      answer: (
        <>
          <AnswerText>
            To increase specificity in your prompts:
          </AnswerText>
          <AnswerList>
            <AnswerListItem>Include relevant details about the subject matter</AnswerListItem>
            <AnswerListItem>Specify parameters like length, tone, style, or perspective</AnswerListItem>
            <AnswerListItem>Define your target audience</AnswerListItem>
            <AnswerListItem>Mention any particular aspects you want emphasized</AnswerListItem>
            <AnswerListItem>Use examples to illustrate what you're looking for</AnswerListItem>
          </AnswerList>
        </>
      )
    },
    {
      question: 'What common mistakes should I avoid?',
      answer: (
        <>
          <AnswerText>
            Common prompt engineering mistakes to avoid:
          </AnswerText>
          <AnswerList>
            <AnswerListItem>Being too vague or general</AnswerListItem>
            <AnswerListItem>Overloading with too many requirements</AnswerListItem>
            <AnswerListItem>Using ambiguous language</AnswerListItem>
            <AnswerListItem>Failing to specify the desired format or structure</AnswerListItem>
            <AnswerListItem>Not providing enough context</AnswerListItem>
            <AnswerListItem>Including contradictory instructions</AnswerListItem>
            <AnswerListItem>Assuming the AI understands implied requirements</AnswerListItem>
          </AnswerList>
        </>
      )
    }
  ],
  scoring: [
    {
      question: 'How is my final score calculated?',
      answer: (
        <>
          <AnswerText>
            Your final score is calculated using the following process:
          </AnswerText>
          <AnswerList>
            <AnswerListItem><strong>Criteria Scores:</strong> Each of the four criteria (Task Clarity, Subject Specificity, Completeness, and Context) is scored on a scale of 0-25 points.</AnswerListItem>
            <AnswerListItem><strong>Total Score:</strong> The four criteria scores are added together for a total of 0-100 points.</AnswerListItem>
            <AnswerListItem><strong>Deductions:</strong> Points may be deducted for specific issues like ambiguous language, missing audience specification, or vague quantifiers.</AnswerListItem>
            <AnswerListItem><strong>Final Score:</strong> The total score (after deductions) is divided by 10 to give a final score on a scale of 0-10.</AnswerListItem>
          </AnswerList>
          <AnswerText>
            The final score determines your quality tier: High (9.0-10.0), Mid (6.0-8.9), or Low (0.0-5.9).
          </AnswerText>
        </>
      )
    },
    {
      question: 'What deductions might affect my score?',
      answer: (
        <>
          <AnswerText>
            Common deductions that may affect your score include:
          </AnswerText>
          <AnswerList>
            <AnswerListItem><strong>Ambiguous Quantifiers (-1.0):</strong> Using terms like "some" or "various" instead of specific numbers</AnswerListItem>
            <AnswerListItem><strong>Missing Audience Specification (-0.5 to -1.5):</strong> Not clearly defining who the content is for</AnswerListItem>
            <AnswerListItem><strong>Ambiguous Requirements (-1.0):</strong> Unclear or vague instructions</AnswerListItem>
            <AnswerListItem><strong>Missing Specific Constraints (-0.5):</strong> Not including explicit requirements using words like "must" or "should"</AnswerListItem>
            <AnswerListItem><strong>Lack of Creative Elements (-0.5):</strong> In the Creative phase, not including enough innovative or imaginative elements</AnswerListItem>
          </AnswerList>
        </>
      )
    },
    {
      question: 'How can I improve my score?',
      answer: (
        <>
          <AnswerText>
            To improve your score in each phase:
          </AnswerText>
          <AnswerList>
            <AnswerListItem><strong>Detail Phase:</strong> Include explicit constraints, specify your audience, use specific numbers instead of vague quantifiers, and provide comprehensive context.</AnswerListItem>
            <AnswerListItem><strong>Concise Phase:</strong> Focus on precision and brevity, eliminate unnecessary words, and ensure your prompt is a single, clear sentence under 18 words.</AnswerListItem>
            <AnswerListItem><strong>Creative Phase:</strong> Use explicitly creative terms (like "innovative," "unique," or "imagine"), balance creativity with clear direction, and encourage unusual perspectives.</AnswerListItem>
          </AnswerList>
          <AnswerText>
            Pay attention to the feedback provided with each evaluation, which will highlight specific strengths and areas for improvement.
          </AnswerText>
        </>
      )
    }
  ]
};

const HelpSection = () => {
  const [openItems, setOpenItems] = useState({});
  const [openCategories, setOpenCategories] = useState({
    general: true,
    phases: true,
    tips: true,
    scoring: true
  });
  const [searchTerm, setSearchTerm] = useState('');
  const { phases } = useSelector(state => state.phases);
  
  const toggleItem = (category, index) => {
    const key = `${category}-${index}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const toggleCategory = (category) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  const isItemOpen = (category, index) => {
    const key = `${category}-${index}`;
    return openItems[key] || false;
  };
  
  const filterFaqs = () => {
    if (!searchTerm.trim()) return faqData;
    
    const filtered = {};
    
    Object.keys(faqData).forEach(category => {
      filtered[category] = faqData[category].filter(item => 
        item.question.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    
    return filtered;
  };
  
  const filteredFaqs = filterFaqs();

  return (
    <HelpContainer className="help-section">
      <HelpHeader>
        <HelpTitle>Help & Resources</HelpTitle>
        <HelpDescription>
          Find answers to common questions and learn how to get the most out of the Prompt Engineering Challenge Tool.
        </HelpDescription>
      </HelpHeader>
      
      <SearchBar 
        type="text" 
        placeholder="Search for help topics..." 
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      
      <CategorySection>
        <CategoryTitle onClick={() => toggleCategory('general')}>
          General Questions
          {openCategories.general ? <FaChevronUp /> : <FaChevronDown />}
        </CategoryTitle>
        <CategoryContent isOpen={openCategories.general}>
          {filteredFaqs.general.map((item, index) => (
            <FaqItem key={`general-${index}`}>
              <FaqQuestion 
                isOpen={isItemOpen('general', index)} 
                onClick={() => toggleItem('general', index)}
              >
                {item.question}
                {isItemOpen('general', index) ? <FaChevronUp /> : <FaChevronDown />}
              </FaqQuestion>
              <FaqAnswer isOpen={isItemOpen('general', index)}>
                {item.answer}
              </FaqAnswer>
            </FaqItem>
          ))}
        </CategoryContent>
      </CategorySection>
      
      <CategorySection>
        <CategoryTitle onClick={() => toggleCategory('phases')}>
          Phase-Specific Help
          {openCategories.phases ? <FaChevronUp /> : <FaChevronDown />}
        </CategoryTitle>
        <CategoryContent isOpen={openCategories.phases}>
          {filteredFaqs.phases.map((item, index) => (
            <FaqItem key={`phases-${index}`}>
              <FaqQuestion 
                isOpen={isItemOpen('phases', index)} 
                onClick={() => toggleItem('phases', index)}
              >
                {item.question}
                {isItemOpen('phases', index) ? <FaChevronUp /> : <FaChevronDown />}
              </FaqQuestion>
              <FaqAnswer isOpen={isItemOpen('phases', index)}>
                {item.answer}
              </FaqAnswer>
            </FaqItem>
          ))}
        </CategoryContent>
      </CategorySection>
      
      <CategorySection>
        <CategoryTitle onClick={() => toggleCategory('tips')}>
          Tips & Best Practices
          {openCategories.tips ? <FaChevronUp /> : <FaChevronDown />}
        </CategoryTitle>
        <CategoryContent isOpen={openCategories.tips}>
          {filteredFaqs.tips.map((item, index) => (
            <FaqItem key={`tips-${index}`}>
              <FaqQuestion 
                isOpen={isItemOpen('tips', index)} 
                onClick={() => toggleItem('tips', index)}
              >
                {item.question}
                {isItemOpen('tips', index) ? <FaChevronUp /> : <FaChevronDown />}
              </FaqQuestion>
              <FaqAnswer isOpen={isItemOpen('tips', index)}>
                {item.answer}
              </FaqAnswer>
            </FaqItem>
          ))}
        </CategoryContent>
      </CategorySection>
      
      <CategorySection>
        <CategoryTitle onClick={() => toggleCategory('scoring')}>
          Scoring & Evaluation
          {openCategories.scoring ? <FaChevronUp /> : <FaChevronDown />}
        </CategoryTitle>
        <CategoryContent isOpen={openCategories.scoring}>
          {filteredFaqs.scoring.map((item, index) => (
            <FaqItem key={`scoring-${index}`}>
              <FaqQuestion 
                isOpen={isItemOpen('scoring', index)} 
                onClick={() => toggleItem('scoring', index)}
              >
                {item.question}
                {isItemOpen('scoring', index) ? <FaChevronUp /> : <FaChevronDown />}
              </FaqQuestion>
              <FaqAnswer isOpen={isItemOpen('scoring', index)}>
                {item.answer}
              </FaqAnswer>
            </FaqItem>
          ))}
        </CategoryContent>
      </CategorySection>
      
      <ContactSection>
        <ContactTitle>Still Need Help?</ContactTitle>
        <ContactText>
          If you couldn't find the answer to your question, feel free to contact our support team.
        </ContactText>
        <ContactLink href="mailto:support@promptengineeringchallenge.com">
          support@promptengineeringchallenge.com
        </ContactLink>
      </ContactSection>
    </HelpContainer>
  );
};

export default HelpSection; 