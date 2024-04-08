import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Text, TouchableOpacity } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { useSession } from '../context/SessionContext'; // Adjusted import
import CustomAlert from '../components/CustomAlert';
import { width, height } from '../config/DeviceDimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { api } from '../config/Api';

const BreakScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [sound, setSound] = useState(null);
  const timerKey = 0;
  const time = 120; // Adjusted time for demonstration
  const { currentTask, setCurrentTask } = useSession(); // Adjusted to use currentTask from SessionContext
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const loadAndPlaySound = async () => {
      const { sound: newSound } = await Audio.Sound.createAsync(
        require('../assets/breakSound.mp3'),
        { shouldPlay: true }
      );
      setSound(newSound);
    };

    if (isFocused) {
      loadAndPlaySound();
    }

    return () => {
      sound?.unloadAsync();
    };
  }, [isFocused]);

  const markTaskAsCompleted = async () => {
    if (currentTask) {
      try {
        await axios.put(`http://${api}/task/update-completed`, {
          id: currentTask._id,
          isCompleted: true,
        });
        setCurrentTask(null);
        await AsyncStorage.removeItem('currentTask');
        await AsyncStorage.removeItem('selectedExercise');
        setAlertMessage('Break is Over, Continue scrolling on web');
        setAlertVisible(true);
      } catch (error) {
        console.error('Failed to mark task as completed:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/calmingWater.gif')}
        style={styles.background}
        resizeMode="cover"
      >
        {currentTask ? (
          <>
            <CountdownCircleTimer
              key={timerKey}
              isPlaying={true}
              duration={time}
              colors={['#004777', '#F7B801', '#A30000', '#A30000']}
              colorsTime={[450, 300, 150, 0]}
              onComplete={() => {
                markTaskAsCompleted();
                return [false, 0]; // Stop the timer
              }}
            >
              {({ remainingTime }) => (
                <Text style={styles.timerText}>
                  {Math.floor(remainingTime / 60)}:{String(remainingTime % 60).padStart(2, '0')}
                </Text>
              )}
            </CountdownCircleTimer>
          </>
        ) : (
          <Text style={styles.relaxationText}>
            You don`t have any incomplete tasks, but stay for relaxation if you wish!
          </Text>
        )}
        <TouchableOpacity style={styles.skipButton} onPress={() => navigation.goBack()}>
          <Text style={styles.skipButtonText}>Skip Break</Text>
        </TouchableOpacity>
      </ImageBackground>
      <CustomAlert
        visible={alertVisible}
        title="Relaxation Time"
        message={alertMessage}
        buttons={[{ text: 'OK', onPress: () => setAlertVisible(false) }]}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  timerText: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  relaxationText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  skipButton: {
    position: 'absolute',
    bottom: height * 0.1,
    right: width * 0.05,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 20,
  },
  skipButtonText: {
    color: '#fff',
    fontSize: 20,
  },
});

export default BreakScreen;
