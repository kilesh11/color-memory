import React from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';

const Highestscore = ({ranking}) => {
  return (
    <>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.tableHeader}>Ranking</Text>
        </View>
        <View style={styles.centeredView}>
          <Text style={styles.tableHeader}>Name</Text>
        </View>
        <View style={styles.highestScore}>
          <Text style={styles.tableHeader}>Score</Text>
        </View>
      </View>
      <FlatList
        data={ranking}
        renderItem={({item, index}) => (
          <View style={styles.itemView}>
            <View style={styles.logo}>
              <Text>{index + 1}</Text>
            </View>
            <View style={styles.centeredView}>
              <Text>{item.name}</Text>
            </View>
            <View style={styles.highestScore}>
              <Text>{item.score}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
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
  itemView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
});

export default Highestscore;
