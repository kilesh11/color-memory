import React from 'react';
import {FlatList, TouchableOpacity} from 'react-native';

const column = 4;
const row = 4;

const Gameboard = ({
  grid,
  cardOnPress,
  resolvedIndex,
  selectedIndex,
  dimensions,
}) => {
  return (
    <FlatList
      data={grid}
      renderItem={({item, index}) => (
        <TouchableOpacity
          onPress={() => cardOnPress(index)}
          // eslint-disable-next-line react-native/no-inline-styles
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
  );
};

export default Gameboard;
