import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  Share,
  FlatList,
  TouchableNativeFeedback,
  Button,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import Fonts from '../../constants/Fonts';
import { Feather, Ionicons } from '@expo/vector-icons';
import ItemSeparator from '../../components/ItemSeparator';
import CastCard from '../../components/CastCard';
import MovieCard from '../../components/MovieCard';
import AppLoading from 'expo-app-loading';
import {
  getMovieById,
  getPoster,
  getVideo,
  getLanguage,
  getMovieBySimilar,
  getMovieByRecommend,
  getMovieByCredit,
} from '../../services/MovieService';
import { APPEND_TO_RESPONSE } from '../../constants/Urls';
import axios from 'axios';

const { height, width } = Dimensions.get('window');

const setHeight = (h) => (height / 100) * h;
const setWidth = (w) => (width / 100) * w;

const MovieScreen = ({ route, navigation }) => {
  const { movieId } = route.params;
  const [movie, setMovie] = useState({});
  const [responesCredits, setResponesCredits] = useState({});
  const [responesSimilar, setResponesSimilar] = useState({});
  const [responesRecommend, setResponesRecommend] = useState({});
  const [liked, setLiked] = useState(false);
  const [voteCountValue, setVoteCountValue] = useState(
    route.params.item.vote_count
  );

  const [isCastSelected, setIsCastSelected] = useState(true);

  useEffect(() => {
    getMovieById(movieId, `videos`).then((movieRespone) =>
      setMovie(movieRespone.data)
    );
    getMovieByCredit(movieId, `credits`).then((movieRespone) =>
      setResponesCredits(movieRespone.data)
    );

    getMovieBySimilar(movieId, `similar`).then((movieRespone) =>
      setResponesSimilar(movieRespone.data)
    );
    getMovieByRecommend(movieId, `recommendations`).then((movieRespone) =>
      setResponesRecommend(movieRespone.data)
    );
    // setVoteCountValue(movie?.vote_count);

    // setMovie({ ...respones1, ...respones2, ...respones3 });
  }, []);

  return movie?.backdrop_path ? (
    <ScrollView style={styles.container}>
      <StatusBar
        style="auto"
        translucent={false}
        backgroundColor={Colors.BASIC_BACKGROUND}
      />
      {/* <LinearGradient
        colors={['rgba(0, 0, 0, 0.5)', 'rgba(217, 217, 217, 0)']}
        start={[0, 0.3]}
        style={styles.linearGradient}
      /> */}
      <View style={styles.moviePosterImageContainer}>
        <Image
          style={styles.moviePosterImage}
          resizeMode="contain"
          source={{ uri: getPoster(movie?.backdrop_path) }}
        />
      </View>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.goBack()}
        >
          <Feather
            name="chevron-left"
            size={35}
            color={Colors.YELLOW}
            style={{ left: -7 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() =>
            Share.share({ message: `${movie?.title}\n\n${movie?.homepage}` })
          }
        >
          <Text style={styles.headerText}>Share</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.playButton}
        onPress={() => Linking.openURL(getVideo(movie.videos.results[0].key))}
      >
        <Ionicons name="play-circle-outline" size={70} color={Colors.YELLOW} />
      </TouchableOpacity>
      <ItemSeparator height={setHeight(37)} />
      <View style={styles.addListContainer}>
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TouchableNativeFeedback
            onPress={() => {
              setLiked(!liked);
              setVoteCountValue(
                liked ? voteCountValue - 1 : voteCountValue + 1
              );
            }}
          >
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={30}
              color={liked ? Colors.HEART : Colors.BLACK}
            />
          </TouchableNativeFeedback>
          <Text>{voteCountValue}</Text>
        </View>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor: Colors.EXTRA_LIGHT_GRAY,
            paddingHorizontal: 20,
            height: 45,
          }}
          onPress={() => Linking.openURL(getVideo(movie.videos.results[0].key))}
          activeOpacity={0.5}
        >
          <Ionicons
            name="play"
            size={27}
            color={Colors.BLACK}
            style={{ marginRight: 5 }}
          />
          <Text style={{ fontFamily: Fonts.REGULAR }}>Play</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              axios.post(
                'https://api.themoviedb.org/3/account/14271386/watchlist?api_key=fe1b70d9265fdb22caa86dca918116eb&session_id=5ae3c9dd2c824276ba202e5f77298064ccc7085d',
                {
                  media_type: 'movie',
                  media_id: movieId,
                  watchlist: true,
                }
              );
            }}
          >
            <Ionicons name="add" size={39} color={Colors.BLACK} />
          </TouchableOpacity>
          <Text style={{ fontFamily: Fonts.REGULAR }}>List</Text>
        </View>
      </View>
      <View style={styles.movieTitleContainer}>
        <View>
          <Text style={styles.movieTitle} numberOfLines={2}>
            {movie?.title}
          </Text>
          <Text style={styles.movieOriginalTitle} numberOfLines={2}>
            {movie?.original_title}
          </Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="star" size={22} color={Colors.YELLOW} />
          <Text style={styles.raitingText}>{movie?.vote_average}</Text>
        </View>
      </View>
      <Text style={styles.genreText}>
        {movie?.genres?.map((genre) => genre?.name)?.join(', ')} |{' '}
        {movie?.runtime} Min
      </Text>
      <Text style={styles.genreText}>
        {getLanguage(movie?.original_language)?.english_name}
      </Text>
      <View style={styles.overViewContainer}>
        <Text style={styles.overViewTitle}>Overview</Text>
        <Text style={styles.overViewText}>{movie?.overview}</Text>
      </View>
      <View>
        {/* <Text style={styles.castTitle}>Cast</Text> */}
        <View style={styles.castSubMenuContainer}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setIsCastSelected(true)}
          >
            <Text
              style={{
                ...styles.castSubMenuText,
                color: isCastSelected ? Colors.BLACK : Colors.LIGHT_GRAY,
              }}
            >
              Cast
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setIsCastSelected(false)}
          >
            <Text
              style={{
                ...styles.castSubMenuText,
                color: isCastSelected ? Colors.LIGHT_GRAY : Colors.BLACK,
              }}
            >
              Crew
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          style={{ marginVertical: 5 }}
          data={
            isCastSelected
              ? responesCredits.credits?.cast
              : responesCredits.credits?.crew
          }
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <ItemSeparator width={15} />}
          ListHeaderComponent={() => <ItemSeparator width={10} />}
          ListFooterComponent={() => <ItemSeparator width={10} />}
          renderItem={({ item }) => (
            <CastCard
              originalname={item?.name}
              characterName={isCastSelected ? item?.character : item?.job}
              image={item?.profile_path}
            />
          )}
        />
      </View>
      <Text style={styles.extraListTitle}>Recommended Movives</Text>
      <FlatList
        data={responesRecommend?.recommendations?.results}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <ItemSeparator width={15} />}
        ListHeaderComponent={() => <ItemSeparator width={10} />}
        ListFooterComponent={() => <ItemSeparator width={10} />}
        renderItem={({ item }) => (
          <MovieCard
            title={item.title}
            language={item.original_language}
            voteAverage={item.vote_average}
            voteCount={item.vote_count}
            poster={item.poster_path}
            size={0.62}
            handleOnPress={() =>
              navigation.push('movie', { movieId: item.id, item: item })
            }
          />
        )}
      />
      <Text style={styles.extraListTitle}>Similar Movives</Text>
      <FlatList
        data={responesSimilar?.similar?.results}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <ItemSeparator width={15} />}
        ListHeaderComponent={() => <ItemSeparator width={10} />}
        ListFooterComponent={() => <ItemSeparator width={10} />}
        renderItem={({ item }) => (
          <MovieCard
            title={item.title}
            language={item.original_language}
            voteAverage={item.vote_average}
            voteCount={item.vote_count}
            poster={item.poster_path}
            size={0.62}
            handleOnPress={() =>
              navigation.push('movie', { movieId: item.id, item: item })
            }
          />
        )}
      />
    </ScrollView>
  ) : (
    <AppLoading />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  moviePosterImageContainer: {
    height: setHeight(35),
    width: setWidth(145),
    alignItems: 'center',
    position: 'absolute',
    left: setWidth(-46 / 2),
    top: 0,
    borderBottomRightRadius: 260,
    borderBottomLeftRadius: 260,
    elevation: 15,
  },
  moviePosterImage: {
    borderBottomRightRadius: 260,
    borderBottomLeftRadius: 260,
    width: setWidth(145),
    height: setHeight(35),
  },
  linearGradient: {
    width: setWidth(100),
    height: setHeight(6),
    position: 'absolute',
    top: 0,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    position: 'absolute',
    right: 0,
    left: 0,
    top: 20,
    elevation: 20,
  },
  headerText: {
    color: Colors.YELLOW,
    fontFamily: Fonts.BOLD,
    fontSize: 20,
  },
  playButton: {
    position: 'absolute',
    top: 100,
    left: setWidth(50) - 70 / 2,
  },
  addListContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  movieTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  movieTitle: {
    color: Colors.BLACK,
    fontFamily: Fonts.EXTRA_BOLD,
    fontSize: 18,
    width: setWidth(60),
  },
  movieOriginalTitle: {
    marginTop: 5,
    fontFamily: Fonts.REGULAR,
  },
  raitingText: {
    marginLeft: 5,
    color: Colors.BLACK,
    fontFamily: Fonts.EXTRA_BOLD,
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  genreText: {
    color: Colors.LIGHT_GRAY,
    paddingHorizontal: 20,
    marginTop: 5,
    fontFamily: Fonts.BOLD,
    fontSize: 13,
  },
  overViewContainer: {
    backgroundColor: Colors.EXTRA_LIGHT_GRAY,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
  },
  overViewTitle: {
    color: Colors.BLACK,
    fontFamily: Fonts.BOLD,
    fontSize: 18,
  },
  overViewText: {
    color: Colors.LIGHT_GRAY,
    paddingVertical: 5,
    fontFamily: Fonts.BOLD,
    fontSize: 13,
    textAlign: 'justify',
  },
  castTitle: {
    marginLeft: 20,
    color: Colors.BLACK,
    fontFamily: Fonts.BOLD,
    fontSize: 18,
  },
  castSubMenuContainer: {
    marginLeft: 20,
    flexDirection: 'row',
    marginVertical: 5,
  },
  castSubMenuText: {
    marginRight: 10,
    color: Colors.BLACK,
    fontFamily: Fonts.BOLD,
    fontSize: 18,
  },
  extraListTitle: {
    marginLeft: 20,
    color: Colors.BLACK,
    fontFamily: Fonts.BOLD,
    fontSize: 18,
    marginVertical: 8,
  },
});

export default MovieScreen;
