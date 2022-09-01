import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, { Component } from 'react';
import axios from 'axios';
import ItemWatchList from './ItemWatchList';
import { getWathListPage } from '../../services/MovieService';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

class WatchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
      page: 1,
    };
  }

  componentDidMount() {
    this.setState(
      {
        loading: true,
      },
      this.getData
    );
  }

  getData = async () => {
    await getWathListPage(this.state.page).then((resJson) => {
      this.setState({
        data: this.state.data.concat(resJson.data.results),
        loading: false,
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
  renderFooter = () => {
    return (
      <View style={{ alignItems: 'center', marginTop: 10 }}>
        <ActivityIndicator size="small" />
        <Text>Loading...</Text>
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Watch List</Text>
        </View>
        <FlatList
          spacing={10}
          data={this.state.data}
          numColumns={3}
          onEndReached={this.handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={this.renderFooter}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <ItemWatchList
              id={item.id}
              title={item.title}
              language={item.original_language}
              voteAverage={item.vote_average}
              voteCount={item.vote_count}
              poster={item.poster_path}
              heartLess={true}
              size={0.8}
              handleOnPress={() =>
                this.props.navigation.navigate('movie', {
                  movieId: item.id,
                  item: item,
                })
              }
            />
          )}
        />
      </SafeAreaView>
    );
  }
}

export default WatchList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BLACK,
  },
  titleContainer: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: Fonts.EXTRA_BOLD,
  },
});
