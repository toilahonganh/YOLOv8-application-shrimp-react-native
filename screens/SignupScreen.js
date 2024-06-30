import React, { useState } from "react";
import { Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from "@react-navigation/native";
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
} from "native-base";
import { urlServer } from "../constants/conn.js";

const SignupScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  

  const handleSignup = () => {
    // Kiểm tra xem username, email và password có được nhập hay không
    if (!username || !email || !password) {
      // Nếu thiếu thông tin, hiển thị cảnh báo
      Alert.alert(
        "Thông báo",
        "Vui lòng điền đầy đủ thông tin cần thiết cho đăng ký!"
      );
      return;
    }

    // Kiểm tra xem mật khẩu xác nhận có khớp với mật khẩu hay không
    if (password !== confirmPassword) {
      Alert.alert("Notice", "Password doesn'match!");
      return;
    }

    // Tạo một đối tượng chứa thông tin đăng ký
    const signupData = {
      username: username,
      email: email,
      password: password,
    };

    // Gửi yêu cầu POST đến máy chủ Flask bằng Axios
    axios
      .post(urlServer + "/register-mobile", signupData)
      .then((response) => {
        // Xử lý phản hồi từ máy chủ
        const data = response.data;

        if (data.success) {
          // Nếu đăng ký thành công, chuyển hướng đến màn hình đăng nhập
          navigation.navigate("Login");

          // Hiển thị cảnh báo thông báo thành công
          Alert.alert("Notification", "Registration successful!");
        } else {
          // Nếu đăng ký không thành công, hiển thị thông báo lỗi từ máy chủ
          Alert.alert("Notification", "Registration failed! " + data.message);
        }
      })
      .catch((error) => {
        // Xử lý lỗi nếu có lỗi khi gửi yêu cầu đăng ký
      });
  };

  const [show, setShow] = React.useState(false);
  return (
    <SafeAreaProvider>
      <Center flex={1} px="3">
        <Stack space={4} w="100%" alignItems="center">
          {/* Hiển thị hình ảnh */}
          <Center>
            <Image
                size="10"
                source={require("../assets/logo1.png")}
                alt="Alternate Text"
                w={250}
                marginBottom={2}
              />
          </Center>

          {/* Ô nhập thông tin tài khoản */}
          <Input
            w={{
              base: "75%",
              md: "25%",
            }}
            InputLeftElement={
              <Icon
                as={<MaterialIcons name="person" />}
                size={5}
                ml="2"
                color="muted.400"
              />
            }
            placeholder="Username"
            onChangeText={(text) => setUsername(text)}
          />

          {/* Ô nhập thông tin email */}
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
                  as={
                    <MaterialIcons
                      name={show ? "visibility" : "visibility-off"}
                    />
                  }
                  size={5}
                  mr="2"
                  color="muted.400"
                />
              </Pressable>
            }
            placeholder="Password"
            onChangeText={(text) => setPassword(text)}
          />

          {/* Ô nhập để xác nhận lại mật khẩu */}
          <Input
            w={{
              base: "75%",
              md: "25%",
            }}
            type={show ? "text" : "password"}
            InputRightElement={
              <Pressable onPress={() => setShow(!show)}>
                <Icon
                  as={
                    <MaterialIcons
                      name={show ? "visibility" : "visibility-off"}
                    />
                  }
                  size={5}
                  mr="2"
                  color="muted.400"
                />
              </Pressable>
            }
            placeholder="Confirm password"
            onChangeText={(text) => setConfirmPassword(text)}
          />

          {/* Nút để kích hoạt hàm xử lý đăng ký */}
          <Button
            w={{
              base: "75%",
              md: "25%",
            }}
            backgroundColor="#192eab"
            size={"xs"}
            onPress={handleSignup}
          >
            REGISTER
          </Button>

          {/* Liên kết để chuyển đến màn hình đăng nhập */}
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
                  color: "#003060",
                },
                color: "#003060",
              },
            }}
            onPress={() => navigation.navigate("Login")}
          >
            Do you already have an account?
          </Link>
        </Stack>
      </Center>
    </SafeAreaProvider>
  );
};

export default SignupScreen;
