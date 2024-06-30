import React, { useState, useEffect } from 'react';
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HStack } from "native-base";
import { View, TextInput, Button, StyleSheet, Alert, Text, Pressable } from 'react-native';
import axios from 'axios';
import { urlServer } from '../constants/conn.js';

const Settings = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [password, setPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${urlServer}/get_user`);
        if (response.data.user && response.data.user !== null) {
          setUserData(response.data.user);
          setNewUsername(response.data.user.username);
          setNewEmail(response.data.user.email);
        } else {
          Alert.alert('Notification', 'No user data found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'An error occurred while fetching user data.');
      }
    };

    fetchUserData();
  }, []);

  const handleChangeUserInfo = async () => {
    try {
      const response = await axios.post(`${urlServer}/change_password_mobile`, {
        email: userData.email,
        oldPassword: password,
        newPassword: newPassword,
        newUsername: newUsername
      });

      if (response.data.success) {
        Alert.alert('Notification', 'User information updated successfully!');
      } else {
        Alert.alert('Notification', 'Failed to update user information.');
      }
    } catch (error) {
      console.error('Error updating user information:', error);
      Alert.alert('Error', 'An error occurred while updating user information.');
    }
  };

  const navigateToChangePassword = () => {
    navigation.navigate("Logout");
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {userData ? (
          <View>
          <Text style={{fontSize: 24, textAlign: 'center', marginBottom: 10}}>Settings</Text>
            <Text style={styles.title}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={newUsername}
              onChangeText={setNewUsername}
            />
            <Text style={styles.title}>Gmail</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={userData.email}
              editable={false} 
            />
            <Text style={styles.title}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={text => setPassword(text)}
            />
            <Text style={styles.title}>New password</Text>
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={text => setNewPassword(text)}
            />
            <HStack space={4} my="5%">
              <Pressable style={[styles.button, styles.buttonBack]} onPress={navigateToChangePassword}>
                <Text style={styles.buttonText}>Back</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.buttonSave]} onPress={handleChangeUserInfo}>
                <Text style={styles.buttonText}>Save Changes</Text>
              </Pressable>
            </HStack>
          </View>
        ) : (
          <Text style={styles.text}>No user data</Text>
        )}
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    width: 320,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 12,
    fontWeight: '200'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonBack: {
    backgroundColor: '#192eab',
  },
  buttonSave: {
    backgroundColor: '#00b300',
  },
});

export default Settings;
