import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { configFile } from '../config';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

type Props = {
  month: number;
  year: number;
  dataRes: Record<string, any>;
};

const Pay___Slip = ({ month, year, dataRes }: Props) => {
  const [payslipData, setPaySlipData] = useState(null);

  useEffect(() => {
    // Simulate API call here - replace with actual API fetch
    const fetchData = async () => {
      const responseData = dataRes;
      console.log(responseData, 'resssssssssssssDa');
      // {
      //   employee_id: 'SFM396',
      //   month: '2025-06',
      //   basic_salary: '2450.00',
      //   da: '600.00',
      //   hra: '520.00',
      //   pf_deduction: '360.00',
      //   esi_deduction: '34.00',
      //   total: '394.00',
      //   gross_salary: '9876.00',
      //   net_salary: '4066.00',
      //   created_at: '2025-06-20T08:22:06.000Z',
      //   payroll_id: 96,
      //   basic: '2450.00',
      //   spl_allowance: '330.00',
      //   leave_wages: '165.00',
      //   bonus: '260.00',
      //   ot_amount: '0.00',
      //   pf: '360.00',
      //   esi: '34.00',
      //   lwf: '0.00',
      //   total_deduction: '394.00',
      //   take_home: '4066.00',
      //   designation: 'HR & ADMIN',
      //   gender: 'MALE',
      //   name: 'Divakar',
      //   days_worked: 22,
      //   total_working_days: 26,
      // };

      const data = {
        month: months[month - 1],
        year,
        uanNo: '102137922560',
        esiNo: '5136763762',
        sNo: 1,
        date: `07.${month}.${year}`,

        attendance: {
          totalWorkingDays: responseData.total_working_days || 0,
          presentDays: responseData.days_worked || 0,
          lossOfPay: (responseData.total_working_days || 0) - (responseData.days_worked || 0),
          weekOff: 4,
          nationalFestival: 0,
          otHrs: parseFloat(responseData.ot_amount || '0.00'),
        },

        salary: {
          fixed: {
            basic: parseFloat(responseData.basic || '0'),
            da: parseFloat(responseData.da || '0'),
            hra: parseFloat(responseData.hra || '0'),
            spl: parseFloat(responseData.spl_allowance || '0'),
            leaveWages: parseFloat(responseData.leave_wages || '0'),
            bonus: parseFloat(responseData.bonus || '0'),
            otWages: parseFloat(responseData.ot_amount || '0'),
          },
          earned: {
            basic: parseFloat(responseData.basic || '0'),
            da: parseFloat(responseData.da || '0'),
            hra: parseFloat(responseData.hra || '0'),
            spl: parseFloat(responseData.spl_allowance || '0'),
            leaveWages: parseFloat(responseData.leave_wages || '0'),
            bonus: parseFloat(responseData.bonus || '0'),
            otWages: parseFloat(responseData.ot_amount || '0'),
          },
          totalGross: {
            fixed:
              parseFloat(responseData.basic || '0') +
              parseFloat(responseData.da || '0') +
              parseFloat(responseData.hra || '0') +
              parseFloat(responseData.spl_allowance || '0') +
              parseFloat(responseData.leave_wages || '0') +
              parseFloat(responseData.bonus || '0') +
              parseFloat(responseData.ot_amount || '0'),
            earned:
              parseFloat(responseData.basic || '0') +
              parseFloat(responseData.da || '0') +
              parseFloat(responseData.hra || '0') +
              parseFloat(responseData.spl_allowance || '0') +
              parseFloat(responseData.leave_wages || '0') +
              parseFloat(responseData.bonus || '0') +
              parseFloat(responseData.ot_amount || '0'),
          },
        },

        deductions: {
          epf: parseFloat(responseData.pf || '0.00'),
          esic: parseFloat(responseData.esi || '0.00'),
          lwf: parseFloat(responseData.lwf || '0.00'),
          total: parseFloat(responseData.total_deduction || '0.00'),
        },

        netSalary: parseFloat(responseData.take_home || '0.00'),
      };

      setPaySlipData(data);
    };

    fetchData();
  }, [month, year]);

  if (!payslipData) return <Text>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>
        Pay Slip - {payslipData.month} {payslipData.year}
      </Text>
      {/* <Text style={styles.subHeader}>
        Date: {payslipData.date} | S.NO: {payslipData.sNo}
      </Text> */}

      {/* Attendance */}
      <View style={styles.card}>
        <Text style={styles.title}>Attendance</Text>
        {Object.entries(payslipData.attendance).map(([label, value]) => (
          <InfoRow key={label} label={label} value={value} />
        ))}
      </View>

      {/* Salary */}
      <View style={styles.card}>
        <Text style={styles.title}>Salary</Text>
        {Object.entries(payslipData.salary.earned).map(([label, earned]) => (
          <InfoRow key={label} label={label.toUpperCase()} value={earned} prefix="₹" />
        ))}
        <InfoRow
          label="Total Gross"
          value={payslipData.salary.totalGross.earned}
          isBold
          prefix="₹"
        />
      </View>

      {/* Deductions */}
      <View style={styles.card}>
        <Text style={styles.title}>Deductions</Text>
        {Object.entries(payslipData.deductions)
          .filter(([label]) => label !== 'total')
          .map(([label, value]) => (
            <InfoRow key={label} label={label.toUpperCase()} value={value} prefix="₹" />
          ))}
        <InfoRow label="Total Deductions" value={payslipData.deductions.total} isBold prefix="₹" />
      </View>

      {/* Net Salary */}
      <View style={styles.card}>
        <Text style={[styles.title, { color: '#4CAF50' }]}>Net Salary</Text>
        <Text style={styles.netSalary}>₹ {payslipData.netSalary}</Text>
      </View>
    </ScrollView>
  );
};

const InfoRow = ({ label, value, isBold = false, prefix = '' }) => (
  <View style={styles.row}>
    <Text style={[styles.label, isBold && styles.bold]}>
      {label.replace(/([a-z])([A-Z])/g, '$1 $2')}
    </Text>
    <Text style={[styles.value, isBold && styles.bold]}>
      {prefix}
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
    color: '#666',
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    elevation: 2,
  },
  title: {
    color: configFile.colorGreen,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: {
    fontSize: 14,
    color: '#333',
  },
  value: {
    fontSize: 14,
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
  },
  netSalary: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Pay___Slip;
