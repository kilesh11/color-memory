/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useCallback, useEffect} from 'react';
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
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
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

const generateColorGrid = () => {
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
};

const column = 4;
const row = 4;

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [score, setScore] = useState(0);
  const [grid, setGrid] = useState(() => generateColorGrid());
  const [resolvedIndex, setResolvedIndex] = useState([]);
  console.log(
    'kyle_debug ~ file: App.js ~ line 66 ~ App ~ resolvedIndex',
    resolvedIndex,
  );
  const [selectedIndex, setSelectedIndex] = useState([]);
  console.log(
    'kyle_debug ~ file: App.js ~ line 66 ~ App ~ selectedIndex',
    selectedIndex,
  );
  const [dimensions, setDimensions] = useState({width: 0, height: 0});
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    if (selectedIndex.length === 2) {
      let timer1 = setTimeout(() => {
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
        clearTimeout(timer1);
      };
    }
  }, [selectedIndex, grid]);

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
      console.log(
        'kyle_debug ~ file: App.js ~ line 109 ~ App ~ newSelectedIndex',
        newSelectedIndex,
      );

      if (newSelectedIndex.length <= 2) {
        setSelectedIndex(newSelectedIndex);
      }
    },
    [selectedIndex],
  );

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
            height: '95%',
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    height: '5%',
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
