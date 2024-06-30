import React, { useState } from "react";
import { Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import axios from "axios";
import {
  Input,
  Icon,
  Stack,
  Pressable,
  Link,
  Button,
  Image,
  Center,
  Spacer,
} from "native-base";
import { urlServer } from "../constants/conn.js";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);


  const handleLogin = async () => {
    try {
      const response = await axios.post(`${urlServer}/login-mobile`, {
        email: email,
        password: password,
      });
      const userData = response.data;

      // Kiểm tra xem có lỗi khi đăng nhập không
      if (userData.success) {
        // Lưu thông tin người dùng vào bộ nhớ cục bộ (local storage) hoặc AsyncStorage
        await AsyncStorage.setItem('userData', JSON.stringify(userData));

        // Chuyển hướng đến màn hình sau khi đăng nhập thành công
        navigation.navigate("GetImage");
        Alert.alert("Notification", "Login successful!");
      } else {
        // Xử lý lỗi khi đăng nhập không thành công
        Alert.alert("Notification", userData.message);
      }
    } catch (error) {
      // Xử lý lỗi khi đăng nhập không thành công
      console.error("Login Error:", error);
      Alert.alert("Error", "An error occurred while logging in.");
    }
  };

  return (
    <SafeAreaProvider>
      <Center flex={1} px="3">
        <Stack space={4} w="100%" alignItems="center">
          {/* Logo hoặc hình ảnh đại diện của ứng dụng */}
          <Center>
            <Image
              size="10"
              source={require("../assets/logo1.png")}
              alt="Alternate Text"
              w={250}
              marginBottom={2}
            />
          </Center>
          {/* Ô nhập tài khoản */}
          <Input
            w={{
              base: "75%",
              md: "25%",
            }}
            InputLeftElement={
              <Icon
                as={<MaterialIcons name="email" />}
                size={5}
                ml="2"
                color="muted.400"
              />
            }
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
          />

          {/* Ô nhập mật khẩu */}
          <Input
            w={{
              base: "75%",
              md: "25%",
            }}
            type={show ? "text" : "password"}
            InputRightElement={
              <Pressable onPress={() => setShow(!show)}>
                <Icon
                  as={<MaterialIcons name="visibility" />}
                  size={5}
                  mr="2"
                  color="muted.400"
                />
              </Pressable>
            }
            placeholder="Password"
            onChangeText={(text) => setPassword(text)}
          />

          {/* Nút đăng nhập */}
          <Button
            w={{
              base: "75%",
              md: "25%",
            }}
            backgroundColor="#192eab"
            size="xs"
            onPress={handleLogin}
          >
            LOG IN
          </Button>

          {/* Đường dẫn đến màn hình đăng ký nếu người dùng chưa có tài khoản */}
          <Link
            _text={{
              fontSize: "xs",
              _light: {
                color: "#003060",
              },
              color: "#003060",
            }}
            isUnderlined
            _hover={{
              _text: {
                _light: {
                  color: "cyan.600",
                },
                color: "cyan.400",
              },
            }}
            onPress={() => navigation.navigate("Signup")}
          >
            Don't have an account yet?
          </Link>
        </Stack>
      </Center>
    </SafeAreaProvider>
  );
};

export default LoginScreen;
