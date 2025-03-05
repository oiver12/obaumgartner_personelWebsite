import React, { useState, ChangeEvent, FC } from "react";
import { PageProps } from "gatsby";
import { players as initialPlayers, Player } from "../data/players";
import Layout from "../components/Layout";

interface ProcessedPlayer extends Player {
  totalMatches: number;
  nonZeroCount: number;
  totalScore: number;
  rank: number;
}

const LeaderboardPage: FC<PageProps> = () => {
  const [playerName, setPlayerName] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>(initialPlayers);

  const getProcessedPlayers = (playerList: Player[]): ProcessedPlayer[] => {
    const processed = playerList.map((player) => {
      const totalMatches = player.matches.length;
      const nonZeroCount = player.matches.filter((score) => score !== 0).length;
      const totalScore = player.matches.reduce((acc, curr) => acc + curr, 0);

      return {
        ...player,
        totalMatches,
        nonZeroCount,
        totalScore,
        rank: 0,
      };
    });

    processed.sort((a, b) => b.totalScore - a.totalScore);

    processed.forEach((player, index) => {
      player.rank = index + 1;
    });

    return processed;
  };

  const processedPlayers = getProcessedPlayers(players);

  const currentPlayerStats = playerName
    ? processedPlayers.find(
        (p) => p.name.toLowerCase() === playerName.toLowerCase()
      )
    : undefined;

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value);
  };

  return (
    <Layout>
      <div style={styles.container}>
        <h1 style={styles.heading}>Leaderboard</h1>

        <div style={styles.inputContainer}>
          <input
            type="text"
            placeholder="Enter your name..."
            value={playerName}
            onChange={handleNameChange}
            style={styles.input}
          />
        </div>

        {currentPlayerStats ? (
          <div style={styles.userInfo}>
            <p>
              Hello, <strong>{currentPlayerStats.name}</strong>!
            </p>
            <p>Your Rank: {currentPlayerStats.rank}</p>
            <p>Total Matches: {currentPlayerStats.totalMatches}</p>
            <p>Total Score: {currentPlayerStats.totalScore}</p>
          </div>
        ) : (
          playerName && <p style={styles.notFound}>Player not found</p>
        )}

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Ranking</th>
              <th style={styles.th}>Player Name</th>
              <th style={styles.th}>Matches</th>
              <th style={styles.th}>Kill Points</th>
              <th style={styles.th}>Player Points</th>
              <th style={styles.th}>Total Points</th>
              <th style={styles.th}>Win</th>
            </tr>
          </thead>
          <tbody>
            {processedPlayers.map((player) => (
              <tr key={player.name} style={styles.tr}>
                <td style={styles.td}>{player.rank}</td>
                <td style={styles.td}>{player.name}</td>
                <td style={styles.td}>{player.totalMatches}</td>
                <td style={styles.td}>20</td>
                <td style={styles.td}>17</td>
                <td style={styles.td}>{player.totalScore}</td>
                <td style={styles.td}>3</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default LeaderboardPage;

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    margin: "1rem",
    padding: "2rem",
    width: "80%",
    fontFamily: "Arial, sans-serif",
    background: "linear-gradient(to right, #0a2a43, #065a82)",
    color: "#fff",
    textAlign: "center",
  },
  heading: {
    textAlign: "center",
    fontSize: "2rem",
    marginBottom: "2rem",
  },
  inputContainer: {
    marginBottom: "1rem",
  },
  input: {
    padding: "0.5rem",
    fontSize: "1rem",
    width: "50%",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
  },
  th: {
    backgroundColor: "#065a82",
    color: "#fff",
    padding: "0.75rem",
    borderBottom: "2px solid #003554",
  },
  tr: {
    borderBottom: "1px solid #ccc",
  },
  td: {
    padding: "0.75rem",
    textAlign: "center",
  },
  userInfo: {
    marginTop: "1rem",
    padding: "1rem",
    border: "1px solid #ccc",
    backgroundColor: "#003554",
  },
  notFound: {
    color: "#ff4c4c",
    fontSize: "1.2rem",
    marginTop: "1rem",
  },
};
