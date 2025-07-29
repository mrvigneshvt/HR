import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  TextInput,
} from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { configFile } from 'config';
import { Colors } from 'class/Colors';
import SearchOverlayComponent from 'components/SearchOverlay';
import PaginatedComponent from 'components/Pagination';
import AddEmp from 'components/AddEmp';
import EditEmp from 'components/EditEmp';
import DelEmp from 'components/DelEmp';
import { Employee } from '../employees';
import { NavRouter } from 'class/Router';
import CompanySwitch from 'components/CompanySwitch';

const Index = () => {
  const params = useLocalSearchParams();
  const isFocused = useIsFocused();
  const role = (params.role as string)?.toLowerCase() || '';
  const empId = (params.role as string)?.toLowerCase() || '';

  const company = (params.company as 'sdce' | 'sq') || 'sdce';

  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [Company, setCompany] = useState<'sdce' | 'sq'>(company);
  const [getUrl, setGetUrl] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [newEmployee, setNewEmployee] = useState({
    aadharNumber: '',
    bankNumber: '',
    bankIfsc: '',
    bankVerified: false,
    aadharVerified: false,
  });
  const [newDept, setNewDept] = useState('');

  const isReadOnly = !['superadmin', 'admin', 'executive'].includes(role);
  NavRouter.BackHandler({ role, empId, company });

  const handleApiCall = useCallback(() => {
    return Company === 'sdce'
      ? configFile.api.superAdmin.app.employees
      : configFile.api.superAdmin.app.sqEmployees;
  }, [Company]);

  useEffect(() => {
    setCompany(company);
  }, [isFocused]);

  useEffect(() => {
    const url = handleApiCall();
    setGetUrl(url);
  }, [Company, refresh]);

  useEffect(() => {
    setRefresh((prev) => prev + 1);
  }, [getUrl]);

  useEffect(() => {
    console.log('selected:', selectedEmployee);
  }, [selectedEmployee]);

  const triggerReload = () => {
    console.log('triggering reloadddddddddddddddddddddddddddddd');
    setRefresh((prev) => prev + 1);
  };
  const handleEdit = (item: Employee) => {
    const data = encodeURIComponent(JSON.stringify(item));
    console.log(data);
    router.push({
      pathname: '/(admin)/employeesV2/update',
      params: {
        data: encodeURIComponent(JSON.stringify(item)),
        role,
        empId, // ✅ direct use
        company,
      },
    });
  };

  const pushOut = () => {
    console.log('push out occurs');
    return router.replace({ pathname: '/(admin)/home', params: { empId, role, company: Company } });
  };

  const renderEmployeeCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => {
        handleEdit(item);
      }}
      key={item.employee_id}
      style={styles.card}>
      <View>
        <Text style={styles.name}>{item?.name || 'Not Assigned'}</Text>
        <Text style={styles.sub}>ID: {item.employee_id}</Text>
        {role === 'superadmin' && <Text style={styles.sub}>Role: {item.role}</Text>}
        <Text style={styles.sub}>Department: {item.department}</Text>
      </View>

      {!isReadOnly && (
        <View style={styles.iconGroup}>
          {/* <Pressable
            onPress={() => {
              setSelectedEmployee(item);
              setShowEditModal(true);
            }}>
            <MaterialIcons name="edit" size={20} color="#4A90E2" />
          </Pressable> */}
          {
            <Pressable
              onPress={() => {
                setSelectedEmployee(item);
                setShowDeleteModal(true);
              }}>
              <MaterialIcons name="delete" size={20} color="#FF6B6B" />
            </Pressable>
          }
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Employees',
          headerStyle: { backgroundColor: configFile.colorGreen },
          headerTintColor: 'white',
          headerRight: () => (
            <View style={styles.headerRight}>
              {!isReadOnly && (
                <>
                  {/* <RenderSwitchIcon /> */}
                  <TouchableOpacity onPress={() => setShowAddModal(true)} style={styles.addButton}>
                    <Text style={{ color: configFile.colorGreen }}>Add</Text>
                    <MaterialIcons name="add" size={24} color={configFile.colorGreen} />
                  </TouchableOpacity>
                </>
              )}
            </View>
          ),
        }}
      />

      <SafeAreaView style={[styles.container, { backgroundColor: Colors.get(Company, 'bg') }]}>
        <SearchOverlayComponent
          limit={5}
          childCard={renderEmployeeCard}
          for={Company === 'sdce' ? 'employee' : 'sqemployee'}
          containerStyle={{ marginBottom: 10 }}
          overlayStyle={{ backgroundColor: Colors.get(Company, 'bg') }}
          inputStyle={{ color: 'black' }}
        />

        {getUrl ? (
          <PaginatedComponent
            url={getUrl}
            key={refresh}
            limit={10}
            renderItem={({ item }) => renderEmployeeCard({ item })}
            containerStyle={{ flex: 1 }}
            flatListProps={{
              contentContainerStyle: { paddingBottom: 50 },
            }}
          />
        ) : (
          <ActivityIndicator color={'white'} />
        )}
      </SafeAreaView>

      {showAddModal && (
        <AddEmp
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          onSave={() => {
            // setRefresh((prev) => prev + 1);
            pushOut();
          }}
        />
      )}
      {showEditModal && (
        <EditEmp
          employeeData={selectedEmployee}
          setShowEditModal={(val) => {
            setShowEditModal(val);
            if (!val) {
              // modal just closed, now refresh list
              triggerReload();
            }
          }}
          setSelectedEmployee={setSelectedEmployee}
          showEditModal={showEditModal}
          setReload={() => {}} // not needed anymore
          onSaveSuccess={() => {}}
        />
      )}

      {showDeleteModal && (
        <DelEmp
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
          onSave={() => {
            // setRefresh((prev) => prev + 1);
            pushOut();
          }}
        />
      )}
    </>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: configFile.colorGreen,
  },
  sub: {
    color: 'gray',
  },
  iconGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginRight: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 4,
  },
});

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'black',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    color: '#000',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#ccc',
    borderRadius: 6,
    marginRight: 8,
  },
  submitButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
});
