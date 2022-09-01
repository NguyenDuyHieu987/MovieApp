import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TouchableNativeFeedback,
  ImageBackground,
  Dimensions,
} from 'react-native';
import React, { useState } from 'react';
import Colors from '../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import Fonts from '../../constants/Fonts';
import Images from '../../constants/Images';
import { getPoster, getLanguage } from '../../services/MovieService';
import axios from 'axios';

const { height, width } = Dimensions.get('window');

const ItemWatchList = ({
  id,
  title,
  poster,
  language,
  voteAverage,
  voteCount,
  size,
  heartLess,
  handleOnPress,
}) => {
  const [liked, setLiked] = useState(true);
  const [voteCountValue, setVoteCountValue] = useState({});
  return (
    <TouchableOpacity
      style={{
        marginHorizontal: 5,
        marginTop: 3,
      }}
      activeOpacity={0.8}
      onPress={handleOnPress}
    >
      <ImageBackground
        style={styles.container}
        imageStyle={{ borderRadius: 10 }}
        source={{ uri: getPoster(poster) }}
      >
        <View style={styles.imdbContainer}>
          {/* <Image
              source={Images.IMDB}
              resizeMode="cover"
              style={styles.imdbImage}
            /> */}
          <Text style={styles.imdbImage}>IMDb</Text>
          <Text style={styles.imdbRating}>{voteAverage}</Text>
        </View>
      </ImageBackground>
      <View style={styles.movieContainer}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.movieSubTitleContainer}>
          <TouchableNativeFeedback
            style={styles.rowAndCenter}
            onPress={() => {
              setLiked(!liked);
              setVoteCountValue();
              axios.post(
                'https://api.themoviedb.org/3/account/14271386/watchlist?api_key=fe1b70d9265fdb22caa86dca918116eb&session_id=5ae3c9dd2c824276ba202e5f77298064ccc7085d',
                {
                  media_type: 'movie',
                  media_id: id,
                  watchlist: false,
                }
              );
            }}
          >
            <Ionicons
              name={liked ? 'checkmark' : 'add'}
              size={30}
              style={{
                position: 'absolute',
                bottom: 10,
                left: 12,
              }}
            />
          </TouchableNativeFeedback>
        </View>
      </View>
    </TouchableOpacity>
  );
};

ItemWatchList.defaultProps = {
  size: 1,
  heartLess: false,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.LIGHT_GRAY,
    height: 170,
    width: width / 3.3,
    borderRadius: 12,
    elevation: 7,
    marginVertical: 2,
  },
  movieTitle: {
    fontFamily: Fonts.EXTRA_BOLD,
    color: Colors.GRAY,
    paddingVertical: 2,
    marginTop: 5,
    paddingHorizontal: 5,
    width: width / 3.3,
  },
  movieContainer: {
    height: 90,
    justifyContent: 'space-between',
  },
  movieSubTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowAndCenter: {
    alignSelf: 'center',
  },
  imdbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    position: 'absolute',
    backgroundColor: Colors.YELLOW,
    borderTopRightRadius: 10,
    paddingVertical: 3,
    borderBottomLeftRadius: 6,
  },
  imdbImage: {
    // height: 20,
    fontFamily: Fonts.EXTRA_BOLD,
    color: Colors.BLACK,
    borderBottomLeftRadius: 6,
    marginHorizontal: 5,
  },
  imdbRating: {
    marginRight: 5,
    color: Colors.HEART,
    fontFamily: Fonts.EXTRA_BOLD,
  },
});

export default ItemWatchList;
