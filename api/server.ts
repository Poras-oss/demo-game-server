import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { questions } from './questions';

interface Player {
  id: string;
  name: string;
  code: string;
}

interface Room {
  id: string;
  players: Player[];
  question: typeof questions[0] | null;
  timeLeft: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timer?: NodeJS.Timeout;
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const rooms = new Map<string, Room>();

// Get game time based on difficulty
const getGameTime = (difficulty: string): number => {
  switch (difficulty) {
    case 'easy':
      return 15 * 60; // 15 minutes
    case 'medium':
      return 30 * 60; // 30 minutes
    case 'hard':
      return 45 * 60; // 45 minutes
    default:
      return 30 * 60;
  }
};

// Get random question based on difficulty
const getQuestion = (difficulty: string) => {
  const filteredQuestions = questions.filter(q => q.difficulty === difficulty);
  return filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
};

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-room', ({ playerName, roomId, difficulty }) => {
    let room = rooms.get(roomId);

    if (!room) {
      // Create new room if it doesn't exist
      room = {
        id: roomId,
        players: [],
        question: getQuestion(difficulty),
        timeLeft: getGameTime(difficulty),
        difficulty
      };
      rooms.set(roomId, room);

      // Start room timer
      room.timer = setInterval(() => {
        room!.timeLeft--;
        
        if (room!.timeLeft <= 0) {
          // Game over
          clearInterval(room!.timer);
          io.to(roomId).emit('game-over', {
            players: room!.players
          });
          rooms.delete(roomId);
        } else {
          io.to(roomId).emit('time-update', room!.timeLeft);
        }
      }, 1000);
    }

    // Add player to room
    const player: Player = {
      id: socket.id,
      name: playerName,
      code: ''
    };
    room.players.push(player);
    socket.join(roomId);

    // Send initial room state to player
    socket.emit('room-joined', {
      question: room.question,
      players: room.players,
      timeLeft: room.timeLeft
    });

    // Broadcast updated player list to all players in room
    io.to(roomId).emit('player-update', {
      players: room.players
    });

    // Handle code updates
    socket.on('code-update', ({ code }) => {
      const room = Array.from(rooms.values()).find(r => 
        r.players.some(p => p.id === socket.id)
      );
      
      if (room) {
        const player = room.players.find(p => p.id === socket.id);
        if (player) {
          player.code = code;
          io.to(room.id).emit('player-update', {
            players: room.players
          });
        }
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      if (room) {
        room.players = room.players.filter(p => p.id !== socket.id);
        
        if (room.players.length === 0) {
          // Clean up empty room
          if (room.timer) {
            clearInterval(room.timer);
          }
          rooms.delete(roomId);
        } else {
          // Broadcast updated player list
          io.to(roomId).emit('player-update', {
            players: room.players
          });
        }
      }
    });
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});