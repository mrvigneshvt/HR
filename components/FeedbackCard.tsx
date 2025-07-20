import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, Entypo, Feather } from '@expo/vector-icons';
import { Api } from 'class/HandleApi';
import { configFile } from 'config';

interface FeedbackCardProps {
  item: {
    id: number;
    client_id: string;
    clientName: string | null;
    companyName: string | null;
    executive_name: string;
    service_type: string;
    services_status: string;
    employee_grooming: string;
    employee_reporting: string;
    timeliness_status: string;
    inquirie: string;
    requirement: string;
    user_suggestions: string;
    ratings: number;
    created_at: string;
    update_at: string;
  };
  onDelete: () => void;
}
const FeedbackCard = ({ item, onDelete }: FeedbackCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const handleDelete = async () => {
    Alert.alert('Delete Feedback', 'Are you sure you want to delete this feedback?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            // const res = await fetch(
            //   `https://sdce.lyzooapp.co.in:31313/api/feedback/remove?id=${item.id}`,
            //   { method: 'DELETE' }
            // );
            const res = await Api.handleApi({
              url: `${configFile.api.superAdmin.app.feedback.delete}?id=${item.id}`,
              type: 'DELETE',
            });
            if (res.status < 210) {
              onDelete();
              Alert.alert('Sucess', res.data.message || 'Deleted Feedback Successfully.');
            } else {
              Alert.alert('Error', res.data.message || 'Failed to delete feedback.');
            }
          } catch {
            Alert.alert('Error', 'Something went wrong.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.clientId}>
            <FontAwesome5 name="user-tag" size={14} color="#000" /> {item.client_id}
          </Text>
          <Text style={styles.text}>
            <Ionicons name="business" size={14} color="#333" /> {item.companyName}
          </Text>
          <Text style={styles.text}>
            <Ionicons name="person-circle-outline" size={14} color="#333" /> {item.executive_name}
          </Text>
        </View>

        <TouchableOpacity onPress={handleDelete}>
          <MaterialIcons name="delete" size={22} color="red" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setExpanded(!expanded)} style={{ marginLeft: 12 }}>
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={22} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.ratingContainer}>
        <Text style={[styles.text, { marginRight: 4 }]}>Rating:</Text>
        {[...Array(5)].map((_, i) => (
          <Ionicons
            key={i}
            name={i < item.ratings ? 'star' : 'star-outline'}
            size={18}
            color="#f5c518"
          />
        ))}
      </View>
      {expanded && (
        <View style={styles.detailBlock}>
          <Text style={styles.detailText}>
            <Ionicons name="person" size={14} /> <Text style={styles.label}>Client: </Text>
            <Text style={styles.value}>{item.clientName}</Text>
          </Text>

          <Text style={styles.detailText}>
            <MaterialIcons name="miscellaneous-services" size={14} />{' '}
            <Text style={styles.label}>Service: </Text>
            <Text style={styles.value}>{item.service_type}</Text>
          </Text>

          <Text style={styles.detailText}>
            <Feather name="activity" size={14} /> <Text style={styles.label}>Status: </Text>
            <Text style={styles.value}>{item.services_status}</Text>
          </Text>

          <Text style={styles.detailText}>
            <Entypo name="emoji-happy" size={14} /> <Text style={styles.label}>Grooming: </Text>
            <Text style={styles.value}>{item.employee_grooming}</Text>
          </Text>

          <Text style={styles.detailText}>
            <MaterialIcons name="assignment-ind" size={14} />{' '}
            <Text style={styles.label}>Reporting: </Text>
            <Text style={styles.value}>{item.employee_reporting}</Text>
          </Text>

          <Text style={styles.detailText}>
            <Ionicons name="time" size={14} /> <Text style={styles.label}>Timeliness: </Text>
            <Text style={styles.value}>{item.timeliness_status}</Text>
          </Text>

          <Text style={styles.detailText}>
            <Feather name="help-circle" size={14} /> <Text style={styles.label}>Inquiry: </Text>
            <Text style={styles.value}>{item.inquirie}</Text>
          </Text>

          <Text style={styles.detailText}>
            <Feather name="package" size={14} /> <Text style={styles.label}>Requirement: </Text>
            <Text style={styles.value}>{item.requirement}</Text>
          </Text>

          <Text style={styles.detailText}>
            <MaterialIcons name="lightbulb-outline" size={14} />{' '}
            <Text style={styles.label}>Suggestions: </Text>
            <Text style={styles.value}>{item.user_suggestions}</Text>
          </Text>

          <Text style={styles.date}>
            <Ionicons name="calendar" size={12} color="#999" /> {item.created_at}
          </Text>
        </View>
      )}
    </View>
  );
};

export default FeedbackCard;

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
  },
  label: {
    fontWeight: '600',
    color: '#666',
  },
  value: {
    fontWeight: '400',
    color: '#111',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clientId: {
    fontWeight: '600',
    fontSize: 15,
    color: '#000',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 4,
  },
  detailBlock: {
    marginTop: 10,
  },
  detailText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
});
