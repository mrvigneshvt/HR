import { configFile } from '../config';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

type Props = {
  month: number;
  year: number;
};
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

const Pay___Slip = ({ month, year }: Props) => {
  const [dataAvailable, setDataAvailable] = useState<boolean>(true);
  console.log(month);
  const [payslipData, setPaySlipData] = useState({
    month: months[month],
    year,
    uanNo: '102137922560',
    esiNo: '5136763762',
    sNo: 1,
    date: `07.${month}.${year}`,

    attendance: {
      totalWorkingDays: 26,
      presentDays: 8,
      lossOfPay: 16,
      weekOff: 4,
      nationalFestival: 0,
      otHrs: 0,
    },

    salary: {
      fixed: {
        basic: 5880,
        da: 1402,
        hra: 1260,
        spl: 750,
        leaveWages: 791,
        bonus: 607,
        otWages: 0,
      },
      earned: {
        basic: 2262,
        da: 539,
        hra: 485,
        spl: 288,
        leaveWages: 304,
        bonus: 233,
        otWages: 0,
      },
      totalGross: {
        fixed: 10690,
        earned: 4111,
      },
    },

    deductions: {
      epf: 336,
      esic: 27,
      lwf: 0,
      total: 363,
    },

    netSalary: 3748,
  });

  useEffect(() => {
    setPaySlipData((prev) => ({
      ...payslipData,
      month: months[month - 1],
      year,
      date: `07.${month}.${year}`,
    }));
  }, [month, year]);

  console.log(payslipData.month, 'mon', payslipData.date);
  const Month = months.indexOf(payslipData.month) + 1;
  if (Month === -1) {
  }
  console.log(Month, 'isss');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>
        Pay Slip - {payslipData.month} {payslipData.year}
      </Text>
      <Text style={styles.subHeader}>
        Date: {payslipData.date} | S.NO: {payslipData.sNo}
      </Text>

      {/* Attendance */}
      <View style={styles.card}>
        <Text style={styles.title}>Attendance</Text>
        {Object.entries(payslipData.attendance).map(([label, value]) => (
          <InfoRow key={label} label={label} value={value} />
        ))}
        <InfoRow label="Total Payable Days" value={payslipData.attendance.presentDays} isBold />
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
  signature: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default Pay___Slip;
