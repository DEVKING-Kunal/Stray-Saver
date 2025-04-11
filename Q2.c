#include <stdio.h>

int main() {
    int dob;
    printf("enter the dob(mmddyyyy): ");
    scanf("%d",&dob);
    int m=dob/1000000;
    int year=dob%10000;
    int a=dob/10000;
    int d=a%100;
    
   
   const char* monthName=
   (m==1)?"january":
   (m==2)?"february":
   (m==3)?"march":
   (m==4)?"april":
    (m==5)?"may":
   (m==6)?"june":
   (m==7)?"july":
   (m==8)?"august":
    (m==9)?"september":
   (m==10)?"october":
   (m==11)?"november":
   (m==12)?"december":
            "invalid";
    


  int isLeap = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);


    int date = 
        (m == 1  && d <= 31) ? d :
        (m == 2  && ((isLeap && d <= 29) || (!isLeap && d <= 28))) ? d :
        (m == 3  && d <= 31) ? d :
        (m == 4  && d <= 30) ? d :
        (m == 5  && d <= 31) ? d :
        (m == 6  && d <= 30) ? d :
        (m == 7  && d <= 31) ? d :
        (m == 8  && d <= 31) ? d :
        (m == 9  && d <= 30) ? d :
        (m == 10 && d <= 31) ? d :
        (m == 11 && d <= 30) ? d :
        (m == 12 && d <= 31) ? d :
        0;


    if (date == 0) {
        printf("Invalid date for the month %s\n", monthName);
    } else {
        printf("Date: %d\n", date);
        printf("Month: %s\n", monthName);
        printf("Year: %d\n", year);
    }




  



    return 0;
}