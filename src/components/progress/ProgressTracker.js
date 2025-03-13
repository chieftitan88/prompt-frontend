import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getProgress } from '../../actions/progress';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProgressContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ProgressHeader = styled.div`
  margin-bottom: 2rem;
`;

const ProgressTitle = styled.h2`
  margin-bottom: 0.5rem;
  color: #333;
`;

const ProgressDescription = styled.p`
  color: #666;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: var(--light-color);
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #555;
  margin-top: 0.5rem;
`;

const ChartContainer = styled.div`
  margin-bottom: 2rem;
  height: 300px;
`;

const PhaseProgressSection = styled.div`
  margin-bottom: 2rem;
`;

const PhaseProgressTitle = styled.h3`
  margin-bottom: 1rem;
  color: #333;
`;

const ProgressBar = styled.div`
  height: 30px;
  background: #e9ecef;
  border-radius: 15px;
  margin-bottom: 1rem;
  overflow: hidden;
  position: relative;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => {
    if (props.percentage >= 90) return 'var(--success-color)';
    if (props.percentage >= 70) return '#74b816';
    if (props.percentage >= 50) return '#f59f00';
    return 'var(--danger-color)';
  }};
  width: ${props => `${props.percentage}%`};
  border-radius: 15px;
  transition: width 0.5s ease;
`;

const ProgressLabel = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.percentage > 50 ? 'white' : '#333'};
  font-weight: bold;
`;

const ProgressTracker = ({ getProgress, progress: { data, loading } }) => {
  useEffect(() => {
    getProgress();
  }, [getProgress]);

  if (loading) {
    return <div>Loading progress data...</div>;
  }

  if (!data) {
    return <div>No progress data available</div>;
  }

  // Calculate statistics
  const totalPrompts = data.prompts.length;
  const averageScore = totalPrompts > 0 
    ? data.prompts.reduce((sum, p) => sum + p.score, 0) / totalPrompts 
    : 0;
  const highestScore = totalPrompts > 0 
    ? Math.max(...data.prompts.map(p => p.score)) 
    : 0;
  
  // Prepare chart data
  const chartData = {
    labels: data.prompts.map((_, index) => `Attempt ${index + 1}`),
    datasets: [
      {
        label: 'Prompt Scores',
        data: data.prompts.map(p => p.score),
        fill: false,
        backgroundColor: 'rgba(77, 171, 247, 0.5)',
        borderColor: 'rgba(77, 171, 247, 1)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        title: {
          display: true,
          text: 'Score'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Attempts'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Your Progress Over Time'
      }
    }
  };

  // Calculate phase progress
  const phaseProgress = {
    detail: data.phases.detail ? (data.phases.detail.highestScore / 10) * 100 : 0,
    concise: data.phases.concise ? (data.phases.concise.highestScore / 10) * 100 : 0,
    creative: data.phases.creative ? (data.phases.creative.highestScore / 10) * 100 : 0
  };

  return (
    <ProgressContainer>
      <ProgressHeader>
        <ProgressTitle>Your Progress</ProgressTitle>
        <ProgressDescription>
          Track your prompt engineering journey and see how you've improved over time.
        </ProgressDescription>
      </ProgressHeader>
      
      <StatsGrid>
        <StatCard>
          <StatValue>{totalPrompts}</StatValue>
          <StatLabel>Total Prompts</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{averageScore.toFixed(1)}</StatValue>
          <StatLabel>Average Score</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{highestScore.toFixed(1)}</StatValue>
          <StatLabel>Highest Score</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>
            {Object.values(data.phases).filter(p => p && p.completed).length}/3
          </StatValue>
          <StatLabel>Phases Completed</StatLabel>
        </StatCard>
      </StatsGrid>
      
      <PhaseProgressSection>
        <PhaseProgressTitle>Phase Progress</PhaseProgressTitle>
        
        <div>
          <h4>Detail Phase</h4>
          <ProgressBar>
            <ProgressFill percentage={phaseProgress.detail} />
            <ProgressLabel percentage={phaseProgress.detail}>
              {phaseProgress.detail.toFixed(0)}% ({data.phases.detail ? data.phases.detail.highestScore.toFixed(1) : '0.0'}/10)
            </ProgressLabel>
          </ProgressBar>
        </div>
        
        <div>
          <h4>Concise Phase</h4>
          <ProgressBar>
            <ProgressFill percentage={phaseProgress.concise} />
            <ProgressLabel percentage={phaseProgress.concise}>
              {phaseProgress.concise.toFixed(0)}% ({data.phases.concise ? data.phases.concise.highestScore.toFixed(1) : '0.0'}/10)
            </ProgressLabel>
          </ProgressBar>
        </div>
        
        <div>
          <h4>Creative Phase</h4>
          <ProgressBar>
            <ProgressFill percentage={phaseProgress.creative} />
            <ProgressLabel percentage={phaseProgress.creative}>
              {phaseProgress.creative.toFixed(0)}% ({data.phases.creative ? data.phases.creative.highestScore.toFixed(1) : '0.0'}/10)
            </ProgressLabel>
          </ProgressBar>
        </div>
      </PhaseProgressSection>
      
      {totalPrompts > 0 && (
        <ChartContainer>
          <Line data={chartData} options={chartOptions} />
        </ChartContainer>
      )}
    </ProgressContainer>
  );
};

ProgressTracker.propTypes = {
  getProgress: PropTypes.func.isRequired,
  progress: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  progress: state.progress
});

export default connect(mapStateToProps, { getProgress })(ProgressTracker); 