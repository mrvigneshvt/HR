import { Dashboard } from '../Memory/DashMem';
class Plugins {
  public getSundaysInMonth(year: number, month: number): string[] {
    const sundays: string[] = [];
    const date = new Date(Date.UTC(year, month - 1, 1)); // UTC to avoid time zone shift

    while (date.getUTCMonth() === month - 1) {
      if (date.getUTCDay() === 0) {
        // 0 = Sunday
        const formatted = date.toISOString().split('T')[0]; // YYYY-MM-DD
        sundays.push(formatted);
      }
      date.setUTCDate(date.getUTCDate() + 1);
    }

    return sundays;
  }

  public getCurrentDate() {
    return new Date().toISOString().split('T')[0]; // e.g., "2025-04-11"
  }

  public isWithinRadius(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    radius: number
  ): boolean {
    const R = 6371000; // Earth's radius in meters

    const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);

    const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    // Optional debug log
    // console.log(`Distance: ${distance.toFixed(2)} meters`);

    return distance <= radius;
  }

  public createPdfFormat(uri: string) {
    return `
    <html>
      <head>
        <style>
          @page {
            size: A4;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 40px;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          img {
            width: 100%;
            height: auto;
            max-height: 1000px; /* adjust this if needed */
            object-fit: contain;
          }
        </style>
      </head>
      <body>
        <img src="${uri}" />
      </body>
    </html>
    `;
  }

  public getExampleIdDatas() {
    return [
      {
        empId: 'SFM001',
        imageUri: 'https://i.postimg.cc/VNgQQqg7/pass1.webp',
        name: 'Priyanka',
        relationName: 'D.Vinoth Raj',
        dateJoining: '18.07.2022',
        dob: '05.10.1998',
        siteName: 'Back Office',
        designation: 'Executive',
        mobile: 8807405295,
        emergencyNumber: 8428945378,
        gender: 'female',
        address: 'NO-390 J.J.NAGAR KORUKKUPET',
        aadhar: 9654567,
        pan: 'BFSAFJ678979',
        accountNo: '676578789886',
        accountIfsc: 'HDFC098987676',
        maritalStatus: 'UnMarried',
        nomineeName: 'Abibha V',
        nomineeRelation: 'Mother',
        familyMemberName: 'Vinoth Raj',
        familyMemberRelation: 'Father',
        UanNumber: 56789945678,
        EsicNumber: 45678989,
      },
      // {
      //   empId: 'SFM001',
      //   name: 'Priyanka',
      //   imageUri: 'https://ibb.co/tMfDs8jh',
      //   relationName: 'D.Vinoth Raj',
      //   dateJoining: '18.07.2022',
      //   dob: '05.10.1998',
      //   siteName: 'Back Office',
      //   designation: 'Executive',
      //   mobile: 8807405295,
      //   emergencyNumber: 8428945378,
      //   gender: 'female',
      //   address: 'NO-390 J.J.NAGAR KORUKKUPET',
      //   aadhar: 9654567,
      //   pan: 'BFSAFJ678979',
      //   accountNo: '676578789886',
      //   accountIfsc: 'HDFC098987676',
      //   maritalStatus: 'UnMarried',
      //   nomineeName: 'Abibha V',
      //   nomineeRelation: 'Mother',
      //   familyMemberName: 'Vinoth Raj',
      //   familyMemberRelation: 'Father',
      //   UanNumber: 56789945678,
      //   EsicNumber: 45678989,
      // },
    ];
  }

  public getExampleDatas(data: 'emp' | 'exe'): Dashboard {
    if (data === 'emp') {
      return {
        user: {
          details: {
            name: 'Vignesh',
            role: 'Employee',
            id: '457890',
          },
          dailyAttendance: {
            location: {
              lat: 12.950509,
              lon: 80.206029,
            },
            checkIn: false,
            checkInTime: '',
            checkOut: false,
            checkOutTime: '',
          },
          monthlyReports: {
            month: 'January',
            totalDays: 30,
            present: 20,
            absent: 1,
            late: 3,
          },
          notificationAll: [
            {
              id: 1,
              name: 'Admin',
              message: 'Coming Friday will be HOliday. Sunday will be Working Day',
              date: '21-01-25',
              clear: false,
            },
            {
              id: 2,
              name: 'Executive',
              message: 'Everyone Assemble to my OFFICE Tonight 6 PM',
              date: '22-01-25',
              clear: false,
            },
          ],
        },
      };
    } else {
      return {
        user: {
          details: {
            name: 'Vicky',
            role: 'Executive',
            id: '455890',
          },
          dailyAttendance: {
            location: {
              lat: 12.950509,
              lon: 80.206029,
            },
            checkIn: false,
            checkInTime: '',
            checkOut: false,
            checkOutTime: '',
          },
          monthlyReports: {
            month: 'January',
            totalDays: 30,
            present: 2,
            absent: 18,
            late: 0,
          },
          notificationAll: [
            {
              id: 1,
              name: 'Admin',
              message: 'Coming Friday will be HOliday. Sunday will be Working Day',
              date: '21-01-25',
              clear: false,
            },
          ],
          notificationApproval: [
            {
              name: 'raja',
              date: '19-01-2024',
              id: 1,
              empId: '456789',
              leaveReason: 'Marraige',
              from: '21-01-2024',
              to: '24-01-2024',
              approvalStatus: 'pending',
              clear: false,
            },
            {
              name: 'mahesh',
              date: '19-01-2024',
              id: 2,
              empId: '57897',
              leaveReason: 'Fever',
              from: '21-01-2024',
              to: '21-01-2024',
              approvalStatus: 'pending',
              clear: false,
            },
            {
              name: 'jahesh',
              date: '12-01-2024',
              id: 3,
              empId: '574897',
              leaveReason: 'Cold',
              from: '22-01-2024',
              to: '29-01-2024',
              approvalStatus: 'pending',
              clear: false,
            },
            {
              name: 'mahesh',
              date: '19-01-2024',
              id: 2,
              empId: '57897',
              leaveReason: 'Fever',
              from: '21-01-2024',
              to: '21-01-2024',
              approvalStatus: 'pending',
              clear: false,
            },
            {
              name: 'kahesh',
              date: '19-01-2024',
              id: 2,
              empId: '57897',
              leaveReason: 'Fever',
              from: '21-01-2024',
              to: '21-01-2024',
              approvalStatus: 'pending',
              clear: false,
            },
          ],
        },
      };
    }
  }
}

export const customPlugins = new Plugins();
