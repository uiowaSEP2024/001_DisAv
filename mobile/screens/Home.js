import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Checkbox } from 'react-native-paper';
import axios from 'axios';
import { api } from '../config/Api';
import Alert from '../components/Alert';
import { height } from '../config/DeviceDimensions';
export default function Home({ route }) {
  const { user } = route.params;
  console.log('user', user);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const [taskVisible, setTaskVisible] = useState(false);
  const [checkedState, setCheckedState] = useState({
    Work: false,
    Reading: false,
    Exercise: false,
    Break: false,
  });
  const handleCheckboxClick = checkboxLabel => {
    setCheckedState(prevState => ({
      ...prevState,
      [checkboxLabel]: !prevState[checkboxLabel],
    }));
  };
  function welcomeToTaskDialog() {
    setTaskVisible(true);
    setWelcomeVisible(false);
  }
  function timeout(delay) {
    return new Promise(resolve => setTimeout(resolve, delay));
  }
  async function putInitialTaks() {
    await axios
      .put(`http://${api}/user/update-preferred-tasks`, {
        username: user.username,
        preferredTasks: checkedState,
      })
      .then(async r => {
        console.log(r.data.message);
        setAlertText(r.data.message);
        setTaskVisible(false);

        setAlertVisible(true);
        await timeout(2000);
        setAlertVisible(false);
      })
      .catch(async error => {
        console.log('Error', error);
        setTaskVisible(false);
        setAlertText('Error updating preferences');
        setAlertVisible(true);
        await timeout(1000);
        setAlertVisible(false);
      });
  }
  function welcome() {
    return (
      <Dialog visible={welcomeVisible} onDismiss={() => welcomeToTaskDialog()}>
        <Dialog.Title>Welcome</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">
            Welcome to infinite focus, an app that will enable you to avoid doom scrolling and enjoy
            the more important things in life
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => welcomeToTaskDialog()}>Next</Button>
        </Dialog.Actions>
      </Dialog>
    );
  }
  function taskType() {
    return (
      <Dialog visible={taskVisible} onDismiss={() => setTaskVisible(false)}>
        <Dialog.Title>Task Type</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium" testID="task-question">
            What type of task would you like to do?
          </Text>
          {Object.entries(checkedState).map(([label, isChecked]) => (
            <Checkbox.Item
              key={label}
              label={label}
              status={isChecked ? 'checked' : 'unchecked'}
              onPress={() => handleCheckboxClick(label)}
            />
          ))}
          <Button onPress={() => putInitialTaks()}>Submit</Button>
        </Dialog.Content>
      </Dialog>
    );
  }

  return (
    <View style={styles.container}>
      <Portal>
        {welcome()}
        {taskType()}
        <View style={styles.alert}>
          <Alert visible={alertVisible} text={alertText} />
        </View>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  alert: {
    marginTop: height * 1.9,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
