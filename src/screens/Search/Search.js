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
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useCallback, Component } from 'react';
import ItemSeparator from '../../components/ItemSeparator';
import Fonts from '../../constants/Fonts';
import Colors from '../../constants/Colors';
import { getPoster } from '../../services/MovieService';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Searchbar } from 'react-native-paper';
import {
  useFocusEffect,
  useIsFocused,
  StackActions,
} from '@react-navigation/native';
import ItemSearch from './ItemSearch';
import axios from 'axios';
import ItemTopSearch from './ItemTopSearch';

class Search extends Component {
  // const [shouldHide, setShouldHide] = useState(false);
  // const [input, setInput] = useState('');
  // const [data, setData] = useState({});
  // const onChangeText = (text) => {
  //   setInput(text);

  //   if (text.length == 0) return setData({});

  //   if (text.length >= 1) {
  //     const res = axios.get(
  //       `http://api.themoviedb.org/3/search/movie?api_key=fe1b70d9265fdb22caa86dca918116eb&query=${text}`
  //     );

  //     res.then((searchMovieResponse) => setData(searchMovieResponse.data));
  //     console.log(data);
  //   }
  // };
  // const isFocused = useIsFocused();
  // useFocusEffect(
  //   useCallback(() => {
  //     // Do something when the screen is focused
  //     setShouldHide(false);

  //     return () => {
  //       // Do something when the screen is unfocused
  //       // Useful for cleanup functions
  //       setShouldHide(true);
  //       setInput(null);
  //       setData({});
  //     };
  //   }, [])
  // );

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dataTopSearch: [],
      loading: false,
      loadingTopSearch: false,
      page: 1,
      pageTopSearch: 1,
      isFocused: true,
      input: '',
      isMount: false,
    };
  }

  componentDidMount() {
    this.setState(
      {
        loading: true,
        loadingTopSearch: true,
      },
      this.getDataTopSearch
    );
  }

  onChangeText = async (text) => {
    this.setState({
      input: text,
    });

    if (text.length == 0) {
      return this.setState({
        data: [],
        loading: true,
        isFocused: true,
      });
    }

    if (text.length >= 1) {
      await axios
        .get(
          `https://api.themoviedb.org/3/search/movie?api_key=fe1b70d9265fdb22caa86dca918116eb&query=${text}`
        )
        .then((searchMovieResponse) =>
          this.setState({
            data: searchMovieResponse.data.results,
            loading: false,
            isFocused: false,
          })
        );
    }
  };

  getData = () => {
    const URL = `https://api.themoviedb.org/3/search/movie?api_key=fe1b70d9265fdb22caa86dca918116eb&query=${this.state.input}&page=${this.state.page}`;

    axios.get(URL).then((resJson) => {
      this.setState({
        data: this.state.data.concat(resJson.data.results),
        loading: false,
      });
    });
  };

  getDataTopSearch = async () => {
    const URL = `https://api.themoviedb.org/3/discover/movie?api_key=fe1b70d9265fdb22caa86dca918116eb&with_watch_monetization_types=flatrate&page=${this.state.pageTopSearch}`;

    await axios.get(URL).then((resJson) => {
      this.setState({
        dataTopSearch: this.state.dataTopSearch.concat(resJson.data.results),
        loadingTopSearch: false,
      });
    });
  };

  handleEndReached = () => {
    this.setState(
      {
        page: this.state.page + 1,
        loading: true,
      },
      this.getData
    );
  };

  handleEndReachedTopSearch = () => {
    this.setState(
      {
        pageTopSearch: this.state.pageTopSearch + 1,
        loadingTopSearch: true,
      },
      this.getDataTopSearch
    );
  };

  renderFooter = () => {
    return (
      <View style={{ alignItems: 'center' }}>
        <ActivityIndicator size="small" />
        <Text>Loading...</Text>
      </View>
    );
  };

  render() {
    return (
      <TouchableNativeFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView style={styles.container}>
          <Text style={styles.headerText}>Search</Text>
          <View style={styles.textInputContainer}>
            <Searchbar
              style={styles.textInput}
              placeholder="Type here..."
              onChangeText={this.onChangeText}
              value={this.state.input}
              autoFocus={true}
              elevation={2}
              iconColor={Colors.ACTIVE}
              loading={true}
              onClear={() => {
                this.setState({
                  data: [],
                  loading: true,
                  isFocused: true,
                });
              }}
            />
          </View>

          {this.state.isFocused ? (
            <View style={{ paddingBottom: 150 }}>
              <Text style={styles.headerTopSearch}>
                The most popular search
              </Text>
              <FlatList
                style={{ marginBottom: 55 }}
                data={this.state.dataTopSearch}
                showsHorizontalScrollIndicator={false}
                onEndReached={this.handleEndReachedTopSearch}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                  !this.state.loadingTopSearch ? this.renderFooter : null
                }
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => <ItemSeparator width={15} />}
                ListHeaderComponent={() => <ItemSeparator width={10} />}
                renderItem={({ item }) => (
                  <ItemTopSearch
                    item={item}
                    handleOnPress={() =>
                      this.props.navigation.navigate('movie', {
                        movieId: item.id,
                      })
                    }
                  />
                )}
              />
            </View>
          ) : null}

          <FlatList
            data={this.state.data}
            showsHorizontalScrollIndicator={false}
            onEndReached={this.handleEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={!this.state.loading ? this.renderFooter : null}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <ItemSeparator width={15} />}
            ListHeaderComponent={() => <ItemSeparator width={10} />}
            renderItem={({ item }) => (
              <ItemSearch
                item={item}
                handleOnPress={() =>
                  this.props.navigation.navigate('movie', { movieId: item.id })
                }
              />
            )}
          />
        </SafeAreaView>
      </TouchableNativeFeedback>
    );
  }
}

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
  },
  headerText: {
    fontSize: 30,
    fontFamily: Fonts.BOLD,
    color: Colors.ACTIVE,
    alignSelf: 'center',
    marginTop: 10,
  },

  textInputContainer: {
    marginTop: 10,
    backgroundColor: Colors.EXTRA_LIGHT_GRAY,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },

  textInput: {
    backgroundColor: Colors.BASIC_BACKGROUND,
    fontSize: 16,
    borderWidth: 0.5,
    marginHorizontal: 10,
    borderRadius: 30,
  },

  headerTopSearch: {
    fontSize: 20,
    fontFamily: Fonts.BOLD,
    marginLeft: 25,
    paddingVertical: 10,
  },
});
