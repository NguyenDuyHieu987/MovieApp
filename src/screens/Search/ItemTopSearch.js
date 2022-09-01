import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  SafeAreaView,
  TouchableNativeFeedback,
  Keyboard,
  FlatList,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Searchbar } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import Fonts from '../../constants/Fonts';
import Colors from '../../constants/Colors';
import { getPoster } from '../../services/MovieService';

const { height, width } = Dimensions.get('window');

const ItemTopSearch = ({ item, handleOnPress }) => {
  return (
    <TouchableOpacity
      style={styles.ItemSearch}
      activeOpacity={0.5}
      onPress={handleOnPress}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          style={{
            height: 70,
            width: 130,
            marginRight: 10,
          }}
          source={{ uri: getPoster(item?.backdrop_path) }}
          resizeMode="cover"
        />
        <View>
          <Text style={styles.ItemSearchText} numberOfLines={2}>
            {item?.title}
          </Text>
          <Text style={styles.ItemSearchTextBottom} numberOfLines={1}>
            {item?.original_title}
          </Text>
        </View>
      </View>
      <Feather name="chevron-right" size={20} />
    </TouchableOpacity>
  );
};

export default ItemTopSearch;

const styles = StyleSheet.create({
  ItemSearch: {
    marginHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: Colors.LIGHT_GRAY,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ItemSearchText: {
    fontSize: 16,
    fontFamily: Fonts.REGULAR,
    width: width / 2.2,
  },
  ItemSearchTextBottom: {
    fontSize: 14,
    fontFamily: Fonts.REGULAR,
    color: Colors.LIGHT_GRAY,
    width: width / 2.3,
  },
});
