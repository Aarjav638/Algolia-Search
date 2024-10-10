import React, {useRef, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {liteClient as algoliasearch} from 'algoliasearch/lite';
import {Configure, InstantSearch} from 'react-instantsearch-core';
import {Highlight} from './components/Highlight';
import {ProductHit} from './types/ProductHit';
import {SearchBox} from './components/SearchBox';
import {Filters} from './components/Filter';
import {InfiniteHits} from './components/InfiniteHits';

const searchClient = algoliasearch(
  'ZXIVU6AR8J',
  '218c61783c4b58528d5925cfb83a8207',
);

export default function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const listRef = useRef<FlatList>(null);

  function scrollToTop() {
    listRef.current?.scrollToOffset({animated: false, offset: 0});
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <InstantSearch searchClient={searchClient} indexName="products">
          <Configure highlightPreTag="<mark>" highlightPostTag="</mark>" />
          <SearchBox onChange={scrollToTop} />
          <Filters
            isModalOpen={isModalOpen}
            onToggleModal={() => setModalOpen(!isModalOpen)}
            onChange={scrollToTop}
          />
          <InfiniteHits ref={listRef} hitComponent={Hit} />
        </InstantSearch>
      </View>
    </SafeAreaView>
  );
}

type HitProps = {
  hit: ProductHit;
};

function Hit({hit}: HitProps) {
  return (
    <Text>
      <Highlight attribute="name" hit={hit} />
    </Text>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#252b33',
    // @ts-ignore 100vh is valid but not recognized by react-nativ
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    flexDirection: 'column',
  },
});
