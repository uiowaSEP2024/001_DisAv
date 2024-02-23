import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Checkbox, Button, Text, TextInput } from 'react-native-paper';
import CustomAlert from '../components/CustomAlert';
import { useSession } from '../context/SessionContext';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { api } from '../config/Api';
import { width, height } from '../config/DeviceDimensions';

export default function Preferences({ navigation }) {
  const { user, saveUser } = useSession();

  if (!user) {
    return null;
  }

  const [preferredTasks, setPreferredTasks] = useState(
    user.preferredTasks || {
      Work: false,
      Reading: false,
      Exercise: false,
      Break: false,
    }
  );

  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [workDescriptionShown, setWorkDescriptionShown] = useState(false);

  const [showTaskFrequency, setShowTaskFrequency] = useState(false);
  const [taskFrequencyHours, setTaskFrequencyHours] = useState(0);
  const [taskFrequencyMinutes, setTaskFrequencyMinutes] = useState(0);
  const [workDescription, setWorkDescription] = useState('');

  console.log('showTaskFrequency', showTaskFrequency);

  const handleSelectTask = task => {
    console.log('task', task);
    setPreferredTasks(prevTasks => ({
      ...prevTasks,
      [task]: !prevTasks[task],
    }));
    if (task === 'work') {
      setWorkDescriptionShown(!workDescriptionShown);
    }
  };

  const handleShowingTaskFrequency = () => {
    // check if any task is selected
    console.log('preferredTasks', preferredTasks);
    if (Object.values(preferredTasks).some(value => value)) {
      setShowTaskFrequency(true);
    } else {
      setErrorMessage('Please select at least one task');
      setErrorVisible(true);
    }
  };

  const handleSubmit = async () => {
    // Convert task frequency to milliseconds
    const taskFrequencyInMs =
      taskFrequencyHours * 60 * 60 * 1000 + taskFrequencyMinutes * 60 * 1000;
    // check to see if the user has selected a task and a task frequency is greater than 0
    if (Object.values(preferredTasks).every(value => !value) || taskFrequencyInMs === 0) {
      setErrorMessage('Please select a task and a task frequency');
      setErrorVisible(true);
      console.log('error');
      return;
    }
    try {
      const response = await axios.put(`http://${api}/user/update`, {
        user: { ...user, preferredTasks, taskFrequency: taskFrequencyInMs },
      });
      console.log('response', response);
      if (response.data) {
        await saveUser({ ...user, preferredTasks, taskFrequency: taskFrequencyInMs });
      }
    } catch (error) {
      setErrorMessage(error.message);
      setErrorVisible(true);
      return;
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>What are your preferred tasks?</Text>
        {/* Your existing task selection UI here */}
        {Object.keys(preferredTasks).map(task => (
          <Checkbox.Item
            key={task}
            label={task}
            style={styles.checkBoxItem}
            status={preferredTasks[task] ? 'checked' : 'unchecked'}
            onPress={() => handleSelectTask(task)}
            testID={`${task.toLowerCase()}-checkbox`}
          />
        ))}
        {!showTaskFrequency && (
          <Button
            mode="contained"
            testID="next-button"
            onPress={() => handleShowingTaskFrequency()}
            style={styles.submitButton}
          >
            Next
          </Button>
        )}
        {showTaskFrequency && workDescriptionShown && (
          <View>
            <Text>What kind of work do you do? (be as descriptive as possible)</Text>
            <TextInput
              testID="work-description-input"
              style={styles.input}
              onChangeText={setWorkDescription}
              value={workDescription}
              placeholder="Describe your work"
              multiline
              numberOfLines={3} // Adjust based on your preference
            />
          </View>
        )}
        {showTaskFrequency && (
          <>
            <Text style={styles.frequencyTitle}>How often do you want a task to be triggered?</Text>
            <View style={styles.frequencyContainer}>
              {/* Task frequency selection UI */}
              <Picker
                testID="hours-picker"
                style={styles.picker}
                selectedValue={taskFrequencyHours.toString()}
                onValueChange={itemValue => setTaskFrequencyHours(parseInt(itemValue, 10))}
              >
                {[...Array(24).keys()].map(hour => (
                  <Picker.Item key={hour} label={`${hour} hr`} value={hour.toString()} />
                ))}
              </Picker>
              <Picker
                testID="minutes-picker"
                style={styles.picker}
                selectedValue={taskFrequencyMinutes.toString()}
                onValueChange={itemValue => setTaskFrequencyMinutes(parseInt(itemValue, 10))}
              >
                {[...Array(60).keys()].map(minute => (
                  <Picker.Item key={minute} label={`${minute} min`} value={minute.toString()} />
                ))}
              </Picker>
            </View>
            <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
              Submit
            </Button>
          </>
        )}
        <CustomAlert
          visible={errorVisible}
          onClose={() => setErrorVisible(false)}
          message={errorMessage}
        />
      </ScrollView>
    </View>
  );
}

// Add your StyleSheet here

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  submitButton: {
    marginTop: 20,
    width: width * 0.2,
  },
  input: {
    height: height * 0.1,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    scrollEnabled: true,
    backgroundColor: 'white',
  },
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: 'black',
    marginBottom: 20,
  },
  checkBoxItem: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    width: width * 0.2,
    borderColor: 'black',
    borderWidth: 1,
  },
  frequencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  frequencyTitle: {
    fontSize: 20,
    color: 'black',
    marginRight: 10,
  },
  picker: {
    width: width * 0.18,
    height: height * 0.5,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 10,
    marginTop: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
});
