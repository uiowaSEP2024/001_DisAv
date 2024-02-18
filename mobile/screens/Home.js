import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Dialog, Portal, Checkbox } from 'react-native-paper';
import axios from 'axios';
import { api } from '../config/Api';

export default function Home({ navigation, route }) {
  const { user } = route.params;
  console.log('user', user);
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
  async function putInitialTaks() {
    await axios
      .put(`http://${api}/user/update-preferred-tasks`, {
        username: user.username,
        preferredTasks: checkedState,
      })
      .then(r => {
        setTaskVisible(false);
        console.log('HELLLOSEKFNKJSDNFLKDSNKLDSNFK');
      })
      .catch(error => {
        console.log('Error', error);
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
          <Text variant="bodyMedium">What type of task would you like to do?</Text>
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
    <View>
      <Portal>
        {welcome()}
        {taskType()}
      </Portal>
    </View>
  );
}
