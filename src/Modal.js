import React from 'react';

import {Button, StyleSheet, Text, View, Modal, TextInput} from 'react-native';

function getCurrentRanking(ranking, currentScore) {
  if (ranking.length <= 0) {
    return 1;
  } else {
    const scoreRanking = ranking.map(obj => obj.score);
    const currentRanking = scoreRanking.findIndex(
      score => score < currentScore,
    );
    return currentRanking + 1;
  }
}

const ModalPopup = ({
  modalVisible,
  ranking,
  score,
  setName,
  name,
  onScoreSubmit,
}) => {
  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.scoreRanking}>Your Score</Text>
          <Text style={styles.scoreTxt}>{score}</Text>
          <Text style={styles.scoreRanking}>{`Your Ranking: ${getCurrentRanking(
            ranking,
            score,
          )}`}</Text>
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
  );
};

const styles = StyleSheet.create({
  scoreTxt: {
    fontSize: 30,
  },
  scoreRanking: {
    marginVertical: 15,
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

export default ModalPopup;
