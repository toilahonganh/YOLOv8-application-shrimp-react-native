/* Details checking on history */
import React, { useState, useEffect } from "react";
import { Image } from "react-native";
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import {
  AspectRatio,
  Spinner,
  Icon,
  HStack,
  Text,
  Pressable,
  Actionsheet,
  useDisclose,
  Center,
  Box,
  ScrollView,
} from "native-base";
import { urlServer } from "../constants/conn.js";

const HistoryScreen = ({ route }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const placeholderImage = require("../assets/splash.png");

  const { shrimp_image, c_time, shrimp_kind } = route.params.data;

  const shrimpArray = shrimp_kind.split(", ");

  // Tạo một đối tượng từ các cặp key-value
  const shrimpObject = {};
  shrimpArray.forEach(item => {
    const [key, value] = item.split(": ");
    shrimpObject[key] = parseInt(value);
  });

  // Tính tổng số tôm
  const totalShrimp = Object.values(shrimpObject).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const formatted_time = formatDate(new Date(c_time));
  useEffect(() => {
    if (loading) {
      const delay = 1500;
      const timer = setTimeout(() => {
        setLoading(false);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const [shrimpDetails, setShrimpDetails] = useState([]);

  useEffect(() => {
    const fetchShrimpDetails = async (shrimp_image, c_time, shrimp_kind) => {
      try {
        const data = {
          shrimp_image: shrimp_image,
          c_time: c_time,
          shrimp_kind: shrimp_kind
        };

        const response = await axios.post(
          urlServer + "/get_details",
          data
        );

        setShrimpDetails(response.data.history_details);
      } catch (error) {
        // Xử lý lỗi khi fetch chi tiết về loại côn trùng
      }
    };

    fetchShrimpDetails(shrimp_image, c_time, shrimp_kind);
  }, [shrimp_image, c_time, shrimp_kind]);

  const urlImage = urlServer + `/getimage/${shrimp_image}`;

  const saveImage = async () => {
    const uri = urlImage;

    try {
      const imgExt = uri.split(".").pop();
      const downloadResult = await FileSystem.downloadAsync(
        uri,
        FileSystem.documentDirectory + "image." + imgExt
      );

      if (downloadResult && downloadResult.uri) {
        const localUri = downloadResult.uri;
        const asset = await MediaLibrary.createAssetAsync(localUri);
        await MediaLibrary.createAlbumAsync("Shrimp", asset, false);
      } else {
        // Xử lý khi download không thành công
      }
    } catch (error) {
      // Xử lý lỗi khi tải ảnh về thiết bị
    }
  };


  const shrimp_kind_json = JSON.parse(shrimp_kind);
  const shrimp_kind_str = Object.entries(shrimp_kind_json).map(([key, value]) => `${key}: ${value}`).join(', ');

  const [selected, setSelected] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclose();


  return (
    <SafeAreaProvider>
      {/* Phần hiển thị ảnh */}
      {loading ? (
        <HStack flex={1} justifyContent="center">
          <Spinner size="lg" />
        </HStack>
      ) : (
        <Box>
          {shrimp_image && shrimp_image.length !== 0 ? (
            <AspectRatio
              ratio={{
                base: 3 / 4,
                md: 9 / 10,
              }}
            >
              <Image
                source={{ uri: urlServer + `/getimage/${shrimp_image}` }}
                resizeMode="contain"
                alt="Ảnh tải lên"
              />
            </AspectRatio>

          ) : (
            <AspectRatio
              ratio={{
                base: 3 / 4,
                md: 9 / 10,
              }}
            >
              <Image
                source={placeholderImage}
                resizeMode="contain"
                alt="Ảnh mặc định"
              />
            </AspectRatio>
          )}
          <Box px={4} mt={Platform.OS === 'ios' ? 0 : 20}>
            <Box my={2}>
              <Text bold color="blue.600" fontSize="lg">
                Dentification information
              </Text>

              <Box flexDirection="row" flexWrap="wrap">
                <Text bold color="#003060" mt="5" fontSize={Platform.OS === 'ios' ? "xs" : "sm"} inline numberOfLines={1}>Identification result: </Text>
                <Text color="#003060" mt="5" fontSize={Platform.OS === 'ios' ? "xs" : "sm"} inline numberOfLines={1}>{shrimp_kind_str}</Text>
              </Box>

              <Box flexDirection="row">
                <Text bold color="#003060" mt="5" fontSize={Platform.OS === 'ios' ? "xs" : "sm"} inline>Total quantity: </Text>
                <Text color="#003060" mt="5" fontSize={Platform.OS === 'ios' ? "xs" : "sm"} inline>{totalShrimp}</Text>
              </Box>

              <Box flexDirection="row">
                <Text bold color="#003060" mt="5" fontSize={Platform.OS === 'ios' ? "xs" : "sm"} inline>Recognition time: </Text>
                <Text color="#003060" mt="5" fontSize={Platform.OS === 'ios' ? "xs" : "sm"} inline>{formatted_time}</Text>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* Phần nút điều hướng và chức năng */}
      <Box
        position="absolute"
        bottom="0"
        alignItems="stretch"
        width="100%"
        alignSelf="center"
      >
        <HStack bg="#003060" alignItems="center" safeAreaBottom shadow={6}>
          {/* Nút Trở về */}
          <Pressable
            cursor="pointer"
            opacity={selected === 1 ? 1 : 0.5}
            py="2"
            flex={1}
            onPress={() => {
              setSelected(1);
              navigation.navigate("Activity");
            }}
          >
            <Center>
              <Icon
                mb="1"
                as={<Ionicons name="refresh-circle" size={24} color="black" />}
                color="white"
                size="lg"
              />
              <Text color="white" fontSize="xs">
                Back
              </Text>
            </Center>
          </Pressable>

          {/* Nút Tải về */}
          <Pressable
            cursor="pointer"
            opacity={selected === 0 ? 1 : 0.5}
            py="3"
            flex={1}
            onPress={() => {
              setSelected(0);
              saveImage();
            }}
          >
            <Center>
              <Icon
                mb="1"
                as={<Ionicons name="cloud-download" size={24} color="black" />}
                color="white"
                size="lg"
              />
              <Text color="white" fontSize="xs">
                Download
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

export default HistoryScreen;
