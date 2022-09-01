import { StatusBar } from 'expo-status-bar';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Button,
  Image,
} from 'react-native';
import React, { useState, useEffect, Component } from 'react';
import Colors from '../../constants/Colors';
import GenreCard from '../../components/GenreCard';
import ItemSeparator from '../../components/ItemSeparator';
import Fonts from '../../constants/Fonts';
import MovieCard from '../../components/MovieCard';
import {
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getAllGenres,
  getMoviesByGenres,
  getMoviesByGenres2,
  getMoviesByGenres3,
  getMoviesByGenres4,
  getTrending,
  getPoster,
  getMovieById,
} from '../../services/MovieService';
import {
  nowPlayingRespone,
  upComingRespone,
  popularRespone,
  topRatedRespone,
  genreResponse,
} from '../../JsonServer';
import { LinearGradient } from 'expo-linear-gradient';
import AppLoading from 'expo-app-loading';
import Slideshow from 'react-native-image-slider-show';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Avatar } from 'react-native-paper';
import axios from 'axios';

const { height, width } = Dimensions.get('window');

class HomeScreen extends Component {
  // const [activeGenre, setActiveGenre] = useState('All');
  // const [nowPlayingMovies, setNowPlayingMovies] = useState({});
  // const [upcomingMovies, setUpcomingMovies] = useState({});
  // const [popularMovies, setPopularMovies] = useState({});
  // const [topRatedMovies, setTopRatedMovies] = useState({});
  // const [genres, setGenres] = useState([{ id: 10110, name: 'All' }]);
  // const [dataNowPlayingMovies, setDataNowPlayingMovies] = useState(
  //   nowPlayingRespone.results
  // );
  // const [dataUpcomingMovies, setDataUpcomingMovies] = useState(
  //   upComingRespone.results
  // );
  // const [dataPopularMovies, setDataPopularMovies] = useState(
  //   popularRespone.results
  // );
  // const [dataTopRatedMovies, setDataTopRatedMovies] = useState(
  //   topRatedRespone.results
  // );

  // const [isRender, setIsRender] = useState(false);

  // useEffect(() => {
  //   getNowPlayingMovies().then((movieResponse) =>
  //     setNowPlayingMovies(movieResponse.data)
  //   );
  //   getUpcomingMovies().then((movieResponse) =>
  //     setUpcomingMovies(movieResponse.data)
  //   );

  //   getPopularMovies().then((movieResponse) =>
  //     setPopularMovies(movieResponse.data)
  //   );

  //   getTopRatedMovies().then((movieResponse) =>
  //     setTopRatedMovies(movieResponse.data)
  //   );

  //   getAllGenres().then((genreResponse) =>
  //     setGenres([...genres, ...genreResponse.data.genres])
  //   );

