// Filename: index.js
// Combined code from all files

import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Button, Alert } from 'react-native';

// SnakeGame Component

const CELL_SIZE = 20;
const BOARD_SIZE = 300;

const directions = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
};

const getRandomPosition = () => {
  const min = 0;
  const max = (BOARD_SIZE / CELL_SIZE) - 1;
  const x = Math.floor(Math.random() * (max - min + 1)) + min;
  const y = Math.floor(Math.random() * (max - min + 1)) + min;
  return { x, y };
};

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
  const [food, setFood] = useState(getRandomPosition());
  const [direction, setDirection] = useState(directions.RIGHT);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (isGameOver) return;
    const intervalId = setInterval(moveSnake, 200);
    return () => clearInterval(intervalId);
  }, [snake, direction, isGameOver]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          setDirection(directions.UP);
          break;
        case 'ArrowDown':
          setDirection(directions.DOWN);
          break;
        case 'ArrowLeft':
          setDirection(directions.LEFT);
          break;
        case 'ArrowRight':
          setDirection(directions.RIGHT);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = { ...newSnake[0], x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

    if (head.x === food.x && head.y === food.y) {
      setFood(getRandomPosition());
    } else {
      newSnake.pop();
    }

    if (head.x < 0 || head.y < 0 || head.x >= BOARD_SIZE / CELL_SIZE || head.y >= BOARD_SIZE / CELL_SIZE || checkCollision(newSnake, head)) {
      setIsGameOver(true);
      Alert.alert("Game Over", "Better luck next time!");
      return;
    }

    newSnake.unshift(head);
    setSnake(newSnake);
  };

  const checkCollision = (snake, head) => {
    for (const segment of snake) {
      if (segment.x === head.x && segment.y === head.y) {
        return true;
      }
    }
    return false;
  };

  const restartGame = () => {
    setSnake([{ x: 5, y: 5 }]);
    setFood(getRandomPosition());
    setDirection(directions.RIGHT);
    setIsGameOver(false);
  };

  return (
    <View style={styles.gameContainer}>
      <View style={styles.board}>
        {snake.map((segment, index) => (
          <View key={index} style={[styles.snake, { left: segment.x * CELL_SIZE, top: segment.y * CELL_SIZE }]} />
        ))}
        <View style={[styles.food, { left: food.x * CELL_SIZE, top: food.y * CELL_SIZE }]} />
      </View>
      {isGameOver && <Button title="Restart" onPress={restartGame} />}
    </View>
  );
};

const styles = StyleSheet.create({
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    backgroundColor: '#EEE',
    position: 'relative',
    borderColor: '#000',
    borderWidth: 1,
  },
  snake: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: '#00FF00',
    position: 'absolute'
  },
  food: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: '#FF0000',
    position: 'absolute'
  }
});

// App Component

export default function App() {
  return (
    <SafeAreaView style={appStyles.container}>
      <Text style={appStyles.title}>Snake Game</Text>
      <SnakeGame />
    </SafeAreaView>
  );
}

const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
});