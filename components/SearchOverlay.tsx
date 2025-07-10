import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import { debounce } from 'lodash';
import { Employee } from 'app/(admin)/employees';
import PaginatedComponent from './Pagination';
import { configFile } from 'config';

export interface SearchOverlayTypes {
  limit?: number;
  childCard: (data: Employee) => JSX.Element;
  for: 'employee';
}

const SearchOverlayComponent = ({ limit, childCard, for: type }: SearchOverlayTypes) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = debounce((text: string) => {
    setDebouncedQuery(text);
    setLoading(false);
  }, 500);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setShowOverlay(true);
      setLoading(true);
      handleSearch(searchQuery);
    } else {
      setShowOverlay(false);
      setDebouncedQuery('');
    }
  }, [searchQuery]);

  const getUrl = (): string => {
    if (type === 'employee') {
      return configFile.api.superAdmin.app.employeeSearch(debouncedQuery);
    }
    return '';
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search here..."
        style={styles.input}
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      {showOverlay && (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.overlay}>
            {loading ? (
              <ActivityIndicator size="large" color="#000" />
            ) : (
              <PaginatedComponent
                key={'search'}
                url={getUrl()}
                limit={limit || 10}
                renderItem={({ item }) => childCard({ item })}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

export default SearchOverlayComponent;

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
    position: 'relative',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    backgroundColor: '#fff',
  },
  overlay: {
    position: 'absolute',
    top: 50, // Below the TextInput (40 height + margin)
    left: 0,
    right: 0,
    maxHeight: 300,
    backgroundColor: '#ffffffee',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    zIndex: 999,
    padding: 8,
  },
});
