import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Image, View } from 'react-native';
import { Button, Text, Dialog, Portal, Card } from 'react-native-paper';
import { useSession } from '../context/SessionContext';
import logo from '../assets/logo.png'; // Ensure the path to your logo is correct
import * as Notifications from 'expo-notifications';

export default function Home({ navigation }) {
  const { user } = useSession();

  if (!user) {
    return null;
  }
  const [welcomeVisible, setWelcomeVisible] = useState(true);

  useEffect(() => {
    const registerForNotifications = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      } else {
        console.log('Notification permissions already granted');
      }
    };

    if (user) {
      registerForNotifications();
    }
  }, [user]);

  function welcome() {
    return (
      <Dialog visible={welcomeVisible} style={styles.dialog}>
        <Dialog.Title style={styles.dialogTitle}>Welcome</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.dialogContent}>
            Welcome to InfiniteFocus, an app that will enable you to avoid doom scrolling and enjoy
            the more important things in life.
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            mode="contained"
            onPress={() => {
              setWelcomeVisible(false);
              navigation.navigate('Preferences');
            }}
            style={styles.dialogButton}
          >
            Next
          </Button>
        </Dialog.Actions>
      </Dialog>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
      </View>
      <Card style={styles.introCard}>
        <Card.Content>
          <Text style={styles.introText}>
            InfiniteFocus is a revolutionary mobile app designed to combat digital distractions and
            promote productivity and mindfulness.
          </Text>
        </Card.Content>
      </Card>
      <Card style={styles.featureCard}>
        <Card.Title title="Features" titleStyle={styles.cardTitle} />
        <Card.Content>
          <Text style={styles.featureText}>
            • Distraction Alerts: Randomly timed alerts to break the cycle of phone overuse.
          </Text>
          <Text style={styles.featureText}>
            • Activity Suggestions: Proposes quick activities like push-ups or stretching.
          </Text>
          <Text style={styles.featureText}>
            • Relaxation Mode: Displays calming scenes to encourage a brief moment of tranquility.
          </Text>
          <Text style={styles.featureText}>
            • Customizable Settings: Users can tailor alert frequency and activity types.
          </Text>
        </Card.Content>
      </Card>
      <Portal>
        {user &&
          user.preferredTasks &&
          Object.values(user.preferredTasks).every(value => value === false) &&
          welcome()}
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
  introCard: {
    margin: 10,
    padding: 20,
    backgroundColor: 'black',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  introText: {
    color: 'white',
    textAlign: 'center',
  },
  featureCard: {
    margin: 10,
    padding: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    textAlign: 'center',
    color: 'black',
  },
  featureText: {
    color: 'black',
    marginBottom: 10,
  },
  dialog: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dialogTitle: {
    color: 'black',
  },
  dialogContent: {
    color: 'black',
  },
  dialogButton: {
    marginTop: 10,
    backgroundColor: 'black',
    color: 'white',
  },
});
