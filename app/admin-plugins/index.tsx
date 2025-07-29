import { View, Text, Pressable } from 'react-native';
import React, { useState } from 'react';
import AddEmp from 'components/AddEmp';

const index = () => {
  const [state, setState] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  //   const [newEmployee , setNewEmployee] =
  return (
    <View>
      <Pressable onPress={() => setShowAddModal(!showAddModal)}>
        <Text>Show</Text>
      </Pressable>
      <AddEmp showAddModal={showAddModal} setShowAddModal={setShowAddModal} />
    </View>
  );
};

export default index;
