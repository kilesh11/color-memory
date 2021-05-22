/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useCallback, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Button,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Alert,
  Image,
} from 'react-native';
import Gameboard from './Gameboard';
import Highestscore from './Highestscore';
import Modal from './Modal';

import {Colors} from 'react-native/Libraries/NewAppScreen';

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateColorGrid() {
  const array = [
    {hex: color.red},
    {hex: color.orange},
    {hex: color.yellow},
    {hex: color.green},
    {hex: color.blue},
    {hex: color.violet},
    {hex: color.black},
    {hex: color.brown},
  ];
  return shuffleArray([...array, ...array]);
}

const color = {
  red: '#cd5c5c',
  orange: '#ec9706',
  yellow: '#fdee87',
  green: '#85c285',
  blue: '#3c89d0',
  violet: '#945cb4',
  black: '#000',
  brown: '#92623a',
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [score, setScore] = useState(0);
  const [grid, setGrid] = useState(() => generateColorGrid());
  const [resolvedIndex, setResolvedIndex] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [selectedIndex, setSelectedIndex] = useState([]);
  const [dimensions, setDimensions] = useState({width: 0, height: 0});
  const [ranking, setRanking] = useState([]);
  const [gameMode, setGameMode] = useState(true);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const fetchRanking = useCallback(async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('ranking');
      const newRanking = jsonValue != null ? JSON.parse(jsonValue) : [];
      setRanking(newRanking);
    } catch (e) {
      Alert.alert('cannot find ranking');
    }
  }, []);

  useEffect(() => {
    fetchRanking();
  }, [fetchRanking]);

  useEffect(() => {
    if (selectedIndex.length === 2) {
      let timer = setTimeout(() => {
        if (grid[selectedIndex[0]].hex === grid[selectedIndex[1]].hex) {
          setScore(prevScore => prevScore + 5);
          setResolvedIndex(prevResolvedIndex => [
            ...prevResolvedIndex,
            ...selectedIndex,
          ]);
          setSelectedIndex([]);
        } else {
          setScore(prevScore => prevScore - 1);
          setSelectedIndex([]);
        }
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [selectedIndex, grid]);

  useEffect(() => {
    if (resolvedIndex.length === 16) {
      setModalVisible(true);
    }
  }, [resolvedIndex]);

  const onLayout = useCallback(event => {
    let {width, height} = event.nativeEvent.layout;
    setDimensions({width, height});
  }, []);

  const cardOnPress = useCallback(
    index => {
      let newSelectedIndex = [...selectedIndex];
      if (selectedIndex.includes(index)) {
        newSelectedIndex.splice(newSelectedIndex.indexOf(index), 1);
      } else {
        newSelectedIndex = [...newSelectedIndex, index];
      }

      if (newSelectedIndex.length <= 2) {
        setSelectedIndex(newSelectedIndex);
      }
    },
    [selectedIndex],
  );

  const onScoreSubmit = useCallback(async () => {
    if (name === '') {
      Alert.alert('name cannot be empty');
    } else {
      try {
        const newRanking = [...ranking];
        newRanking.push({name, score});
        newRanking.sort((a, b) => b.score - a.score);
        const jsonValue = JSON.stringify(newRanking);
        await AsyncStorage.setItem('ranking', jsonValue);
        onReset();
        await fetchRanking();
      } catch (e) {
        Alert.alert('cannot save ranking');
      }
    }
  }, [name, score, onReset, ranking, fetchRanking]);

  const onReset = useCallback(() => {
    setName('');
    setScore(0);
    setSelectedIndex([]);
    setResolvedIndex([]);
    setGrid(generateColorGrid);
    setModalVisible(prevState => !prevState);
  }, []);

  const header = (
    <>
      <View style={styles.logo}>
        <Image
          style={{
            width: 100,
            height: 100,
            resizeMode: 'contain',
          }}
          source={require('./logo.png')}
        />
      </View>
      <Text style={styles.score}>{score}</Text>
      <View style={styles.highestScore}>
        <Button
          title={gameMode ? 'Highest Score' : 'Back to Game'}
          onPress={() => setGameMode(prev => !prev)}
        />
      </View>
    </>
  );

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View
        style={{
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
          height: '100%',
        }}>
        <View style={styles.header}>{header}</View>
        <View
          style={{
            height: '90%',
            flex: 1,
          }}
          onLayout={onLayout}>
          {gameMode ? (
            <Gameboard
              grid={grid}
              cardOnPress={cardOnPress}
              resolvedIndex={resolvedIndex}
              selectedIndex={selectedIndex}
              dimensions={dimensions}
            />
          ) : (
            <Highestscore ranking={ranking} />
          )}
        </View>
      </View>
      <Modal
        modalVisible={modalVisible}
        ranking={ranking}
        score={score}
        setName={setName}
        name={name}
        onScoreSubmit={onScoreSubmit}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  score: {
    flex: 1,
    textAlign: 'center',
    fontSize: 30,
  },
  header: {
    height: '10%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  highestScore: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default App;
