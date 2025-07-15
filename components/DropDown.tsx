import React, { useState, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

type Props = 'client' | 'employee';
const EntityDropdown = ({ type }: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const getApiUrl = (type) =>
    `https://sdce.lyzooapp.co.in:31313/api/employees/dropdownPhone?dropdownName=${type}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(getApiUrl(type));
        const json = await response.json();

        const formatted = json.data.map((entry) => ({
          label: type === 'client' ? entry.client_name : entry.name,
          value: type === 'client' ? entry.client_no : entry.employee_id,
          full: entry,
        }));

        setItems(formatted);
      } catch (error) {
        console.error('Error fetching dropdown:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  const handleSelection = (selectedValue) => {
    const selected = items.find((item) => item.value === selectedValue);
    console.log('Selected:', selected?.full);
    // Use selected.full as needed
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      <DropDownPicker
        searchable
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={(val) => {
          setValue(val);
          handleSelection(val);
        }}
        setItems={setItems}
        placeholder={`Select a ${type}`}
        searchPlaceholder="Search ${type}s..."
        style={styles.dropdown}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 50,
  },
  dropdown: {
    zIndex: 1000,
  },
});

export default EntityDropdown;
