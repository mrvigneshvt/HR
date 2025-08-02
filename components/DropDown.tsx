import { State } from 'class/State';
import { configFile } from 'config';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Keyboard,
} from 'react-native';

interface Props {
  type: 'client' | 'employee';
  setState: React.Dispatch<React.SetStateAction<Record<string, any> | string>>;
  returnFullObject?: boolean;

  // Optional UI customizations
  placeholder?: string;
  inputStyle?: TextStyle;
  containerStyle?: ViewStyle;
  listStyle?: ViewStyle;
  itemStyle?: ViewStyle;
  itemTextStyle?: TextStyle;
  selected?: string; // Selected ID (value)
}

const EntityDropdown = ({
  type,
  setState,
  returnFullObject = false,
  placeholder = 'Search...',
  inputStyle,
  containerStyle,
  listStyle,
  itemStyle,
  itemTextStyle,
  selected,
}: Props) => {
  const [query, setQuery] = useState('');
  const [allItems, setAllItems] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const getApiUrl = (type: string) => configFile.api.superAdmin.getUrl(type);
  //  `https://sdce.lyzooapp.co.in:31313/api/employees/dropdownPhone?dropdownName=${type}`; //toChange

  // Fetch data
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await fetch(getApiUrl(type));
  //       const json = await response.json();

  //       const formatted = json.data.map((entry: any) => ({
  //         label:
  //           type === 'client'
  //             ? entry.client_name || 'Unnamed Client'
  //             : entry.name || 'Unnamed Employee',
  //         value:
  //           type === 'client'
  //             ? entry.client_no?.toString() || 'N/A'
  //             : entry.employee_id?.toString() || 'N/A',
  //         full: entry,
  //       }));

  //       setAllItems(formatted);
  //       setFiltered(formatted);
  //     } catch (error) {
  //       console.error('❌ Error fetching data:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [type]);

  useEffect(() => {
    const initData = async () => {
      let cached = State.getDropdownData(type);

      if (!cached || cached.length === 0) {
        cached = await State.reloadDropdown(type);
      }

      setAllItems(cached);
      setFiltered(cached);
      setLoading(false);
    };

    initData();
  }, [type]);

  // Handle query filtering
  useEffect(() => {
    const results = allItems.filter(
      (item) =>
        item.label?.toLowerCase()?.includes(query.toLowerCase()) ||
        item.value?.toLowerCase()?.includes(query.toLowerCase())
    );
    setFiltered(results);
  }, [query]);

  // Sync external selected value
  useEffect(() => {
    if (selected && allItems.length > 0) {
      const found = allItems.find((item) => item.value === selected);
      if (found) {
        setQuery(found.label);
      }
    }
  }, [selected, allItems]);

  const handleSelect = (item: any) => {
    console.log('trgg from overl: ', item);
    setQuery(item.label);
    setFiltered([]);
    setFocused(false);
    setState(returnFullObject ? item.full : item.value);
    Keyboard.dismiss();
  };

  const handleBlur = () => {
    setTimeout(() => {
      setFocused(false);
    }, 150); // allow tap to register
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        ref={inputRef}
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={query}
        onFocus={() => setFocused(true)}
        onBlur={handleBlur}
        onChangeText={setQuery}
      />

      {focused && filtered.length > 0 && (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.value}
          style={[styles.list, listStyle]}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.item, itemStyle]} onPress={() => handleSelect(item)}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <Text style={[styles.itemText, itemTextStyle]}>
                  {type === 'client' ? 'Client Name: ' : 'Employee Name: '}
                </Text>
                <Text style={[styles.itemText, itemTextStyle]}>{item.label}</Text>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <Text style={[styles.itemText, itemTextStyle]}>ID: </Text>
                <Text style={[styles.itemText, itemTextStyle]}>{item.value}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#444',
  },
  list: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    marginTop: 6,
    maxHeight: 200,
  },
  item: {
    padding: 12,
    borderBottomColor: '#5d6060',
    borderBottomWidth: 1,
  },
  itemText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default EntityDropdown;
