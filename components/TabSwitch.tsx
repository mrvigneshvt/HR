// components/TabSwitcher.tsx
import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { configFile } from 'config';

interface TabSwitcherProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const isActive = tab.toLowerCase() === activeTab.toLowerCase();
        return (
          <Pressable key={index} onPress={() => onTabChange(tab)} style={styles.tab}>
            <View style={[styles.tabButton, isActive && styles.activeTab]}>
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: configFile.colorGreen,
    borderRadius: 20,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  activeTabText: {
    color: '#fff',
  },
});

export default TabSwitcher;
