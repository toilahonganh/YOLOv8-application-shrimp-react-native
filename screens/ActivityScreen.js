/* History scroll view */
import axios from "axios";
import { Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  AspectRatio,
  Spinner,
  Icon,
  useDisclose,
  Heading,
  VStack,
  View,
  Stack,
  HStack,
  Box,
  Pressable,
  Text,
  Button,
  ScrollView,
  Center,
} from "native-base";
import { urlServer } from "../constants/conn.js";
import { PieChart } from "react-native-chart-kit";

const ActivityScreen = () => {
  const navigation = useNavigation();
  const [loadingData, setLoadingData] = useState(false);
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [totalShrimp, setTotalShrimp] = useState(0);
  const [totalShrimpByKind, setTotalShrimpByKind] = useState({
    BigShrimp: 0,
    SmallShrimp: 0,
    MediumShrimp: 0,
  });

  const fetchData = async () => {
    try {
      setLoadingData(true);
      const response = await axios.get(
        urlServer + `/getAllImage?offset=${offset}`
      );

      if (response.data && response.data.images && response.data.images.length > 0) {
        setData((prevData) => [...prevData, ...response.data.images]);
        setOffset((prevOffset) => prevOffset + 20);
        setTotalShrimp(response.data.total_shrimp_all_images || 0);
      }
    } catch (error) {
      // Xử lý lỗi
    } finally {
      setLoadingData(false);
    }
  };

  const deleteItem = (imageId) => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => confirmDelete(imageId),
        },
      ],
      { cancelable: false }
    );
  };
  
  const confirmDelete = async (imageId) => {
    try {
      const response = await axios.post(urlServer + "/delete_history", {
        shrimp_image: imageId,
      });
      if (response.data.success) {
        const updatedData = data.filter((item) => item[0] !== imageId);
        setData(updatedData);

        const newTotalShrimp = updatedData.reduce((total, item) => total + parseInt(item[3] || 0), 0);
        setTotalShrimp(newTotalShrimp);
      } else {
        console.error("Failed to delete history:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting history:", error);
    }
  };
  
  const calculateTotalShrimpByKind = (data) => {
    return data.reduce((totalByKind, item) => {
      const shrimpCount = JSON.parse(item[2]);
      totalByKind.BigShrimp += shrimpCount.BigShrimp || 0;
      totalByKind.SmallShrimp += shrimpCount.SmallShrimp || 0;
      totalByKind.MediumShrimp += shrimpCount.MediumShrimp || 0;
      return totalByKind;
    }, { BigShrimp: 0, SmallShrimp: 0, MediumShrimp: 0 });
  };
  
  useEffect(() => {
    fetchData();
    getTotalShrimpKind();
  }, []);

  useEffect(() => {
    getTotalShrimpKind();
  }, [data]);
  
  const handleScroll = ({ nativeEvent }) => {
    const layoutHeight = nativeEvent.layoutMeasurement.height;
    const contentHeight = nativeEvent.contentSize.height;
    const offset = nativeEvent.contentOffset.y;
    const distanceToBottom = contentHeight - layoutHeight - offset;
  
    if (distanceToBottom < layoutHeight * 0.0000002 && !loadingData) {
      setLoadingData(true);
      fetchData();
    }
  };
  
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const getTotalShrimpKind = async () => {
    try {
      const response = await axios.get(urlServer + "/getTotalShrimpKind");
      const { BigShrimp, SmallShrimp, MediumShrimp } = response.data;
      const totalShrimp = (BigShrimp || 0) + (SmallShrimp || 0) + (MediumShrimp || 0);
      setTotalShrimp(totalShrimp);
      setTotalShrimpByKind({ BigShrimp: BigShrimp || 0, SmallShrimp: SmallShrimp || 0, MediumShrimp: MediumShrimp || 0 });
    } catch (error) {
      console.error("Error getting total shrimp kind:", error);
    }
  };

  return (
    <SafeAreaProvider>
      <VStack flex={1} justifyContent="space-between">
        <Stack mt="10%" w="100%" alignItems="center">
          <Heading pb="1" color="#192eab" alignItems="center" size="sm">
            Recognition activity
          </Heading>
        </Stack>

        <ScrollView mb={20} onScroll={handleScroll}>
          {loadingData ? (
            <Center>
              <Spinner color="blue" />
            </Center>
          ) : data.length === 0 ? (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 340,
              }}
            >
              <Text bold fontSize="lg" color="#aaaaaa">
                NO ACTIVITY HISTORY
              </Text>
            </View>
          ) : (
          <VStack space="2.5" mt="4" px="1">
            <Stack w="100%" alignItems="center" space={4} px={4}>
            <Text bold fontSize="xs" color="#192eab">Total Shrimp: {totalShrimp}</Text>
              <PieChart
                data={[
                  {
                    name: "Big Shrimp",
                    population: totalShrimpByKind.BigShrimp,
                    color: "#ffa726",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 10,
                  },
                  {
                    name: "Medium Shrimp",
                    population: totalShrimpByKind.MediumShrimp,
                    color: "#66bb6a",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 10,
                  },
                  {
                    name: "Small Shrimp",
                    population: totalShrimpByKind.SmallShrimp,
                    color: "#ef5350",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 10,
                  },
                ]}
                width={300}
                height={220}
                chartConfig={{
                  backgroundColor: "#1cc910",
                  backgroundGradientFrom: "#eff3ff",
                  backgroundGradientTo: "#efefef",
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </Stack>
            
              {data.map((item, index) => (
                <HStack
                  borderRadius="md"
                  bgColor="warmGray.200"
                  key={index}
                  space={2}
                  flexShrink={1}
                  alignItems="center"
                >
                  <AspectRatio
                    mx={2.5}
                    my={2.5}
                    alignItems="start"
                    ratio={{
                      base: 3 / 4,
                      md: 9 / 10,
                    }}
                    height={{
                      base: 75,
                      md: 75,
                    }}
                  >
                    <Image
                      source={{ uri: urlServer + `/getimage/${item[0]}` }}
                      resizeMode="cover"
                      alt="Ảnh tải lên"
                    />
                  </AspectRatio>
                  <Stack w="75%" space={2} alignItems="flex-end">
                    <Text>{formatDate(new Date(item[1]))}</Text>
                    <HStack space={2} mt={1}>
                      <Button
                        backgroundColor="#192eab"
                        size="xs"
                        onPress={() =>
                          navigation.navigate("History", {
                            data: {
                              shrimp_image: item[0],
                              c_time: item[1],
                              shrimp_kind: item[2],
                            },
                          })
                        }
                      >
                        Details
                      </Button>

                      <Button
                        backgroundColor="#fe0000"
                        size="xs"
                        onPress={() => deleteItem(item[0])}
                      >
                        Delete
                      </Button>
                    </HStack>
                  </Stack>
                </HStack>
              ))}
            </VStack>
          )}
        </ScrollView>

        <Box
          position="absolute"
          bottom="0"
          alignItems="stretch"
          width="100%"
          alignSelf="center"
        >
          <HStack bg="#192eab" alignItems="center" safeAreaBottom shadow={6}>
            <Pressable
              cursor="pointer"
              py="2"
              flex={1}
              onPress={() => navigation.navigate("GetImage")}
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
          </HStack>
        </Box>
      </VStack>
    </SafeAreaProvider>
  );
};

export default ActivityScreen;
