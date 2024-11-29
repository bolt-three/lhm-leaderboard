import { useState, useEffect, useCallback } from 'react';
import { fetchTeamSubmissions } from '../api';
import type { TeamCriteriaSubmission } from '../types';

export const useSubmissionsData = (teams: number[]) => {
  const [submissions, setSubmissions] = useState<Record<number, TeamCriteriaSubmission[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadSubmissions = useCallback(async () => {
    try {
      const submissionsData: Record<number, TeamCriteriaSubmission[]> = {};
      
      await Promise.all(
        teams.map(async (teamId) => {
          try {
            const teamSubmissions = await fetchTeamSubmissions(teamId);
            submissionsData[teamId] = teamSubmissions;
          } catch (error) {
            console.error(`Error fetching submissions for team ${teamId}:`, error);
            submissionsData[teamId] = [];
          }
        })
      );
      
      setSubmissions(submissionsData);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to load submissions'));
    }
  }, [teams]);

  useEffect(() => {
    if (teams.length > 0) {
      setLoading(true);
      loadSubmissions().finally(() => setLoading(false));
    }
  }, [teams, loadSubmissions]);

  return { submissions, loading, error };
};