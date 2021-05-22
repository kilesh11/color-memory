/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useCallback} from 'react';
import {
  Button,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  FlatList,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const generateColorGrid = () => {
  const red = '#cd5c5c';
  const orange = '#ec9706';
  const yellow = '#fdee87';
  const green = '#85c285';
  const blue = '#3c89d0';
  const violet = '#945cb4';
  const black = '#000';
  const white = '#fff';
  const array = [
    {hex: red},
    {hex: orange},
    {hex: yellow},
    {hex: green},
    {hex: blue},
    {hex: violet},
    {hex: black},
    {hex: white},
  ];
  return [...array, ...array];
};

const column = 4;
const row = 4;

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [score, setScore] = useState(0);
  const [grid, setGrid] = useState(() => generateColorGrid());
  const [dimensions, setDimensions] = useState({width: 0, height: 0});
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const onLayout = useCallback(event => {
    let {width, height} = event.nativeEvent.layout;
    setDimensions({width, height});
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
            height: '95%',
            flex: 1,
          }}
          onLayout={onLayout}>
          <FlatList
            data={grid}
            renderItem={({item}) => (
              <View
                style={{
                  flex: 1,
                  backgroundColor: item.hex,
                  width: dimensions.width / column,
                  height: dimensions.height / row,
                }}
              />
            )}
            numColumns={4}
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
