/* Result */
import React from "react";
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Image } from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";
import {
  AspectRatio,
  Alert,
  Icon,
  Link,
  VStack,
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

const ResultScreen = ({ navigation, route }) => {
  const placeholderImage = require("../assets/image.png");

  if (!route.params.data || !route.params.data[0] || route.params.data[0].shrimp_kind === "") {
    return (
      <Center flex="3">
        <Alert mt="6%" ml="2%" mr="2%" mb="2%" w="96%" status="error">
          <VStack space={2} flexShrink={1} w="100%">
            <HStack
              flexShrink={1}
              space={1}
              alignItems="center"
              justifyContent="space-between"
            >
              <HStack space={2} flexShrink={1} alignItems="center">
                <Alert.Icon />
                <Text
                  fontSize="md"
                  fontWeight="medium"
                  _dark={{
                    color: "#003060",
                  }}
                >
                  Detection failed!
                </Text>
              </HStack>
            </HStack>
          </VStack>
        </Alert>

        <Alert margin="2%" w="96%" status="info" colorScheme="info">
          <VStack space={2} flexShrink={1} w="100%">
            <HStack
              flexShrink={1}
              space={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <HStack flexShrink={1} space={2} alignItems="center">
                <Alert.Icon />
                <Text fontSize="md" fontWeight="medium" color="coolGray.800">
                  Notice!
                </Text>
              </HStack>
            </HStack>
            <Box
              pl="6"
              _text={{
                color: "coolGray.600",
              }}
            >
              <Text>
                Please ensure internet connection, and accurate capture of the object for best detection results.
              </Text>
            </Box>
          </VStack>
        </Alert>

        <Center marginTop="2%" marginBottom="5%">
          <Link
            _text={{
              fontSize: "md",
              _light: {
                color: "cyan.500",
              },
              color: "cyan.300",
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
            onPress={() => navigation.navigate("GetImage")}
          >
            Try again?
          </Link>
        </Center>
      </Center>
    );
  } else {
    const imagePath = route.params.data[0].shrimp_image;
    const urlImage = urlServer + `/getimage/${imagePath}`;

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
          // Handle download failure
          Alert.alert("Download Failed", "Failed to download the image.");
        }
      } catch (error) {
        // Handle error
        Alert.alert("Error", "An error occurred while downloading the image.");
      }
    };

    const [selected, setSelected] = React.useState(1);
    const { isOpen, onOpen, onClose } = useDisclose();

    const shrimpKind = route.params.data[0].shrimp_kind;
    const shrimpTotal = route.params.data[0].shrimp_total;
    const C_time = route.params.data[0].c_time;

    return (
      <SafeAreaProvider>
        <Box>
          {urlImage !== null ? (
            <AspectRatio
              ratio={{
                base: 3 / 4,
                md: 9 / 10,
              }}
            >
              <Image
                source={{ uri: urlImage }}
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
                <Text color="#003060" mt="5" fontSize={Platform.OS === 'ios' ? "xs" : "sm"} inline numberOfLines={1}>{shrimpKind}</Text>
              </Box>

              <Box flexDirection="row">
                <Text bold color="#003060" mt="5" fontSize={Platform.OS === 'ios' ? "xs" : "sm"} inline>Total quantity: </Text>
                <Text color="#003060" mt="5" fontSize={Platform.OS === 'ios' ? "xs" : "sm"} inline>{shrimpTotal}</Text>
              </Box>

              <Box flexDirection="row">
                <Text bold color="#003060" mt="5" fontSize={Platform.OS === 'ios' ? "xs" : "sm"} inline>Recognition time: </Text>
                <Text color="#003060" mt="5" fontSize={Platform.OS === 'ios' ? "xs" : "sm"} inline>{C_time}</Text>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          position="absolute"
          bottom="0"
          alignItems="stretch"
          width="100%"
          alignSelf="center"
        >
          <HStack bg="#003060" alignItems="center" safeAreaBottom shadow={6}>
            <Pressable
              cursor="pointer"
              opacity={selected === 1 ? 1 : 0.5}
              py="2"
              flex={1}
              onPress={() => {
                setSelected(1);
                navigation.navigate("GetImage");
              }}
            >
              <Center>
                <Icon
                  mb="1"
                  as={
                    <Ionicons name="refresh-circle" size={24} color="black" />
                  }
                  color="white"
                  size="lg"
                />
                <Text color="white" fontSize="xs">
                  Back
                </Text>
              </Center>
            </Pressable>

            <Pressable
              cursor="pointer"
              opacity={selected === 0 ? 1 : 0.5}
              py="3"
              flex={1}
              onPress={() => {
                setSelected(0);
                saveImage(urlImage);
              }}
            >
              <Center>
                <Icon
                  mb="1"
                  as={
                    <Ionicons name="cloud-download" size={24} color="black" />
                  }
                  color="white"
                  size="lg"
                />
                <Text color="white" fontSize="xs">
                  Download
                </Text>
              </Center>
            </Pressable>

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

        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content
            _dragIndicator={{
              bg: "blue.500",
            }}
          >
            <Text
              mb="3%"
              bold
              fontSize="16"
              color="#003060"
              _dark={{
                color: "#00407a",
              }}
            >
              Thông tin nhận dạng
            </Text>
          </Actionsheet.Content>
        </Actionsheet>
      </SafeAreaProvider>
    );
  }
};

export default ResultScreen;
