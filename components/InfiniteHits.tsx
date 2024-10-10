import React, {forwardRef} from 'react';
import {StyleSheet, View, FlatList, Text} from 'react-native';
import {Hit as AlgoliaHit} from '@algolia/client-search';
import {useInfiniteHits, UseInfiniteHitsProps} from 'react-instantsearch-core';
import {Image} from 'react-native';
type InfiniteHitsProps<THit> = UseInfiniteHitsProps & {
  hitComponent: (props: {hit: THit}) => JSX.Element;
};

export const InfiniteHits = forwardRef(
  <THit extends AlgoliaHit<Record<string, unknown>>>(
    {hitComponent: Hit, ...props}: InfiniteHitsProps<THit>,
    ref: React.ForwardedRef<FlatList<THit>>,
  ) => {
    const {hits, isLastPage, showMore} = useInfiniteHits({
      ...props,
      escapeHTML: false,
    });
    return (
      <FlatList
        ref={ref}
        data={hits as unknown as THit[]}
        keyExtractor={item => item.objectID}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onEndReached={() => {
          if (!isLastPage) {
            showMore();
          }
        }}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Image
              style={styles.image}
              source={{
                uri:
                  (item._highlightResult?.image as {value: string})?.value ||
                  '',
              }}
            />
            <View style={styles.itemDetails}>
              <Hit hit={item} />
              <Text>
                Price: $
                {
                  (item._highlightResult?.price as unknown as {value: string})
                    .value
                }
              </Text>
              <Text>
                Rating:{' '}
                {
                  (item._highlightResult?.rating as unknown as {value: string})
                    .value
                }
              </Text>
            </View>
          </View>
        )}
      />
    );
  },
);

const styles = StyleSheet.create({
  separator: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  item: {
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemDetails: {
    flexWrap: 'wrap',
    padding: 10,
    width: '60%',
    gap: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  image: {
    width: 100,
    height: 150,
    objectFit: 'contain',
  },
});

declare module 'react' {
  // eslint-disable-next-line no-shadow
  function forwardRef<TRef, TProps = unknown>(
    render: (props: TProps, ref: React.Ref<TRef>) => React.ReactElement | null,
  ): (props: TProps & React.RefAttributes<TRef>) => React.ReactElement | null;
}