  //   if (activeGenre != 'All') {
  //     // navigation.navigate('movieShow', {
  //     //   currentMovies: getMoviesByGenres(upComingRespone.results, activeGenre),
  //     //   title: activeGenre,
  //     // });
  //     console.log(activeGenre);
  //     setDataNowPlayingMovies(
  //       getMoviesByGenres(nowPlayingRespone.results, activeGenre)
  //     );
  //     setDataUpcomingMovies(
  //       getMoviesByGenres2(upComingRespone.results, activeGenre)
  //     );
  //     setDataPopularMovies(
  //       getMoviesByGenres3(popularRespone.results, activeGenre)
  //     );
  //     setDataTopRatedMovies(
  //       getMoviesByGenres4(topRatedRespone.results, activeGenre)
  //     );
  //   } else if (activeGenre === 'All') {
  //     setDataNowPlayingMovies(nowPlayingRespone.results);
  //     setDataUpcomingMovies(upComingRespone.results);
  //     setDataPopularMovies(popularRespone.results);
  //     setDataTopRatedMovies(topRatedRespone.results);
  //   }
  // }, [activeGenre]);

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dataNowPlayingMovies: [],
      dataUpcomingMovies: [],
      dataPopularMovies: [],
      dataTopRatedMovies: [],
      dataTrendingMoives: {},
      activeGenre: 'All',
      refreshing: false,
      randomPoster: Math.floor(Math.random() * 20),
      images: [],
      position: 1,
      interval: null,
    };
  }

  handleRefresh = () => {
    console.log('refresh');
    if (this.state.activeGenre == 'All')
      this.setState({
        dataNowPlayingMovies: nowPlayingRespone.results,
        refreshing: true,
      });
    else
      this.setState({
        dataNowPlayingMovies: getMoviesByGenres(
          nowPlayingRespone.results,
          this.state.activeGenre
        ),
        refreshing: true,
      });
  };

  getPosterPath = () => {
    this.state.dataTrendingMoives.map((item) => {
      var a = { url: getPoster(item?.backdrop_path) };
      this.state.images = [...this.state.images, a];
    });
    return this.state.images;
  };

  componentDidMount() {
    getTrending().then((movieRespone) => {
      this.setState({
        dataTrendingMoives:
          movieRespone?.data?.results[this.state.randomPoster],
      });
    });
    getNowPlayingMovies().then((movieRespone) => {
      this.setState({
        dataNowPlayingMovies: movieRespone?.data?.results,
      });
    });

    getUpcomingMovies().then((movieRespone) => {
      this.setState({
        dataUpcomingMovies: movieRespone?.data?.results,
      });
    });
    getPopularMovies().then((movieRespone) => {
      this.setState({
        dataPopularMovies: movieRespone?.data?.results,
      });
    });
    getTopRatedMovies().then((movieRespone) => {
      this.setState({
        dataTopRatedMovies: movieRespone?.data?.results,
      });
    });
  }

  // UNSAFE_componentWillMount() {
  //   this.setState({
  //     interval: setInterval(() => {
  //       this.setState({
  //         position:
  //           this.state.position === this.getPosterPath().length
  //             ? 0
  //             : this.state.position + 1,
  //       });
  //     }, 2000),
  //   });
  // }

  // componentWillUnmount() {
  //   clearInterval(this.state.interval);
  // }

  render() {
    return this.state.dataTrendingMoives.poster_path ? (
      <ScrollView style={styles.container}>
        <StatusBar
          style="auto"
          translucent={true}
          backgroundColor="transparent"
        />
        <View style={{}}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              this.props.navigation.navigate('movie', {
                movieId: this.state.dataTrendingMoives.id,
                item: this.state.dataTrendingMoives,
              })
            }
          >
            <ImageBackground
              source={{
                uri: getPoster(this.state.dataTrendingMoives?.poster_path),
              }}
              resizeMode="cover"
              style={{
                height: height / 1.45,
                width: width,
              }}
            />
            <LinearGradient
              colors={['rgba(217, 217, 217, 0)', 'rgba(0, 0, 0, 1)']}
              start={[1, 0]}
              end={[1, 1]}
              style={{
                width: width,
                height: 200,
                position: 'absolute',
                bottom: 0,
              }}
            />
          </TouchableOpacity>

          <View
            style={{
              width: width,
              position: 'absolute',
              alignSelf: 'center',
              alignItems: 'center',
              bottom: 0,
              zIndex: 10,
            }}
          >
            <Text
              numberOfLines={2}
              style={{
                color: Colors.BLACK,
                fontFamily: Fonts.EXTRA_BOLD,
                fontSize: 25,
                textAlign: 'center',
                width: width / 1.3,
                marginBottom: 5,
                opacity: 0.85,
              }}
            >
              {this.state.dataTrendingMoives.name}
            </Text>

            <View
              style={{
                width: width,
                alignSelf: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() =>
                  this.props.navigation.navigate('video', {
                    movieId:
                      this.state.dataTrendingMoives[this.state.randomPoster]
                        ?.id,
                    item: this.state.dataTrendingMoives[
                      this.state.randomPoster
                    ],
                  })
                }
              >
                <Ionicons name="play" size={45} color={Colors.BLACK} />
                <Text
                  style={{
                    fontFamily: Fonts.REGULAR,
                    fontSize: 20,
                    color: Colors.BLACK,
                    opacity: 0.7,
                  }}
                >
                  Play
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  axios.post(
                    'https://api.themoviedb.org/3/account/14271386/watchlist?api_key=fe1b70d9265fdb22caa86dca918116eb&session_id=5ae3c9dd2c824276ba202e5f77298064ccc7085d',
                    {
                      media_type: 'movie',
                      media_id: this.state.dataTrendingMoives?.id,
                      watchlist: true,
                    }
                  );
                }}
              >
                <Ionicons name="add" size={45} color={Colors.BLACK} />
                <Text
                  style={{
                    fontFamily: Fonts.REGULAR,
                    fontSize: 20,
                    color: Colors.BLACK,
                    opacity: 0.7,
                  }}
                >
                  List
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* <Slideshow
          dataSource={this.getPosterPath()}
          position={this.state.position}
          onPositionChanged={(position) => this.setState({ position })}
          containerStyle={{
            height: height / 1.45,
            width: width,
          }}
        /> */}

        <View style={styles.genreListContainer}>
          <FlatList
            data={genreResponse.genres}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <ItemSeparator width={15} />}
            ListHeaderComponent={() => <ItemSeparator width={10} />}
            ListFooterComponent={() => <ItemSeparator width={10} />}
            renderItem={({ item }) => (
              <GenreCard
                genreName={item.name}
                active={item.name === this.state.activeGenre ? true : false}
                onPress={(genreName) => {
                  this.setState({
                    activeGenre: genreName,
                    refresh: !this.state.refresh,
                  });

                  this.setState({ dataNowPlayingMovies: null }, () => {
                    this.setState({
                      dataNowPlayingMovies: getMoviesByGenres(
                        nowPlayingRespone.results,
                        genreName
                      ),
                    });
                  });
                }}
              />
            )}
          />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Now Playing</Text>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('movieShow', {
                currentMovies: nowPlayingRespone.results,
                title: 'Now Playing',
              })
            }
          >
            <Text style={styles.headerSubTile}>View All</Text>
          </TouchableOpacity>
        </View>
        <View>
          <FlatList
            data={this.state.dataNowPlayingMovies}
            extraData={this.state.refresh}
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
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
                heartLess={true}
                handleOnPress={() =>
                  this.props.navigation.navigate('movie', {
                    movieId: item.id,
                    item: item,
                  })
                }
              />
            )}
          />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Coming Soon</Text>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('movieShow', {
                currentMovies: upComingRespone.results,
                title: 'Coming Soon',
              })
            }
          >
            <Text style={styles.headerSubTile}>View All</Text>
          </TouchableOpacity>
        </View>

        <View>
          <FlatList
            data={this.state.dataUpcomingMovies}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <ItemSeparator width={10} />}
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
                  this.props.navigation.navigate('movie', {
                    movieId: item.id,
                    item: item,
                  })
                }
              />
            )}
          />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Popular</Text>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('movieShow', {
                currentMovies: popularRespone.results,
                title: 'Popular',
              })
            }
          >
            <Text style={styles.headerSubTile}>View All</Text>
          </TouchableOpacity>
        </View>
        <View>
          <FlatList
            data={this.state.dataPopularMovies}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <ItemSeparator width={10} />}
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
                  this.props.navigation.navigate('movie', {
                    movieId: item.id,
                    item: item,
                  })
                }
              />
            )}
          />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Top Rated</Text>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('movieShow', {
                currentMovies: topRatedRespone.results,
                title: 'Top Rated',
              })
            }
          >
            <Text style={styles.headerSubTile}>View All</Text>
          </TouchableOpacity>
        </View>
        <View>
          <FlatList
            data={this.state.dataTopRatedMovies}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <ItemSeparator width={10} />}
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
                  this.props.navigation.navigate('movie', {
                    movieId: item.id,
                    item: item,
                  })
                }
              />
            )}
          />
        </View>
      </ScrollView>
    ) : (
      <AppLoading />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BLACK,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: Fonts.REGULAR,
  },
  headerSubTile: {
    fontSize: 16,
    color: Colors.ACTIVE,
    fontFamily: Fonts.BOLD,
    bordervaColor: Colors.LIGHT_GRAY,
    padding: 3,
    paddingHorizontal: 7,
  },
  genreListContainer: {
    marginTop: 20,
  },
});

export default HomeScreen;
