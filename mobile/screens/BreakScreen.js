import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Text, TouchableOpacity } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { useNavigation, useIsFocused } from '@react-navigation/native'; // Import useIsFocused
import { Audio } from 'expo-av';
import { width, height } from '../config/DeviceDimensions';

const BreakScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // This hook returns true if the screen is focused, false otherwise.
  const [sound, setSound] = useState(null);
  const [timerKey, setTimerKey] = useState(0);
  const time = 20; // 5 minutes break
  const isPlaying = true;

  useEffect(() => {
    let soundObject;

    const loadAndPlaySound = async () => {
      const { sound: newSound } = await Audio.Sound.createAsync(
        require('../assets/breakSound.mp3'),
        { shouldPlay: true }
      );
      soundObject = newSound;
      setSound(newSound);
    };

    if (isFocused) {
      loadAndPlaySound();
    }

    return () => {
      // This cleanup function gets called when the component unmounts or before the effect runs again.
      if (soundObject) {
        soundObject.unloadAsync();
      }
    };
  }, [isFocused]); // Depend on isFocused so this effect runs every time the screen is entered or left.

  const handleSkip = async () => {
    if (sound) {
      await sound.unloadAsync();
    }
    setTimerKey(prevKey => prevKey + 1);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/calmingWater.gif')} // Replace with your relaxing image/video
        style={styles.background}
        resizeMode="cover"
      >
        <CountdownCircleTimer
          key={timerKey} // Use the timerKey here
          isPlaying={isPlaying}
          duration={time} // 5 minutes break
          colors={['#004777', '#F7B801', '#A30000', '#A30000']}
          colorsTime={[7, 5, 2, 0]}
          onComplete={() => {
            // Stop the music and navigate back when the timer completes
            if (sound) {
              sound.unloadAsync();
            }
            navigation.goBack();
          }}
        >
          {({ remainingTime }) => (
            <Text style={styles.timerText}>
              {Math.floor(remainingTime / 60)}:{String(remainingTime % 60).padStart(2, '0')}
            </Text>
          )}
        </CountdownCircleTimer>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </ImageBackground>
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
    overflow: 'hidden', // Ensure the image does not overflow the container
  },
  timerText: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
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
