import React, { useState, useEffect } from "react";
import { Platform } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Image, Alert } from "react-native";
import axios from "axios";
import { Stack, Text, Button, Heading, Center, View, Avatar, HStack, Pressable } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { urlServer } from "../constants/conn.js";

const UserScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);

  const navigateToChangePassword = () => {
    navigation.navigate("Settings"); 
  };

  // Hàm lấy thông tin người dùng từ máy chủ
  const fetchUserData = async () => {
    try {
      // Gửi yêu cầu GET để lấy thông tin người dùng từ máy chủ
      const response = await axios.get(urlServer + "/get_user");

      // Kiểm tra nếu có dữ liệu người dùng, lưu vào state
      if (response.data.user && response.data.user !== null) {
        // Lưu thông tin người dùng vào state
        setUserData(response.data.user);
      } else {
        // Xử lý trường hợp không có dữ liệu người dùng
      }
    } catch (error) {
      // Xử lý lỗi khi gửi yêu cầu
    }
  };

  // Sử dụng useEffect để gọi hàm fetchUserData khi component được tạo
  useEffect(() => {
    fetchUserData();
  }, []);

  // Hàm đăng xuất và hủy token
  const logoutAndInvalidateToken = async () => {
    try {
      // Lấy token từ AsyncStorage
      const userToken = await AsyncStorage.getItem("userToken");

      // Lấy tất cả keys từ AsyncStorage và xóa chúng
      const allKeys = await AsyncStorage.getAllKeys();
      await Promise.all(allKeys.map((key) => AsyncStorage.removeItem(key)));

      // Gửi yêu cầu POST để hủy token trên máy chủ
      // Gửi thông tin username để hủy session tương ứng trên server
      const response = await axios.post(urlServer + "/invalidate-token", {
        token: userToken,
        username: userData.username,
      });

      // Xóa token từ AsyncStorage
      await AsyncStorage.removeItem("userToken");

      // Thực hiện các hành động khác sau khi đăng xuất
      navigation.navigate("Login");
      Alert.alert("Notification", "Logout successful!");
    } catch (error) {
      // Xử lý lỗi khi đăng xuất
    }
  };

  // Trả về giao diện người dùng với thông tin người dùng và nút đăng xuất
  return (
    <SafeAreaProvider>
      <Center flex={1} px="3">
        {/* Kiểm tra xem có thông tin người dùng hay không */}
        {userData ? (
          // Hiển thị thông tin người dùng nếu có
          <Stack alignItems="center" w="100%">
            <Pressable onPress={() => navigation.navigate("GetImage")} style={{ position: 'absolute', bottom: 190, left: 0, zIndex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="arrow-back" size={20} color="black" />
              <Text style={{ marginLeft: 5, fontSize: 20 }}>Back</Text>
            </Pressable>
            <Avatar source={{ uri: userData.avatar }} size="xl" />
            <Heading my="2%" size={Platform.OS === 'ios' ? "sm" : "md"} color="#192eab">
              Welcome! {userData.username}
            </Heading>
            <Text>
              <Text style={{ fontWeight: 'bold' }} fontSize={Platform.OS === 'ios' ? "xs" : "sm"}>Email:</Text> {userData.email}
            </Text>
          </Stack>
        ) : (
          <Text>No user data</Text>
        )}

        {/* Hàng chứa hai nút */}
        <HStack space={4} my="5%">
          <Button size={Platform.OS === 'ios' ? "xs" : "xs"} onPress={navigateToChangePassword} backgroundColor="#192eab">
            SETTINGS
          </Button>
          {/* Nút đăng xuất */}
          <Button size={Platform.OS === 'ios' ? "xs" : "xs"} onPress={logoutAndInvalidateToken} backgroundColor="#192eab">
            LOG OUT
          </Button>
          {/* Nút thay đổi mật khẩu */}
          
        </HStack>

        {/* Phần giới thiệu về dự án */}
        <View style={{ marginTop: 20 }}>
          <Text fontSize={Platform.OS === 'ios' ? "sm" : "sm"} fontWeight="bold" mb="4">About Our Project</Text>
          <Text fontSize={Platform.OS === 'ios' ? "xs" : "sm"} textAlign="justify">
            Welcome to our project! We are a team of dedicated students passionate about computer vision and its applications. Our project focuses on the implementation of YOLOv8, a state-of-the-art object detection algorithm, to identify, classify, and count the number of shrimp on conveyor belts.
          </Text>
          <Text fontSize={Platform.OS === 'ios' ? "xs" : "sm"} textAlign="justify" mt="4">
            Through our research and development efforts, we aim to streamline shrimp processing operations by automating the detection and counting process. By leveraging YOLOv8's capabilities, we can achieve accurate and efficient results, ultimately improving productivity and efficiency in shrimp processing facilities.
          </Text>
          <Text fontSize={Platform.OS === 'ios' ? "xs" : "sm"} textAlign="justify" mt="4">
            Join us on this journey as we explore the exciting possibilities of computer vision technology in the seafood industry!
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            <Image source={require('../assets/shrimp3.jpg')} style={{ width: 120, height: 180, resizeMode: 'contain' }} />
            <Image source={require('../assets/shrimp1.jpg')} style={{ width: 120, height: 180}} />
            <Image source={require('../assets/shrimp2.jpg')} style={{ width: 120, height:180, resizeMode: 'contain'}} />

          </View>
        </View>
      </Center>
    </SafeAreaProvider>
  );
};

export default UserScreen;
