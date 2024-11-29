import { useState, useEffect, useCallback } from 'react';
import { fetchTeams, fetchTeamResults } from '../api';
import type { Team, GameResult } from '../types';

export const useTeamsData = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [results, setResults] = useState<Record<number, GameResult[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = useCallback(async () => {
    try {
      const teamsData = await fetchTeams();
      setTeams(teamsData);
      
      const resultsData: Record<number, GameResult[]> = {};
      await Promise.all(
        teamsData.map(async (team) => {
          try {
            const teamResults = await fetchTeamResults(team.team_id);
            resultsData[team.team_id] = teamResults;
          } catch (error) {
            console.error(`Error fetching results for team ${team.team_id}:`, error);
            resultsData[team.team_id] = [];
          }
        })
      );
      
      setResults(resultsData);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('An unknown error occurred'));
      console.error('Error loading data:', error);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    loadData().finally(() => setLoading(false));
  }, [loadData]);

  return { teams, results, loading, error };
};