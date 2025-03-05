// src/data/players.ts

export interface Player {
  name: string
  matches: number[]
}

export const players: Player[] = [
  { name: "Alice", matches: [10, 0, 15, 0, 5] },
  { name: "Bob", matches: [0, 20, 0, 10, 5] },
  { name: "Charlie", matches: [5, 5, 5, 5, 5] },
  { name: "Diana", matches: [0, 0, 10, 0, 20] },
  { name: "Eve", matches: [10, 10, 10, 10, 10] },
]
