import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Dimensions,
  StyleProp,
  ViewStyle,
  TextStyle,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { debounce } from 'lodash';
import { Employee } from 'app/(admin)/employees';
import PaginatedComponent from './Pagination';
import { configFile } from 'config';

const { height } = Dimensions.get('window');

export interface SearchOverlayTypes {
  limit?: number;
  childCard: (data: Employee) => JSX.Element;
  for: 'employee' | 'sqemployee';
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  overlayStyle?: StyleProp<ViewStyle>;
}

const SearchOverlayComponent = ({
  limit,
  childCard,
  for: type,
  containerStyle,
  inputStyle,
  overlayStyle,
}: SearchOverlayTypes) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(
    debounce((text: string) => {
      setDebouncedQuery(text);
      setLoading(false);
    }, 500),
    []
  );

  useEffect(() => {
    if (searchQuery.trim()) {
      setShowOverlay(true);
      setLoading(true);
      handleSearch(searchQuery);
    } else {
      setShowOverlay(false);
      setDebouncedQuery('');
    }
  }, [searchQuery]);

  const getUrl = (): string => {
    return type === 'employee'
      ? configFile.api.superAdmin.app.employeeSearch(debouncedQuery)
      : configFile.api.superAdmin.app.sqEmployeeSearch(debouncedQuery);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, containerStyle]}>
      <TextInput
        placeholder="Search here..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text.toUpperCase())}
        style={[styles.input, inputStyle]}
      />

      {showOverlay && (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.overlay, overlayStyle]}>
            {loading ? (
              <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
            ) : (
              <PaginatedComponent
                key="search"
                url={getUrl()}
                limit={limit || 10}
                renderItem={({ item }) => childCard({ item })}
                containerStyle={{ flexGrow: 1 }}
                flatListProps={{ contentContainerStyle: { paddingBottom: 100 } }}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      )}
    </KeyboardAvoidingView>
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
    fontSize: 14,
  },
  overlay: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    height: height - 100,
    backgroundColor: '#ffffffee',
    borderTopWidth: 1,
    borderColor: '#ccc',
    zIndex: 999,
    padding: 8,
    borderRadius: 12,
  },
});
