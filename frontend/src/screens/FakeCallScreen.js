import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  Dimensions,
} from 'react-native';
import { Audio } from 'expo-av';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { useTheme } from '../contexts/ThemeContext';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const FakeCallScreen = () => {
  const { theme, mode } = useTheme();
  const [callStarted, setCallStarted] = useState(false);
  const [duration, setDuration] = useState(40);
  const [sound, setSound] = useState(null);

  const playRingtone = async () => {
    try {
      const { sound: playback } = await Audio.Sound.createAsync(
        require('../../assets/sounds/fake_ringtone.mp3'),
        { isLooping: true }
      );
      setSound(playback);
      await playback.playAsync();
    } catch (err) {
      console.log('🔊 Error playing ringtone:', err);
    }
  };

  const stopRingtone = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
  };

  const handleStartCall = async () => {
    Vibration.vibrate(500);
    setCallStarted(true);
    await playRingtone();
  };

  const handleEndCall = async () => {
    await stopRingtone();
    setCallStarted(false);
  };

  const handlePickCall = async () => {
    await stopRingtone();
    alert('📞 You picked the fake call! (You can add fake talk audio next)');
  };

  return (
    <LinearGradient
      colors={
        mode === 'dark'
          ? ['#1c1c1e', '#2c2c3e']
          : ['#FFEFBA', '#FFFFFF']
      }
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text style={[styles.title, { color: theme.text }]}>Fake Call Simulator</Text>

        {!callStarted ? (
          <View style={styles.selection}>
            <Text style={[styles.subtitle, { color: theme.secondaryText }]}>Select Duration:</Text>

            <View style={styles.buttonRow}>
              {[40, 60].map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.optionButton,
                    {
                      borderColor: theme.primary,
                      backgroundColor: duration === time ? theme.primary : 'transparent',
                    },
                  ]}
                  onPress={() => setDuration(time)}
                >
                  <Text
                    style={{
                      color: duration === time ? '#fff' : theme.primary,
                      fontWeight: '600',
                      fontSize: 16,
                    }}
                  >
                    {time === 40 ? '40 Seconds' : '1 Minute'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.callButton, { backgroundColor: theme.primary }]}
              onPress={handleStartCall}
            >
              <Text style={styles.callButtonText}>Start Call</Text>
            </TouchableOpacity>

            <LottieView
              source={require('../../assets/animations/phone.json')}
              autoPlay
              loop
              style={styles.lottie}
            />
          </View>
        ) : (
          <View style={styles.callingArea}>
            <CountdownCircleTimer
              isPlaying
              duration={duration}
              size={200}
              strokeWidth={14}
              trailColor="#ccc"
              colors={[theme.primary, '#FF6B6B', '#b71c1c']}
              colorsTime={[duration, duration / 2, 0]}
              onComplete={handleEndCall}
            >
              {({ remainingTime }) => (
                <Text style={[styles.timerText, { color: theme.text }]}>
                  {remainingTime}s
                </Text>
              )}
            </CountdownCircleTimer>

            <TouchableOpacity onPress={handlePickCall} style={styles.pickButton}>
              <Text style={[styles.pickText, { color: theme.accent }]}>Pick Call</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleEndCall} style={styles.endButton}>
              <Text style={[styles.endText, { color: theme.emergency }]}>End Call</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  optionButton: {
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  callButton: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 12,
    elevation: 4,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  lottie: {
    width: 220,
    height: 220,
    marginTop: 30,
  },
  callingArea: {
    alignItems: 'center',
    gap: 25,
  },
  timerText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  pickButton: {
    marginTop: 20,
  },
  pickText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  endButton: {
    marginTop: 12,
  },
  endText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  selection: {
    alignItems: 'center',
  },
});

export default FakeCallScreen;
