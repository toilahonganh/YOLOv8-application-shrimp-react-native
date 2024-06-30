/* Get Image To Detection */
import axios from "axios";
import React, { useState } from "react";
import { Platform } from 'react-native';
import { Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Camera, CameraType } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  AspectRatio,
  Spinner,
  HStack,
  Icon,
  Text,
  View,
  Pressable,
  Actionsheet,
  useDisclose,
  Center,
  Box,
} from "native-base";
// import { Video } from 'expo-av';
import { urlServer } from "../constants/conn.js";

const GetImageScreen = () => {
  // State cho loại camera, quyền camera, trạng thái loading và ảnh đã chọn
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [type, setType] = useState(CameraType.back);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);

  // Ảnh mặc định khi không có ảnh được chọn
  const placeholderImage = require("../assets/image.png");

  // Sử dụng hook để điều hướng và mở/closed Actionsheet
  const navigation = useNavigation();
  const { isOpen, onOpen, onClose } = useDisclose();

  // Hàm để đặt ảnh thành null
  const setEmptyImage = () => {
    setImage(null);
  };

  // Sử dụng hook để xử lý việc component focus
  useFocusEffect(
    React.useCallback(() => {
      setEmptyImage();
      setLoading(false);
    }, [])
  );

  // Hàm chọn ảnh từ thư viện
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };
  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setVideo(result.assets[0]);
    }
  };

  // Hàm chụp ảnh từ camera
  const takeImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  // Hàm upload ảnh lên server
  const uploadImage = async () => {
    if (image !== null && image.uri !== null) {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", {
        uri: image.uri,
        type: "image/*",
        name: "image.jpg",
      });

      try {
        const response = await axios.post(urlServer + "/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        navigation.navigate("Result", { data: response.data });
      } catch (error) {
        // Xử lý lỗi nếu có
      }
    } else if (video !== null && video.uri !== null) {
      setLoading(true);
      const formData = new FormData();
      formData.append("video", {
        uri: video.uri,
        type: "video/*",
        name: "video.mp4",
      });
      try {
        const response = await axios.post(urlServer + "/upload-video", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        navigation.navigate("Result", { data: response.data });
      } catch (error) {
        // Xử lý lỗi nếu có
      }
    }
    else {
      Alert.alert("Notification", "Please select the file to recognize!");
    }
  };

  // State cho nút được chọn
  const [selected, setSelected] = React.useState(1);

  return (
    <SafeAreaProvider>
      {loading ? (
        <HStack flex={1} justifyContent="center">
          <Spinner size="lg" />
        </HStack>
      ) : (
        <View style={{ flex: 1, backgroundColor: '#f6f6f6', marginTop: 0 }}>
          {image !== null && image.uri !== null ? (
            <AspectRatio
              ratio={{
                base: 3 / 4,
                md: 9 / 10,
              }}
            >
              <Image
                source={{ uri: image.uri }}
                resizeMode="contain"
                alt="Uploaded image"
              />
            </AspectRatio>
          ) : (
            <View style={{ flex: 1, marginTop: 0 }}>
              {video !== null && video.uri !== null ? (
                <AspectRatio
                  ratio={{
                    base: 3 / 4,
                    md: 9 / 10,
                  }}
                >
                  <Video
                    source={{ uri: video.uri }}
                    resizeMode="contain"
                    shouldPlay
                    isLooping
                    isMuted
                    style={{ width: '100%', height: '100%' }}
                  />
                </AspectRatio>
              ) : (
                <View style={{ flex: 1, marginTop: 280 }}>
                  <AspectRatio
                    ratio={{
                      base: 3 / 4,
                      md: 9 / 10,
                    }}
                  >
                    <Image
                      style={{ width: 100, height: 200 }}
                      marginTop={0}
                      source={placeholderImage}
                      resizeMode="contain"
                      alt="Default image"
                    />
                  </AspectRatio>
                </View>
              )}
            </View>
          )}
        </View>
      )}

      {/* Actionsheet cho việc chọn ảnh từ thư viện hoặc máy ảnh */}
      <Actionsheet isOpen={isOpen} onClose={onClose} size="full">
        <Actionsheet.Item onPress={pickImage} color="muted.500">
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="phone-portrait-outline" size={24} color="black" />
            <Text style={{ marginLeft: 10 }}>Open image from device</Text>
          </View>
        </Actionsheet.Item>

        <Actionsheet.Item onPress={() => {
          requestPermission();
          takeImage();
        }}
          color="muted.500"
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="camera-outline" size={24} color="black" />
            <Text style={{ marginLeft: 10 }}>Open camera</Text>
          </View>
        </Actionsheet.Item>
      </Actionsheet>

      {/* Thanh điều hướng */}
      <Box
        position="absolute"
        bottom="0"
        alignItems="stretch"
        width="100%"
        alignSelf="center"
      >
        <HStack bg="#192eab" alignItems="center" safeAreaBottom shadow={6}>
          {/* Nút Hoạt động */}
          <Pressable
            cursor="pointer"
            opacity={selected === 0 ? 1 : 0.5}
            py={Platform.OS === 'ios' ? 0 : 3}
            flex={1}
            onPress={() => {
              setSelected(0);
              navigation.navigate("Activity");
            }}
          >
            <Center>
              <Icon
                mb="1"
                as={<Ionicons name="notifications" size={24} color="black" />}
                color="white"
                size="lg"
              />
              <Text color="white" fontSize="xs">
                History
              </Text>
            </Center>
          </Pressable>

          {/* Nút Mở ảnh */}
          <Pressable
            cursor="pointer"
            opacity={selected === 1 ? 1 : 0.5}
            py="2"
            flex={1}
            onPress={() => {
              setSelected(1);
              onOpen();
            }}
          >
            <Center>
              <Icon
                mb="1"
                as={<Ionicons name="camera" size={24} color="black" />}
                color="white"
                size="lg"
              />
              <Text color="white" fontSize="xs">
                Camera
              </Text>
            </Center>
          </Pressable>

          {/* Nút Nhận dạng */}
          <Pressable
            cursor="pointer"
            opacity={selected === 3 ? 1 : 0.5}
            py="2"
            flex={1}
            onPress={() => {
              setSelected(3);
              uploadImage();
            }}
          >
            <Center>
              <Icon
                mb="1"
                as={<Ionicons name="navigate" size={24} color="black" />}
                color="white"
                size="lg"
              />
              <Text color="white" fontSize="xs">
                Recognition
              </Text>
            </Center>
          </Pressable>

          {/* Nút Tài khoản */}
          <Pressable
            cursor="pointer"
            opacity={selected === 2 ? 1 : 0.5}
            py="2"
            flex={1}
            onPress={() => {
              setSelected(2);
              navigation.navigate("Logout");
            }}
          >
            <Center>
              <Icon
                mb="1"
                as={<Ionicons name="person" size={24} color="black" />}
                color="white"
                size="lg"
              />
              <Text color="white" fontSize="xs">
                Account
              </Text>
            </Center>
          </Pressable>
        </HStack>
      </Box>

    </SafeAreaProvider>
  );
};

export default GetImageScreen;
