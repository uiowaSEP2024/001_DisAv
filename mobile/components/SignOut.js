import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSession } from '../context/SessionContext';

const SignOut = () => {
  const navigation = useNavigation();
  const { logout } = useSession();
  const [modalVisible, setModalVisible] = React.useState(false);

  async function logoutUser() {
    await logout();
    navigation.navigate('Auth');
  }

  return (
    <View style={styles.container} testID="SignOut">
      <TouchableOpacity onPress={logoutUser} style={styles.button}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Are you sure you want to sign out?</Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonConfirm]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  logoutUser();
                }}
              >
                <Text testID="SignOutButton" style={styles.textStyle}>
                  Sign Out
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SignOut;
