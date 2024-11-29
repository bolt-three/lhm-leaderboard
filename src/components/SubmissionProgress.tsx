import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import type { TeamCriteriaSubmission, Dimension } from '../types';

interface SubmissionProgressProps {
  submissions: Record<number, TeamCriteriaSubmission[]>;
  dimensions: Dimension[];
  teams: number[];
}

export const SubmissionProgress = ({ submissions, dimensions, teams }: SubmissionProgressProps) => {
  const calculateProgress = () => {
    const totalSubmissions = teams.length * dimensions.length;
    const completedSubmissions = Object.values(submissions).reduce(
      (total, teamSubmissions) => total + teamSubmissions.length,
      0
    );
    return Math.round((completedSubmissions / totalSubmissions) * 100);
  };

  const getDimensionProgress = (dimensionId: number) => {
    const teamsSubmitted = new Set(
      Object.values(submissions)
        .flat()
        .filter(sub => sub.dimension_id === dimensionId)
        .map(sub => sub.team_id)
    );
    return teamsSubmitted.size;
  };

  const progress = calculateProgress();

  return (
    <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Overall Progress</h2>
        <div className="flex items-center">
          <div className="flex-1 bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-600 rounded-full h-4 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="ml-4 font-semibold">{progress}%</span>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3">Dimension Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dimensions.map((dimension) => {
            const submittedCount = getDimensionProgress(dimension.dimension_id);
            const dimensionProgress = Math.round((submittedCount / teams.length) * 100);
            
            return (
              <div
                key={dimension.dimension_id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {dimensionProgress === 100 ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="font-medium">{dimension.dimension_name}</span>
                </div>
                <div className="text-sm">
                  <span className="font-semibold">{submittedCount}</span>
                  <span className="text-gray-500">/{teams.length} teams</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};