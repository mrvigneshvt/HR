import React, { useEffect, useState } from 'react';
import { FlatList, ActivityIndicator, View, Text } from 'react-native';
import { Api, ApiOptions } from 'class/HandleApi';
import { State } from 'class/State';

type PaginatedComponentProps =
  | {
      url: string; // Full URL if search is already embedded
      limit?: number;
      searchQuery?: undefined;
      searchQueryKey?: undefined;
      renderItem: ({ item }: { item: any }) => JSX.Element;
    }
  | {
      url: string;
      limit?: number;
      searchQuery: string;
      searchQueryKey: string;
      renderItem: ({ item }: { item: any }) => JSX.Element;
    };

const PaginatedComponent = (props: PaginatedComponentProps) => {
  const token = State.getToken();
  const { url, limit = 10, renderItem } = props;

  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (pageToFetch: number) => {
    if (loading || (totalPages !== null && pageToFetch > totalPages)) return;

    setLoading(true);
    try {
      // Start building base URL
      let apiUrl = url;

      // Append search param if needed
      if ('searchQuery' in props && props.searchQuery.trim()) {
        const searchParam = `${props.searchQueryKey}=${encodeURIComponent(props.searchQuery.trim())}`;
        apiUrl += apiUrl.includes('?') ? `&${searchParam}` : `?${searchParam}`;
      }

      // Append pagination params
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

      if (pageToFetch === 1) {
        setData(newData);
      } else {
        setData((prev) => [...prev, ...newData]);
      }

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
    <FlatList
      data={data}
      keyExtractor={(item, index) => item._id || index.toString()}
      renderItem={renderItem}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loading ? <ActivityIndicator style={{ marginVertical: 16 }} /> : null}
      ListEmptyComponent={
        !loading ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: 'gray' }}>No results found.</Text>
          </View>
        ) : null
      }
    />
  );
};

export default PaginatedComponent;
