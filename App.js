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
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';

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

const column = 4;
const row = 4;

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

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const fetchRanking = useCallback(async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('ranking');
      const newRanking = jsonValue != null ? JSON.parse(jsonValue) : [];
      console.log(
        'kyle_debug ~ file: App.js ~ line 84 ~ fetchRanking ~ newRanking',
        newRanking,
      );
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
        newRanking.push({
          name,
          score,
        });
        newRanking.sort((a, b) => b.score - a.score);
        const jsonValue = JSON.stringify(newRanking);
        await AsyncStorage.setItem('ranking', jsonValue);
        onReset();
        await fetchRanking();
      } catch (e) {
        // saving error
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

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View
        style={{
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
          height: '100%',
        }}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={{fontSize: 16}}>Color Memory</Text>
          </View>
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 30,
            }}>
            {score}
          </Text>
          <View style={styles.highestScore}>
            <Button
              title="Highest Score"
              onPress={() => console.log('pressed')}
            />
          </View>
        </View>
        <View
          style={{
            height: '90%',
            flex: 1,
          }}
          onLayout={onLayout}>
          <FlatList
            data={grid}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => cardOnPress(index)}
                style={{
                  flex: 1,
                  backgroundColor: resolvedIndex.includes(index)
                    ? 'white'
                    : selectedIndex.includes(index)
                    ? item.hex
                    : 'grey',
                  width: dimensions.width / column,
                  height: dimensions.height / row,
                  borderWidth: 1,
                  borderColor: '#fff',
                }}
              />
            )}
            numColumns={4}
            scrollEnabled={false}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{marginVertical: 15}}>Your Score</Text>
            <Text style={{fontSize: 30}}>{score}</Text>
            <TextInput
              style={styles.input}
              placeholder="Tell me Your Name"
              placeholderTextColor="#aaaaaa"
              onChangeText={setName}
              value={name}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />
            <Button
              title="Submit"
              style={[styles.button, styles.buttonClose]}
              onPress={onScoreSubmit}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    display: 'flex',
    width: '50%',
    backgroundColor: '#eaeaea',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: '100%',
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    padding: 10,
  },
});

export default App;
