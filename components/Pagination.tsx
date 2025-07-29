import React, { useEffect, useState } from 'react';
import {
  FlatList,
  ActivityIndicator,
  View,
  Text,
  ViewStyle,
  FlatListProps,
  StyleProp,
} from 'react-native';
import { Api, ApiOptions } from 'class/HandleApi';
import { State } from 'class/State';

type PaginatedComponentBaseProps = {
  url: string;
  limit?: number;
  renderItem: ({ item }: { item: any }) => JSX.Element;
  containerStyle?: StyleProp<ViewStyle>;
  listFooterStyle?: StyleProp<ViewStyle>;
  emptyComponentStyle?: StyleProp<ViewStyle>;
  flatListProps?: Partial<FlatListProps<any>>;
};

type PaginatedComponentProps =
  | (PaginatedComponentBaseProps & {
      searchQuery?: undefined;
      searchQueryKey?: undefined;
    })
  | (PaginatedComponentBaseProps & {
      searchQuery: string;
      searchQueryKey: string;
    });

const PaginatedComponent = (props: PaginatedComponentProps) => {
  const token = State.getToken();
  const {
    url,
    limit = 10,
    renderItem,
    containerStyle,
    listFooterStyle,
    emptyComponentStyle,
    flatListProps = {},
  } = props;

  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (pageToFetch: number) => {
    if (loading || (totalPages !== null && pageToFetch > totalPages)) return;

    setLoading(true);
    try {
      let apiUrl = url;

      if ('searchQuery' in props && props.searchQuery.trim()) {
        const searchParam = `${props.searchQueryKey}=${encodeURIComponent(props.searchQuery.trim())}`;
        apiUrl += apiUrl.includes('?') ? `&${searchParam}` : `?${searchParam}`;
      }

      const paginationParams = `limit=${limit}&page=${pageToFetch}`;
      apiUrl += apiUrl.includes('?') ? `&${paginationParams}` : `?${paginationParams}`;

      console.log('Handling API call..', apiUrl);

      const config: ApiOptions = {
        url: apiUrl,
        type: 'GET',
        ...(token && { token }),
      };

      const res = await Api.handleApi(config);
      const { data: newData, totalPages: total } = res.data;

      setData((prev) => (pageToFetch === 1 ? newData : [...prev, ...newData]));
      setTotalPages(total);
      setPage(pageToFetch);
    } catch (err: any) {
      console.error('Pagination fetch error:', err?.message || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setData([]);
    setPage(1);
    setTotalPages(null);
    fetchData(1);
  }, ['searchQuery' in props ? props.searchQuery : url]);

  const loadMore = () => {
    if (!loading && (totalPages === null || page < totalPages)) {
      fetchData(page + 1);
    }
  };

  return (
    <View style={containerStyle}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <View style={[{ marginVertical: 16, alignItems: 'center' }, listFooterStyle]}>
              <ActivityIndicator />
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <View style={[{ padding: 20, alignItems: 'center' }, emptyComponentStyle]}>
              <Text style={{ color: 'gray' }}>No results found.</Text>
            </View>
          ) : null
        }
        {...flatListProps}
      />
    </View>
  );
};

export default PaginatedComponent;
